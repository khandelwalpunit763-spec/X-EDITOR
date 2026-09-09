import { create } from 'zustand'

export interface Caption {
  id: string
  start: number // seconds
  end: number   // seconds
  text: string
}

export type CaptionStyle = 'classic' | 'bold' | 'box' | 'yellow' | 'clean'

interface CaptionState {
  captions: Caption[]
  style: CaptionStyle
  enabled: boolean
  fontSize: number // canvas-relative multiplier

  addCaption: (cap: Omit<Caption, 'id'>) => void
  updateCaption: (id: string, updates: Partial<Caption>) => void
  removeCaption: (id: string) => void
  setCaptions: (caps: Caption[]) => void
  clearCaptions: () => void
  setStyle: (style: CaptionStyle) => void
  setEnabled: (enabled: boolean) => void
  setFontSize: (size: number) => void
}

const LS_KEY = 'xeditor_captions'

// Restore persisted captions
const loadPersisted = () => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persisted = loadPersisted()

const persist = (state: Partial<CaptionState>) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      captions: state.captions,
      style: state.style,
      enabled: state.enabled,
      fontSize: state.fontSize,
    }))
  } catch {}
}

export const useCaptionStore = create<CaptionState>((set, get) => ({
  captions: persisted?.captions || [],
  style: persisted?.style || 'classic',
  enabled: persisted?.enabled ?? true,
  fontSize: persisted?.fontSize || 1,

  addCaption: (cap) => {
    const caption: Caption = { ...cap, id: `cap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }
    set(s => {
      const next = { ...s, captions: [...s.captions, caption].sort((a, b) => a.start - b.start) }
      persist(next)
      return { captions: next.captions }
    })
  },

  updateCaption: (id, updates) => {
    set(s => {
      const next = { ...s, captions: s.captions.map(c => c.id === id ? { ...c, ...updates } : c).sort((a, b) => a.start - b.start) }
      persist(next)
      return { captions: next.captions }
    })
  },

  removeCaption: (id) => {
    set(s => {
      const next = { ...s, captions: s.captions.filter(c => c.id !== id) }
      persist(next)
      return { captions: next.captions }
    })
  },

  setCaptions: (caps) => {
    set(s => {
      const next = { ...s, captions: caps.sort((a, b) => a.start - b.start) }
      persist(next)
      return { captions: next.captions }
    })
  },

  clearCaptions: () => {
    set(s => {
      const next = { ...s, captions: [] }
      persist(next)
      return { captions: [] }
    })
  },

  setStyle: (style) => {
    set(s => {
      const next = { ...s, style }
      persist(next)
      return { style }
    })
  },

  setEnabled: (enabled) => {
    set(s => {
      const next = { ...s, enabled }
      persist(next)
      return { enabled }
    })
  },

  setFontSize: (fontSize) => {
    set(s => {
      const next = { ...s, fontSize }
      persist(next)
      return { fontSize }
    })
  },
}))

/** Generate SRT content from captions */
export const captionsToSRT = (captions: Caption[]): string => {
  const fmt = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = Math.floor(sec % 60)
    const ms = Math.round((sec % 1) * 1000)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`
  }
  return captions
    .map((c, i) => `${i + 1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n`)
    .join('\n')
}

/** Generate WebVTT content */
export const captionsToVTT = (captions: Caption[]): string => {
  const srt = captionsToSRT(captions)
  return 'WEBVTT\n\n' + srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
}
