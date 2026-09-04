import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Pipette } from 'lucide-react';

const presetColors = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#14b8a6',
  '#64748b', '#78716c', '#dc2626', '#ea580c', '#ca8a04', '#16a34a',
  '#2563eb', '#4f46e5', '#7c3aed', '#9333ea', '#db2777', '#0d9488',
];

export default function ColorPanel() {
  const { selectedLayerId, layers, updateLayer } = useStore();
  const layer = layers.find(l => l.id === selectedLayerId);
  const [activeColor, setActiveColor] = useState<'fill' | 'stroke'>('fill');
  const [hexInput, setHexInput] = useState('#6366f1');

  const currentColor = layer?.type === 'shape' ? layer.shape?.fill : layer?.type === 'text' ? layer.text?.color : '#6366f1';

  const applyColor = (color: string) => {
    setHexInput(color);
    if (!layer) return;
    if (layer.type === 'shape' && layer.shape) {
      updateLayer(layer.id, { shape: { ...layer.shape, fill: color } });
    } else if (layer.type === 'text' && layer.text) {
      updateLayer(layer.id, { text: { ...layer.text, color } });
    }
  };

  return (
    <div className="p-3 space-y-4">
      {/* Color picker */}
      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Color</div>
        <div className="flex gap-2 mb-3">
          <button 
            className={`flex-1 py-1 rounded text-[10px] ${activeColor === 'fill' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-gray-400'}`}
            onClick={() => setActiveColor('fill')}>Fill</button>
          <button 
            className={`flex-1 py-1 rounded text-[10px] ${activeColor === 'stroke' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-gray-400'}`}
            onClick={() => setActiveColor('stroke')}>Stroke</button>
        </div>

        {/* Large color preview */}
        <div className="w-full h-20 rounded-lg mb-3 border cursor-pointer relative overflow-hidden"
          style={{ background: currentColor || '#6366f1', borderColor: 'var(--border)' }}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
            <Pipette size={20} />
          </div>
        </div>

        {/* Color wheel (simplified) */}
        <div className="w-full h-4 rounded-lg mb-3 cursor-pointer"
          style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }} />

        {/* Hex input */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">#</span>
            <input
              type="text"
              value={hexInput.replace('#', '')}
              onChange={e => {
                const hex = '#' + e.target.value;
                setHexInput(hex);
                if (/^#[0-9A-Fa-f]{6}$/.test(hex)) applyColor(hex);
              }}
              className="input w-full text-xs pl-5"
              maxLength={6}
            />
          </div>
          <input
            type="color"
            value={currentColor || '#6366f1'}
            onChange={e => applyColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0"
          />
        </div>

        {/* Preset colors */}
        <div className="grid grid-cols-8 gap-1">
          {presetColors.map(color => (
            <button
              key={color}
              className="w-full aspect-square rounded border hover:scale-110 transition-transform cursor-pointer"
              style={{ background: color, borderColor: color === '#ffffff' || color === '#000000' ? 'var(--border)' : 'transparent' }}
              onClick={() => applyColor(color)}
            />
          ))}
        </div>
      </div>

      {/* Gradients */}
      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Gradients</div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            'linear-gradient(135deg, #667eea, #764ba2)',
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #4facfe, #00f2fe)',
            'linear-gradient(135deg, #43e97b, #38f9d7)',
            'linear-gradient(135deg, #fa709a, #fee140)',
            'linear-gradient(135deg, #a18cd1, #fbc2eb)',
            'linear-gradient(135deg, #fccb90, #d57eeb)',
            'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
          ].map((g, i) => (
            <button
              key={i}
              className="w-full aspect-square rounded border cursor-pointer hover:scale-110 transition-transform"
              style={{ background: g, borderColor: 'var(--border)' }}
            />
          ))}
        </div>
      </div>

      {/* Recent colors */}
      <div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent</div>
        <div className="flex gap-1.5">
          {['#6366f1', '#ef4444', '#22c55e', '#eab308', '#ffffff'].map(color => (
            <button
              key={color}
              className="w-6 h-6 rounded border cursor-pointer"
              style={{ background: color, borderColor: 'var(--border)' }}
              onClick={() => applyColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
