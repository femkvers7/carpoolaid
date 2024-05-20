<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div>
    Email confirmation successful. You can now
    <nuxt-link to="/auth/login" class="redirect">login in</nuxt-link>
  </div>
</template>

<style>
.redirect {
  color: var(--red);
  text-decoration: underline;
}
</style>
