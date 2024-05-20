<script setup lang="ts">
import * as yup from "yup";

const props = defineProps<{
  variant: "login" | "register";
  validationSchema: yup.ObjectSchema<any>;
}>();

const emit = defineEmits(["formSubmit"]);

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
        <Icon fill="var(--purple)" size="16px" name="arrow-left" />
        Go back to homepage
      </Button>
    </div>
    <Popup width="400px" height="fit-content" class="my-2">
      <div class="my-2">
        <h1 class="text-center capitalize">{{ variant }}</h1>
        <Form
          class="mt-6 mb-5 flex flex-col gap-3"
          :validation-schema="validationSchema"
          @on-submit="emit('formSubmit', $event)"
        >
          <slot />
          <div class="flex justify-between items-end">
            <Button
              v-if="variant === 'login'"
              variant="tertiary"
              class="text-sm forgot-password"
              disabled
            >
              Forgot password?
            </Button>
            <Button type="submit" class="ml-auto capitalize">
              {{ variant }}
            </Button>
          </div>
        </Form>
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
        <Icon fill="var(--red)" size="16px" name="arrow-right" />
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

.forgot-password,
.register {
  color: var(--purple);
}
</style>
