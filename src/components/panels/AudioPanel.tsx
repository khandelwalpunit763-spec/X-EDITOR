import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Volume2, Music, Mic, Wand2, Upload, Plus } from 'lucide-react';

export default function AudioPanel() {
  const { selectedClipId, tracks, updateClip } = useStore();
  const [activeTab, setActiveTab] = useState<'mixer' | 'library' | 'ai'>('mixer');

  const clip = tracks.flatMap(t => t.clips).find(c => c.id === selectedClipId);

  return (
    <div className="p-3 space-y-4">
      <div className="panel-header -mx-3 -mt-3 px-3 mb-0">
        <span>Audio</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        {[
          { id: 'mixer', label: 'Mixer', icon: <Volume2 size={12} /> },
          { id: 'library', label: 'Library', icon: <Music size={12} /> },
          { id: 'ai', label: 'AI Tools', icon: <Wand2 size={12} /> },
        ].map(tab => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] transition-all ${
              activeTab === tab.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-gray-400'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'mixer' && (
        <div className="space-y-3">
          {/* Volume */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-400">Volume</span>
              <span className="text-[11px] text-gray-600">{clip?.volume ?? 100}%</span>
            </div>
            <input type="range" min="0" max="200" value={clip?.volume ?? 100}
              onChange={e => {
                if (selectedClipId) {
                  const track = tracks.find(t => t.clips.some(c => c.id === selectedClipId));
                  if (track) updateClip(track.id, selectedClipId, { volume: Number(e.target.value) });
                }
              }}
              className="slider w-full" />
          </div>

          {/* Fade */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">Fade In (s)</span>
              <input type="number" min="0" max="10" step="0.1" defaultValue="0"
                className="input w-full text-xs" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">Fade Out (s)</span>
              <input type="number" min="0" max="10" step="0.1" defaultValue="0"
                className="input w-full text-xs" />
            </div>
          </div>

          {/* Speed & Pitch */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">Speed</span>
              <select className="input w-full text-xs">
                {['0.25x', '0.5x', '1x', '1.5x', '2x', '4x'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block mb-1">Pitch</span>
              <input type="range" min="-12" max="12" defaultValue="0" className="slider w-full" />
            </div>
          </div>

          {/* Equalizer */}
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Equalizer</span>
            <div className="grid grid-cols-3 gap-2">
              {['Bass', 'Mid', 'Treble'].map(eq => (
                <div key={eq} className="text-center">
                  <input type="range" min="-12" max="12" defaultValue="0" className="slider w-full mb-1" />
                  <span className="text-[10px] text-gray-500">{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-1.5">
            {['Noise Reduction', 'Normalize', 'Remove Silence'].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-xs">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="space-y-2">
          <button className="btn btn-ghost w-full text-xs justify-start">
            <Upload size={14} /> Import Audio
          </button>
          <button className="btn btn-ghost w-full text-xs justify-start">
            <Mic size={14} /> Record Voiceover
          </button>
          <div className="border-t pt-3 mt-3" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[10px] text-gray-500 mb-2">Sound Effects</div>
            {['Transition Whoosh', 'Pop', 'Click', 'Notification', 'Applause', 'Rain'].map(sfx => (
              <button key={sfx} className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--bg-hover)] transition-colors">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-indigo-500/20">
                  <Music size={10} className="text-indigo-400" />
                </div>
                <span className="text-xs flex-1 text-left">{sfx}</span>
                <Plus size={12} className="text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-2">
          {[
            { name: 'Speech to Text', desc: 'Generate subtitles from audio', icon: <Mic size={16} /> },
            { name: 'Text to Speech', desc: 'Generate voiceover from text', icon: <Volume2 size={16} /> },
            { name: 'Noise Removal', desc: 'AI-powered background noise removal', icon: <Wand2 size={16} /> },
            { name: 'Voice Cleanup', desc: 'Enhance voice clarity', icon: <Music size={16} /> },
          ].map(tool => (
            <button key={tool.name} className="w-full p-3 rounded-lg text-left hover:bg-[var(--bg-hover)] transition-colors"
              style={{ background: 'var(--bg-tertiary)' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-indigo-400">{tool.icon}</div>
                <span className="text-xs font-medium">{tool.name}</span>
              </div>
              <p className="text-[10px] text-gray-500">{tool.desc}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
