import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Sparkles, ChevronDown, ChevronRight } from 'lucide-react';

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
  {
    name: 'Glitch',
    effects: [
      { id: 'digitalGlitch', name: 'Digital Glitch', defaultIntensity: 40 },
      { id: 'pixelGlitch', name: 'Pixel Glitch', defaultIntensity: 30 },
      { id: 'rgbGlitch', name: 'RGB Glitch', defaultIntensity: 35 },
      { id: 'distortion', name: 'Distortion', defaultIntensity: 25 },
    ]
  },
];

export default function EffectsPanel() {
  const { selectedLayerId, addFilter } = useStore();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ Basic: true });
  const [activeEffects, setActiveEffects] = useState<Record<string, boolean>>({});

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleEffect = (effectId: string, defaultIntensity: number) => {
    if (!selectedLayerId) return;
    setActiveEffects(prev => ({ ...prev, [effectId]: !prev[effectId] }));
    if (!activeEffects[effectId]) {
      addFilter(selectedLayerId, {
        id: `${effectId}-${Date.now()}`,
        type: effectId as any,
        intensity: defaultIntensity,
        enabled: true,
      });
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
                  {category.effects.map(effect => (
                    <div
                      key={effect.id}
                      className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
                      onClick={() => toggleEffect(effect.id, effect.defaultIntensity)}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        activeEffects[effect.id] ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600'
                      }`}>
                        {activeEffects[effect.id] && <div className="w-2 h-2 bg-white rounded-sm" />}
                      </div>
                      <span className="text-xs flex-1">{effect.name}</span>
                      {activeEffects[effect.id] && (
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue={effect.defaultIntensity}
                          className="slider w-16"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
