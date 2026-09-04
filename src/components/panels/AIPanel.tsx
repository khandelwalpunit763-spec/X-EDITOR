import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Wand2, Image, Type, Music, Layers, Sparkles, Eraser, ChevronRight } from 'lucide-react';

const aiTools = [
  { id: 'bgRemove', name: 'Background Remover', desc: 'Remove background from images/videos', icon: <Layers size={18} />, category: 'photo', color: '#6366f1' },
  { id: 'bgReplace', name: 'Background Replace', desc: 'Replace background with AI', icon: <Image size={18} />, category: 'photo', color: '#8b5cf6' },
  { id: 'objectRemove', name: 'Object Removal', desc: 'Remove objects from content', icon: <Eraser size={18} />, category: 'photo', color: '#a855f7' },
  { id: 'upscale', name: 'Image Upscaler', desc: 'Enhance resolution 2x-4x', icon: <Sparkles size={18} />, category: 'photo', color: '#d946ef' },
  { id: 'enhance', name: 'Auto Enhance', desc: 'One-click image enhancement', icon: <Wand2 size={18} />, category: 'photo', color: '#ec4899' },
  { id: 'faceBlur', name: 'Face Blur', desc: 'Automatically detect and blur faces', icon: <Image size={18} />, category: 'photo', color: '#f43f5e' },
  { id: 'smartCrop', name: 'Smart Crop', desc: 'AI-powered intelligent cropping', icon: <Image size={18} />, category: 'photo', color: '#f97316' },
  { id: 'autoColor', name: 'Auto Color', desc: 'Automatic color correction', icon: <Wand2 size={18} />, category: 'photo', color: '#eab308' },
  { id: 'textGen', name: 'Text to Image', desc: 'Generate images from text', icon: <Type size={18} />, category: 'gen', color: '#22c55e' },
  { id: 'autoCaption', name: 'Auto Captions', desc: 'Generate subtitles from audio', icon: <Type size={18} />, category: 'video', color: '#14b8a6' },
  { id: 'noiseRemove', name: 'Noise Removal', desc: 'Remove audio background noise', icon: <Music size={18} />, category: 'audio', color: '#3b82f6' },
  { id: 'silence', name: 'Silence Removal', desc: 'Remove silent parts automatically', icon: <Music size={18} />, category: 'audio', color: '#6366f1' },
];

export default function AIPanel() {
  const { setShowAIModal } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'photo', label: 'Photo' },
    { id: 'video', label: 'Video' },
    { id: 'audio', label: 'Audio' },
    { id: 'gen', label: 'Generate' },
  ];

  const filteredTools = activeCategory === 'all' 
    ? aiTools 
    : aiTools.filter(t => t.category === activeCategory);

  return (
    <div className="p-3 space-y-4">
      <div className="panel-header -mx-3 -mt-3 px-3 mb-0">
        <span>AI Tools</span>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`px-2 py-1 rounded text-[10px] transition-all ${
              activeCategory === cat.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-gray-400'
            }`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Authorization notice */}
      <div className="p-2 rounded-lg text-[10px] leading-relaxed"
        style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.2)', color: '#eab308' }}>
        ⚠️ AI removal tools should only be used on content you own or have permission to modify.
      </div>

      {/* AI Tools list */}
      <div className="space-y-1.5">
        {filteredTools.map(tool => (
          <button
            key={tool.id}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all hover:scale-[1.01]"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            onClick={() => setShowAIModal(true)}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${tool.color}20`, color: tool.color }}>
              {tool.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{tool.name}</div>
              <div className="text-[10px] text-gray-500 truncate">{tool.desc}</div>
            </div>
            <ChevronRight size={14} className="text-gray-600 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
