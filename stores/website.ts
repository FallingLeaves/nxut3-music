export const useWebsiteStore = defineStore("websiteStore", {
  state: () => ({
    name: "",
    description: "",
  }),
  actions: {
    async fetch() {
      const infos = (await $fetch("https://api.nuxt.com/modules/pinia")) as any

      this.name = infos.name
      this.description = infos.description
    },
  },
})
