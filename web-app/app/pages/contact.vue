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
              {{ systemInfo?.address || '123 Pet Care Street, City, Philippines' }}
            </p>

            <p class="mb-2">
              <v-icon color="primary" class="mr-2">mdi-phone</v-icon>
              {{ systemInfo?.phone || '+63 912 345 6789' }}
            </p>

            <p class="mb-2">
              <v-icon color="primary" class="mr-2">mdi-email</v-icon>
               {{ systemInfo?.email || 'happypaws@gmail.com' }}
            </p>

            <div class="d-flex align-start mt-4">
              <v-icon color="primary" class="mr-2 mt-1">mdi-clock</v-icon>
              <div>
                <div v-for="hours in systemInfo?.operatingHours" :key="hours.day" class="mb-1">
                   <strong>{{ hours.day }}:</strong> 
                   <span v-if="hours.isClosed" class="text-error ml-2">Closed</span>
                   <span v-else class="ml-2">{{ hours.open }} - {{ hours.close }}</span>
                </div>
              </div>
            </div>
        </v-card>
      </v-col>

      <!-- Contact Form -->
      <v-col cols="12" md="7">
        <v-card class="pa-6" color="primary">
          <h3 class="text-h6 font-weight-bold mb-4">
            Send Us a Message
          </h3>

          <v-form>
            <v-text-field  label="Full Name" required />
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

const { systemInfo, getData } = useSystemInfo();

onMounted(async () => {
    await getData();
});
</script>