<script setup lang="ts">
import * as yup from "yup";
import { loginUser } from "~/modules/api/auth";

definePageMeta({
  title: "Login",
  description: "Login to CarpoolAid",
  layout: "auth",
  middleware: "exclude-if-logged-in",
});

const errorMessage = ref<string | null>(null);

// check if logged in
const jwt = useCookie("sb-access-token");
const isLoggedIn = computed(() => !!jwt.value);

// onBeforeMount(() => {
//   if (isLoggedIn.value) {
//     navigateTo("/");
//   }
// });

const validationSchema = yup.object({
  email: yup.string().required().label("Email"),
  password: yup.string().required().label("Password"),
});

const handleLogin = async (values: Record<string, string>) => {
  console.log("logging in user", values);
  const { data, error } = await loginUser(values.email, values.password);
  if (error) {
    errorMessage.value = "Something went wrong. Please try again.";
  } else {
    navigateTo("/");
  }
};
</script>

<template>
  <AuthForm
    variant="login"
    :validation-schema="validationSchema"
    @form-submit="handleLogin"
  >
    <Input label="Email" name="email" type="email" />
    <Input label="Password" name="password" type="password" />
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </AuthForm>
</template>

<style scoped>
.error {
  color: var(--red);
}
</style>
