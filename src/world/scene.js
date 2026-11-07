// The 3D world for the new experience. The canvas is decorative: all content
// lives in semantic HTML above it, and the page must stay usable if this
// module fails (main.js catches and falls back).

import * as THREE from 'three';

/* ---------------------------- utilities ----------------------------- */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x9e3779b9) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const smooth = (t) => t * t * (3 - 2 * t);

function rockGeometry(seed, detail) {
  const r = rng(seed);
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  const o = [r() * 11, r() * 11, r() * 11];
  const sx = 0.74 + r() * 0.6, sy = 0.5 + r() * 0.5, sz = 0.74 + r() * 0.6;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n =
      Math.sin(2.7 * v.x + o[0]) * Math.cos(2.1 * v.y + o[1]) * 0.48 +
      Math.sin(5.1 * v.y + 1.7 * v.z + o[2]) * 0.3 +
      Math.sin(9.6 * v.z + 4.2 * v.x + o[0]) * 0.15 +
      Math.sin(17.4 * v.x - 7.8 * v.z + o[1]) * 0.07;
    const k = 0.8 + n * 0.44;
    v.multiplyScalar(k);
    v.x *= sx; v.y *= sy; v.z *= sz;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function groundTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#08090d';
  x.fillRect(0, 0, 512, 512);
  x.strokeStyle = 'rgba(150, 190, 230, 0.16)';
  x.lineWidth = 2;
  x.strokeRect(1, 1, 510, 510);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(28, 28);
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ----------------------------- shaders ------------------------------ */
// Luminous arc ring. An annulus whose brightness piles up along one side of
// the circumference, with a soft halo, a faint inner arc and a slow shimmer.
const ringMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.CustomBlending,
  blendSrc: THREE.OneFactor,
  blendDst: THREE.OneMinusSrcAlphaFactor,
  uniforms: { uOpacity: { value: 1 }, uTime: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: `
    varying vec2 vUv; uniform float uOpacity; uniform float uTime;
    void main(){
      vec2 p=(vUv-.5)*2.;
      float r=length(p);
      float ang=atan(p.y,p.x);
      float arc=.22+.78*pow(.5+.5*cos(ang-2.65),1.5);           // brightest lower-left arc
      float core=exp(-pow((r-.44)*60.,2.))*.95;                 // main band
      float halo=exp(-pow((r-.44)*7.,2.))*.16;                  // soft outer atmosphere
      float inner=exp(-pow((r-.31)*110.,2.))*.28*smoothstep(-.02,.02,.31-r); // faint secondary arc
      float shimmer=.96+.04*sin(uTime*.55+ang*3.);
      float a=(core+halo+inner)*arc*shimmer;
      vec3 col=mix(vec3(.66,.76,.94),vec3(1.,1.,1.),core)*a;
      gl_FragColor=vec4(col*uOpacity,a*uOpacity*step(r,1.));
    }`,
});

// Vertical light shaft for the closing scene.
const shaftMat = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  uniforms: { uTime: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: `
    varying vec2 vUv; uniform float uTime;
    void main(){
      float x=abs(vUv.x-.5)*2.;
      float core=exp(-x*x*44.);
      float soft=exp(-x*x*5.5)*.32;
      float rise=smoothstep(0.,.15,vUv.y);
      float flick=.95+.05*sin(uTime*1.15+vUv.y*8.);
      float a=(core+soft)*rise*flick;
      gl_FragColor=vec4(vec3(.84,.9,1.)*a,a);
    }`,
});

/* ----------------------------- scene -------------------------------- */
export function createWorld(canvas, { reduced = false, lite = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 1.75));
  renderer.setClearColor(0x05080b, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080b, 0.013);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);

  scene.add(new THREE.HemisphereLight(0x2b3a4e, 0x04050a, 0.85));
  const rim = new THREE.DirectionalLight(0xdfe9ff, 1.15);
  rim.position.set(-14, 10, -70);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0x64799e, 0.85);
  fill.position.set(-16, 14, 30);
  scene.add(fill);

  /* ---- luminous ring ---- */
  const HERO_FOV = 42;
  const RING_D = 50;
  const ring = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), ringMat);
  ring.renderOrder = -1;
  scene.add(ring);
  const ringLight = new THREE.PointLight(0xdfe9ff, 1000, 0, 2);
  scene.add(ringLight);

  /* ---- rocks ---- */
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x272b34, roughness: 0.9, metalness: 0.05, flatShading: true });
  const geos = [5, 13, 29, 47, 61].map((s, i) => rockGeometry(s, i < 3 ? 3 : 2));
  const rocks = new THREE.Group();
  scene.add(rocks);
  const spinners = [];
  const r = rng(1379);

  function addRock(x, y, z, size) {
    const m = new THREE.Mesh(geos[Math.floor(r() * geos.length)], rockMat);
    m.position.set(x, y, z);
    m.scale.setScalar(size);
    m.rotation.set(r() * 6, r() * 6, r() * 6);
    rocks.add(m);
    spinners.push({ m, s: (r() - 0.5) * 0.055, a: r() > 0.5 ? 'y' : 'x' });
    return m;
  }

  // Hero composition, placed in NDC relative to the opening camera at z 12.
  const ndc = (nx, ny, d, aspect = 16 / 9) => {
    const hh = Math.tan(THREE.MathUtils.degToRad(HERO_FOV / 2)) * d;
    return [nx * hh * aspect, ny * hh, 12 - d];
  };
  // Hero cluster: big silhouettes around the ring, small debris near it.
  [
    [0.72, 0.6, 42, 3.6], [0.95, 0.05, 38, 2.8], [0.55, 0.82, 48, 1.9],
    [0.48, 0.68, 54, 1.0], [0.85, -0.2, 34, 1.6], [0.63, 0.05, 50, 0.7],
    [-0.9, 0.66, 44, 1.2], [-0.55, 0.8, 52, 0.8], [-0.98, 0.1, 36, 0.65],
    [-0.3, 0.86, 54, 0.85], [0.12, 0.92, 56, 0.9], [-0.75, 0.34, 32, 0.42],
    [0.99, -0.42, 30, 1.2], [-0.45, 0.45, 42, 0.48],
  ].forEach(([nx, ny, d, s]) => addRock(...ndc(nx, ny, d), s));

  // Field along the journey, kept clear of the camera path.
  const path = (z) => ({ x: Math.sin(z * 0.045) * 2.8, y: Math.cos(z * 0.037) * 1.1 });
  for (let i = 0, n = lite ? 70 : 140; i < n; i++) {
    const z = -10 - r() * 100;
    const side = r() > 0.5 ? 1 : -1;
    const dist = 11 + r() * 22;
    const ang = (r() - 0.5) * Math.PI * 1.1;
    const c = path(z);
    addRock(
      c.x + side * dist * Math.cos(ang * 0.7),
      c.y + Math.sin(ang) * dist * 0.55 + (side < 0 ? 2.5 : 0),
      z,
      0.3 + Math.pow(r(), 2.7) * 2.4
    );
  }
  // Upper-left overhangs behind the project chapter, as in the references.
  for (let i = 0; i < (lite ? 8 : 14); i++) {
    const z = -28 - i * 4.6 + r() * 3;
    const c = path(z);
    addRock(c.x - 12 - r() * 8, c.y + 7 + r() * 4.5, z, 1.5 + r() * 2.8);
  }

  /* ---- stars & dust ---- */
  function points(count, spread, size, opacity, color) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * spread.x;
      pos[i * 3 + 1] = (r() - 0.5) * spread.y;
      pos[i * 3 + 2] = spread.z0 - r() * spread.z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ size, sizeAttenuation: true, transparent: true, opacity, color, depthWrite: false, fog: false }));
    scene.add(p);
    return p;
  }
  points(lite ? 600 : 1000, { x: 260, y: 150, z: 220, z0: 40 }, 0.14, 0.65, 0xaab8d0).renderOrder = -3;
  const dust = points(lite ? 320 : 600, { x: 44, y: 26, z: 140, z0: 14 }, 0.05, 0.45, 0x9fb4d4);

  /* ---- contact corridor ---- */
  const END_Z = -122;
  const corridor = new THREE.Group();
  corridor.position.set(-3.8, 0, END_Z);
  scene.add(corridor);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240),
    new THREE.MeshStandardMaterial({ map: groundTexture(), color: 0x8e9aae, roughness: 0.3, metalness: 0.55 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -6.5, -14);
  corridor.add(floor);

  const shafts = [0, Math.PI / 2].map((ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(9, 100), shaftMat);
    m.rotation.y = ry;
    m.position.y = 44;
    corridor.add(m);
    return m;
  });
  const shaftLight = new THREE.PointLight(0xcfe0ff, 1400, 0, 2);
  shaftLight.position.set(0, -1.5, 0);
  corridor.add(shaftLight);
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 26),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec2 vUv; void main(){ float d=length(vUv-.5)*2.; float a=exp(-d*d*4.6)*.55; gl_FragColor=vec4(vec3(.78,.88,1.)*a,a); }',
    })
  );
  glow.position.set(0, -4.5, 0);
  corridor.add(glow);

  const monoMat = new THREE.MeshStandardMaterial({ color: 0x0b0e13, roughness: 0.34, metalness: 0.7, flatShading: true });
  for (let i = 0; i < (lite ? 30 : 46); i++) {
    const a = r() * Math.PI * 2;
    const rad = 7 + Math.pow(r(), 0.7) * 40;
    const w = 1 + r() * 4.4, h = 3 + r() * 22, d = 1 + r() * 4.4;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), monoMat);
    box.position.set(Math.cos(a) * rad, -6.5 + h / 2 + (r() > 0.72 ? 6 + r() * 12 : 0), Math.sin(a) * rad * 0.9 - 4);
    box.rotation.y = r() * 3;
    if (r() > 0.62) box.rotation.z = (r() - 0.5) * 0.32;
    corridor.add(box);
  }

  /* ---- camera journey: one keyframe per DOM section ---- */
  const KEYS = [
    { p: [0, 0, 12], l: [0, 0.35, -30] },          // home
    { p: [-2.4, 0.7, -3], l: [2.4, 0.7, -30] },    // about
    { p: [0.6, 0.1, -13], l: [-2, 0, -40] },       // projects intro
    { p: [-1.5, 0.4, -26], l: [1.6, 0.2, -52] },   // featured project
    { p: [0.2, 1.5, -40], l: [0, -0.2, -72] },     // experience + skills
    { p: [0, -1.1, -80], l: [3.8, 3.2, END_Z] },   // contact
  ];
  const last = KEYS.length - 1;

  const state = { f: 0, target: 0, mx: 0, my: 0, tmx: 0, tmy: 0, narrow: false, width: 1, height: 1 };
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), look = new THREE.Vector3();

  function placeRing() {
    const aspect = state.width / state.height;
    const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * RING_D;
    const narrow = aspect < 0.9;
    const [nx, ny] = narrow ? [0, 0.3] : [0.36, 0.32];
    const wide = narrow ? aspect : Math.min(aspect, 1.78);
    ring.position.set(nx * hh * wide, ny * hh, 12 - RING_D);
    ringLight.position.copy(ring.position);
    const radiusNdc = narrow ? 0.44 : 0.31;
    const s = 4 * radiusNdc * hh * wide;
    ring.scale.set(s, s, 1);
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    state.width = w; state.height = h;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.fov = aspect < 1.2 ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(HERO_FOV / 2)) * Math.min(1.9, 1.2 / aspect))) : HERO_FOV;
    camera.updateProjectionMatrix();
    state.narrow = aspect < 0.9;
    placeRing();
  }

  function evalCamera(f) {
    const i = Math.max(0, Math.min(last - 1, Math.floor(f)));
    const t = smooth(Math.max(0, Math.min(1, f - i)));
    vA.fromArray(KEYS[i].p).lerp(vB.fromArray(KEYS[Math.min(last, i + 1)].p), t);
    look.fromArray(KEYS[i].l).lerp(vB.fromArray(KEYS[Math.min(last, i + 1)].l), t);
    camera.position.copy(vA);
    if (state.narrow) {
      const endW = Math.max(0, f - (last - 1)) * -7.5;
      camera.position.x += endW;
      look.x += endW;
    }
    camera.lookAt(look);
    camera.position.x += state.mx * 0.8;
    camera.position.y += -state.my * 0.5;
    camera.lookAt(look.x + state.mx * 0.4, look.y - state.my * 0.25, look.z);
  }

  let raf = 0, prev = performance.now(), running = true;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    const k = reduced ? 1 : 1 - Math.pow(0.0016, dt);
    state.f += (state.target - state.f) * k;
    state.mx += (state.tmx - state.mx) * (reduced ? 0 : 1 - Math.pow(0.02, dt));
    state.my += (state.tmy - state.my) * (reduced ? 0 : 1 - Math.pow(0.02, dt));
    evalCamera(state.f);

    ring.quaternion.copy(camera.quaternion);
    const dRing = camera.position.distanceTo(ring.position);
    ringMat.uniforms.uOpacity.value = Math.max(0, Math.min(1, (dRing - 12) / 22));
    ring.visible = ringMat.uniforms.uOpacity.value > 0.01;
    ringMat.uniforms.uTime.value = now / 1000;
    shaftMat.uniforms.uTime.value = now / 1000;

    const ramp = smooth(Math.max(0, Math.min(1, (state.f - (last - 1.8)) / 1.8)));
    corridor.visible = ramp > 0.001;
    shaftLight.intensity = 1400 * ramp;
    shafts[0].visible = shafts[1].visible = glow.visible = state.f > last - 2.4;
    glow.quaternion.copy(camera.quaternion);

    if (!reduced) {
      for (const s of spinners) s.m.rotation[s.a] += s.s * dt;
      dust.rotation.y += dt * 0.0045;
    }
    renderer.render(scene, camera);
  }

  const onVis = () => { running = !document.hidden; prev = performance.now(); };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('resize', resize);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    setProgress(f) { state.target = Math.max(0, Math.min(last, f)); },
    setPointer(x, y) { state.tmx = x; state.tmy = y; },
    snap() { state.f = state.target; },
    dispose() {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
