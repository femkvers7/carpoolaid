<script setup lang="ts">
const props = defineProps<{
  width?: string;
  height?: string;
}>();
</script>

<template>
  <aside
    :style="{
      width: width ?? '100%',
      height: height ?? '100%',
    }"
  >
    <slot />
  </aside>
</template>

<style>
aside {
  background-color: var(--white);
  margin-top: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
}
</style>
