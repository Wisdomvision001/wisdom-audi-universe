const year = new Date().getFullYear();
document.querySelector('#year').textContent = year;
document.querySelector('#footer-year').textContent = year;

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Subtle cursor light on pointer devices only.
const glow = document.querySelector('.cursor-glow');
if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
} else {
  glow.remove();
}

// Reveal sections as they enter the viewport; reduced-motion users see all content immediately.
const revealTargets = document.querySelectorAll('.section-index, .intro-heading, .intro-copy, .principles article, .projects-title, .project-card, .all-projects, .journey-intro, .timeline-item, .skills-block, .contact-inner > *');
revealTargets.forEach((element, index) => {
  element.classList.add('reveal');
  if (element.matches('.principles article')) element.style.transitionDelay = `${index % 3 * 90}ms`;
  if (element.matches('.project-card')) element.style.transitionDelay = `${index % 2 * 100}ms`;
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(element => observer.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add('is-visible'));
}

// Prevent fake contact details from being mistaken for a finished configuration.
const contactLinks = document.querySelectorAll('a[href="mailto:wisdom.audi@example.com"]');
contactLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    alert('Before publishing, replace wisdom.audi@example.com in index.html with your real contact email.');
  });
});
