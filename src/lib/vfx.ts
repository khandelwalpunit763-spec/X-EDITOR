import type { Filter } from '../types';

/**
 * Map a filter type + intensity to a real CSS filter string.
 * Intensity range depends on the filter (see FiltersPanel).
 */
export function filterToCss(type: string, intensity: number): string | null {
  const v = intensity;
  switch (type) {
    // ---- Basic adjustments (-100..100) ----
    case 'brightness': return `brightness(${(100 + v) / 100})`;
    case 'contrast': return `contrast(${(100 + v) / 100})`;
    case 'exposure': return `brightness(${(100 + v * 1.1) / 100})`;
    case 'saturation': return `saturate(${(100 + v) / 100})`;
    case 'vibrance': return `saturate(${(100 + v * 0.6) / 100}) contrast(${(100 + v * 0.2) / 100})`;
    case 'temperature':
      return v >= 0
        ? `sepia(${(v / 100) * 0.4}) saturate(1.1)`
        : `hue-rotate(${(-v / 100) * 12}deg) saturate(0.9)`;
    case 'tint': return `hue-rotate(${(v / 100) * 24}deg)`;
    case 'highlights': return `brightness(${(100 + v * 0.5) / 100})`;
    case 'shadows': return `contrast(${(100 + v * 0.4) / 100}) brightness(${(100 - v * 0.2) / 100})`;
    case 'whites': return `brightness(${(100 + v * 0.7) / 100}) contrast(${(100 + v * 0.2) / 100})`;
    case 'blacks': return `contrast(${(100 + v * 0.4) / 100}) brightness(${(100 + v * 0.4) / 100})`;
    case 'hue': return `hue-rotate(${v}deg)`;
    // ---- Blur / sharpen ----
    case 'blur': return `blur(${(v / 100) * 8}px)`;
    case 'gaussianBlur': return `blur(${(v / 100) * 12}px)`;
    case 'motionBlur': return `blur(${(v / 100) * 6}px) contrast(1.05)`;
    case 'sharpen': return `contrast(${(100 + v * 0.6) / 100}) saturate(${(100 + v * 0.4) / 100})`;
    // ---- Presets ----
    case 'grayscale': return `grayscale(${v / 100})`;
    case 'vintage': return `sepia(0.4) contrast(1.1) brightness(0.9)`;
    case 'cinematic': return `contrast(1.3) saturate(1.2) brightness(0.95)`;
    case 'warm': return `sepia(0.3) saturate(1.4)`;
    case 'cool': return `saturate(0.8) hue-rotate(15deg)`;
    case 'blackAndWhite': return `grayscale(1) contrast(1.1)`;
    case 'hdr': return `contrast(1.25) saturate(1.35) brightness(1.02)`;
    case 'tealOrange': return `contrast(1.2) saturate(1.4) sepia(0.15) hue-rotate(-10deg)`;
    case 'film': return `contrast(1.1) saturate(0.9) sepia(0.15) brightness(1.02)`;
    default: return null;
  }
}

/** Effects that are rendered as an animation class rather than a static filter. */
const ANIMATION_EFFECTS: Record<string, string> = {
  glitch: 'vfx-glitch',
  shake: 'vfx-shake',
  kenburns: 'vfx-kenburns',
  threeDZoom: 'vfx-kenburns',
  flash: 'vfx-flash',
  zoomblur: 'vfx-zoomblur',
  rgbsplit: 'vfx-rgbsplit',
};

export function isAnimationEffect(type: string): boolean {
  return type in ANIMATION_EFFECTS;
}

export function effectClass(type: string): string | null {
  return ANIMATION_EFFECTS[type] ?? null;
}

/** Overlay effects (vignette / grain) that need an extra DOM node. */
export function isOverlayEffect(type: string): boolean {
  return type === 'vignette' || type === 'grain' || type === 'noise';
}

/**
 * Build the combined CSS filter string from a layer's filters.
 */
export function buildFilterCss(filters: Filter[] | undefined): string {
  if (!filters || filters.length === 0) return 'none';
  const parts: string[] = [];
  for (const f of filters) {
    if (!f.enabled || isAnimationEffect(f.type) || isOverlayEffect(f.type)) continue;
    const css = filterToCss(f.type, f.intensity);
    if (css) parts.push(css);
  }
  return parts.length ? parts.join(' ') : 'none';
}

/**
 * Extract animation classes + static filters for a set of filters.
 */
export function analyzeFilters(filters: Filter[] | undefined) {
  const animClasses: string[] = [];
  const overlays: { type: string; intensity: number }[] = [];
  const staticFilters: Filter[] = [];
  for (const f of filters || []) {
    if (!f.enabled) continue;
    if (isAnimationEffect(f.type)) {
      const cls = effectClass(f.type);
      if (cls && !animClasses.includes(cls)) animClasses.push(cls);
    } else if (isOverlayEffect(f.type)) {
      overlays.push({ type: f.type, intensity: f.intensity });
    } else {
      staticFilters.push(f);
    }
  }
  return { animClasses, overlays, staticFilters };
}

/**
 * Chroma Key — remove a green/blue screen background from an image.
 * Runs on a canvas; returns a data URL with the keyed-out pixels transparent.
 */
export interface ChromaKeyOptions {
  color: 'green' | 'blue' | 'red';
  sensitivity: number; // 0..100
  smooth: number; // 0..100 (feathering / spill suppression)
}

export function chromaKeyImage(src: string, opts: ChromaKeyOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const sens = opts.sensitivity / 100; // 0..1 how aggressive
        const spill = opts.smooth / 100;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          let key = false;
          if (opts.color === 'green') {
            key = g > 60 && g > r * (1.25 - sens * 0.9) && g > b * (1.25 - sens * 0.9) && (g - Math.max(r, b)) > (20 + (1 - sens) * 40);
          } else if (opts.color === 'blue') {
            key = b > 60 && b > r * (1.25 - sens * 0.9) && b > g * (1.25 - sens * 0.9) && (b - Math.max(r, g)) > (20 + (1 - sens) * 40);
          } else {
            key = r > 60 && r > g * (1.25 - sens * 0.9) && r > b * (1.25 - sens * 0.9) && (r - Math.max(g, b)) > (20 + (1 - sens) * 40);
          }
          if (key) {
            data[i + 3] = 0;
          } else if (spill > 0 && opts.color !== 'red') {
            // Basic green/blue spill suppression
            if (opts.color === 'green') {
              const spillAmt = Math.max(0, g - Math.max(r, b));
              if (spillAmt > 0) {
                const fix = spillAmt * spill;
                data[i + 1] = Math.min(255, g - fix);
              }
            } else {
              const spillAmt = Math.max(0, b - Math.max(r, g));
              if (spillAmt > 0) {
                const fix = spillAmt * spill;
                data[i + 2] = Math.min(255, b - fix);
              }
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e as Error);
      }
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}
