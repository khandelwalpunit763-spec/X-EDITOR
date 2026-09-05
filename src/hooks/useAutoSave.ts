import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { useAuthStore } from '../store/authStore'
import { supabase, canUseSupabase } from '../lib/supabase'

const AUTOSAVE_KEY = 'xeditor_autosave'
const AUTOSAVE_INTERVAL = 2000 // 2 sec debounce

export function useAutoSave() {
  const saveTimeoutRef = useRef<number | null>(null)
  const lastSavedRef = useRef<string>('')

  const { project, layers, tracks, currentTime } = useStore()
  const { user, isAuthenticated } = useAuthStore()

  // Create save payload
  const getPayload = () => {
    if (!project) return null
    return {
      project,
      layers,
      tracks,
      currentTime,
      savedAt: new Date().toISOString(),
      userId: user?.id || 'guest',
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

  const saveToCloud = async (payload: any) => {
    if (!canUseSupabase() || !isAuthenticated || !user) return
    try {
      const { error } = await supabase.from('projects').upsert({
        id: payload.project.id,
        user_id: user.id,
        name: payload.project.name,
        type: payload.project.type,
        width: payload.project.width,
        height: payload.project.height,
        fps: payload.project.fps,
        aspect_ratio: payload.project.aspectRatio,
        background: payload.project.background,
        data: { layers, tracks, currentTime },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      if (error) throw error
      console.log('☁️ Auto-saved to Supabase at', new Date().toLocaleTimeString())
    } catch (e) {
      console.error('Cloud autosave failed', e)
      // fallback to local
      saveToLocal(payload)
    }
  }

  const triggerSave = () => {
    const payload = getPayload()
    if (!payload) return

    // Debounce
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = window.setTimeout(async () => {
      saveToLocal(payload)
      if (isAuthenticated) await saveToCloud(payload)
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
        // Use beacon for cloud if possible
        if (canUseSupabase() && isAuthenticated) {
          navigator.sendBeacon?.(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/projects`, JSON.stringify(payload))
        }
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
  }, [project, layers, tracks, currentTime, isAuthenticated, user])

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
