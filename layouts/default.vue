<template>
  <div id="app" :class="{ 'user-select-none': userSelectNone }">
    <Navbar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const userSelectNone = ref(false)
</script>

<style lang="scss">
#app {
  transition: all 0.4s;
  padding: var(--header-height) 10vw var(--footer-height) 10vw;
}

main {
  overflow: auto;
  box-sizing: border-box;
  scrollbar-width: none; // firefox
}

@media (max-width: 1336px) {
  #app {
    padding: var(--header-height) 5vw var(--footer-height) 5vw;
  }
}

main::-webkit-scrollbar {
  width: 0px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
