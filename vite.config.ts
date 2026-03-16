import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png', 'robots.txt'],
      manifest: {
        name: 'DocuChain - Supply Chain Tracker',
        short_name: 'DocuChain',
        description: 'Secure Supply Chain Document Tracking System',
        theme_color: '#1E3A8A',
        background_color: '#F3F4F6',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png', // Ensure you have a logo.png in your 'public' folder
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});



