export const useIndexStore = defineStore("index", () => {
  const isLoading = ref(false);
  const showSuggestions = ref(false);

  return {
    isLoading,
    showSuggestions,
  };
});
