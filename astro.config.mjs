import { defineConfig } from 'astro/config';

// https://turuyu.github.io/new-lazaro/ — GH Pages
export default defineConfig({
  site: 'https://turuyu.github.io',
  base: '/new-lazaro',
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  integrations: [],
  vite: {
    plugins: [],
  },
});
