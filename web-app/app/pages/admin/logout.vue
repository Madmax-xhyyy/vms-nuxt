<template>
  <v-row no-gutters class="fill-height" justify="center" align-content="center">
    <span
      >You had been logged out successfully.
      <nuxt-link :to="{ name: 'index' }">Go to Home?</nuxt-link></span
    >
  </v-row>
</template>
<script setup>
definePageMeta({
  layout: "plain",
});

const { cookieConfig } = useRuntimeConfig().public;
useCookie("sid", cookieConfig).value = null;
useCookie("user", cookieConfig).value = null;
</script>