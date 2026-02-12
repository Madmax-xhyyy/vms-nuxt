<template>
  <v-card width="100%" rounded="lg" elevation="1">
    <!-- Header -->
    <v-card-title class="text-center bg-primary py-4">
      <span class="text-h6 font-weight-bold">
        {{ localProps.title }}
      </span>
    </v-card-title>

    <v-divider />

    <!-- Form -->
    <v-card-text style="max-height: 100vh; overflow-y: auto" class="mt-4">
      <v-form v-model="valid">
        
        <!-- Basic Information -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.clinicName"
              label="Clinic Name"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.tagline"
              label="Tagline"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="formModel.description"
              label="Clinic Description"
              variant="outlined"
              rows="3"
            />
          </v-col>
        </v-row>

        <!-- Contact Information -->
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formModel.email"
              label="Email"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="formModel.phone"
              label="Phone Number"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="formModel.address"
              label="Address"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <!-- Branding -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.logoUrl"
              label="Logo URL"
              variant="outlined"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.faviconUrl"
              label="Favicon URL"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.primaryColor"
              label="Primary Color (Hex)"
              variant="outlined"
              type="color"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.secondaryColor"
              label="Secondary Color (Hex)"
              variant="outlined"
              type="color"
            />
          </v-col>
        </v-row>

        <!-- Operating & Appointment Settings -->
        <v-row>
          <v-col cols="12" md="6">
            <v-textarea
              v-model="formModel.operatingHours"
              label="Operating Hours"
              variant="outlined"
              rows="2"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <!-- Footer & Policies -->
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="formModel.footerText"
              label="Footer Text"
              variant="outlined"
              rows="2"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="formModel.privacyPolicy"
              label="Privacy Policy"
              variant="outlined"
              rows="3"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="formModel.termsAndConditions"
              label="Terms and Conditions"
              variant="outlined"
              rows="3"
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
            :disabled="!valid"
            @click="emits('submit:update')"
          >
            Save Settings
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
    default: "Update System Information",
  },
  mode: {
    type: String,
    default: "update",
  },
});

const emits = defineEmits([
  "cancel", 
  "submit:update"
]);

const formModel = defineModel("form", {
  type: Object as PropType<TSystemInfo>,
  default: () => useSystemInfo().systemInfo,
});

const valid = ref(false);

const requiredRule = (v: any) => {
  if (Array.isArray(v)) return v.length > 0 || "Required.";
  return !!v || "Required.";
};

</script>
