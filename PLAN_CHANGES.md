# X-EDITOR - Changes Plan (Aapke 7 Requirements)

> Date: 5 Sep 2026 | Repo: khandelwalpunit763-spec/X-EDITOR
> Status: Code Read Complete - Implementation Ready

---

## 1) Project Read Summary (Maine Pura Read Kar Liya Hai)

**Tech Stack:**
- React 19 + TypeScript 6 + Vite 8 + Zustand 5 + Tailwind 4 + Lucide
- `src/store/useStore.ts` = Single Zustand store (view, project, layers, tracks, media, history)
- `src/App.tsx` = view switcher `landing | dashboard | editor` (no react-router)
- `LandingPage.tsx` (273 lines) - Marketing hero + 8 features grid
- `Dashboard.tsx` - Projects / Templates / Media / AI tabs (mock data)
- `EditorLayout.tsx` (67 lines) - Resizable right panel + timeline
- `CanvasArea.tsx` - Canvas with zoom, grid, guides, safe zones, layer rendering
- `Timeline.tsx` (336 lines) - Multi-track, playhead, split/duplicate, FPS control
- `TopBar.tsx` + `LeftToolbar.tsx` - File/View menus, 17 tools
- 10 Right panels + 9 Modals (NewProject, Export, Import, AI, Watermark etc.)
- Types in `src/types/index.ts` - Project, Layer, Track, TimelineClip, Filter, Keyframe sab defined hai

**Current Limitations:**
- No Backend, No Auth, No Database - sab kuch memory me hai, refresh pe gayab
- No Router - `view` state se navigation hota hai, browser back button kaam nahi karta
- No Persistence - Project save sirf `updatedAt` update karta hai
- Timeline totalDuration hardcoded 60s, mediaFiles memory me

---

## 2) Aapke 7 Requirements - Breakdown

| # | Requirement (Aapne Bola) | Mera Implementation Plan |
|---|---|---|
| **1** | **Back Button lagana hai** | Har screen pe Back button (TopBar + Canvas + Timeline). `useStore` me `viewHistory: AppView[]` add karenge + `goBack()` action. Saath me browser `popstate` sync karenge. |
| **2** | **Gmail Login Original** + bina login sirf dekh sakta hai | Firebase Auth (Google Provider) - 100% original Gmail OAuth. `src/lib/firebase.ts` + `AuthContext`. Zustand me `user, isAuthenticated`. Guard: `if !user -> editor read-only, tools disabled, “Login to Edit” CTA`. |
| **3** | **Video daale, exit kare toh auto-save ho jaye** | Auto-save system: `useAutoSave` hook - har 2 sec debounce + `beforeunload` + `visibilitychange`. Logged-in -> Firestore + Cloud Storage, Guest -> IndexedDB + localStorage. Re-open pe “Restore draft?” prompt. |
| **4** | **Save ke baad “kaha upload karni hai” option** | New `ShareUploadModal.tsx` - Export ke baad trigger. Options: YouTube, Google Drive, Instagram, TikTok, Dropbox, Direct Download, Copy Link. YouTube Drive ke liye OAuth scopes ready rakhenge (API keys baad me). |
| **5** | **Multiple users same file edit - Live Share / Google Docs jaisa** | Yjs (CRDT) + y-webrtc (P2P, serverless MVP) + awareness (cursor, selection). `src/lib/collab/yjs.ts`. Room ID = `project.id`. Future me y-websocket server (Fly/PartyKit) pe upgrade. Presence avatars TopBar me. |
| **6** | **New templates daalne ka option** | `TemplateUploadModal.tsx` - title, category, preview image, tags. Firestore `templates` collection. Dashboard me “+ Add Template” button (only auth users). |
| **7** | **Templates search - QR code + title format** | `qrcode.react` + `html5-qrcode` (camera scan). Har template pe QR auto-generate (link = `x-editor.app/t/{id}`). Search by Title + Category + Scan QR -> direct open template. |

---

## 3) Architecture Diagram

```
[ Landing / Dashboard / Editor ] 
        |  (BackButton + viewHistory)
        v
[ Auth Guard ] --(not logged)--> Read-Only Mode + Login CTA
        |  (logged)
        v
[ Zustand Store + Yjs Doc ] <--> [ AutoSave Hook ] --> [ localStorage (guest) | Firestore (auth) ]
        |                                   |
        v                                   v
[ Canvas + Timeline ] <--Yjs Awareness--> [ Live Cursors / Presence ]
        |
        v
[ Export -> ShareUploadModal ] --> [ YouTube | Drive | Insta | TikTok | Download ]
        |
        v
[ Templates Gallery ] <--> [ Upload Modal ] <--> [ QR Generator/Scanner ]
```

---

## 4) Phase-wise Implementation (Priority Aapke Order Se)

**Phase 1 - Foundation (Aaj hi ho jayega, ~2 hrs):**
- `viewHistory` + `goBack()` + `<BackButton />` har jagah
- `firebase.ts` + `useAuthStore` + Login modal (Google button)
- Read-only guard (bina login editor lock)

**Phase 2 - Persistence (Kal):**
- `useAutoSave` + IndexedDB (idb) + `beforeunload` handler
- Firestore rules + Storage bucket
- Restore draft UI

**Phase 3 - Share (Phase 2 ke baad):**
- `ShareUploadModal` + 6 upload destinations UI
- YouTube/Drive API scaffolding (keys aap doge toh connect)

**Phase 4 - Live Collaboration (Most Complex, 2-3 din):**
- `yjs`, `y-webrtc`, `y-map`, `y-websocket` install
- `CollabProvider` + cursor sync
- Conflict resolution testing (2 tabs me test)

**Phase 5 - Templates + QR (1 din):**
- Template CRUD + Gallery update
- `qrcode.react` generate + `html5-qrcode` scan
- Title search + QR scan filter

---

## 5) Mujhe Aapse Kya Chahiye

1. **Firebase Project** - Kya aapke paas Firebase project hai? Nahi hai toh mai `firebase init` ke steps bhej dunga (5 min ka kaam, free tier). Mujhe `apiKey, authDomain, projectId` chahiye `.env` ke liye.
2. **Upload APIs** - YouTube/Drive pe real upload karna hai ya abhi sirf UI mock chahiye? (Real ke liye Google Cloud OAuth Client ID lagega)
3. **Back Button Design** - Kya simple arrow chahiye ya TopBar me breadcrumbs (Landing > Dashboard > Editor) jaisa?
4. **Live Share** - Kya room link share karke invite karna hai (jaise Google Docs link) ya sirf same project ID wale auto-sync ho?

---

## 6) Next Step

Mai abhi Phase 1 ka code scaffold karna start kar du? 
- Back button + Firebase Auth boilerplate push kar dunga, aap local pe `npm run dev` karke dekh loge
- Bina Firebase keys ke bhi “Mock Google Login” chalega, baad me original keys se replace kar denge

Bolo toh mai abhi code likhna start kar du - pehle Back Button + Login System?
