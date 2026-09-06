import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/authStore';
import BackButton from '../common/BackButton';
import {
  Plus, FolderOpen, Save, Undo2, Redo2, Upload, Download, Share2,
  Settings, HelpCircle, Zap, ChevronDown, Monitor, LogIn, LogOut, Users,
  Grid3X3, Ruler, Magnet, Smartphone, Tablet, MonitorCheck
} from 'lucide-react';

export default function TopBar() {
  const { 
    project, undo, redo, setShowNewProjectModal, setShowExportModal,
    setShowImportModal, setShowSettingsModal,
    setShowShortcutsModal, showGrid, setShowGrid,
    showGuides, setShowGuides, showSafeZones, setShowSafeZones,
    snapToObjects, setSnapToObjects, setZoom
  } = useStore();
  const { user, isAuthenticated, signOut, signInWithGoogle } = useAuthStore();

  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const menuItems = [
    { label: 'New Project', icon: <Plus size={14} />, action: () => setShowNewProjectModal(true), shortcut: '' },
    { label: 'Open Project', icon: <FolderOpen size={14} />, action: () => {}, shortcut: 'Ctrl+O' },
    { label: 'Save Project', icon: <Save size={14} />, action: () => useStore.getState().saveProject(), shortcut: 'Ctrl+S' },
    { divider: true },
    { label: 'Import Media', icon: <Upload size={14} />, action: () => setShowImportModal(true), shortcut: '' },
    { label: 'Export', icon: <Download size={14} />, action: () => setShowExportModal(true), shortcut: 'Ctrl+E' },
    { divider: true },
    { label: 'Settings', icon: <Settings size={14} />, action: () => setShowSettingsModal(true), shortcut: '' },
  ];

  const viewItems = [
    { label: 'Grid', icon: <Grid3X3 size={14} />, action: () => setShowGrid(!showGrid), active: showGrid },
    { label: 'Guides', icon: <Ruler size={14} />, action: () => setShowGuides(!showGuides), active: showGuides },
    { label: 'Safe Zones', icon: <Monitor size={14} />, action: () => setShowSafeZones(!showSafeZones), active: showSafeZones },
    { label: 'Snap to Objects', icon: <Magnet size={14} />, action: () => setSnapToObjects(!snapToObjects), active: snapToObjects },
    { divider: true },
    { label: 'Zoom to Fit', icon: null, action: () => setZoom(100), shortcut: '' },
  ];

  return (
    <div className="h-11 flex items-center justify-between px-3 border-b flex-shrink-0 no-select" 
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      {/* Left: Logo & Menus */}
      <div className="flex items-center gap-1">
        <BackButton />
        <div className="w-px h-5 mx-1 hidden sm:block" style={{ background: 'var(--border)' }} />
        <div className="flex items-center gap-2 mr-1 sm:mr-3 px-1 sm:px-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" 
            style={{ background: 'linear-gradient(135deg, #00d9c0, #00b8a3)' }}>
            <Zap size={14} className="text-black" />
          </div>
          <span className="text-sm font-bold text-white hidden sm:inline">
            X-EDITOR
          </span>
        </div>

        {/* File Menu */}
        <div className="relative hidden md:block">
          <button 
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-[var(--bg-hover)] transition-all"
            onClick={() => { setShowFileMenu(!showFileMenu); setShowViewMenu(false); }}
          >
            File <ChevronDown size={12} />
          </button>
          {showFileMenu && (
            <div className="context-menu top-full left-0 mt-1 animate-fade-in" onClick={() => setShowFileMenu(false)}>
              {menuItems.map((item, i) => 
                item.divider ? <div key={i} className="context-menu-divider" /> : (
                  <button key={i} className="context-menu-item w-full" onClick={item.action}>
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.shortcut && <span className="text-xs text-gray-600">{item.shortcut}</span>}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Edit */}
        <button className="hidden md:flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-[var(--bg-hover)] transition-all">
          Edit
        </button>

        {/* View Menu */}
        <div className="relative hidden md:block">
          <button 
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-[var(--bg-hover)] transition-all"
            onClick={() => { setShowViewMenu(!showViewMenu); setShowFileMenu(false); }}
          >
            View <ChevronDown size={12} />
          </button>
          {showViewMenu && (
            <div className="context-menu top-full left-0 mt-1 animate-fade-in" onClick={() => setShowViewMenu(false)}>
              {viewItems.map((item, i) => 
                item.divider ? <div key={i} className="context-menu-divider" /> : (
                  <button key={i} className="context-menu-item w-full" onClick={item.action}>
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.active !== undefined && (
                      <div className={`w-3 h-3 rounded border ${item.active ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-gray-600'}`} />
                    )}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Center: Project Name & Quick Actions */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-gray-500 truncate max-w-[90px] sm:max-w-none">{project?.name || 'Untitled Project'}</span>
        <div className="flex items-center gap-1 ml-2">
          <button className="tool-btn w-7 h-7" onClick={undo} title="Undo (Ctrl+Z)">
            <Undo2 size={14} />
          </button>
          <button className="tool-btn w-7 h-7" onClick={redo} title="Redo (Ctrl+Shift+Z)">
            <Redo2 size={14} />
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Resolution indicator */}
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 mr-2"
          style={{ background: 'var(--bg-tertiary)' }}>
          <Monitor size={12} />
          <span>{project?.width || 1920}×{project?.height || 1080}</span>
        </div>

        {/* Device preview */}
        <div className="hidden lg:flex items-center gap-0.5 mr-2" style={{ background: 'var(--bg-tertiary)', borderRadius: 6, padding: 2 }}>
          <button className="tool-btn w-6 h-6" title="Desktop">
            <MonitorCheck size={13} />
          </button>
          <button className="tool-btn w-6 h-6" title="Tablet">
            <Tablet size={13} />
          </button>
          <button className="tool-btn w-6 h-6" title="Mobile">
            <Smartphone size={13} />
          </button>
        </div>

        <button className="btn btn-ghost text-xs h-7 px-2 hidden sm:flex" onClick={() => setShowShortcutsModal(true)}>
          <HelpCircle size={14} />
        </button>
        <button className="btn btn-ghost text-xs h-7 px-2 hidden sm:flex" onClick={() => setShowSettingsModal(true)}>
          <Settings size={14} />
        </button>
        <button className="btn btn-ghost text-xs h-7 px-2 hidden sm:flex" onClick={() => setShowExportModal(true)}>
          <Share2 size={14} />
        </button>
        <button className="btn btn-primary text-xs h-7 px-2 sm:px-3" onClick={() => setShowExportModal(true)}>
          <Download size={14} /> <span className="hidden sm:inline">Export</span>
        </button>
        {/* Collab indicator */}
        <div className="flex items-center gap-1 ml-1 px-2 py-1 rounded-full text-[11px] hidden sm:flex" style={{ background: 'rgba(0,217,192,0.1)', border: '1px solid rgba(0,217,192,0.2)', color: 'var(--accent-hover)' }}>
          <Users size={12} /> Live
        </div>
        {isAuthenticated && user ? (
          <div className="flex items-center gap-1 ml-1">
            <img src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} className="w-7 h-7 rounded-full border hidden sm:block" style={{ borderColor: 'var(--border)' }} alt="" />
            <button className="tool-btn w-7 h-7 hidden sm:flex" onClick={signOut} title="Logout"><LogOut size={14} /></button>
          </div>
        ) : (
          <button className="btn btn-ghost text-xs h-7 px-2 ml-1" onClick={signInWithGoogle}><LogIn size={14} /> Login</button>
        )}
      </div>
    </div>
  );
}
