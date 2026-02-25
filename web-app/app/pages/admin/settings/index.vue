<template>
  <v-overlay v-model="loading" class="align-center justify-center" persistent>
    <v-progress-circular indeterminate color="primary" />
  </v-overlay>

  <v-row no-gutters>
    <v-col cols="12">
      <!-- PAGE HEADER -->
      <v-row>
        <v-col cols="12">
          <div class="text-h5 font-weight-bold">Settings</div>
          <div class="text-caption text-grey">
            View and manage account and system configuration
          </div>
        </v-col>
      </v-row>

      <v-row dense class="mt-2">
        <!-- USER INFORMATION -->
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-card-title class="text-subtitle-1 font-weight-bold">
              User Information
            </v-card-title>

            <v-divider />

            <v-card-text class="py-6">
              <v-row align="center">
                <v-col cols="12" md="2">
                  <v-avatar size="100" class="elevation-2">
                    <v-img :src="currentUser?.profilePicture || 'https://i.pravatar.cc/100'" cover />
                  </v-avatar>
                </v-col>
                <v-col cols="12" md="10">
                  <v-row>
                    <v-col cols="12" md="4">
                      <div class="text-caption text-grey">Full Name</div>
                      <div class="text-body-1 font-weight-medium">
                        {{ currentUser?.firstName }} {{ currentUser?.middleName }} {{ currentUser?.lastName }}
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="text-caption text-grey">Email Address</div>
                      <div class="text-body-1 font-weight-medium">
                        {{ currentUser?.email }}
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="text-caption text-grey">Role</div>
                      <div class="text-body-1 font-weight-medium">
                        {{ currentUser?.role }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-btn
                variant="tonal"
                class="mt-6"
                @click="dialogEditUserInfo = true"
              >
                Edit
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- CLINIC INFORMATION -->
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-card-title class="text-subtitle-1 font-weight-bold">
              Clinic Information
            </v-card-title>

            <v-divider />

            <v-card-text class="py-6">
              <v-row>
                <v-col cols="12" md="6">
                  <div class="text-caption text-grey">Clinic Name</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ systemInfo?.clinicName }}
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-grey">Tagline</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ systemInfo?.tagline || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-grey">Email Address</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ systemInfo?.email }}
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="text-caption text-grey">Phone Number</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ systemInfo?.phone }}
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="text-caption text-grey">Address</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ systemInfo?.address }}
                  </div>
                </v-col>

                <v-col cols="12">
                  <div class="text-caption text-grey">Description</div>
                  <div class="text-body-2 text-grey-darken-1">
                    {{ systemInfo?.description || "No description set" }}
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-divider class="my-4" />
                  <div class="text-subtitle-2 font-weight-bold mb-2">Operating Hours</div>
                  <v-row dense>
                    <v-col 
                      v-for="hours in systemInfo?.operatingHours" 
                      :key="hours.day"
                      cols="12" sm="6" md="4"
                    >
                      <div class="d-flex justify-space-between text-body-2">
                        <span class="font-weight-medium">{{ hours.day }}:</span>
                        <span v-if="hours.isClosed" class="text-error">Closed</span>
                        <span v-else>{{ hours.open }} - {{ hours.close }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <v-btn
                variant="tonal"
                class="mt-6"
                @click="dialogEditSystemInfo = true"
              >
                Edit
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <!-- SYSTEM EDIT DIALOG -->
  <v-dialog v-model="dialogEditSystemInfo" max-width="700" persistent>
    <SystemInfoForm
      title="Update System Information"
      v-model:form="formSystemInfo"
      mode="update"
      @submit:update="submitUpdateSystemInfo()"
      @cancel="dialogEditSystemInfo = false"
    />
  </v-dialog>

  <!-- USER EDIT DIALOG -->
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

const loading = ref(false);

// System Info
const { systemInfo, updateData: updateSystemInfo, getData: getSystemInfo } = useSystemInfo();
const formSystemInfo = ref({ ...systemInfo.value });

// User Info
const { updateById: updateUser, getCurrentUser, currentUser } = useUser();
const formUserInfo = ref<TUser>({
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
});

// Form validation states
const profileValid = ref(false);
const clinicValid = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      getCurrentUser(),
      getSystemInfo(),
    ]);
    
    // Sync forms with fetched data
    if (systemInfo.value) {
      formSystemInfo.value = { ...systemInfo.value };
    }
    
    if (currentUser.value) {
      formUserInfo.value = {
        firstName: currentUser.value.firstName || "",
        middleName: currentUser.value.middleName || "",
        lastName: currentUser.value.lastName || "",
        email: currentUser.value.email || "",
        profilePicture: currentUser.value.profilePicture || "",
      } as TUser;
    }
  } catch (error) {
    console.error("Error fetching settings data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const submitUpdateUserInfo = async () => {
  if (!currentUser.value?._id) return;
  
  loading.value = true;
  try {
    await updateUser(currentUser.value._id, formUserInfo.value);
    await getCurrentUser(); // Refresh state
    dialogEditUserInfo.value = false;
  } catch (error) {
    console.error("Error updating user info:", error);
  } finally {
    loading.value = false;
  }
};

const submitUpdateSystemInfo = async () => {
  try {
    await updateSystemInfo(formSystemInfo.value);
    dialogEditSystemInfo.value = false;
    await getSystemInfo();
  } catch (error) {
    console.error("Error updating system info:", error);
  } finally {
    loading.value = false;
  }
};
</script>
