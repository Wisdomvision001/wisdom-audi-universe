# Wisdom Audi Universe

Cinematic scroll-driven portfolio: Vite + three.js, no framework.

```
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve dist/
```

## Edit your content
- `src/content.js` — all copy, projects, links, experience, skills. Lines marked `VERIFY` need your confirmation.
  Empty / `null` links are hidden automatically (project View/Source buttons, Email, LinkedIn).
- `public/assets/portrait.png` — drop a transparent-background PNG of yourself here; it replaces the placeholder silhouette in the About section automatically.

## Structure
- `src/scene.js` — the 3D universe (eclipse, asteroid field, dust, contact beam) and the scroll-driven camera path.
- `src/main.js` — page markup, scroll progress, nav, thumbnails, reveal, mobile menu.
- `src/mockups.js` + `src/mockups.css` — stylised device interfaces for each project.
- `src/styles.css` — layout and typography.

Reduced-motion users get instant camera movement, no drift/spin and no reveal animation. If WebGL is unavailable a static dark gradient is used.
