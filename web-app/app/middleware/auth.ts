export default defineNuxtRouteMiddleware(async () => {
  // Ensure middleware runs only on the client side
  if (import.meta.server) return;

  const sid = useCookie("sid").value;

  if (!sid) {
    // Redirect to login page if no access token
    return navigateTo({ name: "index" });
  }

});