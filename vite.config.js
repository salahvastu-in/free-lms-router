import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/free-lms-router/',
  plugins: [react()],
})
