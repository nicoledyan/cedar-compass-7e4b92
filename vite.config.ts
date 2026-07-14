import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/cedar-compass-7e4b92/',
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: { name: 'Pocket Tools & Guides', short_name: 'Pocket Tools', description: 'Local-first personal tools and guides.', theme_color: '#66806a', background_color: '#f4f1ea', display: 'standalone', start_url: '/cedar-compass-7e4b92/#/', scope: '/cedar-compass-7e4b92/', icons: [{ src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }] },
    workbox: { globPatterns: ['**/*.{js,css,html,svg,png,ico}'], navigateFallback: 'index.html' }
  })]
});
