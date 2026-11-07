import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 900 },
  // Inline (empty) PostCSS config: without this, Vite walks up to the user
  // home directory's postcss.config.mjs (Tailwind) and fails to load it.
  css: { postcss: { plugins: [] } },
});
