export const useIndexStore = defineStore("index", () => {
  const isLoading = ref(false);
  const showSidebar = ref(true);

  const showSavePopup = ref(false);

  return {
    isLoading,
    showSidebar,
    showSavePopup,
  };
});
