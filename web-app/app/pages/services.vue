<template>
  <v-container min-height="80vh" class="mt-md-12 py-12 px-4 px-md-12">
    
    <!-- Responsive Title -->
    <div class="text-center mb-10">
      <h1 class="text-h6 text-sm-h5 text-md-h4 text-lg-h4 font-weight-bold">
        Services at {{ systemInfo?.clinicName }}
      </h1>
      <p class="text-body-2 text-grey mt-2">
        We provide quality veterinary care for your beloved pets.
      </p>
    </div>

    <v-row gap="6">
      <v-col
        v-for="service in services"
        :key="service.title"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="pa-6 d-flex flex-column align-center text-center h-100"
          elevation="2"
          rounded="lg"
        >
          <v-icon
            size="40"
            color="primary"
            class="mb-4"
          >
            {{ service.icon }}
          </v-icon>

          <h3 class="text-h6 font-weight-bold mb-2">
            {{ service.title }}
          </h3>

          <p class="text-body-2 text-grey-darken-1">
            {{ service.desc }}
          </p>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
const services = [
{ title: 'General Checkups', desc: 'Routine exams and diagnostics.', icon: 'mdi-stethoscope' },
{ title: 'Surgery', desc: 'Safe surgical procedures.', icon: 'mdi-heart-plus' },
{ title: 'Dental Care', desc: 'Oral health and cleaning.', icon: 'mdi-tooth' },
{ title: 'Vaccinations', desc: 'Core and non-core vaccines for disease prevention.', icon: 'mdi-needle' },
{ title: 'Laboratory Testing', desc: 'Blood tests and diagnostic screenings.', icon: 'mdi-test-tube' },
{ title: 'Grooming', desc: 'Bathing and nail trimming services.', icon: 'mdi-content-cut' },
{ title: 'Emergency Care', desc: 'Immediate care for urgent cases.', icon: 'mdi-hospital-box' },
{ title: 'Microchipping', desc: 'Permanent pet identification.', icon: 'mdi-chip' },
]

definePageMeta({
  layout: 'public',
})

const { systemInfo, getData } = useSystemInfo()

onMounted(async () => {
  await getData()
})
</script>
