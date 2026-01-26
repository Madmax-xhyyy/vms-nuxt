<template>
  <v-row>
    <!-- Toolbar -->
    <v-col cols="12" class="mb-3">
      <v-row align="center" justify="space-between">
        <v-btn color="primary" variant="tonal" rounded @click="dialogAdd = true">
          New Appointment
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" rounded variant="outlined">
              {{ selectedStatus }}
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(status, i) in statuses"
              :key="i"
              @click="filterStatus(status)"
            >
              <v-icon v-if="selectedStatus === status" size="16" class="mr-2">mdi-check</v-icon>
              {{ status }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-col>

    <!-- Table -->
    <v-col cols="12">
      <v-card outlined rounded="lg">
        <v-toolbar flat dense color="grey-lighten-4">
          <v-btn icon @click="fetchAppointments">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>

          <v-spacer />

          <div class="mr-2 text-caption gray">
            {{ pageRange }}
          </div>
          <v-pagination v-model="page" :length="pages" />
        </v-toolbar>

        <v-data-table
          :headers="headers"
          :items="filteredAppointments"
          :items-per-page="10"
          class="elevation-1"
          @click:row="viewAppointment"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>

          <template #item.status="{ item }">
            <v-chip
              :color="statusColor(item.status)"
              variant="tonal"
              small
            >
              {{ item.status }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>

  <!-- Dialogs -->
  <v-dialog v-model="dialogAdd" max-width="600">
    <v-card>
      <v-card-title>New Appointment</v-card-title>
      <v-card-text>
        <!-- Your appointment form goes here -->
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogAdd = false">Cancel</v-btn>
        <v-btn color="primary" @click="addAppointment">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogView" max-width="600">
    <v-card>
      <v-card-title>Appointment Details</v-card-title>
      <v-card-text>
        <div><strong>Owner:</strong> {{ selectedAppointment?.owner }}</div>
        <div><strong>Pet:</strong> {{ selectedAppointment?.pet }}</div>
        <div><strong>Date:</strong> {{ formatDate(selectedAppointment?.date) }}</div>
        <div><strong>Status:</strong> {{ selectedAppointment?.status }}</div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogView = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

interface Appointment {
  id: number;
  owner: string;
  pet: string;
  date: string;
  status: string;
}

const dialogAdd = ref(false);
const dialogView = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

const page = ref(1);
const itemsPerPage = 10;

const statuses = ["Pending", "Confirmed", "Done", "Cancelled"];
const selectedStatus = ref("All");

const appointments = ref<Appointment[]>([
  { id: 1, owner: "John Doe", pet: "Rex", date: "2026-01-26", status: "Pending" },
  { id: 2, owner: "Jane Smith", pet: "Fluffy", date: "2026-01-27", status: "Confirmed" },
  { id: 3, owner: "Alice Lee", pet: "Barky", date: "2026-01-28", status: "Done" },
  { id: 4, owner: "Bob King", pet: "Snow", date: "2026-01-29", status: "Cancelled" },
]);

const headers = [
  { title: "Owner", key: "owner" },
  { title: "Pet", key: "pet" },
  { title: "Date", key: "date" },
  { title: "Status", key: "status" },
];

const fetchAppointments = () => {
  // Replace with API call
  console.log("Fetch appointments...");
};

const addAppointment = () => {
  // Replace with form submission logic
  dialogAdd.value = false;
};

const viewAppointment = (item: Appointment) => {
  selectedAppointment.value = item;
  dialogView.value = true;
};

const filterStatus = (status: string) => {
  selectedStatus.value = status;
};

const filteredAppointments = computed(() => {
  if (selectedStatus.value === "All") return appointments.value;
  return appointments.value.filter((a) => a.status === selectedStatus.value);
});

const pageRange = computed(() => {
  const start = (page.value - 1) * itemsPerPage + 1;
  const end = Math.min(page.value * itemsPerPage, filteredAppointments.value.length);
  return `${start}-${end} of ${filteredAppointments.value.length}`;
});

const pages = computed(() =>
  Math.ceil(filteredAppointments.value.length / itemsPerPage)
);

const formatDate = (date: string | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

const statusColor = (status: string | undefined) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Confirmed":
      return "green";
    case "Done":
      return "blue";
    case "Cancelled":
      return "red";
    default:
      return "grey";
  }
};
</script>
