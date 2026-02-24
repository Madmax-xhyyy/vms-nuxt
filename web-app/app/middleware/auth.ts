export default defineNuxtRouteMiddleware(async () => {
  // Ensure middleware runs only on the client side
  if (import.meta.server) return;

  const user = useCookie("user").value;

  if (!user) {
    // Redirect to login page if no access token
    return navigateTo({ name: "index" });
  }

});