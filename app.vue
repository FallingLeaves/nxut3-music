<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "nuxt music",
  meta: [{ name: "description", content: "My amazing site." }],
  script: [{ innerHTML: "console.log('Hello world')" }],
})

const playerStore = usePlayerStore()
const p = new Player()
await p._init()
playerStore.setPlayer(p)
</script>
