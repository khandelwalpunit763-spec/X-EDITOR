import { useState } from 'react'
import { X, HardDrive, Music2, Download, Link2, Check, Upload, Sparkles, Video, Camera } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  onClose: () => void
  projectName: string
  exportUrl?: string // local blob url after export
}

const destinations = [
  { id: 'youtube', label: 'YouTube', icon: <Video size={18} />, color: '#ff0000', desc: 'Direct upload to your channel' },
  { id: 'drive', label: 'Google Drive', icon: <HardDrive size={18} />, color: '#4285f4', desc: 'Save to Drive' },
  { id: 'instagram', label: 'Instagram', icon: <Camera size={18} />, color: '#e4405f', desc: 'Reel / Post' },
  { id: 'tiktok', label: 'TikTok', icon: <Music2 size={18} />, color: '#000', desc: 'Upload as video' },
  { id: 'download', label: 'Direct Download', icon: <Download size={18} />, color: '#22c55e', desc: 'Save to device' },
  { id: 'link', label: 'Copy Link', icon: <Link2 size={18} />, color: '#00d9c0', desc: 'Shareable link + QR' },
]

export default function ShareUploadModal({ onClose, projectName, exportUrl }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const shareLink = exportUrl || `https://x-editor.app/share/${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`

  const handleSelect = (id: string) => {
    setSelected(id)
    if (id === 'link') {
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    if (id === 'download' && exportUrl) {
      const a = document.createElement('a')
      a.href = exportUrl
      a.download = `${projectName}.mp4`
      a.click()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2"><Upload size={18} className="text-[var(--accent)]" /> Export Ready!</h2>
            <p className="text-xs text-gray-500 mt-0.5">{projectName} • Kaha upload karna hai choose karein</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] text-gray-500"><X size={16} /></button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
          {destinations.map(d => (
            <button
              key={d.id}
              onClick={() => handleSelect(d.id)}
              className={`p-4 rounded-xl text-left border transition-all hover:scale-[1.02] ${selected === d.id ? 'ring-2 ring-[var(--accent)] border-[var(--accent)]' : 'hover:border-[var(--border-light)]'}`}
              style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${d.color}18`, color: d.color, border: `1px solid ${d.color}30` }}>
                {d.icon}
              </div>
              <div className="text-xs font-semibold">{d.label}</div>
              <div className="text-[11px] text-gray-500 leading-tight mt-0.5">{d.desc}</div>
              {selected === d.id && <div className="mt-2 text-[11px] text-[var(--accent)] flex items-center gap-1"><Check size={12} /> Selected</div>}
            </button>
          ))}
        </div>

        {selected === 'link' && (
          <div className="mx-4 mb-4 p-4 rounded-xl flex gap-4 items-center" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <div className="bg-white p-2 rounded-lg">
              <QRCodeSVG value={shareLink} size={80} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium flex items-center gap-1"><Sparkles size={12} className="text-[var(--accent)]" /> Share Link + QR</div>
              <div className="text-[11px] text-gray-500 truncate mt-1 bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border)]">{shareLink}</div>
              <button onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(()=>setCopied(false),2000)}}
                className="mt-2 text-xs px-3 py-1 rounded-full bg-[var(--accent)] text-white flex items-center gap-1">
                {copied ? <><Check size={12} /> Copied!</> : <><Link2 size={12} /> Copy Link</>}
              </button>
            </div>
          </div>
        )}

        {selected && selected !== 'link' && selected !== 'download' && (
          <div className="mx-4 mb-4 p-3 rounded-xl text-xs text-amber-300 flex items-center gap-2" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <span>🔑</span> {destinations.find(d=>d.id===selected)?.label} API connect karne ke liye Supabase me OAuth keys add karni hongi. Abhi mock upload simulate ho raha hai.
          </div>
        )}

        <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost text-xs">Close</button>
          <button onClick={() => { if(selected) alert(`${destinations.find(d=>d.id===selected)?.label} pe upload started! (Demo)`); onClose() }}
            disabled={!selected}
            className="btn btn-primary text-xs disabled:opacity-50">
            Upload {selected ? `to ${destinations.find(d=>d.id===selected)?.label}` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
