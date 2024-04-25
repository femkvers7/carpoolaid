<script setup lang="ts"></script>

<template>
  <div>
    <div class="flex flex-col justify-center items-center mb-4">
      <h1>CarpoolAid</h1>
      <p class="intro">Your helper for arranging group carpools!</p>
    </div>
    <AddressForm />
    <MapTraditional class="map" />
  </div>
</template>

<style lang="scss">
.map {
  display: block;
  width: 100%;
  aspect-ratio: 16/9;
  margin-bottom: 5rem;
  position: relative;
}
</style>
