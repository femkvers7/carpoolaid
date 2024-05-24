<script setup lang="ts">
const profileStore = useProfileStore();
const { activeTab } = storeToRefs(profileStore);

const title = computed(() => {
  switch (activeTab.value) {
    case "saved-trips":
      return "Saved Trips";
    case "profile":
      return "Profile";
    case "settings":
      return "Settings";
    default:
      return "Profile";
  }
});
</script>

<template>
  <VFragment class="auth-page">
    <NavBar :show-hamburger="false" :show-profile="false" />
    <main>
      <ProfileSideBar />
      <Popup class="ml-4">
        <div class="p-4">
          <h2 class="mb-4">{{ title }}</h2>
          <slot />
        </div>
      </Popup>
    </main>
  </VFragment>
</template>

<style scoped lang="scss">
main {
  height: calc(100vh - 7.5rem);
  margin: 1rem 0;
  display: flex;
}
</style>
