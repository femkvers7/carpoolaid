<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});

const indexStore = useIndexStore();
const { isLoading } = storeToRefs(indexStore);
isLoading.value = false;
</script>

<template>
  <NuxtLayout name="auth">
    <div>
      <h1>{{ error?.statusCode }}</h1>
      <p>{{ error?.statusMessage }}</p>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
