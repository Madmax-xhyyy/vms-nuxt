<template>
  <v-container fluid class="fill-height d-flex align-center justify-center login-bg">
    <v-card class="pa-6 login-card" max-width="420" width="100%" elevation="12">
      <!-- Header -->
      <div class="text-center mb-6">
        <v-icon size="48" color="primary">mdi-lock-open-alert</v-icon>
        <h1 class="text-h5 font-weight-bold mt-2">Reset Password</h1>
        <p class="text-body-2 text-grey">
          Enter your new password below
        </p>
      </div>

      <!-- Form -->
      <v-form v-model="valid">
        <v-text-field
          v-model="newPassword"
          label="New Password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          density="comfortable"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          :rules="[requiredInput, minFourInput]"
          class="mb-3"
        />

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          prepend-inner-icon="mdi-lock-check"
          variant="outlined"
          density="comfortable"
          :type="showPassword ? 'text' : 'password'"
          :rules="[requiredInput, passwordsMatch]"
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
          :disabled="!valid || loading || !token"
          :loading="loading"
        >
          Reset Password
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

const route = useRoute();
const token = computed(() => route.query.token);

const newPassword = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const loading = ref(false);
const message = ref("");
const isError = ref(false);
const valid = ref(false);

function requiredInput(value) {
  return !!value || "This field is required";
}

function minFourInput(value) {
  return (value && value.length >= 4) || "Minimum 4 characters";
}

function passwordsMatch(value) {
  return value === newPassword.value || "Passwords do not match";
}

async function submit() {
  if (!token.value) {
    message.value = "Invalid or missing token";
    isError.value = true;
    return;
  }

  loading.value = true;
  message.value = "";
  try {
    const data = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: { 
        token: token.value,
        newPassword: newPassword.value 
      },
    });
    message.value = data.message;
    isError.value = false;
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigateTo({ name: 'admin-login' });
    }, 2000);
  } catch (error) {
    message.value = error?.response?._data?.message || "Something went wrong";
    isError.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (!token.value) {
    message.value = "Missing reset token in URL";
    isError.value = true;
  }
});
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
