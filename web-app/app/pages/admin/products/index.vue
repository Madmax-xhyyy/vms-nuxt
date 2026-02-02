<template>
  <v-container fluid class="pa-0">
    <!-- PAGE HEADER -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="8">
        <h2 class="text-h6 text-md-h5 font-weight-bold">Products</h2>
        <div class="text-body-2 text-grey">
          Manage clinic food products
        </div>
      </v-col>

      <v-col cols="12" md="4" class="text-md-right">
        <v-btn
          color="primary"
          @click="navigateTo('/admin/products/add')"
        >
          Add Product
        </v-btn>
      </v-col>
    </v-row>

    <!-- PRODUCTS TABLE -->
    <v-card variant="outlined">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Product List
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-0">
        <v-table density="comfortable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="product in products"
              :key="product._id"
            >
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>₱{{ product.price.toFixed(2) }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <v-chip
                  size="x-small"
                  variant="flat"
                  :color="product.stock > 0 ? 'success' : 'error'"
                >
                  {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                </v-chip>
              </td>
              <td class="text-right">
                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  @click="editProduct(product._id)"
                >
                  Edit
                </v-btn>

                <v-btn
                  size="small"
                  variant="text"
                  color="error"
                  @click="deleteProduct(product._id)"
                >
                  Delete
                </v-btn>
              </td>
            </tr>

            <tr v-if="!products.length">
              <td colspan="6" class="text-center text-grey pa-4">
                No products found
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
})

type Product = {
  _id: string
  name: string
  category: string
  price: number
  stock: number
}

// 🔹 Replace with API later
const products = ref<Product[]>([
  {
    _id: "1",
    name: "Dog Food Premium",
    category: "Dog Food",
    price: 850,
    stock: 12,
  },
  {
    _id: "2",
    name: "Cat Food Tuna",
    category: "Cat Food",
    price: 620,
    stock: 0,
  },
])

function editProduct(id: string) {
  navigateTo(`/admin/products/${id}/edit`)
}

function deleteProduct(id: string) {
  // later: show confirmation dialog
  products.value = products.value.filter(p => p._id !== id)
}
</script>
