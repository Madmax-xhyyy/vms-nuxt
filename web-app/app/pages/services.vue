<template>
<v-container class="py-16">
<h1 class="text-h4 font-weight-bold mb-8 text-center">Services at {{ systemInfo?.clinicName }}</h1>
<v-row>
<v-col cols="12" sm="6" md="4" v-for="service in services" :key="service.title">
<v-card class="pa-6 h-100">
<v-icon size="40" color="primary" class="mb-3">{{ service.icon }}</v-icon>
<h3 class="text-h6 font-weight-bold mb-2">{{ service.title }}</h3>
<p class="text-body-2">{{ service.desc }}</p>
</v-card>
</v-col>
</v-row>
</v-container>
</template>


<script setup>
const services = [
{ title: 'General Checkups', desc: 'Routine exams and diagnostics.', icon: 'mdi-stethoscope' },
{ title: 'Surgery', desc: 'Safe surgical procedures.', icon: 'mdi-scalpel' },
{ title: 'Dental Care', desc: 'Oral health and cleaning.', icon: 'mdi-tooth' },
]
definePageMeta({
  layout: 'public',
})

const { systemInfo, getData } = useSystemInfo();

onMounted(async () => {
    await getData();
});
</script>