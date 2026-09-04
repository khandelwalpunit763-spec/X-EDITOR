import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { RotateCcw } from 'lucide-react';

const adjustments = [
  { id: 'brightness', name: 'Brightness', min: -100, max: 100, default: 0 },
  { id: 'contrast', name: 'Contrast', min: -100, max: 100, default: 0 },
  { id: 'exposure', name: 'Exposure', min: -100, max: 100, default: 0 },
  { id: 'saturation', name: 'Saturation', min: -100, max: 100, default: 0 },
  { id: 'vibrance', name: 'Vibrance', min: -100, max: 100, default: 0 },
  { id: 'temperature', name: 'Temperature', min: -100, max: 100, default: 0 },
  { id: 'tint', name: 'Tint', min: -100, max: 100, default: 0 },
  { id: 'highlights', name: 'Highlights', min: -100, max: 100, default: 0 },
  { id: 'shadows', name: 'Shadows', min: -100, max: 100, default: 0 },
  { id: 'whites', name: 'Whites', min: -100, max: 100, default: 0 },
  { id: 'blacks', name: 'Blacks', min: -100, max: 100, default: 0 },
];

const presets = [
  { id: 'none', name: 'None', css: 'none' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.4) contrast(1.1) brightness(0.9)' },
  { id: 'cinematic', name: 'Cinematic', css: 'contrast(1.3) saturate(1.2) brightness(0.95)' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.2) saturate(1.4) hue-rotate(-10deg)' },
  { id: 'cool', name: 'Cool', css: 'saturate(0.8) hue-rotate(20deg) brightness(1.05)' },
  { id: 'bw', name: 'B&W', css: 'grayscale(1) contrast(1.1)' },
  { id: 'dramatic', name: 'Dramatic', css: 'contrast(1.5) brightness(0.85) saturate(1.3)' },
  { id: 'faded', name: 'Faded', css: 'contrast(0.85) brightness(1.1) saturate(0.7)' },
];

export default function FiltersPanel() {
  const { selectedLayerId, layers, addFilter, updateFilter } = useStore();
  const [activePreset, setActivePreset] = useState('none');
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(adjustments.map(a => [a.id, a.default]))
  );

  const updateValue = (id: string, value: number) => {
    setValues(prev => ({ ...prev, [id]: value }));
    if (selectedLayerId) {
      const existing = layers.find(l => l.id === selectedLayerId)?.filters?.find(f => f.type === id);
      if (existing) {
        updateFilter(selectedLayerId, existing.id, { intensity: value });
      } else {
        addFilter(selectedLayerId, { id: `${id}-${Date.now()}`, type: id as any, intensity: value, enabled: true });
      }
    }
  };

  const resetAll = () => {
    setValues(Object.fromEntries(adjustments.map(a => [a.id, a.default])));
    setActivePreset('none');
  };

  return (
    <div className="p-3 space-y-4">
      <div className="panel-header -mx-3 -mt-3 px-3 mb-0">
        <span>Filters & Adjustments</span>
      </div>

      {/* Presets */}
      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Presets</div>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map(preset => (
            <button
              key={preset.id}
              className={`p-2 rounded text-[10px] text-center transition-all ${
                activePreset === preset.id
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white hover:bg-[var(--bg-hover)]'
              }`}
              onClick={() => setActivePreset(preset.id)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Adjustments */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Adjustments</div>
          <button className="tool-btn w-5 h-5" onClick={resetAll} title="Reset All">
            <RotateCcw size={11} />
          </button>
        </div>
        <div className="space-y-3">
          {adjustments.map(adj => (
            <div key={adj.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-400">{adj.name}</span>
                <span className="text-[11px] text-gray-600 w-8 text-right">{values[adj.id]}</span>
              </div>
              <input
                type="range"
                min={adj.min}
                max={adj.max}
                value={values[adj.id]}
                onChange={e => updateValue(adj.id, Number(e.target.value))}
                className="slider w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
