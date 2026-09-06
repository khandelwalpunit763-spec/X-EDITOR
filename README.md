# 🎬 X-EDITOR

**Professional AI-Powered Video & Photo Editing Studio**

A full-featured, web-based editing platform combining the power of Photoshop, Premiere Pro, CapCut, Canva, and Figma — all in your browser. Fully responsive (mobile + desktop), CapCut-inspired dark theme.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)

---

## ✨ Features

### 🎥 Video Editor
- Professional multi-track timeline (video, image, text, audio, effects tracks)
- Cut, split, trim, ripple delete, duplicate clips
- Speed control (0.25x – 4x), reverse, freeze frame
- 11 transitions: fade, dissolve, slide, wipe, zoom, glitch, and more
- Keyframe animations for position, scale, rotation, opacity, blur, volume
- Frame-by-frame navigation, playback controls, FPS indicator

### 🖼️ Photo Editor
- Photoshop-style layers with blend modes, opacity, masks
- Crop, rotate, flip, resize, perspective, free transform
- Brush, eraser, pencil, clone, healing, blur, sharpen, smudge, dodge, burn
- Full color controls: brightness, contrast, exposure, saturation, curves, levels
- 15+ filters: vintage, cinematic, B&W, warm, cool, vignette, grain, glow

### 🎬 CapCut-Style VFX (new)
- Animated effects: Glitch, Shake, 3D Zoom (Ken Burns), Flash, Zoom Blur, RGB Split
- Chroma Key (green/blue screen removal) — real-time on any image layer
- All filters/effects render live on canvas via CSS (brightness, contrast, saturation, etc.)

### 🗜️ Bulk Image Compressor (new)
- Drop any number of images at once — sab ek saath compress
- Target size per image (MB) — 0.25 / 0.5 / 1 / 2 / 5 MB + custom
- JPG / WebP output, binary-search quality + auto downscale to hit target
- Per-image before/after sizes, % saved, download single or all
- 100% private — compression runs in the browser, nothing uploads

### 🤖 AI Tools
- Background remover & replacement (image + video)
- Object selection & removal
- Image upscaler (2x–4x), auto enhancement
- Face blur, smart crop, auto color correction
- Text-to-image generation, style transfer
- Auto captions, speech-to-text, noise removal

### 🔤 Text Editor
- Rich text with 17+ fonts, bold, italic, underline, alignment
- Letter spacing, line height, gradient text, stroke, shadow, glow
- 8 text animations: fade, slide, zoom, typewriter, bounce, pop, glitch, shake
- SRT subtitle import/export

### 🔊 Audio Editor
- Multi-track audio mixing, volume, fade in/out
- Equalizer (bass, mid, treble), noise reduction, normalization
- AI: speech-to-text, text-to-speech, voice cleanup, silence removal

### 🏷️ Watermark & Logo Tools
- Add text/image watermarks with position, opacity, size, rotation, tiling
- AI-powered watermark removal (with content ownership authorization)

### 🖼️ Thumbnail Maker
- Presets: YouTube, Shorts, Instagram, TikTok, LinkedIn
- Templates, text, shapes, stickers, backgrounds, AI image generation

### 📤 Export
- Image: PNG, JPG, WEBP, SVG
- Video: MP4 (H.264/H.265), WebM — 720p to 4K, 24–60 FPS
- Audio: MP3, WAV, AAC
- Progress bar, estimated file size, custom bitrate

---

## 🖥️ Screenshots

> The app features a full dark professional editor interface with glassmorphism, smooth animations, draggable/resizeable panels, and keyboard shortcuts.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + S` | Save |
| `Ctrl + E` | Export |
| `Space` | Play / Pause |
| `Delete` | Delete selected |
| `V` | Select tool |
| `M` | Move tool |
| `B` | Brush tool |
| `E` | Eraser tool |
| `T` | Text tool |
| `C` | Crop tool |
| `H` | Hand tool |
| `Z` | Zoom tool |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/khandelwalpunit763-spec/X-EDITOR.git
cd X-EDITOR

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
x-editor/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                  # Entry point
    ├── App.tsx                   # Root component + keyboard shortcuts
    ├── index.css                 # Tailwind + custom theme + animations
    ├── store/
    │   └── useStore.ts           # Zustand global state
    ├── types/
    │   └── index.ts              # TypeScript interfaces
    └── components/
        ├── landing/
        │   └── LandingPage.tsx   # Marketing landing page
        ├── dashboard/
        │   └── Dashboard.tsx     # Project management dashboard
        ├── editor/
        │   ├── EditorLayout.tsx  # Main editor layout (resizable panels)
        │   └── CanvasArea.tsx    # Canvas with layers, grid, guides
        ├── layout/
        │   ├── TopBar.tsx        # File/Edit/View menus, undo/redo
        │   └── LeftToolbar.tsx   # 17+ editing tools
        ├── panels/
        │   ├── RightSidebar.tsx  # Tab container for all panels
        │   ├── PropertiesPanel.tsx
        │   ├── LayersPanel.tsx
        │   ├── ColorPanel.tsx
        │   ├── EffectsPanel.tsx
        │   ├── FiltersPanel.tsx
        │   ├── TextPanel.tsx
        │   ├── AudioPanel.tsx
        │   ├── TransitionsPanel.tsx
        │   ├── AIPanel.tsx
        │   └── ExportPanel.tsx
        ├── timeline/
        │   └── Timeline.tsx      # Multi-track video timeline
        └── modals/
            ├── NewProjectModal.tsx
            ├── ExportModal.tsx
            ├── ImportModal.tsx
            ├── SettingsModal.tsx
            ├── HelpModal.tsx
            ├── ShortcutsModal.tsx
            ├── WatermarkModal.tsx
            ├── AIModal.tsx
            └── ThumbnailModal.tsx
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 6 |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite 8 |
| State Management | Zustand |
| Icons | Lucide React |
| Drag & Drop | @dnd-kit |

---

## 🔒 Content Policy

X-EDITOR includes watermark and object removal tools that must **only** be used on content you **own or have explicit permission to modify**. The app enforces authorization confirmations before enabling these features. Do not use these tools to bypass copyright, DRM, or platform restrictions.

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

<p align="center">Made with ❤️ by X-EDITOR Team</p>
