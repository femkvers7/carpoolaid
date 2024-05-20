<script setup lang="ts">
import * as yup from "yup";
import { registerUser } from "~/modules/api/auth";

definePageMeta({
  title: "Register",
  description: "Register to CarpoolAid",
  layout: "auth",
});

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
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const handleRegister = (values: Record<string, string>) => {
  console.log("registering user", values);
  registerUser(values.email, values.password);
  navigateTo("/auth/confirm-email");
};
</script>

<template>
  <AuthForm
    variant="register"
    :validation-schema="validationSchema"
    @form-submit="handleRegister"
  >
    <Input label="Email" name="email" type="email" />
    <Input label="Password" name="password" type="password" />
    <Input label="Confirm password" name="confirmPassword" type="password" />
  </AuthForm>
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
