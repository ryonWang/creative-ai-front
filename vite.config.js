import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    uni(),
	AutoImport({
	    // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
		imports: ['vue'],
	}),
  ],
  transpileDependencies: ['uview-plus'],
  server: {
    port: 5173,
    proxy: {
      '/module': {
        target: 'http://localhost:7100',
        changeOrigin: true,
        secure: false,
      },
      '/captcha': {
        target: 'http://localhost:7100',
        changeOrigin: true,
        secure: false,
      },
      '/v1': {
        target: 'http://localhost:7100',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:7100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
