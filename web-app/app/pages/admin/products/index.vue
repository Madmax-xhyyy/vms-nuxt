<template>
    <v-container>
        <h1>Products</h1>
    </v-container>
</template>

<script setup>
definePageMeta({ 
  middleware: "auth" ,
  layout: "admin"
})

</script>