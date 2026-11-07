// Entry point for the world experience preview page.
// Renders the DOM first, then upgrades with the 3D world and scroll motion.
// Every layer degrades gracefully: without WebGL or with reduced motion the
// page stays fully readable and navigable.

import { renderWorld, wireUI } from './render.js';
import { createWorld } from './scene.js';
import { initMotion } from './motion.js';

const reduced = Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const issues = [];

renderWorld();
wireUI();

/* ---- 3D scene: optional decorative layer ---- */
let world = null;
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}
if (hasWebGL()) {
  try {
    // lite mode: reduced pixel ratio and particle counts on small screens
    const lite = window.matchMedia('(max-width: 760px)').matches;
    world = createWorld(document.getElementById('stage'), { reduced, lite });
  } catch (err) {
    issues.push(`scene-failed: ${err && err.message}`);
    document.body.classList.add('no-webgl');
  }
} else {
  document.body.classList.add('no-webgl');
}

/* ---- scroll motion: feeds the camera through section boundaries ---- */
const motion = initMotion({
  reduced,
  onProgress: world ? (f) => world.setProgress(f) : null,
  onPointer: world && !reduced ? (x, y) => world.setPointer(x, y) : null,
});

/* ---- progress report for the console (preview diagnostics) ---- */
window.__world = { issues, reduced, world: Boolean(world), motion };
