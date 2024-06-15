export default defineNuxtConfig({
  app: {
    head: {
      title: "CarpoolAid",
    },
  },
  runtimeConfig: {
    public: {
      MAPBOX_ACCESS_TOKEN: "",
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/supabase"],
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
  ssr: false,
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/auth/login",
      exclude: ["/auth/*", "/"], // pages that don't require authentication
      cookieRedirect: true,
      callback: "/",
    },
  },
});
