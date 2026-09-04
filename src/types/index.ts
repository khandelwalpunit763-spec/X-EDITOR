export type AppView = 'landing' | 'dashboard' | 'editor' | 'photo-editor';

export type EditorMode = 'photo' | 'video';

export type Tool = 
  | 'select' | 'move' | 'crop' | 'resize' | 'brush' | 'eraser' 
  | 'shape' | 'text' | 'pen' | 'clone' | 'blur' | 'removeObject'
  | 'magicSelection' | 'backgroundRemover' | 'colorPicker' | 'hand' | 'zoom';

export type RightPanel = 
  | 'properties' | 'layers' | 'color' | 'effects' | 'filters' 
  | 'text' | 'audio' | 'transitions' | 'export' | 'ai';

export interface Project {
  id: string;
  name: string;
  type: EditorMode;
  width: number;
  height: number;
  fps: number;
  aspectRatio: string;
  background: ProjectBackground;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  duration?: number;
}

export interface ProjectBackground {
  type: 'transparent' | 'solid' | 'gradient' | 'image' | 'video';
  color?: string;
  gradient?: { from: string; to: string; angle: number };
  src?: string;
}

export interface Layer {
  id: string;
  name: string;
  type: 'image' | 'text' | 'shape' | 'video' | 'audio' | 'effect' | 'group';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  children?: Layer[];
  src?: string;
  text?: TextProperties;
  shape?: ShapeProperties;
  filters?: Filter[];
  mask?: LayerMask;
  keyframes?: Keyframe[];
}

export type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten'
  | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light'
  | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity';

export interface TextProperties {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  color: string;
  gradient?: { from: string; to: string; angle: number };
  letterSpacing: number;
  lineHeight: number;
  align: 'left' | 'center' | 'right' | 'justify';
  stroke?: { color: string; width: number };
  shadow?: { color: string; x: number; y: number; blur: number };
  glow?: { color: string; radius: number };
  backgroundColor?: string;
  padding?: number;
  animation?: TextAnimation;
}

export type TextAnimation = 
  | 'none' | 'fade' | 'slide' | 'zoom' | 'typewriter' 
  | 'bounce' | 'pop' | 'glitch' | 'shake';

export interface ShapeProperties {
  type: 'rectangle' | 'ellipse' | 'triangle' | 'star' | 'polygon' | 'line' | 'arrow';
  fill: string;
  stroke?: { color: string; width: number };
  cornerRadius?: number;
  sides?: number;
}

export interface LayerMask {
  type: 'rectangle' | 'ellipse' | 'brush' | 'ai';
  inverted: boolean;
  data?: string;
}

export interface Filter {
  id: string;
  type: FilterType;
  intensity: number;
  enabled: boolean;
}

export type FilterType = 
  | 'brightness' | 'contrast' | 'exposure' | 'saturation' | 'vibrance'
  | 'temperature' | 'tint' | 'highlights' | 'shadows' | 'whites' | 'blacks'
  | 'hue' | 'blur' | 'gaussianBlur' | 'motionBlur' | 'sharpen'
  | 'grayscale' | 'vintage' | 'cinematic' | 'warm' | 'cool'
  | 'blackAndWhite' | 'vignette' | 'noise' | 'glow' | 'grain';

export interface Keyframe {
  id: string;
  time: number;
  property: string;
  value: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce';
}

export interface TimelineClip {
  id: string;
  trackId: string;
  name: string;
  type: 'video' | 'image' | 'text' | 'audio' | 'effect';
  src?: string;
  startTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  volume: number;
  speed: number;
  locked: boolean;
  muted: boolean;
  opacity: number;
  filters?: Filter[];
  transitions?: { in?: Transition; out?: Transition };
  keyframes?: Keyframe[];
  layerData?: Partial<Layer>;
}

export interface Track {
  id: string;
  name: string;
  type: 'video' | 'image' | 'text' | 'audio' | 'effect';
  clips: TimelineClip[];
  locked: boolean;
  visible: boolean;
  muted: boolean;
  volume: number;
  height: number;
}

export type TransitionType = 
  | 'fade' | 'dissolve' | 'slide' | 'wipe' | 'zoom' 
  | 'push' | 'spin' | 'blur' | 'glitch' | 'flash' | 'lightLeak';

export interface Transition {
  id: string;
  type: TransitionType;
  duration: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  src: string;
  thumbnail?: string;
  size: number;
  duration?: number;
  width?: number;
  height?: number;
  format: string;
  favorite: boolean;
  createdAt: string;
}

export interface ExportSettings {
  format: string;
  quality: 'low' | 'medium' | 'high' | 'veryHigh' | 'custom';
  resolution: string;
  fps: number;
  bitrate?: number;
  includeAudio: boolean;
}

export interface ProjectSettings {
  name: string;
  width: number;
  height: number;
  fps: number;
  aspectRatio: string;
  background: ProjectBackground;
}

export interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}

export interface AudioSettings {
  volume: number;
  fadeIn: number;
  fadeOut: number;
  speed: number;
  pitch: number;
  bass: number;
  treble: number;
  noiseReduction: boolean;
  normalize: boolean;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'photo' | 'video' | 'audio' | 'general';
  requiresAuth: boolean;
}
