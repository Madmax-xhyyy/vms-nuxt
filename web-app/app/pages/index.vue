<template>
  <v-app>
    <v-main>
      <!-- Hero Section -->
      <v-container fluid min-height="80vh" class="py-16 bg-grey-lighten-4">
        <v-container >
          <v-row align="center" justify="center">
            <v-col cols="12" md="6" class="text-center text-md-left">
              <h1 class="text-h4 text-md-h3 font-weight-bold mb-4">
                {{ systemInfo?.tagline || 'Caring for Your Pets Like Family' }}
              </h1>
              <p class="text-body-1 mb-6">
                {{ systemInfo?.description || 'Professional veterinary care for dogs, cats, and all your beloved pets.' }}
              </p>
              <v-btn color="primary" to="/appointment" size="large" class="mr-2 mb-2 mb-md-0" nuxt>Book Now</v-btn>
              <v-btn color="primary" to="/about" variant="outlined" size="large" nuxt>Learn More</v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-img
                src="/images/image1.jpg"
                aspect-ratio="1.2"
                cover
                rounded
                max-height="400"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- Services Section -->
      <v-container class="py-16">
        <div class="text-center mb-10">
          <h2 class="text-h5 text-md-h4 font-weight-bold">Our Services</h2>
          <p class="text-body-2 text-grey">Everything your pet needs</p>
        </div>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="service in services" :key="service.title">
            <v-card elevation="3" class="pa-6 text-center h-100">
              <v-icon size="48" color="primary" class="mb-4">
                {{ service.icon }}
              </v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">{{ service.title }}</h3>
              <p class="text-body-2 text-grey">{{ service.desc }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- About Section -->
      <v-container fluid class="py-16 bg-grey-lighten-4">
        <v-container>
          <v-row align="center">
            <v-col cols="12" md="6" order="2" order-md="1">
              <v-img
                src="/images/image2.jpg"
                aspect-ratio="1.3"
                cover
                rounded
                max-height="400"
              />
            </v-col>
            <v-col cols="12" md="6" order="1" order-md="2" class="mb-6 mb-md-0">
              <h2 class="text-h5 text-md-h4 font-weight-bold mb-4">About {{ systemInfo?.clinicName }}</h2>
              <p class="text-body-1 mb-4">
                 {{ systemInfo?.description || 'Our experienced veterinarians provide compassionate and modern care for your pets.' }}
              </p>
              <v-btn color="primary" to="/about">Learn More</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- CTA -->
      <v-container class="py-16 text-center">
        <h2 class="text-h5 text-md-h4 font-weight-bold mb-4">Ready to Care for Your Pet?</h2>
        <p class="text-body-1 mb-6">Schedule an appointment today.</p>
        <v-btn color="primary" to="/appointment" size="large">Book an Appointment</v-btn>
      </v-container>

    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({
  layout: 'public',
})

const { systemInfo, getData } = useSystemInfo();

onMounted(async () => {
    await getData();
});

const services = [
  { title: 'Pet Checkups', desc: 'Routine health exams.', icon: 'mdi-stethoscope' },
  { title: 'Vaccinations', desc: 'Protection from diseases.', icon: 'mdi-pencil-plus-outline' },
  { title: 'Emergency Care', desc: 'Fast and reliable care.', icon: 'mdi-hospital-box' },
]
</script>

<style scoped>
.bg-grey-lighten-4 {
  background-color: #f5f5f5;
}
</style>