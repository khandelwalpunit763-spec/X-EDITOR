import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Image, Type, Sparkles, Grid3X3, Star, Layers } from 'lucide-react';

const presets = [
  { id: 'youtube', name: 'YouTube Thumbnail', size: '1280×720', ratio: '16:9', color: '#ff0000' },
  { id: 'shorts', name: 'YouTube Shorts', size: '1080×1920', ratio: '9:16', color: '#ff0000' },
  { id: 'instagram', name: 'Instagram Post', size: '1080×1080', ratio: '1:1', color: '#e4405f' },
  { id: 'reel', name: 'Instagram Reel', size: '1080×1920', ratio: '9:16', color: '#e4405f' },
  { id: 'tiktok', name: 'TikTok', size: '1080×1920', ratio: '9:16', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', size: '1200×627', ratio: '1.91:1', color: '#0077b5' },
];

const templates = [
  { id: '1', name: 'Bold Statement', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: '2', name: 'Tech Review', gradient: 'linear-gradient(135deg, #0f0c29, #302b63)' },
  { id: '3', name: 'Gaming', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
  { id: '4', name: 'Vlog', gradient: 'linear-gradient(135deg, #fc4a1a, #f7b733)' },
  { id: '5', name: 'Tutorial', gradient: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
  { id: '6', name: 'Minimalist', gradient: 'linear-gradient(135deg, #2c3e50, #4ca1af)' },
  { id: '7', name: 'Cinematic', gradient: 'linear-gradient(135deg, #141e30, #243b55)' },
  { id: '8', name: 'Neon', gradient: 'linear-gradient(135deg, #6366f1, #ec4899)' },
];

export default function ThumbnailModal() {
  const { setShowThumbnailModal, setShowNewProjectModal } = useStore();
  const [selectedPreset, setSelectedPreset] = useState('youtube');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[650px] max-h-[85vh] rounded-2xl overflow-hidden animate-scale-in flex flex-col"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
              <Image size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Thumbnail Maker</h2>
              <p className="text-xs text-gray-500">Create stunning thumbnails for any platform</p>
            </div>
          </div>
          <button className="tool-btn" onClick={() => setShowThumbnailModal(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Platform presets */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Platform</div>
            <div className="grid grid-cols-3 gap-2">
              {presets.map(preset => (
                <button
                  key={preset.id}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedPreset === preset.id
                      ? 'ring-2 ring-indigo-500'
                      : ''
                  }`}
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                  onClick={() => setSelectedPreset(preset.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: preset.color }} />
                    <span className="text-xs font-medium">{preset.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{preset.size} • {preset.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Templates</div>
            <div className="grid grid-cols-4 gap-2">
              {templates.map(template => (
                <button
                  key={template.id}
                  className={`group rounded-xl overflow-hidden transition-all hover:scale-[1.03] ${
                    selectedTemplate === template.id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  style={{ border: '1px solid var(--border)' }}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="h-24 flex items-center justify-center" style={{ background: template.gradient }}>
                    <Type size={20} className="text-white/50" />
                  </div>
                  <div className="p-2" style={{ background: 'var(--bg-tertiary)' }}>
                    <span className="text-[10px] text-gray-400 group-hover:text-white">{template.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tools</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: <Type size={16} />, name: 'Text' },
                { icon: <Grid3X3 size={16} />, name: 'Shapes' },
                { icon: <Star size={16} />, name: 'Stickers' },
                { icon: <Image size={16} />, name: 'Backgrounds' },
                { icon: <Sparkles size={16} />, name: 'AI Image' },
                { icon: <Grid3X3 size={16} />, name: 'Effects' },
                { icon: <Image size={16} />, name: 'Cutout' },
                { icon: <Layers size={16} />, name: 'Layers' },
              ].map((tool, i) => (
                <button key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all hover:bg-[var(--bg-hover)]"
                  style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="text-indigo-400">{tool.icon}</div>
                  <span className="text-[10px] text-gray-400">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button className="btn btn-secondary px-6" onClick={() => setShowThumbnailModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary px-6" onClick={() => { setShowThumbnailModal(false); setShowNewProjectModal(true); }}>
            <Sparkles size={14} /> Create Thumbnail
          </button>
        </div>
      </div>
    </div>
  );
}
