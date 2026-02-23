<template>
  <v-card variant="elevated" border="thin">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      {{ title }}
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-form v-model="formValid">
        <v-row justify="center" class="mb-6">
          <v-col cols="auto" class="text-center">
            <v-hover v-slot="{ isHovering, props }">
              <v-avatar
                size="120"
                class="elevation-4 cursor-pointer position-relative"
                v-bind="props"
                @click="triggerFileInput"
              >
                <v-img
                  :src="formModel.profilePicture || 'https://i.pravatar.cc/120'"
                  cover
                >
                  <template #placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="primary" />
                    </v-row>
                  </template>
                </v-img>
                <v-fade-transition>
                  <div
                    v-if="isHovering || uploading"
                    class="d-flex align-center justify-center position-absolute fill-height w-100"
                    style="background: rgba(0, 0, 0, 0.4); bottom: 0; left: 0"
                  >
                    <v-progress-circular
                      v-if="uploading"
                      indeterminate
                      color="white"
                    />
                    <v-icon v-else color="white" size="32">mdi-camera</v-icon>
                  </div>
                </v-fade-transition>
              </v-avatar>
            </v-hover>
            <div class="text-caption text-grey mt-2">Click to change photo</div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="onFileSelected"
            />
          </v-col>
        </v-row>

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
            :disabled="!formValid || uploading"
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

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const onFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploading.value = true;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", "profile_pictures");

  try {
    const response = await $fetch<{ imageUrl: string }>("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    if (response.imageUrl) {
      formModel.value.profilePicture = response.imageUrl;
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    // You might want to show a snackbar error here
  } finally {
    uploading.value = false;
  }
};
</script>
