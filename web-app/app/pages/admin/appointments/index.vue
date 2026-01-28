<template>
  <v-row>
    <!-- Toolbar -->
    <v-col cols="12">
      <v-row align="center">
        <v-col cols="auto">
          <v-btn color="primary" variant="tonal" @click="dialogAdd = true">
          <v-icon start>mdi-plus</v-icon>
          New Appointment
        </v-btn>
        </v-col>
        
        <v-col cols="auto">
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
              @click="filterStatus(status.value)"
            >
              <v-icon v-if="selectedStatus === status.value" size="16" class="mr-2">mdi-check</v-icon>
              {{ status.text }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      </v-row>
    </v-col>

    <!-- Table -->
    <v-col cols="12">
      <v-card
        width="100%"
        variant="outlined"
        border="thin"
        rounded="lg"
        :loading="loadingAppointments"
      >
        <v-toolbar density="compact" color="grey-lighten-4">
          <template #prepend>
            <v-btn fab icon density="comfortable" @click="_getAllAppointments">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </template>

          <template #append>
            <v-row no-gutters justify="end" align="center">
              <span class="mr-2 text-caption text-font gray">
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
          hide-default-footer
          style="max-height: calc(100vh - (126px))"
          @click:row="handleRowClick"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #item.time="{ item }">
            {{ formatTime(item.time)  }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>

  <!-- Dialogs -->
  <!-- <v-dialog v-model="dialogAdd" max-width="600">
    <v-card>
      <v-card-title>New Appointment</v-card-title>
      <v-card-text>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialogAdd = false">Cancel</v-btn>
        <v-btn color="primary" @click="addAppointment">Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

  <!-- <v-dialog v-model="dialogView" max-width="600">
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
  </v-dialog> -->
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const items = ref<Array<Record<string, any>>>([]);
const page = ref(1);
const pages = ref(10);
const pageRange = ref("-- - -- of --");
const message = ref("");

const dialogAdd = ref(false);
const dialogView = ref(false);

const selectedStatus = ref("Approved");

const headers = [
  { title: "Date", value: "date" },
  { title: "Preferred Time", value: "time" },
  { title: "Full Name", value: "fullName" },
  { title: "Pet Name", value: "petName" },
];

const statuses = [
  {text: "Approved", value: "Approved"},
  {text: "Done", value: "Done"},
  {text: "Rejected", value: "Rejected"},
];

const filterStatus = (status: string) => {
  selectedStatus.value = status;
};

const formatDate = (date: string | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};

const formatTime = (timeString?: string) => {
  if (!timeString) return 'Not set';

  const parts = timeString.split(':').map(Number);
  if (parts.length < 2 || parts.some(isNaN)) return 'Invalid time';

  const hours = parts[0] as number;
  const minutes = parts[1] as number;

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date().setHours(hours, minutes, 0, 0));
};


const { appointment, getAllAppointments, updateStatusById, deleteById } = useAppointment();

const form = ref(appointment);

const {
  data: appointmentsData,
  refresh: _getAllAppointments,
  status: statusAppointment,
} = await useLazyAsyncData(
  `get-appointments-${page.value}`,
  () => getAllAppointments({ page: page.value }),
  {
    watch: [page],
  },
);

watchEffect(() => {
  if (appointmentsData.value) {
    items.value = appointmentsData.value.items;
    pages.value = appointmentsData.value.pages;
    pageRange.value = appointmentsData.value.pageRange;
  }
});

const loadingAppointments = computed(() => statusAppointment.value === "pending");

function handleRowClick(_: any, data: any) {
  Object.assign(form.value, JSON.parse(JSON.stringify(data.item)));
  dialogView.value = true;
}
</script>
