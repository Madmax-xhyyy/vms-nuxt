<template>
  <v-container fluid class="fill-height d-flex align-center justify-center login-bg">
    <v-card class="pa-6 login-card" max-width="420" width="100%" elevation="12">
      <!-- Header -->
      <div class="text-center mb-6">
        <v-icon size="48" color="primary">mdi-lock-reset</v-icon>
        <h1 class="text-h5 font-weight-bold mt-2">Forgot Password</h1>
        <p class="text-body-2 text-grey">
          Enter your email to receive a reset link
        </p>
      </div>

      <!-- Form -->
      <v-form v-model="valid">
        <v-text-field
          v-model="email"
          label="Email Address"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          density="comfortable"
          :rules="[requiredInput, isValidEmail]"
          class="mb-3"
        />

        <!-- Success/Error Message -->
        <v-alert
          v-if="message"
          :type="isError ? 'error' : 'success'"
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
          @click="submit"
          :disabled="!valid || loading"
          :loading="loading"
        >
          Send Reset Link
        </v-btn>

        <v-btn
          variant="text"
          block
          class="mt-2 text-none"
          :to="{ name: 'admin-login' }"
        >
          Back to Login
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
const loading = ref(false);
const message = ref("");
const isError = ref(false);
const valid = ref(false);

function requiredInput(value) {
  return !!value || "This field is required";
}

function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) || "Invalid email format";
}

async function submit() {
  loading.value = true;
  message.value = "";
  try {
    const data = await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: { email: email.value },
    });
    message.value = data.message;
    isError.value = false;
  } catch (error) {
    message.value = error?.response?._data?.message || "Something went wrong";
    isError.value = true;
  } finally {
    loading.value = false;
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
