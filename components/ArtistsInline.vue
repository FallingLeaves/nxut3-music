<template>
  <span class="artist-in-line">
    {{ computedPrefix }}
    <span v-for="(ar, index) in filteredArtists" :key="index">
      <NuxtLink v-if="ar.id !== 0" :to="`/artist/${ar.id}`">
        {{ ar.name }}
      </NuxtLink>
      <span v-else>{{ ar.name }}</span>
      <span v-if="index !== filteredArtists.length - 1" class="separator">
        ,
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
interface Artist {
  id: number
  name: string
}

interface Props {
  artists: Artist[]
  exclude?: string
  prefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  artists: () => [],
  exclude: "",
  prefix: "",
})

const filteredArtists = computed(() => {
  return props.artists.filter((v) => v.name !== props.exclude)
})

const computedPrefix = computed(() => {
  if (filteredArtists.value.length !== 0) {
    return props.prefix
  }
  return ""
})
</script>

<style lang="scss" scoped>
.separator {
  /* make separator distinct enough in long list */
  margin-left: 1px;
  margin-right: 4px;
  position: relative;
  top: 0.5px;
}
</style>
