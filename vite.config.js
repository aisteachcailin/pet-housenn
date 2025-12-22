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
    
    htmlFiles['main'] = resolve(__dirname, 'src/js/main.js');
    
    return htmlFiles;
}

export default defineConfig(({ command }) => {
  return {
    base: command === 'serve' ? '/' : './',
    root: './',
    publicDir: 'public',
    
    build: {
      outDir: 'docs',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        input: getHtmlFiles()
      },
      copyPublicDir: true,
    },
    
    server: {
      port: 3000,
      open: true,
      middlewareMode: false,
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
  };
});