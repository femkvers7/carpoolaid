export const useIndexStore = defineStore("index", () => {
  const isLoading = ref(false);
  const showSuggestions = ref(false);
  const showSidebar = ref(true);

  return {
    isLoading,
    showSuggestions,
    showSidebar,
  };
});
