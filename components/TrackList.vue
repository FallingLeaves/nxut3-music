<template>
  <div class="track-list">
    <div :style="listStyles">
      <TrackItem
        v-for="(track, index) in tracks"
        :key="itemKey === 'id' ? track.id : `${track.id}${index}`"
        :track-prop="track"
        :track-no="index + 1"
        :highlight-playing-track="highlightPlayingTrack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue"
import type { Track } from "~/api/playList"

interface AlbumObject {
  artist: {
    name: string
  }
}

interface Props {
  tracks: Track[]
  type: "tracklist" | "album" | "playlist" | "cloudDisk"
  id: number
  columnNumber?: number
  itemKey?: string
  highlightPlayingTrack?: boolean
  albumObject?: AlbumObject
}

const props = withDefaults(defineProps<Props>(), {
  tracks: () => [],
  type: "tracklist",
  id: 0,
  columnNumber: 4,
  itemKey: "id",
  highlightPlayingTrack: true,
  albumObject: () => {
    return {
      artist: { name: "" },
    }
  },
})

const listStyles = computed(() => {
  const styles: CSSProperties = {}
  if (props.type === "tracklist") {
    styles.display = "grid"
    styles.gap = "4px"
    styles.gridTemplateColumns = `repeat(${props.columnNumber}, 1fr)`
  }
  return styles
})

defineExpose({ ...props })
</script>

<style lang="scss" scoped></style>
