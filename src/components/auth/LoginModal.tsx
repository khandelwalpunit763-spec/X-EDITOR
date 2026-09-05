import { useAuthStore } from '../../store/authStore'
import { X, LogIn, Shield, Zap } from 'lucide-react'

interface Props {
  onClose: () => void
}

export default function LoginModal({ onClose }: Props) {
  const { signInWithGoogle, isMockMode, user, isAuthenticated, signOut } = useAuthStore()

  const handleGoogle = async () => {
    await signInWithGoogle()
    if (useAuthStore.getState().isAuthenticated) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] text-gray-500">
          <X size={16} />
        </button>

        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <Zap size={22} className="text-white" />
          </div>
          <h2 className="text-lg font-bold">X-EDITOR me Welcome</h2>
          <p className="text-xs text-gray-400 mt-1">Gmail se login karke editing start karein</p>

          {isAuthenticated && user ? (
            <div className="mt-6 p-3 rounded-xl text-left" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <img src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} className="w-9 h-9 rounded-full" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Logged in</span>
              </div>
              <button onClick={signOut} className="w-full mt-3 btn btn-ghost text-xs">Logout</button>
            </div>
          ) : (
            <>
              <button
                onClick={handleGoogle}
                className="w-full mt-6 flex items-center justify-center gap-3 py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'white', color: '#111' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09A6.98 6.98 0 015.48 12a6.98 6.98 0 01.36-2.09V7.07H2.18A11 11 0 001 12a11 11 0 001.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Gmail se Continue Karein
              </button>
              {isMockMode && (
                <p className="text-[11px] text-amber-400 mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                  Mock Mode: Supabase keys nahi hai, isliye demo login hoga. .env me VITE_SUPABASE_URL add karte hi original Google OAuth chalega.
                </p>
              )}
              <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-600 justify-center">
                <Shield size={12} /> <span>Secure & Private • No spam, no sharing</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">
                Bina login aap sirf dekh sakte ho. Edit/Save/Export ke liye login zaruri hai.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
