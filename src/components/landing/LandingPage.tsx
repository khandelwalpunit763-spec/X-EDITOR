import { useStore } from '../../store/useStore';
import {
  Film, Image, Wand2, Eraser, Volume2, ImageIcon, Layers,
  Sparkles, ArrowRight, ArrowUpRight, Play, Zap, Scissors,
  Music, FileImage, Monitor, Download, Gauge, Captions, Crop, Palette
} from 'lucide-react';

export default function LandingPage() {
  const { setView } = useStore();

  const marqueeItems = [
    'AI Auto-Captions', 'Speed Ramp', 'Chroma Key', 'Magic Resize', 'Beat Sync',
    'Keyframes', 'Multi-track Timeline', 'Glitch VFX', '3D Zoom', 'Noise Removal',
    'Watermark Tools', 'Bulk Compressor', 'LUT-style Filters', 'Live Collab',
  ];

  return (
    <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      {/* ============ NAV ============ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ background: 'rgba(10, 10, 12, 0.82)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00e5c7, #00b8a0)', boxShadow: '0 2px 12px rgba(0,229,199,0.35)' }}>
              <Zap size={17} className="text-black" />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">X-EDITOR</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button className="btn btn-ghost text-xs sm:text-sm hidden md:flex" onClick={() => setView('dashboard')}>Dashboard</button>
            <button className="btn btn-ghost text-xs sm:text-sm hidden md:flex" onClick={() => setView('compress')}>Compressor</button>
            <button className="btn btn-primary text-xs sm:text-sm" onClick={() => setView('editor')}>
              Open Studio <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6">
        {/* backdrop */}
        <div className="absolute inset-0 hero-grid-bg" />
        <div className="glow-orb" style={{ width: 480, height: 480, top: -140, left: '12%', background: 'rgba(0,229,199,0.16)' }} />
        <div className="glow-orb" style={{ width: 380, height: 380, top: 120, right: '-6%', background: 'rgba(59,130,246,0.10)' }} />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
          {/* Left — copy */}
          <div>
            <div className="chip reveal">
              <Sparkles size={12} /> 100% free · no signup · no watermark
            </div>

            <h1 className="font-display reveal reveal-d1 text-white font-bold leading-[1.04] mt-5 text-4xl sm:text-6xl lg:text-[68px]">
              Edit videos that<br />
              <span className="text-gradient">stop the scroll.</span>
            </h1>

            <p className="reveal reveal-d2 text-[15px] sm:text-lg text-[var(--text-secondary)] mt-5 max-w-xl leading-relaxed">
              Premiere-jaisi timeline, CapCut-jaise effects, Canva-jaise templates —
              sab kuch browser me. <span className="text-white font-semibold">AI captions ek click me</span>,
              download ke bina, account ke bina.
            </p>

            <div className="reveal reveal-d3 flex flex-col sm:flex-row gap-3 mt-8">
              <button className="btn btn-primary text-base px-8 py-3.5 rounded-xl" onClick={() => setView('editor')}>
                <Play size={18} /> Start Editing — it's free
              </button>
              <button className="btn btn-secondary text-base px-8 py-3.5 rounded-xl" onClick={() => setView('compress')}>
                <Download size={18} /> Compress Images
              </button>
            </div>

            <div className="reveal reveal-d4 flex flex-wrap items-center gap-x-8 gap-y-3 mt-10">
              {[
                { value: '50+', label: 'editing tools' },
                { value: '100+', label: 'effects & filters' },
                { value: '4K', label: 'export quality' },
                { value: '0₹', label: 'forever' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating editor mock */}
          <div className="relative hidden sm:block reveal reveal-d2">
            <div className="floaty">
              <div className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 60px rgba(0,229,199,0.07)', transform: 'rotate(1.2deg)' }}>
                {/* title bar */}
                <div className="h-9 flex items-center px-3.5 gap-2" style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/90" />
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] mx-auto">reels_final_v2.xedit</span>
                </div>
                {/* body */}
                <div className="flex h-56 sm:h-72">
                  <div className="w-10 flex flex-col items-center py-2.5 gap-2" style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="w-6 h-6 rounded-md" style={{ background: i === 2 ? 'var(--accent)' : 'var(--bg-elevated)' }} />
                    ))}
                  </div>
                  <div className="flex-1 flex items-center justify-center relative" style={{ background: 'linear-gradient(160deg, #0c1f1c, #0a0a0c)' }}>
                    <div className="w-[62%] h-[82%] rounded-lg flex items-center justify-center relative overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #043029, #0b3b3a)', border: '1px solid rgba(0,229,199,0.25)' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,229,199,0.18)' }}>
                        <Play size={20} className="text-[var(--accent)] ml-0.5" />
                      </div>
                      {/* caption preview */}
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 cap-base cap-classic text-[10px] sm:text-xs px-2">
                        Ye caption AI ne banaya ✨
                      </div>
                    </div>
                  </div>
                </div>
                {/* timeline */}
                <div className="h-16 border-t p-2 flex flex-col gap-1.5" style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-10 text-[8px] text-[var(--text-muted)]">V1</div>
                    <div className="h-3.5 rounded flex-[3]" style={{ background: 'linear-gradient(90deg, rgba(0,229,199,0.5), rgba(0,229,199,0.25))' }} />
                    <div className="h-3.5 rounded flex-1" style={{ background: 'rgba(0,229,199,0.15)' }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-10 text-[8px] text-[var(--text-muted)]">A1</div>
                    <div className="h-3.5 rounded flex-[2]" style={{ background: 'rgba(234,179,8,0.35)' }} />
                    <div className="h-3.5 rounded flex-[2.5]" style={{ background: 'rgba(234,179,8,0.2)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* floating chips */}
            <div className="absolute -left-6 top-8 chip glass-light hidden lg:flex" style={{ background: 'rgba(16,16,20,0.85)' }}>
              <Captions size={12} /> AI Captions: ON
            </div>
            <div className="absolute -right-4 bottom-16 chip hidden lg:flex" style={{ background: 'rgba(16,16,20,0.85)', borderColor: 'rgba(255,209,102,0.3)', color: 'var(--warm)' }}>
              <Gauge size={12} /> 2× speed ramp
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee py-4 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-2.5 text-xs font-semibold text-[var(--text-secondary)] whitespace-nowrap px-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ============ BENTO FEATURES ============ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
              Sab tools. Ek tab.
            </h2>
            <p className="text-[var(--text-secondary)] mt-3 text-base sm:text-lg">
              Photoshop se Premiere tak — har app ka best part yahan hai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[150px] sm:auto-rows-[170px]">
            {/* Big: AI captions */}
            <div className="bento-card sm:col-span-2 lg:row-span-2 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(0,229,199,0.12)', color: 'var(--accent)' }}>
                  <Captions size={22} />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">AI Auto-Captions</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-md">
                  Bolo, aur subtitles khud ban jayenge. Hindi ya English — CapCut-style
                  caption styles ke saath, SRT me export karo.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="badge badge-accent">Free</span>
                <span className="badge" style={{ background: 'rgba(255,209,102,0.12)', color: 'var(--warm)' }}>Hindi + English</span>
                <span className="badge badge-success">SRT export</span>
              </div>
            </div>

            {/* Video editor */}
            <div className="bento-card lg:col-span-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee' }}>
                <Film size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Multi-track Video Editor</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Timeline, keyframes, transitions, speed ramp — pro editing bina download ke.
              </p>
            </div>

            {/* Photo */}
            <div className="bento-card">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa' }}>
                <Image size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Photo Editor</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5">Layers, masks & blend modes.</p>
            </div>

            {/* Compressor */}
            <div className="bento-card">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                <FileImage size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Bulk Compressor</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5">Target MB me, private — browser me hi.</p>
            </div>

            {/* VFX */}
            <div className="bento-card">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308' }}>
                <Scissors size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">CapCut-style VFX</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5">Glitch, shake, 3D zoom, chroma key.</p>
            </div>

            {/* Magic resize */}
            <div className="bento-card">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(244,114,182,0.12)', color: '#f472b6' }}>
                <Crop size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Magic Resize</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5">16:9 → Reels 9:16, ek click.</p>
            </div>

            {/* Audio */}
            <div className="bento-card lg:col-span-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}>
                <Volume2 size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">Audio Studio</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Voiceover, music, noise removal aur normalization — multi-track audio mixing.
              </p>
            </div>

            {/* AI tools */}
            <div className="bento-card lg:col-span-2">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(0,229,199,0.12)', color: 'var(--accent)' }}>
                <Wand2 size={22} />
              </div>
              <h3 className="font-display text-lg font-bold text-white">AI Toolkit</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                Background remove, watermark tools, thumbnail maker — content creators ka poora kit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DESKTOP CLASS ============ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Desktop apps jitna powerful</h2>
            <p className="text-[var(--text-secondary)] mt-2.5">Wahi features — bina download, bina login.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Monitor size={19} />, title: 'Multi-Track Timeline', desc: 'Unlimited tracks, keyframes aur real-time preview.' },
              { icon: <Layers size={19} />, title: 'Advanced Layers', desc: 'Photoshop-style layers, blend modes, masks.' },
              { icon: <Palette size={19} />, title: 'Color Grading', desc: 'Filters, curves aur pro-level color panels.' },
              { icon: <Music size={19} />, title: 'Audio Mixing', desc: 'Multi-track audio, noise reduction, EQ.' },
              { icon: <Scissors size={19} />, title: 'Precision Editing', desc: 'Frame-by-frame navigation, ripple edit, split.' },
              { icon: <ImageIcon size={19} />, title: 'Thumbnail Maker', desc: 'YouTube, Reels, TikTok ke ready templates.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl transition-colors hover:bg-[var(--bg-elevated)]"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(0,229,199,0.1)', color: 'var(--accent)' }}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-20 sm:py-28 px-6 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 500, height: 500, bottom: -220, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,229,199,0.12)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight">
            Shuru karein?<br /><span className="text-gradient">Abhi. Free me.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mt-5">
            No download. No watermark. No signup. Bas kholo aur edit karo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-9">
            <button className="btn btn-primary text-base px-10 py-4 rounded-xl" onClick={() => setView('editor')}>
              <Sparkles size={19} /> Launch Studio
            </button>
            <button className="btn btn-secondary text-base px-10 py-4 rounded-xl" onClick={() => setView('dashboard')}>
              Browse Dashboard <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-[var(--accent)]" />
            <span className="text-sm text-[var(--text-muted)]">X-EDITOR © 2026 — made for creators</span>
          </div>
          <div className="flex gap-6 text-sm text-[var(--text-muted)]">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
