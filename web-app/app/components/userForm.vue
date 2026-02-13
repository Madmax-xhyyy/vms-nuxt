<template>
  <v-card variant="elevated" border="thin">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      {{ title }}
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-form v-model="formValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.firstName"
              label="First Name"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.middleName"
              label="Middle Name"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.lastName"
              label="Last Name"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.email"
              label="Email Address"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <!-- Actions -->
    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            block
            variant="text"
            class="text-none"
            size="48"
            @click="emits('cancel')"
          >
            Cancel
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            block
            variant="flat"
            color="primary"
            class="text-none"
            size="48"
            :disabled="!formValid"
            @click="emits('submit:update')"
          >
            Save Changes
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
});

const emits = defineEmits([
  "cancel", 
  "submit:update"
]);

const formValid = ref(false);
const formModel = defineModel("form", {
  type: Object as PropType<TUser>,
  default: () => useUser().user,
});


</script>