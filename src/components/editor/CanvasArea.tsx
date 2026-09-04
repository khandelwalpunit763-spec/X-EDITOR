import { useRef, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  ZoomIn, ZoomOut, Maximize, Grid3X3, Monitor, RotateCcw
} from 'lucide-react';

export default function CanvasArea() {
  const { 
    zoom, setZoom, project, showGrid, setShowGrid, 
    showGuides, showSafeZones, layers, selectedLayerId,
    setSelectedLayerId, activeTool
  } = useStore();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const projW = project?.width || 1920;
  const projH = project?.height || 1080;

  // Simulate playback
  useEffect(() => {
    const { isPlaying } = useStore.getState();
    if (!isPlaying) return;
    const interval = setInterval(() => {
      useStore.getState().setCurrentTime(useStore.getState().currentTime + 1/30);
    }, 1000/30);
    return () => clearInterval(interval);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom(zoom + delta);
    }
  };

  const scale = zoom / 100;
  const displayW = projW * scale;
  const displayH = projH * scale;

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 overflow-hidden relative"
        onWheel={handleWheel}
        style={{ cursor: activeTool === 'hand' ? 'grab' : activeTool === 'zoom' ? 'zoom-in' : 'default' }}
      >
        {/* Center canvas */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}>
          <div 
            className="relative shadow-2xl"
            style={{ 
              width: displayW, 
              height: displayH,
              background: project?.background?.type === 'solid' ? project.background.color : 
                          project?.background?.type === 'gradient' ? 
                          `linear-gradient(${project.background.gradient?.angle || 0}deg, ${project.background.gradient?.from || '#000'}, ${project.background.gradient?.to || '#333'})` :
                          '#1a1a2e',
              minWidth: 200,
              minHeight: 120,
            }}
          >
            {/* Grid overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: `${20 * scale}px ${20 * scale}px`
              }} />
            )}
            
            {/* Safe zones */}
            {showSafeZones && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute border border-dashed border-yellow-500/30"
                  style={{ top: '10%', left: '10%', right: '10%', bottom: '10%' }} />
                <div className="absolute border border-dashed border-red-500/20"
                  style={{ top: '5%', left: '5%', right: '5%', bottom: '5%' }} />
              </div>
            )}

            {/* Guides */}
            {showGuides && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/30" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-500/30" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-cyan-500/15" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-cyan-500/15" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-cyan-500/15" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-cyan-500/15" />
              </div>
            )}

            {/* Render layers */}
            {layers.filter(l => l.visible).map(layer => (
              <div
                key={layer.id}
                className={`absolute cursor-move transition-shadow ${
                  selectedLayerId === layer.id ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                }`}
                style={{
                  left: layer.x * scale,
                  top: layer.y * scale,
                  width: layer.width * scale,
                  height: layer.height * scale,
                  opacity: layer.opacity / 100,
                  transform: `rotate(${layer.rotation}deg) scaleX(${layer.scaleX}) scaleY(${layer.scaleY})`,
                  mixBlendMode: layer.blendMode as any,
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedLayerId(layer.id); }}
              >
                {layer.type === 'text' && layer.text && (
                  <div className="w-full h-full flex items-center justify-center p-2"
                    style={{
                      fontFamily: layer.text.fontFamily,
                      fontSize: layer.text.fontSize * scale,
                      fontWeight: layer.text.fontWeight,
                      fontStyle: layer.text.fontStyle,
                      color: layer.text.color,
                      textAlign: layer.text.align,
                      letterSpacing: layer.text.letterSpacing,
                      lineHeight: layer.text.lineHeight,
                      textDecoration: layer.text.textDecoration,
                      WebkitTextStroke: layer.text.stroke ? `${layer.text.stroke.width}px ${layer.text.stroke.color}` : undefined,
                      textShadow: layer.text.shadow ? `${layer.text.shadow.x}px ${layer.text.shadow.y}px ${layer.text.shadow.blur}px ${layer.text.shadow.color}` : undefined,
                    }}>
                    {layer.text.content}
                  </div>
                )}
                {layer.type === 'shape' && layer.shape && (
                  <div className="w-full h-full" style={{
                    background: layer.shape.fill,
                    borderRadius: layer.shape.type === 'ellipse' ? '50%' : layer.shape.cornerRadius ? `${layer.shape.cornerRadius}px` : undefined,
                    border: layer.shape.stroke ? `${layer.shape.stroke.width}px solid ${layer.shape.stroke.color}` : undefined,
                  }} />
                )}
                {layer.type === 'image' && layer.src && (
                  <img src={layer.src} className="w-full h-full object-contain" alt="" draggable={false} />
                )}
              </div>
            ))}

            {/* Empty state */}
            {layers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">{projW} × {projH}</div>
                  <div className="text-[11px] text-gray-700">Drop media here or use tools</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas info overlays */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[10px] text-gray-600 px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.5)' }}>
            {Math.round(zoom)}%
          </span>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1">
          <button className={`tool-btn w-7 h-7 ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid(!showGrid)}>
            <Grid3X3 size={14} />
          </button>
          <button className={`tool-btn w-7 h-7 ${showSafeZones ? 'active' : ''}`} onClick={() => useStore.getState().setShowSafeZones(!showSafeZones)}>
            <Monitor size={14} />
          </button>
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="h-9 flex items-center justify-between px-3 border-t flex-shrink-0"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-1">
          <button className="tool-btn w-7 h-7" onClick={() => setZoom(zoom - 10)}>
            <ZoomOut size={14} />
          </button>
          <input
            type="range"
            min="10"
            max="500"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="slider w-24"
          />
          <button className="tool-btn w-7 h-7" onClick={() => setZoom(zoom + 10)}>
            <ZoomIn size={14} />
          </button>
          <span className="text-[11px] text-gray-500 w-10 text-center">{Math.round(zoom)}%</span>
          <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />
          <button className="tool-btn w-7 h-7" onClick={() => { setZoom(100); setPanOffset({ x: 0, y: 0 }); }}>
            <Maximize size={14} />
          </button>
          <button className="tool-btn w-7 h-7" onClick={() => setZoom(100)}>
            <RotateCcw size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <span>{projW}×{projH}</span>
          <span>•</span>
          <span>{project?.fps || 30} FPS</span>
          <span>•</span>
          <span>Layer {layers.findIndex(l => l.id === selectedLayerId) + 1 || '—'}/{layers.length}</span>
        </div>
      </div>
    </div>
  );
}
