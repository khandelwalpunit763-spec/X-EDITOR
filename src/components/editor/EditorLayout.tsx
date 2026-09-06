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
import { useIsMobile } from '../../hooks/useIsMobile';
import { Users, Link2, Copy, Check, SlidersHorizontal, X } from 'lucide-react';

export default function EditorLayout({ onLogin }: { onLogin?: () => void }) {
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const [timelineHeight, setTimelineHeight] = useState(220);
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const [isResizingTimeline, setIsResizingTimeline] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { project } = useStore();
  const { user, isAuthenticated } = useAuthStore();
  const { isMobile, isSmall } = useIsMobile();

  // Init collab when project loads
  useEffect(() => {
    if (project?.id && user) {
      initCollab(project.id, user.id, user.user_metadata?.full_name || user.email || 'User');
    }
    return () => { disconnectCollab(); };
  }, [project?.id, user?.id]);

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

  const shareLink = project ? `${window.location.origin}?project=${project.id}` : window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" ref={containerRef}>
      <TopBar />
      <ReadOnlyBanner />
      {/* Live Share Bar */}
      <div className="h-7 flex items-center justify-between px-3 text-[11px] flex-shrink-0" style={{ background: 'rgba(0,217,192,0.07)', borderBottom: '1px solid rgba(0,217,192,0.12)' }}>
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={12} className="text-[var(--accent)]" />
          <span className="hidden sm:inline">Live Share: {project?.name || 'Untitled'}</span>
          {isAuthenticated ? <span className="hidden sm:inline">• Invite link se koi bhi same project pe live edit kar sakta hai</span> : <span className="text-amber-400">• Login karke live collaboration enable karein</span>}
        </div>
        <button onClick={copyLink} className="flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-[var(--bg-hover)] text-gray-400 hover:text-white">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied!' : <span className="hidden sm:inline">Copy invite link</span>}
          <Link2 size={12} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left toolbar — vertical on desktop */}
        {!isMobile && <LeftToolbar />}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex flex-1 overflow-hidden relative">
            <CanvasArea />
            {/* view-only overlay blocks interactions */}
            {!isAuthenticated && <ViewOnlyOverlay />}

            {/* Right panel — inline on desktop, overlay drawer on mobile */}
            {!isMobile ? (
              <>
                {/* Right panel resize handle */}
                <div
                  className="w-1 cursor-col-resize hover:bg-[var(--accent)]/30 transition-colors flex-shrink-0"
                  onMouseDown={() => setIsResizingPanel(true)}
                />
                <RightSidebar width={rightPanelWidth} />
              </>
            ) : (
              showMobilePanel && (
                <div className="absolute inset-0 z-40 flex">
                  <div className="flex-1 bg-black/50" onClick={() => setShowMobilePanel(false)} />
                  <div className="w-[86%] max-w-[340px] h-full flex flex-col shadow-2xl animate-slide-up"
                    style={{ background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)' }}>
                    <div className="h-9 flex items-center justify-between px-3 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-xs font-semibold text-gray-400">Tools & Panels</span>
                      <button className="tool-btn w-7 h-7" onClick={() => setShowMobilePanel(false)}><X size={15} /></button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <RightSidebar width={Math.min(340, window.innerWidth * 0.86)} />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Timeline resize handle */}
          <div
            className="h-1 cursor-row-resize hover:bg-[var(--accent)]/30 transition-colors flex-shrink-0 hidden sm:block"
            onMouseDown={() => setIsResizingTimeline(true)}
          />
          <Timeline height={isMobile ? (isSmall ? 140 : 160) : timelineHeight} />
          {!isAuthenticated && (
            <div className="absolute bottom-0 left-0 right-0 h-[160px] flex items-center justify-center pointer-events-none" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)' }}>
              <div className="pointer-events-auto bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs flex items-center gap-2">
                <span className="text-gray-300">Sign in to edit the timeline</span>
                <button onClick={onLogin} className="px-2.5 py-1 rounded bg-[var(--accent)] text-black text-xs font-semibold">Sign in</button>
              </div>
            </div>
          )}

          {/* Horizontal tool strip on mobile */}
          {isMobile && <LeftToolbar horizontal />}
        </div>
      </div>

      {/* Mobile floating panel button */}
      {isMobile && !showMobilePanel && (
        <button
          className="absolute right-3 z-30 flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg text-xs font-semibold"
          style={{ bottom: 170, background: 'var(--accent)', color: '#06110f' }}
          onClick={() => setShowMobilePanel(true)}
        >
          <SlidersHorizontal size={14} /> Effects
        </button>
      )}
    </div>
  );
}
