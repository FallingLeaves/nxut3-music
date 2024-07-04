<template>
  <div class="fm" :style="{ background }" data-theme="dark" v-if="player">
    <NuxtImg :src="nextTrackCover" style="display: none" loading="lazy" />
    <NuxtImg class="cover" :src="track?.album.picUrl" loading="lazy" />
    <div class="right-part">
      <div class="info">
        <div class="title">{{ track?.name }}</div>
        <div class="artist"><ArtistsInline :artists="artists" /></div>
      </div>
      <div class="controls">
        <div class="buttons">
          <ButtonIcon title="不喜欢">
            <svg-icon id="thumbs-down" icon-class="thumbs-down" />
          </ButtonIcon>
          <ButtonIcon :title="isPlaying ? '暂停' : '播放'" class="play">
            <svg-icon :icon-class="isPlaying ? 'pause' : 'play'" />
          </ButtonIcon>
          <ButtonIcon title="下一首">
            <svg-icon icon-class="next" />
          </ButtonIcon>
        </div>
        <div class="card-name"><svg-icon icon-class="fm" />私人FM</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Color from "color"
const playerStore = usePlayerStore()

const player = computed(() => {
  return playerStore.player
})

const track = computed(() => {
  return playerStore.player?.personalFMTrack
})

const nextTrackCover = computed(() => {
  return `${playerStore.player?.personalFMNextTrack?.album.picUrl.replace(
    "http://",
    "https://"
  )}?param=512y512`
})

const isPlaying = computed(() => {
  return playerStore.player?.playing
})

const artists = computed(() => {
  return track.value?.artists || []
})

const background = ref("")

const getColor = async () => {
  if (!track.value?.album.picUrl) {
    return
  }
  const cover = `${track.value.album.picUrl.replace(
    "http://",
    "https://"
  )}?param=512y512`

  const palette = await $fetch(`/vibrant`, {
    params: { url: cover },
    method: "GET",
  })

  if (palette) {
    const color = Color.rgb(palette.Vibrant?.rgb!).darken(0.1).rgb().string()
    const color2 = Color.rgb(palette.Vibrant?.rgb!)
      .lighten(0.28)
      .rotate(-30)
      .rgb()
      .string()

    background.value = `linear-gradient(to top left, ${color}, ${color2})`
  }
}

watch(
  () => track.value,
  () => {
    getColor()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.fm {
  padding: 1rem;
  background: var(--color-secondary-bg);
  border-radius: 1rem;
  display: flex;
  height: 198px;
  box-sizing: border-box;
}
.cover {
  height: 100%;
  clip-path: border-box;
  border-radius: 0.75rem;
  margin-right: 1.2rem;
  cursor: pointer;
  user-select: none;
}
.right-part {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--color-text);
  width: 100%;
  .title {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }
  .artist {
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-left: -0.4rem;
    .buttons {
      display: flex;
    }
    .button-icon {
      margin: 0 8px 0 0;
    }
    .svg-icon {
      width: 24px;
      height: 24px;
    }
    .svg-icon#thumbs-down {
      width: 22px;
      height: 22px;
    }
    .card-name {
      font-size: 1rem;
      opacity: 0.18;
      display: flex;
      align-items: center;
      font-weight: 600;
      user-select: none;
      .svg-icon {
        width: 18px;
        height: 18px;
        margin-right: 6px;
      }
    }
  }
}
</style>
