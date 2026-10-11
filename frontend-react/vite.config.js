import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || process.env.VITE_API_URL

  if (command === 'build' && mode === 'production' && !apiUrl) {
    throw new Error('VITE_API_URL is required for production builds.')
  }

  return {
    plugins: [react()],
    base: process.env.GITHUB_PAGES === 'true' ? '/budget-planner/' : '/',
  }
})