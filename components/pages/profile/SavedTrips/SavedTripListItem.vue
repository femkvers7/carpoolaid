<script setup lang="ts">
const props = defineProps<{
  trip: Object;
}>();
</script>

<template>
  <li>
    <div class="flex gap-1">
      <p>{{ trip.name }}</p>
      <p>- {{ trip.destination }}</p>
    </div>
    <div class="flex flex-row gap-2">
      <Button variant="neutral">
        <Icon fill="var(--purple)" size="16px" name="trash" />
      </Button>
      <Button variant="neutral">
        <Icon fill="var(--purple)" size="16px" name="arrow-right"
      /></Button>
    </div>
  </li>
</template>

<style scoped lang="scss">
li {
  padding: 1rem 0;
  border-bottom: 1px solid var(--purple);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
}
</style>
