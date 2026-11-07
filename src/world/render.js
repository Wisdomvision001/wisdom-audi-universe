// DOM builder for the Wisdom Audi world experience.
// All markup is semantic; the WebGL canvas behind it is purely decorative,
// so the site remains fully usable without scene initialization.

import '../fonts'; // side-effect: fontsource imports live here
import { SITE, HERO, ABOUT, PROJECTS_INTRO, PROJECTS, EXPERIENCE, SKILLS, CONNECT } from './config.js';
import './styles.css';
import { viewMap, viewGuide } from './mockups.js';

const ISSUES = [];

/* ------------------------------ icons ------------------------------ */
const tile = (t, fs) => `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 3h16l-1.6 15.5L12 21l-6.4-2.5z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><text x="12" y="15" text-anchor="middle" font-size="${fs}" font-weight="700" fill="currentColor" font-family="Inter,sans-serif">${t}</text></svg>`;
const ICONS = {
  React: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2"><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>`,
  JavaScript: tile('JS', 9),
  TypeScript: tile('TS', 8.5),
  HTML: tile('5', 10.5),
  CSS: tile('3', 10.5),
  Python: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M12 3c-4 0-4 1.6-4 3v2h4v1H6c-2 0-3 1.6-3 4s1 4 3 4h2v-3c0-1.6 1.4-3 3-3h4c1.5 0 3-1 3-3V6c0-2-2-3-6-3z"/><path d="M12 21c4 0 4-1.6 4-3v-2h-4v-1h6c2 0 3-1.6 3-4s-1-4-3-4h-2v3c0 1.6-1.4 3-3 3H9c-1.5 0-3 1-3 3v3c0 2 2 3 6 3z" opacity=".7"/></svg>`,
  Flask: `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"><path d="M10 3v5.2L4.6 17.4A2.4 2.4 0 0 0 6.7 21h10.6a2.4 2.4 0 0 0 2.1-3.6L14 8.2V3"/><path d="M9 3h6M7.6 13.5h8.8"/></svg>`,
};
const icon = (n) => ICONS[n] || null;

const arrow = `<svg class="arr" viewBox="0 0 16 10" width="14" height="9" aria-hidden="true"><path d="M0 5h13M9.5 1.5 13 5l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`;
const ghIcon = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>`;
const mailIcon = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/></svg>`;
const inIcon = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M4.5 9h3.4v11H4.5zM6.2 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h3.2v1.5c.5-.9 1.7-1.8 3.4-1.8 3.5 0 4.1 2.3 4.1 5.3V20h-3.4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20H10z"/></svg>`;

/* --------------------------- silhouettes ---------------------------- */
const hiker = (gradId) => `<svg viewBox="0 0 100 250" aria-hidden="true"><defs>
  <linearGradient id="${gradId}" x1="0" x2="1"><stop offset="0" stop-color="#e6edfb" stop-opacity=".95"/><stop offset=".3" stop-color="#a3b3ce" stop-opacity=".3"/><stop offset="1" stop-color="#93a2bb" stop-opacity=".05"/></linearGradient>
  <linearGradient id="${gradId}p" x1="0" x2="1"><stop offset="0" stop-color="#1b2028"/><stop offset="1" stop-color="#080a0d"/></linearGradient></defs>
  <path fill="#040507" stroke="url(#${gradId})" stroke-width="1.2" stroke-linejoin="round" d="M45 31 C39 29 36 23 36 16 C36 6 42 1 50 1 C58 1 64 6 64 16 C64 23 61 29 55 31 C66 33 78 37 82 47 C86 57 88 80 89 101 C90 113 91 121 89 130 L80 130 C79 114 78 99 76 87 L76 128 C79 142 79 152 77 165 L75 238 L76 248 L56 248 L55 172 L52 168 L50 172 L48 248 L27 248 L28 238 C24 160 22 142 25 128 L25 87 C23 99 22 114 21 130 L12 130 C10 122 11 113 12 101 C13 80 14 57 18 47 C22 37 34 33 45 31Z"/>
  <path fill="url(#${gradId}p)" d="M31 55 C31 49 36 47 42 47 L60 47 C66 47 70 49 70 55 L71 111 C71 117 67 120 61 120 L40 120 C34 120 30 117 30 111Z" opacity=".95"/>
  <path fill="none" stroke="#c9d6ee" stroke-opacity=".2" stroke-width=".8" d="M33 53 c0-3 3-4 9-4 L50 49"/></svg>`;

const portraitSilhouette = `<svg viewBox="0 0 380 470" aria-hidden="true"><defs><linearGradient id="prs" x1="0" x2="1"><stop offset="0" stop-color="#d4deee" stop-opacity=".6"/><stop offset=".4" stop-color="#8fa0bb" stop-opacity=".12"/><stop offset="1" stop-color="#8fa0bb" stop-opacity="0"/></linearGradient></defs>
  <path fill="#050608" stroke="url(#prs)" stroke-width="2.4" stroke-linejoin="round" d="M8 470 C 12 392 46 352 124 328 L 164 314 C 154 292 150 272 154 248 C 134 242 124 218 132 196 C 128 144 162 92 226 88 C 288 86 326 134 318 192 C 316 224 305 254 278 272 C 276 296 282 310 300 320 L 362 338 C 382 352 388 412 388 470Z"/></svg>`;

const hoodieSilhouette = `<svg viewBox="0 0 300 460" aria-hidden="true"><defs><linearGradient id="phs" x1="0" x2="1"><stop offset="0" stop-color="#c3d0e4" stop-opacity=".66"/><stop offset=".35" stop-color="#7e90ae" stop-opacity=".1"/><stop offset="1" stop-color="#7e90ae" stop-opacity="0"/></linearGradient></defs>
  <g fill="#050609" stroke="url(#phs)" stroke-width="2.2" stroke-linejoin="round">
    <path d="M150 286 C 148 262 152 244 160 226 C 138 216 128 192 132 168 C 134 122 158 86 196 84 C 232 82 258 112 256 150 C 255 178 246 202 226 216 C 230 232 236 242 248 250 L 258 258"/>
    <path d="M118 460 C 118 420 122 380 130 344 C 140 300 148 272 150 240 C 152 214 158 200 170 190 C 180 182 198 180 212 186 C 226 192 234 204 238 220 C 242 240 240 260 234 286 C 228 314 224 348 222 384 L 220 460Z"/>
    <path d="M118 460 C 118 420 122 380 130 344 C 140 300 148 272 150 240 C 152 214 158 200 170 190C 160 194 150 200 142 210 C 132 224 128 246 130 280 C 132 330 130 396 128 460Z"/>
  </g></svg>`;

/* --------------------------- small helpers -------------------------- */
const lines = (arr, tag, cls = '') =>
  `<${tag}${cls ? ` class="${cls}"` : ''}>${arr
    .map((l) => `<span class="rline"><i>${l}</i></span>`)
    .join('')}</${tag}>`;

const chipRow = (items) =>
  items.map((t) => `<li>${icon(t) ? icon(t) : ''}<span>${t}</span></li>`).join('');

function contactLinksHtml() {
  const c = SITE.contact;
  return [
    c.email ? `<a href="mailto:${c.email}">${mailIcon}<span>Email</span></a>` : '',
    c.linkedin ? `<a href="${c.linkedin}" target="_blank" rel="noopener">${inIcon}<span>LinkedIn</span></a>` : '',
    c.github ? `<a href="${c.github}" target="_blank" rel="noopener">${ghIcon}<span>GitHub</span></a>` : '',
  ].join('');
}

const contactDestination = () => SITE.contact.email ? `mailto:${SITE.contact.email}` : SITE.contact.linkedin || SITE.contact.github || '';

/* ------------------------------ markup ------------------------------ */
function heroHtml() {
  const nav = SITE.nav
    .map((n) => `<a href="${n.href}" data-nav="${n.section}">${n.label}</a>`)
    .join('');
  const keys = HERO.keywords.map((k) => `<li>${k}</li>`).join('');
  const contact = contactDestination();
  const cta = contact
    ? `<a class="pill-btn" href="${contact}" ${contact.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${HERO.cta.label} ${arrow}</a>`
    : `<a class="pill-btn" href="${HERO.cta.href}">${HERO.cta.label} ${arrow}</a>`;
  return `
  <header class="whead" id="whead">
    <a class="wlogo" href="#home" aria-label="Wisdom Audi — home"><i>${SITE.initials}</i>${SITE.name}</a>
    <nav class="wmenu" id="wmenu" aria-label="Primary">${nav}</nav>
    <button class="wburger" id="wburger" aria-label="Menu" aria-expanded="false" aria-controls="wmenu"><i></i><i></i></button>
  </header>
  <section class="sec hero" id="home" data-sec="home">
    <div class="h-floor" aria-hidden="true"></div>
    <div class="h-figure" aria-hidden="true">${hiker('ha')}</div>
    <div class="h-copy">
      <p class="slabel">${SITE.role}</p>
      ${lines([SITE.name], 'h1')}
      ${lines(HERO.statement, 'p', 'lead')}
      <div class="r-fade">${cta}</div>
    </div>
    <ul class="h-keys" aria-hidden="true">${keys}</ul>
    <a class="cue r-fade" href="#about">Scroll to enter ${arrow}</a>
  </section>`;
}

function aboutHtml() {
  return `
  <section class="sec about" id="about" data-sec="about">
    <div class="about-copy">
      <span class="slabel r-fade">${ABOUT.label}</span>
      ${lines([ABOUT.heading], 'h2')}
      ${lines(ABOUT.lead, 'p', 'lead')}
      <p class="body-text r-fade">${ABOUT.body}</p>
      <div class="about-rule" aria-hidden="true"></div>
      <ul class="chips r-fade">${chipRow(ABOUT.tech)}</ul>
    </div>
    <div class="a-stage" aria-hidden="true">
      <div class="glass g1"><b></b>${'<i></i>'.repeat(5)}</div>
      <div class="glass g2"><b></b>${'<i></i>'.repeat(4)}</div>
      <div class="glass g3"><b></b>${'<i></i>'.repeat(4)}</div>
      <div class="a-sil">${portraitSilhouette}<img alt="" data-portrait hidden></div>
    </div>
    <p class="a-script" aria-hidden="true">${ABOUT.script.map((w) => `<span>${w}</span>`).join('')}</p>
    <a class="cue" href="#projects" aria-label="Scroll to projects"><span class="mouse"></span> Scroll</a>
  </section>`;
}

function projectsIntroHtml() {
  const slabs = [0.62, 0.8, 1]
    .map((s, i) => `<div class="pi-slab" style="transform:translate3d(${(i - 1) * 92}px, ${Math.abs(i - 1) * -34}px, ${i * 74}px) scale(${s})"><b></b><b></b></div>`)
    .join('');
  return `
  <section class="sec projects-intro" id="projects" data-sec="projects">
    <div class="pi-copy">
      <span class="slabel r-fade">${PROJECTS_INTRO.label}</span>
      ${lines(PROJECTS_INTRO.heading, 'h2')}
      <p class="body-text r-fade">${PROJECTS_INTRO.body}</p>
    </div>
    <div class="pi-stage" aria-hidden="true">
      <div class="pi-float">
        ${slabs}
        <div class="pi-mono"><b>${SITE.initials}</b><b></b></div>
        <div class="pi-pane pp1"><b></b>${'<i></i>'.repeat(5)}</div>
        <div class="pi-pane pp2"><b></b>${'<i></i>'.repeat(5)}</div>
        <div class="pi-pane pp3"><b></b>${'<i></i>'.repeat(4)}</div>
        <div class="pi-pane pp4"><b></b>${'<i></i>'.repeat(5)}</div>
      </div>
    </div>
  </section>`;
}

function featuredProjectHtml(p, total, index) {
  const links = [
    p.view ? `<a class="pill-btn" href="${p.view}" target="_blank" rel="noopener">View Project ${arrow}</a>` : '',
    p.source ? `<a class="text-cta" href="${p.source}" target="_blank" rel="noopener">${ghIcon} Source Code</a>` : '',
  ].join('');
  const number = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  return `
  <section class="sec featured" id="project-${p.id}" data-sec="featured" data-title="${p.title}">
    <div class="pj-copy">
      <p class="pj-count r-fade">${number}</p>
      ${lines([p.title], 'h2')}
      ${lines([p.subtitle], 'p', 'pj-sub')}
      <p class="body-text r-fade">${p.description}</p>
      <ul class="tags r-fade">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
      ${links ? `<div class="pj-actions r-fade">${links}</div>` : ''}
    </div>
    <div class="pj-stage" aria-hidden="true">
      <div class="pj-device"><div class="scr" data-screen>${p.image ? `<img class="pj-shot" src="${p.image}" alt="${p.title} preview" loading="lazy" decoding="async">` : viewMap()}</div></div>
    </div>
    ${p.image ? '' : `<div class="pj-thumbs" role="tablist" aria-label="${p.title} views">
      <button class="pj-thumb on" role="tab" aria-selected="true" data-view="map"><span class="scr">${viewMap()}</span></button>
      <button class="pj-thumb" role="tab" aria-selected="false" data-view="guide"><span class="scr">${viewGuide()}</span></button>
    </div>`}
  </section>`;
}

function experienceHtml() {
  return `
  <section class="sec exp" id="experience" data-sec="experience">
    <div class="exp-wrap">
      <span class="slabel r-fade">${EXPERIENCE.label}</span>
      ${lines([EXPERIENCE.heading], 'h2')}
      <div class="x-cards">
        ${EXPERIENCE.items
          .map(
            (e) => `<article class="x-card r-fade">
              <header><span class="x-logo">${e.abbr}</span><div><h3>${e.company}</h3><p>${e.role}</p></div><time>${e.dates}</time></header>
              <ul>${e.points.map((pt) => `<li>${pt}</li>`).join('')}</ul>
            </article>`
          )
          .join('')}
      </div>
      <div class="skills" id="skills">
        ${lines([SKILLS.heading], 'h3', 'h3')}
        <ul class="s-row r-fade">${SKILLS.items.map((t) => `<li>${icon(t) ? icon(t) : ''}<span>${t}</span></li>`).join('')}</ul>
        <p class="s-aside" aria-hidden="true">${SKILLS.aside.join('<br>')}</p>
      </div>
    </div>
  </section>`;
}

function connectHtml() {
  const dest = contactDestination();
  const actions = CONNECT.actions
    .map((a) => {
      if (a.kind === 'touch') return dest ? `<a class="pill-btn" href="${dest}">${a.label} ${arrow}</a>` : '';
      return SITE.contact.github ? `<a class="text-cta" href="${SITE.contact.github}" target="_blank" rel="noopener">${ghIcon} ${a.label}</a>` : '';
    })
    .filter(Boolean)
    .join('');
  return `
  <section class="sec connect" id="contact" data-sec="contact">
    <div class="c-beamfig" aria-hidden="true">${hiker('he')}</div>
    <div class="c-copy">
      <span class="slabel r-fade">${CONNECT.label}</span>
      ${lines(CONNECT.heading, 'h2')}
      <p class="body-text r-fade">${CONNECT.body}</p>
      ${actions ? `<div class="c-actions r-fade">${actions}</div>` : (ISSUES.push('connect-actions-hidden'), '')}
    </div>
    ${contactLinksHtml() ? `<nav class="c-links" aria-label="Contact">${contactLinksHtml()}</nav>` : ''}
    <div class="c-phone" aria-hidden="true">
      <div class="device-frame"><div class="notch"></div>
        <div class="c-mini"><span class="wa">${SITE.initials}</span><b>${ABOUT.heading}</b><u>${ABOUT.lead.join('<br>')}</u><em>Explore My World</em><div class="ring-o"></div></div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------ init -------------------------------- */
export function renderWorld() {
  const host = document.getElementById('app');
  if (!host) throw new Error('#app host missing');
  const PROJECT_TOTAL = PROJECTS.length;
  if (PROJECT_TOTAL === 0) ISSUES.push('no-projects');
  host.innerHTML = `
    <main class="world">
      ${heroHtml()}
      ${aboutHtml()}
      ${projectsIntroHtml()}
      ${PROJECTS.map((p, i) => featuredProjectHtml(p, PROJECT_TOTAL, i)).join('')}
      ${experienceHtml()}
      ${connectHtml()}
    </main>`;
  document.title = `${SITE.name} — ${SITE.role}`;
  document.body.classList.add('wbody');
  return { issues: ISSUES };
}

export function wireUI() {
  const head = document.getElementById('whead');
  const burger = document.getElementById('wburger');
  const menu = document.getElementById('wmenu');

  burger.addEventListener('click', () => {
    const open = head.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      head.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && head.classList.contains('open')) {
      head.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });

  // device view switching
  const screen = document.querySelector('[data-screen]');
  const thumbs = [...document.querySelectorAll('.pj-thumb')];
  thumbs.forEach((t) =>
    t.addEventListener('click', () => {
      const view = t.dataset.view === 'guide' ? viewGuide : viewMap;
      screen.innerHTML = view();
      thumbs.forEach((o) => {
        const on = o === t;
        o.classList.toggle('on', on);
        o.setAttribute('aria-selected', String(on));
      });
    })
  );

  // optional real portrait: drop a transparent PNG at public/assets/portrait.png
  const img = document.querySelector('[data-portrait]');
  const probe = new Image();
  probe.onload = () => {
    img.src = probe.src;
    img.hidden = false;
    img.closest('.a-sil').classList.add('has-photo');
  };
  probe.src = new URL('assets/portrait.png', document.baseURI).href;
}

export { ISSUES };
