import { useAuthStore } from '../../store/authStore'
import { Lock, Eye, LogIn } from 'lucide-react'

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
  const { signInWithGoogle, isMockMode } = useAuthStore()

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6 pointer-events-none">
      <div className="pointer-events-auto max-w-sm w-full rounded-2xl p-6 text-center shadow-2xl"
        style={{ background: 'rgba(22, 22, 29, 0.95)', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(0, 217, 192, 0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
          <Eye size={22} className="text-[var(--accent)]" />
        </div>
        <h3 className="text-sm font-bold mb-1">View-Only Mode</h3>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Aap bina login ke sirf dekh sakte ho. Edit, Save ya Export karne ke liye Gmail se login karein.
          {isMockMode && <span className="block mt-1 text-[11px] text-amber-400">⚠️ Mock mode - Supabase keys add karne pe original Gmail login hoga</span>}
        </p>
        <button
          onClick={signInWithGoogle}
          className="w-full btn btn-primary py-2.5 rounded-xl text-sm"
        >
          <LogIn size={16} /> Gmail se Login Karein
        </button>
        <p className="text-[11px] text-gray-600 mt-3 flex items-center justify-center gap-1">
          <Lock size={10} /> Secure Google OAuth • No spam
        </p>
      </div>
    </div>
  )
}

export function ReadOnlyBanner() {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return null
  return (
    <div className="h-7 flex items-center justify-center gap-2 text-[11px] text-amber-300 px-3"
      style={{ background: 'rgba(245,158,11,0.12)', borderBottom: '1px solid rgba(245,158,11,0.2)' }}>
      <Eye size={12} /> View-Only — Edit karne ke liye Login karein
      <button onClick={() => useAuthStore.getState().signInWithGoogle()}
        className="ml-2 px-2 py-0.5 rounded bg-amber-500 text-black text-[11px] font-semibold hover:bg-amber-400">
        Login
      </button>
    </div>
  )
}
