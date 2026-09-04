import { useStore } from '../../store/useStore';
import { ArrowRight } from 'lucide-react';

const transitions = [
  { id: 'fade', name: 'Fade', color: '#6366f1' },
  { id: 'dissolve', name: 'Dissolve', color: '#8b5cf6' },
  { id: 'slide', name: 'Slide', color: '#3b82f6' },
  { id: 'wipe', name: 'Wipe', color: '#06b6d4' },
  { id: 'zoom', name: 'Zoom', color: '#22c55e' },
  { id: 'push', name: 'Push', color: '#eab308' },
  { id: 'spin', name: 'Spin', color: '#f97316' },
  { id: 'blur', name: 'Blur', color: '#ef4444' },
  { id: 'glitch', name: 'Glitch', color: '#ec4899' },
  { id: 'flash', name: 'Flash', color: '#f43f5e' },
  { id: 'lightLeak', name: 'Light Leak', color: '#a855f7' },
];

export default function TransitionsPanel() {
  useStore();

  return (
    <div className="p-3 space-y-4">
      <div className="panel-header -mx-3 -mt-3 px-3 mb-0">
        <span>Transitions</span>
      </div>

      <div className="text-[10px] text-gray-500">
        Drag a transition to the timeline or click to apply to selected clip
      </div>

      {/* Duration */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-gray-400">Duration</span>
          <span className="text-[11px] text-gray-600">0.5s</span>
        </div>
        <input type="range" min="0.1" max="3" step="0.1" defaultValue="0.5" className="slider w-full" />
      </div>

      {/* Transition grid */}
      <div className="grid grid-cols-2 gap-2">
        {transitions.map(t => (
          <button
            key={t.id}
            className="group p-3 rounded-lg text-center transition-all hover:scale-[1.03] cursor-grab"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            draggable
          >
            <div className="w-full h-10 rounded mb-2 flex items-center justify-center overflow-hidden relative"
              style={{ background: `${t.color}15` }}>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded" style={{ background: t.color, opacity: 0.5 }} />
                <ArrowRight size={10} className="text-gray-500" />
                <div className="w-4 h-4 rounded" style={{ background: t.color }} />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-white">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
