export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mapboxAccessToken:
        "pk.eyJ1IjoiZmVta2V2ZXJzd2V5dmVsZCIsImEiOiJjbHVmZHM4bnQwcWw5MmpvYzR4ZjMxM3lwIn0.Gs7BU1vnqBy_0h02nnq7Zg",
    },
  },
  devtools: { enabled: true },
  modules: ["nuxt-mapbox", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  imports: {
    dirs: ["types/*.ts", "store/*.ts", "types/**/*.ts", "store/**/*.ts"],
  },
  mapbox: {
    accessToken:
      "pk.eyJ1IjoiZmVta2V2ZXJzd2V5dmVsZCIsImEiOiJjbHVmZHM4bnQwcWw5MmpvYzR4ZjMxM3lwIn0.Gs7BU1vnqBy_0h02nnq7Zg",
  },
  css: ["@/assets/scss/reset.scss", "@/assets/scss/main.scss"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  /*  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/scss/global.scss";'
        }
      }
    }
  }*/
});
