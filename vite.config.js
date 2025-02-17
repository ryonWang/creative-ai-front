import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const proxyTarget = mode === 'development' ? 'http://localhost:7100' : env.VITE_BASE_URL

  return {
    plugins: [
      uni(),
      AutoImport({
        imports: ['vue'],
      }),
    ],
    transpileDependencies: ['uview-plus'],
    server: {
      port: 5173,
      proxy: {
        '/module': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/captcha': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/v1': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
