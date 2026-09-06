import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { useAuthStore } from './store/authStore';
import { useAutoSave } from './hooks/useAutoSave';
import LandingPage from './components/landing/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import EditorLayout from './components/editor/EditorLayout';
import Compressor from './components/compressor/Compressor';
import NewProjectModal from './components/modals/NewProjectModal';
import ExportModal from './components/modals/ExportModal';
import ImportModal from './components/modals/ImportModal';
import SettingsModal from './components/modals/SettingsModal';
import HelpModal from './components/modals/HelpModal';
import ShortcutsModal from './components/modals/ShortcutsModal';
import WatermarkModal from './components/modals/WatermarkModal';
import AIModal from './components/modals/AIModal';
import ThumbnailModal from './components/modals/ThumbnailModal';
import ShareUploadModal from './components/modals/ShareUploadModal';
import LoginModal from './components/auth/LoginModal';

function App() {
  const { view, showNewProjectModal, showExportModal, showImportModal, 
    showSettingsModal, showHelpModal, showShortcutsModal, showWatermarkModal,
    showAIModal, showThumbnailModal, showShareModal, showLoginModal, setShowLoginModal,
    undo, redo, saveProject, setActiveTool, setShowShareModal, project } = useStore();

  const { initialize, isLoading: authLoading } = useAuthStore();
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [oauthError, setOauthError] = useState('');
  
  const openLogin = () => setShowLoginModal(true);

  // Handle OAuth error redirect (e.g. Supabase "Unable to exchange external code")
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('error_description')) {
      try {
        const params = new URLSearchParams(hash.slice(1))
        const desc = params.get('error_description')
        setOauthError(desc ? decodeURIComponent(desc).replace(/\+/g, ' ') : 'Sign-in failed. Please try again.')
      } catch {
        setOauthError('Sign-in failed. Please try again.')
      }
      // Clean the URL so refresh doesn't re-trigger
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])
  
  // Init auth
  useEffect(() => { initialize() }, [initialize])
  
  // Auto-save hook (only in editor)
  useAutoSave()

  // Check for draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('xeditor_autosave')
    if (draft && view === 'landing') {
      try {
        const parsed = JSON.parse(draft)
        if (parsed?.project?.id && parsed.layers?.length > 0) {
          setShowRestorePrompt(true)
        }
      } catch {}
    }
  }, [])

  // Listen for export complete -> show share modal
  useEffect(() => {
    const handler = () => setShowShareModal(true)
    window.addEventListener('xeditor:export-complete', handler)
    return () => window.removeEventListener('xeditor:export-complete', handler)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) redo();
            else undo();
            break;
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'e':
            e.preventDefault();
            useStore.getState().setShowExportModal(true);
            break;
        }
      }
      if (view === 'editor') {
        const toolMap: Record<string, () => void> = {
          v: () => setActiveTool('select'),
          m: () => setActiveTool('move'),
          c: () => setActiveTool('crop'),
          b: () => setActiveTool('brush'),
          e: () => setActiveTool('eraser'),
          t: () => setActiveTool('text'),
          p: () => setActiveTool('pen'),
          h: () => setActiveTool('hand'),
          z: () => setActiveTool('zoom'),
        };
        if (!e.ctrlKey && !e.metaKey && !e.altKey && toolMap[e.key]) {
          const target = e.target as HTMLElement;
          if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            toolMap[e.key]();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, undo, redo, saveProject, setActiveTool]);

  const handleRestore = () => {
    try {
      const draft = JSON.parse(localStorage.getItem('xeditor_autosave') || '{}')
      if (draft.project) {
        useStore.setState({ project: draft.project, layers: draft.layers || [], tracks: draft.tracks || useStore.getState().tracks, view: 'editor' })
      }
    } catch {}
    setShowRestorePrompt(false)
  }

  const handleDiscard = () => {
    localStorage.removeItem('xeditor_autosave')
    setShowRestorePrompt(false)
  }

  if (authLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      {view === 'landing' && <LandingPage onLogin={openLogin} />}
      {view === 'dashboard' && <Dashboard onLogin={openLogin} />}
      {view === 'editor' && <EditorLayout onLogin={openLogin} />}
      {view === 'compress' && <Compressor />}

      {showNewProjectModal && <NewProjectModal />}
      {showExportModal && <ExportModal onExported={() => setShowShareModal(true)} />}
      {showImportModal && <ImportModal />}
      {showSettingsModal && <SettingsModal />}
      {showHelpModal && <HelpModal />}
      {showShortcutsModal && <ShortcutsModal />}
      {showWatermarkModal && <WatermarkModal />}
      {showAIModal && <AIModal />}
      {showThumbnailModal && <ThumbnailModal />}
      {showShareModal && <ShareUploadModal projectName={project?.name || 'Untitled'} onClose={() => setShowShareModal(false)} />}
      {showLoginModal && <LoginModal />}

      {showRestorePrompt && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <span className="text-xs">💾 Unsaved draft mila hai! Restore karna hai?</span>
          <button onClick={handleRestore} className="btn btn-primary text-xs px-3 py-1">Restore</button>
          <button onClick={handleDiscard} className="btn btn-ghost text-xs px-3 py-1">Discard</button>
        </div>
      )}

      {oauthError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-md px-4 py-3 rounded-xl shadow-2xl animate-slide-up"
          style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(239,68,68,0.35)' }}>
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">⚠️</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">Google sign-in failed</div>
              <div className="text-xs text-gray-400 mt-0.5 leading-relaxed break-words">
                Google login abhi fully configured nahi hai ({oauthError}). Demo login use karein — koi bhi email daalo, turant chalega.
              </div>
            </div>
            <button onClick={() => setOauthError('')} className="text-gray-500 hover:text-white text-lg leading-none">×</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
