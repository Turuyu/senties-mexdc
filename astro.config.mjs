import { defineConfig } from 'astro/config';

// https://turuyu.github.io/senties-mexdc/ — GH Pages
export default defineConfig({
  site: 'https://turuyu.github.io',
  base: '/senties-mexdc',
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
