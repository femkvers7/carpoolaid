<script setup lang="ts">
import { useIndexStore } from "~/stores";
const indexStore = useIndexStore();

const { isLoading, subtleLoading } = storeToRefs(indexStore);
</script>

<template>
  <VFragment :class="{ subtleLoading: true }">
    <Loader v-show="isLoading" />
    <NavBar />
    <main :class="{ subtleLoading }">
      <slot />
    </main>
  </VFragment>
</template>

<style scoped lang="scss">
.subtleLoading {
  cursor: wait;
}
</style>
