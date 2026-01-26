<template>
<v-container class="py-16" style="max-width:600px">
<h1 class="text-h4 font-weight-bold mb-6 text-center">Book an Appointment</h1>
<v-form>
<v-text-field label="Owner Name" required />
<v-text-field label="Pet Name" required />
<v-select
label="Service"
:items="['Checkup', 'Vaccination', 'Emergency']"
required
/>
<v-text-field type="date" label="Preferred Date" required />
<v-btn color="primary" block size="large" class="mt-4">
Submit
</v-btn>
</v-form>
</v-container>
</template>

<script setup>
definePageMeta({
  layout: 'public',
})
</script>