<script setup lang="ts">
import { useIndexStore } from "~/stores";
const indexStore = useIndexStore();

const { isLoading } = storeToRefs(indexStore);
</script>
<template>
  <VFragment class="auth-page">
    <Loader v-show="isLoading" />
    <NavBar :show-hamburger="false" :show-profile="false" />
    <main>
      <slot />
    </main>
  </VFragment>
</template>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 7.5rem);
}
</style>
