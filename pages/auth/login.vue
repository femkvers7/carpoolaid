<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { loginUser } from "~/modules/api/auth";

definePageMeta({
  title: "Login",
  description: "Login to CarpoolAid",
  layout: "auth",
  middleware: "exclude-if-logged-in",
});

const errorMessage = ref<string | null>(null);

const validationSchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: yup.string().required().label("Password"),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: validationSchema,
});

const [email] = defineField("email");
const [password] = defineField("password");

const onSubmit = handleSubmit(async (values) => {
  const { data, error } = await loginUser(values.email, values.password);
  if (error) {
    errorMessage.value = "Something went wrong. Please try again.";
  } else {
    navigateTo("/");
  }
});
</script>

<template>
  <AuthTemplate variant="login">
    <form
      method="POST"
      class="mt-6 mb-5 flex flex-col gap-3"
      @submit.prevent="onSubmit"
    >
      <Input v-model="email" label="Email" name="email" type="email" />
      <Input
        v-model="password"
        label="Password"
        name="password"
        type="password"
      />
      <p v-for="(error, index) in errors" :key="index" class="error">
        {{ error }}
      </p>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
      <div class="flex justify-between items-end">
        <Button variant="tertiary" class="text-sm forgot-password" disabled>
          Forgot password?
        </Button>
        <Button variant="primary" type="submit" class="ml-auto capitalize">
          Login
        </Button>
      </div>
    </form>
  </AuthTemplate>
</template>

<style scoped>
.error {
  color: var(--red);
}

.forgot-password {
  color: var(--purple);
}
</style>
