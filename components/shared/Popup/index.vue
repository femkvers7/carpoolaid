<script setup lang="ts"></script>

<template>
  <div class="popup">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.popup {
  background-color: var(--white);
  border-radius: 1rem;
}
</style>
