export const useIndexStore = defineStore("index", () => {
  const isLoading = ref(false);

  return {
    isLoading,
  };
});
