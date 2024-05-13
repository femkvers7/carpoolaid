<script setup lang="ts">
const props = defineProps<{
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  width?: string;
  autocomplete?: string;
}>();

const handleInput = () => {};
</script>

<template>
  <div class="flex flex-col" :style="{ width: width ?? '100%' }">
    <label v-if="label" :for="name" class="label">
      {{ label }}
    </label>
    <input
      :type="type ?? 'text'"
      :name="name"
      :placeholder="placeholder"
      class="input"
      @input="handleInput"
    />
  </div>
</template>

<style>
.input {
  background-color: var(--beige);
  border-radius: 0.5rem;
  padding: 0.25rem;
  margin: 0.5rem 0;
}
</style>
