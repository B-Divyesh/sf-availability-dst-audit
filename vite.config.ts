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
        privacy: resolve(root, 'privacy/index.html'),
        terms: resolve(root, 'terms/index.html'),
      },
    },
  },
});
