import { defineConfig } from 'astro/config';

// https://senties-chauvet.com.mx/mexdc — static site
export default defineConfig({
  site: 'https://senties-chauvet.com.mx/',
  base: '/mexdc',
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
