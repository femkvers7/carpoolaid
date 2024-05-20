<script setup lang="ts">
import { useIndexStore } from "~/stores";
const indexStore = useIndexStore();
const { showSidebar } = storeToRefs(indexStore);
</script>

<template>
  <VFragment>
    <Transition name="slide-fade">
      <HomeSideBar v-if="showSidebar" class="sidebar mt-4" />
    </Transition>
    <Map class="map" />
  </VFragment>
</template>

<style scoped lang="scss">
.map {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.sidebar {
  position: relative;
  z-index: 2;
}

/** Toggle sidebar transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-500px);
  opacity: 0;
}
</style>
