import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Upload, Type, Sparkles, Eraser, AlertTriangle } from 'lucide-react';

export default function WatermarkModal() {
  const { setShowWatermarkModal } = useStore();
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [authorized, setAuthorized] = useState(false);
  const [opacity, setOpacity] = useState(50);
  const [size, setSize] = useState(100);
  const [position, setPosition] = useState('bottom-right');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[550px] rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-lg font-bold">Watermark & Logo Tools</h2>
            <p className="text-xs text-gray-500 mt-0.5">Add or remove watermarks from your content</p>
          </div>
          <button className="tool-btn" onClick={() => setShowWatermarkModal(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
          {[
            { id: 'add', label: 'Add Watermark', icon: <Type size={14} /> },
            { id: 'remove', label: 'Remove Watermark', icon: <Eraser size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all ${
                activeTab === tab.id 
                  ? 'text-white border-b-2 border-[var(--accent)]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'add' && (
            <>
              {/* Upload logo */}
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-2">Logo / Image</label>
                <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                  style={{ borderColor: 'var(--border)' }}>
                  <Upload size={24} className="mx-auto mb-2 text-gray-500" />
                  <p className="text-xs text-gray-400">Upload logo or watermark image</p>
                </div>
              </div>

              {/* Text watermark */}
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-2">Or Text Watermark</label>
                <input type="text" placeholder="© Your Brand" className="input w-full text-sm" />
              </div>

              {/* Position */}
              <div>
                <label className="text-xs font-medium text-gray-400 block mb-2">Position</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'].map(pos => (
                    <button
                      key={pos}
                      className={`py-2 rounded text-[10px] transition-all ${
                        position === pos ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setPosition(pos)}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Opacity</span><span>{opacity}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={opacity} onChange={e => setOpacity(Number(e.target.value))} className="slider w-full" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>Size</span><span>{size}%</span>
                  </div>
                  <input type="range" min="10" max="300" value={size} onChange={e => setSize(Number(e.target.value))} className="slider w-full" />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs">Repeating watermark (tiled)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs">Apply to entire timeline</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'remove' && (
            <>
              {/* Authorization notice */}
              <div className="p-3 rounded-lg flex gap-3" style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-yellow-400 font-medium mb-1">Authorization Required</p>
                  <p className="text-[10px] text-yellow-500/70">
                    Use this tool only on content you own or have permission to modify. 
                    Removing watermarks from copyrighted content is prohibited.
                  </p>
                </div>
              </div>

              {/* Upload area */}
              <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{ borderColor: 'var(--border)' }}>
                <Upload size={28} className="mx-auto mb-2 text-gray-500" />
                <p className="text-xs text-gray-400">Upload video or photo with watermark</p>
              </div>

              {/* AI Detection */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-[var(--accent)]" />
                  <span className="text-sm font-medium">AI Watermark Detection</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  AI will detect and select the watermark area automatically. You can also manually select the region.
                </p>
                <div className="flex gap-2">
                  <button className="btn btn-ghost flex-1 text-xs">
                    <Sparkles size={14} /> Auto Detect
                  </button>
                  <button className="btn btn-ghost flex-1 text-xs">
                    Manual Select
                  </button>
                </div>
              </div>

              {/* Authorization checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer" 
                style={{ background: 'var(--bg-tertiary)', border: authorized ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border)' }}>
                <input type="checkbox" checked={authorized} onChange={e => setAuthorized(e.target.checked)} className="rounded mt-0.5" />
                <div>
                  <span className="text-xs font-medium block">I confirm that I own or have permission to edit this content</span>
                  <span className="text-[10px] text-gray-500">This is required to use the watermark removal tool</span>
                </div>
              </label>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button className="btn btn-secondary px-6" onClick={() => setShowWatermarkModal(false)}>
            Cancel
          </button>
          <button 
            className={`btn px-6 ${activeTab === 'remove' && !authorized ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
            disabled={activeTab === 'remove' && !authorized}
          >
            {activeTab === 'add' ? 'Apply Watermark' : 'Remove Watermark'}
          </button>
        </div>
      </div>
    </div>
  );
}
