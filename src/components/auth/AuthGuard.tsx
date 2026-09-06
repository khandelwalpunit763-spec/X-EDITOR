import { useAuthStore } from '../../store/authStore';
import { useStore } from '../../store/useStore';
import GoogleButton from './GoogleButton';
import { Lock, Eye } from 'lucide-react';

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: Props) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>
    return <ViewOnlyOverlay />
  }

  return <>{children}</>
}

export function ViewOnlyOverlay() {
  const { setShowLoginModal } = useStore()

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-sm w-full rounded-2xl p-7 text-center shadow-2xl animate-scale-in"
        style={{ background: 'rgba(20, 20, 24, 0.96)', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #00d9c0, #00b8a3)' }}>
          <Eye size={24} className="text-black" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">Sign in to start editing</h3>
        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          You're in view-only mode. Sign in to edit, save and export without limits.
        </p>
        <GoogleButton onClick={() => setShowLoginModal(true)} />
        <p className="text-[11px] text-gray-600 mt-4 flex items-center justify-center gap-1">
          <Lock size={10} /> Free forever · Secure Google sign-in · No credit card
        </p>
      </div>
    </div>
  )
}

export function ReadOnlyBanner() {
  const { isAuthenticated } = useAuthStore()
  const { setShowLoginModal } = useStore()
  if (isAuthenticated) return null
  return (
    <div className="h-7 flex items-center justify-center gap-2 text-[11px] text-gray-400 px-3 flex-shrink-0"
      style={{ background: 'rgba(0,217,192,0.06)', borderBottom: '1px solid rgba(0,217,192,0.12)' }}>
      <Eye size={12} className="text-[var(--accent)]" />
      <span className="hidden sm:inline">View only —</span>
      <button
        onClick={() => setShowLoginModal(true)}
        className="px-2 py-0.5 rounded text-[var(--accent)] hover:text-white text-[11px] font-semibold transition-colors">
        Sign in
      </button>
      <span className="hidden sm:inline text-gray-600">to edit</span>
    </div>
  )
}
