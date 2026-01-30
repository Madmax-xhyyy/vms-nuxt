<template>
   <v-row no-gutters>
    <v-col cols="12" class="mb-2">
      <v-row no-gutters>
        <v-col cols="12" class="text-h6 text-md-h5 font-weight-bold">
          Appointment Requests
        </v-col>
      </v-row>
    </v-col>
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
            <v-btn fab icon density="comfortable" @click="_getAllPendingAppointments">
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
          style="max-height: calc(100vh - (190px))"
          @click:row="handleRowClick"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date) }}
          </template>
          <template #item.time="{ item }">
            {{ formatTime(item.time ) }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>

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
      @confirm="submitStatus"
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

const headers = [
  { title: "Date", value: "date" },
  { title: "Time", value: "time" },
  { title: "Full Name", value: "fullName" },
  { title: "Pet Name", value: "petName" },
];

const items = ref<Array<Record<string, any>>>([]);
const page = ref(1);
const pages = ref(10);
const pageRange = ref("-- - -- of --");
const message = ref("");

const dialogView = ref(false);
const dialogStatus = ref(false);
const dialogDelete = ref(false);
const disabledDelete = ref(false);
const pendingStatus = ref("");



const { appointment, getAllPendingAppointments, updateStatusById, deleteById } = useAppointment();

const form = ref(appointment);

const {
  data: appointmentsData,
  refresh: _getAllPendingAppointments,
  status: statusAppointment,
} = await useLazyAsyncData(
  `get-all-pending-appointments-${page.value}`,
  () => getAllPendingAppointments({ page: page.value }),
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


function handleRowClick(_: any, data: any) {
  Object.assign(form.value, JSON.parse(JSON.stringify(data.item)));
  dialogView.value = true;
}


function handleStatusUpdate(status: 'Approved' | 'Rejected') {
  pendingStatus.value = status;
  dialogStatus.value = true;
}

const statusDialogTitle = computed(() => {
  return pendingStatus.value === "Approved" ? "Approve Appointment" : "Reject Appointment";
});

const pendingActionVerb = computed(() => {
  return pendingStatus.value === "Approved" ? "Approve" : "Reject";
});

const statusConfirmationContent = computed(() => {
  return pendingStatus.value === "Approved" ? "Are you sure you want to approve this appointment request?" : "Are you sure you want to reject this appointment request?";
});

async function submitStatus() {
  if (!form.value._id || !pendingStatus.value) return;
  
  try {
    await updateStatusById(form.value._id, pendingStatus.value);
    pendingStatus.value = "";
    dialogStatus.value = false;
    dialogView.value = false;
    await _getAllPendingAppointments();
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
    await _getAllPendingAppointments();
  } catch (error) {
    console.error('Failed to delete:', error);
  }
}
</script>