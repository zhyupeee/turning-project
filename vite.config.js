import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// 将配置改为函数形式，接收 ConfigEnv 参数
export default defineConfig(({ command, mode }) => {
  //获取各种环境下对应的变量
  let env = loadEnv(mode, process.cwd())
  // loadEnv 会根据 mode 加载对应的 .env 文件
  // 然后可以在配置中使用 env.VITE_APP_BASE_API 和 env.VITE_SERVE
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src")
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variable.scss" as *;`
        }
      }
    },
    //代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
  }
})

