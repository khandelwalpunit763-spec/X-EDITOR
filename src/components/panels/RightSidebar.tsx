import { useStore } from '../../store/useStore';
import type { RightPanel } from '../../types';
import PropertiesPanel from './PropertiesPanel';
import LayersPanel from './LayersPanel';
import ColorPanel from './ColorPanel';
import EffectsPanel from './EffectsPanel';
import FiltersPanel from './FiltersPanel';
import TextPanel from './TextPanel';
import AudioPanel from './AudioPanel';
import TransitionsPanel from './TransitionsPanel';
import AIPanel from './AIPanel';
import ExportPanel from './ExportPanel';

interface Props {
  width: number;
}

const tabs: { id: RightPanel; label: string }[] = [
  { id: 'properties', label: 'Prop' },
  { id: 'layers', label: 'Layers' },
  { id: 'color', label: 'Color' },
  { id: 'effects', label: 'FX' },
  { id: 'filters', label: 'Filters' },
  { id: 'text', label: 'Text' },
  { id: 'audio', label: 'Audio' },
  { id: 'transitions', label: 'Trans' },
  { id: 'ai', label: 'AI' },
  { id: 'export', label: 'Export' },
];

export default function RightSidebar({ width }: Props) {
  const { activePanel, setActivePanel } = useStore();

  const renderPanel = () => {
    switch (activePanel) {
      case 'properties': return <PropertiesPanel />;
      case 'layers': return <LayersPanel />;
      case 'color': return <ColorPanel />;
      case 'effects': return <EffectsPanel />;
      case 'filters': return <FiltersPanel />;
      case 'text': return <TextPanel />;
      case 'audio': return <AudioPanel />;
      case 'transitions': return <TransitionsPanel />;
      case 'ai': return <AIPanel />;
      case 'export': return <ExportPanel />;
      default: return <PropertiesPanel />;
    }
  };

  return (
    <div className="flex-shrink-0 flex flex-col overflow-hidden border-l" 
      style={{ width, background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      {/* Tab Bar */}
      <div className="flex flex-wrap border-b px-1 py-1 gap-0.5" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              activePanel === tab.id
                ? 'bg-[var(--accent)] text-white'
                : 'text-gray-500 hover:text-gray-300 hover:bg-[var(--bg-hover)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {renderPanel()}
      </div>
    </div>
  );
}
