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
        
        <v-col cols="12" class="mb-4">
          <div class="border rounded pa-3">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">Client Information</div>
            <v-row no-gutters>
              <v-col cols="12" class="mb-1">
                <InputLabel title="Full Name:" /> {{ formModel.fullName }}
              </v-col>
              <v-col cols="12" sm="6" class="mb-1">
                <InputLabel title="Email:" /> {{ formModel.email }}
              </v-col>
              <v-col cols="12" sm="6" class="mb-1">
                <InputLabel title="Phone:" /> {{ formModel.phone }}
              </v-col>
              <v-col cols="12">
                <InputLabel title="Address:" /> {{ formModel.address }}
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" class="mb-4">
          <div class="border rounded pa-3 bg-blue-grey-lighten-5">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">Pet Information</div>
            <v-row no-gutters>
              <v-col cols="12" sm="6" class="mb-1">
                <InputLabel title="Pet Name:" /> {{ formModel.petName }}
              </v-col>
              <v-col cols="12" sm="6" class="mb-1">
                <InputLabel title="Type / Breed:" /> {{ formModel.petType }} ({{ formModel.petBreed }})
              </v-col>
              <v-col cols="12">
                <InputLabel title="Age:" /> {{ formModel.petAge }}
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" class="mb-4">
          <div class="border rounded pa-3">
            <div class="text-caption text-uppercase font-weight-bold text-grey mb-2">Appointment Schedule</div>
            <v-row no-gutters>
              <v-col cols="12" sm="6" class="mb-1">
                <InputLabel title="Date:" /> {{ formatDate(formModel.date) }}
              </v-col>
              <v-col cols="12" sm="6" class="mb-1">
                <InputLabel title="Preferred Time:" /> {{ formModel.time }}
              </v-col>
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
              <v-list-item @click="emits('approve')">
                <v-list-item-title class="text-subtitle-2">
                  Approve Request
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="emits('reject')" class="text-red">
                <v-list-item-title class="text-subtitle-2">
                  Reject Request
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

const localProps = defineProps({
  mode: {
    type: String,
    default: "view",
  },
});

const emits = defineEmits(["close", "approve", "reject"]);

// Helpers
const statusColor = computed(() => {
  const status = formModel.value.status?.toLowerCase();
  switch (status) {
    case 'pending': return 'warning';
    case 'confirmed': return 'success';
    case 'cancelled': return 'error';
    default: return 'grey';
  }
});

const formattedServices = computed(() => {
  if (Array.isArray(formModel.value.services)) return formModel.value.services;
  return formModel.value.services ? formModel.value.services.split(',') : []; 
});

const formatDate = (date: string) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formModel = defineModel({
  type: Object as PropType<TAppointment>,
  default: () => useAppointment().appointment.value,
});
</script>