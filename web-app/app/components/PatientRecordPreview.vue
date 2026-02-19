<template>
  <v-card width="100%" elevation="0">
    <!-- HEADER -->
    <v-toolbar color="grey-lighten-4 px-6" density="compact">
      <v-toolbar-title class="text-body-1 ma-0 font-weight-bold">
        Patient Record
      </v-toolbar-title>

      <v-spacer />

      <v-chip color="primary" variant="flat" size="small">
        {{ formModel?.ownerEmail }}
      </v-chip>
    </v-toolbar>

    <!-- BODY -->
    <v-card-text style="max-height: 75vh; overflow-y: auto" class="pa-4">
      <v-row dense v-if="formModel">

        <!-- OWNER INFO -->
        <v-col cols="12" class="mb-2">
          <div class="border rounded pa-3 bg-grey-lighten-5">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">
              Owner Information
            </div>

            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Name:" /> {{ formModel.ownerName }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Email:" /> {{ formModel.ownerEmail }}
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Phone:" /> {{ formModel.ownerPhone }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Address:" /> {{ formModel.ownerAddress }}
              </v-col>
            </v-row>
          </div>
        </v-col>

        <!-- PETS -->
        <v-col
          cols="12"
          v-for="(pet, petIndex) in formModel.pets"
          :key="petIndex"
          class="mb-2"
        >
          <div class="border rounded pa-3 bg-grey-lighten-5">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">
              Pet Information
            </div>

            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Name:" /> {{ pet.petName }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Age:" /> {{ pet.petAge }}
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Type:" /> {{ pet.petType }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Breed:" /> {{ pet.petBreed }}
              </v-col>
            </v-row>

            <!-- VISIT HISTORY -->
            <v-divider class="my-3" />
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">
              Visit History
            </div>

            <v-table density="comfortable">
              <thead class="bg-blue-lighten-5">
                <tr>
                  <th>Date & Time</th>
                  <th>Services</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(visit, visitIndex) in pet.history"
                  :key="visitIndex"
                >
                  <td>{{formatDateTime(visit.dateTime)}}</td>
                  <td>
                    <v-chip
                      v-for="(service, i) in visit.services"
                      :key="i"
                      size="x-small"
                      class="ma-1"
                      variant="outlined"
                    >
                      {{ service }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-col>

      </v-row>
    </v-card-text>

    <v-divider />

    <!-- FOOTER -->
    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            tile
            block
            variant="text"
            class="text-none"
            height="48"
            @click="emits('close')"
          >
            Close
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-menu location="top">
            <template #activator="{ props }">
              <v-btn
                block
                variant="flat"
                color="primary"
                class="text-none"
                height="48"
                v-bind="props"
                tile
              >
                More actions
              </v-btn>
            </template>

            <v-list class="pa-0">
              <v-list-item
                @click="emits('edit')"
              >
                <v-list-item-title class="text-subtitle-2">
                Edit
              </v-list-item-title>
            </v-list-item>


          <v-list-item
            @click="emits('delete')"
            class="bg-red-lighten-1"
          >
            <v-list-item-title class="text-subtitle-2">
              Delete
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
      </v-row>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">
import { type PropType } from "vue";

const emits = defineEmits(["close", "edit", "delete"]);

const formModel = defineModel({
  type: Object as PropType<TPatientRecord>,
  default: () => usePatientRecord().patientRecord.value,
});

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

</script>
