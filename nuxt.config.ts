export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mapboxAccessToken:
        "pk.eyJ1IjoiZmVta2V2ZXJzd2V5dmVsZCIsImEiOiJjbHZmbjBmdDIwbW0zMmpwNTB1c2JhcGlnIn0.9KUcnPP8agtNIdnrFH8lNw",
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
