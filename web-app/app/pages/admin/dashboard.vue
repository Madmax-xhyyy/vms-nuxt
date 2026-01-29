<template>
  <v-container fluid>
    <!-- PAGE TITLE -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-h5 font-weight-bold">Dashboard</div>
        <div class="text-caption text-grey">
          Overview of appointments and clinic activity
        </div>
      </v-col>
    </v-row>

    <!-- STATS CARDS -->
    <v-row dense class="mb-4">
      <v-col cols="12" sm="6" md="3">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-caption text-grey">Pending Appointments</div>
            <div class="text-h5 font-weight-bold text-warning">
              {{ stats.pending }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-caption text-grey">Approved</div>
            <div class="text-h5 font-weight-bold text-success">
              {{ stats.approved }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-caption text-grey">Completed</div>
            <div class="text-h5 font-weight-bold text-info">
              {{ stats.done }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card variant="outlined">
          <v-card-text>
            <div class="text-caption text-grey">Rejected</div>
            <div class="text-h5 font-weight-bold text-error">
              {{ stats.rejected }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- QUICK ACTIONS -->
    <v-row dense class="mb-4">
      <v-col cols="12" md="4">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-bold">
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
              @click="navigateTo('/admin/appointments/add')"
            >
              Add Appointment
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- RECENT APPOINTMENTS -->
      <v-col cols="12" md="8">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 font-weight-bold">
            Recent Appointments
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
                  <td>{{ formatDate(item.date) }}</td>
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
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const stats = reactive({
  pending: 0,
  approved: 0,
  done: 0,
  rejected: 0,
});

// 🔹 replace with API later
const recentAppointments = ref([
  {
    _id: "1",
    code: "APT-001",
    fullName: "Juan Dela Cruz",
    petName: "Buddy",
    date: new Date(),
    status: "Pending",
  },
  {
    _id: "2",
    code: "APT-002",
    fullName: "Maria Santos",
    petName: "Milo",
    date: new Date(),
    status: "Approved",
  },
]);

function getStatusColor(status: string) {
  switch (status) {
    case "Pending":
      return "warning";
    case "Approved":
      return "success";
    case "Done":
      return "info";
    case "Rejected":
      return "error";
    default:
      return "grey";
  }
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
