import { useRef, useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight,
  Volume2, VolumeX, Lock, Unlock, Eye, EyeOff, Plus,
  Scissors, Copy, Maximize2, ZoomIn, ZoomOut,
  Film, Image, Type, Volume2 as AudioIcon,
  Sparkles
} from 'lucide-react';

interface Props {
  height: number;
}

const trackIcons: Record<string, React.ReactNode> = {
  video: <Film size={11} />,
  image: <Image size={11} />,
  text: <Type size={11} />,
  audio: <AudioIcon size={11} />,
  effect: <Sparkles size={11} />,
};

const trackColors: Record<string, string> = {
  video: '#00d9c0',
  image: '#f97316',
  text: '#22c55e',
  audio: '#eab308',
  effect: '#00b8a3',
};

export default function Timeline({ height }: Props) {
  const { 
    tracks, currentTime, setCurrentTime, isPlaying, setIsPlaying,
    selectedClipId, setSelectedClipId, splitClip,
    duplicateClip, addTrack, updateTrack, timelineZoom,
    setTimelineZoom, project
  } = useStore();

  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const totalDuration = 60; // Default 60 seconds
  const pixelsPerSecond = 80 * timelineZoom;
  const totalWidth = totalDuration * pixelsPerSecond;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = Math.floor((seconds % 1) * (project?.fps || 30));
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${f.toString().padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    setCurrentTime(x / pixelsPerSecond);
  };

  const handleScrub = (e: React.MouseEvent) => {
    if (!scrubbing || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    setCurrentTime(Math.max(0, x / pixelsPerSecond));
  };

  // Playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const state = useStore.getState();
      const newTime = state.currentTime + 1 / (project?.fps || 30);
      if (newTime >= totalDuration) {
        setIsPlaying(false);
        setCurrentTime(0);
      } else {
        setCurrentTime(newTime);
      }
    }, 1000 / (project?.fps || 30));
    return () => clearInterval(interval);
  }, [isPlaying, project?.fps]);

  // Keyboard shortcuts for playback
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsPlaying(!useStore.getState().isPlaying);
      }
      if (e.code === 'ArrowLeft') {
        setCurrentTime(Math.max(0, useStore.getState().currentTime - 1 / (project?.fps || 30)));
      }
      if (e.code === 'ArrowRight') {
        setCurrentTime(useStore.getState().currentTime + 1 / (project?.fps || 30));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const playheadX = currentTime * pixelsPerSecond;

  return (
    <div className="flex flex-col flex-shrink-0 border-t overflow-hidden" 
      style={{ height, background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      {/* Transport Controls */}
      <div className="h-9 flex items-center justify-between px-3 border-b flex-shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-1">
          <button className="tool-btn w-7 h-7" onClick={() => setCurrentTime(0)}>
            <SkipBack size={14} />
          </button>
          <button className="tool-btn w-7 h-7" onClick={() => setCurrentTime(Math.max(0, currentTime - 1/(project?.fps || 30)))}>
            <ChevronLeft size={14} />
          </button>
          <button 
            className="tool-btn w-8 h-8 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <button className="tool-btn w-7 h-7" onClick={() => setCurrentTime(currentTime + 1/(project?.fps || 30))}>
            <ChevronRight size={14} />
          </button>
          <button className="tool-btn w-7 h-7" onClick={() => setCurrentTime(totalDuration)}>
            <SkipForward size={14} />
          </button>
        </div>

        {/* Timecode display */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-gray-300 bg-[var(--bg-primary)] px-2 sm:px-3 py-1 rounded">
            {formatTime(currentTime)}
          </div>
          <div className="text-[10px] text-gray-600 hidden sm:block">/</div>
          <div className="text-xs font-mono text-gray-500 hidden sm:block">
            {formatTime(totalDuration)}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-1 mr-2 text-[10px] text-gray-500">
            <span>{project?.fps || 30} FPS</span>
          </div>
          <button className="tool-btn w-7 h-7" onClick={() => setTimelineZoom(timelineZoom - 0.2)}>
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] text-gray-500 w-8 text-center">{Math.round(timelineZoom * 100)}%</span>
          <button className="tool-btn w-7 h-7" onClick={() => setTimelineZoom(timelineZoom + 0.2)}>
            <ZoomIn size={14} />
          </button>
          <div className="w-px h-4 mx-1 hidden sm:block" style={{ background: 'var(--border)' }} />
          <button className="tool-btn w-7 h-7 hidden sm:flex" title="Snap">
            <Maximize2 size={14} />
          </button>
          <button className="tool-btn w-7 h-7 hidden sm:flex" title="Ripple Delete">
            <Scissors size={14} />
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track Headers */}
        <div className="w-24 sm:w-40 flex-shrink-0 overflow-y-auto border-r" style={{ borderColor: 'var(--border)' }}>
          {/* Time ruler header spacer */}
          <div className="h-6 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }} />
          
          {tracks.map(track => (
            <div 
              key={track.id} 
              className="flex items-center gap-1.5 px-2 border-b"
              style={{ 
                height: track.height, 
                borderColor: 'var(--border)',
                background: 'var(--bg-secondary)'
              }}
            >
              <button 
                className="tool-btn w-5 h-5 flex-shrink-0"
                onClick={() => updateTrack(track.id, { visible: !track.visible })}
              >
                {track.visible ? <Eye size={10} /> : <EyeOff size={10} className="text-gray-600" />}
              </button>
              <button 
                className="tool-btn w-5 h-5 flex-shrink-0"
                onClick={() => updateTrack(track.id, { locked: !track.locked })}
              >
                {track.locked ? <Lock size={10} className="text-yellow-500" /> : <Unlock size={10} className="text-gray-600" />}
              </button>
              
              <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: `${trackColors[track.type]}25`, color: trackColors[track.type] }}>
                {trackIcons[track.type]}
              </div>
              
              <span className="text-[10px] flex-1 truncate">{track.name}</span>
              
              {track.type === 'audio' && (
                <button 
                  className="tool-btn w-4 h-4 flex-shrink-0"
                  onClick={() => updateTrack(track.id, { muted: !track.muted })}
                >
                  {track.muted ? <VolumeX size={9} className="text-red-400" /> : <Volume2 size={9} className="text-gray-500" />}
                </button>
              )}
            </div>
          ))}
          
          {/* Add track button */}
          <div className="px-2 py-1">
            <button className="btn btn-ghost w-full text-[10px] justify-start h-6"
              onClick={() => addTrack('video')}>
              <Plus size={10} /> Add Track
            </button>
          </div>
        </div>

        {/* Timeline tracks area */}
        <div 
          ref={timelineRef}
          className="flex-1 overflow-auto relative"
          onMouseDown={(e) => { setScrubbing(true); handleTimelineClick(e); }}
          onMouseMove={handleScrub}
          onMouseUp={() => setScrubbing(false)}
          onMouseLeave={() => setScrubbing(false)}
        >
          {/* Time ruler */}
          <div className="h-6 sticky top-0 z-10 border-b flex" 
            style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)', width: totalWidth }}>
            {Array.from({ length: totalDuration + 1 }, (_, i) => (
              <div key={i} className="flex-shrink-0 relative" style={{ width: pixelsPerSecond }}>
                <div className="absolute left-0 bottom-0 w-px h-2" style={{ background: 'var(--border-light)' }} />
                {i % (timelineZoom < 0.5 ? 5 : 1) === 0 && (
                  <span className="absolute left-1 bottom-0 text-[9px] text-gray-600">
                    {Math.floor(i/60)}:{(i%60).toString().padStart(2,'0')}
                  </span>
                )}
                {/* Half-second tick */}
                <div className="absolute left-1/2 bottom-0 w-px h-1" style={{ background: 'var(--border)' }} />
              </div>
            ))}
          </div>

          {/* Tracks */}
          <div className="relative" style={{ width: totalWidth }}>
            {tracks.map(track => (
              <div 
                key={track.id} 
                className="relative border-b"
                style={{ height: track.height, borderColor: 'var(--border)' }}
              >
                {/* Track background */}
                <div className="absolute inset-0 opacity-30" 
                  style={{ background: `${trackColors[track.type]}08` }} />
                
                {/* Clips */}
                {track.clips.map(clip => (
                  <div
                    key={clip.id}
                    className={`absolute top-1 bottom-1 rounded-md cursor-pointer transition-shadow flex items-center overflow-hidden ${
                      selectedClipId === clip.id 
                        ? 'ring-2 ring-white/50 shadow-lg' 
                        : 'hover:brightness-110'
                    }`}
                    style={{
                      left: clip.startTime * pixelsPerSecond,
                      width: Math.max(20, clip.duration * pixelsPerSecond),
                      background: `linear-gradient(135deg, ${trackColors[track.type]}60, ${trackColors[track.type]}30)`,
                      borderLeft: `2px solid ${trackColors[track.type]}`,
                    }}
                    onClick={(e) => { e.stopPropagation(); setSelectedClipId(clip.id); }}
                  >
                    {/* Transition indicator left */}
                    {clip.transitions?.in && (
                      <div className="absolute left-0 top-0 bottom-0 w-3"
                        style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.2), transparent)' }} />
                    )}
                    
                    <span className="text-[9px] px-2 truncate text-white/80">{clip.name}</span>
                    
                    {/* Clip actions */}
                    {selectedClipId === clip.id && clip.duration * pixelsPerSecond > 60 && (
                      <div className="flex items-center gap-0.5 ml-auto pr-1">
                        <button className="w-4 h-4 rounded bg-black/30 flex items-center justify-center hover:bg-black/50"
                          onClick={(e) => { e.stopPropagation(); splitClip(track.id, clip.id, currentTime); }}>
                          <Scissors size={8} />
                        </button>
                        <button className="w-4 h-4 rounded bg-black/30 flex items-center justify-center hover:bg-black/50"
                          onClick={(e) => { e.stopPropagation(); duplicateClip(track.id, clip.id); }}>
                          <Copy size={8} />
                        </button>
                      </div>
                    )}
                    
                    {/* Transition indicator right */}
                    {clip.transitions?.out && (
                      <div className="absolute right-0 top-0 bottom-0 w-3"
                        style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.2), transparent)' }} />
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-px z-20 pointer-events-none"
              style={{ left: playheadX, background: '#ef4444' }}
            >
              <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-6 flex items-center justify-between px-3 border-t flex-shrink-0 text-[10px] text-gray-600"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}>
        <div className="flex items-center gap-3">
          <span>{tracks.length} tracks</span>
          <span>•</span>
          <span>{tracks.reduce((acc, t) => acc + t.clips.length, 0)} clips</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Snap: On</span>
          <span>•</span>
          <span>Ripple: Off</span>
        </div>
      </div>
    </div>
  );
}
