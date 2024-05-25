<script setup lang="ts">
import { useIndexStore } from "~/stores";
const indexStore = useIndexStore();
const { showSidebar, showSuggestions } = storeToRefs(indexStore);

const homeCsvStore = useHomeCsvStore();
const { showColumnPopup, showPreviewPopup } = storeToRefs(homeCsvStore);

const closePopups = () => {
  showColumnPopup.value = false;
  showPreviewPopup.value = false;
};
</script>

<template>
  <VFragment>
    <Transition name="slide-fade">
      <HomeSideBar v-if="showSidebar" class="sidebar mt-4" />
    </Transition>
    <Transition name="slide">
      <SuggestionsContainer
        v-if="showSuggestions"
        class="suggestions"
        :style="{
          left: showSidebar ? 'calc(400px + 2rem)' : '1rem',
        }"
      />
    </Transition>
    <Map class="map" />
    <ColumnPopup v-if="showColumnPopup" @close="closePopups" />
    <PreviewPopup v-if="showPreviewPopup" @close="closePopups" />
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

.suggestions {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  z-index: 2;
  transition: left 0.3s ease-out;
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
