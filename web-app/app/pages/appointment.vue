<template>
  <v-container class="py-16" style="max-width:800px">
    <AppointmentForm
      v-model="formModel"
      :loading="loading"
      :error-message="message"
      @submit:add="submitAdd"
      @success="handleSuccess"
    />
  </v-container>  

  <v-dialog v-model="showDialog" max-width="400">
    <v-card rounded="lg">
      <v-card-title class="text-center pa-6 pb-0">
        <v-icon color="success" size="64" class="mb-4">mdi-check-circle-outline</v-icon>
        <div class="text-h5 font-weight-bold">Appointment Submitted</div>
      </v-card-title>
      <v-card-text class="text-center pa-6 pt-0">
        <p class="text-body-1 mb-4 text-grey-darken-1">Please save this code to track your appointment:</p>
        <div class="text-h4 font-weight-bold text-primary mb-2">
          {{ submittedCode }}
        </div>
      </v-card-text>
      <v-card-actions class="pa-6 pt-0">
        <v-btn color="primary" block size="large" variant="flat" @click="showDialog = false">
          Got it
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

const { create, defaultAppointment } = useAppointment();

const formModel = ref(defaultAppointment());
const loading = ref(false);
const showDialog = ref(false);
const message = ref("");
const submittedCode = ref<string | null>(null);

async function submitAdd() {
  loading.value = true;
  message.value = "";
  try {
    const res = await create(formModel.value) as any;
    submittedCode.value = res.code;
    showDialog.value = true;
    formModel.value = defaultAppointment();
  } catch (error: any) {
    console.error("Error:", error);
    message.value =
      error.response?._data?.message ||
      "An error occurred while adding the appointment.";
  } finally {
    loading.value = false;
  }
}

function handleSuccess() {
  // This could be used for other success logic
}
</script>