import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/products': 'https://project-62f13b8e-684a-4407-bb9.uc.r.appspot.com/',
      '/categories': 'https://project-62f13b8e-684a-4407-bb9.uc.r.appspot.com/',
      '/orders': 'https://project-62f13b8e-684a-4407-bb9.uc.r.appspot.com/',
      '/uploads': 'https://project-62f13b8e-684a-4407-bb9.uc.r.appspot.com/',
    }
  }
})
