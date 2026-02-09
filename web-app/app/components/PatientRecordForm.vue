<template>
  <v-card width="100%" elevation="0">
    <!-- Header -->
    <v-card-title class="text-center bg-primary py-4" >
      <span class="text-h6 font-weight-bold">{{ localProps.title }}</span>
    </v-card-title>

    <!-- Body -->
    <v-card-text style="max-height: 75vh; overflow-y: auto" class="pa-4">
      <v-form v-model="valid">

        <!-- OWNER INFORMATION -->
        <div class="border rounded pa-4 mb-4 bg-grey-lighten-5">
          <div class="text-caption text-uppercase font-weight-bold text-grey mb-3">
            Owner Information
          </div>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                label="Owner Name"
                v-model="formModel.ownerName"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Email"
                v-model="formModel.ownerEmail"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required, rules.email]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Phone"
                v-model="formModel.ownerPhone"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Address"
                v-model="formModel.ownerAddress"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
              />
            </v-col>
          </v-row>
        </div>

        <!-- PETS -->
        <div
          v-for="(pet, index) in formModel.pets"
          :key="index"
          class="border rounded pa-4 mb-4 bg-grey-lighten-5"
        >
          <v-row align="center" class="mb-2">
            <v-col>
              <div class="text-caption text-uppercase font-weight-bold text-grey">
                Pet Information
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn
                icon="mdi-delete"
                size="small"
                color="red"
                variant="text"
                @click="removePet(index)"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                label="Pet Name"
                v-model="pet.petName"
                variant="outlined"
                :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                label="Age"
                v-model="pet.petAge"
                variant="outlined"
                :rules="[rules.required]"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
              v-model="pet.petType"
              label="Pet Type"
              variant="outlined"
              :items="petTypeKeys"
              @update:model-value="onPetTypeChange(index)"
              :rules="[rules.required]"
            />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
              v-model="pet.petBreed"
              label="Pet Breed"
              variant="outlined"
              :items="petBreeds(pet.petType as any)"
              :disabled="!pet.petType"
              :rules="[rules.required]"
            />
            </v-col>
          </v-row>
        </div>

        <!-- ADD PET -->
        <v-btn
          prepend-icon="mdi-plus"
          variant="outlined"
          class="mb-4"
          @click="addPet"
        >
          Add Pet
        </v-btn>

      </v-form>
    </v-card-text>

    <v-divider />

    <!-- FOOTER -->
    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            block
            height="48"
            variant="text"
            class="text-none"
            @click="emits('cancel')"
          >
            Cancel
          </v-btn>
        </v-col>

        <v-col v-if="localProps.mode === 'edit'" cols="6">
          <v-btn
            tile
            block
            variant="flat"
            color="primary"
            class="text-none"
            height="48"
            @click="emits('submit:update')"
            :disabled="!valid"
          >
            Submit Update
          </v-btn>
        </v-col>

        <v-col v-if="localProps.mode === 'add'" cols="6">
          <v-btn
            tile
            block
            variant="flat"
            color="primary"
            class="text-none"
            height="48"
            @click="emits('submit:add')"
            :disabled="!valid"
          >
            Submit Add
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
    default: "Edit Patient Record",
  },
  mode: {
    type: String,
    default: "edit",
  },
});

const emits = defineEmits([
  "edit",
  "delete",
  "submit:update",
  "submit:add",
  "cancel",
]);


const valid = ref(false);

const rules = {
  required: (v: any) => !!v || "Required",
  email: (v: string) => /.+@.+\..+/.test(v) || "Invalid email",
};

const { petTypeKeys, petBreeds } = useAppointment();

function addPet() {
  formModel.value.pets.push({
    petName: "",
    petType: null,
    petBreed: "",
    petAge: "",
    history: [],
  });
}

function removePet(index: number) {
  formModel.value.pets.splice(index, 1);
}

function onPetTypeChange(index: number) {
  if (formModel.value.pets[index]) {
    formModel.value.pets[index].petBreed = "";
  }
}

const formModel = defineModel("form", {
  type: Object as PropType<TPatientRecord>,
  default: () => usePatientRecord().patientRecord,
});


</script>
