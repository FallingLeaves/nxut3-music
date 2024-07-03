<template>
  <div class="mv-page">
    <div class="current-video">
      <div class="video">
        <video ref="videoPlayer" class="plyr"></video>
      </div>
      <div class="video-info">
        <div class="title">
          <NuxtLink :to="'/artist/' + mv?.data?.artistId">
            {{ mv?.data?.artistName }}
          </NuxtLink>
          -
          {{ mv?.data?.name }}
          <div class="buttons">
            <button-icon class="button">
              <svg-icon v-if="mv?.subed" icon-class="heart-solid"></svg-icon>
              <svg-icon v-else icon-class="heart"></svg-icon>
            </button-icon>
            <button-icon class="button">
              <svg-icon icon-class="more"></svg-icon>
            </button-icon>
          </div>
        </div>
        <div class="info">
          {{ mv?.data?.playCount }} Views ·
          {{ mv?.data?.publishTime }}
        </div>
      </div>
    </div>
    <div class="more-video">
      <div class="section-title">更多视频</div>
      <MvRow :mvs="simiMvs" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMvDetail, getMvUrl, getSimiMv } from "~/api/mv"
import "assets/css/plyr.css"
import Plyr from "plyr"

const videoPlayer = ref<HTMLVideoElement>()

const route = useRoute()
const {
  params: { id },
} = route

const { data: mv } = await getMvDetail(id + "")

let sourceData: Plyr.SourceInfo

watch(
  () => mv.value,
  async (res) => {
    if (res) {
      const requests = res.data.brs.map((br) => {
        return getMvUrl({ id: +id, r: br.br })
      })
      const results = await Promise.all(requests)
      const sources = results.map((result) => {
        return {
          src: result.data.value?.data?.url.replace(/^http:/, "https:"),
          type: "video/mp4",
          size: result.data.value?.data.r,
        }
      })
      sourceData = {
        type: "video",
        sources,
        title: res.data.name,
        poster: res.data.cover.replace(/^http:/, "https:"),
      }
      nextTick(() => {
        if (player.value) {
          player.value!.source = {
            type: "video",
            sources,
            title: res.data.name,
            poster: res.data.cover.replace(/^http:/, "https:"),
          }
        }
      })
    }
  },
  { immediate: true }
)

const player = ref<Plyr>()

onMounted(() => {
  const videoOptions: Plyr.Options = {
    settings: ["quality"],
    autoplay: false,
    quality: {
      default: 1080,
      options: [1080, 720, 480, 240],
    },
  }
  player.value = new Plyr(videoPlayer.value!, videoOptions)
  if (sourceData) {
    player.value.source = sourceData
  }
})

const { data: simiMvsRes } = await getSimiMv(+id)

const simiMvs = computed(() => {
  return simiMvsRes.value?.mvs || []
})
</script>

<style lang="scss" scoped>
.video {
  --plyr-color-main: #335eea;
  --plyr-control-radius: 8px;
}

.mv-page {
  width: 100%;
  margin-top: 32px;
}
.current-video {
  width: 100%;
}
.video {
  border-radius: 16px;
  background: transparent;
  overflow: hidden;
  max-height: 100vh;
}

.video-info {
  margin-top: 12px;
  color: var(--color-text);
  .title {
    font-size: 24px;
    font-weight: 600;
  }
  .artist {
    font-size: 14px;
    opacity: 0.88;
    margin-top: 2px;
    font-weight: 600;
  }
  .info {
    font-size: 12px;
    opacity: 0.68;
    margin-top: 12px;
  }
}

.more-video {
  margin-top: 48px;
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    opacity: 0.88;
    margin-bottom: 12px;
  }
}

.buttons {
  display: inline-block;
  .button {
    display: inline-block;
  }
  .svg-icon {
    height: 18px;
    width: 18px;
    color: var(--color-primary);
  }
}
</style>
