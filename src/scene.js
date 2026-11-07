import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/* Procedural helpers                                                  */
/* ------------------------------------------------------------------ */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (t) => t * t * (3 - 2 * t);

function rockGeometry(seed, detail = 3) {
  const r = rng(seed);
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  const o = [r() * 9, r() * 9, r() * 9];
  const sx = 0.8 + r() * 0.5, sy = 0.55 + r() * 0.45, sz = 0.8 + r() * 0.5;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n =
      Math.sin(2.1 * v.x + o[0]) * Math.cos(1.7 * v.y + o[1]) * 0.5 +
      Math.sin(4.3 * v.y + 1.3 * v.z + o[2]) * 0.26 +
      Math.sin(8.1 * v.x + 5.7 * v.z + o[0]) * 0.13 +
      Math.sin(15.3 * v.y - 9.1 * v.x + o[1]) * 0.06;
    const k = 0.78 + n * 0.42;
    v.multiplyScalar(k);
    v.x *= sx; v.y *= sy; v.z *= sz;
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function gridTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#07090c';
  x.fillRect(0, 0, 512, 512);
  x.strokeStyle = 'rgba(160,185,220,0.18)';
  x.lineWidth = 2;
  x.strokeRect(1, 1, 510, 510);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(30, 30);
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/* Shaders                                                             */
/* ------------------------------------------------------------------ */
// Eclipse: black disc with a thin bright rim, brighter toward the upper-left,
// soft halo and a faint secondary arc. Premultiplied alpha so the disc occludes
// while the glow adds light.
const eclipseMat = new THREE.ShaderMaterial({
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
      vec2 p=(vUv-.5)*2.; float r=length(p); float R=.5; float d=r-R;
      float ang=atan(p.y,p.x);
      float side=.30+.70*pow(.5+.5*cos(ang-2.55),1.6);       // lit side: upper-left
      float tight=exp(-max(d,0.)*95.)*smoothstep(-.004,.004,d); // crisp outer rim
      float inner=exp(d*180.)*step(d,0.);                      // faint rim inside the disc edge
      float halo=exp(-max(d,0.)*10.)*.22;
      float arc2=exp(-pow((d-.075)*70.,2.))*.35*pow(.5+.5*cos(ang-2.2),2.);
      float shimmer=.96+.04*sin(uTime*.6+ang*3.);
      float outside=step(0.,d);
      float L=(tight*1.25+halo+arc2)*side*shimmer*outside;
      vec3 col=mix(vec3(.62,.72,.9),vec3(1.),tight)*L;
      float disc=step(d,0.);
      col+=vec3(.8,.88,1.)*inner*side*.55;
      float a=disc;
      gl_FragColor=vec4(col*uOpacity*step(r,1.),a*uOpacity);
    }`,
});

const beamMat = new THREE.ShaderMaterial({
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
      float core=exp(-x*x*38.);
      float soft=exp(-x*x*5.)*.35;
      float fadeY=smoothstep(0.,.18,vUv.y)*(1.-smoothstep(.55,1.,vUv.y)*.0);
      float flick=.96+.04*sin(uTime*1.3+vUv.y*9.);
      float a=(core+soft)*fadeY*flick;
      gl_FragColor=vec4(vec3(.86,.92,1.)*a,a);
    }`,
});

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */
export function createUniverse(canvas, { reduced = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x030406, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030406, 0.014);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);

  // Lights: the eclipse is a back light, so rocks read as dark bodies with cold rim edges.
  scene.add(new THREE.HemisphereLight(0x2a3548, 0x030405, 0.9));
  const back = new THREE.DirectionalLight(0xdfe9ff, 1.1);
  back.position.set(-12, 9, -60);
  scene.add(back);
  const fill = new THREE.DirectionalLight(0x6f86ab, 0.9);
  fill.position.set(-14, 12, 25);
  scene.add(fill);

  /* ---- Planet (eclipse) ---- */
  const HERO_FOV = 45;
  const planetDist = 52;
  const planet = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), eclipseMat);
  planet.scale.set(46, 46, 1);
  planet.renderOrder = -1;
  scene.add(planet);
  // the eclipse lights nearby rocks on the faces that look toward it
  const planetLight = new THREE.PointLight(0xdfe9ff, 900, 0, 2);
  scene.add(planetLight);

  /* ---- Rocks ---- */
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x262a33, roughness: 0.88, metalness: 0.06, flatShading: true });
  const geos = [11, 23, 37, 51, 67].map((s, i) => rockGeometry(s, i < 3 ? 3 : 2));
  const rocks = new THREE.Group();
  scene.add(rocks);
  const spinners = [];
  const r = rng(42);

  function addRock(x, y, z, size, i = Math.floor(r() * geos.length)) {
    const m = new THREE.Mesh(geos[i % geos.length], rockMat);
    m.position.set(x, y, z);
    m.scale.setScalar(size);
    m.rotation.set(r() * 6, r() * 6, r() * 6);
    rocks.add(m);
    spinners.push({ m, s: (r() - 0.5) * 0.06, a: r() > 0.5 ? 'y' : 'x' });
    return m;
  }

  // Hero composition: hand-placed in screen space relative to the opening camera (0,0,12).
  const ndc = (nx, ny, d, aspect = 16 / 9) => {
    const hh = Math.tan(THREE.MathUtils.degToRad(HERO_FOV / 2)) * d;
    return [nx * hh * aspect, ny * hh, 12 - d];
  };
  [
    [0.8, 0.66, 44, 4.2, 0], [0.96, 0.2, 40, 3.2, 2], [0.62, 0.86, 50, 2.0, 1],
    [0.5, 0.74, 56, 1.0, 3], [0.88, -0.15, 36, 1.8, 4], [0.6, 0.0, 52, 0.8, 2],
    [-0.9, 0.7, 46, 1.3, 1], [-0.6, 0.82, 54, 0.8, 3], [-0.97, 0.15, 38, 0.7, 4],
    [-0.35, 0.88, 54, 0.9, 2], [0.15, 0.9, 56, 1.0, 0], [-0.78, 0.4, 30, 0.45, 3],
    [0.99, -0.5, 32, 1.3, 1], [-0.5, 0.5, 40, 0.5, 4],
  ].forEach(([nx, ny, d, s, i]) => addRock(...ndc(nx, ny, d), s, i));

  // Field along the whole journey (kept off the camera path).
  const path = (z) => ({ x: Math.sin(z * 0.05) * 3, y: Math.cos(z * 0.04) * 1.2 });
  for (let i = 0; i < 150; i++) {
    const z = -8 - r() * 116;
    const side = r() > 0.5 ? 1 : -1;
    const dist = 11 + r() * 24;
    const ang = (r() - 0.5) * Math.PI * 1.15;
    const c = path(z);
    const x = c.x + side * dist * Math.cos(ang * 0.7);
    const y = c.y + Math.sin(ang) * dist * 0.6 + (side < 0 ? 2.5 : 0);
    addRock(x, y, z, 0.3 + Math.pow(r(), 2.6) * 2.6);
  }
  // Overhang rocks: upper-left, as in the project panels.
  for (let i = 0; i < 16; i++) {
    const z = -26 - i * 4.8 + r() * 3;
    const c = path(z);
    addRock(c.x - 13 - r() * 8, c.y + 7 + r() * 5, z, 1.6 + r() * 3);
  }

  /* ---- Stars & dust ---- */
  function points(count, spread, size, opacity, color) {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * spread.x;
      pos[i * 3 + 1] = (r() - 0.5) * spread.y;
      pos[i * 3 + 2] = spread.z0 - r() * spread.z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const m = new THREE.PointsMaterial({ size, sizeAttenuation: true, transparent: true, opacity, color, depthWrite: false, fog: false });
    const p = new THREE.Points(g, m);
    scene.add(p);
    return p;
  }
  points(1100, { x: 260, y: 150, z: 240, z0: 40 }, 0.16, 0.7, 0xaab8d0).renderOrder = -3;
  const dust = points(700, { x: 46, y: 26, z: 150, z0: 14 }, 0.055, 0.5, 0x9fb4d4);

  /* ---- Contact scene: beam, floor, monoliths ---- */
  const END_Z = -132;
  const contact = new THREE.Group();
  contact.position.set(-4.5, 0, END_Z);
  scene.add(contact);

  const floorTex = gridTexture();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(260, 260),
    new THREE.MeshStandardMaterial({ map: floorTex, color: 0x9aa4b4, roughness: 0.28, metalness: 0.55 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -6.5, -20);
  contact.add(floor);

  const beamPlanes = [0, Math.PI / 2].map((ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(9, 110), beamMat);
    m.rotation.y = ry;
    m.position.y = 48;
    contact.add(m);
    return m;
  });
  const beamLight = new THREE.PointLight(0xcfe0ff, 1400, 0, 2);
  beamLight.position.set(0, -1.5, 0);
  contact.add(beamLight);
  const glowSprite = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 26),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec2 vUv; void main(){ float d=length(vUv-.5)*2.; float a=exp(-d*d*4.5)*.6; gl_FragColor=vec4(vec3(.8,.9,1.)*a,a); }',
    })
  );
  glowSprite.position.set(0, -4.5, 0);
  contact.add(glowSprite);

  const monoMat = new THREE.MeshStandardMaterial({ color: 0x0b0d11, roughness: 0.35, metalness: 0.7, flatShading: true });
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2;
    const rad = 7 + Math.pow(r(), 0.7) * 42;
    const w = 1 + r() * 4.5, h = 3 + r() * 24, dpt = 1 + r() * 4.5;
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, dpt), monoMat);
    box.position.set(Math.cos(a) * rad, -6.5 + h / 2 + (r() > 0.75 ? 6 + r() * 12 : 0), Math.sin(a) * rad * 0.9 - 4);
    box.rotation.y = r() * 3;
    if (r() > 0.6) box.rotation.z = (r() - 0.5) * 0.35;
    contact.add(box);
  }

  /* ---- Camera journey ---- */
  // One keyframe per page section (index matches DOM order).
  const KEYS = [
    { p: [0, 0, 12], l: [0, 0, -30] },       // 0 hero
    { p: [-2.5, 0.8, -4], l: [3, 0.5, -34] }, // 1 about
    { p: [0, 0.2, -18], l: [1, 0, -50] },    // 2 projects intro
    { p: [-1, 0.5, -30], l: [2, 0, -60] },   // 3 lifeguard360
    { p: [1.2, 0.2, -42], l: [-1, 0.5, -72] }, // 4 signal
    { p: [-1, 0.6, -54], l: [1, 0, -84] },   // 5 kitchen
    { p: [1, 0.2, -66], l: [-1, 0.4, -96] }, // 6 expense
    { p: [0, 0.4, -80], l: [0, 0.2, -110] }, // 7 experience
    { p: [0, -1.2, -104], l: [3.4, 3.5, END_Z] }, // 8 contact
  ];
  const nKeys = KEYS.length;

  const state = { f: 0, target: 0, mx: 0, my: 0, tmx: 0, tmy: 0, narrow: false, width: 1, height: 1 };
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
  const look = new THREE.Vector3();

  function placePlanet() {
    const aspect = state.width / state.height;
    const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * planetDist;
    const narrow = aspect < 0.9;
    const [nx, ny] = narrow ? [0.0, 0.34] : [0.4, 0.3];
    const wide = narrow ? aspect : Math.min(aspect, 1.78);
    planet.position.set(nx * hh * wide, ny * hh, 12 - planetDist);
    planetLight.position.copy(planet.position);
    // disc radius in world units = s/4; target ~30% of half-width on desktop, ~42% on tall screens
    const radiusNdc = narrow ? 0.42 : 0.3;
    const s = 4 * radiusNdc * hh * wide;
    planet.scale.set(s, s, 1);
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    state.width = w; state.height = h;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    // widen the vertical FOV on tall screens so the composition keeps its horizontal reach
    const fov = aspect < 1.2 ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(HERO_FOV / 2)) * Math.min(1.9, 1.2 / aspect))) : HERO_FOV;
    camera.fov = fov;
    camera.updateProjectionMatrix();
    state.narrow = aspect < 0.9;
    placePlanet();
  }

  function evalCamera(f) {
    const i = Math.max(0, Math.min(nKeys - 1, Math.floor(f)));
    const j = Math.min(nKeys - 1, i + 1);
    const t = smooth(Math.max(0, Math.min(1, f - i)));
    tmpA.fromArray(KEYS[i].p).lerp(tmpB.fromArray(KEYS[j].p), t);
    look.fromArray(KEYS[i].l).lerp(tmpB.fromArray(KEYS[j].l), t);
    camera.position.copy(tmpA);
    camera.lookAt(look);
    if (state.narrow) {
      // On tall screens centre the contact beam and the eclipse by sliding the camera sideways.
      const heroW = 0;
      const endW = Math.max(0, f - (nKeys - 2)) * -8;
      camera.position.x += heroW + endW;
      look.x += heroW + endW;
      camera.lookAt(look);
    }
    // cursor parallax (disabled for reduced motion / touch)
    camera.position.x += state.mx * 0.8;
    camera.position.y += -state.my * 0.5;
    camera.lookAt(look.x + state.mx * 0.4, look.y - state.my * 0.25, look.z);
  }

  let raf = 0, last = performance.now(), running = true;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const k = reduced ? 1 : 1 - Math.pow(0.0016, dt);
    state.f += (state.target - state.f) * k;
    state.mx += (state.tmx - state.mx) * (reduced ? 0 : 1 - Math.pow(0.02, dt));
    state.my += (state.tmy - state.my) * (reduced ? 0 : 1 - Math.pow(0.02, dt));
    evalCamera(state.f);

    // planet always faces the camera and fades before the camera reaches it
    planet.quaternion.copy(camera.quaternion);
    const dPl = camera.position.distanceTo(planet.position);
    eclipseMat.uniforms.uOpacity.value = Math.max(0, Math.min(1, (dPl - 14) / 20));
    planet.visible = eclipseMat.uniforms.uOpacity.value > 0.01;
    eclipseMat.uniforms.uTime.value = now / 1000;
    beamMat.uniforms.uTime.value = now / 1000;
    const ramp = smooth(Math.max(0, Math.min(1, (state.f - 5.2) / 2.8)));
    contact.visible = ramp > 0.001;
    beamLight.intensity = 1400 * ramp;
    beamPlanes[0].visible = beamPlanes[1].visible = glowSprite.visible = state.f > nKeys - 3.2;
    glowSprite.quaternion.copy(camera.quaternion);

    if (!reduced) {
      for (const s of spinners) s.m.rotation[s.a] += s.s * dt;
      dust.rotation.y += dt * 0.004;
    }
    renderer.render(scene, camera);
  }

  const onVis = () => { running = !document.hidden; last = performance.now(); };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('resize', resize);
  resize();
  raf = requestAnimationFrame(frame);

  return {
    setProgress(f) { state.target = Math.max(0, Math.min(nKeys - 1, f)); },
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
