import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    // Dengarkan di semua interface (localhost + jaringan LAN/Wi-Fi)
    // agar bisa diakses dari HP/Perangkat lain pada jaringan yang sama.
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
})

