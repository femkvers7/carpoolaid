<script setup lang="ts">
const props = defineProps<{
  label?: string;
  value?: boolean;
}>();

const emit = defineEmits(["change"]);

const checked = ref(props.value ?? false);

const onClick = () => {
  checked.value = !checked.value;
  emit("change", checked.value);
};

watch(
  () => props.value,
  (value) => {
    checked.value = value;
  },
);
</script>

<template>
  <label
    class="flex flex-col items-start cursor-pointer select-none text-dark subtle"
  >
    <p>{{ label }}</p>
    <div class="relative mt-4 mb-5">
      <input
        :checked="value"
        type="checkbox"
        class="sr-only"
        @input="onClick"
      />
      <div
        class="bar h-3 rounded-full shadow-inner bg-gray-3 w-8"
        :class="{ checked: value }"
      ></div>
      <div
        :class="{ 'translate-x-4 checked': value }"
        class="circle absolute left-0 transition bg-white rounded-full dot shadow-switch-1 -top-0.5 h-4 w-4"
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
