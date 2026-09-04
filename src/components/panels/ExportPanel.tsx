import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Download, Image, Film, Music } from 'lucide-react';

export default function ExportPanel() {
  const { setShowExportModal, project } = useStore();
  const [exportType, setExportType] = useState<'video' | 'image' | 'audio'>('video');

  return (
    <div className="p-3 space-y-4">
      <div className="panel-header -mx-3 -mt-3 px-3 mb-0">
        <span>Export</span>
      </div>

      {/* Export type */}
      <div className="flex gap-1">
        {[
          { id: 'video', label: 'Video', icon: <Film size={12} /> },
          { id: 'image', label: 'Image', icon: <Image size={12} /> },
          { id: 'audio', label: 'Audio', icon: <Music size={12} /> },
        ].map(type => (
          <button
            key={type.id}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded text-[10px] transition-all ${
              exportType === type.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-gray-400'
            }`}
            onClick={() => setExportType(type.id as any)}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Settings */}
      {exportType === 'video' && (
        <div className="space-y-3">
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Format</span>
            <select className="input w-full text-xs">
              <option>MP4 (H.264)</option>
              <option>MP4 (H.265)</option>
              <option>WebM</option>
              <option>MOV</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Resolution</span>
            <select className="input w-full text-xs">
              <option>720p (1280×720)</option>
              <option>1080p (1920×1080)</option>
              <option>1440p (2560×1440)</option>
              <option>4K (3840×2160)</option>
              <option>Custom: {project?.width}×{project?.height}</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Frame Rate</span>
            <select className="input w-full text-xs">
              <option>24 FPS</option>
              <option>25 FPS</option>
              <option>30 FPS</option>
              <option>50 FPS</option>
              <option>60 FPS</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Quality</span>
            <select className="input w-full text-xs">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Very High</option>
              <option>Custom Bitrate</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Estimated Size</span>
            <div className="text-xs text-gray-400 bg-[var(--bg-tertiary)] p-2 rounded">~125 MB</div>
          </div>
        </div>
      )}

      {exportType === 'image' && (
        <div className="space-y-3">
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Format</span>
            <select className="input w-full text-xs">
              <option>PNG</option>
              <option>JPG</option>
              <option>WEBP</option>
              <option>SVG</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Quality</span>
            <input type="range" min="1" max="100" defaultValue="90" className="slider w-full" />
          </div>
        </div>
      )}

      {exportType === 'audio' && (
        <div className="space-y-3">
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Format</span>
            <select className="input w-full text-xs">
              <option>MP3</option>
              <option>WAV</option>
              <option>AAC</option>
              <option>OGG</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block mb-1">Bitrate</span>
            <select className="input w-full text-xs">
              <option>128 kbps</option>
              <option>192 kbps</option>
              <option>256 kbps</option>
              <option>320 kbps</option>
            </select>
          </div>
        </div>
      )}

      <button className="btn btn-primary w-full" onClick={() => setShowExportModal(true)}>
        <Download size={14} /> Export
      </button>
    </div>
  );
}
