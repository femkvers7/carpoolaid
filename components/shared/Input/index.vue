<script setup lang="ts">
const props = defineProps<{
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  width?: string;
  value?: string | number;
  disabled?: boolean;
  min?: number;
  id?: string;
}>();
</script>

<template>
  <div
    class="flex flex-col gap-2 font-sm"
    :style="{ 'max-width': width ?? '100%' }"
  >
    <label v-if="label" :for="name" class="label subtle">
      {{ label }}
    </label>
    <input
      :type="type ?? 'text'"
      :name="name"
      :placeholder="placeholder"
      :value="value"
      :disabled="disabled"
      :id="id"
      class="input w-full"
      :min="min"
      autocomplete="off"
    />
  </div>
</template>

<style>
.input {
  background-color: var(--beige);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
}

.input::placeholder {
  color: var(--lavender);
  font-style: italic;
}
</style>
