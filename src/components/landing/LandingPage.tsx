import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/authStore';
import { 
  Film, Image, Wand2, Eraser, Volume2, ImageIcon, Layers,
  Sparkles, ArrowRight, Play, ChevronRight, Zap, Cpu, Palette,
  Monitor, Scissors, Music, LogIn, LogOut, User
} from 'lucide-react';

export default function LandingPage({ onLogin }: { onLogin?: () => void }) {
  const { setView } = useStore();
  const { isAuthenticated, user, signOut } = useAuthStore();

  const features = [
    { icon: <Film size={24} />, title: 'Video Editor', desc: 'Professional multi-track timeline with keyframes, transitions, and effects', color: '#6366f1' },
    { icon: <Image size={24} />, title: 'Photo Editor', desc: 'Photoshop-style layers, masks, blend modes, and advanced color controls', color: '#8b5cf6' },
    { icon: <Wand2 size={24} />, title: 'AI Tools', desc: 'Background removal, object removal, upscaling, and smart enhancement', color: '#a855f7' },
    { icon: <Eraser size={24} />, title: 'Watermark Tools', desc: 'Add or remove watermarks on content you own with AI precision', color: '#d946ef' },
    { icon: <Layers size={24} />, title: 'Background Remover', desc: 'AI-powered subject detection and background replacement', color: '#ec4899' },
    { icon: <Volume2 size={24} />, title: 'Audio Editor', desc: 'Voiceover, music, noise removal, and audio normalization', color: '#f43f5e' },
    { icon: <ImageIcon size={24} />, title: 'Thumbnail Maker', desc: 'YouTube, Instagram, and TikTok thumbnail templates', color: '#f97316' },
    { icon: <Sparkles size={24} />, title: 'AI Generation', desc: 'Text-to-image, style transfer, and intelligent editing', color: '#eab308' },
  ];

  const stats = [
    { value: '50+', label: 'Editing Tools' },
    { value: '100+', label: 'Effects & Filters' },
    { value: '4K', label: 'Export Quality' },
    { value: 'AI', label: 'Powered Features' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ background: 'rgba(15, 15, 20, 0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              X-EDITOR
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-ghost text-sm" onClick={() => setView('dashboard')}>Dashboard</button>
            <button className="btn btn-ghost text-sm">Features</button>
            <button className="btn btn-ghost text-sm">Pricing</button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-2 py-1 rounded-full text-xs" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                  <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} className="w-6 h-6 rounded-full" alt="" />
                  <span className="text-gray-300 hidden sm:inline">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                </div>
                <button className="btn btn-ghost text-xs" onClick={signOut}><LogOut size={14} /> Logout</button>
                <button className="btn btn-primary text-sm" onClick={() => setView('editor')}>
                  Start Editing <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-ghost text-sm flex items-center gap-1" onClick={onLogin}><LogIn size={14} /> Login</button>
                <button className="btn btn-primary text-sm" onClick={() => setView('editor')}>
                  Start Editing <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10" 
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(80px)' }} />
          <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)', filter: 'blur(100px)' }} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-sm text-indigo-300">AI-Powered Professional Editing</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Create. Edit. Transform.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional video and photo editing powered by modern AI tools.
            Everything you need in one powerful studio.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <button className="btn btn-primary text-base px-8 py-3 rounded-xl"
              onClick={() => setView('editor')}>
              <Play size={18} /> Start Editing
            </button>
            <button className="btn btn-secondary text-base px-8 py-3 rounded-xl"
              onClick={() => setView('dashboard')}>
              Explore Features <ChevronRight size={18} />
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
              <div className="flex h-80">
                {/* Mock left toolbar */}
                <div className="w-12 flex flex-col items-center py-3 gap-2" style={{ borderRight: '1px solid var(--border)' }}>
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="w-7 h-7 rounded" style={{ background: i === 1 ? 'var(--accent)' : 'var(--bg-hover)' }} />
                  ))}
                </div>
                {/* Mock canvas */}
                <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                  <div className="w-3/4 h-3/4 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid var(--border-light)' }}>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                        <Play size={28} className="text-indigo-400 ml-1" />
                      </div>
                      <span className="text-sm text-gray-400">Your canvas awaits</span>
                    </div>
                  </div>
                </div>
                {/* Mock right panel */}
                <div className="w-56 flex flex-col" style={{ borderLeft: '1px solid var(--border)' }}>
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</div>
                  </div>
                  {[1,2,3,4].map(i => (
                    <div key={i} className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                      <div className="h-2 w-16 rounded bg-gray-700" />
                      <div className="h-2 w-10 rounded bg-gray-800" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Mock timeline */}
              <div className="h-24 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-tertiary)' }}>
                <div className="h-6 flex items-center px-3 gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-[10px] text-gray-600">00:00:00</div>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  <div className="text-[10px] text-gray-600">00:01:00</div>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-[10px] text-gray-600">Video 1</div>
                    <div className="h-4 rounded flex-1 max-w-xs" style={{ background: 'rgba(99, 102, 241, 0.3)' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-[10px] text-gray-600">Audio 1</div>
                    <div className="h-4 rounded flex-1 max-w-[60%]" style={{ background: 'rgba(34, 197, 94, 0.3)' }} />
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl opacity-20 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), transparent, rgba(168,85,247,0.3))', filter: 'blur(40px)' }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg">Professional tools for every creative workflow</p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => setView('editor')}
                className="group text-left p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${feature.color}20`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-6" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Professionals</h2>
            <p className="text-gray-400 text-lg">Powerful features that rival desktop applications</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: <Monitor size={20} />, title: 'Multi-Track Timeline', desc: 'Professional video editing with unlimited tracks, keyframes, and real-time preview' },
              { icon: <Layers size={20} />, title: 'Advanced Layers', desc: 'Photoshop-style layers with blend modes, masks, groups, and non-destructive editing' },
              { icon: <Cpu size={20} />, title: 'AI-Powered', desc: 'Background removal, object detection, auto-enhancement, and smart cropping' },
              { icon: <Palette size={20} />, title: 'Color Grading', desc: 'Professional color wheels, curves, levels, and LUT support' },
              { icon: <Scissors size={20} />, title: 'Precision Editing', desc: 'Frame-by-frame navigation, ripple edit, slip, and slide tools' },
              { icon: <Music size={20} />, title: 'Audio Mixing', desc: 'Multi-track audio, noise reduction, equalizer, and voice enhancement' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <div className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
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
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Start editing with professional tools today. No downloads required.
          </p>
          <button className="btn btn-primary text-lg px-10 py-4 rounded-xl"
            onClick={() => setView('editor')}>
            <Sparkles size={20} /> Launch Studio
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-indigo-400" />
            <span className="text-sm text-gray-500">X-EDITOR © 2026. All rights reserved.</span>
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
