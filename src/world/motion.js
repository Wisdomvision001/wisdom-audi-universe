// Scroll-driven motion for the world experience.
// Each property has a single owner: GSAP ScrollTrigger owns world progress,
// reveals and navigation state, so scrolling backward naturally reverses.

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NAV_TARGETS = new Map();

function buildNavMap() {
  NAV_TARGETS.clear();
  document.querySelectorAll('.wmenu a[data-nav]').forEach((a) => {
    const list = NAV_TARGETS.get(a.dataset.nav) || [];
    list.push(a);
    NAV_TARGETS.set(a.dataset.nav, list);
  });
}

function setActiveNav(section) {
  NAV_TARGETS.forEach((links, nav) => {
    links.forEach((a) => a.classList.toggle('on', nav === section));
  });
}

export function initMotion({ reduced = false, onProgress, onPointer } = {}) {
  gsap.registerPlugin(ScrollTrigger);
  buildNavMap();

  const main = document.querySelector('main.world');
  const sections = [...main.querySelectorAll('.sec')];
  const triggers = [];

  /* ---- world camera progress: one trigger per section boundary ---- */
  if (onProgress) {
    sections.forEach((sec, i) => {
      const next = sections[i + 1];
      if (!next) return; // last section holds its end key
      triggers.push(
        ScrollTrigger.create({
          trigger: next,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => onProgress(i + self.progress),
        })
      );
    });
  }

  /* ---- reveals: masked lines and fades, reversible ---- */
  if (reduced) {
    main.querySelectorAll('.rline, .r-fade').forEach((el) => el.classList.add('on'));
  } else {
    main.querySelectorAll('.rline').forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => el.classList.add('on'),
          onLeaveBack: () => el.classList.remove('on'),
        })
      );
    });
    main.querySelectorAll('.r-fade').forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          onEnter: () => el.classList.add('on'),
          onLeaveBack: () => el.classList.remove('on'),
        })
      );
    });
  }

  /* ---- section identity -> nav state ---- */
  function setSection(secEl) {
    const id = secEl?.dataset.sec || 'home';
    document.body.dataset.section = id;
    setActiveNav(id === 'featured' ? 'projects' : id);
  }
  const toggleSection = (secEl) => (self) => self.isActive && setSection(secEl);
  sections.forEach((sec) => {
    triggers.push(
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: toggleSection(sec),
      })
    );
  });

  /* ---- header shade ---- */
  const head = document.getElementById('whead');
  const onScroll = () => head.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- pointer parallax: CSS vars for DOM, callback for the camera ---- */
  let pointerBound = false;
  const onMove = (e) => {
    if (!onPointer || pointerBound) return;
    pointerBound = true;
    setTimeout(() => (pointerBound = false), 32); // throttle to ~30 Hz
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    onPointer(x, y);
    if (!document.documentElement.hidden) {
      document.documentElement.style.setProperty('--mx', x.toFixed(3));
      document.documentElement.style.setProperty('--my', y.toFixed(3));
    }
  };
  if (onPointer) {
    window.addEventListener('pointermove', onMove);
  }
  document.documentElement.style.setProperty('--mx', '0');
  document.documentElement.style.setProperty('--my', '0');

  ScrollTrigger.refresh();

  return {
    refresh: () => ScrollTrigger.refresh(),
    dispose() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      triggers.forEach((t) => t.kill());
    },
  };
}
