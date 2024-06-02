<script setup lang="ts">
const props = defineProps<{
  name?: string;
  place?: string;
  carSeats?: number;
}>();
</script>

<template>
  <div>
    {{ name }}
    <span v-if="name"> - </span>
    <span class="italic">{{ place }}</span>
    <span class="seats" :class="{ noSeats: !carSeats }">
      - {{ carSeats ?? "0" }} x
      <Icon
        :fill="!!carSeats ? 'var(--green)' : 'var(--red)'"
        size="16px"
        width="25"
        height="16"
        name="seats"
        class="block"
    /></span>
  </div>
</template>

<style>
.noSeats {
  color: var(--red);
}
</style>
