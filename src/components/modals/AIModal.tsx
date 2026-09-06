import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, Wand2, Upload, Sparkles, Image, Eraser, Layers, Type, 
  Music, ChevronRight, AlertTriangle, Loader2, Check
} from 'lucide-react';

const tools = [
  { id: 'bgRemove', name: 'Background Remover', desc: 'Remove background from images and videos', icon: <Layers size={20} />, category: 'photo' },
  { id: 'bgReplace', name: 'Background Replacement', desc: 'Replace background with AI-generated scene', icon: <Image size={20} />, category: 'photo' },
  { id: 'objectRemove', name: 'Object Removal', desc: 'Remove unwanted objects from content', icon: <Eraser size={20} />, category: 'photo' },
  { id: 'upscale', name: 'Image Upscaler', desc: 'Enhance resolution up to 4x', icon: <Sparkles size={20} />, category: 'photo' },
  { id: 'enhance', name: 'Image Enhancer', desc: 'Auto-enhance quality, color, and sharpness', icon: <Wand2 size={20} />, category: 'photo' },
  { id: 'faceBlur', name: 'Face Blur', desc: 'Automatically detect and blur faces', icon: <Image size={20} />, category: 'photo' },
  { id: 'textGen', name: 'Text to Image', desc: 'Generate images from text descriptions', icon: <Type size={20} />, category: 'gen' },
  { id: 'autoCaption', name: 'Auto Captions', desc: 'Generate subtitles from audio', icon: <Type size={20} />, category: 'video' },
  { id: 'noiseRemove', name: 'Noise Removal', desc: 'Remove background noise from audio', icon: <Music size={20} />, category: 'audio' },
  { id: 'autoEnhance', name: 'Auto Enhancement', desc: 'One-click video enhancement', icon: <Wand2 size={20} />, category: 'video' },
  { id: 'smartCrop', name: 'Smart Crop', desc: 'AI-powered intelligent content cropping', icon: <Image size={20} />, category: 'video' },
  { id: 'highlight', name: 'Highlight Detection', desc: 'Auto-detect highlight moments in video', icon: <Sparkles size={20} />, category: 'video' },
];

export default function AIModal() {
  const { setShowAIModal } = useStore();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  const needsAuth = (toolId: string) => ['objectRemove', 'bgRemove'].includes(toolId);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  const tool = tools.find(t => t.id === selectedTool);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[620px] max-h-[85vh] rounded-2xl overflow-hidden animate-scale-in flex flex-col"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d9c0, #00b8a3)' }}>
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Tools</h2>
              <p className="text-xs text-gray-500">Powered by artificial intelligence</p>
            </div>
          </div>
          <button className="tool-btn" onClick={() => setShowAIModal(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!selectedTool ? (
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {tools.map(t => (
                  <button
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.02]"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                    onClick={() => setSelectedTool(t.id)}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(0, 217, 192, 0.15)', color: '#2ee6cf' }}>
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{t.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{t.desc}</div>
                    </div>
                    <ChevronRight size={14} className="text-gray-600 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Back button */}
              <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1" 
                onClick={() => { setSelectedTool(null); setIsComplete(false); }}>
                ← Back to tools
              </button>

              {/* Tool header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0, 217, 192, 0.15)', color: '#2ee6cf' }}>
                  {tool?.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold">{tool?.name}</h3>
                  <p className="text-xs text-gray-500">{tool?.desc}</p>
                </div>
              </div>

              {/* Auth notice */}
              {needsAuth(selectedTool) && (
                <div className="p-3 rounded-lg flex gap-3" 
                  style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)' }}>
                  <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-yellow-400 font-medium">Authorization Required</p>
                    <p className="text-[10px] text-yellow-500/70 mt-1">
                      Only use on content you own or have permission to modify.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload area */}
              <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{ borderColor: 'var(--border)' }}>
                <Upload size={28} className="mx-auto mb-2 text-gray-500" />
                <p className="text-xs text-gray-400">Upload image or video</p>
                <p className="text-[10px] text-gray-600 mt-1">or drag and drop</p>
              </div>

              {/* Tool-specific options */}
              {selectedTool === 'textGen' && (
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-2">Describe your image</label>
                  <textarea className="input w-full h-20 resize-none text-sm" 
                    placeholder="A beautiful sunset over the ocean with vibrant colors..." />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Style</label>
                      <select className="input w-full text-xs">
                        <option>Photorealistic</option>
                        <option>Digital Art</option>
                        <option>Oil Painting</option>
                        <option>Watercolor</option>
                        <option>Anime</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1">Aspect Ratio</label>
                      <select className="input w-full text-xs">
                        <option>1:1</option>
                        <option>16:9</option>
                        <option>9:16</option>
                        <option>4:3</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'bgReplace' && (
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-2">New Background</label>
                  <textarea className="input w-full h-16 resize-none text-sm"
                    placeholder="Describe the new background..." />
                </div>
              )}

              {/* Auth checkbox */}
              {needsAuth(selectedTool) && (
                <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer"
                  style={{ background: 'var(--bg-tertiary)', border: authorized ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border)' }}>
                  <input type="checkbox" checked={authorized} onChange={e => setAuthorized(e.target.checked)} className="rounded mt-0.5" />
                  <span className="text-xs">I confirm that I own or have permission to edit this content</span>
                </label>
              )}

              {/* Processing state */}
              {isProcessing && (
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  <Loader2 size={20} className="text-[var(--accent)] animate-spin" />
                  <div>
                    <p className="text-xs font-medium">Processing...</p>
                    <p className="text-[10px] text-gray-500">AI is analyzing your content</p>
                  </div>
                </div>
              )}

              {/* Complete state */}
              {isComplete && (
                <div className="flex items-center gap-3 p-4 rounded-lg"
                  style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                  <Check size={20} className="text-green-400" />
                  <div>
                    <p className="text-xs font-medium text-green-400">Processing Complete!</p>
                    <p className="text-[10px] text-green-400/70">Your content has been processed</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedTool && (
          <div className="flex items-center justify-end gap-3 p-5 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <button className="btn btn-secondary px-6" onClick={() => setShowAIModal(false)}>
              Cancel
            </button>
            <button 
              className={`btn px-6 ${needsAuth(selectedTool) && !authorized ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-primary'}`}
              onClick={handleProcess}
              disabled={(needsAuth(selectedTool) && !authorized) || isProcessing}
            >
              {isProcessing ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : 
               isComplete ? <><Check size={14} /> Apply</> : 
               <><Sparkles size={14} /> Process</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
