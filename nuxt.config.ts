export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mapboxAccessToken:
        "pk.eyJ1IjoiZmVta2V2ZXJzd2V5dmVsZCIsImEiOiJjbHVmY2I5ejUxOG00MmtuejZyMzltM2llIn0.Uqgy0Ux2UntXke3LKRVZ6g",
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  imports: {
    dirs: ["types/*.ts", "store/*.ts", "types/**/*.ts", "store/**/*.ts"],
  },
  css: ["@/assets/scss/reset.scss", "@/assets/scss/main.scss"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
});
