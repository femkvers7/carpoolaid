<script setup lang="ts">
import { useIndexStore } from "~/stores";
const indexStore = useIndexStore();

const { isLoading } = storeToRefs(indexStore);
</script>

<template>
  <VFragment>
    <Loader v-show="isLoading" />
    <NavBar />
    <main :class="{ loading: isLoading }">
      <slot />
    </main>
  </VFragment>
</template>

<style scoped lang="scss"></style>
