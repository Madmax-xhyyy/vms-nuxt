import { defineNuxtPlugin, useRuntimeConfig } from "#app";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;
  const { cookieConfig, API } = config;

  const api = $fetch.create({
    baseURL: API,
    credentials: "include",
    headers: {
      cookie: `domain=${cookieConfig.domain}; Max-Age=${cookieConfig.maxAge}; Secure=${cookieConfig.secure}`,
    },
  });

  return {
    provide: {
      api, // you can access it via useNuxtApp().$api
    },
  };
});
