<script setup lang="ts">
const props = defineProps<{
  width?: string;
  height?: string;
  ratio?: string;
}>();
</script>

<template>
  <div class="popup">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.popup {
  background-color: var(--white);
  border-radius: 1rem;
}
</style>
