<template>
  <v-container fluid class="pa-0">
    <!-- PAGE TITLE -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h6 text-md-h5 font-weight-bold">Dashboard</h2>
        <div class="text-body-2 text-grey">
          Overview of appointments and clinic activity
        </div>
      </v-col>
    </v-row>

    <!-- STATS CARDS -->
    <v-row dense align="stretch">
      <v-col cols="12" sm="6" md="3">
        <v-card variant="elevated" border="thin" class="h-150" min-height="100">
          <v-card-text>
            <div class="text-body-2 text-md-h6 text-grey mb-2">
              Pending Appointments
            </div>
            <div class="text-h5 text-md-h4 font-weight-bold text-warning">
              {{ stats.pending }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card variant="elevated" border="thin" class="h-150" min-height="100">
          <v-card-text>
            <div class="text-body-2 text-md-h6 text-grey mb-2">Approved</div>
            <div class="text-h5 text-md-h4 font-weight-bold text-success">
              {{ stats.approved }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card variant="elevated" border="thin" class="h-150" min-height="100">
          <v-card-text>
            <div class="text-body-2 text-md-h6 text-grey mb-2">Completed</div>
            <div class="text-h5 text-md-h4 font-weight-bold text-info">
              {{ stats.done }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card variant="elevated" border="thin" class="h-150" min-height="100">
          <v-card-text>
            <div class="text-body-2 text-md-h6 text-grey mb-2">Rejected</div>
            <div class="text-h5 text-md-h4 font-weight-bold text-error">
              {{ stats.rejected }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- STATS CARDS -->
    <v-row dense align="stretch">
      <v-col cols="12" sm="6" md="3">
        <v-card variant="elevated" border="thin" class="h-150" min-height="100">
          <v-card-text>
            <div class="text-body-2 text-md-h6 text-grey mb-2">
              Patient Records
            </div>
            <div class="text-h5 text-md-h4 font-weight-bold text-purple">
              {{ stats.patientRecords }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card variant="elevated" border="thin" class="h-150" min-height="100">
          <v-card-text>
            <div class="text-body-2 text-md-h6 text-grey mb-2">Total Products</div>
            <div class="text-h5 text-md-h4 font-weight-bold text-brown">
              {{ stats.totalProducts }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- QUICK ACTIONS + RECENT APPOINTMENTS -->
    <v-row dense align="stretch">
      <!-- QUICK ACTIONS -->
      <v-col cols="12" md="4">
        <v-card variant="elevated" border="thin" class="h-100">
          <v-card-title class="text-subtitle-1 text-md-h6 font-weight-bold bg-blue-lighten-5">
            Quick Actions
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-btn
              block
              color="primary"
              class="mb-2"
              @click="navigateTo('/admin/appointments')"
            >
              View Appointments
            </v-btn>

            <v-btn
              block
              variant="outlined"
              @click="handleAdd()"
            >
              Add Appointment
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- PENDING APPOINTMENTS -->
      <v-col cols="12" md="8">
        <v-card variant="elevated" border="thin" class="h-100">
          <v-card-title class="text-subtitle-1 text-md-h6 font-weight-bold bg-blue-lighten-5">
            Pending Appointments
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-0">
            <v-table density="comfortable">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Client</th>
                  <th>Pet</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in recentAppointments"
                  :key="item._id"
                >
                  <td>{{ item.code }}</td>
                  <td>{{ item.fullName }}</td>
                  <td>{{ item.petName }}</td>
                  <td>{{ formatDateTime(item.dateTime) }}</td>
                  <td>
                    <v-chip
                      size="x-small"
                      variant="flat"
                      :color="getStatusColor(item.status)"
                    >
                      {{ item.status }}
                    </v-chip>
                  </td>
                </tr>

                <tr v-if="!recentAppointments.length">
                  <td colspan="5" class="text-center text-grey pa-4">
                    No recent appointments
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!--ADD DIALOG -->
  <v-dialog v-model="dialogAdd" max-width="700" persistent>
    <AppointmentForm
      v-model:form="form"
      @submit:add="submitAdd()"
      @cancel="dialogAdd = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
})

const stats = reactive({
  pending: 0,
  approved: 0,
  done: 0,
  rejected: 0,
  patientRecords: 0,
  totalProducts: 0,
})

const dialogAdd = ref(false)

const loadingStats = ref(false)

interface Stats {
  Pending: number
  Approved: number
  Done: number
  Rejected: number
}

interface Appointment {
  _id: string
  code: string
  fullName: string
  petName: string
  dateTime: string | Date
  status: string
}

const recentAppointments = ref<Appointment[]>([])

async function fetchDashboardData() {
  try {
    loadingStats.value = true
    const [statsData, appointmentsData, patientStats, productStats] = await Promise.all([
      $fetch<Stats>("/api/appointments/stats"),
      $fetch<{ items: Appointment[] }>("/api/appointments?status=Pending&limit=5"),
      $fetch<{ count: number }>("/api/patient-records/stats"),
      $fetch<{ count: number }>("/api/products/stats"),
    ])

    stats.pending = statsData.Pending ?? 0
    stats.approved = statsData.Approved ?? 0
    stats.done = statsData.Done ?? 0
    stats.rejected = statsData.Rejected ?? 0
    stats.patientRecords = patientStats.count ?? 0
    stats.totalProducts = productStats.count ?? 0

    recentAppointments.value = appointmentsData.items ?? []
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error)
  } finally {
    loadingStats.value = false
  }
}

onMounted(fetchDashboardData)

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "warning"
    case "Approved":
      return "success"
    case "Done":
      return "info"
    case "Rejected":
      return "error"
    default:
      return "grey"
  }
}

const formatDateTime = (dateTime?: string | Date) => {
  if (!dateTime) return 'Not set';
  const dt = new Date(dateTime);
  const datePart = dt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timePart = dt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
};

const { appointment } = useAppointment();
const form = ref(appointment);

function resetForm() {
  form.value = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    petName: "",
    petType: null,
    petBreed: "",
    petAge: "",
    services: [],
    dateTime: "",
  };
}

const handleAdd = () => {
  resetForm();
  dialogAdd.value = true;
}

async function submitAdd() {
  try {
    await $fetch("/api/appointments", {
      method: "POST",
      body: form.value,
    });
    dialogAdd.value = false;
    resetForm();
    fetchDashboardData();
    
  } catch (error) {
    console.error("Error:", error);
  }
}

</script>
