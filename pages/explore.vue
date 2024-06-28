<template>
  <div class="explore-page">
    <h1>发现</h1>
    <div class="buttons">
      <div
        class="button"
        v-for="(item, index) in enabledPlaylistCategories"
        :class="{ active: item === activeCategory && !showCatOptions }"
        :key="index"
        @click="goToCategory(item)"
      >
        {{ item }}
      </div>
      <div
        class="button more"
        :class="{ active: showCatOptions }"
        @click="showCatOptions = !showCatOptions"
      >
        <svg-icon icon-class="more"></svg-icon>
      </div>
    </div>

    <div v-show="showCatOptions" class="panel">
      <div v-for="bigCat in allBigCats" :key="bigCat" class="big-cat">
        <div class="name">{{ bigCat }}</div>
        <div class="cats">
          <div
            v-for="cat in getCatsByBigCat(bigCat)"
            :key="cat.name"
            class="cat"
            :class="{
              active: enabledPlaylistCategories.includes(cat.name),
            }"
          >
            <span>{{ cat.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="playlists">
      <ClientOnly>
        <CoverRow
          type="playlist"
          :items="playlist"
          :sub-text="subText"
          :show-play-button="true"
          :show-play-count="activeCategory !== '排行榜' ? true : false"
          :image-size="activeCategory !== '排行榜' ? 512 : 1024"
        />
      </ClientOnly>
    </div>

    <div
      v-show="['推荐歌单', '排行榜'].includes(activeCategory) === false"
      class="load-more"
    >
      <ButtonTwoTone
        v-show="showLoadMoreButton && hasMore"
        color="grey"
        :loading="loadingMore"
        @click="getData"
      >
        加载更多
      </ButtonTwoTone>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getHighQualityPlaylist,
  getRecommendPlaylist,
  getToplists,
  getTopPlaylist,
  PLAYLIST_URL,
  type HighQualityRes,
  type RecommendRes,
  type TopListRes,
  type TopPlayRes,
} from "~/api/playList"

const enabledPlaylistCategories = playlistCategories
  .filter((c) => c.enable)
  .map((c) => c.name)

const activeCategory = ref("全部")
const showCatOptions = ref(false)

const route = useRoute()

const {
  query: { category },
} = route

if (category?.toString()) {
  activeCategory.value = category?.toString()
}

const allBigCats = ["语种", "风格", "场景", "情感", "主题"]

const getCatsByBigCat = (name: string) => {
  return playlistCategories.filter((c) => c.bigCat === name)
}

const subText = computed(() => {
  if (activeCategory.value === "排行榜") return "updateFrequency"
  if (activeCategory.value === "推荐歌单") return "copywriter"
  return "none"
})

const playlist = ref<any[]>([])
const hasMore = ref(true)
const showLoadMoreButton = ref(false)
const loadingMore = ref(false)

const { $request } = useNuxtApp()

const getRecommendPlaylistHandle = async () => {
  const params = { limit: 100 }
  return (await $request(PLAYLIST_URL.recommend, {
    params,
  })) as ResData<"推荐歌单">
}

const getHighQualityPlaylistHandle = async () => {
  const len = playlist.value.length
  const before = len > 0 ? playlist.value[len - 1].updateTime : 0
  const params = { limit: 50, before }
  return (await $request(PLAYLIST_URL.highquality, {
    params,
  })) as ResData<"精品歌单">
}

const getToplistsHandle = async () => {
  return (await $request(PLAYLIST_URL.toplist)) as ResData<"排行榜">
}

const getTopPlaylistHandle = async () => {
  const params = {
    cat: activeCategory.value,
    offset: playlist.value.length,
  }
  return (await $request(PLAYLIST_URL.playlist, {
    params,
  })) as TopPlayRes
}

const getData = async () => {
  let fn
  loadingMore.value = true
  switch (activeCategory.value) {
    case "推荐歌单":
      fn = getRecommendPlaylistHandle
      break
    case "精品歌单":
      fn = getHighQualityPlaylistHandle
      break
    case "排行榜":
      fn = getToplistsHandle
      break
    default:
      fn = getTopPlaylistHandle
      break
  }

  const res = await fn()
  let list = []
  switch (activeCategory.value) {
    case "推荐歌单":
      list = (res as ResData<"推荐歌单">)?.result
      break
    case "精品歌单":
      list = (res as ResData<"精品歌单">)?.playlists
      hasMore.value = (res as ResData<"精品歌单">).more
      break
    case "排行榜":
      list = (res as ResData<"排行榜">)?.list
      break
    default:
      list = (res as ResData<"默认">)?.playlists
      hasMore.value = (res as ResData<"默认">)?.more
      break
  }
  loadingMore.value = false
  showLoadMoreButton.value = true
  playlist.value.push(...list)
}

getData()

type Categoary = "推荐歌单" | "精品歌单" | "排行榜"

type ResDataMap = {
  推荐歌单: RecommendRes
  精品歌单: HighQualityRes
  排行榜: TopListRes
}

type ResData<T> = T extends Categoary ? ResDataMap[T] : TopPlayRes

const goToCategory = async (category: string) => {
  navigateTo({
    path: "/explore",
    query: {
      category,
    },
  })
}

watch(
  () => route.query,
  (query) => {
    playlist.value = []
    hasMore.value = true
    showLoadMoreButton.value = false
    activeCategory.value = query.category?.toString() || ""
    getData()
  }
)
</script>

<style lang="scss" scoped>
h1 {
  color: var(--color-text);
  font-size: 56px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
}
.button {
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 10px 16px 6px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  border-radius: 10px;
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary);
  transition: 0.2s;

  &:hover {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }
}
.button.active {
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
}
.panel {
  margin-top: 10px;
  background: var(--color-secondary-bg);
  border-radius: 10px;
  padding: 8px;
  color: var(--color-text);

  .big-cat {
    display: flex;
    margin-bottom: 32px;
  }

  .name {
    font-size: 24px;
    font-weight: 700;
    opacity: 0.68;
    margin-left: 24px;
    min-width: 54px;
    height: 26px;
    margin-top: 8px;
  }
  .cats {
    margin-left: 24px;
    display: flex;
    flex-wrap: wrap;
  }
  .cat {
    user-select: none;
    margin: 4px 0px 0 0;
    display: flex;
    // justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    transition: 0.2s;
    min-width: 98px;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 6px 12px;
      height: 26px;
      border-radius: 10px;
      opacity: 0.88;
      &:hover {
        opacity: 1;
        background-color: var(--color-primary-bg);
        color: var(--color-primary);
      }
    }
  }
  .cat.active {
    color: var(--color-primary);
  }
}

.playlists {
  margin-top: 24px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.button.more {
  .svg-icon {
    height: 24px;
    width: 24px;
  }
}
</style>
