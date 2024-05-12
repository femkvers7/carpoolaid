<script setup lang="ts">
const props = defineProps({
  disabled: Boolean,
});
defineEmits(["submit"]);
</script>

<template>
  <button :disabled @click.prevent="$emit('submit')">
    <slot> Submit</slot>
  </button>
</template>

<style scoped>
button {
  background-color: var(--teal-700);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  cursor: pointer;
  border-radius: 0.25rem;

  &:disabled {
    background-color: var(--neutral-600);
    cursor: not-allowed;
  }
}
</style>
