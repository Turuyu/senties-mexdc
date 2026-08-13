// script.js — Senties Chauvet vanilla JS
// Handles: theme toggle, mobile menu, header scroll, hero video, logo marquee

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initHeaderScroll();
  initHeroVideo();
  initLogoMarquee();
});

// ─── Theme ───────────────────────────────────────────────────────────────────

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-theme');
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    });
  }
}

// ─── Mobile Menu ─────────────────────────────────────────────────────────────

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.getElementById('mobileMenu');

  if (!toggle || !menu) return;

  function open() {
    menu.classList.add('open');
    // The burger sits on the hero video, so its bars are white by default.
    // Over the opened menu they need to flip to the canvas text colour.
    document.body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    animateBars(true);
  }

  function close() {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    animateBars(false);
  }

  function animateBars(isOpen) {
    const bars = toggle.querySelectorAll('span');
    if (isOpen) {
      bars[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    if (isOpen) close();
    else open();
  });

  // Link click closes menu
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      close();
      toggle.focus();
    }
  });

  // Focus trap inside menu
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = Array.from(
      menu.querySelectorAll('a[href], button')
    ).filter((el) => !el.hasAttribute('disabled'));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

// ─── Header Scroll ───────────────────────────────────────────────────────────

function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ─── Hero Video ──────────────────────────────────────────────────────────────

// The reel plays as ambient background: no controls, no sound. Browsers only
// permit unattended playback while muted, so muted is a requirement, not a
// preference. Playback pauses once the hero scrolls away to spare CPU.
function initHeroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }

  video.muted = true;
  // play() rejects when the browser refuses anyway (iOS Low Power Mode, data
  // saver). The poster frame stays visible as the fallback.
  video.play().catch(() => {});

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(video);
}

// ─── Logo Marquee ────────────────────────────────────────────────────────────

// The partners rail loops by translating each track exactly one track-width to
// the left, so the next copy lands where the previous one started. That only
// reads as continuous while the tracks together span more than the visible
// rail — hence cloning until they cover it twice, rather than assuming two
// copies is always enough. The markup carries a single track so a logo is only
// ever added in one place.
function initLogoMarquee() {
  const marquee = document.querySelector('[data-marquee]');
  if (!marquee) return;

  const track = marquee.querySelector('.logo-marquee-track');
  if (!track) return;

  // Motion here is ambient, not informative, so honouring the preference costs
  // the user nothing: the rail degrades to a scrollable row.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const trackWidth = track.scrollWidth;
  if (!trackWidth) return;

  const copies = Math.max(2, Math.ceil((marquee.offsetWidth * 2) / trackWidth));

  for (let i = 1; i < copies; i += 1) {
    const clone = track.cloneNode(true);
    // The clones are the same logos again — announcing them would make the
    // list read as though Senties had twice the partners it does.
    clone.setAttribute('aria-hidden', 'true');
    marquee.appendChild(clone);
  }

  marquee.classList.add('is-animated');
}
