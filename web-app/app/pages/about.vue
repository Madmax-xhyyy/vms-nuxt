<template>
  <v-container fluid class="py-12 px-4 px-md-12">
    
    <!-- Top Section -->
    <v-row align="center" class="mb-12">
      
      <!-- Image -->
      <v-col cols="12" md="6">
        <v-img
          src="/images/image2.jpg"
          rounded="xl"
          cover
          height="350"
        />
      </v-col>

      <!-- About Text -->
      <v-col cols="12" md="6">
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-4">
          About {{ systemInfo?.clinicName }}
        </h1>

        <p class="text-body-1 text-grey-darken-1 mb-4">
          {{ systemInfo?.description ||
          'Happy Paws Veterinary Clinic is committed to providing compassionate, high-quality, and modern veterinary care. Our licensed veterinarians and professional staff treat every pet like family, ensuring comfort, safety, and expert medical attention.' }}
        </p>

        <p class="text-body-2 text-grey">
          We offer preventive care, diagnostics, surgical services, and wellness programs designed to help pets live longer, healthier lives.
        </p>
      </v-col>
    </v-row>


    <!-- Mission & Vision Section -->
    <v-row class="mb-12">
      <v-col cols="12" md="6">
        <v-card class="pa-6 h-100" rounded="lg" elevation="2">
          <v-icon color="primary" size="32" class="mb-3">mdi-target</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Our Mission</h3>
          <p class="text-body-2 text-grey-darken-1">
            To deliver compassionate veterinary services with integrity,
            innovation, and excellence while strengthening the bond between
            pets and their owners.
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6 h-100" rounded="lg" elevation="2">
          <v-icon color="primary" size="32" class="mb-3">mdi-eye</v-icon>
          <h3 class="text-h6 font-weight-bold mb-2">Our Vision</h3>
          <p class="text-body-2 text-grey-darken-1">
            To be a trusted veterinary clinic known for outstanding animal
            healthcare, modern facilities, and compassionate service in our
            community.
          </p>
        </v-card>
      </v-col>
    </v-row>


    <!-- Why Choose Us -->
    <div class="text-center mb-8">
      <h2 class="text-h6 text-md-h5 font-weight-bold">
        Why Choose Us?
      </h2>
    </div>

    <v-row dense>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-6 text-center h-100" elevation="1" rounded="lg">
          <v-icon size="36" color="primary" class="mb-3">mdi-account-heart</v-icon>
          <div class="font-weight-bold mb-2">Experienced Veterinarians</div>
          <div class="text-body-2 text-grey">
            Skilled professionals dedicated to quality animal care.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-6 text-center h-100" elevation="1" rounded="lg">
          <v-icon size="36" color="primary" class="mb-3">mdi-hospital</v-icon>
          <div class="font-weight-bold mb-2">Modern Facilities</div>
          <div class="text-body-2 text-grey">
            Equipped with advanced diagnostic and surgical tools.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-6 text-center h-100" elevation="1" rounded="lg">
          <v-icon size="36" color="primary" class="mb-3">mdi-clock-outline</v-icon>
          <div class="font-weight-bold mb-2">Flexible Scheduling</div>
          <div class="text-body-2 text-grey">
            Convenient appointment options for pet owners.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-6 text-center h-100" elevation="1" rounded="lg">
          <v-icon size="36" color="primary" class="mb-3">mdi-shield-check</v-icon>
          <div class="font-weight-bold mb-2">Trusted & Reliable</div>
          <div class="text-body-2 text-grey">
            Providing dependable and ethical veterinary services.
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
definePageMeta({
  layout: 'public',
})

const { systemInfo, getData } = useSystemInfo()

onMounted(async () => {
  await getData()
})
</script>
