<template>
  <v-row no-gutters>
    <!-- PAGE HEADER -->
    <v-col cols="12" class="mb-4">
      <v-row align="center">
        <v-col cols="12" sm="8">
          <h2 class="text-h6 text-md-h5 font-weight-bold">Patient Records</h2>
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

    <!-- TABLE (UNCHANGED STRUCTURE) -->
    <v-col cols="12">
      <v-card
        width="100%"
        variant="outlined"
        border="thin"
        rounded="lg"
        :loading="loading"
      >
        <v-toolbar density="compact" color="grey-lighten-4">
          <template #prepend>
            <v-btn fab icon density="comfortable" @click="">
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
          :items="pagedItems"
          item-value="id"
          :items-per-page="itemsPerPage"
          hide-default-footer
          style="max-height: calc(100vh - 200px)"
        >
          <template #item.lastVisit="{ item }">
            {{ formatDate(item.lastVisit) }}
          </template>

          <template #item.services="{ item }">
            {{ item.services.join(', ') }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>

  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

import { ref, computed, watch } from "vue";

/* SEARCH */
const search = ref("");

/* TABLE */
const headers = [
  { title: "Pet Name", value: "petName" },
  { title: "Owner", value: "ownerName" },
  { title: "Type", value: "petType" },
  { title: "Breed", value: "petBreed" },
  { title: "Last Visit", value: "lastVisit" },
  { title: "Services", value: "services" },
];

const items = ref([
  {
    id: 1,
    petName: "Buddy",
    petType: "Dog",
    petBreed: "Golden Retriever",
    ownerName: "Juan Dela Cruz",
    lastVisit: "2025-01-20",
    services: ["Vaccination", "Check-up"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
  },
]);

/* FILTER */
const filteredItems = computed(() =>
  items.value.filter((p) =>
    `${p.petName} ${p.ownerName}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
);

/* PAGINATION */
const page = ref(1);
const itemsPerPage = 10;

const pages = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage)
);

const pagedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});

const pageRange = computed(() => {
  if (!filteredItems.value.length) return "0 - 0 of 0";
  const start = (page.value - 1) * itemsPerPage + 1;
  const end = Math.min(
    start + itemsPerPage - 1,
    filteredItems.value.length
  );
  return `${start} - ${end} of ${filteredItems.value.length}`;
});

const loading = ref(false);

/* FORMAT */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
