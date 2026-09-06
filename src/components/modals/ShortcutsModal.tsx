import { useStore } from '../../store/useStore';
import { X, Keyboard } from 'lucide-react';

const shortcuts = [
  { category: 'General', items: [
    { action: 'Undo', keys: 'Ctrl + Z' },
    { action: 'Redo', keys: 'Ctrl + Shift + Z' },
    { action: 'Save', keys: 'Ctrl + S' },
    { action: 'Open', keys: 'Ctrl + O' },
    { action: 'Export', keys: 'Ctrl + E' },
    { action: 'Copy', keys: 'Ctrl + C' },
    { action: 'Paste', keys: 'Ctrl + V' },
    { action: 'Duplicate', keys: 'Ctrl + D' },
    { action: 'Delete', keys: 'Delete' },
    { action: 'Select All', keys: 'Ctrl + A' },
  ]},
  { category: 'Tools', items: [
    { action: 'Select Tool', keys: 'V' },
    { action: 'Move Tool', keys: 'M' },
    { action: 'Crop Tool', keys: 'C' },
    { action: 'Brush Tool', keys: 'B' },
    { action: 'Eraser Tool', keys: 'E' },
    { action: 'Text Tool', keys: 'T' },
    { action: 'Pen Tool', keys: 'P' },
    { action: 'Hand Tool', keys: 'H' },
    { action: 'Zoom Tool', keys: 'Z' },
  ]},
  { category: 'Playback', items: [
    { action: 'Play / Pause', keys: 'Space' },
    { action: 'Previous Frame', keys: '←' },
    { action: 'Next Frame', keys: '→' },
    { action: 'Go to Start', keys: 'Home' },
    { action: 'Go to End', keys: 'End' },
  ]},
  { category: 'Timeline', items: [
    { action: 'Split Clip', keys: 'S' },
    { action: 'Delete Clip', keys: 'Delete' },
    { action: 'Zoom In', keys: '=' },
    { action: 'Zoom Out', keys: '-' },
    { action: 'Zoom to Fit', keys: 'Ctrl + 0' },
  ]},
];

export default function ShortcutsModal() {
  const { setShowShortcutsModal } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[560px] max-h-[80vh] rounded-2xl overflow-hidden flex flex-col animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Keyboard size={20} className="text-[var(--accent)]" />
            <h2 className="text-lg font-bold">Keyboard Shortcuts</h2>
          </div>
          <button className="tool-btn" onClick={() => setShowShortcutsModal(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {shortcuts.map(group => (
            <div key={group.category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{group.category}</h3>
              <div className="space-y-1">
                {group.items.map(item => (
                  <div key={item.action} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[var(--bg-hover)]">
                    <span className="text-xs text-gray-300">{item.action}</span>
                    <kbd className="text-[10px] px-2 py-1 rounded bg-[var(--bg-tertiary)] text-gray-400 font-mono border"
                      style={{ borderColor: 'var(--border)' }}>
                      {item.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
