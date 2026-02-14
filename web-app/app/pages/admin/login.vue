<template>
  <v-container fluid class="fill-height d-flex align-center justify-center login-bg">
    <v-card class="pa-6 login-card" max-width="420" width="100%" elevation="12">
      <!-- Header -->
      <div class="text-center mb-6">
        <v-icon size="48" color="primary">mdi-shield-account</v-icon>
        <h1 class="text-h5 font-weight-bold mt-2">Admin Login</h1>
        <p class="text-body-2 text-grey">
          Veterinary Management System
        </p>
      </div>

      <!-- Form -->
      <v-form>
        <v-text-field
          v-model="email"
          label="Email Address"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="comfortable"
          :rules="[requiredInput, isValidEmail]"
          class="mb-3"
        />

        <v-text-field
          v-model="password"
          label="Password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          density="comfortable"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          :rules="[requiredInput, minFourInput]"
        />

        <!-- Error Message -->
        <v-alert
          v-if="message"
          type="error"
          variant="tonal"
          class="mt-4"
          density="compact"
        >
          {{ message }}
        </v-alert>

        <!-- Button -->
        <v-btn
          color="primary"
          size="large"
          block
          class="mt-6"
          @click="login"
          :disabled="!email || !password"
        >
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "plain",
});

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const message = ref("");

function requiredInput(value) {
  return !!value || "This field is required";
}

function minFourInput(value) {
  return (value && value.length >= 4) || "Minimum 4 characters";
}

function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) || "Invalid email format";
}

async function login() {
  try {
    const { cookieConfig } = useRuntimeConfig().public;

    const data = await $fetch("/api/auth", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    useCookie("user", cookieConfig).value = data.user;

    await navigateTo({ name: "admin-dashboard" });
  } catch (error) {
    message.value =
      error?.response?._data?.message || "Login failed";
  }
}
</script>

<style scoped>
.login-bg {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/image4.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}
</style>
