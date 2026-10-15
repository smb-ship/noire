# NOIRÉ — 3D Luxury Perfume Landing Page
Next.js 14 · React Three Fiber · Motion for React

## Run it on your computer (Windows / PowerShell)
1. Install Node.js LTS from https://nodejs.org (one time).
2. Unzip this folder, open it in VS Code, open the terminal (Ctrl + `).
3. Run:
   ```
   npm install
   npm run dev
   ```
4. Open http://localhost:3000

## Deploy to Vercel (free)
1. Put the folder on GitHub: create a repo, then in the terminal:
   ```
   git init
   git add .
   git commit -m "NOIRÉ"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/noire.git
   git push -u origin main
   ```
2. Go to https://vercel.com → Add New → Project → import the repo → Deploy.
   No settings need changing; Vercel detects Next.js automatically.

## Customize
- Text, fragrances, prices: `app/page.tsx`
- Colors: top of `app/globals.css`
- 3D bottle: `components/Bottle.tsx`
- Lighting/camera/sparkles: `components/Scene.tsx`
- The bottle is a real Blender model: `blender/noire_bottle.blend` (open it in Blender) → exported to `public/bottle.glb`. To rebuild it: Blender → Scripting → open `blender/make_bottle.py` → Run.

## Notes
- Needs a device with WebGL (all modern browsers).
- Fonts load from Google Fonts; if offline, elegant serif fallbacks are used.
