import { useRef, useState, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import BackButton from '../common/BackButton';
import {
  Upload, Image as ImageIcon, X, Download, Trash2, Zap, Loader2,
  Check, FileImage, HardDriveDownload, Sparkles
} from 'lucide-react';

interface CompItem {
  id: string;
  file: File;
  url: string;       // object URL for thumbnail
  name: string;
  width: number;
  height: number;
  size: number;      // original bytes
  status: 'ready' | 'processing' | 'done' | 'error' | 'skipped';
  result?: {
    blob: Blob;
    size: number;
    quality: number;
    width: number;
    height: number;
  };
  error?: string;
}

const MB = 1024 * 1024;
const TARGET_PRESETS = [0.25, 0.5, 1, 2, 5];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < MB) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / MB).toFixed(2) + ' MB';
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

async function loadImage(file: File): Promise<{ img: ImageBitmap | HTMLImageElement; width: number; height: number }> {
  try {
    const bitmap = await createImageBitmap(file);
    return { img: bitmap, width: bitmap.width, height: bitmap.height };
  } catch {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => { resolve({ img: image, width: image.naturalWidth, height: image.naturalHeight }); };
      image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load failed')); };
      image.src = url;
    });
  }
}

async function canvasToBlob(canvas: HTMLCanvasElement, format: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('encode failed'))), format, quality);
  });
}

/**
 * Compress an image file to fit under targetMB (per image).
 * Binary-searches JPEG/WebP quality, downscaling if needed.
 */
async function compressToTarget(
  file: File,
  targetMB: number,
  format: 'image/jpeg' | 'image/webp'
): Promise<{ blob: Blob; quality: number; width: number; height: number; size: number }> {
  const targetBytes = targetMB * MB;
  const { img, width, height } = await loadImage(file);

  const MAX_DIM = 8000;
  let baseW = width;
  let baseH = height;
  if (Math.max(baseW, baseH) > MAX_DIM) {
    const r = MAX_DIM / Math.max(baseW, baseH);
    baseW = Math.round(baseW * r);
    baseH = Math.round(baseH * r);
  }

  const render = (scale: number, quality: number): Promise<Blob> => {
    const w = Math.max(2, Math.round(baseW * scale));
    const h = Math.max(2, Math.round(baseH * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return Promise.reject(new Error('canvas unsupported'));
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img as any, 0, 0, w, h);
    return canvasToBlob(canvas, format, quality);
  };

  let scale = 1;
  let best: { blob: Blob; quality: number; width: number; height: number; size: number } | null = null;

  while (scale >= 0.08) {
    // binary search for the highest quality that fits under target
    let lo = 0.02, hi = 0.95, found: Blob | null = null, foundQ = 0;
    for (let i = 0; i < 8; i++) {
      const mid = (lo + hi) / 2;
      const blob = await render(scale, mid);
      if (blob.size <= targetBytes) {
        found = blob;
        foundQ = mid;
        lo = mid; // try higher quality
      } else {
        hi = mid; // too big
      }
    }
    if (found) {
      const w = Math.max(2, Math.round(baseW * scale));
      const h = Math.max(2, Math.round(baseH * scale));
      best = { blob: found, quality: foundQ, width: w, height: h, size: found.size };
      // try to go bigger (better quality) at a higher scale if still roomy
      const bigger = await render(Math.min(1, scale * 1.3), foundQ);
      if (bigger.size <= targetBytes) {
        best = { blob: bigger, quality: foundQ, width: Math.max(2, Math.round(baseW * Math.min(1, scale * 1.3))), height: Math.max(2, Math.round(baseH * Math.min(1, scale * 1.3))), size: bigger.size };
        scale = Math.min(1, scale * 1.3);
        // keep scaling up while under target
        while (scale < 1) {
          const nextScale = Math.min(1, scale * 1.3);
          const nb = await render(nextScale, foundQ);
          if (nb.size <= targetBytes) { best = { blob: nb, quality: foundQ, width: Math.max(2, Math.round(baseW * nextScale)), height: Math.max(2, Math.round(baseH * nextScale)), size: nb.size }; scale = nextScale; }
          else break;
        }
      }
      return best;
    }
    scale *= 0.7;
  }

  // absolute fallback — smallest possible
  const fb = await render(0.1, 0.05);
  return { blob: fb, quality: 0.05, width: Math.max(2, Math.round(baseW * 0.1)), height: Math.max(2, Math.round(baseH * 0.1)), size: fb.size };
}

export default function Compressor() {
  const { setView } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<CompItem[]>([]);
  const [targetMB, setTargetMB] = useState<number>(1);
  const [customMB, setCustomMB] = useState<string>('');
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: '' });
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const imgs = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imgs.length === 0) return;
    const newItems: CompItem[] = [];
    for (const file of imgs) {
      const url = URL.createObjectURL(file);
      let width = 0, height = 0;
      try {
        const loaded = await loadImage(file);
        width = loaded.width;
        height = loaded.height;
      } catch { /* dims unknown */ }
      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file, url, name: file.name, width, height, size: file.size, status: 'ready',
      });
    }
    setItems(prev => [...prev, ...newItems]);
  }, []);

  const removeItem = (id: string) => {
    setItems(prev => {
      const it = prev.find(i => i.id === id);
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter(i => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach(i => URL.revokeObjectURL(i.url));
    setItems([]);
  };

  const effectiveTarget = customMB !== '' ? parseFloat(customMB) : targetMB;

  const compressAll = async () => {
    const pending = items.filter(i => i.status === 'ready' || i.status === 'error');
    if (pending.length === 0 || processing) return;
    if (!isFinite(effectiveTarget) || effectiveTarget <= 0) { alert('Valid target size daalo (MB me)'); return; }

    setProcessing(true);
    const total = pending.length;
    let done = 0;

    const runItem = async (item: CompItem) => {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'processing' } : i));
      setProgress({ done, total, current: item.name });
      try {
        // Already under target? keep original
        if (item.file.size <= effectiveTarget * MB) {
          setItems(prev => prev.map(i => i.id === item.id ? {
            ...i, status: 'done',
            result: { blob: item.file, size: item.file.size, quality: 1, width: item.width, height: item.height }
          } : i));
        } else {
          const res = await compressToTarget(item.file, effectiveTarget, format);
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done', result: res } : i));
        }
      } catch (e) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: (e as Error).message } : i));
      }
      done++;
      setProgress({ done, total, current: '' });
    };

    // process sequentially to keep memory stable
    for (const item of pending) {
      await runItem(item);
    }
    setProcessing(false);
  };

  const downloadItem = (item: CompItem) => {
    if (!item.result) return;
    const ext = format === 'image/webp' ? 'webp' : 'jpg';
    const base = item.name.replace(/\.[^.]+$/, '');
    downloadBlob(item.result.blob, `${base}-compressed.${ext}`);
  };

  const downloadAll = () => {
    const done = items.filter(i => i.status === 'done' && i.result);
    if (done.length === 0) return;
    done.forEach((item, idx) => {
      setTimeout(() => downloadItem(item), idx * 400);
    });
  };

  const totalOriginal = items.reduce((a, i) => a + i.size, 0);
  const totalCompressed = items.reduce((a, i) => a + (i.result?.size ?? i.size), 0);
  const saved = totalOriginal - totalCompressed;
  const doneCount = items.filter(i => i.status === 'done').length;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-3 sm:px-6 border-b flex-shrink-0"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <BackButton />
          <div className="w-px h-6 hidden sm:block" style={{ background: 'var(--border)' }} />
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00d9c0, #00b8a3)' }}>
            <FileImage size={16} className="text-black" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Image Compressor</div>
            <div className="text-[10px] text-gray-500 hidden sm:block">Bulk compress — target size in MB</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost text-xs h-8" onClick={() => setView('editor')}>
            <Zap size={14} /> Open Editor
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings sidebar */}
        <div className="w-72 flex-shrink-0 border-r p-4 overflow-y-auto hidden md:block"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <SettingsPanel
            targetMB={targetMB} setTargetMB={setTargetMB}
            customMB={customMB} setCustomMB={setCustomMB}
            format={format} setFormat={setFormat}
            itemsCount={items.length}
            totalOriginal={totalOriginal} totalCompressed={totalCompressed} saved={saved}
            doneCount={doneCount}
          />
        </div>

        {/* Main area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
            {/* Mobile settings (collapsible-lite) */}
            <div className="md:hidden rounded-xl border p-3" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
              <SettingsPanel
                targetMB={targetMB} setTargetMB={setTargetMB}
                customMB={customMB} setCustomMB={setCustomMB}
                format={format} setFormat={setFormat}
                itemsCount={items.length}
                totalOriginal={totalOriginal} totalCompressed={totalCompressed} saved={saved}
                doneCount={doneCount}
              />
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
                dragging ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)] hover:border-[var(--border-light)]'
              }`}
              style={{ background: 'var(--bg-secondary)' }}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => e.target.files && addFiles(e.target.files)} />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(0,217,192,0.12)', color: 'var(--accent)' }}>
                <Upload size={24} />
              </div>
              <div className="font-semibold text-sm sm:text-base">Images yahan drop karo</div>
              <div className="text-xs text-gray-500 mt-1">ya click karke choose karo — jitni chaaho utni, sab ek saath</div>
              <div className="text-[10px] text-gray-600 mt-3">JPG • PNG • WEBP • GIF (first frame) — browser me hi compress hota hai, kuch upload nahi hota</div>
            </div>

            {/* Stats strip */}
            {items.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 text-xs rounded-xl px-4 py-3"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <span className="text-gray-400">{items.length} images</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Original: <b className="text-white">{formatBytes(totalOriginal)}</b></span>
                {doneCount > 0 && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">Compressed: <b className="text-[var(--accent)]">{formatBytes(totalCompressed)}</b></span>
                    <span className="text-gray-600">•</span>
                    <span className="text-green-400">Saved {formatBytes(saved)} ({totalOriginal ? Math.round((saved / totalOriginal) * 100) : 0}%)</span>
                  </>
                )}
              </div>
            )}

            {/* Progress */}
            {processing && (
              <div className="rounded-xl px-4 py-3 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400">Compressing… {progress.current}</span>
                  <span className="text-gray-500">{progress.done}/{progress.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                  <div className="h-full bg-[var(--accent)] transition-all duration-200"
                    style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} />
                </div>
              </div>
            )}

            {/* Image list */}
            {items.length > 0 && (
              <div className="space-y-2">
                {items.map(item => {
                  const pct = item.result ? Math.round((1 - item.result.size / item.size) * 100) : 0;
                  return (
                    <div key={item.id} className="flex items-center gap-3 rounded-xl p-2.5 border"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'var(--bg-elevated)' }}>
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{item.name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {item.width}×{item.height} • {formatBytes(item.size)}
                          {item.result && item.status === 'done' && (
                            <>
                              {' → '}
                              <span className="text-[var(--accent)]">{formatBytes(item.result.size)}</span>
                              <span className="text-green-400"> ({pct}% {pct >= 0 ? 'smaller' : 'bigger'})</span>
                            </>
                          )}
                          {item.status === 'skipped' && <span className="text-gray-400"> • already under target</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {item.status === 'processing' && <Loader2 size={16} className="animate-spin text-[var(--accent)]" />}
                        {item.status === 'done' && <Check size={16} className="text-green-400" />}
                        {item.status === 'error' && <span className="text-[10px] text-red-400" title={item.error}>Error</span>}
                        {item.status === 'done' && item.result && (
                          <button className="tool-btn w-8 h-8" title="Download" onClick={() => downloadItem(item)}>
                            <Download size={15} className="text-[var(--accent)]" />
                          </button>
                        )}
                        <button className="tool-btn w-8 h-8" title="Remove" onClick={() => removeItem(item.id)}>
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      {items.length > 0 && (
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-t flex-shrink-0 gap-3"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles size={14} className="text-[var(--accent)]" />
            <span className="hidden sm:inline">100% private — images browser se bahar nahi jaati</span>
          </div>
          <div className="flex items-center gap-2">
            {items.some(i => i.status === 'done') && (
              <button className="btn btn-secondary text-xs h-9 px-3" onClick={downloadAll}>
                <HardDriveDownload size={14} /> Download All
              </button>
            )}
            <button className="btn btn-ghost text-xs h-9 px-3" onClick={clearAll}>
              <Trash2 size={14} /> Clear
            </button>
            <button
              className="btn btn-primary text-xs h-9 px-4"
              onClick={compressAll}
              disabled={processing || items.length === 0}
            >
              {processing ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
              {processing ? 'Compressing…' : `Compress to ${effectiveTarget} MB`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ targetMB, setTargetMB, customMB, setCustomMB, format, setFormat, itemsCount, totalOriginal, totalCompressed, saved, doneCount }: {
  targetMB: number; setTargetMB: (n: number) => void;
  customMB: string; setCustomMB: (s: string) => void;
  format: 'image/jpeg' | 'image/webp'; setFormat: (f: 'image/jpeg' | 'image/webp') => void;
  itemsCount: number; totalOriginal: number; totalCompressed: number; saved: number; doneCount: number;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Target size (per image)</div>
        <div className="grid grid-cols-3 gap-1.5">
          {TARGET_PRESETS.map(p => (
            <button key={p}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${customMB === '' && targetMB === p ? 'bg-[var(--accent)] text-black' : 'bg-[var(--bg-tertiary)] text-gray-300 hover:bg-[var(--bg-hover)]'}`}
              onClick={() => { setTargetMB(p); setCustomMB(''); }}>
              {p} MB
            </button>
          ))}
        </div>
        <input
          type="number" min="0.05" step="0.05" placeholder="Custom MB…" value={customMB}
          onChange={e => setCustomMB(e.target.value)}
          className="input w-full mt-2 text-xs"
        />
        <p className="text-[10px] text-gray-600 mt-1.5">Har image ko is size ke andar laaya jayega. Pehle se chhoti images waise hi reh jaati hain.</p>
      </div>

      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</div>
        <div className="flex gap-1.5">
          <button className={`flex-1 py-2 rounded-lg text-xs font-medium ${format === 'image/jpeg' ? 'bg-[var(--accent)] text-black' : 'bg-[var(--bg-tertiary)] text-gray-300'}`}
            onClick={() => setFormat('image/jpeg')}>JPG</button>
          <button className={`flex-1 py-2 rounded-lg text-xs font-medium ${format === 'image/webp' ? 'bg-[var(--accent)] text-black' : 'bg-[var(--bg-tertiary)] text-gray-300'}`}
            onClick={() => setFormat('image/webp')}>WebP</button>
        </div>
        <p className="text-[10px] text-gray-600 mt-1.5">WebP = chhota size, same quality. JPG = har jagah chalta hai.</p>
      </div>

      <div className="rounded-xl border p-3 space-y-2" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Summary</div>
        <div className="flex justify-between text-xs"><span className="text-gray-400">Images</span><span>{itemsCount}</span></div>
        <div className="flex justify-between text-xs"><span className="text-gray-400">Original</span><span>{formatBytes(totalOriginal)}</span></div>
        {doneCount > 0 && (
          <>
            <div className="flex justify-between text-xs"><span className="text-gray-400">Compressed</span><span className="text-[var(--accent)]">{formatBytes(totalCompressed)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-gray-400">Saved</span><span className="text-green-400">{formatBytes(saved)}</span></div>
          </>
        )}
      </div>
    </div>
  );
}
