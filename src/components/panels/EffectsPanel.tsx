import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { chromaKeyImage } from '../../lib/vfx';
import { Sparkles, ChevronDown, ChevronRight, Wand2, Loader2, Check } from 'lucide-react';

const effectCategories = [
  {
    name: 'Basic',
    effects: [
      { id: 'blur', name: 'Blur', defaultIntensity: 50 },
      { id: 'sharpen', name: 'Sharpen', defaultIntensity: 50 },
      { id: 'glow', name: 'Glow', defaultIntensity: 30 },
      { id: 'shadow', name: 'Shadow', defaultIntensity: 50 },
      { id: 'noise', name: 'Noise', defaultIntensity: 20 },
      { id: 'grain', name: 'Grain', defaultIntensity: 30 },
      { id: 'vignette', name: 'Vignette', defaultIntensity: 50 },
    ]
  },
  {
    name: 'Cinematic',
    effects: [
      { id: 'film', name: 'Film Look', defaultIntensity: 60 },
      { id: 'cinematic', name: 'Cinematic', defaultIntensity: 50 },
      { id: 'hdr', name: 'HDR', defaultIntensity: 40 },
      { id: 'tealOrange', name: 'Teal & Orange', defaultIntensity: 50 },
      { id: 'filmGrain', name: 'Film Grain', defaultIntensity: 30 },
      { id: 'lightLeaks', name: 'Light Leaks', defaultIntensity: 40 },
    ]
  },
  {
    name: 'Retro',
    effects: [
      { id: 'vhs', name: 'VHS', defaultIntensity: 60 },
      { id: 'retroTv', name: 'Retro TV', defaultIntensity: 50 },
      { id: 'oldFilm', name: 'Old Film', defaultIntensity: 50 },
      { id: 'rgbSplit', name: 'RGB Split', defaultIntensity: 30 },
      { id: 'scanlines', name: 'Scanlines', defaultIntensity: 40 },
    ]
  },
];

// CapCut-style animated VFX
const vfxEffects = [
  { id: 'glitch', name: 'Glitch', defaultIntensity: 50, desc: 'Digital glitch slices' },
  { id: 'shake', name: 'Shake', defaultIntensity: 50, desc: 'Handheld camera shake' },
  { id: 'kenburns', name: '3D Zoom', defaultIntensity: 50, desc: 'Slow cinematic push-in' },
  { id: 'flash', name: 'Flash', defaultIntensity: 50, desc: 'Rapid flicker' },
  { id: 'zoomblur', name: 'Zoom Blur', defaultIntensity: 50, desc: 'Pulsing motion blur' },
  { id: 'rgbsplit', name: 'RGB Split', defaultIntensity: 40, desc: 'Color channel drift' },
];

export default function EffectsPanel() {
  const { selectedLayerId, layers, addFilter, removeFilter, updateFilter, updateLayer } = useStore();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ Basic: true });
  const [activeEffects, setActiveEffects] = useState<Record<string, boolean>>({});

  // Chroma key state
  const [keyColor, setKeyColor] = useState<'green' | 'blue' | 'red'>('green');
  const [keySens, setKeySens] = useState(60);
  const [keySmooth, setKeySmooth] = useState(40);
  const [keyBusy, setKeyBusy] = useState(false);
  const [keyDone, setKeyDone] = useState(false);

  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const isEffectOn = (effectId: string) => {
    return !!selectedLayer?.filters?.find(f => f.type === effectId && f.enabled);
  };

  const toggleEffect = (effectId: string, defaultIntensity: number) => {
    if (!selectedLayerId) return;
    const existing = selectedLayer?.filters?.find(f => f.type === effectId);
    if (existing) {
      removeFilter(selectedLayerId, existing.id);
      setActiveEffects(prev => ({ ...prev, [effectId]: false }));
    } else {
      addFilter(selectedLayerId, {
        id: `${effectId}-${Date.now()}`,
        type: effectId as any,
        intensity: defaultIntensity,
        enabled: true,
      });
      setActiveEffects(prev => ({ ...prev, [effectId]: true }));
    }
  };

  const setEffectIntensity = (effectId: string, value: number) => {
    if (!selectedLayerId) return;
    const existing = selectedLayer?.filters?.find(f => f.type === effectId);
    if (existing) {
      updateFilter(selectedLayerId, existing.id, { intensity: value });
    }
  };

  const applyChromaKey = async () => {
    if (!selectedLayer?.src) return;
    setKeyBusy(true);
    setKeyDone(false);
    try {
      const processed = await chromaKeyImage(selectedLayer.src, { color: keyColor, sensitivity: keySens, smooth: keySmooth });
      updateLayer(selectedLayer.id, { src: processed });
      // mark the effect applied (badge only)
      const existing = selectedLayer.filters?.find(f => f.type === 'chromaKey');
      if (!existing) {
        addFilter(selectedLayer.id, { id: `chromaKey-${Date.now()}`, type: 'chromaKey', intensity: keySens, enabled: true });
      }
      setKeyDone(true);
      setTimeout(() => setKeyDone(false), 2000);
    } catch (e) {
      console.error('Chroma key failed', e);
      alert('Chroma key failed: ' + (e as Error).message);
    } finally {
      setKeyBusy(false);
    }
  };

  return (
    <div className="p-3">
      <div className="panel-header mb-3 -mx-3 -mt-3 px-3">
        <span>Effects</span>
      </div>

      {!selectedLayerId ? (
        <div className="text-center py-8">
          <Sparkles size={24} className="mx-auto mb-2 text-gray-600" />
          <p className="text-xs text-gray-500">Select a layer to add effects</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ===== CapCut VFX ===== */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wand2 size={12} className="text-[var(--accent)]" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">CapCut VFX</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {vfxEffects.map(effect => {
                const on = isEffectOn(effect.id);
                return (
                  <div key={effect.id}
                    className={`p-2 rounded-lg cursor-pointer border transition-all ${on ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)]'}`}
                    onClick={() => toggleEffect(effect.id, effect.defaultIntensity)}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[11px] font-medium ${on ? 'text-[var(--accent)]' : 'text-gray-300'}`}>{effect.name}</span>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${on ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-gray-600'}`}>
                        {on && <Check size={9} className="text-black" />}
                      </div>
                    </div>
                    <div className="text-[9px] text-gray-600 leading-tight">{effect.desc}</div>
                    {on && (
                      <input
                        type="range" min="1" max="100" defaultValue={effect.defaultIntensity}
                        className="slider w-full mt-1.5"
                        onClick={e => e.stopPropagation()}
                        onChange={e => { e.stopPropagation(); setEffectIntensity(effect.id, Number(e.target.value)); }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== Chroma Key ===== */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-2.5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-[var(--accent)]" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Chroma Key (Green Screen)</span>
            </div>
            {selectedLayer?.type === 'image' && selectedLayer?.src ? (
              <>
                <div className="flex gap-1 mb-2">
                  {(['green', 'blue', 'red'] as const).map(c => (
                    <button key={c}
                      className={`flex-1 py-1.5 rounded text-[10px] capitalize transition-all ${keyColor === c ? 'bg-[var(--accent)] text-black font-semibold' : 'bg-[var(--bg-elevated)] text-gray-400 hover:text-white'}`}
                      onClick={() => setKeyColor(c)}>
                      {c}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>Sensitivity</span><span>{keySens}</span></div>
                    <input type="range" min="1" max="100" value={keySens} onChange={e => setKeySens(Number(e.target.value))} className="slider w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1"><span>Smooth / Spill</span><span>{keySmooth}</span></div>
                    <input type="range" min="0" max="100" value={keySmooth} onChange={e => setKeySmooth(Number(e.target.value))} className="slider w-full" />
                  </div>
                  <button className="btn btn-primary w-full h-7 text-xs" onClick={applyChromaKey} disabled={keyBusy}>
                    {keyBusy ? <Loader2 size={13} className="animate-spin" /> : keyDone ? <Check size={13} /> : <Wand2 size={13} />}
                    {keyBusy ? 'Removing...' : keyDone ? 'Done!' : 'Remove Background'}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[10px] text-gray-600">Select an image layer to use green screen removal.</p>
            )}
          </div>

          {/* ===== Static effect categories ===== */}
          <div className="space-y-1">
            {effectCategories.map(category => (
              <div key={category.name}>
                <button
                  className="w-full flex items-center gap-2 py-1.5 px-1 rounded text-xs font-medium text-gray-400 hover:text-white transition-colors"
                  onClick={() => toggleCategory(category.name)}
                >
                  {expandedCategories[category.name] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  {category.name}
                  <span className="text-[10px] text-gray-600 ml-auto">{category.effects.length}</span>
                </button>

                {expandedCategories[category.name] && (
                  <div className="ml-3 space-y-0.5">
                    {category.effects.map(effect => {
                      const on = isEffectOn(effect.id);
                      return (
                        <div
                          key={effect.id}
                          className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
                          onClick={() => toggleEffect(effect.id, effect.defaultIntensity)}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${on ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-gray-600'}`}>
                            {on && <div className="w-2 h-2 bg-black rounded-sm" />}
                          </div>
                          <span className="text-xs flex-1">{effect.name}</span>
                          {on && (
                            <input
                              type="range" min="0" max="100" defaultValue={effect.defaultIntensity}
                              className="slider w-16"
                              onClick={e => e.stopPropagation()}
                              onChange={e => { e.stopPropagation(); setEffectIntensity(effect.id, Number(e.target.value)); }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
