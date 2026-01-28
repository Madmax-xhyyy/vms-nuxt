<template>
  <v-card width="100%" elevation="0">
    <v-toolbar color="grey-lighten-4" density="comfortable">
      <v-toolbar-title class="text-body-1 font-weight-bold">
        Reference: <span class="text-primary">{{ formModel.code }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-chip
        :color="statusColor"
        variant="flat"
        size="small"
        class="text-uppercase mr-4"
      >
        {{ formModel.status }}
      </v-chip>
    </v-toolbar>

    <v-card-text style="max-height: 75vh; overflow-y: auto" class="pa-4">
      <v-row dense>
        
        <v-col cols="12" class="mb-2">
          <div class="border rounded pa-3 bg-grey-lighten-5">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">Client Information</div>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Full Name:" /> {{ formModel.fullName }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Email:" /> {{ formModel.email }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Phone:" /> {{ formModel.phone }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Address:" /> {{ formModel.address }}
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" class="mb-2">
          <div class="border rounded pa-3 bg-grey-lighten-5">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">Pet Information</div>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Pet Name:" /> {{ formModel.petName }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Age:" /> {{ formModel.petAge }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <InputLabel title="Type:" /> {{ formModel.petType }}
              </v-col>
              <v-col cols="12" md="6">
                <InputLabel title="Breed:" /> {{ formModel.petBreed }}
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" class="mb-2">
          <div class="border rounded pa-3 bg-grey-lighten-5">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">Appointment Schedule</div>
            <v-row no-gutters>
              <v-col cols="12" md="6" class="mb-1">
                <InputLabel title="Date:" /> {{ formatDate(formModel.date as string) }}
              </v-col>
              <v-col cols="12" md="6" class="mb-1">
                <InputLabel title="Preferred Time:" /> {{ formatTime(formModel.time as string) }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
                <InputLabel title="Services:" />
                <v-chip-group column>
                  <v-chip 
                      v-for="service in formattedServices" 
                    :key="service" 
                    size="x-small" 
                    variant="outlined"
                  >
                    {{ service }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </div>
        </v-col>

      </v-row>
    </v-card-text>

    <v-divider></v-divider>

    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            tile
            block
            variant="text"
            class="text-none"
            size="48"
            @click="emits('close')"
          >
            Close
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-menu>
            <template #activator="{ props }">
              <v-btn
                block
                variant="flat"
                color="black"
                class="text-none"
                height="48"
                v-bind="props"
                tile
              >
                More actions
              </v-btn>
            </template>

            <v-list class="pa-0">
              <v-list-item @click="emits('submit:update-status', 'Approved')">
                <v-list-item-title class="text-subtitle-2">
                  Approve Request
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="emits('submit:update-status', 'Rejected')" class="text-red">
                <v-list-item-title class="text-subtitle-2">
                  Reject Request
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="emits('delete')" class="text-red">
                <v-list-item-title class="text-subtitle-2">
                  Delete Request
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
import { type PropType, computed } from 'vue';

const localProps = defineProps({
  mode: {
    type: String,
    default: "view",
  }
});


const emits = defineEmits(["close", "submit:update-status", "delete",]);

// Helpers
const statusColor = computed(() => {
  switch (formModel.value.status) {
    case 'Pending': return 'warning';
    case 'Approved': return 'success';
    case 'Done': return 'info';
    case 'Rejected': return 'error';
    default: return 'grey';
  }
});

const formattedServices = computed(() => {
  const services = formModel.value.services;
  if (Array.isArray(services)) return services;
  if (typeof services === 'string') return (services as string).split(',');
  return [] as string[];
});

const formatDate = (date?: string | Date) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timeString?: string) => {
  if (!timeString) return 'Not set';

  const parts = timeString.split(':').map(Number);
  if (parts.length < 2 || parts.some(isNaN)) return 'Invalid time';

  const hours = parts[0] as number;
  const minutes = parts[1] as number;
  
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const formModel = defineModel({
  type: Object as PropType<TAppointment>,
  default: () => useAppointment().appointment.value,
});
</script>