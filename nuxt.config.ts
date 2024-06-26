import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import path from "path"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/global.scss", "normalize.css"],
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: [
          // 自动引入 `defineStore()`
          "defineStore",
        ],
      },
    ],
    "@nuxt/image",
  ],
  vite: {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "assets/icons")],
      }),
    ],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE, // 服务器地址
    },
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:4000", // 这里是接口地址
        changeOrigin: true,
        prependPath: true,
      },
    },
    // 该配置用于服务端请求转发
    // routeRules: {
    //   "/api/**": {
    //     proxy: "http://localhost:4000/**",
    //   },
    // },
  },
})
