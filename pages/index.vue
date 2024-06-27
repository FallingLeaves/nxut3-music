<script setup lang="ts">
import { getNewAlbums } from "~/api/album"
import { getToplistOfArtists } from "~/api/artist"
import { getRecommendPlaylist, getToplists } from "~/api/playList"

const { data: recommendPlaylist } = await getRecommendPlaylist({ limit: 10 })

// 偶现topArtistList数据为空
// const { data: topArtistList } = await useAsyncData(
//   "top-artist",
//   async () => {
//     const { data } = await getToplistOfArtists()
//     const list = data.value?.list?.artists || []

//     return list
//   },
//   {
//     transform(list) {
//       let indexs: number[] = []
//       while (indexs.length < 6) {
//         let tmp = ~~(Math.random() * 100)
//         if (!indexs.includes(tmp)) indexs.push(tmp)
//       }

//       return list.filter((l, index) => indexs.includes(index))
//     },
//   }
// )

const getRandomArtist = (list: any[]) => {
  let indexs: number[] = []
  while (indexs.length < 6) {
    let tmp = ~~(Math.random() * 100)
    if (!indexs.includes(tmp)) indexs.push(tmp)
  }
  return list.filter((l, index) => indexs.includes(index))
}

// TS transform类型报错
// const topArtistList = await getToplistOfArtists(null, {
//   transform(res) {
//     const {
//       list: { artists },
//     } = res
//     return getRandomArtist(artists)
//   },
// })

const { data: allArtistList } = await getToplistOfArtists()

const topArtistList = computed(() => {
  return getRandomArtist(allArtistList.value.list.artists)
})

const { data: albumNewestlist } = await getNewAlbums({ limit: 10, area: "ALL" })

const { data: allTopList } = await getToplists()

const top5List = computed(() => {
  return allTopList.value.list.slice(0, 5)
})
</script>

<template>
  <div class="home-view">
    <div class="index-row first-row">
      <div class="title">by Apple Music</div>
      <CoverRow
        :type="'playlist'"
        :items="byAppleMusic"
        sub-text="appleMusic"
        :image-size="1024"
      />
    </div>
    <div class="index-row">
      <div class="title">
        推荐歌单
        <NuxtLink to="/explore?category=推荐歌单">查看全部</NuxtLink>
      </div>
      <CoverRow
        :type="'playlist'"
        :items="recommendPlaylist?.result || []"
        sub-text="copywriter"
      />
    </div>
    <div class="index-row">
      <div class="title">推荐艺人</div>
      <!-- ClientOnly 随机值导致服务端和客户端topArtistList不一致 Hydration completed but contains mismatches -->
      <ClientOnly>
        <CoverRow
          type="artist"
          :column-number="6"
          :items="topArtistList || []"
        />
      </ClientOnly>
    </div>
    <div class="index-row">
      <div class="title">
        新专速递
        <NuxtLink to="/album/newest">查看全部</NuxtLink>
      </div>
      <CoverRow
        type="album"
        :items="albumNewestlist?.albums || []"
        sub-text="artist"
      />
    </div>
    <div class="index-row">
      <div class="title">
        排行榜
        <NuxtLink to="/explore?category=排行榜">查看全部</NuxtLink>
      </div>
      <CoverRow
        type="playlist"
        :items="top5List"
        sub-text="updateFrequency"
        :image-size="1024"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index-row {
  margin-top: 54px;
}
.index-row.first-row {
  margin-top: 32px;
}
.playlists {
  display: flex;
  flex-wrap: wrap;
  margin: {
    right: -12px;
    left: -12px;
  }
  .index-playlist {
    margin: 12px 12px 24px 12px;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.for-you-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 78px;
}
</style>
