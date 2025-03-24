// Purpose: Vite configuration file for the frontend.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tailwindConfig from './tailwind.config.js' // Import Tailwind config

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(tailwindConfig), react()],
})