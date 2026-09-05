import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Download, Film, Image, Music, Check, Loader2 } from 'lucide-react';

export default function ExportModal({ onExported }: { onExported?: () => void }) {
  const { setShowExportModal, project } = useStore();
  const [exportType, setExportType] = useState<'video' | 'image' | 'audio'>('video');
  const [format, setFormat] = useState('mp4');
  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState(30);
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[500px] rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-lg font-bold">Export</h2>
            <p className="text-xs text-gray-500 mt-0.5">{project?.name || 'Untitled Project'}</p>
          </div>
          <button className="tool-btn" onClick={() => setShowExportModal(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Export type */}
          <div className="flex gap-2">
            {[
              { id: 'video', label: 'Video', icon: <Film size={16} /> },
              { id: 'image', label: 'Image', icon: <Image size={16} /> },
              { id: 'audio', label: 'Audio', icon: <Music size={16} /> },
            ].map(type => (
              <button
                key={type.id}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                  exportType === type.id
                    ? 'bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white'
                }`}
                onClick={() => setExportType(type.id as any)}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          {exportType === 'video' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Format</label>
                  <select value={format} onChange={e => setFormat(e.target.value)} className="input w-full text-xs">
                    <option value="mp4">MP4 (H.264)</option>
                    <option value="mp4-h265">MP4 (H.265)</option>
                    <option value="webm">WebM</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Resolution</label>
                  <select value={resolution} onChange={e => setResolution(e.target.value)} className="input w-full text-xs">
                    <option value="720p">720p (1280×720)</option>
                    <option value="1080p">1080p (1920×1080)</option>
                    <option value="1440p">1440p (2560×1440)</option>
                    <option value="4k">4K (3840×2160)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Frame Rate</label>
                  <select value={fps} onChange={e => setFps(Number(e.target.value))} className="input w-full text-xs">
                    <option value={24}>24 FPS</option>
                    <option value={25}>25 FPS</option>
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Quality</label>
                  <select value={quality} onChange={e => setQuality(e.target.value)} className="input w-full text-xs">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="veryhigh">Very High</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                <span className="text-xs text-gray-400">Estimated File Size</span>
                <span className="text-xs font-medium">~125 MB</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                <span className="text-xs text-gray-400">Estimated Time</span>
                <span className="text-xs font-medium">~2 minutes</span>
              </div>
            </>
          )}

          {exportType === 'image' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Format</label>
                <select className="input w-full text-xs">
                  <option>PNG</option>
                  <option>JPG</option>
                  <option>WEBP</option>
                  <option>SVG</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Quality</label>
                <input type="range" min="1" max="100" defaultValue="90" className="slider w-full mt-2" />
              </div>
            </div>
          )}

          {exportType === 'audio' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Format</label>
                <select className="input w-full text-xs">
                  <option>MP3</option>
                  <option>WAV</option>
                  <option>AAC</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 block mb-1">Bitrate</label>
                <select className="input w-full text-xs">
                  <option>128 kbps</option>
                  <option>192 kbps</option>
                  <option>256 kbps</option>
                  <option>320 kbps</option>
                </select>
              </div>
            </div>
          )}

          {/* Progress */}
          {(isExporting || isComplete) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {isComplete ? 'Export Complete!' : `Exporting... ${progress}%`}
                </span>
                {isComplete && <Check size={16} className="text-green-400" />}
              </div>
              <div className="w-full h-2 rounded-full bg-gray-800">
                <div 
                  className="h-full rounded-full transition-all duration-200"
                  style={{ 
                    width: `${progress}%`,
                    background: isComplete ? 'var(--success)' : 'var(--accent)'
                  }} 
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button className="btn btn-secondary px-6" onClick={() => setShowExportModal(false)}>
            Cancel
          </button>
          {!isComplete ? (
            <button className="btn btn-primary px-6" onClick={handleExport} disabled={isExporting}>
              {isExporting ? <><Loader2 size={14} className="animate-spin" /> Exporting...</> : <><Download size={14} /> Export</>}
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-secondary px-4" onClick={() => setShowExportModal(false)}>
                <Download size={14} /> Download Only
              </button>
              <button className="btn btn-primary px-6" onClick={() => { setShowExportModal(false); onExported?.(); window.dispatchEvent(new Event('xeditor:export-complete')) }}>
                Next: Upload Options →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
