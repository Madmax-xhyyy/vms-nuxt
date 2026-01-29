<template>
  <v-container fluid>
    <!-- HEADER -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <div class="text-h5 font-weight-bold">Food Products</div>
        <div class="text-caption text-grey">
          Manage pet food inventory
        </div>
      </v-col>

      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" @click="openAdd">
          Add Food Product
        </v-btn>
      </v-col>
    </v-row>

    <!-- SEARCH -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search food"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>
    </v-row>

    <!-- TABLE -->
    <v-card variant="outlined">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Food Name</th>
            <th>Pet Type</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Status</th>
            <th width="120">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in filteredFoods" :key="item.id">
            <td>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text-grey">
                {{ item.brand }}
              </div>
            </td>

            <td>{{ item.petType }}</td>

            <td>{{ item.stock }}</td>

            <td>{{ formatPrice(item.price) }}</td>

            <td>
              <v-chip
                size="x-small"
                :color="item.stock > 0 ? 'success' : 'error'"
              >
                {{ item.stock > 0 ? 'In Stock' : 'Out of Stock' }}
              </v-chip>
            </td>

            <td>
              <v-btn icon size="small" variant="text" @click="openEdit(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                icon
                size="small"
                variant="text"
                color="error"
                @click="remove(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>

          <tr v-if="!filteredFoods.length">
            <td colspan="6" class="text-center text-grey pa-6">
              No food products found
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- ADD / EDIT DIALOG -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card>
        <v-card-title class="font-weight-bold">
          {{ isEdit ? 'Edit Food Product' : 'Add Food Product' }}
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Food Name"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model="form.brand"
            label="Brand"
            variant="outlined"
            class="mb-3"
          />

          <v-select
            v-model="form.petType"
            :items="['Dog', 'Cat', 'Both']"
            label="Pet Type"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model.number="form.stock"
            label="Stock Quantity"
            type="number"
            variant="outlined"
            class="mb-3"
          />

          <v-text-field
            v-model.number="form.price"
            label="Price"
            type="number"
            variant="outlined"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const search = ref("");

const foods = ref([
  {
    id: 1,
    name: "Adult Dog Food",
    brand: "Royal Canin",
    petType: "Dog",
    stock: 15,
    price: 1800,
  },
  {
    id: 2,
    name: "Cat Dry Food",
    brand: "Whiskas",
    petType: "Cat",
    stock: 0,
    price: 950,
  },
]);

const filteredFoods = computed(() =>
  foods.value.filter((f) =>
    f.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

/* DIALOG */
const dialog = ref(false);
const isEdit = ref(false);

const form = reactive({
  id: null as number | null,
  name: "",
  brand: "",
  petType: "",
  stock: 0,
  price: 0,
});

function openAdd() {
  isEdit.value = false;
  Object.assign(form, {
    id: null,
    name: "",
    brand: "",
    petType: "",
    stock: 0,
    price: 0,
  });
  dialog.value = true;
}

function openEdit(item: any) {
  isEdit.value = true;
  Object.assign(form, item);
  dialog.value = true;
}

function save() {
  if (isEdit.value) {
    const i = foods.value.findIndex((f) => f.id === form.id);
    foods.value[i] = { ...form };
  } else {
    foods.value.push({ ...form, id: Date.now() });
  }
  dialog.value = false;
}

function remove(item: any) {
  foods.value = foods.value.filter((f) => f.id !== item.id);
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}
</script>
