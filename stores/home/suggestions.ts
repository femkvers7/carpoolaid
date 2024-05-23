export const useHomeSuggestionsStore = defineStore("homeSuggestions", () => {
  const suggestions = ref<Suggestion[]>([]);

  const reset = () => {
    suggestions.value = [];
  };

  return {
    suggestions,
    reset,
  };
});
