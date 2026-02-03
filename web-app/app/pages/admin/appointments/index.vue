<template>
  <v-row no-gutters>
    <v-col cols="12" class="mb-2">
      <v-row align="center">
        <!-- LEFT ACTIONS -->
        <v-col cols="12" sm="8">
          <v-row no-gutters align="center"  class="flex-wrap gap-2">

            <v-btn
              color="primary"
              variant="tonal"
              size="large"
              class="w-100 w-sm-auto mb-2 mr-2 mb-sm-0"
              @click="handleDialogAdd"
            >
              <v-icon size="16" class="mr-2">mdi-plus</v-icon>
              Appointment
            </v-btn>

            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  class="text-none px-4 text-capitalize w-100 w-sm-auto"
                  color="blue-grey-lighten-2"
                  size="large"
                  v-bind="props"
                >
                  {{ status }}
                </v-btn>
              </template>

              <v-list class="pa-0" max-height="250px">
                <v-list-item
                  v-for="(item, index) in statuses"
                  :key="index"
                  @click="navigateQueryStatus(item.value)"
                >
                  <v-icon size="16" class="mr-2">
                    {{ status === item.value ? 'mdi-check-bold' : '' }}
                  </v-icon>
                  {{ item.text }}
                </v-list-item>
              </v-list>
            </v-menu>

          </v-row>
        </v-col>

        <!-- SEARCH -->
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

    <!-- Table -->
    <v-col cols="12">
      <v-card
        width="100%"
        variant="outlined"
        border="thin"
        rounded="lg"
        :loading="loadingAppointments"
      >
        <v-toolbar density="compact" color="blue-lighten-5">
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
          style="max-height: calc(100vh - (200px))"
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

  <!--ADD DIALOG -->
  <v-dialog v-model="dialogAdd" max-width="700" persistent>
    <AppointmentForm
      v-model="form"
      :loading="loadingAdd"
      @submit:add="submitAdd()"
      @cancel="dialogAdd = false"
    />
  </v-dialog>

  <!--VIEW DIALOG -->
  <v-dialog v-model="dialogView" max-width="700" persistent>
    <AppointmentPreview
      v-model="form"
      title="Appointment Request Details"
      mode="view"
      @close="dialogView = false"
      @submit:update-status="handleStatusUpdate"
      @delete="dialogDelete = true"
    />
  </v-dialog>

  <!-- STATUS CONFIRMATION -->
  <v-dialog v-model="dialogStatus" max-width="420" persistent>
    <ConfirmationPrompt
      :title="statusDialogTitle"
      :action="pendingActionVerb"
      :content="statusConfirmationContent"
      @confirm="submitStatus()"
      @cancel="dialogStatus = false"
    />
  </v-dialog>

  <!-- DELETE DIALOG -->
  <v-dialog v-model="dialogDelete" width="450" persistent>
    <ConfirmationPrompt
      title="Delete Appointment"
      action="Delete"
      content="Are you sure you want to delete this appointment?"
      @cancel="dialogDelete = false"
      @confirm="submitDelete"
      v-model:message="message"
      :disabled="disabledDelete"
    />
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const route = useRoute();
const items = ref<Array<Record<string, any>>>([]);
const page = ref(1);
const pages = ref(10);
const pageRange = ref("-- - -- of --");
const message = ref("");
const search = ref('')

const dialogAdd = ref(false);
const dialogView = ref(false);
const dialogStatus = ref(false);
const dialogDelete = ref(false);
const disabledDelete = ref(false);
const pendingStatus = ref("");

const headers = [
  { title: "Date", value: "date" },
  { title: "Time", value: "time" },
  { title: "Full Name", value: "fullName" },
  { title: "Pet Name", value: "petName" },
];

const statuses = [
  {text: "Approved", value: "Approved"},
  {text: "Done", value: "Done"},
  {text: "Rejected", value: "Rejected"},
];

const status = computed(() => (route.query.status as string) ?? "Approved");

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

const { appointment, getAllAppointments, updateStatusById, deleteById, create, defaultAppointment } = useAppointment();

const form = ref(appointment);
const loadingAdd = ref(false);
const {
  data: appointmentsData,
  refresh: _getAllAppointments,
  status: statusAppointment,
} = await useLazyAsyncData(
  `get-all-appointments-${status.value}-${page.value}-${search.value}`,
  () => getAllAppointments({ page: page.value, status: status.value, search: search.value }),
  {
    watch: [page, status, search],
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




function navigateQueryStatus(statusValue: string) {
  navigateTo({
    name: "admin-appointments",
    query: { status: statusValue },
  });
};

function resetForm() {
  form.value = defaultAppointment();
}

function handleDialogAdd() {
  resetForm();
  dialogAdd.value = true;
}

async function submitAdd() {
  loadingAdd.value = true;
  try {
    await create(form.value);
    dialogAdd.value = false;
    resetForm();
    await _getAllAppointments();
  } catch (error: any) {
    console.error("Error:", error);
    message.value =
      error.response._data.message ||
      "An error occurred while adding the appointment.";
  } finally {
    loadingAdd.value = false;
  }
}

function handleStatusUpdate(status: 'Approved' | 'Done') {
  pendingStatus.value = status;
  dialogStatus.value = true;
}

const statusDialogTitle = computed(() => {
  return pendingStatus.value === "Done" ? "Complete Appointment": "Approve Appointment";
});

const pendingActionVerb = computed(() => {
  return pendingStatus.value === "Done" ? "Mark as Done" : "Approve";
});

const statusConfirmationContent = computed(() => {
  return `Are you sure you want to ${pendingActionVerb.value.toLowerCase()} this appointment?`;
});

async function submitStatus() {
  if (!form.value._id) return;
  
  try {
    await updateStatusById(form.value._id, pendingStatus.value);
    dialogView.value = false;
    dialogStatus.value = false;
    await _getAllAppointments();
  } catch (error) {
    console.error('Failed to update status:', error);
  }
}

async function submitDelete() {
  if (!form.value._id) return;
  
  try {
    await deleteById(form.value._id);
    dialogView.value = false;
    dialogDelete.value = false;
    await _getAllAppointments();
  } catch (error) {
    console.error('Failed to delete:', error);
  }
}

function handleRowClick(_: any, data: any) {
  Object.assign(form.value, JSON.parse(JSON.stringify(data.item)));
  dialogView.value = true;
};

</script>
