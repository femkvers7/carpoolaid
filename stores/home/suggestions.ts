export const useHomeSuggestionsStore = defineStore("homeSuggestions", () => {
  const suggestions = ref<SuggestionGroup[]>([]);

  const reset = () => {
    suggestions.value = [];
  };

  return {
    suggestions,
    reset,
  };
});
