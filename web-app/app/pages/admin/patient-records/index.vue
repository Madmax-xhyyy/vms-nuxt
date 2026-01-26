<template>
    <v-container>
        <h1>Patient Records</h1>
    </v-container>
</template>

<script setup>
definePageMeta({ 
  middleware: "auth" ,
  layout: "admin"
})

</script>