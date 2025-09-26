import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://tailwindcss.com/docs/guides/vite
export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
