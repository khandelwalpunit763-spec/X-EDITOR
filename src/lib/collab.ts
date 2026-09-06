import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { supabase, canUseSupabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Yjs doc for collaboration (CRDT)
export let ydoc: Y.Doc | null = null
export let yProvider: WebrtcProvider | null = null
export let supabaseChannel: RealtimeChannel | null = null

// Store awareness (cursors) subscribers
export type Collaborator = {
  id: string
  name: string
  color: string
  cursor?: { x: number, y: number }
  avatar?: string
}

const COLORS = ['#00d9c0','#14b8a6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#06b6d4']

export function getCollabColor(userId: string) {
  let hash = 0
  for (let i=0;i<userId.length;i++) hash = userId.charCodeAt(i) + ((hash<<5)-hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export async function initCollab(projectId: string, userId: string, userName: string) {
  if (ydoc) return { ydoc, provider: yProvider }

  ydoc = new Y.Doc()
  
  // 1. Y-WebRTC for P2P (no server needed, works locally + via public signaling)
  try {
    yProvider = new WebrtcProvider(`xeditor-${projectId}`, ydoc, {
      signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc.signaling.demos.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com'],
    })
    // Set awareness
    yProvider.awareness.setLocalStateField('user', {
      name: userName || 'Anonymous',
      color: getCollabColor(userId),
      id: userId
    })
    console.log('🟢 Y-WebRTC connected for', projectId)
  } catch (e) {
    console.warn('WebRTC init failed, falling back to Supabase only', e)
  }

  // 2. Supabase Realtime Broadcast as fallback / for persistence
  if (canUseSupabase()) {
    try {
      supabaseChannel = supabase.channel(`project-${projectId}`, {
        config: { broadcast: { self: false }, presence: { key: userId } }
      })

      supabaseChannel
        .on('broadcast', { event: 'yjs-update' }, ({ payload }) => {
          if (ydoc && payload.update) {
            try {
              const update = Uint8Array.from(atob(payload.update).split('').map(c => c.charCodeAt(0)))
              Y.applyUpdate(ydoc, update)
            } catch {}
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = supabaseChannel?.presenceState()
          console.log('👥 Presence sync', state)
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await supabaseChannel?.track({ userId, userName, color: getCollabColor(userId), online_at: new Date().toISOString() })
          }
        })

      // Forward local Yjs updates to Supabase broadcast
      if (ydoc) {
        ydoc.on('update', (update: Uint8Array) => {
          const base64 = btoa(String.fromCharCode(...update))
          supabaseChannel?.send({ type: 'broadcast', event: 'yjs-update', payload: { update: base64, userId } })
        })
      }
      console.log('🟣 Supabase Realtime channel joined for', projectId)
    } catch (e) {
      console.warn('Supabase realtime failed', e)
    }
  }

  return { ydoc, provider: yProvider, channel: supabaseChannel }
}

export function disconnectCollab() {
  try { yProvider?.destroy() } catch {}
  try { supabaseChannel?.unsubscribe() } catch {}
  try { ydoc?.destroy() } catch {}
  ydoc = null
  yProvider = null
  supabaseChannel = null
}

// Helper to get Yjs shared types
export function getYStore() {
  if (!ydoc) return null
  return {
    layers: ydoc.getArray<any>('layers'),
    tracks: ydoc.getArray<any>('tracks'),
    project: ydoc.getMap<any>('project'),
  }
}
