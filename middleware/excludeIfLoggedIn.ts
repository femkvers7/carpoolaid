export default defineNuxtRouteMiddleware((to, from) => {
  const isLoggedIn = useCookie("sb-access-token");

  if (isLoggedIn.value) {
    console.log("redirecting to /");
    navigateTo("/");
  }
});
