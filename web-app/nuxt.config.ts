// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
  ],
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/png", href: "/logo.png" },
      ],
    },
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  routeRules: {
    "/api/**": { proxy: `${process.env.API}/api/**` },
  },

  runtimeConfig: {
    public: {
      API: process.env.API || "https://vms-nuxt.onrender.com",
      cookieConfig: {
        domain: (process.env.DOMAIN as string) ?? "vms-nuxt.onrender.com",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
});