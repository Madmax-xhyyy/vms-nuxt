<template>
  <v-card width="100%" elevation="0">
    <!-- HEADER -->
    <v-toolbar density="comfortable">
      <v-toolbar-title class="font-weight-bold">
        {{ localProps.title }}
      </v-toolbar-title>
    </v-toolbar>

    <!-- BODY -->
    <v-card-text class="pa-6" style="max-height: 100vh; overflow-y: auto">
      <!-- VIEW MODE -->
      <v-row v-if="localProps.mode === 'view'" no-gutters>
        <v-col cols="12" class="mb-4">
          <v-sheet rounded="lg" border class="pa-5">
            <v-row>
              <v-col cols="12" class="font-weight-bold mb-2">
                Appointment Details
              </v-col>

              <v-col cols="6">
                <strong>Owner:</strong> {{ formModel.ownerId }}
              </v-col>

              <v-col cols="6">
                <strong>Pet:</strong> {{ formModel.petId }}
              </v-col>

              <v-col cols="6">
                <strong>Service:</strong> {{ formModel.serviceId }}
              </v-col>

              <v-col cols="6">
                <strong>Status:</strong>
                <v-chip color="success" size="small">
                  {{ formModel.status }}
                </v-chip>
              </v-col>

              <v-col cols="6">
                <strong>Date:</strong> {{ formModel.appointmentDate }}
              </v-col>

              <v-col cols="6">
                <strong>Time:</strong> {{ formModel.appointmentTime }}
              </v-col>

              <v-col cols="12" v-if="formModel.notes">
                <strong>Notes:</strong>
                <div class="mt-1">{{ formModel.notes }}</div>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>

      <!-- FORM MODE -->
      <v-form v-else ref="formRef" v-model="isFormValid">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="formModel.ownerId"
              label="Owner"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="formModel.petId"
              label="Pet"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formModel.serviceId"
              label="Service"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="formModel.appointmentDate"
              type="date"
              label="Appointment Date"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="6">
            <v-text-field
              v-model="formModel.appointmentTime"
              type="time"
              label="Appointment Time"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="formModel.notes"
              label="Notes"
              rows="3"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-form>

      <v-alert
        v-if="message"
        type="error"
        variant="tonal"
        class="mt-4"
        closable
        @click:close="message = ''"
      >
        {{ message }}
      </v-alert>
    </v-card-text>

    <!-- FOOTER ACTIONS -->
    <v-divider />

    <v-toolbar density="compact">
      <v-row no-gutters>
        <!-- VIEW MODE -->
        <template v-if="localProps.mode === 'view'">
          <v-col cols="6">
            <v-btn block variant="text" @click="emits('close')">
              Close
            </v-btn>
          </v-col>

          <v-col cols="6">
            <v-btn block color="primary" @click="emits('edit')">
              Edit
            </v-btn>
          </v-col>
        </template>

        <!-- ADD / EDIT MODE -->
        <template v-else>
          <v-col cols="6">
            <v-btn block variant="text" @click="emits('cancel')">
              Cancel
            </v-btn>
          </v-col>

          <v-col cols="6" v-if="localProps.mode === 'add'">
            <v-btn
              block
              color="primary"
              :disabled="!isFormValid"
              @click="emits('submit:add')"
            >
              Save & Approve
            </v-btn>
          </v-col>

          <v-col cols="6" v-if="localProps.mode === 'edit'">
            <v-btn
              block
              color="primary"
              :disabled="!isFormValid"
              @click="emits('submit:update')"
            >
              Save Changes
            </v-btn>
          </v-col>
        </template>
      </v-row>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const localProps = defineProps({
  title: {
    type: String,
    default: "Admin Appointment Form",
  },
  mode: {
    type: String as PropType<"add" | "edit" | "view">,
    default: "add",
  },
});

const emits = defineEmits([
  "submit:add",
  "submit:update",
  "cancel",
  "close",
  "edit",
]);

const requiredRule = (v: any) => !!v || "This field is required";

const message = defineModel("message", {
  type: String,
  default: "",
});

const isFormValid = ref(false);

const formModel = defineModel("form", {
  type: Object as PropType<{
    ownerId: string;
    petId: string;
    serviceId: string;
    appointmentDate: string;
    appointmentTime: string;
    notes?: string;
    status?: string;
  }>,
  default: () => ({
    ownerId: "",
    petId: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
    status: "Approved", // ✅ ADMIN DEFAULT
  }),
});
</script>
