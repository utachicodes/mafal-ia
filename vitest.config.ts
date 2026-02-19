import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/lib/__tests__/setup.ts'],
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      // More specific aliases first so they win over the generic @/* catch-all
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/ai': path.resolve(__dirname, './src/ai'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/context': path.resolve(__dirname, './src/context'),
      '@/src': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, '.'),
    }
  }
})
