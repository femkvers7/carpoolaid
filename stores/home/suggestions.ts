export const useHomeSuggestionsStore = defineStore("homeSuggestions", () => {
  const suggestions = ref<SuggestionGroup[]>([]);
  const hideSuggestions = ref(false);

  const reset = () => {
    suggestions.value = [];
  };

  return {
    suggestions,
    hideSuggestions,
    reset,
  };
});
