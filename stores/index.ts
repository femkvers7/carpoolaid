export const useIndexStore = defineStore("index", () => {
  const isLoading = ref(false);
  const showSidebar = ref(true);

  return {
    isLoading,
    showSidebar,
  };
});
