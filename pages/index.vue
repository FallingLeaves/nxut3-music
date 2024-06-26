<script setup lang="ts">
import { getRecommendPlaylist } from "~/api/playList"

const { data: recommendPlaylist } = await getRecommendPlaylist({ limit: 10 })
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
