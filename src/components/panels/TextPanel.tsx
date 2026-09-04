import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Type, Plus, AlignLeft, AlignCenter, AlignRight, AlignJustify, Bold, Italic, Underline } from 'lucide-react';

const fonts = [
  'Inter', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New',
  'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Roboto', 'Open Sans',
  'Montserrat', 'Playfair Display', 'Merriweather', 'Poppins', 'Raleway',
];

const textAnimations = [
  { id: 'none', name: 'None' },
  { id: 'fade', name: 'Fade In' },
  { id: 'slide', name: 'Slide' },
  { id: 'zoom', name: 'Zoom' },
  { id: 'typewriter', name: 'Typewriter' },
  { id: 'bounce', name: 'Bounce' },
  { id: 'pop', name: 'Pop' },
  { id: 'glitch', name: 'Glitch' },
  { id: 'shake', name: 'Shake' },
];

export default function TextPanel() {
  const { addLayer, selectedLayerId, layers, updateLayer } = useStore();
  const layer = layers.find(l => l.id === selectedLayerId && l.type === 'text');
  const [fontSearch, setFontSearch] = useState('');

  const addTextLayer = () => {
    addLayer({
      type: 'text',
      name: 'New Text',
      width: 400,
      height: 80,
      x: 100,
      y: 100,
      text: {
        content: 'Enter text here',
        fontFamily: 'Inter',
        fontSize: 48,
        fontWeight: 400,
        fontStyle: 'normal',
        textDecoration: 'none',
        color: '#ffffff',
        letterSpacing: 0,
        lineHeight: 1.5,
        align: 'left',
      },
    });
  };

  const filteredFonts = fonts.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase()));

  return (
    <div className="p-3 space-y-4">
      <div className="panel-header -mx-3 -mt-3 px-3 mb-0">
        <span>Text</span>
      </div>

      {/* Quick add */}
      <button className="btn btn-primary w-full text-xs" onClick={addTextLayer}>
        <Plus size={14} /> Add Text Layer
      </button>

      {layer?.text ? (
        <>
          {/* Font */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Font</div>
            <input
              type="text"
              placeholder="Search fonts..."
              value={fontSearch}
              onChange={e => setFontSearch(e.target.value)}
              className="input w-full text-xs mb-2"
            />
            <div className="max-h-32 overflow-y-auto rounded border" style={{ borderColor: 'var(--border)' }}>
              {filteredFonts.map(font => (
                <button
                  key={font}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--bg-hover)] transition-colors ${
                    layer.text?.fontFamily === font ? 'bg-[var(--accent)]/20 text-indigo-300' : ''
                  }`}
                  style={{ fontFamily: font }}
                  onClick={() => updateLayer(layer.id, { text: { ...layer.text!, fontFamily: font } })}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Size & Style */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style</div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                value={layer.text.fontSize}
                onChange={e => updateLayer(layer.id, { text: { ...layer.text!, fontSize: Number(e.target.value) } })}
                className="input w-16 text-xs"
                min={8}
                max={500}
              />
              <span className="text-[10px] text-gray-500">px</span>
              <div className="flex gap-1 ml-auto">
                <button
                  className={`tool-btn w-7 h-7 ${layer.text.fontWeight === 700 ? 'active' : ''}`}
                  onClick={() => updateLayer(layer.id, { text: { ...layer.text!, fontWeight: layer.text!.fontWeight === 700 ? 400 : 700 } })}
                >
                  <Bold size={14} />
                </button>
                <button
                  className={`tool-btn w-7 h-7 ${layer.text.fontStyle === 'italic' ? 'active' : ''}`}
                  onClick={() => updateLayer(layer.id, { text: { ...layer.text!, fontStyle: layer.text!.fontStyle === 'italic' ? 'normal' : 'italic' } })}
                >
                  <Italic size={14} />
                </button>
                <button
                  className={`tool-btn w-7 h-7 ${layer.text.textDecoration === 'underline' ? 'active' : ''}`}
                  onClick={() => updateLayer(layer.id, { text: { ...layer.text!, textDecoration: layer.text!.textDecoration === 'underline' ? 'none' : 'underline' } })}
                >
                  <Underline size={14} />
                </button>
              </div>
            </div>

            {/* Alignment */}
            <div className="flex gap-1 mb-2">
              {[
                { align: 'left', icon: <AlignLeft size={14} /> },
                { align: 'center', icon: <AlignCenter size={14} /> },
                { align: 'right', icon: <AlignRight size={14} /> },
                { align: 'justify', icon: <AlignJustify size={14} /> },
              ].map(a => (
                <button
                  key={a.align}
                  className={`tool-btn flex-1 h-7 ${layer.text?.align === a.align ? 'active' : ''}`}
                  onClick={() => updateLayer(layer.id, { text: { ...layer.text!, align: a.align as any } })}
                >
                  {a.icon}
                </button>
              ))}
            </div>

            {/* Spacing */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Letter Spacing</span>
                  <span>{layer.text.letterSpacing}px</span>
                </div>
                <input type="range" min="-10" max="20" value={layer.text.letterSpacing}
                  onChange={e => updateLayer(layer.id, { text: { ...layer.text!, letterSpacing: Number(e.target.value) } })}
                  className="slider w-full" />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Line Height</span>
                  <span>{layer.text.lineHeight}</span>
                </div>
                <input type="range" min="0.5" max="3" step="0.1" value={layer.text.lineHeight}
                  onChange={e => updateLayer(layer.id, { text: { ...layer.text!, lineHeight: Number(e.target.value) } })}
                  className="slider w-full" />
              </div>
            </div>
          </div>

          {/* Effects */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Text Effects</div>
            <div className="space-y-2">
              {/* Stroke */}
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={!!layer.text.stroke}
                  onChange={e => updateLayer(layer.id, { text: { ...layer.text!, stroke: e.target.checked ? { color: '#000000', width: 2 } : undefined } })}
                  className="rounded" />
                <span className="text-xs">Stroke</span>
                {layer.text.stroke && (
                  <input type="color" value={layer.text.stroke.color}
                    onChange={e => updateLayer(layer.id, { text: { ...layer.text!, stroke: { ...layer.text!.stroke!, color: e.target.value } } })}
                    className="w-6 h-6 rounded cursor-pointer ml-auto" />
                )}
              </div>
              {/* Shadow */}
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={!!layer.text.shadow}
                  onChange={e => updateLayer(layer.id, { text: { ...layer.text!, shadow: e.target.checked ? { color: '#000000', x: 2, y: 2, blur: 4 } : undefined } })}
                  className="rounded" />
                <span className="text-xs">Drop Shadow</span>
              </div>
              {/* Glow */}
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={!!layer.text.glow}
                  onChange={e => updateLayer(layer.id, { text: { ...layer.text!, glow: e.target.checked ? { color: '#6366f1', radius: 10 } : undefined } })}
                  className="rounded" />
                <span className="text-xs">Glow</span>
              </div>
            </div>
          </div>

          {/* Animation */}
          <div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Animation</div>
            <div className="grid grid-cols-3 gap-1">
              {textAnimations.map(anim => (
                <button
                  key={anim.id}
                  className={`p-1.5 rounded text-[10px] transition-all ${
                    layer.text?.animation === anim.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white'
                  }`}
                  onClick={() => updateLayer(layer.id, { text: { ...layer.text!, animation: anim.id as any } })}
                >
                  {anim.name}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <Type size={24} className="mx-auto mb-2 text-gray-600" />
          <p className="text-xs text-gray-500">Add or select a text layer to edit</p>
        </div>
      )}
    </div>
  );
}
