import { useStore } from '../../store/useStore';
import { 
  MousePointer2, Move, Crop, Maximize, Paintbrush, Eraser, Square, Type, 
  Pen, Copy, Droplets, Scissors, Wand2, Pipette, Hand, ZoomIn,
  ImageMinus, Sparkles
} from 'lucide-react';
import type { Tool } from '../../types';

interface ToolItem {
  id: Tool;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}

const tools: (ToolItem | 'divider')[] = [
  { id: 'select', icon: <MousePointer2 size={18} />, label: 'Select', shortcut: 'V' },
  { id: 'move', icon: <Move size={18} />, label: 'Move', shortcut: 'M' },
  'divider',
  { id: 'crop', icon: <Crop size={18} />, label: 'Crop', shortcut: 'C' },
  { id: 'resize', icon: <Maximize size={18} />, label: 'Resize' },
  'divider',
  { id: 'brush', icon: <Paintbrush size={18} />, label: 'Brush', shortcut: 'B' },
  { id: 'eraser', icon: <Eraser size={18} />, label: 'Eraser', shortcut: 'E' },
  { id: 'pen', icon: <Pen size={18} />, label: 'Pen Tool', shortcut: 'P' },
  'divider',
  { id: 'shape', icon: <Square size={18} />, label: 'Shape' },
  { id: 'text', icon: <Type size={18} />, label: 'Text', shortcut: 'T' },
  'divider',
  { id: 'clone', icon: <Copy size={18} />, label: 'Clone Stamp' },
  { id: 'blur', icon: <Droplets size={18} />, label: 'Blur' },
  { id: 'removeObject', icon: <Scissors size={18} />, label: 'Remove Object' },
  'divider',
  { id: 'magicSelection', icon: <Wand2 size={18} />, label: 'Magic Selection' },
  { id: 'backgroundRemover', icon: <ImageMinus size={18} />, label: 'BG Remover' },
  { id: 'colorPicker', icon: <Pipette size={18} />, label: 'Color Picker' },
  'divider',
  { id: 'hand', icon: <Hand size={18} />, label: 'Hand Tool', shortcut: 'H' },
  { id: 'zoom', icon: <ZoomIn size={18} />, label: 'Zoom', shortcut: 'Z' },
];

export default function LeftToolbar() {
  const { activeTool, setActiveTool, setShowAIModal } = useStore();

  return (
    <div className="w-12 flex-shrink-0 flex flex-col items-center py-2 gap-0.5 border-r overflow-y-auto"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      {tools.map((tool, i) => {
        if (tool === 'divider') {
          return <div key={`d-${i}`} className="w-6 h-px my-1" style={{ background: 'var(--border)' }} />;
        }
        return (
          <button
            key={tool.id}
            className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => setActiveTool(tool.id)}
          >
            {tool.icon}
            <div className="tooltip">
              {tool.label}{tool.shortcut ? ` (${tool.shortcut})` : ''}
            </div>
          </button>
        );
      })}
      
      <div className="w-6 h-px my-1" style={{ background: 'var(--border)' }} />
      
      {/* AI Tools quick access */}
      <button className="tool-btn" onClick={() => setShowAIModal(true)}>
        <Sparkles size={18} />
        <div className="tooltip">AI Tools</div>
      </button>
    </div>
  );
}
