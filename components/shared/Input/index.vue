<script setup lang="ts">
defineProps<{
  name: string;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  disabled?: boolean;
  errorMessage?: string;
  min?: number;
  width?: string;
}>();

const model = defineModel();

defineEmits(["input", "blur", "change"]);

// const validationListeners = {
//   blur: (e: Event) => handleBlur(e, true),
//   change: handleChange,
//   input: (e: Event) => handleChange(e, !!errorMessage.value),
// };
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
      :id="id"
      v-model="model"
      :name="name"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      autocomplete="off"
      class="input w-full"
      @blur="$emit('blur', $event)"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
    />
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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

.error {
  color: var(--red);
  font-size: 0.85rem;
}
</style>
