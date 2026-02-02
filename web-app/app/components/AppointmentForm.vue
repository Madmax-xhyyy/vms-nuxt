<template>
  <v-card width="100%" rounded="lg" elevation="1">
    <!-- Header -->
    <v-card-title class="text-center">
      <span class="text-h6 font-weight-bold">Book an Appointment</span>
    </v-card-title>

    <v-divider />

    <!-- Form -->
    <v-card-text style="max-height: 100vh; overflow-y: auto" class="mt-4">
      <v-form v-model="valid">
        <!-- Owner Info -->
        <v-row>
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

        <v-row>
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

        <!-- Pet Info -->
        <v-row>
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
              :items="petTypeKeys"
              :rules="[requiredRule]"
              @update:model-value="onPetTypeChange"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="formModel.petBreed"
              label="Pet Breed"
              variant="outlined"
              :items="breedForSelectedType"
              :rules="[requiredRule]"
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

        <!-- Services -->
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="formModel.services"
              label="Services"
              variant="outlined"
              multiple
              :items="services"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <!-- Schedule -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.date"
              label="Date"
              type="date"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.time"
              label="Time"
              type="time"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>
      </v-form>
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mt-4"
      >
        {{ errorMessage }}
      </v-alert>
    </v-card-text>

    <!-- Action -->
    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            tile
            block
            variant="text"
            class="text-none"
            size="48"
            @click="emit('cancel')"
          >
            Cancel
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            tile
            block
            variant="flat"
            color="primary"
            class="text-none"
            size="48"
            :loading="loading"
            :disabled="!valid || loading"
            @click="submitAdd"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">

const emit = defineEmits(["cancel", "success", "submit:add"]);

const { petTypeKeys, petBreeds, services, create } = useAppointment();


const formModel = defineModel("form", {
  type: Object as PropType<TAppointment>,
  default: () => useAppointment().appointment.value,
});

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
});


const breedForSelectedType = computed(() => {
  return petBreeds(formModel.value.petType as PetType);
});

const valid = ref(false);

function onPetTypeChange() {
  formModel.value.petBreed = "";
}

const requiredRule = (v: any) => {
  if (Array.isArray(v)) return v.length > 0 || "Required.";
  return !!v || "Required.";
};

async function submitAdd() {
  // If there's a listener for submit:add, we emit and let parent handle it
  // Otherwise we handle it internally
  emit("submit:add");
  
  // Checking if there are listeners is hard in script setup without 'attrs'
  // But usually, if we want it to be a standalone component, we can keep the internal fetch
  // but only if 'submit:add' isn't explicitly handled? 
  // Actually, I'll just change it to emit always and let the parent decide.
  // But for the public 'appointment.vue', it might want a standalone component.
  
  // To keep it simple: emit the event. If the parent doesn't handle it, 
  // we can have a fallback, but fallback logic can be messy.
  
  // Let's just make it emit and update the parents.
}
</script>
