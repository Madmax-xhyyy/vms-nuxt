<template>
  <v-row no-gutters>
    <!-- PAGE HEADER -->
    <v-col cols="12" class="mb-4">
      <v-row align="center">
        <v-col cols="12" sm="8">
          <h2 class="text-h6 text-md-h5 font-weight-bold">Products</h2>
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            v-model="search"
            label="Search"
            variant="outlined"
            density="compact"
            class="w-100"
            hide-details
          />
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-card
        width="100%"
        variant="outlined"
        border="thin"
        :loading="loadingProduct"
      >
        <v-toolbar density="compact" color="blue-lighten-5">
          <template #prepend>
            <v-btn fab icon density="comfortable" @click="_getAllProducts">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            
          </template>

          <template #append>
            <v-row no-gutters justify="end" align="center">
              <span class="mr-2 text-caption text-grey">
                {{ pageRange }}
              </span>
              <local-pagination v-model="page" :length="pages" />
            </v-row>
          </template>
        </v-toolbar>

        <v-data-table
          :headers="headers"
          :items="items"
          item-value="_id"
          :items-per-page="10"
          @click:row="handleRowClick"
          hide-default-footer
          style="max-height: calc(100vh - 200px)"
        >
        </v-data-table>
      </v-card>
    </v-col>

  </v-row>

  <!-- <v-dialog v-model="dialogView" max-width="700" persistent>
    <PatientRecordPreview
      v-model="form"
      title="Patient Record Details"
      mode="view"
      @close="dialogView = false"
      @edit="dialogView = false"
      @delete="dialogDelete = true"
    />
  </v-dialog> -->

  <!-- DELETE DIALOG -->
  <!-- <v-dialog v-model="dialogDelete" width="450" persistent>
    <ConfirmationPrompt
      title="Delete Patient Record"
      action="Delete"
      content="Are you sure you want to delete this patient record?"
      @cancel="dialogDelete = false"
      @confirm="submitDelete"
      v-model:message="message"
      :disabled="disabledDelete"
    />
  </v-dialog> -->
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});


/* SEARCH */
const search = ref("");
const page = ref(1);
const pages = ref(10);
const pageRange = ref("-- - -- of --");
const message = ref("");

const headers = [
  { title: "Name", value: "name" },
  { title: "Category", value: "category" },
  { title: "Price", value: "price" },
  { title: "Stock", value: "stock" },
];

const dialogView = ref(false);
const dialogDelete = ref(false);
const disabledDelete = ref(false);

const { product, getAll, deleteById } = useProduct();

const form = ref(product);
const items = ref<Array<TProduct>>([]);

const{ 
  data: ProductData,
  refresh: _getAllProducts,
  status: statusProduct,
} = await useLazyAsyncData(
  `get-all-products-${page.value}-${search.value}`,
  () => getAll({ page: page.value, search: search.value }),
  {
    watch: [page, search],
  },
);

watchEffect(() => {
  if (ProductData.value) {
    items.value = ProductData.value.items;
    pages.value = ProductData.value.pages;
    pageRange.value = ProductData.value.pageRange;
  }
});

const loadingProduct = computed(() => statusProduct.value === "pending");


async function submitDelete() {
  if (!form.value._id) return;
  
  try {
    await deleteById(form.value._id);
    dialogView.value = false;
    dialogDelete.value = false;
    await _getAllProducts();
  } catch (error) {
    console.error('Failed to delete:', error);
  }
}


function handleRowClick(_: any, data: any) {
  Object.assign(form.value, JSON.parse(JSON.stringify(data.item)));
  dialogView.value = true;
};
</script>
