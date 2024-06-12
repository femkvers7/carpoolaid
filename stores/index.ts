export const useIndexStore = defineStore("index", () => {
  const isLoading = ref(false);
  const subtleLoading = ref(false);

  const showSidebar = ref(true);
  const showSavePopup = ref(false);

  return {
    isLoading,
    subtleLoading,
    showSidebar,
    showSavePopup,
  };
});
