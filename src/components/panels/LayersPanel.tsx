import { useStore } from '../../store/useStore';
import { 
  Eye, EyeOff, Lock, Unlock, Plus, Trash2, Copy, 
  Image, Type, Square, Film, Volume2, Layers
} from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  image: <Image size={12} />,
  text: <Type size={12} />,
  shape: <Square size={12} />,
  video: <Film size={12} />,
  audio: <Volume2 size={12} />,
  group: <Layers size={12} />,
};

const typeColors: Record<string, string> = {
  image: '#f97316',
  text: '#00d9c0',
  shape: '#22c55e',
  video: '#3b82f6',
  audio: '#eab308',
  group: '#00b8a3',
};

export default function LayersPanel() {
  const { layers, selectedLayerId, setSelectedLayerId, updateLayer, removeLayer, duplicateLayer, addLayer } = useStore();

  const handleAddLayer = (type: string) => {
    const defaults: Record<string, any> = {
      image: { name: 'New Image', width: 400, height: 300, src: '' },
      text: { name: 'New Text', width: 300, height: 60, text: { content: 'Hello World', fontFamily: 'Inter', fontSize: 32, fontWeight: 400, fontStyle: 'normal', textDecoration: 'none', color: '#ffffff', letterSpacing: 0, lineHeight: 1.5, align: 'left' as const } },
      shape: { name: 'New Shape', width: 200, height: 200, shape: { type: 'rectangle' as const, fill: '#00d9c0', cornerRadius: 8 } },
    };
    addLayer({ type: type as any, ...defaults[type] });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <span>Layers</span>
        <div className="flex items-center gap-1">
          <div className="relative group">
            <button className="tool-btn w-6 h-6">
              <Plus size={14} />
            </button>
            <div className="context-menu hidden group-hover:block right-0 top-full mt-1" style={{ position: 'absolute' }}>
              {['image', 'text', 'shape'].map(type => (
                <button key={type} className="context-menu-item w-full" onClick={() => handleAddLayer(type)}>
                  {typeIcons[type]}
                  <span className="capitalize">{type} Layer</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="p-4 text-center">
            <Layers size={24} className="mx-auto mb-2 text-gray-600" />
            <p className="text-xs text-gray-500">No layers yet</p>
            <div className="flex gap-1 mt-3">
              <button className="btn btn-ghost text-[10px] flex-1" onClick={() => handleAddLayer('text')}>
                <Type size={12} /> Text
              </button>
              <button className="btn btn-ghost text-[10px] flex-1" onClick={() => handleAddLayer('shape')}>
                <Square size={12} /> Shape
              </button>
            </div>
          </div>
        ) : (
          <div className="py-1">
            {[...layers].reverse().map((layer) => (
              <div
                key={layer.id}
                className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors ${
                  selectedLayerId === layer.id 
                    ? 'bg-[var(--accent)]/10 border-l-2 border-l-[var(--accent)]' 
                    : 'hover:bg-[var(--bg-hover)] border-l-2 border-l-transparent'
                }`}
                onClick={() => setSelectedLayerId(layer.id)}
              >
                {/* Visibility */}
                <button 
                  className="tool-btn w-5 h-5 flex-shrink-0"
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                >
                  {layer.visible ? <Eye size={11} /> : <EyeOff size={11} className="text-gray-600" />}
                </button>

                {/* Lock */}
                <button 
                  className="tool-btn w-5 h-5 flex-shrink-0"
                  onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                >
                  {layer.locked ? <Lock size={11} className="text-yellow-500" /> : <Unlock size={11} className="text-gray-600" />}
                </button>

                {/* Type icon */}
                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: `${typeColors[layer.type]}20`, color: typeColors[layer.type] }}>
                  {typeIcons[layer.type]}
                </div>

                {/* Name */}
                <span className="text-xs flex-1 truncate">{layer.name}</span>

                {/* Quick actions (visible on hover) */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button className="tool-btn w-4 h-4" onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id); }}>
                    <Copy size={10} />
                  </button>
                  <button className="tool-btn w-4 h-4 text-red-400" onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}>
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-2 border-t flex items-center gap-1" style={{ borderColor: 'var(--border)' }}>
        <button className="btn btn-ghost text-[10px] flex-1" onClick={() => handleAddLayer('text')}>
          <Type size={12} /> Text
        </button>
        <button className="btn btn-ghost text-[10px] flex-1" onClick={() => handleAddLayer('shape')}>
          <Square size={12} /> Shape
        </button>
        <button className="btn btn-ghost text-[10px] flex-1" onClick={() => handleAddLayer('image')}>
          <Image size={12} /> Image
        </button>
      </div>
    </div>
  );
}
