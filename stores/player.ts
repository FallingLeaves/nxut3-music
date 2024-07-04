import type player from "~/utils/Player"

interface State {
  player: player | null
}

export const usePlayerStore = defineStore("player", {
  state: (): State => {
    return {
      player: null,
    }
  },
  actions: {
    setPlayer(p: player) {
      this.player = p
    },
  },
})
