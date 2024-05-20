<script setup lang="ts">
const props = defineProps<{
  width?: string;
  height?: string;
  ratio?: string;
}>();
</script>

<template>
  <div
    class="popup"
    :style="{
      width: width ?? '100%',
      height: height ?? '100%',
    }"
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.popup {
  background-color: var(--white);
  padding: 1.25rem;
  border-radius: 1rem;
}
</style>
