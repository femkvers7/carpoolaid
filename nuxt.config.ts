export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mapboxAccessToken:
        "pk.eyJ1IjoiZmVta2V2ZXJzd2V5dmVsZGFydGV2ZWxkZSIsImEiOiJjbHZleDJtMWcwY2cyMmtwNXExbnN5ejAwIn0.doUbEAUPIhi7_pHM5VD6Uw",
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  imports: {
    dirs: ["types/*.ts", "stores/*.ts", "types/**/*.ts", "stores/**/*.ts"],
  },
  css: ["@/assets/scss/index.scss"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
});
