<template>
  <v-container class="py-16 border" style="max-width:800px">
    <h1 class="text-h4 font-weight-bold mb-6 text-center">Book an Appointment</h1>
    <v-form v-model="valid">
      <v-row gap="2">
        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.fullName"
          label="Owner Name" 
          variant="outlined"
          :rules="[requiredRule]"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.email"
          label="Email" 
          variant="outlined"
          :rules="[requiredRule]"
          />
        </v-col>
      </v-row>
      <v-row gap="2">
        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.phone"
          label="Phone" 
          variant="outlined"
          :rules="[requiredRule]"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.address"
          label="Address" 
          variant="outlined"
          :rules="[requiredRule]"
          />
        </v-col>
      </v-row>
      <v-row gap="2">
        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.petName"
          label="Pet Name" 
          variant="outlined"
          :rules="[requiredRule]"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select 
            v-model="formModel.petType"
            label="Pet Type" 
            variant="outlined"
            :rules="[requiredRule]"
            :items="petTypeKeys"
            @update:model-value="onPetTypeChange"
          />
        </v-col>
      </v-row>
      <v-row gap="2">
        <v-col cols="12" md="6">
          <v-select 
            v-model="formModel.petBreed"
            label="Pet Breed" 
            variant="outlined"
            :rules="[requiredRule]"
            :items="breedForSelectedType"
            :disabled="!formModel.petType"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.petAge"
          label="Pet Age" 
          variant="outlined"
          :rules="[requiredRule]"
          />
        </v-col>
      </v-row>
      <v-row gap="2">
        <v-col cols="12" >
          <v-select 
          v-model="formModel.services"
          label="Services" 
          variant="outlined"
          :rules="[requiredRule]" 
          :items="services"
          multiple
          />
        </v-col>
      </v-row>
      <v-row gap="2">
        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.date"
          label="Date" 
          variant="outlined"
          :rules="[requiredRule]"
          type="date"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field 
          v-model="formModel.time"
          label="Time" 
          variant="outlined"
          :rules="[requiredRule]"
          type="time"
          />
        </v-col>
      </v-row>
      
      
      <v-btn 
      color="primary" 
      block size="large" 
      class="mt-4" 
      :disabled="!valid"
      @click="submitAdd()"
      >
        Submit
      </v-btn>
    </v-form>
  </v-container>  
  <v-dialog v-model="showDialog" max-width="400">
  <v-card>
    <v-card-title>Appointment Submitted 🎉</v-card-title>
    <v-card-text>
      Please save this code:
      <div class="text-h5 font-weight-bold mt-2">
        {{ submittedCode }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="showDialog = false">
        OK
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

const { petTypeKeys, petBreeds, services } = useAppointment();


const formModel = defineModel("form", {
  type: Object as PropType<TAppointment>,
  default: () => useAppointment().appointment.value,
});


const breedForSelectedType = computed(() => {
  return petBreeds(formModel.value.petType);
});

const valid = ref(false);
const message = ref("");

function onPetTypeChange() {
  formModel.value.petBreed = "";
}

const requiredRule = (v : any) => !!v || 'Required.'

function resetForm() {
  formModel.value = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    petName: "",
    petType: null,
    petBreed: "",
    petAge: "",
    services: "",
    date: "",
    time: "",
  } as TAppointment;
}

interface AddAppointmentResponse {
  message: string
  code: string
}

const showDialog = ref(false)
const submittedCode = ref<string | null>(null)

async function submitAdd() {
  try {
    const res = await $fetch<AddAppointmentResponse>("/api/appointments", {
      method: "POST",
      body: {
        ...formModel.value,
      },
    });
    submittedCode.value = res.code;
    showDialog.value = true;  
    resetForm();
  } catch (error: any) {
    console.error("Error:", error);
    message.value =
      error.response._data.message ||
      "An error occurred while adding the appointment.";
  }
}
</script>