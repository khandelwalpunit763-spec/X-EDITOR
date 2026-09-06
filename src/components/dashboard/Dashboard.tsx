import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/authStore';
import BackButton from '../common/BackButton';
import TemplateUploadModal from '../templates/TemplateUploadModal';
import QRScanner, { TemplateSearchBar } from '../templates/QRScanner';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, FolderOpen, Image, Film, Wand2, Download, Trash2, Settings,
  Search, Grid3X3, List, Clock, MoreVertical, Zap, ArrowLeft,
  Layers, Type, Music, Sparkles, FileText, LogIn, LogOut, QrCode, Upload, FileImage
} from 'lucide-react';

export default function Dashboard({ onLogin }: { onLogin?: () => void }) {
  const { setView, setShowNewProjectModal, setEditorMode } = useStore();
  const { isAuthenticated, user, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState('projects');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateUpload, setShowTemplateUpload] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('xeditor_templates') || '[]')
    setCustomTemplates(saved)
  }, [showTemplateUpload, activeTab]);

  const recentProjects = [
    { id: '1', name: 'YouTube Intro', type: 'video' as const, thumbnail: '', updatedAt: '2 hours ago', size: '1920x1080' },
    { id: '2', name: 'Instagram Post', type: 'photo' as const, thumbnail: '', updatedAt: '5 hours ago', size: '1080x1080' },
    { id: '3', name: 'Product Demo', type: 'video' as const, thumbnail: '', updatedAt: '1 day ago', size: '3840x2160' },
    { id: '4', name: 'Wedding Highlights', type: 'video' as const, thumbnail: '', updatedAt: '2 days ago', size: '1920x1080' },
    { id: '5', name: 'Logo Design', type: 'photo' as const, thumbnail: '', updatedAt: '3 days ago', size: '1024x1024' },
    { id: '6', name: 'Podcast Cover', type: 'photo' as const, thumbnail: '', updatedAt: '1 week ago', size: '3000x3000' },
  ];

  const templates = [
    { id: '1', name: 'YouTube Thumbnail', size: '1280x720', category: 'YouTube' },
    { id: '2', name: 'Instagram Reel', size: '1080x1920', category: 'Instagram' },
    { id: '3', name: 'TikTok Video', size: '1080x1920', category: 'TikTok' },
    { id: '4', name: 'Facebook Cover', size: '820x312', category: 'Facebook' },
    { id: '5', name: 'Twitter Post', size: '1200x675', category: 'Twitter' },
    { id: '6', name: 'LinkedIn Banner', size: '1584x396', category: 'LinkedIn' },
  ];

  const tabs = [
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={16} /> },
    { id: 'templates', label: 'Templates', icon: <Grid3X3 size={16} /> },
    { id: 'media', label: 'Media Library', icon: <Image size={16} /> },
    { id: 'ai', label: 'AI Tools', icon: <Wand2 size={16} /> },
    { id: 'exports', label: 'Export History', icon: <Download size={16} /> },
    { id: 'trash', label: 'Trash', icon: <Trash2 size={16} /> },
  ];

  const getProjectColor = (type: string) => {
    return type === 'video' 
      ? 'from-[#00d9c0] to-[#0891b2]' 
      : 'from-[#22d3ee] to-[#0e7490]';
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      YouTube: '#ff0000', Instagram: '#e4405f', TikTok: '#25f4ee',
      Facebook: '#1877f2', Twitter: '#1da1f2', LinkedIn: '#0077b5'
    };
    return colors[cat] || '#00d9c0';
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 flex items-center justify-between px-6 border-b flex-shrink-0" 
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-4">
          <BackButton label="Back" variant="ghost" />
          <div className="w-px h-6 hidden sm:block" style={{ background: 'var(--border)' }} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
              style={{ background: 'linear-gradient(135deg, #00d9c0, #00b8a3)' }}>
              <Zap size={16} className="text-black" />
            </div>
            <span className="font-bold">X-EDITOR</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 w-48 lg:w-64"
            />
          </div>
          <button className="btn btn-ghost hidden sm:flex" onClick={() => setShowNewProjectModal(true)}>
            <Settings size={16} />
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} className="w-8 h-8 rounded-full border" style={{ borderColor: 'var(--border)' }} alt="" />
              <button className="btn btn-ghost text-xs" onClick={signOut}><LogOut size={14} /> Logout</button>
            </div>
          ) : (
            <button className="btn btn-primary text-xs" onClick={onLogin}><LogIn size={14} /> Login</button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop) */}
        <div className="w-56 flex-shrink-0 border-r flex-col py-4 hidden md:flex" 
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          {/* New Project Buttons */}
          <div className="px-4 mb-6 flex flex-col gap-2">
            <button className="btn btn-primary w-full justify-start" 
              onClick={() => { setEditorMode('video'); setShowNewProjectModal(true); }}>
              <Film size={16} /> New Video Project
            </button>
            <button className="btn btn-secondary w-full justify-start"
              onClick={() => { setEditorMode('photo'); setShowNewProjectModal(true); }}>
              <Image size={16} /> New Photo Project
            </button>
            <button className="btn btn-secondary w-full justify-start"
              onClick={() => setView('compress')}>
              <FileImage size={16} /> Image Compressor
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 text-sm transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--accent)] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-[var(--bg-hover)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Storage */}
          <div className="px-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs text-gray-500 mb-2">Storage Used</div>
            <div className="w-full h-2 rounded-full bg-gray-800 mb-1">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: '35%' }} />
            </div>
            <div className="text-xs text-gray-600">3.5 GB of 10 GB</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Mobile tab bar */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 md:hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id ? 'bg-[var(--accent)] text-black' : 'bg-[var(--bg-secondary)] text-gray-400 border border-[var(--border)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => setView('compress')}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-secondary)] text-[var(--accent)] border border-[var(--accent)]/40"
            >
              <FileImage size={14} /> Compressor
            </button>
          </div>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === 'projects' && `${recentProjects.length} projects`}
                {activeTab === 'templates' && `${templates.length} templates`}
                {activeTab === 'ai' && 'Smart editing powered by AI'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[var(--bg-hover)] text-white' : 'text-gray-500'}`}>
                <Grid3X3 size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[var(--bg-hover)] text-white' : 'text-gray-500'}`}>
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-2'}>
              {/* New Project Card */}
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="group rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]"
                style={{ borderColor: 'var(--border)', minHeight: viewMode === 'grid' ? '220px' : '80px' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: 'rgba(0, 217, 192, 0.15)' }}>
                  <Plus size={24} className="text-[var(--accent)]" />
                </div>
                <span className="text-sm font-medium text-gray-400 group-hover:text-white">New Project</span>
              </button>

              {recentProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => setView('editor')}
                  className={`group rounded-xl overflow-hidden text-left transition-all hover:shadow-xl hover:scale-[1.02] ${
                    viewMode === 'grid' ? '' : 'flex items-center gap-4'
                  }`}
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className={`h-32 bg-gradient-to-br ${getProjectColor(project.type)} flex items-center justify-center relative`}>
                        {project.type === 'video' ? <Film size={32} className="text-white/50" /> : <Image size={32} className="text-white/50" />}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-sm mb-1">{project.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{project.updatedAt}</span>
                          <span>•</span>
                          <span>{project.size}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${getProjectColor(project.type)} ml-3`}>
                        {project.type === 'video' ? <Film size={20} className="text-white/50" /> : <Image size={20} className="text-white/50" />}
                      </div>
                      <div className="flex-1 py-3">
                        <div className="font-medium text-sm">{project.name}</div>
                        <div className="text-xs text-gray-500">{project.size} • {project.updatedAt}</div>
                      </div>
                      <div className="pr-3 opacity-0 group-hover:opacity-100">
                        <button className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)]">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <TemplateSearchBar onSearch={setSearchQuery} onQRScan={() => setShowQRScanner(true)} />
                <button onClick={() => isAuthenticated ? setShowTemplateUpload(true) : onLogin?.()} className="btn btn-primary text-xs ml-auto">
                  <Upload size={14} /> {isAuthenticated ? 'New Template' : 'Login to Add Template'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...templates, ...customTemplates].filter(t => !searchQuery || t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.category?.toLowerCase().includes(searchQuery.toLowerCase())).map(template => {
                  const isCustom = !!template.title
                  const name = template.title || template.name
                  const size = template.preview_image ? `${template.width}x${template.height}` : template.size
                  const qrVal = `https://x-editor.app/t/${name.toLowerCase().replace(/\s+/g,'-')}-${template.id}`
                  return (
                    <div
                      key={template.id}
                      className="group rounded-xl overflow-hidden text-left transition-all hover:shadow-xl hover:scale-[1.02] relative"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                    >
                      <button onClick={() => setShowNewProjectModal(true)} className="w-full text-left">
                        <div className="h-36 flex items-center justify-center relative overflow-hidden" 
                          style={{ background: template.preview_image ? '#000' : `linear-gradient(135deg, ${getCategoryColor(template.category)}30, ${getCategoryColor(template.category)}10)` }}>
                          {template.preview_image ? (
                            <img src={template.preview_image} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <div className="text-lg font-bold mb-1" style={{ color: getCategoryColor(template.category) }}>{template.category}</div>
                              <div className="text-xs text-gray-500">{template.size}</div>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-white p-1 rounded-md shadow hidden group-hover:block">
                            <QRCodeSVG value={qrVal} size={32} />
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="font-medium text-sm flex items-center gap-1">{name} {isCustom && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--accent)] text-white">NEW</span>}</div>
                          <div className="text-xs text-gray-500 mt-1">{size} • {template.category}</div>
                        </div>
                      </button>
                      <div className="px-3 pb-3 flex items-center gap-2">
                        <div className="flex-1 text-[11px] text-gray-600 truncate flex items-center gap-1"><QrCode size={10} /> QR ready</div>
                        <button onClick={() => { navigator.clipboard.writeText(qrVal); alert('QR link copied!') }} className="text-[11px] px-2 py-1 rounded bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] border" style={{ borderColor: 'var(--border)' }}>Copy QR Link</button>
                      </div>
                    </div>
                  )
                })}
              </div>
              {showTemplateUpload && <TemplateUploadModal onClose={() => setShowTemplateUpload(false)} onCreated={() => setCustomTemplates(JSON.parse(localStorage.getItem('xeditor_templates')||'[]'))} />}
              {showQRScanner && <QRScanner onClose={() => setShowQRScanner(false)} onScan={(text) => { setSearchQuery(text.split('/t/')[1]?.split('-')[0] || text); setShowQRScanner(false) }} />}
            </div>
          )}

          {/* AI Tools Tab */}
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: <Layers size={24} />, name: 'Background Remover', desc: 'Remove backgrounds from images and videos', color: '#00d9c0' },
                { icon: <Wand2 size={24} />, name: 'Object Removal', desc: 'Remove unwanted objects from your content', color: '#14b8a6' },
                { icon: <Sparkles size={24} />, name: 'Image Upscaler', desc: 'Enhance resolution up to 4x with AI', color: '#00b8a3' },
                { icon: <Type size={24} />, name: 'Auto Captions', desc: 'Generate subtitles from audio automatically', color: '#d946ef' },
                { icon: <Music size={24} />, name: 'Noise Removal', desc: 'Remove background noise from audio', color: '#ec4899' },
                { icon: <Image size={24} />, name: 'AI Generation', desc: 'Generate images from text descriptions', color: '#f43f5e' },
                { icon: <FileText size={24} />, name: 'Smart Crop', desc: 'AI-powered intelligent cropping', color: '#f97316' },
                { icon: <Wand2 size={24} />, name: 'Auto Enhance', desc: 'One-click image enhancement', color: '#eab308' },
                { icon: <Layers size={24} />, name: 'Style Transfer', desc: 'Apply artistic styles to your images', color: '#22c55e' },
              ].map((tool, i) => (
                <button
                  key={i}
                  onClick={() => useStore.getState().setShowAIModal(true)}
                  className="group p-5 rounded-xl text-left transition-all hover:shadow-xl hover:scale-[1.02]"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{ background: `${tool.color}20`, color: tool.color }}>
                    {tool.icon}
                  </div>
                  <div className="font-medium text-sm mb-1">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.desc}</div>
                </button>
              ))}
            </div>
          )}

          {/* Exports Tab */}
          {activeTab === 'exports' && (
            <div className="text-center py-20">
              <Download size={48} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">No exports yet</h3>
              <p className="text-sm text-gray-500">Your exported files will appear here</p>
            </div>
          )}

          {/* Trash Tab */}
          {activeTab === 'trash' && (
            <div className="text-center py-20">
              <Trash2 size={48} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">Trash is empty</h3>
              <p className="text-sm text-gray-500">Deleted projects will appear here</p>
            </div>
          )}

          {/* Media Library Tab */}
          {activeTab === 'media' && (
            <div className="text-center py-20">
              <Image size={48} className="mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-semibold mb-2">No media files</h3>
              <p className="text-sm text-gray-500 mb-4">Import images, videos, and audio to get started</p>
              <button className="btn btn-primary">
                <Plus size={16} /> Import Media
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
