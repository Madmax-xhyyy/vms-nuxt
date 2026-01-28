<template>
  <v-card width="100%">
    <v-toolbar density="compact" class="pl-4">
      <span class="font-weight-medium text-h5 text-capitalize">
        {{ localProps.title }}
      </span>
    </v-toolbar>

    <v-card-text>
      <p class="text-subtitle-2 text-center">
        {{ localProps.content }}
      </p>

      <v-alert
        v-if="message"
        type="error"
        variant="flat"
        closable
        position="absolute"
        location="bottom"
        style="bottom: 48px"
        @click:close="message = ''"
        width="100%"
        tile
        class="text-caption"
      >
        {{ message }}
      </v-alert>
    </v-card-text>

    <v-toolbar density="compact">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            tile
            block
            size="48"
            variant="text"
            class="text-none"
            @click="emits('cancel')"
            :disabled="localProps.disabled"
          >
            Cancel
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            tile
            block
            size="48"
            color="black"
            variant="flat"
            class="text-none"
            @click="emits('confirm')"
            :disabled="localProps.disabled"
          >
            {{ localProps.action }}
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
    default: "Title",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  action: {
    type: String,
    default: "Submit",
  },
  content: {
    type: String,
    default: "Are you sure you want to proceed?",
  },
});

const emits = defineEmits(["cancel", "confirm"]);

const message = defineModel("message", { default: "" });
</script>
