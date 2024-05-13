<script setup lang="ts">
import { useIndexStore } from "~/stores";
const indexStore = useIndexStore();

const { isLoading } = storeToRefs(indexStore);
</script>

<template>
  <VFragment>
    <NavBar />
    <main :class="{ loading: isLoading }">
      <slot />
    </main>
  </VFragment>
</template>
