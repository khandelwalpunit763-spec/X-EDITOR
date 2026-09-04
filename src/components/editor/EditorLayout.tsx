import { useEffect, useRef, useState } from 'react';
import TopBar from '../layout/TopBar';
import LeftToolbar from '../layout/LeftToolbar';
import CanvasArea from './CanvasArea';
import RightSidebar from '../panels/RightSidebar';
import Timeline from '../timeline/Timeline';

export default function EditorLayout() {
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const [timelineHeight, setTimelineHeight] = useState(220);
  const [isResizingPanel, setIsResizingPanel] = useState(false);
  const [isResizingTimeline, setIsResizingTimeline] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" ref={containerRef}>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftToolbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <CanvasArea />
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
        </div>
      </div>
    </div>
  );
}
