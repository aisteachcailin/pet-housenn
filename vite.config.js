import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

function getHtmlFiles() {
    const htmlFiles = {};
    const files = fs.readdirSync(__dirname);
    
    files.forEach(file => {
        if (file.endsWith('.html')) {
            const name = file.replace('.html', '');
            htmlFiles[name] = resolve(__dirname, file);
        }
    });
    
    return htmlFiles;
}

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlFiles(),
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/scss/base/_variables.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});