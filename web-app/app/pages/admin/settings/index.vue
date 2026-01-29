<template>
  <v-container fluid>
    <!-- PAGE HEADER -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-h5 font-weight-bold">Settings</div>
        <div class="text-caption text-grey">
          Manage clinic preferences and system configuration
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <!-- PROFILE SETTINGS -->
      <v-col cols="12" md="6">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Profile Settings
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-form v-model="profileValid">
              <v-text-field
                v-model="profile.name"
                label="Full Name"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                required
              />

              <v-text-field
                v-model="profile.email"
                label="Email Address"
                variant="outlined"
                density="comfortable"
                class="mb-3"
                required
              />

              <v-text-field
                v-model="profile.phone"
                label="Phone Number"
                variant="outlined"
                density="comfortable"
              />

              <v-btn
                color="primary"
                :disabled="!profileValid"
                @click="saveProfile"
              >
                Save Profile
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- CLINIC SETTINGS -->
      <v-col cols="12" md="6">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Clinic Settings
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-form v-model="clinicValid">
              <v-text-field
                v-model="clinic.name"
                label="Clinic Name"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />

              <v-text-field
                v-model="clinic.address"
                label="Clinic Address"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />

              <v-select
                v-model="clinic.timezone"
                label="Timezone"
                :items="timezones"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />

              <v-switch
                v-model="clinic.autoApprove"
                label="Auto-approve appointments"
                inset
              />

              <v-btn
                color="primary"
                class="mt-3"
                :disabled="!clinicValid"
                @click="saveClinic"
              >
                Save Clinic Settings
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- SECURITY SETTINGS -->
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Security
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-btn variant="outlined" class="mr-2">
              Change Password
            </v-btn>

            <v-btn variant="outlined" color="error">
              Logout All Sessions
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const profileValid = ref(false);
const clinicValid = ref(false);

const profile = reactive({
  name: "Admin User",
  email: "admin@clinic.com",
  phone: "",
});

const clinic = reactive({
  name: "Happy Paws Veterinary Clinic",
  address: "",
  timezone: "Asia/Manila",
  autoApprove: false,
});

const timezones = [
  "Asia/Manila",
  "UTC",
  "Asia/Singapore",
  "Asia/Tokyo",
];

function saveProfile() {
  console.log("Saving profile:", profile);
}

function saveClinic() {
  console.log("Saving clinic settings:", clinic);
}
</script>
