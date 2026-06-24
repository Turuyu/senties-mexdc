// jsdom tests for src/scripts/theme.ts
import { initTheme } from '../../src/scripts/theme.ts';
import userEvent from '@testing-library/user-event';

describe('initTheme', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('applies dark-theme when localStorage theme is "dark"', () => {
    localStorage.setItem('theme', 'dark');
    document.body.innerHTML = `<button id="themeToggle"><i class="fa-solid fa-moon"></i></button>`;
    initTheme();
    expect(document.body.classList.contains('dark-theme')).toBe(true);
  });

  it('does not apply dark-theme when localStorage theme is "light"', () => {
    localStorage.setItem('theme', 'light');
    document.body.innerHTML = `<button id="themeToggle"><i class="fa-solid fa-moon"></i></button>`;
    initTheme();
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  it('toggles theme on button click and persists choice to localStorage', async () => {
    localStorage.setItem('theme', '');
    document.body.innerHTML = `<button id="themeToggle"><i class="fa-solid fa-moon"></i></button>`;
    initTheme();
    const btn = document.getElementById('themeToggle')!;
    await userEvent.click(btn);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    await userEvent.click(btn);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('updates toggle icon to sun when dark mode is active', async () => {
    localStorage.setItem('theme', '');
    document.body.innerHTML = `<button id="themeToggle"><i class="fa-solid fa-moon"></i></button>`;
    initTheme();
    const btn = document.getElementById('themeToggle')!;
    await userEvent.click(btn);
    expect(btn.innerHTML).toContain('fa-sun');
  });

  it('updates toggle icon to moon when returning to light mode', async () => {
    localStorage.setItem('theme', '');
    document.body.innerHTML = `<button id="themeToggle"><i class="fa-solid fa-moon"></i></button>`;
    initTheme();
    const btn = document.getElementById('themeToggle')!;
    await userEvent.click(btn); // dark on
    await userEvent.click(btn); // light on
    expect(btn.innerHTML).toContain('fa-moon');
  });

  it('handles missing themeToggle element gracefully', () => {
    document.body.innerHTML = `<div>No button</div>`;
    expect(() => initTheme()).not.toThrow();
  });
});