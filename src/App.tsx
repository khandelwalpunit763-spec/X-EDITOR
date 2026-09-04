import { useEffect } from 'react';
import { useStore } from './store/useStore';
import LandingPage from './components/landing/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import EditorLayout from './components/editor/EditorLayout';
import NewProjectModal from './components/modals/NewProjectModal';
import ExportModal from './components/modals/ExportModal';
import ImportModal from './components/modals/ImportModal';
import SettingsModal from './components/modals/SettingsModal';
import HelpModal from './components/modals/HelpModal';
import ShortcutsModal from './components/modals/ShortcutsModal';
import WatermarkModal from './components/modals/WatermarkModal';
import AIModal from './components/modals/AIModal';
import ThumbnailModal from './components/modals/ThumbnailModal';

function App() {
  const { view, showNewProjectModal, showExportModal, showImportModal, 
    showSettingsModal, showHelpModal, showShortcutsModal, showWatermarkModal,
    showAIModal, showThumbnailModal, undo, redo, saveProject, setActiveTool } = useStore();

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

  return (
    <div className="w-screen h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {view === 'landing' && <LandingPage />}
      {view === 'dashboard' && <Dashboard />}
      {view === 'editor' && <EditorLayout />}

      {showNewProjectModal && <NewProjectModal />}
      {showExportModal && <ExportModal />}
      {showImportModal && <ImportModal />}
      {showSettingsModal && <SettingsModal />}
      {showHelpModal && <HelpModal />}
      {showShortcutsModal && <ShortcutsModal />}
      {showWatermarkModal && <WatermarkModal />}
      {showAIModal && <AIModal />}
      {showThumbnailModal && <ThumbnailModal />}
    </div>
  );
}

export default App;
