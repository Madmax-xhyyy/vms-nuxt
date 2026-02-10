<template>
  <v-row no-gutters>
    <!-- PAGE HEADER -->
    <v-col cols="12" class="mb-2">
      <v-row align="center">
        <v-col cols="12" sm="4">
          <h2 class="text-h6 text-md-h5 font-weight-bold">Products</h2>
          <div class="text-body-2 text-grey">
            Manage clinic products and inventory.
          </div>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="search"
            label="Search"
            variant="outlined"
            density="compact"
            class="w-100"
            hide-details
          />
        </v-col>

        <v-col cols="12" sm="2">
          <v-btn
              color="primary"
              variant="tonal"
              size="large"
              class="w-100 w-sm-auto mb-2 mb-sm-0"
              @click="handleDialogAdd"
            >
              <v-icon size="16" class="mr-2">mdi-plus</v-icon>
              Product
            </v-btn>
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

   <!--ADD DIALOG -->
  <v-dialog v-model="dialogAdd" max-width="700" persistent>
    <ProductForm
      v-model:form="form"
      v-model:file="imageFile"
      @submit:add="submitAdd()"
      @cancel="dialogAdd = false"
    />
  </v-dialog>

  <v-dialog v-model="dialogView" max-width="700" persistent>
    <ProductForm
      v-model:form="form"
      title="Product Details"
      mode="view"
      @close="dialogView = false"
      @edit="handleDialogEdit()"
      @delete="dialogDelete = true"
    />
  </v-dialog>

  <!--EDIT DIALOG -->
  <v-dialog v-model="dialogEdit" max-width="700" persistent>
    <ProductForm
      title="Edit Product"
      v-model:form="form"
      mode="edit"
      @submit:update="submitUpdate()"
      @cancel="dialogEdit = false"
    />
  </v-dialog>

   <!-- DELETE DIALOG -->
  <v-dialog v-model="dialogDelete" width="450" persistent>
    <ConfirmationPrompt
      title="Delete Product"
      action="Delete"
      content="Are you sure you want to delete this product?"
      @cancel="dialogDelete = false"
      @confirm="submitDelete()"
      :disabled="disabledDelete"
    />
  </v-dialog>
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
const dialogAdd = ref(false);

const headers = [
  { title: "Name", value: "name" },
  { title: "Category", value: "category" },
  { title: "Price", value: "price" },
  { title: "Stock", value: "stock" },
];

const dialogView = ref(false);
const dialogEdit = ref(false);
const dialogDelete = ref(false);
const disabledDelete = ref(false);

const { product, getAll, updateById, deleteById } = useProduct();

const form = ref(product);
const imageFile = ref<File | null>(null);
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

 const handleDialogAdd = () => {
  resetForm();
  dialogAdd.value = true;
};

function resetForm() {
  form.value = {
    name: "",
    category: "",
    price: 0,
    stock: 0,
    image: "",
  };
  imageFile.value = null;
}

async function submitAdd() {
  let imageUrl = "";

  if (imageFile.value) {
    const formData = new FormData();
    formData.append("image", imageFile.value);

    const uploadRes = await $fetch<{ imageUrl: string }>("/api/upload", {
      method: "POST",
      body: formData,
    });

    imageUrl = uploadRes.imageUrl;
  }

  try{
    await $fetch("/api/products", {
    method: "POST",
    body: {
      ...form.value,
      image: imageUrl,
    },
  });
  dialogAdd.value = false;
  resetForm();
  await _getAllProducts();
  } catch (error) {
    console.error('Failed to add:', error);
  }
}

function handleDialogEdit() {
  dialogView.value = false;
  dialogEdit.value = true;
}

async function submitUpdate() {
  const productId = form.value._id;
  if (!productId) return;

  let imageUrl = "";

  if (imageFile.value) {
    const formData = new FormData();
    formData.append("image", imageFile.value);

    const uploadRes = await $fetch<{ imageUrl: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });

    imageUrl = uploadRes.imageUrl;
  }

  try {
    const payload = { ...form.value };
    if (imageUrl) {
      payload.image = imageUrl;
    }

    await updateById(productId, payload);
    dialogEdit.value = false;
    resetForm();
    await _getAllProducts();
  } catch (error) {
    console.error('Failed to update:', error);
  }
}

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
