import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/authStore';
import {
  Film, Image, Wand2, Eraser, Volume2, ImageIcon, Layers,
  Sparkles, ArrowRight, Play, ChevronRight, Zap, Scissors,
  Music, LogIn, LogOut, FileImage, Monitor, Download
} from 'lucide-react';

export default function LandingPage({ onLogin }: { onLogin?: () => void }) {
  const { setView } = useStore();
  const { isAuthenticated, user, signOut } = useAuthStore();

  const features = [
    { icon: <Film size={22} />, title: 'Video Editor', desc: 'Multi-track timeline, keyframes, transitions aur speed control — sab kuch.', color: '#00d9c0' },
    { icon: <Image size={22} />, title: 'Photo Editor', desc: 'Layers, masks, blend modes aur pro-level color grading.', color: '#22d3ee' },
    { icon: <FileImage size={22} />, title: 'Image Compressor', desc: 'Bulk compress — saari images ek saath, apne target MB me.', color: '#34d399' },
    { icon: <Wand2 size={22} />, title: 'AI Tools', desc: 'Background remove, object remove, upscale — ek click me.', color: '#a78bfa' },
    { icon: <Eraser size={22} />, title: 'Watermark Tools', desc: 'Watermark add/remove (sirf apne content par).', color: '#f472b6' },
    { icon: <Volume2 size={22} />, title: 'Audio Editor', desc: 'Voiceover, music, noise removal aur normalization.', color: '#f43f5e' },
    { icon: <ImageIcon size={22} />, title: 'Thumbnail Maker', desc: 'YouTube, Reels, TikTok ke liye ready templates.', color: '#f97316' },
    { icon: <Scissors size={22} />, title: 'VFX & Effects', desc: 'Glitch, shake, 3D zoom, chroma key — CapCut style.', color: '#eab308' },
  ];

  const stats = [
    { value: '50+', label: 'Editing Tools' },
    { value: '100+', label: 'Effects & Filters' },
    { value: '4K', label: 'Export Quality' },
    { value: 'Free', label: 'No Watermark' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ background: 'rgba(10, 10, 11, 0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d9c0, #00b8a3)' }}>
              <Zap size={20} className="text-black" />
            </div>
            <span className="text-xl font-bold text-white">X-EDITOR</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="btn btn-ghost text-sm hidden md:flex" onClick={() => setView('dashboard')}>Dashboard</button>
            <button className="btn btn-ghost text-sm hidden md:flex" onClick={() => setView('compress')}>Compressor</button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded-full text-xs" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                  <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} className="w-6 h-6 rounded-full" alt="" />
                  <span className="text-gray-300">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                </div>
                <button className="btn btn-ghost text-xs" onClick={signOut}><LogOut size={14} /> <span className="hidden sm:inline">Logout</span></button>
                <button className="btn btn-primary text-sm" onClick={() => setView('editor')}>
                  Start Editing <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-ghost text-sm flex items-center gap-1" onClick={onLogin}><LogIn size={14} /> <span className="hidden sm:inline">Login</span></button>
                <button className="btn btn-primary text-sm" onClick={() => setView('editor')}>
                  Start Editing <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(0,217,192,0.08)', border: '1px solid rgba(0,217,192,0.18)' }}>
            <Sparkles size={13} className="text-[var(--accent)]" />
            <span className="text-xs sm:text-sm text-[var(--accent-hover)]">Free • No watermark • No login needed</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-5 leading-tight tracking-tight">
            Video & photo editor,
            <br />
            <span className="text-[var(--accent)]">sab kuch browser me.</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Cut, trim, add effects, remove background, compress images — ek hi jagah.
            Download karne ki zaroorat nahi, sign-up ki bhi nahi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <button className="btn btn-primary text-base px-8 py-3 rounded-xl w-full sm:w-auto"
              onClick={() => setView('editor')}>
              <Play size={18} /> Start Editing
            </button>
            <button className="btn btn-secondary text-base px-8 py-3 rounded-xl w-full sm:w-auto"
              onClick={() => setView('compress')}>
              <Download size={18} /> Image Compressor
            </button>
          </div>

          {/* Editor Preview Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              {/* Mock toolbar */}
              <div className="h-10 flex items-center px-4 gap-2" style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-xs text-gray-500">X-EDITOR — My Project</span>
                </div>
              </div>
              {/* Mock content */}
              <div className="flex h-64 sm:h-80">
                {/* Mock left toolbar */}
                <div className="w-12 hidden sm:flex flex-col items-center py-3 gap-2" style={{ borderRight: '1px solid var(--border)' }}>
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="w-7 h-7 rounded" style={{ background: i === 1 ? 'var(--accent)' : 'var(--bg-hover)' }} />
                  ))}
                </div>
                {/* Mock canvas */}
                <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                  <div className="w-3/4 h-3/4 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #042f2e, #0b3b3a)', border: '1px solid var(--border-light)' }}>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,217,192,0.15)' }}>
                        <Play size={28} className="text-[var(--accent)] ml-1" />
                      </div>
                      <span className="text-sm text-gray-400">Drop media here</span>
                    </div>
                  </div>
                </div>
                {/* Mock right panel */}
                <div className="w-48 hidden sm:flex flex-col" style={{ borderLeft: '1px solid var(--border)' }}>
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Effects</div>
                  </div>
                  {['Glitch', 'Shake', '3D Zoom', 'Chroma Key'].map(i => (
                    <div key={i} className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-xs text-gray-400">{i}</span>
                      <div className="w-8 h-4 rounded-full bg-[var(--accent)]/40" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Mock timeline */}
              <div className="h-20 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}>
                <div className="h-6 flex items-center px-3 gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-[10px] text-gray-600">00:00:00</div>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  <div className="text-[10px] text-gray-600">00:01:00</div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-14 text-[10px] text-gray-600">Video 1</div>
                    <div className="h-4 rounded flex-1 max-w-xs" style={{ background: 'rgba(0,217,192,0.35)' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-14 text-[10px] text-gray-600">Audio 1</div>
                    <div className="h-4 rounded flex-1 max-w-[60%]" style={{ background: 'rgba(34, 197, 94, 0.3)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[var(--accent)] mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Jo chahiye, wo sab hai</h2>
            <p className="text-gray-400 text-base sm:text-lg">Photoshop se Premiere tak — sab kuch ek tool me</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => feature.title === 'Image Compressor' ? setView('compress') : setView('editor')}
                className="group text-left p-5 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${feature.color}1f`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Desktop apps jitna powerful</h2>
            <p className="text-gray-400 text-base sm:text-lg">Wahi features, bina download ke</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Monitor size={20} />, title: 'Multi-Track Timeline', desc: 'Unlimited tracks, keyframes aur real-time preview ke saath professional editing.' },
              { icon: <Layers size={20} />, title: 'Advanced Layers', desc: 'Photoshop-style layers, blend modes, masks aur non-destructive editing.' },
              { icon: <Wand2 size={20} />, title: 'AI-Powered', desc: 'Background removal, object detection, auto-enhancement aur smart cropping.' },
              { icon: <Music size={20} />, title: 'Audio Mixing', desc: 'Multi-track audio, noise reduction, equalizer aur voice enhancement.' },
              { icon: <Scissors size={20} />, title: 'Precision Editing', desc: 'Frame-by-frame navigation, ripple edit aur split tools.' },
              { icon: <FileImage size={20} />, title: 'Bulk Compressor', desc: 'Saari images ek saath, target MB me — browser ke andar hi, private.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(0,217,192,0.12)', color: 'var(--accent)' }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Shuru karein?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Free hai. No download, no watermark, no sign-up.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button className="btn btn-primary text-lg px-10 py-4 rounded-xl" onClick={() => setView('editor')}>
              <Sparkles size={20} /> Launch Studio
            </button>
            <button className="btn btn-secondary text-lg px-10 py-4 rounded-xl" onClick={() => setView('compress')}>
              <Download size={20} /> Compress Images
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[var(--accent)]" />
            <span className="text-sm text-gray-500">X-EDITOR © 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
