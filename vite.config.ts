import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        demo: resolve(root, 'demo/index.html'),
        offline: resolve(root, 'offline.html'),
        notFound: resolve(root, '404.html'),
        privacy: resolve(root, 'privacy/index.html'),
        terms: resolve(root, 'terms/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
