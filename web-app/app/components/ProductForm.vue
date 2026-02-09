<template>
  <v-card width="100%" rounded="lg" elevation="1">
    <!-- Header -->
    <v-card-title class="text-center bg-primary py-4">
      <span class="text-h6 font-weight-bold">{{ localProps.title }}</span>
    </v-card-title>

    <v-divider />

    <!-- Form -->
    <v-card-text style="max-height: 100vh; overflow-y: auto" class="mt-4">
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.name"
              label="Name"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.price"
              label="Price"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="formModel.category"
              :items="categories"
              label="Category"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.stock"
              label="Stock"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-file-input
              label="Image"
              variant="outlined"
              accept="image/*"
              prepend-icon="mdi-camera"
              @update:model-value="handleImage"
            />

            <v-img
              v-if="formModel.image"
              :src="formModel.image"
              max-height="200"
              class="mt-2 rounded-lg border"
              cover
            ></v-img>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <!-- Action -->
    <v-toolbar density="compact">
      <v-row no-gutters>
        <template v-if="localProps.mode === 'view'">
          <v-col cols="6">
            <v-btn
              tile
              block
              variant="text"
              class="text-none"
              size="48"
              @click="emits('close')"
            >
              Close
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  block
                  variant="flat"
                  color="black"
                  class="text-none"
                  height="48"
                  v-bind="props"
                  tile
                >
                  More actions
                </v-btn>
              </template>
              <v-list class="pa-0">
                <v-list-item
                  @click="emits('edit')"
                >
                  <v-list-item-title class="text-subtitle-2">
                    Edit
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="emits('delete')"
                  class="bg-red-lighten-1"
                >
                  <v-list-item-title class="text-subtitle-2">
                    Delete
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </template>

        <template v-else>
          <v-col cols="6">
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

          <v-col v-if="localProps.mode === 'add'" cols="6">
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

          <v-col v-if="localProps.mode === 'edit'" cols="6">
            <v-btn
              tile
              block
              variant="flat"
              color="primary"
              class="text-none"
              size="48"
              @click="emits('submit:update')"
              :disabled="!valid"
            >
              Save Changes
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">

const localProps = defineProps({
  title: {
    type: String,
    default: "Add Product",
  },
  mode: {
    type: String,
    default: "add",
  },
});

const emits = defineEmits([
  "cancel", 
  "close", 
  "delete", 
  "edit", 
  "submit:add", 
  "submit:update"
]);


const formModel = defineModel("form", {
  type: Object as PropType<TProduct>,
  default: () => useProduct().product,
});

const valid = ref(false);

const requiredRule = (v: any) => {
  if (Array.isArray(v)) return v.length > 0 || "Required.";
  return !!v || "Required.";
};

const imageFile = defineModel("file", {
  type: Object as PropType<File | null>,
  default: null,
});

function handleImage(file: any) {
  const selected = Array.isArray(file) ? file[0] : file;
  imageFile.value = selected || null;
  
  // Optional: show a local preview
  if (imageFile.value) {
    const reader = new FileReader();
    reader.onload = () => {
      formModel.value.image = reader.result as string; // temporary preview
    };
    reader.readAsDataURL(imageFile.value);
  } else {
    formModel.value.image = "";
  }
}


const categories = ref([
  "Food",
  "Medicine",
  "Supplies",
  "Accessories",
]);

</script>
