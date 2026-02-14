<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar flat color="primary" dark height="64">
      <v-container class="d-flex align-center justify-space-between">
        <!-- Logo / Title -->
        <NuxtLink to="/" class="text-h6 font-weight-bold text-white text-decoration-none">
          Happy Paws Veterinary Clinic
        </NuxtLink>

        <!-- Desktop Menu -->
        <div class="d-none d-md-flex gap-2 align-center">
          <v-btn variant="text" to="/" nuxt>Home</v-btn>
          <v-btn variant="text" to="/services" nuxt>Services</v-btn>
          <v-btn variant="text" to="/about" nuxt>About</v-btn>
          <v-btn variant="text" to="/contact" nuxt>Contact</v-btn>

          <v-btn variant="outlined" color="white" to="/appointment" nuxt>
            Book Appointment
          </v-btn>

          <v-divider vertical class="mx-2" />

          <v-btn to="/admin/login" nuxt>
            <v-icon size="24" icon="mdi-account-circle-outline" />
          </v-btn>
        </div>

        <!-- Mobile Menu -->
        <v-menu class="d-md-none">
          <template #activator="{ props }">
            <v-btn class="d-md-none" icon="mdi-menu" v-bind="props" />
          </template>

          <v-list>
            <v-list-item to="/" nuxt title="Home" />
            <v-list-item to="/services" nuxt title="Services" />
            <v-list-item to="/about" nuxt title="About" />
            <v-list-item to="/contact" nuxt title="Contact Us" />
            <v-list-item to="/appointment" nuxt title="Book Appointment" />
            <v-divider />
            <v-list-item to="/admin/login" nuxt title="Admin Login" />
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <!-- Page Content -->
    <v-main>
      <slot />
    </v-main>

    <!-- Footer -->
    <v-footer color="primary" dark class="py-6">
      <v-container class="text-center">
        <p class="text-body-2 mb-0">
          © {{ new Date().getFullYear() }} Happy Paws Veterinary Clinic
        </p>
      </v-container>
    </v-footer>
  </v-app>
</template>
