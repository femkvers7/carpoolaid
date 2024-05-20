export default defineNuxtRouteMiddleware((to, from) => {
  console.log("excludeIfLoggedIn", to, from);
  const isLoggedIn = useCookie("sb-access-token");

  if (isLoggedIn.value) {
    console.log("redirecting to /");
    navigateTo("/");
  }
});
