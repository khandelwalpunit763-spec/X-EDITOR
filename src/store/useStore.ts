import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type {
  AppView, EditorMode, Tool, RightPanel, Project, Layer,
  TimelineClip, Track, MediaFile, Filter, Keyframe, ProjectSettings,
  Transition
} from '../types';

interface HistoryEntry {
  layers: Layer[];
  tracks: Track[];
}

interface AppState {
  // App state
  view: AppView;
  viewHistory: AppView[];
  editorMode: EditorMode;
  isLoading: boolean;
  showNewProjectModal: boolean;
  showExportModal: boolean;
  showImportModal: boolean;
  showSettingsModal: boolean;
  showHelpModal: boolean;
  showShortcutsModal: boolean;
  showWatermarkModal: boolean;
  showAIModal: boolean;
  showThumbnailModal: boolean;
  showShareModal: boolean;
  showLoginModal: boolean;

  // Project
  project: Project | null;
  recentProjects: Project[];

  // Editor
  activeTool: Tool;
  activePanel: RightPanel;
  zoom: number;
  showGrid: boolean;
  showGuides: boolean;
  showSafeZones: boolean;
  snapToObjects: boolean;
  isPlaying: boolean;
  currentTime: number;
  selectedClipId: string | null;
  selectedLayerId: string | null;

  // Layers
  layers: Layer[];

  // Timeline
  tracks: Track[];
  timelineZoom: number;
  fps: number;

  // Media
  mediaFiles: MediaFile[];

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Actions
  setView: (view: AppView) => void;
  goBack: () => void;
  setEditorMode: (mode: EditorMode) => void;
  setLoading: (loading: boolean) => void;
  setActiveTool: (tool: Tool) => void;
  setActivePanel: (panel: RightPanel) => void;
  setZoom: (zoom: number) => void;
  setShowGrid: (show: boolean) => void;
  setShowGuides: (show: boolean) => void;
  setShowSafeZones: (show: boolean) => void;
  setSnapToObjects: (snap: boolean) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setSelectedClipId: (id: string | null) => void;
  setSelectedLayerId: (id: string | null) => void;
  setTimelineZoom: (zoom: number) => void;

  // Project actions
  createProject: (settings: ProjectSettings) => void;
  setProject: (project: Project | null) => void;

  // Layer actions
  addLayer: (layer: Partial<Layer>) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  mergeLayers: (ids: string[]) => void;

  // Track actions
  addTrack: (type: Track['type']) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;

  // Clip actions
  addClip: (trackId: string, clip: Partial<TimelineClip>) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<TimelineClip>) => void;
  removeClip: (trackId: string, clipId: string) => void;
  splitClip: (trackId: string, clipId: string, time: number) => void;
  duplicateClip: (trackId: string, clipId: string) => void;

  // Media actions
  addMediaFile: (file: MediaFile) => void;
  removeMediaFile: (id: string) => void;
  toggleFavorite: (id: string) => void;

  // Filter actions
  addFilter: (layerId: string, filter: Filter) => void;
  updateFilter: (layerId: string, filterId: string, updates: Partial<Filter>) => void;
  removeFilter: (layerId: string, filterId: string) => void;

  // Keyframe actions
  addKeyframe: (layerId: string, keyframe: Keyframe) => void;
  removeKeyframe: (layerId: string, keyframeId: string) => void;

  // Transition actions
  addTransition: (trackId: string, clipId: string, type: 'in' | 'out', transition: Transition) => void;
  removeTransition: (trackId: string, clipId: string, type: 'in' | 'out') => void;

  // Modal actions
  setShowNewProjectModal: (show: boolean) => void;
  setShowExportModal: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  setShowHelpModal: (show: boolean) => void;
  setShowShortcutsModal: (show: boolean) => void;
  setShowWatermarkModal: (show: boolean) => void;
  setShowAIModal: (show: boolean) => void;
  setShowThumbnailModal: (show: boolean) => void;
  setShowShareModal: (show: boolean) => void;
  setShowLoginModal: (show: boolean) => void;

  // History actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Save
  saveProject: () => void;
}

const createDefaultTracks = (): Track[] => [
  { id: uuid(), name: 'Video 1', type: 'video', clips: [], locked: false, visible: true, muted: false, volume: 100, height: 60 },
  { id: uuid(), name: 'Video 2', type: 'video', clips: [], locked: false, visible: true, muted: false, volume: 100, height: 60 },
  { id: uuid(), name: 'Image 1', type: 'image', clips: [], locked: false, visible: true, muted: false, volume: 100, height: 50 },
  { id: uuid(), name: 'Text 1', type: 'text', clips: [], locked: false, visible: true, muted: false, volume: 100, height: 40 },
  { id: uuid(), name: 'Audio 1', type: 'audio', clips: [], locked: false, visible: true, muted: false, volume: 80, height: 50 },
  { id: uuid(), name: 'Audio 2', type: 'audio', clips: [], locked: false, visible: true, muted: false, volume: 80, height: 50 },
];

export const useStore = create<AppState>((set, get) => ({
  view: 'landing',
  viewHistory: [],
  editorMode: 'video',
  isLoading: false,
  showNewProjectModal: false,
  showExportModal: false,
  showImportModal: false,
  showSettingsModal: false,
  showHelpModal: false,
  showShortcutsModal: false,
  showWatermarkModal: false,
  showAIModal: false,
  showThumbnailModal: false,
  showShareModal: false,
  showLoginModal: false,

  project: null,
  recentProjects: [],

  activeTool: 'select',
  activePanel: 'properties',
  zoom: 100,
  showGrid: false,
  showGuides: false,
  showSafeZones: false,
  snapToObjects: true,
  isPlaying: false,
  currentTime: 0,
  selectedClipId: null,
  selectedLayerId: null,

  layers: [],
  tracks: createDefaultTracks(),
  timelineZoom: 1,
  fps: 30,

  mediaFiles: [],

  history: [{ layers: [], tracks: createDefaultTracks() }],
  historyIndex: 0,

  setView: (view) => set((s) => {
    if (s.view === view) return {}
    return { view, viewHistory: [...s.viewHistory, s.view].slice(-20) }
  }),
  goBack: () => set((s) => {
    if (s.viewHistory.length === 0) return { view: 'landing' as AppView }
    const prev = s.viewHistory[s.viewHistory.length - 1]
    return { view: prev, viewHistory: s.viewHistory.slice(0, -1) }
  }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  setLoading: (loading) => set({ isLoading: loading }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(1000, zoom)) }),
  setShowGrid: (show) => set({ showGrid: show }),
  setShowGuides: (show) => set({ showGuides: show }),
  setShowSafeZones: (show) => set({ showSafeZones: show }),
  setSnapToObjects: (snap) => set({ snapToObjects: snap }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setSelectedClipId: (id) => set({ selectedClipId: id }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setTimelineZoom: (zoom) => set({ timelineZoom: Math.max(0.1, Math.min(10, zoom)) }),

  createProject: (settings) => {
    const project: Project = {
      id: uuid(),
      name: settings.name,
      type: get().editorMode,
      width: settings.width,
      height: settings.height,
      fps: settings.fps,
      aspectRatio: settings.aspectRatio,
      background: settings.background,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({
      project,
      tracks: createDefaultTracks(),
      layers: [],
      currentTime: 0,
      view: 'editor',
      showNewProjectModal: false,
    });
  },

  setProject: (project) => set({ project }),

  addLayer: (layerData) => {
    const layer: Layer = {
      id: uuid(),
      name: layerData.name || `Layer ${get().layers.length + 1}`,
      type: layerData.type || 'image',
      visible: true,
      locked: false,
      opacity: 100,
      blendMode: 'normal',
      x: 0,
      y: 0,
      width: get().project?.width || 1920,
      height: get().project?.height || 1080,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      ...layerData,
    };
    set((s) => ({
      layers: [...s.layers, layer],
      selectedLayerId: layer.id,
    }));
  },

  updateLayer: (id, updates) => {
    set((s) => ({
      layers: s.layers.map((l) => l.id === id ? { ...l, ...updates } : l),
    }));
  },

  removeLayer: (id) => {
    set((s) => ({
      layers: s.layers.filter((l) => l.id !== id),
      selectedLayerId: s.selectedLayerId === id ? null : s.selectedLayerId,
    }));
  },

  duplicateLayer: (id) => {
    const layer = get().layers.find((l) => l.id === id);
    if (!layer) return;
    const newLayer = { ...layer, id: uuid(), name: `${layer.name} Copy`, x: layer.x + 20, y: layer.y + 20 };
    set((s) => ({
      layers: [...s.layers, newLayer],
      selectedLayerId: newLayer.id,
    }));
  },

  reorderLayers: (fromIndex, toIndex) => {
    set((s) => {
      const layers = [...s.layers];
      const [moved] = layers.splice(fromIndex, 1);
      layers.splice(toIndex, 0, moved);
      return { layers };
    });
  },

  mergeLayers: (ids) => {
    set((s) => ({
      layers: s.layers.filter((l) => !ids.includes(l.id)),
    }));
  },

  addTrack: (type) => {
    const track: Track = {
      id: uuid(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${get().tracks.filter((t) => t.type === type).length + 1}`,
      type,
      clips: [],
      locked: false,
      visible: true,
      muted: false,
      volume: type === 'audio' ? 80 : 100,
      height: type === 'text' ? 40 : type === 'image' ? 50 : 60,
    };
    set((s) => ({ tracks: [...s.tracks, track] }));
  },

  removeTrack: (id) => {
    set((s) => ({
      tracks: s.tracks.filter((t) => t.id !== id),
    }));
  },

  updateTrack: (id, updates) => {
    set((s) => ({
      tracks: s.tracks.map((t) => t.id === id ? { ...t, ...updates } : t),
    }));
  },

  addClip: (trackId, clipData) => {
    const clip: TimelineClip = {
      id: uuid(),
      trackId,
      name: clipData.name || 'Clip',
      type: clipData.type || 'video',
      startTime: clipData.startTime || 0,
      duration: clipData.duration || 5,
      inPoint: 0,
      outPoint: clipData.duration || 5,
      volume: 100,
      speed: 1,
      locked: false,
      muted: false,
      opacity: 100,
      ...clipData,
    };
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
      ),
    }));
  },

  updateClip: (trackId, clipId, updates) => {
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId
          ? { ...t, clips: t.clips.map((c) => c.id === clipId ? { ...c, ...updates } : c) }
          : t
      ),
    }));
  },

  removeClip: (trackId, clipId) => {
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, clips: t.clips.filter((c) => c.id !== clipId) } : t
      ),
      selectedClipId: s.selectedClipId === clipId ? null : s.selectedClipId,
    }));
  },

  splitClip: (trackId, clipId, time) => {
    const state = get();
    const track = state.tracks.find((t) => t.id === trackId);
    if (!track) return;
    const clip = track.clips.find((c) => c.id === clipId);
    if (!clip) return;
    
    const relTime = time - clip.startTime;
    if (relTime <= 0 || relTime >= clip.duration) return;

    const leftClip: TimelineClip = {
      ...clip,
      id: uuid(),
      duration: relTime,
      outPoint: clip.inPoint + relTime,
    };
    const rightClip: TimelineClip = {
      ...clip,
      id: uuid(),
      startTime: time,
      duration: clip.duration - relTime,
      inPoint: clip.inPoint + relTime,
    };

    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId
          ? { ...t, clips: t.clips.flatMap((c) => c.id === clipId ? [leftClip, rightClip] : [c]) }
          : t
      ),
    }));
  },

  duplicateClip: (trackId, clipId) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;
    const clip = track.clips.find((c) => c.id === clipId);
    if (!clip) return;
    
    const newClip: TimelineClip = {
      ...clip,
      id: uuid(),
      startTime: clip.startTime + clip.duration,
      name: `${clip.name} Copy`,
    };

    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t
      ),
    }));
  },

  addMediaFile: (file) => set((s) => ({ mediaFiles: [...s.mediaFiles, file] })),
  removeMediaFile: (id) => set((s) => ({ mediaFiles: s.mediaFiles.filter((f) => f.id !== id) })),
  toggleFavorite: (id) => set((s) => ({
    mediaFiles: s.mediaFiles.map((f) => f.id === id ? { ...f, favorite: !f.favorite } : f),
  })),

  addFilter: (layerId, filter) => {
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === layerId ? { ...l, filters: [...(l.filters || []), filter] } : l
      ),
    }));
  },

  updateFilter: (layerId, filterId, updates) => {
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === layerId
          ? { ...l, filters: (l.filters || []).map((f) => f.id === filterId ? { ...f, ...updates } : f) }
          : l
      ),
    }));
  },

  removeFilter: (layerId, filterId) => {
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === layerId
          ? { ...l, filters: (l.filters || []).filter((f) => f.id !== filterId) }
          : l
      ),
    }));
  },

  addKeyframe: (layerId, keyframe) => {
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === layerId ? { ...l, keyframes: [...(l.keyframes || []), keyframe] } : l
      ),
    }));
  },

  removeKeyframe: (layerId, keyframeId) => {
    set((s) => ({
      layers: s.layers.map((l) =>
        l.id === layerId
          ? { ...l, keyframes: (l.keyframes || []).filter((k) => k.id !== keyframeId) }
          : l
      ),
    }));
  },

  addTransition: (trackId, clipId, type, transition) => {
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId
          ? {
              ...t,
              clips: t.clips.map((c) =>
                c.id === clipId
                  ? { ...c, transitions: { ...c.transitions, [type]: transition } }
                  : c
              ),
            }
          : t
      ),
    }));
  },

  removeTransition: (trackId, clipId, type) => {
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId
          ? {
              ...t,
              clips: t.clips.map((c) =>
                c.id === clipId
                  ? { ...c, transitions: { ...c.transitions, [type]: undefined } }
                  : c
              ),
            }
          : t
      ),
    }));
  },

  setShowNewProjectModal: (show) => set({ showNewProjectModal: show }),
  setShowExportModal: (show) => set({ showExportModal: show }),
  setShowImportModal: (show) => set({ showImportModal: show }),
  setShowSettingsModal: (show) => set({ showSettingsModal: show }),
  setShowHelpModal: (show) => set({ showHelpModal: show }),
  setShowShortcutsModal: (show) => set({ showShortcutsModal: show }),
  setShowWatermarkModal: (show) => set({ showWatermarkModal: show }),
  setShowAIModal: (show) => set({ showAIModal: show }),
  setShowThumbnailModal: (show) => set({ showThumbnailModal: show }),
  setShowShareModal: (show) => set({ showShareModal: show }),
  setShowLoginModal: (show) => set({ showLoginModal: show }),

  pushHistory: () => {
    const { layers, tracks, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ layers: JSON.parse(JSON.stringify(layers)), tracks: JSON.parse(JSON.stringify(tracks)) });
    if (newHistory.length > 50) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const entry = history[historyIndex - 1];
      set({ layers: entry.layers, tracks: entry.tracks, historyIndex: historyIndex - 1 });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const entry = history[historyIndex + 1];
      set({ layers: entry.layers, tracks: entry.tracks, historyIndex: historyIndex + 1 });
    }
  },

  saveProject: () => {
    const { project } = get();
    if (project) {
      set({ project: { ...project, updatedAt: new Date().toISOString() } });
    }
  },
}));
