import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Base path para deploy (pode ser '/' para desenvolvimento local)
  base: './',
  
  // Configuração do servidor de desenvolvimento
  server: {
    port: 3000,
    open: true,
  },
  
  // Configuração de build
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
  },
  
  // Configuração de CSS
  css: {
    devSourcemap: true,
  },

  plugins: [
    tailwindcss()
  ],
  
  // Configuração de tipos de arquivos
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
  
  // Configuração de resolução de módulos
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})