<template>
  <v-card width="100%" rounded="lg" elevation="1">
    <!-- Header -->
    <v-card-title class="text-center bg-primary py-4" >
      <span class="text-h6 font-weight-bold">{{ localProps.title }}</span>
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
    
    </v-card-text>

    <!-- Action -->
    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6" v-if="localProps.mode !== 'submit-only'">
          <v-btn
            tile
            block
            variant="text"
            class="text-none"
            size="48"
            @click="emits('cancel')"
          >
            Cancel
          </v-btn>
        </v-col>

        <v-col :cols="localProps.mode !== 'submit-only' ? 6 : 12">
          <v-btn
            tile
            block
            variant="flat"
            color="primary"
            class="text-none"
            size="48"
            @click="emits('submit:add')"
            :disabled="!valid"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">

const localProps = defineProps({
  title: {
    type: String,
    default: "Book an Appointment",
  },
  mode: {
    type: String,
    default: "add",
  },
});

const emits = defineEmits(["cancel", "success", "submit:add", "submit-only"]);

const { petTypeKeys, petBreeds, services } = useAppointment();


const formModel = defineModel("form", {
  type: Object as PropType<TAppointment>,
  default: () => useAppointment().appointment,
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

</script>
