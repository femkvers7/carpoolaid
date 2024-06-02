<script setup lang="ts">
import { deleteTrip } from "~/modules/api/trips";

const props = defineProps<{
  tripId: string;
}>();

const emit = defineEmits(["close"]);

const handleDelete = async () => {
  console.log("delete trip");
  await deleteTrip(props.tripId);
  emit("close", true);
};
</script>

<template>
  <div class="backdrop">
    <Popup class="save-popup">
      <Icon
        fill="var(--purple)"
        size="16px"
        name="cross"
        class="absolute top-4 right-4 cursor-pointer"
        @click="$emit('close')"
      />
      <h3>Delete your trip</h3>
      <p class="mt-4">Are you sure you want to delete this trip?</p>
      <p class="mb-4">
        All data associated with this trip will also be deleted.
      </p>
      <div class="flex justify-between">
        <Button type="submit" variant="" @click="$emit('close')">Cancel</Button>
        <Button type="submit" @click="handleDelete">Delete</Button>
      </div>
    </Popup>
  </div>
</template>

<style>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 101;
}

.save-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  padding: 1.5rem;
  width: fit-content;
  height: fit-content;

  text-align: center;
}
</style>
