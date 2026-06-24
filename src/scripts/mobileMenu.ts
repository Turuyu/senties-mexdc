// mobileMenu.ts — mirrors script.js DOMContentLoaded mobile menu section
// + Escape key closes, link click closes, focus trap

export function initMobileMenu(): void {
  const toggle = document.querySelector<HTMLElement>('.mobile-toggle');
  const menu = document.getElementById('mobileMenu');

  if (!toggle || !menu) return;
  const t = toggle;
  const m = menu;

  function open(): void {
    m.classList.add('open');
    t.setAttribute('aria-expanded', 'true');
    animateBars(true);
  }

  function close(): void {
    m.classList.remove('open');
    t.setAttribute('aria-expanded', 'false');
    animateBars(false);
  }

  function animateBars(isOpen: boolean): void {
    const bars = t.querySelectorAll<HTMLElement>('span');
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

  t.addEventListener('click', () => {
    const isOpen = m.classList.contains('open');
    if (isOpen) {
      close();
    } else {
      open();
    }
  });

  // Link click closes menu
  m.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  // Escape key closes menu
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && m.classList.contains('open')) {
      close();
      t.focus();
    }
  });

  // Focus trap inside menu
  m.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusable = Array.from(
      m.querySelectorAll<HTMLElement>('a[href], button')
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
