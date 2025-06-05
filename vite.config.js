import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Root diatur ke direktori project (default)
  root: '.',
  // Direktori publik untuk aset statis
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    // Output direktori untuk build
    outDir: 'dist',
    // Kosongkan direktori output sebelum build
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
