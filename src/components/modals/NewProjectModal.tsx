import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Monitor, Smartphone, Square, Film, Sparkles } from 'lucide-react';

const aspectRatios = [
  { id: '16:9', label: 'YouTube', w: 1920, h: 1080, icon: <Monitor size={16} /> },
  { id: '9:16', label: 'Shorts/Reels', w: 1080, h: 1920, icon: <Smartphone size={16} /> },
  { id: '1:1', label: 'Instagram', w: 1080, h: 1080, icon: <Square size={16} /> },
  { id: '4:5', label: 'Instagram', w: 1080, h: 1350, icon: <Square size={16} /> },
  { id: '21:9', label: 'Cinematic', w: 2560, h: 1080, icon: <Film size={16} /> },
  { id: 'custom', label: 'Custom', w: 1920, h: 1080, icon: <Sparkles size={16} /> },
];

const resolutions = [
  { id: '720p', label: '720p', w: 1280, h: 720 },
  { id: '1080p', label: '1080p', w: 1920, h: 1080 },
  { id: '1440p', label: '1440p', w: 2560, h: 1440 },
  { id: '4k', label: '4K', w: 3840, h: 2160 },
];

const frameRates = [24, 25, 30, 50, 60];

export default function NewProjectModal() {
  const { setShowNewProjectModal, createProject } = useStore();
  const [name, setName] = useState('Untitled Project');
  const [selectedRatio, setSelectedRatio] = useState('16:9');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [fps, setFps] = useState(30);
  const [bgType, setBgType] = useState<'transparent' | 'solid' | 'gradient' | 'image' | 'video'>('solid');
  const [bgColor, setBgColor] = useState('#000000');
  const [gradientFrom, setGradientFrom] = useState('#00d9c0');
  const [gradientTo, setGradientTo] = useState('#00b8a3');

  const handleRatioSelect = (ratio: typeof aspectRatios[0]) => {
    setSelectedRatio(ratio.id);
    if (ratio.id !== 'custom') {
      setWidth(ratio.w);
      setHeight(ratio.h);
    }
  };

  const handleResolutionSelect = (res: typeof resolutions[0]) => {
    setWidth(res.w);
        setHeight(res.h);
  };

  const handleCreate = () => {
    createProject({
      name,
      width,
      height,
      fps,
      aspectRatio: selectedRatio,
      background: bgType === 'solid' ? { type: 'solid', color: bgColor } :
                  bgType === 'gradient' ? { type: 'gradient', gradient: { from: gradientFrom, to: gradientTo, angle: 135 } } :
                  { type: bgType },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" 
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[580px] max-h-[90vh] rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-lg font-bold">New Project</h2>
            <p className="text-xs text-gray-500 mt-0.5">Configure your project settings</p>
          </div>
          <button className="tool-btn" onClick={() => setShowNewProjectModal(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5">
          {/* Project Name */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-2">Project Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="input w-full text-sm"
              placeholder="Enter project name..."
            />
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map(ratio => (
                <button
                  key={ratio.id}
                  className={`p-3 rounded-xl text-center transition-all ${
                    selectedRatio === ratio.id
                      ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20'
                      : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white hover:bg-[var(--bg-hover)]'
                  }`}
                  onClick={() => handleRatioSelect(ratio)}
                >
                  <div className="flex justify-center mb-1.5">{ratio.icon}</div>
                  <div className="text-xs font-medium">{ratio.id}</div>
                  <div className="text-[10px] opacity-70">{ratio.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-2">Resolution</label>
            <div className="flex gap-2">
              {resolutions.map(res => (
                <button
                  key={res.id}
                  className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                    width === res.w && height === res.h
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white'
                  }`}
                  onClick={() => handleResolutionSelect(res)}
                >
                  {res.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-3">
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 block mb-1">Width</label>
                <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))}
                  className="input w-full text-xs" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-gray-500 block mb-1">Height</label>
                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))}
                  className="input w-full text-xs" />
              </div>
            </div>
          </div>

          {/* Frame Rate */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-2">Frame Rate</label>
            <div className="flex gap-2">
              {frameRates.map(rate => (
                <button
                  key={rate}
                  className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                    fps === rate
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setFps(rate)}
                >
                  {rate} FPS
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-2">Background</label>
            <div className="flex gap-2 mb-3">
              {[
                { id: 'transparent', label: 'Transparent' },
                { id: 'solid', label: 'Solid Color' },
                { id: 'gradient', label: 'Gradient' },
              ].map(bg => (
                <button
                  key={bg.id}
                  className={`flex-1 py-2 rounded-lg text-xs transition-all ${
                    bgType === bg.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setBgType(bg.id as any)}
                >
                  {bg.label}
                </button>
              ))}
            </div>

            {bgType === 'solid' && (
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  className="input flex-1 text-xs font-mono" />
              </div>
            )}

            {bgType === 'gradient' && (
              <div className="flex items-center gap-3">
                <input type="color" value={gradientFrom} onChange={e => setGradientFrom(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <span className="text-xs text-gray-500">→</span>
                <input type="color" value={gradientTo} onChange={e => setGradientTo(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <div className="flex-1 h-10 rounded-lg" 
                  style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <button className="btn btn-secondary px-6" onClick={() => setShowNewProjectModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary px-6" onClick={handleCreate}>
            <Sparkles size={14} /> Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
