<script setup lang="ts">
const props = defineProps<{
  isChecked?: boolean;
  label?: string;
}>();

const isChecked = ref(props.isChecked ?? false);
</script>

<template>
  <label class="flex flex-col items-start cursor-pointer select-none text-dark">
    <p>{{ label }}</p>
    <div class="relative mt-4 mb-5">
      <input
        type="checkbox"
        class="sr-only"
        @click="() => (isChecked = !isChecked)"
      />
      <div
        class="bar h-3 rounded-full shadow-inner bg-gray-3 w-8"
        :class="{ checked: isChecked }"
      ></div>
      <div
        :class="{ 'translate-x-3 checked': isChecked }"
        class="circle absolute left-0 transition bg-white rounded-full dot shadow-switch-1 -top-1 h-5 w-5"
      ></div>
    </div>
  </label>
</template>

<style scoped lang="scss">
.bar {
  background-color: var(--beige);
  &.checked {
    background-color: var(--lavender);
  }
}

.circle {
  background-color: var(--purple);
}
</style>
