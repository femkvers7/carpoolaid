export const useProfileStore = defineStore("profile", () => {
  const activeTab = ref<string>("profile");

  return {
    activeTab,
  };
});
