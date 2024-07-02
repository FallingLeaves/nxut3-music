interface Setting {
  enabledPlaylistCategories: string[]
  musicLanguage: string
  subTitleDefault: boolean
  cacheLimit: number | false
  [key: string]: any
}

interface Payload {
  key: keyof Setting
  value: any
}

const enabledPlaylistCategories = playlistCategories
  .filter((c) => c.enable)
  .map((c) => c.name)

export const useSettingStore = defineStore("setting", {
  state: (): Setting => ({
    enabledPlaylistCategories,
    musicLanguage: "all",
    subTitleDefault: false,
    cacheLimit: 8192,
  }),
  actions: {
    CHANGE_SETTING({ key, value }: Payload) {
      if (Reflect.has(this, key)) {
        this[key] = value
      }
    },
    changeSetting(data: Payload) {
      this.CHANGE_SETTING(data)
    },
  },
})
