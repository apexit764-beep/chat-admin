import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';

const r = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

const BUILD_ID = Date.now().toString();

function emitVersionFile(): Plugin {
  return {
    name: 'emit-version-file',
    apply: 'build',
    closeBundle() {
      writeFileSync(pathResolve('dist', 'version.txt'), BUILD_ID);
    },
  };
}

export default defineConfig({
  base: '/',
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
  plugins: [react(), emitVersionFile()],
  resolve: {
    alias: {
      '@': r('./src'),
      '@components': r('./src/components'),
      '@hooks': r('./src/hooks'),
      '@pages': r('./src/pages'),
      '@store': r('./src/store'),
      '@types': r('./src/types'),
      '@utils': r('./src/utils'),
      '@assets': r('./src/assets'),
      '@services': r('./src/services'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
