<template>
  <div>
    <address-input state="initial" />
    <address-input
      state="edit"
      :initial-values="{
        id: 'ce56d9a6-662b-4cb0-bb49-5efc3f8fcab9',
        coordinates: [0.441403, 51.255829],
        address: {
          country: 'United Kingdom',
          place: 'Maidstone',
          street: '',
          address_number: '',
        },
        carAvailable: true,
        carSeats: 4,
        label: 'test',
      }"
    />
  </div>
</template>
