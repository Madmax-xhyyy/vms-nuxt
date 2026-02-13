<template>
  <v-row no-gutters>
    <v-col cols="12">
      <!-- PAGE HEADER -->
      <v-row >
        <v-col cols="12">
          <div class="text-h5 font-weight-bold">Settings</div>
          <div class="text-caption text-grey">
            Manage clinic preferences and system configuration
          </div>
        </v-col>
      </v-row>

      <v-row dense>
        <!-- PROFILE SETTINGS -->
        <v-col cols="12">
          <v-card variant="elevated" border="thin">
            <v-card-title class="text-subtitle-1 font-weight-bold">
              Profile Information
            </v-card-title>

            <v-divider />

            <v-card-text class="mt-4">
              <v-form v-model="profileValid" mode="view">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile.name"
                      label="Full Name"
                      variant="outlined"
                      density="comfortable"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile.email"
                      label="Email Address"
                      variant="outlined"
                      density="comfortable"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                
                <v-btn
                  variant="tonal"
                  class="mr-2"
                  @click="dialogEditUserInfo = true"
                >
                  Edit
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- CLINIC SETTINGS -->
        <v-col cols="12">
          <v-card variant="elevated" border="thin">
            <v-card-title class="text-subtitle-1 font-weight-bold">
              Clinic Information
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

                <v-btn
                  variant="tonal"
                  class="mt-3"
                  @click="dialogEditSystemInfo = true"
                >
                  Edit
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <!--EDIT DIALOG -->
  <v-dialog v-model="dialogEditSystemInfo" max-width="700" persistent>
    <SystemInfoForm
      title="Update System Information"
      v-model:form="formSystemInfo"
      mode="update"
      @submit:update="submitUpdateSystemInfo()"
      @cancel="dialogEditSystemInfo = false"
    />
  </v-dialog>

  <!--EDIT DIALOG -->
  <v-dialog v-model="dialogEditUserInfo" max-width="700" persistent>
    <userForm
      title="Update User Information"
      v-model:form="formUserInfo"
      mode="update"
      @submit:update="submitUpdateUserInfo()"
      @cancel="dialogEditUserInfo = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const dialogEditSystemInfo = ref(false);
const dialogEditUserInfo = ref(false);

const { systemInfo, updateData: updateSystemInfo } = useSystemInfo();
const formSystemInfo = ref(systemInfo);

const { user, updateData: updateUser } = useUser();
const formUserInfo = ref(user);

// Form validation states
const profileValid = ref(false);
const clinicValid = ref(false);

// Profile and clinic data (derived from systemInfo)
const profile = computed(() => ({
  name: systemInfo.value.clinicName || '',
  email: systemInfo.value.email || '',
}));

const clinic = computed(() => ({
  name: systemInfo.value.clinicName || '',
  address: systemInfo.value.address || '',
}));

const timezones = [
  "Asia/Manila",
  "UTC",
  "Asia/Singapore",
  "Asia/Tokyo",
];

async function submitUpdateSystemInfo() {
  if (systemInfo.value._id) {
    await updateSystemInfo(systemInfo.value._id, formSystemInfo.value);
    dialogEditSystemInfo.value = false;
  }
}

async function submitUpdateUserInfo() {
  if (user.value._id) {
    await updateUser(user.value._id, formUserInfo.value);
    dialogEditUserInfo.value = false;
  }
}

</script>
