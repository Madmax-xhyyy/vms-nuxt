<template>
  <div class="arrow-navigation">
    <v-btn
      icon="mdi-chevron-left"
      variant="text"
      density="comfortable"
      :disabled="page <= 1"
      @click="decrement"
    />
    <v-btn
      icon="mdi-chevron-right"
      variant="text"
      density="comfortable"
      :disabled="page >= props.length"
      @click="increment"
    />
  </div>
</template>

<script setup lang="ts">
const page = defineModel({ type: Number, default: 0 });
function increment() {
  page.value++;
}

function decrement() {
  page.value--;
}
const emit = defineEmits(["update:value"]);
watch(page, () => {
  emit("update:value", page.value);
});

const props = defineProps({
  length: {
    type: Number,
    required: true,
    default: 0,
  },
});
</script>
