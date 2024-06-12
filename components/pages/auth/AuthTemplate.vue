<script setup lang="ts">
const props = defineProps<{
  variant: "login" | "register";
}>();

const authUrl = computed(() => {
  return props.variant === "login" ? "/auth/register" : "/auth/login";
});
</script>

<template>
  <VFragment>
    <div class="redirects">
      <Button
        variant="tertiary"
        class="gap-2 button-home"
        @click="$router.push('/')"
      >
        <Icon fill="var(--red)" size="16px" name="arrow-left" />
        Go back to homepage
      </Button>
    </div>
    <Popup class="wrapper">
      <div class="my-2">
        <h1 class="text-center capitalize">{{ variant }}</h1>

        <slot />
      </div>
    </Popup>
    <div class="redirects">
      <Button
        variant="tertiary"
        class="gap-2 ml-auto text-sm register"
        @click="$router.push(authUrl)"
      >
        {{
          variant === "login"
            ? "No account? Register"
            : "Already have an account? Login"
        }}
        <Icon fill="var(--purple)" size="16px" name="arrow-right" />
      </Button>
    </div>
  </VFragment>
</template>

<style scoped>
.redirects {
  display: flex;
  width: 400px;
  justify-content: space-between;

  .button-home {
    text-decoration: none;
  }
}

.wrapper {
  width: 400px;
  height: fit-content;
  margin: 0.5rem 0;
  padding: 1rem;
}

.forgot-password,
.register {
  color: var(--purple);
}
</style>
