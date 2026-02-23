<template>
  <v-card width="100%" rounded="lg" elevation="1">
    <!-- Header -->
    <v-card-title class="text-center bg-primary py-4" >
      <span class="text-h6 font-weight-bold">{{ localProps.title }}</span>
    </v-card-title>

    <v-divider />

    <!-- Form -->
    <v-card-text style="max-height: 100vh; overflow-y: auto" class="mt-4">
      <v-form v-model="valid">
        <!-- Owner Info -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.fullName"
              label="Owner Name"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.email"
              label="Email"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.phone"
              label="Phone"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.address"
              label="Address"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <!-- Pet Info -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.petName"
              label="Pet Name"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="formModel.petType"
              label="Pet Type"
              variant="outlined"
              :items="petTypeKeys"
              :rules="[requiredRule]"
              @update:model-value="onPetTypeChange"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="formModel.petBreed"
              label="Pet Breed"
              variant="outlined"
              :items="breedForSelectedType"
              :rules="[requiredRule]"
              :disabled="!formModel.petType"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formModel.petAge"
              label="Pet Age"
              variant="outlined"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <!-- Services -->
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="formModel.services"
              label="Services"
              variant="outlined"
              multiple
              :items="services"
              :rules="[requiredRule]"
            />
          </v-col>
        </v-row>

        <!-- Schedule -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="selectedDate"
              label="Date"
              type="date"
              variant="outlined"
              :rules="[requiredRule]"
              :min="minDate"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedTime"
              label="Time Slot"
              variant="outlined"
              :items="timeSlotItems"
              :rules="[requiredRule]"
              :disabled="!selectedDate || loadingSlots"
              :loading="loadingSlots"
              placeholder="Select a date first"
            />
          </v-col>
        </v-row>
      </v-form>
    
    </v-card-text>

    <!-- Action -->
    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6" v-if="localProps.mode !== 'submit-only'">
          <v-btn
            tile
            block
            variant="text"
            class="text-none"
            size="48"
            @click="emits('cancel')"
          >
            Cancel
          </v-btn>
        </v-col>

        <v-col :cols="localProps.mode !== 'submit-only' ? 6 : 12">
          <v-btn
            tile
            block
            variant="flat"
            color="primary"
            class="text-none"
            size="48"
            @click="emits('submit:add')"
            :disabled="!valid"
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
  </v-card>
</template>

<script setup lang="ts">

const localProps = defineProps({
  title: {
    type: String,
    default: "Book an Appointment",
  },
  mode: {
    type: String,
    default: "add",
  },
});

const emits = defineEmits(["cancel", "success", "submit:add", "submit-only"]);

const { petTypeKeys, petBreeds, services, getBusySlots } = useAppointment();


const formModel = defineModel("form", {
  type: Object as PropType<TAppointment>,
  default: () => useAppointment().appointment,
});

const breedForSelectedType = computed(() => {
  return petBreeds(formModel.value.petType as PetType);
});

const valid = ref(false);

function onPetTypeChange() {
  formModel.value.petBreed = "";
}

const requiredRule = (v: any) => {
  if (Array.isArray(v)) return v.length > 0 || "Required.";
  return !!v || "Required.";
};

// Date & Time Logic
const selectedDate = ref("");
const selectedTime = ref("");
const busySlots = ref<string[]>([]);
const loadingSlots = ref(false);

const minDate = new Date().toISOString().split("T")[0];

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

const timeSlotItems = computed(() => {
  return timeSlots.map(time => {
    const isBusy = busySlots.value.some(busyTime => {
      const bt = new Date(busyTime);
      if (isNaN(bt.getTime())) return false;
      
      // Strict check: must be the same LOCAL day as selectedDate
      const year = bt.getFullYear();
      const month = (bt.getMonth() + 1).toString().padStart(2, "0");
      const day = bt.getDate().toString().padStart(2, "0");
      const busySlotDate = `${year}-${month}-${day}`;
      
      if (busySlotDate !== selectedDate.value) return false;

      const hours = bt.getHours().toString().padStart(2, "0");
      const minutes = bt.getMinutes().toString().padStart(2, "0");
      const busySlotTime = `${hours}:${minutes}`;
      return busySlotTime === time;
    });

    return {
      title: isBusy ? `${time} - Occupied` : time,
      value: time,
      props: {
        disabled: isBusy
      }
    };
  });
});

watch(selectedDate, async (newDate) => {
  if (newDate) {
    loadingSlots.value = true;
    try {
      const res = await getBusySlots(newDate);
      busySlots.value = res;
      
      if (selectedTime.value) {
        const matchingSlot = timeSlotItems.value.find(item => item.value === selectedTime.value);
        if (matchingSlot?.props?.disabled) {
          selectedTime.value = "";
        }
      }
    } catch (e) {
      console.error("Failed to fetch busy slots", e);
    } finally {
      loadingSlots.value = false;
    }
  } else {
    busySlots.value = [];
  }
});

watch([selectedDate, selectedTime], ([newDate, newTime]) => {
  if (newDate && newTime) {
    const dParts = newDate.split("-");
    const tParts = newTime.split(":");
    if (dParts.length === 3 && tParts.length === 2) {
      // Use ! to tell TS we know these exist because of the length check
      const yearVal = parseInt(dParts[0]!, 10);
      const monthVal = parseInt(dParts[1]!, 10);
      const dayVal = parseInt(dParts[2]!, 10);
      const hourVal = parseInt(tParts[0]!, 10);
      const minuteVal = parseInt(tParts[1]!, 10);
      
      formModel.value.dateTime = new Date(yearVal, monthVal - 1, dayVal, hourVal, minuteVal);
    }
  } else {
    formModel.value.dateTime = "";
  }
});

// If editing, try to pre-fill from formModel.dateTime
onMounted(() => {
  if (formModel.value.dateTime) {
    const dt = new Date(formModel.value.dateTime);
    if (!isNaN(dt.getTime())) {
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1).toString().padStart(2, "0");
      const d = dt.getDate().toString().padStart(2, "0");
      selectedDate.value = `${y}-${m}-${d}`;
      
      const hours = dt.getHours().toString().padStart(2, "0");
      const minutes = dt.getMinutes().toString().padStart(2, "0");
      selectedTime.value = `${hours}:${minutes}`;
    }
  }
});

</script>
