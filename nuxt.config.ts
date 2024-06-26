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
})
