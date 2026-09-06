import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useStore } from '../../store/useStore';
import GoogleButton, { GoogleIcon } from './GoogleButton';
import { X, ArrowLeft, Zap, Check, ShieldCheck, Cloud, Users } from 'lucide-react';

export default function LoginModal() {
  const { signInWithGoogle, signInWithEmail, isMockMode, user, isAuthenticated, signOut } = useAuthStore();
  const { setShowLoginModal } = useStore();

  const [step, setStep] = useState<'main' | 'email'>('main');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const close = () => setShowLoginModal(false);

  const handleGoogle = async () => {
    if (isMockMode) {
      // Demo environment — show a Google-style account step instead of a browser prompt
      setStep('email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (e) {
      setError((e as Error).message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleEmailNext = async () => {
    if (!email.trim()) return;
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) { setError('Enter a valid email address.'); return; }

    setLoading(true);
    setError('');
    try {
      await signInWithEmail(email);
      if (isMockMode) {
        // demo user created instantly
        close();
        return;
      }
      // real mode — magic link sent
      setSent(true);
    } catch (e) {
      setError((e as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={close} />

      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <button onClick={close} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] text-gray-400 hover:text-white transition-colors z-10">
          <X size={16} />
        </button>

        {/* ===== STEP: MAIN ===== */}
        {step === 'main' && (
          <div className="p-8">
            {/* Brand */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00d9c0, #00b8a3)' }}>
                <Zap size={18} className="text-black" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">X-EDITOR</span>
            </div>

            <h2 className="text-2xl font-bold text-white leading-tight">Sign in to X-EDITOR</h2>
            <p className="text-sm text-gray-400 mt-1.5">Create, edit and export professional videos & photos.</p>

            {/* Google button */}
            <div className="mt-7">
              <GoogleButton onClick={handleGoogle} loading={loading && !isMockMode} />
            </div>

            {error && (
              <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Perks */}
            <div className="mt-7 space-y-2.5">
              {[
                { icon: <Cloud size={14} />, text: 'Save projects securely in the cloud' },
                { icon: <Users size={14} />, text: 'Live collaboration with your team' },
                { icon: <Check size={14} />, text: 'Unlock all pro tools — no watermarks' },
              ].map((p, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-gray-300">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,217,192,0.12)', color: 'var(--accent)' }}>
                    {p.icon}
                  </span>
                  {p.text}
                </div>
              ))}
            </div>

            {/* Trust line */}
            <div className="mt-7 flex items-center justify-center gap-1.5 text-[11px] text-gray-600">
              <ShieldCheck size={12} className="text-[var(--accent)]" />
              Secured by Google OAuth — we never see your password.
            </div>
          </div>
        )}

        {/* ===== STEP: EMAIL (Google-style account step) ===== */}
        {step === 'email' && (
          <div className="p-8">
            <button onClick={() => setStep('main')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors mb-6">
              <ArrowLeft size={14} /> Back
            </button>

            <div className="flex items-center gap-2 mb-6">
              <GoogleIcon size={20} />
              <span className="text-lg font-medium text-white">Sign in</span>
            </div>
            <p className="text-sm text-gray-400 mb-6">to continue to <span className="text-white font-medium">X-EDITOR</span></p>

            <div className="relative">
              <input
                type="email"
                autoFocus
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleEmailNext()}
                placeholder=" "
                className="peer w-full px-3.5 pt-5 pb-2 text-sm text-white rounded-lg outline-none transition-colors"
                style={{ background: 'var(--bg-tertiary)', border: error ? '1px solid var(--danger)' : '1px solid var(--border-light)' }}
              />
              <label className="absolute left-3.5 top-1.5 text-[11px] text-gray-500 pointer-events-none">
                Email or phone
              </label>
            </div>

            {error && <div className="mt-2 text-xs text-red-400">{error}</div>}

            {isMockMode && (
              <p className="mt-2 text-[11px] text-gray-500">
                This is a demo build — enter any email to continue instantly.
              </p>
            )}

            <div className="flex items-center justify-between mt-6">
              <button className="text-xs text-[var(--accent)] font-medium hover:underline">Create account</button>
              <button
                onClick={handleEmailNext}
                disabled={loading || !email.trim()}
                className="px-6 py-2 rounded-full text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: 'var(--accent)', color: '#06110f' }}
              >
                {loading ? 'Please wait…' : sent ? 'Email sent!' : 'Next'}
              </button>
            </div>

            {sent && (
              <div className="mt-4 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                We sent a sign-in link to {email}. Check your inbox.
              </div>
            )}
          </div>
        )}

        {/* ===== STEP: LOGGED IN ===== */}
        {isAuthenticated && user && step === 'main' && (
          <div className="p-8">
            <h2 className="text-xl font-bold text-white mb-5">You're signed in</h2>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <img src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} className="w-10 h-10 rounded-full" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-white">{user.user_metadata?.full_name || user.email?.split('@')[0]}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 flex-shrink-0">✓ Signed in</span>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={close} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent)', color: '#06110f' }}>
                Continue
              </button>
              <button onClick={signOut} className="px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-[var(--bg-hover)] transition-colors">
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-4 border-t flex items-center justify-center gap-4 text-[11px] text-gray-600"
          style={{ borderColor: 'var(--border)' }}>
          <a href="#" className="hover:text-gray-300">Terms</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-300">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-300">Help</a>
        </div>
      </div>
    </div>
  );
}
