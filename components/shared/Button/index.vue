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

<style lang="scss" scoped>
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.button--accent {
  color: var(--beige);
  background-color: var(--purple);
  &:hover {
    background-color: #6b5067;
  }
  &:active {
    background-color: #947790;
  }
}

.button--primary {
  color: var(--purple);
  background-color: var(--lavender);
  &:hover {
    background-color: #bda6d1;
  }
  &:active {
    background-color: #b99cd0;
  }
}

.button--secondary {
  color: var(--purple);
  background-color: var(--beige);
  &:hover {
    background-color: #f3e1d3;
  }
  &:active {
    background-color: #fae1ce;
  }
}

.button--tertiary {
  background-color: transparent;
  color: var(--red);
  text-decoration: underline;
  padding: 0;
  &:hover {
    color: #b63319;
  }
  &:active {
    color: #902c18;
  }
}

.button--neutral {
  background-color: transparent;
  color: var(--purple);
  padding: 0;
  border-radius: 0;
}
</style>
