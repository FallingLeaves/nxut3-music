<template>
  <div class="artist-page">
    <div class="artist-info" v-if="artist">
      <div class="head">
        <NuxtImg :src="artist.img1v1Url" class="img" loading="lazy" />
      </div>
      <div>
        <div class="name">{{ artist.name }}</div>
        <div class="artist">艺人</div>
        <div class="statistics">
          <a>{{ artist.musicSize }} 首歌</a>
          ·
          <a>{{ artist.albumSize }} 张专辑</a>
          ·
          <a>{{ artist.mvSize }} 个 MV</a>
        </div>
        <div class="description">
          {{ artist.briefDesc }}
        </div>
        <div class="buttons">
          <ButtonTwoTone icon-class="play"> 播放 </ButtonTwoTone>
          <ButtonTwoTone color="grey">
            <span v-if="artist.followed">正在关注</span>
            <span v-else>关注</span>
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
    <div v-if="latestRelease" class="latest-release">
      <div class="section-title">最新发布</div>
      <div class="release">
        <div class="container">
          <Cover
            :id="latestRelease.id"
            :image-url="latestRelease.picUrl"
            type="album"
            :fixed-size="128"
            :play-button-size="30"
          />
          <div class="info">
            <div class="name">
              <NuxtLink :to="`/album/${latestRelease.id}`">
                {{ latestRelease.name }}
              </NuxtLink>
            </div>
            <div class="date">
              {{ formatDate(latestRelease.publishTime) }}
            </div>
            <div class="type">
              {{ formatAlbumType(latestRelease.type, latestRelease) }} ·
              {{ latestRelease.size }} 首歌
            </div>
          </div>
        </div>
        <div v-if="latestMV && latestMV.id" class="container latest-mv">
          <div
            class="cover"
            @mouseover="mvHover = true"
            @mouseleave="mvHover = false"
          >
            <NuxtImg class="img" :src="latestMV.coverUrl" loading="lazy" />
            <transition name="fade">
              <div
                v-show="mvHover"
                class="shadow"
                :style="{
                  background: 'url(' + latestMV.coverUrl + ')',
                }"
              ></div>
            </transition>
          </div>
          <div class="info">
            <div class="name">
              <NuxtLink :to="'/mv/' + latestMV.id">
                {{ latestMV.name }}
              </NuxtLink>
            </div>
            <div class="date">
              {{ formatDate(latestMV.publishTime) }}
            </div>
            <div class="type">最新 MV</div>
          </div>
        </div>
      </div>
    </div>
    <div id="popularTracks" class="popular-tracks">
      <div class="section-title">热门歌曲</div>
      <TrackList
        :tracks="popularTracks.slice(0, showMorePopTracks ? 24 : 12)"
        :type="'tracklist'"
      />
      <div id="seeMore" class="show-more">
        <button @click="showMorePopTracks = !showMorePopTracks">
          <span v-show="!showMorePopTracks">显示更多</span>
          <span v-show="showMorePopTracks">收起</span>
        </button>
      </div>
    </div>
    <div v-if="albums.length !== 0" id="albums" class="albums">
      <div class="section-title">专辑</div>
      <CoverRow
        :type="'album'"
        :items="albums"
        :sub-text="'releaseYear'"
        :show-play-button="true"
      />
    </div>
    <div v-if="mvs.length !== 0" id="mvs" class="mvs">
      <div class="section-title">
        MVs
        <NuxtLink v-show="hasMoreMV" :to="`/artist/${artist.id}/mv`">
          查看全部
        </NuxtLink>
      </div>
      <MvRow :mvs="mvs" subtitle="publishTime" />
    </div>
    <div v-if="eps.length !== 0" class="eps">
      <div class="section-title">EP 和单曲</div>
      <CoverRow
        :type="'album'"
        :items="eps"
        :sub-text="'albumType+releaseYear'"
        :show-play-button="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getArtistAlbum, getArtistMv, getArtists } from "~/api/artist"

const route = useRoute()
const {
  params: { id },
} = route

const { data } = await getArtists(id + "")

const artist = computed(() => {
  return data.value?.artist
})

const popularTracks = computed(() => {
  return data.value?.hotSongs || []
})

const showMorePopTracks = ref(false)

const { data: artistAlbumRes } = await getArtistAlbum({
  id: id + "",
  limit: 200,
})

const albumsData = computed(() => {
  return artistAlbumRes.value?.hotAlbums || []
})

const eps = computed(() => {
  return albumsData.value.filter((a) =>
    ["EP/Single", "EP", "Single"].includes(a.type)
  )
})

const albums = computed(() => {
  return albumsData.value.filter(
    (a) => a.type === "专辑" || a.type === "精选集"
  )
})

const latestRelease = computed(() => {
  const hotAlbums = artistAlbumRes.value?.hotAlbums || []
  return hotAlbums.length ? hotAlbums[0] : null
})

const { data: mvRes } = await getArtistMv({ id: id + "" })

const mvs = computed(() => {
  return mvRes.value?.mvs || []
})

const hasMoreMV = computed(() => {
  return mvRes.value?.hasMore || false
})

const latestMV = computed(() => {
  if (mvs.value.length) {
    const mv = mvs.value[0]
    return {
      id: mv.id || mv.vid,
      name: mv.name || mv.title,
      coverUrl: `${mv.imgurl16v9 || mv.cover || mv.coverUrl}?param=464y260`,
      publishTime: mv.publishTime,
    }
  }
  return null
})

const mvHover = ref(false)
</script>

<style lang="scss" scoped>
.artist-page {
  margin-top: 32px;
}

.artist-info {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  color: var(--color-text);
  .img {
    height: 248px;
    width: 248px;
    border-radius: 50%;
    margin-right: 56px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 16px -8px;
  }
  .name {
    font-size: 56px;
    font-weight: 700;
  }

  .artist {
    font-size: 18px;
    opacity: 0.88;
    margin-top: 24px;
  }

  .statistics {
    font-size: 14px;
    opacity: 0.68;
    margin-top: 2px;
  }

  .buttons {
    margin-top: 26px;
    display: flex;
    .shuffle {
      padding: 8px 11px;
      .svg-icon {
        margin: 0;
      }
    }
  }

  .description {
    user-select: none;
    font-size: 14px;
    opacity: 0.68;
    margin-top: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    cursor: pointer;
    white-space: pre-line;
    &:hover {
      transition: opacity 0.3s;
      opacity: 0.88;
    }
  }
}

.section-title {
  font-weight: 600;
  font-size: 22px;
  opacity: 0.88;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-top: 46px;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

.latest-release {
  color: var(--color-text);
  .release {
    display: flex;
  }
  .container {
    display: flex;
    flex: 1;
    align-items: center;
    border-radius: 12px;
  }
  .img {
    height: 96px;
    border-radius: 8px;
  }
  .info {
    margin-left: 24px;
  }
  .name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .date {
    font-size: 14px;
    opacity: 0.78;
  }
  .type {
    margin-top: 2px;
    font-size: 12px;
    opacity: 0.68;
  }
}

.popular-tracks {
  .show-more {
    display: flex;

    button {
      padding: 4px 8px;
      margin-top: 8px;
      border-radius: 6px;
      font-size: 12px;
      opacity: 0.78;
      color: var(--color-secondary);
      font-weight: 600;
      &:hover {
        opacity: 1;
      }
    }
  }
}

.similar-artists {
  .section-title {
    margin-bottom: 24px;
  }
}

.latest-mv {
  .cover {
    position: relative;
    transition: transform 0.3s;
    &:hover {
      cursor: pointer;
    }
  }
  .img {
    border-radius: 0.75em;
    height: 128px;
    object-fit: cover;
    user-select: none;
  }

  .shadow {
    position: absolute;
    top: 6px;
    height: 100%;
    width: 100%;
    filter: blur(16px) opacity(0.4);
    transform: scale(0.9, 0.9);
    z-index: -1;
    background-size: cover;
    border-radius: 0.75em;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
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
