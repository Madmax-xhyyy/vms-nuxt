<template>
<v-container class="py-16">
<v-row align="center">
<v-col cols="12" md="6">
<v-img src="https://images.unsplash.com/photo-1580281657521-6f6b1a1f0b57" rounded />
</v-col>
<v-col cols="12" md="6">
<h1 class="text-h4 font-weight-bold mb-4">About {{ systemInfo?.clinicName }}</h1>
<p class="text-body-1">
{{ systemInfo?.description || 'Happy Paws Veterinary Clinic is committed to compassionate and modern animal care. Our licensed veterinarians and staff treat every pet like family.' }}
</p>
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