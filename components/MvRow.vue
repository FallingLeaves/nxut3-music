<template>
  <div class="mv-row" :class="{ 'without-padding': withoutPadding }">
    <div v-for="mv in mvs" :key="getID(mv)" class="mv">
      <div
        class="cover"
        @mouseover="hoverVideoID = getID(mv)"
        @mouseleave="hoverVideoID = 0"
        @click="goToMv(getID(mv))"
      >
        <img :src="getUrl(mv)" loading="lazy" />
        <transition name="fade">
          <div
            v-show="hoverVideoID === getID(mv)"
            class="shadow"
            :style="{ background: 'url(' + getUrl(mv) + ')' }"
          ></div>
        </transition>
      </div>
      <div class="info">
        <div class="title">
          <router-link :to="'/mv/' + getID(mv)">{{ getTitle(mv) }}</router-link>
        </div>
        <div class="artist">
          <template v-if="subtitle === 'publishTime'">
            {{ mv.publishTime }}
          </template>
          <template v-else>
            <router-link :to="'/artist/' + getUser(mv).artistId">
              {{ getUser(mv).artistName }}
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MvItem } from "~/api/artist"

interface Props {
  mvs: MvItem[]
  subtitle?: string
  withoutPadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mvs: () => [],
  subtitle: "artist",
  withoutPadding: false,
})

const hoverVideoID = ref(-1)

const goToMv = (id: number) => {
  navigateTo({ path: `/mv/${id}` })
}

const getUrl = (mv: MvItem) => {
  let url = mv.imgurl16v9 ?? mv.cover ?? mv.coverUrl
  return url.replace(/^http:/, "https:") + "?param=464y260"
}

const getID = (mv: MvItem) => {
  return mv.id || mv.vid!
}

const getTitle = (mv: MvItem) => {
  return mv.name || mv.title
}

const getUser = (mv: MvItem) => {
  let artistName = ""
  let artistId = 0
  if (mv.artistName) {
    artistName = mv.artistName
    artistId = mv.artistId!
  } else if (mv.creator && mv.creator.length) {
    artistName = mv.creator[0].userName
    artistId = mv.creator[0].userId
  }
  return {
    artistName,
    artistId,
  }
}
</script>

<style lang="scss" scoped>
.mv-row {
  --col-num: 5;
  display: grid;
  grid-template-columns: repeat(var(--col-num), 1fr);
  gap: 36px 24px;
  padding: var(--main-content-padding);
}

.mv-row.without-padding {
  padding: 0;
}

@media (max-width: 900px) {
  .mv-row {
    --col-num: 4;
  }
}

@media (max-width: 800px) {
  .mv-row {
    --col-num: 3;
  }
}

@media (max-width: 700px) {
  .mv-row {
    --col-num: 2;
  }
}

@media (max-width: 550px) {
  .mv-row {
    --col-num: 1;
  }
}

.mv {
  color: var(--color-text);

  .title {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.88;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-break: break-all;
  }
  .artist {
    font-size: 12px;
    opacity: 0.68;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}

.cover {
  position: relative;
  transition: transform 0.3s;
  &:hover {
    cursor: pointer;
  }
}
img {
  border-radius: 0.75em;
  width: 100%;
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
</style>
