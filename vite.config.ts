import { defineConfig } from 'vitest/config';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [{
    name: 'inject-service-worker-assets',
    closeBundle() {
      const outputDirectory = resolve(root, 'dist');
      const assets = readdirSync(resolve(outputDirectory, 'assets')).sort().map((file) => `/assets/${file}`);
      const serviceWorker = resolve(outputDirectory, 'sw.js');
      const source = readFileSync(serviceWorker, 'utf8');
      if (!source.includes('__BUILD_ASSETS__')) throw new Error('Service worker asset placeholder is missing.');
      writeFileSync(serviceWorker, source.replace('__BUILD_ASSETS__', JSON.stringify(assets)));
    },
  }],
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
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
