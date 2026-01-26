<template>
   <v-row no-gutters>
    <v-col cols="12">
      <v-row no-gutters>
        <h3>Appointment Requests</h3>
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
          items-per-page="20"
          hide-default-header
          hide-default-footer
          style="max-height: calc(100vh - (126px))"
          @click:row="(_: any, { item }: any) => handleRowClick(item)"
        >
          <template #item.createdAt="{ item }">
            {{ formatDate(item.createdAt) }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>

  <!--VIEW DIALOG -->
  <!-- <v-dialog v-model="dialogView" max-width="700" persistent>
    <JobPostForm
      v-model:form="selectedJobPost"
      mode="view"
      title="Job Post Details"
      @close="dialogView = false"
      @edit="handleDialogEdit()"
      @delete="handleDialogDelete()"
      @submit:update-status="handleStatusIntent"
    />
  </v-dialog> -->

  <!-- STATUS CONFIRMATION -->
  <!-- <v-dialog v-model="dialogStatus" max-width="420" persistent>
    <ConfirmationPrompt
      :title="statusDialogTitle"
      :actionLabel="pendingActionVerb"
      entityLabel="post"
      :content="statusConfirmationContent"
      @confirm="submitStatus()"
      @cancel="dialogStatus = false"
    />
  </v-dialog> -->

  <!-- DELETE DIALOG -->
  <!-- <v-dialog v-model="dialogDelete" width="450" persistent>
    <ConfirmationPrompt
      title="Delete Job Post"
      action="Delete Job Post"
      content="Are you sure you want to delete this job post?"
      @cancel="dialogDelete = false"
      @confirm="submitDelete()"
      v-model:message="message"
      :disabled="disabledDelete"
    />
  </v-dialog> -->
</template>
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const headers = [
  { title: "Date-time", value: "createdAt" },
  { title: "Full Name", value: "fullName" },
  { title: "Pet Name", value: "petName" },
  { title: "Service ", value: "service" },
  { title: "Status ", value: "status" },
];

const items = ref<Array<Record<string, any>>>([]);
const page = ref(1);
const pages = ref(10);
const pageRange = ref("-- - -- of --");
const route = useRoute();

const dialogView = ref(false);

const status = computed(() => (route.query.status as string) ?? "pending");
const selectedAppointment = ref<TAppointment>({} as TAppointment);

const { getAllPendingAppointments, getById } = useAppointment();

const {
  data: appointmentsData,
  refresh: _getAllPendingAppointments,
  status: statusAppointment,
} = await useLazyAsyncData(
  `get-appointments-${page.value}`,
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
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-CA");
}
async function handleRowClick(item: Record<string, any>) {
  try {
    const data = (await getById(item._id)) as TAppointment;
    selectedAppointment.value = data;
    dialogView.value = true;
  } catch (error) {
    console.error("Error:", error);
  }
}

</script>