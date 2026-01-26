<template>
  <v-container class="py-16">
    <h1 class="text-h4 font-weight-bold text-center mb-10">
      Contact Us
    </h1>

    <v-row>
      <!-- Contact Info -->
      <v-col cols="12" md="5">
        <v-card class="pa-6 mb-6">
          <h3 class="text-h6 font-weight-bold mb-4">Clinic Information</h3>

          <p class="mb-2">
            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
            123 Pet Care Street, City, Philippines
          </p>

          <p class="mb-2">
            <v-icon color="primary" class="mr-2">mdi-phone</v-icon>
            +63 912 345 6789
          </p>

          <p class="mb-2">
            <v-icon color="primary" class="mr-2">mdi-email</v-icon>
            happypaws@gmail.com
          </p>

          <p>
            <v-icon color="primary" class="mr-2">mdi-clock</v-icon>
            Mon – Sat: 8:00 AM – 6:00 PM
          </p>
        </v-card>
      </v-col>

      <!-- Contact Form -->
      <v-col cols="12" md="7">
        <v-card class="pa-6">
          <h3 class="text-h6 font-weight-bold mb-4">
            Send Us a Message
          </h3>

          <v-form>
            <v-text-field label="Full Name" required />
            <v-text-field label="Email" type="email" required />
            <v-text-field label="Phone Number" />
            <v-textarea label="Message" rows="4" required />

            <v-btn color="primary" size="large" block class="mt-4">
              Send Message
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: 'public',
})
</script>