export const useIndexStore = defineStore("index", () => {
  const isLoading = ref(true);
  const showSidebar = ref(true);

  const showSavePopup = ref(false);

  return {
    isLoading,
    showSidebar,
    showSavePopup,
  };
});
