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
        :loading="loadingPatientRecord"
      >
        <v-toolbar density="compact" color="blue-lighten-5">
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

  <v-dialog v-model="dialogView" max-width="700" persistent>
    <PatientRecordPreview
      v-model="form"
      title="Patient Record Details"
      mode="view"
      @close="dialogView = false"
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

const headers = [
  { title: "Full Name", value: "ownerName" },
  { title: "Email", value: "ownerEmail" },
  { title: "Phone", value: "ownerPhone" },
  { title: "Pets Name", value: "pets.petName" },
];

const dialogView = ref(false);


const { patientRecord, getAllPatientRecords } = usePatientRecord();

const form = ref(patientRecord);
const items = ref<Array<TPatientRecord>>([]);

const{ 
  data: PatientRecordData,
  refresh: _getAllPatientRecords,
  status: statusPatientRecord,
} = await useLazyAsyncData(
  `get-all-patient-records-${page.value}`,
  () => getAllPatientRecords({ page: page.value }),
  {
    watch: [page],
  },
);

watchEffect(() => {
  if (PatientRecordData.value) {
    items.value = PatientRecordData.value.items;
    pages.value = PatientRecordData.value.pages;
    pageRange.value = PatientRecordData.value.pageRange;
  }
});

const loadingPatientRecord = computed(() => statusPatientRecord.value === "pending");

function handleRowClick(_: any, data: any) {
  Object.assign(form.value, JSON.parse(JSON.stringify(data.item)));
  dialogView.value = true;
};
</script>
