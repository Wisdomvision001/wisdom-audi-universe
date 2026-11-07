import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
import '@fontsource-variable/caveat';
import './styles.css';
import './mockups.css';

import { SITE, ABOUT, PROJECT_INTRO, PROJECTS, EXPERIENCE, CONNECT } from './content.js';
import { screen, frontPhone, VARIANTS } from './mockups.js';
import { createUniverse } from './scene.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;

/* ------------------------------ icons ------------------------------ */
const badge = (t, fs = 9) => `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 3h16l-1.6 15.5L12 21l-6.4-2.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><text x="12" y="15" text-anchor="middle" font-size="${fs}" font-weight="700" fill="currentColor" font-family="Inter,sans-serif">${t}</text></svg>`;
const ICONS = {
  React: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>`,
  JavaScript: badge('JS'),
  TypeScript: badge('TS'),
  HTML: badge('5', 11),
  CSS: badge('3', 11),
  Python: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M12 3c-4 0-4 1.6-4 3v2h4v1H6c-2 0-3 1.6-3 4s1 4 3 4h2v-3c0-1.6 1.4-3 3-3h4c1.5 0 3-1 3-3V6c0-2-2-3-6-3z"/><path d="M12 21c4 0 4-1.600 4-3v-2h-4v-1h6c2 0 3-1.600 3-4s-1-4-3-4h-2v3c0 1.600-1.400 3-3 3H9c-1.500 0-3 1-3 3v3c0 2 2 3 6 3z" opacity=".7"/></svg>`,
  Django: badge('dj', 8),
};
const icon = (n) => ICONS[n] || badge(n.slice(0, 2), 8);

const arrow = `<svg class="arr" viewBox="0 0 16 10" width="14" height="9" aria-hidden="true"><path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`;
const ghIcon = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.800c-2.800.6-3.400-1.300-3.400-1.300-.5-1.200-1.100-1.500-1.100-1.500-.9-.6.1-.6.1-.6 1 .1 1.500 1 1.500 1 .9 1.500 2.400 1.100 3 .8.1-.7.4-1.100.6-1.400-2.200-.3-4.600-1.100-4.600-5 0-1.100.4-2 1-2.700-.1-.3-.4-1.300.1-2.700 0 0 .8-.3 2.800 1a9.600 9.600 0 0 1 5 0c1.900-1.300 2.800-1 2.800-1 .5 1.400.2 2.400.1 2.700.6.700 1 1.600 1 2.700 0 3.900-2.400 4.700-4.600 5 .4.300.7.900.7 1.800v2.700c0 .3.200.6.700.5A10 10 0 0 0 12 2z"/></svg>`;
const mailIcon = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.500 7 8.500 6.500L20.500 7"/></svg>`;
const inIcon = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M4.500 9h3.400v11H4.500zM6.200 3.500a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.200v1.500c.5-.9 1.700-1.800 3.400-1.800 3.500 0 4.100 2.300 4.100 5.300V20h-3.400v-5.200c0-1.300 0-2.900-1.800-2.900s-2 1.400-2 2.800V20H10z"/></svg>`;

const figure = (cls = '') => `<svg class="figure-svg ${cls}" viewBox="0 0 100 250" aria-hidden="true">
  <defs>
    <linearGradient id="rim${cls || 'h'}" x1="0" x2="1"><stop offset="0" stop-color="#e3ecff" stop-opacity=".95"/><stop offset=".3" stop-color="#9fb2d2" stop-opacity=".3"/><stop offset="1" stop-color="#8fa0bb" stop-opacity=".05"/></linearGradient>
    <linearGradient id="pack${cls || 'h'}" x1="0" x2="1"><stop offset="0" stop-color="#1a1f28"/><stop offset="1" stop-color="#07090c"/></linearGradient>
  </defs>
  <path id="body${cls || 'h'}" fill="#040507" stroke="url(#rim${cls || 'h'})" stroke-width="1.2" stroke-linejoin="round" d="M44 32 C38 30 35 24 35 17 C35 7 41 2 50 2 C59 2 65 7 65 17 C65 24 62 30 56 32 C67 34 79 38 83 48 C87 58 88 80 89 100 C90 112 91 120 89 129 L80 129 C79 113 78 99 76 88 L76 128 C79 142 79 152 77 164 L75 238 L76 247 L54 247 L53 172 L51 168 L49 172 L47 247 L25 247 L26 238 C23 160 21 142 24 128 L24 88 C22 99 21 113 20 129 L11 129 C9 121 10 112 11 100 C12 80 13 58 17 48 C21 38 33 34 44 32Z"/>
  <path fill="url(#pack${cls || 'h'})" d="M29 56 C29 50 34 48 40 48 L60 48 C66 48 71 50 71 56 L72 112 C72 118 68 121 62 121 L38 121 C32 121 28 118 28 112Z" opacity=".95"/>
  <path fill="none" stroke="#c9d6ee" stroke-opacity=".22" stroke-width=".8" d="M31 54 C31 51 34 50 40 50 L50 50"/>
</svg>`;

const bust = `<svg class="bust-svg" viewBox="0 0 400 480" aria-hidden="true"><defs><linearGradient id="bustRim" x1="0" x2="1"><stop offset="0" stop-color="#d4deee" stop-opacity=".6"/><stop offset=".4" stop-color="#8fa0bb" stop-opacity=".12"/><stop offset="1" stop-color="#8fa0bb" stop-opacity="0"/></linearGradient></defs>
  <g fill="#050608" stroke="url(#bustRim)" stroke-width="2.500" stroke-linejoin="round">
    <path d="M10 480 C 14 400 50 360 130 336 L 170 322 C 160 300 156 280 160 256 C 140 250 130 226 138 204 C 134 150 170 96 236 92 C 300 90 340 140 330 200 C 328 232 316 262 288 280 C 286 304 292 318 310 328 L 372 346 C 392 360 398 420 398 480Z"/>
  </g></svg>`;

const hud = `<div class="hud" aria-hidden="true">${[0, 1, 2]
  .map((i) => `<div class="hud-p p${i}">${Array.from({ length: 9 }, (_, k) => `<i style="width:${30 + ((k * 37 + i * 17) % 60)}%"></i>`).join('')}</div>`)
  .join('')}</div>`;

/* ----------------------------- markup ------------------------------ */
const c = SITE.contact;
const heroNav = [
  ['Home', '#home'], ['Projects', '#projects'], ['About', '#about'],
  ['Experience', '#experience'], ['Skills', '#skills'], ['Contact', '#contact'],
];

function projectSection(p, idx) {
  const links = [
    p.view ? `<a class="btn-o" href="${p.view}" target="_blank" rel="noopener">View Project ${arrow}</a>` : '',
    p.source ? `<a class="btn-t" href="${p.source}" target="_blank" rel="noopener">${ghIcon} Source Code</a>` : '',
  ].join('');
  const front = frontPhone(p.mock);
  return `<section class="sec proj" id="project-${p.id}" data-i="${3 + idx}" data-mock="${p.mock}">
    <div class="copy rv">
      <p class="count">${p.no} / 0${PROJECTS.length}</p>
      <h2>${p.title}</h2>
      <p class="sub">${p.subtitle}</p>
      <p class="desc">${p.desc}</p>
      <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
      ${links ? `<div class="actions">${links}</div>` : ''}
      <p class="kw">${p.keywords.join('<span>·</span>')}</p>
    </div>
    <div class="showcase" role="img" aria-label="Illustration of the ${p.title} interface">
      <div class="rock"><svg viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true"><use href="#rock-shape"/></svg></div>
      <div class="device"><div class="screen" data-screen>${screen(p.mock, 0)}</div></div>
      ${front ? `<div class="front-phone">${front}</div>` : ''}
    </div>
    <div class="thumbs" role="tablist" aria-label="${p.title} views">
      ${Array.from({ length: VARIANTS }, (_, v) => `<button class="thumb ${v === 0 ? 'on' : ''}" role="tab" aria-selected="${v === 0}" aria-label="View ${v + 1}" data-v="${v}"><span class="screen">${screen(p.mock, v)}</span></button>`).join('')}
    </div>
  </section>`;
}

function render() {
  const email = c.email ? `<a href="mailto:${c.email}">${mailIcon}<span>Email</span></a>` : '';
  const li = c.linkedin ? `<a href="${c.linkedin}" target="_blank" rel="noopener">${inIcon}<span>LinkedIn</span></a>` : '';
  const gh = c.github ? `<a href="${c.github}" target="_blank" rel="noopener">${ghIcon}<span>GitHub</span></a>` : '';
  const touch = c.email ? `mailto:${c.email}` : c.linkedin || c.github || '#contact';

  document.getElementById('app').innerHTML = `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <filter id="rock-tex" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".022 .05" numOctaves="4" seed="7" result="n"/><feDiffuseLighting in="n" lighting-color="#9aa6b8" surfaceScale="4.500" result="lit"><feDistantLight azimuth="235" elevation="38"/></feDiffuseLighting><feComposite in="lit" in2="SourceGraphic" operator="in"/></filter>
    <linearGradient id="rock-rim" x1="0" x2="1"><stop offset="0" stop-color="#e8f0ff" stop-opacity=".7"/><stop offset=".5" stop-color="#9db0cc" stop-opacity=".18"/><stop offset="1" stop-color="#9db0cc" stop-opacity=".05"/></linearGradient>
    <symbol id="rock-shape" viewBox="0 0 600 160"><path d="M0 70 L70 28 L170 40 L270 12 L400 22 L500 10 L600 52 L580 118 L520 142 L400 150 L250 156 L110 148 L28 128Z" fill="#0a0c10"/><path d="M0 70 L70 28 L170 40 L270 12 L400 22 L500 10 L600 52 L580 118 L520 142 L400 150 L250 156 L110 148 L28 128Z" filter="url(#rock-tex)" opacity=".34" style="mix-blend-mode:screen"/><path d="M0 70 L70 28 L170 40 L270 12 L400 22 L500 10 L600 52" fill="none" stroke="url(#rock-rim)" stroke-width="2"/></symbol>
  </defs></svg>

  <header class="top" id="top">
    <a class="logo" href="#home" aria-label="Wisdom Audi — home">WA</a>
    <nav id="nav" aria-label="Primary">${heroNav.map(([l, h]) => `<a href="${h}" data-nav="${h.slice(1)}">${l}</a>`).join('')}</nav>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="nav"><i></i><i></i></button>
  </header>
  <div class="progress" id="progress" aria-hidden="true"><i></i></div>

  <main>
  <section class="sec hero" id="home" data-i="0">
    <div class="floor" aria-hidden="true"></div>
    <div class="figure">${figure('hero')}</div>
    <div class="copy">
      <p class="eyebrow">${SITE.role.toUpperCase()}</p>
      <h1>${SITE.name}</h1>
      <p class="lead">${SITE.heroLines.join('<br>')}</p>
      <a class="btn-o" href="#about">Explore My World ${arrow}</a>
    </div>
    <ul class="keys" aria-hidden="true"><li>Ideas</li><li>Code</li><li>Products</li><li>Impact</li></ul>
    <a class="scroll-cue" href="#about">Scroll to enter ${arrow}</a>
  </section>

  <section class="sec about" id="about" data-i="1">
    <div class="copy rv">
      <p class="eyebrow">01 · ABOUT ME</p>
      <h2>${ABOUT.heading}</h2>
      <p class="lead">${ABOUT.lead.join('<br>')}</p>
      <p class="desc">${ABOUT.body}</p>
      <div class="rule"></div>
      <ul class="tech">${ABOUT.tech.map((t) => `<li>${icon(t)}<span>${t}</span></li>`).join('')}</ul>
    </div>
    <div class="portrait" aria-hidden="true">${hud}<div class="bust">${bust}<img alt="" data-portrait hidden></div></div>
    <p class="script" aria-hidden="true">${ABOUT.script.map((w) => `<span>${w}</span>`).join(' ')}</p>
    <a class="scroll-cue ring" href="#projects"><span class="mouse"></span> Scroll</a>
  </section>

  <section class="sec intro" id="projects" data-i="2">
    <div class="copy rv">
      <p class="eyebrow">${PROJECT_INTRO.eyebrow}</p>
      <h2>${PROJECT_INTRO.heading.join('<br>')}</h2>
      <p class="desc">${PROJECT_INTRO.body}</p>
      <a class="link" href="#project-${PROJECTS[0].id}">${PROJECT_INTRO.cta} ${arrow}</a>
    </div>
    <div class="iso-wrap" aria-hidden="true"><div class="iso" id="iso">
      ${[300, 240, 180].map((w, s) => `<div class="slab" style="--w:${w}px">${Array.from({ length: 7 }, (_, k) => `<i style="transform:translateZ(${s * 26 + k * 3}px)"></i>`).join('')}</div>`).join('')}
      <div class="cube">${['front', 'back', 'left', 'right', 'top'].map((f) => `<b class="${f}">${f === 'front' ? 'WA' : ''}</b>`).join('')}</div>
      ${[0, 1, 2, 3, 4].map((n) => `<div class="gp g${n}">${Array.from({ length: 6 }, (_, k) => `<i style="width:${35 + ((k * 29 + n * 13) % 55)}%"></i>`).join('')}</div>`).join('')}
    </div></div>
    <ol class="index" id="index">${PROJECTS.map((p, i) => `<li><a href="#project-${p.id}" class="${i === 0 ? 'on' : ''}" data-idx="${i}">${p.no}</a></li>`).join('')}</ol>
  </section>

  ${PROJECTS.map(projectSection).join('')}

  <section class="sec exp" id="experience" data-i="7">
    <div class="wrap rv">
      <p class="eyebrow">${EXPERIENCE.eyebrow}</p>
      <h2>${EXPERIENCE.heading}</h2>
      <div class="cards">${EXPERIENCE.items
        .map(
          (e) => `<article class="xcard"><header><span class="logo-tile">${e.logo}</span><div><h3>${e.company}</h3><p>${e.role}</p></div><time>${e.dates}</time></header><ul>${e.points.map((p) => `<li>${p}</li>`).join('')}</ul></article>`
        )
        .join('')}</div>
      <div class="skills" id="skills">
        <h2 class="h3">${EXPERIENCE.skillsHeading}</h2>
        <ul class="tech">${EXPERIENCE.skills.map((t) => `<li>${icon(t)}<span>${t}</span></li>`).join('')}</ul>
        <p class="aside">${EXPERIENCE.aside.join('<br>')}</p>
      </div>
    </div>
  </section>

  <section class="sec connect" id="contact" data-i="8">
    <div class="beam-figure">${figure('end')}</div>
    <div class="copy rv">
      <p class="eyebrow">${CONNECT.eyebrow}</p>
      <h2>${CONNECT.heading.join('<br>')}</h2>
      <p class="lead">${CONNECT.body.join('<br>')}</p>
      <div class="actions"><a class="btn-o" href="${touch}" ${touch.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>Get in Touch ${arrow}</a>${c.github ? `<a class="btn-t" href="${c.github}" target="_blank" rel="noopener">${ghIcon} View GitHub</a>` : ''}</div>
    </div>
    <nav class="contact-links" aria-label="Contact">${email}${li}${gh}</nav>
    <div class="end-phone" aria-hidden="true">
      <div class="mk-phone big"><div class="mk-notch"></div><div class="mini-hero"><span class="wa">WA</span><b>I'm Wisdom Audi.</b><u>Developer. Problem-solver.<br>Builder of digital experiences.</u><em>Explore My World</em><div class="ring-o"></div></div></div>
    </div>
  </section>
  </main>`;
}

/* ----------------------------- behaviour ---------------------------- */
function init() {
  render();

  // 3D universe
  const canvas = document.getElementById('stage');
  let universe = null;
  try {
    universe = createUniverse(canvas, { reduced });
  } catch (e) {
    console.warn('WebGL unavailable, using static background.', e);
    document.documentElement.classList.add('no-webgl');
  }

  const sections = [...document.querySelectorAll('.sec')];
  let tops = [];
  const measure = () => { tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY); };

  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const navMap = { home: 0, projects: 2, about: 1, experience: 7, skills: 7, contact: 8 };
  const bar = document.querySelector('#progress i');
  const indexLinks = [...document.querySelectorAll('#index a')];

  function onScroll() {
    const y = window.scrollY + window.innerHeight * 0.0;
    let i = 0;
    for (let k = 0; k < tops.length; k++) if (y >= tops[k] - 1) i = k;
    const next = tops[i + 1] ?? document.documentElement.scrollHeight - window.innerHeight;
    const span = Math.max(1, next - tops[i]);
    const f = i + Math.min(1, Math.max(0, (y - tops[i]) / span));
    universe?.setProgress(i >= tops.length - 1 ? tops.length - 1 : f);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

    const mid = window.scrollY + window.innerHeight * 0.5;
    let active = 0;
    for (let k = 0; k < tops.length; k++) if (mid >= tops[k]) active = k;
    const section = sections[active];
    navLinks.forEach((a) => a.classList.toggle('on', (navMap[a.dataset.nav] ?? -1) === active && (active !== 7 || a.dataset.nav === 'experience')));
    const pi = active - 3;
    indexLinks.forEach((a, k) => a.classList.toggle('on', pi >= 0 ? k === Math.min(pi, 3) : k === 0));
    document.body.dataset.section = section?.id || '';
  }

  measure();
  onScroll();
  universe?.snap();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); onScroll(); });
  window.addEventListener('load', () => { measure(); onScroll(); });
  if (document.fonts?.ready) document.fonts.ready.then(() => { measure(); onScroll(); });

  // cursor parallax (fine pointers only)
  if (!reduced && !coarse) {
    window.addEventListener('pointermove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      universe?.setPointer(x, y);
      document.documentElement.style.setProperty('--mx', x.toFixed(3));
      document.documentElement.style.setProperty('--my', y.toFixed(3));
    }, { passive: true });
  }

  // project thumbnails switch the main device view
  document.querySelectorAll('.proj').forEach((sec) => {
    const mock = sec.dataset.mock;
    const main = sec.querySelector('[data-screen]');
    const thumbs = [...sec.querySelectorAll('.thumb')];
    thumbs.forEach((t) => t.addEventListener('click', () => {
      const v = Number(t.dataset.v);
      main.innerHTML = screen(mock, v);
      thumbs.forEach((o) => { const on = o === t; o.classList.toggle('on', on); o.setAttribute('aria-selected', on); });
    }));
  });

  // reveal copy blocks as they enter
  const rv = document.querySelectorAll('.rv');
  if (reduced || !('IntersectionObserver' in window)) rv.forEach((n) => n.classList.add('in'));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.2 });
    rv.forEach((n) => io.observe(n));
  }

  // optional real portrait: drop a transparent PNG at public/assets/portrait.png
  const img = document.querySelector('[data-portrait]');
  const probe = new Image();
  probe.onload = () => { img.src = probe.src; img.hidden = false; img.closest('.bust').classList.add('has-photo'); };
  probe.src = new URL('assets/portrait.png', document.baseURI).href;

  // mobile menu
  const burger = document.getElementById('burger');
  const top = document.getElementById('top');
  burger.addEventListener('click', () => {
    const open = top.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  document.getElementById('nav').addEventListener('click', () => { top.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
}

init();
