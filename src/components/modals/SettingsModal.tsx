import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Monitor, Palette, Keyboard, Save, HardDrive } from 'lucide-react';

export default function SettingsModal() {
  const { setShowSettingsModal, project } = useStore();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: <Monitor size={14} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard size={14} /> },
    { id: 'storage', label: 'Storage', icon: <HardDrive size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[600px] h-[500px] rounded-2xl overflow-hidden flex flex-col animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold">Settings</h2>
          <button className="tool-btn" onClick={() => setShowSettingsModal(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-44 border-r p-3 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-xs transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[var(--bg-hover)]'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-2">Project Name</label>
                  <input type="text" defaultValue={project?.name || 'Untitled'} className="input w-full text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Width</label>
                    <input type="number" defaultValue={project?.width || 1920} className="input w-full text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-2">Height</label>
                    <input type="number" defaultValue={project?.height || 1080} className="input w-full text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-2">Frame Rate</label>
                  <select defaultValue={project?.fps || 30} className="input w-full text-sm">
                    <option value={24}>24 FPS</option>
                    <option value={25}>25 FPS</option>
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Enable auto-save (every 5 minutes)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Show tooltips</span>
                </label>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-4 rounded-xl border-2 border-[var(--accent)] text-center">
                      <div className="w-full h-8 rounded mb-2" style={{ background: '#0f0f14' }} />
                      <span className="text-xs">Dark</span>
                    </button>
                    <button className="p-4 rounded-xl border text-center" style={{ borderColor: 'var(--border)' }}>
                      <div className="w-full h-8 rounded mb-2" style={{ background: '#f8f9fa' }} />
                      <span className="text-xs">Light</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-2">Accent Color</label>
                  <div className="flex gap-2">
                    {['#00d9c0', '#14b8a6', '#3b82f6', '#06b6d4', '#22c55e', '#f97316', '#ef4444', '#ec4899'].map(color => (
                      <button key={color} className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white/30 transition-all"
                        style={{ background: color }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-2">UI Scale</label>
                  <input type="range" min="80" max="120" defaultValue="100" className="slider w-full" />
                </div>
              </div>
            )}

            {activeTab === 'shortcuts' && (
              <div className="space-y-2">
                {[
                  { action: 'Undo', shortcut: 'Ctrl + Z' },
                  { action: 'Redo', shortcut: 'Ctrl + Shift + Z' },
                  { action: 'Save', shortcut: 'Ctrl + S' },
                  { action: 'Export', shortcut: 'Ctrl + E' },
                  { action: 'Play/Pause', shortcut: 'Space' },
                  { action: 'Delete', shortcut: 'Delete' },
                  { action: 'Copy', shortcut: 'Ctrl + C' },
                  { action: 'Paste', shortcut: 'Ctrl + V' },
                  { action: 'Duplicate', shortcut: 'Ctrl + D' },
                  { action: 'Select Tool', shortcut: 'V' },
                  { action: 'Brush Tool', shortcut: 'B' },
                  { action: 'Eraser Tool', shortcut: 'E' },
                ].map(s => (
                  <div key={s.action} className="flex items-center justify-between py-2 px-3 rounded hover:bg-[var(--bg-hover)]">
                    <span className="text-xs">{s.action}</span>
                    <kbd className="text-[10px] px-2 py-1 rounded bg-[var(--bg-tertiary)] text-gray-400 font-mono">{s.shortcut}</kbd>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-xs text-gray-400">3.5 GB / 10 GB</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-gray-800">
                    <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: '35%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Projects', size: '1.2 GB' },
                    { name: 'Media Files', size: '2.1 GB' },
                    { name: 'Exports', size: '0.2 GB' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                      <span className="text-xs">{item.name}</span>
                      <span className="text-xs text-gray-400">{item.size}</span>
                    </div>
                  ))}
                </div>
                <button className="btn btn-danger text-xs">
                  Clear Cache
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button className="btn btn-secondary px-6" onClick={() => setShowSettingsModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary px-6" onClick={() => setShowSettingsModal(false)}>
            <Save size={14} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
