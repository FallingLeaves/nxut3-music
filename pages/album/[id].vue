<template>
  <div class="album-page">
    <div class="playlist-info" v-if="album">
      <Cover
        :id="album.id"
        :image-url="album.picUrl"
        :show-play-button="true"
        :always-show-shadow="true"
        :click-cover-to-play="true"
        :fixed-size="288"
        type="album"
        :cover-hover="false"
        :play-button-size="18"
      />
      <div class="info">
        <div class="title">{{ title }}</div>
        <div v-if="subtitle !== ''" class="subtitle">{{ subtitle }}</div>
        <div class="artist">
          <span v-if="album.artist.id !== 104700">
            <span>{{ album.type }} by </span>
            <NuxtLink :to="`/artist/${album.artist.id}`">
              {{ album.artist.name }}
            </NuxtLink>
          </span>
          <span v-else>Compilation by Various Artists</span>
        </div>
        <div class="date-and-count">
          <span v-if="album.mark === 1056768" class="explicit-symbol">
            <ExplicitSymbol />
          </span>
          <span :title="formatDate(album.publishTime)">
            {{ new Date(album.publishTime).getFullYear() }}
          </span>
          <span> · {{ album.size }} 首歌</span>,
          {{ formatTime(albumTime, "Human") }}
        </div>
        <div class="description">
          {{ album.description }}
        </div>
        <div class="buttons" style="margin-top: 32px">
          <ButtonTwoTone icon-class="play"> 播放 </ButtonTwoTone>
          <ButtonTwoTone
            :icon-class="dynamicDetail?.isSub ? 'heart-solid' : 'heart'"
            :icon-button="true"
            :horizontal-padding="0"
            :color="dynamicDetail?.isSub ? 'blue' : 'grey'"
            :text-color="dynamicDetail?.isSub ? '#335eea' : ''"
            :background-color="
              dynamicDetail?.isSub ? 'var(--color-secondary-bg)' : ''
            "
          >
          </ButtonTwoTone>
          <ButtonTwoTone
            icon-class="more"
            :icon-button="true"
            :horizontal-padding="0"
            color="grey"
          >
          </ButtonTwoTone>
        </div>
      </div>
    </div>
    <div v-if="tracksByDisc.length > 1">
      <div v-for="item in tracksByDisc" :key="item.disc">
        <h2 class="disc">Disc {{ item.disc }}</h2>
        <TrackList
          :id="album?.id"
          :tracks="item.tracks"
          :type="'album'"
          :album-object="album"
        />
      </div>
    </div>
    <div v-else>
      <TrackList
        :id="album?.id"
        :tracks="tracks"
        :type="'album'"
        :album-object="album"
      />
    </div>
    <div class="extra-info">
      <div class="album-time"></div>
      <div class="release-date">
        发行与
        {{ formatDate(album?.publishTime!, "MMMM D, YYYY") }}
      </div>
      <div v-if="album?.company" class="copyright">© {{ album.company }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAlbumDetail, getDynamicAlbum } from "~/api/album"
import type { Track } from "~/api/playList"
import { getTrackDetail } from "~/api/track"

const route = useRoute()
const {
  params: { id },
} = route

const getData = (id: string) => {
  return useAsyncData(
    id + "Detail",
    () => {
      return getAlbumDetail(id)
    },
    { server: false }
  )
}

const { data } = await getData(id as string)

const tracks = ref<Track[]>([])

const tracksByDisc = computed(() => {
  if (tracks.value.length <= 1) {
    return []
  }
  const pairs = useToPairs(useGroupBy(tracks.value, "cd"))
  return useSortBy(pairs, (p) => p[0]).map((items) => {
    return {
      disc: items[0],
      tracks: items[1],
    }
  })
})

watch(
  () => data.value,
  (res) => {
    if (res?.songs) {
      const trackIds = res.songs.map((v) => v.id)
      getTrackDetail(trackIds?.join(",")).then((data) => {
        tracks.value = data.songs
      })
    }
  },
  { immediate: true }
)

const album = computed(() => {
  return data.value?.album
})

const { data: dynamicDetail } = await getDynamicAlbum(id + "", {
  key: id + "DynamicAlbum",
})

const titleHandle = (title: string) => {
  const splitTitle = splitSoundtrackAlbumTitle(title)
  const splitTitle2 = splitAlbumTitle(splitTitle.title)
  return {
    splitTitle,
    splitTitle2,
  }
}

const title = computed(() => {
  const { name } = album.value!
  const { splitTitle2 } = titleHandle(name)
  return splitTitle2.title
})

const subtitle = computed(() => {
  const { name } = album.value!
  const { splitTitle, splitTitle2 } = titleHandle(name)
  if (splitTitle.subtitle !== "" && splitTitle2.subtitle !== "") {
    return splitTitle.subtitle + " · " + splitTitle2.subtitle
  }
  return splitTitle.subtitle === "" ? splitTitle2.subtitle : splitTitle.subtitle
})

const albumTime = computed(() => {
  let time = 0
  tracks.value.forEach((item) => {
    time += item.dt
  })
  return time
})
</script>

<style lang="scss" scoped>
.album-page {
  margin-top: 32px;
}
.playlist-info {
  display: flex;
  align-items: center;
  width: 78vw;
  margin-bottom: 72px;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    color: var(--color-text);
    .title {
      font-size: 56px;
      font-weight: 700;
    }
    .subtitle {
      font-size: 22px;
      font-weight: 600;
    }
    .artist {
      font-size: 18px;
      opacity: 0.88;
      margin-top: 24px;
      a {
        font-weight: 600;
      }
    }
    .date-and-count {
      font-size: 14px;
      opacity: 0.68;
      margin-top: 2px;
    }
    .description {
      user-select: none;
      font-size: 14px;
      opacity: 0.68;
      margin-top: 24px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;
      white-space: pre-line;
      &:hover {
        transition: opacity 0.3s;
        opacity: 0.88;
      }
    }
    .buttons {
      margin-top: 32px;
      display: flex;
      button {
        margin-right: 16px;
      }
    }
  }
}
.disc {
  color: var(--color-text);
}

.explicit-symbol {
  opacity: 0.28;
  color: var(--color-text);
  margin-right: 4px;
  .svg-icon {
    margin-bottom: -3px;
  }
}

.extra-info {
  margin-top: 36px;
  margin-bottom: 36px;
  font-size: 12px;
  opacity: 0.48;
  color: var(--color-text);
  div {
    margin-bottom: 4px;
  }
  .album-time {
    opacity: 0.68;
  }
}

.more-by {
  border-top: 1px solid rgba(128, 128, 128, 0.18);

  padding-top: 22px;
  .section-title {
    font-size: 22px;
    font-weight: 600;
    opacity: 0.88;
    color: var(--color-text);
    margin-bottom: 20px;
  }
}
.description-fulltext {
  font-size: 16px;
  margin-top: 24px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}
</style>
