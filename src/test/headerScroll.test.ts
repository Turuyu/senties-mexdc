// jsdom tests for src/scripts/headerScroll.ts
import { initHeaderScroll } from '../../src/scripts/headerScroll.ts';

describe('initHeaderScroll', () => {
  beforeEach(() => {
    document.body.innerHTML = `<header class="header"><button>Test</button></header>`;
    window.scrollY = 0;
  });

  it('does not add scrolled class when scrollY is 0', () => {
    window.scrollY = 0;
    initHeaderScroll();
    window.dispatchEvent(new Event('scroll'));
    const header = document.querySelector('.header')!;
    expect(header.classList.contains('scrolled')).toBe(false);
  });

  it('adds scrolled class when scrollY exceeds 20', () => {
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    initHeaderScroll();
    window.dispatchEvent(new Event('scroll'));
    const header = document.querySelector('.header')!;
    expect(header.classList.contains('scrolled')).toBe(true);
  });

  it('removes scrolled class when scrollY drops below 20', () => {
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    initHeaderScroll();
    window.dispatchEvent(new Event('scroll')); // adds scrolled
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.dispatchEvent(new Event('scroll')); // should remove
    const header = document.querySelector('.header')!;
    expect(header.classList.contains('scrolled')).toBe(false);
  });

  it('toggles scrolled class at exactly the 20px threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 20, writable: true });
    initHeaderScroll();
    window.dispatchEvent(new Event('scroll'));
    const header = document.querySelector('.header')!;
    // scrollY > 20, so 20 itself should NOT get scrolled
    expect(header.classList.contains('scrolled')).toBe(false);
  });

  it('adds scrolled class when scrollY is 21', () => {
    Object.defineProperty(window, 'scrollY', { value: 21, writable: true });
    initHeaderScroll();
    window.dispatchEvent(new Event('scroll'));
    const header = document.querySelector('.header')!;
    expect(header.classList.contains('scrolled')).toBe(true);
  });

  it('handles missing header element gracefully', () => {
    document.body.innerHTML = `<div>No header</div>`;
    expect(() => initHeaderScroll()).not.toThrow();
  });
});
