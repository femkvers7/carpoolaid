<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    variant: string;
    width?: string;
    type?: "button" | "submit" | "reset";
  }>(),
  { disabled: false, variant: "primary" },
);
</script>

<template>
  <button
    :disabled="disabled"
    :style="{
      width: width ?? 'fit-content',
    }"
    :class="`button button--${variant} flex items-center justify-center`"
    :type="type ?? 'button'"
  >
    <slot> Submit</slot>
  </button>
</template>

<style scoped>
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.button--accent {
  color: var(--beige);
  background-color: var(--purple);
}

.button--primary {
  color: var(--purple);
  background-color: var(--lavender);
}

.button--secondary {
  color: var(--purple);
  background-color: var(--beige);
}

.button--tertiary {
  background-color: transparent;
  color: var(--red);
  text-decoration: underline;
  padding: 0;
}

.button--neutral {
  background-color: transparent;
  color: var(--purple);
  padding: 0;
  border-radius: 0;
}
</style>
