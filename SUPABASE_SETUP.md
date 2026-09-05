# Supabase Setup Guide - X-EDITOR (5 Minute)

## Step 1: Project Banao
1. https://supabase.com -> Sign up / Login
2. `New Project` -> Name: `x-editor` -> Password set -> Region: `Mumbai (ap-south-1)` select karo (aap Punjab me ho, sabse close)
3. 1-2 min wait, project ready.

## Step 2: API Keys Copy Karo
1. Project Dashboard -> `Project Settings` (gear icon) -> `API`
2. Copy karo:
   - `Project URL` -> `VITE_SUPABASE_URL`
   - `anon public` key -> `VITE_SUPABASE_ANON_KEY`
3. `X-EDITOR/.env` file banao (`.env.example` ko copy karke) aur ye 2 values paste karo.

## Step 3: Database Schema Lagao
1. Dashboard -> `SQL Editor` -> `New Query`
2. `supabase/schema.sql` ka pura content copy-paste karke `Run` karo.
3. Success dikhega - tables ban gaye.

## Step 4: Google Login Enable Karo (Original Gmail Login)
1. Dashboard -> `Authentication` -> `Providers` -> `Google` -> `Enable`
2. Google Cloud Console (https://console.cloud.google.com) pe jao:
   - New Project ya existing -> `APIs & Services` -> `Credentials` -> `Create Credentials` -> `OAuth Client ID` -> Type: Web Application
   - Authorized redirect URIs me daalo: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Client ID aur Client Secret copy karke Supabase Google provider me paste karo -> Save.
3. `Site URL` me daalo: `https://your-vercel-app.vercel.app` (ya localhost:5173 for dev)
4. Done - ab `Login with Google` original Gmail se hoga.

## Step 5: Storage Buckets (Optional but recommended)
Dashboard -> `Storage` -> `New Bucket`:
- `project-thumbnails` (Public)
- `template-previews` (Public)
- `project-exports` (Private)

## Step 6: Test Karo
```bash
cd X-EDITOR
npm install
npm run dev
```
- Bina `.env` ke bhi chalega - Mock login mode me (demo Gmail prompt)
- `.env` ke saath original Google login chalega.

## Mock vs Real Mode
- **Bina Supabase keys**: App mock mode me chalega - login pe email prompt ayega, data localStorage me save hoga. Testing ke liye perfect.
- **Keys ke saath**: Real Supabase - auth, cloud save, realtime collab sab enable.

## Live Collaboration Kaise Kaam Karega
- Y-WebRTC (P2P) + Supabase Realtime Broadcast dono enable hai.
- Same `project.id` wale 2 users alag tabs/browsers me project open karte hi auto-sync.
- Invite link copy karke share karo - dusra user link open karte hi same file pe live edit (Google Docs jaisa).

## Templates QR + Search
- Dashboard -> Templates -> `New Template` -> Title + preview daalo -> Auto QR generate.
- Search bar me title likho ya QR scan button se camera se scan karo.
