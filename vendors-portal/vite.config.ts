import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const r = (p: string): string => fileURLToPath(new URL(p, import.meta.url));
const admin = (p: string): string => r(`../src/${p}`);

// The vendor portal is its own app (own subdomain) but reuses the admin's design system
export default defineConfig({
  root: r('.'),
  publicDir: r('../public'),
  plugins: [react()],
  resolve: {
    alias: {
      '@v': r('./src'),
      '@': admin(''),
      '@components': admin('components'),
      '@hooks': admin('hooks'),
      '@pages': admin('pages'),
      '@store': admin('store'),
      '@types': admin('types'),
      '@utils': admin('utils'),
      '@assets': admin('assets'),
      '@services': admin('services'),
    },
  },
  build: { outDir: r('./dist'), emptyOutDir: true },
  server: { port: 5174 },
});
