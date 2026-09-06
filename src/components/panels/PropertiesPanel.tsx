import { useStore } from '../../store/useStore';
import { Lock, Unlock, Eye, EyeOff, Trash2, Copy, Layers } from 'lucide-react';

export default function PropertiesPanel() {
  const { selectedLayerId, layers, updateLayer, removeLayer, duplicateLayer, project } = useStore();
  const layer = layers.find(l => l.id === selectedLayerId);

  if (!layer) {
    return (
      <div className="p-4">
        <div className="panel-header mb-3">
          <span>Properties</span>
        </div>
        <div className="text-center py-8">
          <Layers size={32} className="mx-auto mb-3 text-gray-600" />
          <p className="text-xs text-gray-500">Select a layer to view properties</p>
        </div>
        
        {/* Project info */}
        <div className="mt-6">
          <div className="panel-header mb-3">
            <span>Project</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Name</span>
              <span>{project?.name || 'Untitled'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Resolution</span>
              <span>{project?.width}×{project?.height}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">FPS</span>
              <span>{project?.fps}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Aspect Ratio</span>
              <span>{project?.aspectRatio}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Layer header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: layer.type === 'text' ? '#00d9c0' : layer.type === 'shape' ? '#22c55e' : '#f97316' }} />
          <span className="text-xs font-medium truncate max-w-[120px]">{layer.name}</span>
          <span className="text-[10px] text-gray-600 capitalize">{layer.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="tool-btn w-6 h-6" onClick={() => updateLayer(layer.id, { visible: !layer.visible })}>
            {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>
          <button className="tool-btn w-6 h-6" onClick={() => updateLayer(layer.id, { locked: !layer.locked })}>
            {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
          </button>
          <button className="tool-btn w-6 h-6" onClick={() => duplicateLayer(layer.id)}>
            <Copy size={12} />
          </button>
          <button className="tool-btn w-6 h-6 text-red-400" onClick={() => removeLayer(layer.id)}>
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Transform */}
      <Section title="Transform">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={layer.x} onChange={v => updateLayer(layer.id, { x: v })} />
          <NumberInput label="Y" value={layer.y} onChange={v => updateLayer(layer.id, { y: v })} />
          <NumberInput label="W" value={layer.width} onChange={v => updateLayer(layer.id, { width: v })} />
          <NumberInput label="H" value={layer.height} onChange={v => updateLayer(layer.id, { height: v })} />
          <NumberInput label="Rotation" value={layer.rotation} onChange={v => updateLayer(layer.id, { rotation: v })} suffix="°" />
          <NumberInput label="Scale" value={layer.scaleX * 100} onChange={v => { const s = v / 100; updateLayer(layer.id, { scaleX: s, scaleY: s }); }} suffix="%" />
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Opacity</span>
            <span>{layer.opacity}%</span>
          </div>
          <input type="range" min="0" max="100" value={layer.opacity}
            onChange={e => updateLayer(layer.id, { opacity: Number(e.target.value) })}
            className="slider w-full" />
          
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-gray-500">Blend Mode</span>
          </div>
          <select
            value={layer.blendMode}
            onChange={e => updateLayer(layer.id, { blendMode: e.target.value as any })}
            className="input w-full text-xs"
          >
            {['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </Section>

      {/* Text Properties */}
      {layer.type === 'text' && layer.text && (
        <Section title="Text">
          <div className="space-y-2">
            <textarea
              value={layer.text.content}
              onChange={e => updateLayer(layer.id, { text: { ...layer.text!, content: e.target.value } })}
              className="input w-full text-xs h-16 resize-none"
              placeholder="Enter text..."
            />
            <div className="grid grid-cols-2 gap-2">
              <NumberInput label="Size" value={layer.text.fontSize} onChange={v => updateLayer(layer.id, { text: { ...layer.text!, fontSize: v } })} />
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Color</label>
                <input type="color" value={layer.text.color}
                  onChange={e => updateLayer(layer.id, { text: { ...layer.text!, color: e.target.value } })}
                  className="w-full h-7 rounded cursor-pointer" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }} />
              </div>
            </div>
            <div className="flex gap-1">
              {['bold', 'italic', 'underline'].map(style => (
                <button key={style}
                  className={`btn btn-ghost text-[10px] flex-1 ${
                    (style === 'bold' && layer.text?.fontWeight === 700) ||
                    (style === 'italic' && layer.text?.fontStyle === 'italic') ||
                    (style === 'underline' && layer.text?.textDecoration === 'underline') ? 'bg-[var(--bg-hover)]' : ''
                  }`}
                  onClick={() => {
                    if (!layer.text) return;
                    const updates: any = {};
                    if (style === 'bold') updates.fontWeight = layer.text.fontWeight === 700 ? 400 : 700;
                    if (style === 'italic') updates.fontStyle = layer.text.fontStyle === 'italic' ? 'normal' : 'italic';
                    if (style === 'underline') updates.textDecoration = layer.text.textDecoration === 'underline' ? 'none' : 'underline';
                    updateLayer(layer.id, { text: { ...layer.text, ...updates } });
                  }}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Shape Properties */}
      {layer.type === 'shape' && layer.shape && (
        <Section title="Shape">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Fill</label>
              <input type="color" value={layer.shape.fill}
                onChange={e => updateLayer(layer.id, { shape: { ...layer.shape!, fill: e.target.value } })}
                className="w-full h-7 rounded cursor-pointer" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }} />
            </div>
            {layer.shape.cornerRadius !== undefined && (
              <NumberInput label="Radius" value={layer.shape.cornerRadius} onChange={v => updateLayer(layer.id, { shape: { ...layer.shape!, cornerRadius: v } })} suffix="px" />
            )}
          </div>
        </Section>
      )}

      {/* Keyframes */}
      <Section title="Keyframes">
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost text-[10px] flex-1">+ Add Keyframe</button>
          <button className="btn btn-ghost text-[10px]">←</button>
          <button className="btn btn-ghost text-[10px]">→</button>
        </div>
        <div className="text-[10px] text-gray-600 mt-2 text-center">
          {layer.keyframes?.length || 0} keyframes
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</div>
      {children}
    </div>
  );
}

function NumberInput({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 block mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={Math.round(value)}
          onChange={e => onChange(Number(e.target.value))}
          className="input w-full text-xs pr-7"
        />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-600">{suffix}</span>}
      </div>
    </div>
  );
}
