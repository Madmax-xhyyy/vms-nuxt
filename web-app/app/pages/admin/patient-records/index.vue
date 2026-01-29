<template>
  <v-container fluid>
    <!-- HEADER -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <div class="text-h5 font-weight-bold">Patient Records</div>
        <div class="text-caption text-grey">
          List of pets with completed visits
        </div>
      </v-col>
    </v-row>

    <!-- SEARCH -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search pet or owner"
          variant="outlined"
          density="comfortable"
          clearable
        />
      </v-col>
    </v-row>

    <!-- TABLE -->
    <v-card variant="outlined">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Pet Type</th>
            <th>Breed</th>
            <th>Owner</th>
            <th>Last Visit</th>
            <th width="120">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="patient in filteredPatients" :key="patient.id">
            <td class="font-weight-medium">
              {{ patient.petName }}
            </td>

            <td>{{ patient.petType }}</td>
            <td>{{ patient.petBreed }}</td>
            <td>{{ patient.ownerName }}</td>
            <td>{{ formatDate(patient.lastVisit) }}</td>

            <td>
              <v-btn
                size="small"
                variant="outlined"
                @click="view(patient)"
              >
                View Record
              </v-btn>
            </td>
          </tr>

          <tr v-if="!filteredPatients.length">
            <td colspan="6" class="text-center text-grey pa-6">
              No patient records found
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- VIEW RECORD DIALOG -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="font-weight-bold">
          Patient Record
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-row dense>
            <v-col cols="6">
              <strong>Pet Name:</strong> {{ selected.petName }}
            </v-col>
            <v-col cols="6">
              <strong>Pet Type:</strong> {{ selected.petType }}
            </v-col>

            <v-col cols="6">
              <strong>Breed:</strong> {{ selected.petBreed }}
            </v-col>
            <v-col cols="6">
              <strong>Owner:</strong> {{ selected.ownerName }}
            </v-col>

            <v-col cols="12">
              <strong>Services:</strong>
              <v-chip-group column>
                <v-chip
                  v-for="service in selected.services"
                  :key="service"
                  size="x-small"
                  variant="outlined"
                >
                  {{ service }}
                </v-chip>
              </v-chip-group>
            </v-col>

            <v-col cols="12">
              <strong>Visit Date:</strong>
              {{ formatDate(selected.lastVisit) }}
            </v-col>

            <v-col cols="12">
              <strong>Notes:</strong>
              <div class="text-caption text-grey">
                {{ selected.notes || 'No notes recorded.' }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const search = ref("");

const patients = ref([
  {
    id: 1,
    petName: "Buddy",
    petType: "Dog",
    petBreed: "Golden Retriever",
    ownerName: "Juan Dela Cruz",
    lastVisit: "2025-01-20",
    services: ["Vaccination", "Check-up"],
    notes: "Healthy, next vaccine in 6 months",
  },
  {
    id: 2,
    petName: "Mingming",
    petType: "Cat",
    petBreed: "Persian",
    ownerName: "Maria Santos",
    lastVisit: "2025-01-18",
    services: ["Deworming"],
    notes: "",
  },
]);

const filteredPatients = computed(() =>
  patients.value.filter(
    (p) =>
      p.petName.toLowerCase().includes(search.value.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.value.toLowerCase())
  )
);

/* VIEW RECORD */
const dialog = ref(false);
const selected = ref<any>({});

function view(patient: any) {
  selected.value = patient;
  dialog.value = true;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
