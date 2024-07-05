import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
import path from "path"
import { execSync } from "child_process"

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
    "nuxt-lodash",
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
      prefix: process.env.NUXT_PUBLIC_PREFIX, // 前缀
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
  // hooks: {
  //   "build:before": () => {
  //     execSync("node server/generateImports.js", { stdio: "inherit" }) // 生成module下的index
  //   },
  // },
})
