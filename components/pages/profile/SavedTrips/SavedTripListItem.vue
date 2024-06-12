<script setup lang="ts">
import { getTripById } from "~/modules/api/trips";
import type { Tables } from "~/types/supabase";

const props = defineProps<{
  trip: Tables<"trips"> & { locations: Tables<"locations">[] };
}>();

const emit = defineEmits(["refresh"]);

const router = useRouter();

const indexStore = useIndexStore();
const { isLoading, subtleLoading } = storeToRefs(indexStore);

const suggestionsStore = useHomeSuggestionsStore();
const { suggestions } = storeToRefs(suggestionsStore);

const homeMapStore = useHomeMapStore();
const { destinationLocation, carpoolLocations } = storeToRefs(homeMapStore);

const csvStore = useHomeCsvStore();

const deleteIsOpen = ref(false);

const setTripData = (
  data: Tables<"trips"> & {
    locations: Tables<"locations">[];
    groups: Tables<"groups">[];
  },
) => {
  // set location data & routes
  destinationLocation.value = data!.locations
    .filter((loc) => loc.type === "destination")
    .map((loc) => {
      return {
        id: loc.id,
        coordinates: [loc.long, loc.lat],
        name: loc?.name ?? undefined,
        place: loc?.place ?? undefined,
        carSeats: loc?.car_seats ?? undefined,
        groupId: loc.group_id ?? undefined,
        fullAddress: loc?.full_address ?? undefined,
      };
    })[0];
  carpoolLocations.value = data!.locations
    .filter((loc) => loc.type === "carpool")
    .map((loc) => {
      return {
        id: loc.id,
        coordinates: [loc.long, loc.lat],
        name: loc?.name ?? undefined,
        place: loc?.place ?? undefined,
        carSeats: loc?.car_seats ?? undefined,
        groupId: loc.group_id ?? undefined,
        fullAddress: loc?.full_address ?? undefined,
      };
    });

  // set suggestions
  suggestions.value = data!.groups.map((group) => {
    const driver = data!.locations.find(
      (loc) => loc.group_id === group.id && loc.group_role === "driver",
    );

    const passengers = data!.locations
      .filter(
        (loc) => loc.group_id === group.id && loc.group_role === "carpool",
      )
      .map((loc) => loc.id);

    return {
      id: group.id,
      driver: driver!.id,
      capacity: driver!.car_seats ?? 0,
      passengers: passengers,
    };
  });
};

/** Open a saved trip from profile  */
const handleOpenTrip = async () => {
  try {
    isLoading.value = true;

    // reset all data
    homeMapStore.reset();
    csvStore.reset();
    suggestionsStore.reset();

    // fetch detailed trip data
    const { data } = await getTripById(props.trip.id);
    setTripData(data!);
    homeMapStore.updateRoutes();
    router.push("/");
  } catch (err) {
    throw showError({
      statusCode: 500,
      statusMessage: "Failed to open trip",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <VFragment>
    <li>
      <div class="flex gap-1">
        <p class="trip__name">{{ trip.name }}</p>
        <p class="trip__destination">- {{ trip.locations[0]?.full_address }}</p>
      </div>
      <div class="flex flex-row gap-4">
        <p class="trip__timestamp">{{ formatTimestamp(trip.created_at) }}</p>
        <Button variant="neutral" @click="deleteIsOpen = true">
          <Icon fill="var(--red-subtle)" size="16px" name="trash" />
        </Button>
        <Button variant="neutral" @click="handleOpenTrip">
          <Icon fill="var(--purple)" size="16px" name="arrow-right"
        /></Button>
      </div>
    </li>
    <ConfirmDeletePopup
      v-if="deleteIsOpen"
      :trip-id="trip.id"
      @close="deleteIsOpen = false"
      @refresh="$emit('refresh')"
    />
  </VFragment>
</template>

<style scoped lang="scss">
li {
  padding: 1rem 0;
  border-bottom: 1px solid var(--purple);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .trip__timestamp {
    font-size: 0.75rem;
  }

  .trip__name {
    font-weight: bold;
  }

  .trip__destination {
    font-size: 0.85rem;
    font-style: italic;
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
