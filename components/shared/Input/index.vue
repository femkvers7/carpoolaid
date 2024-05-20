<script setup lang="ts">
import { useField } from "vee-validate";
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

// validation
const { value, errorMessage, handleBlur, handleChange } = useField(
  () => props.name,
  undefined,
  {
    validateOnValueUpdate: false,
    initialValue: props.value,
  },
);

const validationListeners = {
  blur: (e: Event) => handleBlur(e, true),
  change: handleChange,
  input: (e: Event) => handleChange(e, !!errorMessage.value),
};
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
      :type="type ?? 'text'"
      :name="name"
      :placeholder="placeholder"
      :value="value"
      :disabled="disabled"
      class="input w-full"
      :min="min"
      autocomplete="off"
      v-on="validationListeners"
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
