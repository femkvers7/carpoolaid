<script setup lang="ts">
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <VFragment>
    <div>
      Please confirm your e-mail address to continue. You can close this window
    </div>
    <div class="mt-4">
      Didn't get an email? <i>You may already have an account</i>:
      <NuxtLink to="/auth/login" class="login">Log in</NuxtLink>
    </div>
  </VFragment>
</template>

<style>
.login {
  color: var(--red);
}
</style>
