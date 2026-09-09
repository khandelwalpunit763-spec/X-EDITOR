import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

const AUTOSAVE_KEY = 'xeditor_autosave'
const AUTOSAVE_INTERVAL = 2000 // 2 sec debounce

export function useAutoSave() {
  const saveTimeoutRef = useRef<number | null>(null)
  const lastSavedRef = useRef<string>('')

  const { project, layers, tracks, currentTime } = useStore()

  // Create save payload
  const getPayload = () => {
    if (!project) return null
    return {
      project,
      layers,
      tracks,
      currentTime,
      savedAt: new Date().toISOString(),
      userId: 'guest',
    }
  }

  const saveToLocal = (payload: any) => {
    try {
      const str = JSON.stringify(payload)
      if (str === lastSavedRef.current) return // no change
      lastSavedRef.current = str
      localStorage.setItem(AUTOSAVE_KEY, str)
      localStorage.setItem(`${AUTOSAVE_KEY}_time`, new Date().toISOString())
      // Save also to IndexedDB-like key per project
      if (payload.project?.id) {
        localStorage.setItem(`${AUTOSAVE_KEY}_${payload.project.id}`, str)
      }
      console.log('💾 Auto-saved locally at', new Date().toLocaleTimeString())
    } catch (e) {
      console.error('Local autosave failed', e)
    }
  }

  const triggerSave = () => {
    const payload = getPayload()
    if (!payload) return

    // Debounce
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = window.setTimeout(() => {
      saveToLocal(payload)
    }, AUTOSAVE_INTERVAL)
  }

  // Watch for changes
  useEffect(() => {
    if (!project) return
    triggerSave()
  }, [layers, tracks, project, currentTime])

  // beforeunload + visibilitychange - force immediate save
  useEffect(() => {
    const handleBeforeUnload = () => {
      const payload = getPayload()
      if (payload) {
        // synchronous save
        try {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload))
        } catch {}
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const payload = getPayload()
        if (payload) saveToLocal(payload)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [project, layers, tracks, currentTime])

  // Restore helper
  const hasDraft = () => {
    const draft = localStorage.getItem(AUTOSAVE_KEY)
    if (!draft) return null
    try { return JSON.parse(draft) } catch { return null }
  }

  return { hasDraft, triggerSave }
}

// Hook to restore draft on load
export function useRestoreDraft() {
  const { setProject, layers } = useStore.getState()
  const draft = (() => {
    try {
      const d = localStorage.getItem(AUTOSAVE_KEY)
      return d ? JSON.parse(d) : null
    } catch { return null }
  })()

  const shouldRestore = draft && draft.project && draft.layers && draft.layers.length > 0 && layers.length === 0

  return { draft, shouldRestore }
}
