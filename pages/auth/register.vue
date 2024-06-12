<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import { registerUser } from "~/modules/api/auth";

definePageMeta({
  title: "Register",
  description: "Register to CarpoolAid",
  layout: "auth",
  middleware: "exclude-if-logged-in",
});

const indexStore = useIndexStore();
const { isLoading } = storeToRefs(indexStore);

const errorMessage = ref<string | null>(null);

const validationSchema = yup.object({
  email: yup.string().email().required().label("Email"),
  password: yup.string().required().label("Password"),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: validationSchema,
});

const [email] = defineField("email");
const [password] = defineField("password");
const [confirmPassword] = defineField("confirmPassword");

const onSubmit = handleSubmit(async (values) => {
  const { data, error } = await registerUser(values.email, values.password);
  if (error) {
    errorMessage.value = error.message;
    return;
  } else {
    navigateTo("/auth/confirm-email");
  }
});
</script>

<template>
  <AuthTemplate variant="register">
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
      <Input
        v-model="confirmPassword"
        label="Confirm password"
        name="confirmPassword"
        type="password"
      />
      <p v-for="(error, index) in errors" :key="index" class="error">
        {{ error }}
      </p>
      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
      <div class="flex justify-between items-end">
        <Button variant="primary" type="submit" class="ml-auto capitalize">
          Register
        </Button>
      </div>
    </form>
  </AuthTemplate>
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
