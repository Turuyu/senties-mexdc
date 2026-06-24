// jsdom tests for src/scripts/mobileMenu.ts
import { initMobileMenu } from '../../src/scripts/mobileMenu.ts';

describe('initMobileMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button class="mobile-toggle" aria-label="Menú" aria-expanded="false" aria-controls="mobileMenu">
        <span></span><span></span><span></span>
      </button>
      <div id="mobileMenu" class="mobile-menu">
        <a href="#servicios">Servicios</a>
        <a href="#niveles">Niveles</a>
        <button>Close</button>
      </div>
    `;
    initMobileMenu();
  });

  it('opens menu on button click and sets aria-expanded to true', () => {
    const toggle = document.querySelector<HTMLElement>('.mobile-toggle')!;
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('closes menu on second button click', () => {
    const toggle = document.querySelector<HTMLElement>('.mobile-toggle')!;
    toggle.click(); // open
    toggle.click(); // close
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes menu when Escape key is pressed', () => {
    const toggle = document.querySelector<HTMLElement>('.mobile-toggle')!;
    toggle.click(); // open
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes menu when a nav link is clicked', () => {
    const toggle = document.querySelector<HTMLElement>('.mobile-toggle')!;
    const link = document.querySelector<HTMLAnchorElement>('#mobileMenu a')!;
    toggle.click(); // open
    link.click(); // click link
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('handles missing toggle element gracefully', () => {
    document.body.innerHTML = `<div id="mobileMenu"></div>`;
    expect(() => initMobileMenu()).not.toThrow();
  });

  it('handles missing menu element gracefully', () => {
    document.body.innerHTML = `<button class="mobile-toggle"></button>`;
    expect(() => initMobileMenu()).not.toThrow();
  });
});
