<template>
  <div>
    <h1>
      <NuxtImg class="avatar" :src="artist.img1v1Url" loading="lazy" />
      {{ artist.name }}'s Music Videos
    </h1>
    <MvRow :mvs="mvs" subtitle="publishTime" />
    <div class="load-more">
      <ButtonTwoTone v-show="hasMore" color="grey" @click="loadMVs">
        加载更多
      </ButtonTwoTone>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getArtistMv, getArtists, type MvItem } from "~/api/artist"

const route = useRoute()
const {
  params: { id },
} = route

const { data } = await getArtists(id + "")

const artist = computed(() => {
  return data.value?.artist
})

const hasMore = ref(false)

const mvs = ref<MvItem[]>([])

const loadMVs = async () => {
  const params = {
    id: id + "",
    limit: 100,
    offset: mvs.value.length,
  }
  const { data } = await getArtistMv(params)
  watch(
    () => data.value,
    (res) => {
      if (res) {
        hasMore.value = res.hasMore
        mvs.value.push(...res.mvs)
      }
    },
    { immediate: true }
  )
}

loadMVs()
</script>

<style lang="scss" scoped>
h1 {
  font-size: 42px;
  color: var(--color-text);
  .avatar {
    height: 44px;
    margin-right: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.2);
  }
}
.load-more {
  display: flex;
  justify-content: center;
}
</style>
