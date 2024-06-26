<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  iconClass: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: "",
})

const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})

const svgClass = computed(() => {
  return `svg-icon ${props.className}`.trim()
})
</script>

<style scoped>
.svg-icon {
  fill: currentColor;
}
</style>
