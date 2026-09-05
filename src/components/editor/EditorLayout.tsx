import { useEffect, useRef, useState } from 'react';
import TopBar from '../layout/TopBar';
import LeftToolbar from '../layout/LeftToolbar';
import CanvasArea from './CanvasArea';
import RightSidebar from '../panels/RightSidebar';
import Timeline from '../timeline/Timeline';
import { ReadOnlyBanner, ViewOnlyOverlay } from '../auth/AuthGuard';
import { useAuthStore } from '../../store/authStore';
import { useStore } from '../../store/useStore';
import { initCollab, disconnectCollab } from '../../lib/collab';
import { Users, Link2, Copy, Check } from 'lucide-react';

export default function EditorLayout({ onLogin }: { onLogin?: () => void }) {
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const [timelineHeight, setTimelineHeight] = useState(220);
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const [isResizingTimeline, setIsResizingTimeline] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { project } = useStore()
  const { user, isAuthenticated } = useAuthStore()

  // Init collab when project loads
  useEffect(() => {
    if (project?.id && user) {
      initCollab(project.id, user.id, user.user_metadata?.full_name || user.email || 'User')
    }
    return () => { disconnectCollab() }
  }, [project?.id, user?.id])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingPanel && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = Math.max(220, Math.min(400, rect.right - e.clientX));
        setRightPanelWidth(newWidth);
      }
      if (isResizingTimeline && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newHeight = Math.max(120, Math.min(400, rect.bottom - e.clientY));
        setTimelineHeight(newHeight);
      }
    };
    const handleMouseUp = () => {
      setIsResizingPanel(false);
      setIsResizingTimeline(false);
    };
    if (isResizingPanel || isResizingTimeline) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingPanel, isResizingTimeline]);

  const shareLink = project ? `${window.location.origin}?project=${project.id}` : window.location.href

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" ref={containerRef}>
      <TopBar />
      <ReadOnlyBanner />
      {/* Live Share Bar */}
      <div className="h-7 flex items-center justify-between px-3 text-[11px] flex-shrink-0" style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={12} className="text-indigo-400" />
          <span>Live Share: {project?.name || 'Untitled'}</span>
          {isAuthenticated ? <span className="hidden sm:inline">• Invite link se koi bhi same project pe live edit kar sakta hai</span> : <span className="text-amber-400">• Login karke live collaboration enable karein</span>}
        </div>
        <button onClick={copyLink} className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-[var(--bg-hover)] text-gray-400 hover:text-white">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy invite link'}
          <Link2 size={12} />
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden relative">
        <LeftToolbar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex flex-1 overflow-hidden relative">
            <CanvasArea />
            {/* view-only overlay blocks interactions */}
            {!isAuthenticated && <ViewOnlyOverlay />}
            {/* Right panel resize handle */}
            <div
              className="w-1 cursor-col-resize hover:bg-indigo-500/30 transition-colors flex-shrink-0"
              onMouseDown={() => setIsResizingPanel(true)}
            />
            <RightSidebar width={rightPanelWidth} />
          </div>
          {/* Timeline resize handle */}
          <div
            className="h-1 cursor-row-resize hover:bg-indigo-500/30 transition-colors flex-shrink-0"
            onMouseDown={() => setIsResizingTimeline(true)}
          />
          <Timeline height={timelineHeight} />
          {!isAuthenticated && (
            <div className="absolute bottom-0 left-0 right-0 h-[220px] flex items-center justify-center pointer-events-none" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}>
              <div className="pointer-events-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs flex items-center gap-2">
                Timeline edit karne ke liye <button onClick={onLogin} className="px-2 py-1 rounded bg-indigo-600 text-white text-xs">Login karein</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
