import { useState } from 'react'
import { X, Upload, Image as ImageIcon, Sparkles } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuthStore } from '../../store/authStore'
import { supabase, canUseSupabase } from '../../lib/supabase'

interface Props {
  onClose: () => void
  onCreated?: (template: any) => void
}

export default function TemplateUploadModal({ onClose, onCreated }: Props) {
  const { user } = useAuthStore()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('YouTube')
  const [preview, setPreview] = useState('')
  const [width, setWidth] = useState(1280)
  const [height, setHeight] = useState(720)
  const [type, setType] = useState<'photo'|'video'>('photo')
  const [saving, setSaving] = useState(false)

  const qrValue = `https://x-editor.app/t/${title.toLowerCase().replace(/\s+/g,'-') || 'new'}-${Date.now().toString(36)}`

  const handleSave = async () => {
    if (!title.trim() || !preview) {
      alert('Title aur Preview Image URL daalo bhai!')
      return
    }
    setSaving(true)
    const template = {
      id: `tmpl-${Date.now()}`,
      user_id: user?.id || 'guest',
      title: title.trim(),
      category,
      preview_image: preview,
      width, height, type,
      tags: [category.toLowerCase(), type],
      is_public: true,
      likes: 0,
      downloads: 0,
      created_at: new Date().toISOString(),
      qr: qrValue
    }

    // Try Supabase, fallback to localStorage
    if (canUseSupabase()) {
      try {
        const { error } = await supabase.from('templates').insert({
          id: template.id,
          user_id: template.user_id,
          title: template.title,
          category: template.category,
          preview_image: template.preview_image,
          width: template.width,
          height: template.height,
          type: template.type,
          tags: template.tags,
          is_public: true,
          likes: 0,
          downloads: 0
        })
        if (error) throw error
      } catch (e) {
        console.warn('Supabase insert failed, saving locally', e)
        // save locally
        const existing = JSON.parse(localStorage.getItem('xeditor_templates') || '[]')
        existing.push(template)
        localStorage.setItem('xeditor_templates', JSON.stringify(existing))
      }
    } else {
      const existing = JSON.parse(localStorage.getItem('xeditor_templates') || '[]')
      existing.push(template)
      localStorage.setItem('xeditor_templates', JSON.stringify(existing))
    }

    setSaving(false)
    onCreated?.(template)
    alert(`✅ Template "${title}" save ho gaya!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-bold flex items-center gap-2"><Sparkles size={18} className="text-[var(--accent)]" /> New Template Banao</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] text-gray-500"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500">Title *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. YouTube Thumbnail Pro" className="input w-full mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">Category</label>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="input w-full mt-1">
                <option>YouTube</option><option>Instagram</option><option>TikTok</option><option>Facebook</option><option>LinkedIn</option><option>Thumbnail</option><option>Reel</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Type</label>
              <select value={type} onChange={e=>setType(e.target.value as any)} className="input w-full mt-1">
                <option value="photo">Photo</option><option value="video">Video</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500">Width</label><input type="number" value={width} onChange={e=>setWidth(Number(e.target.value))} className="input w-full mt-1" /></div>
            <div><label className="text-xs text-gray-500">Height</label><input type="number" value={height} onChange={e=>setHeight(Number(e.target.value))} className="input w-full mt-1" /></div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Preview Image URL *</label>
            <input value={preview} onChange={e=>setPreview(e.target.value)} placeholder="https://..." className="input w-full mt-1" />
            {preview && <img src={preview} alt="preview" className="mt-2 w-full h-32 object-cover rounded-lg border" style={{ borderColor: 'var(--border)' }} onError={e=> (e.currentTarget.style.display='none')} />}
          </div>

          {/* QR Preview */}
          <div className="p-3 rounded-xl flex gap-3 items-center" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
            <div className="bg-white p-2 rounded-lg"><QRCodeSVG value={qrValue} size={64} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium">Auto QR Code</div>
              <div className="text-[11px] text-gray-500 break-all">{qrValue}</div>
              <div className="text-[11px] text-gray-600 mt-1">Isse koi bhi scan karke direct template open kar sakta hai</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="btn btn-ghost text-xs">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary text-xs disabled:opacity-50">
            <Upload size={14} /> {saving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>
    </div>
  )
}
