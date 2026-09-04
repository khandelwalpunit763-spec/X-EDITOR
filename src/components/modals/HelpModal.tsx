import { useStore } from '../../store/useStore';
import { X, Book, MessageCircle, Video, FileText, ExternalLink } from 'lucide-react';

export default function HelpModal() {
  const { setShowHelpModal } = useStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="w-[480px] rounded-2xl overflow-hidden animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-bold">Help & Support</h2>
          <button className="tool-btn" onClick={() => setShowHelpModal(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { icon: <Book size={18} />, title: 'Documentation', desc: 'Learn how to use all features' },
            { icon: <Video size={18} />, title: 'Video Tutorials', desc: 'Step-by-step video guides' },
            { icon: <FileText size={18} />, title: 'Keyboard Shortcuts', desc: 'View all keyboard shortcuts' },
            { icon: <MessageCircle size={18} />, title: 'Contact Support', desc: 'Get help from our team' },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:bg-[var(--bg-hover)]"
              style={{ background: 'var(--bg-tertiary)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
              <ExternalLink size={14} className="text-gray-600" />
            </button>
          ))}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-600">X-EDITOR v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
