<script setup lang="ts">
import * as yup from "yup";
import { useForm } from "vee-validate";

const props = defineProps<{
  validationSchema: yup.ObjectSchema<any>;
  showSubmitButton?: boolean;
  buttonLabel?: string;
}>();

const emits = defineEmits(["onSubmit"]);

const { values, handleSubmit } = useForm({
  validationSchema: props.validationSchema,
});

const onSubmit = handleSubmit((values) => {
  emits("onSubmit", values);
});
</script>

<!-- If you want to execute an action when submitting the form
you have to use submitForm instead of handleSubmit-->

<template>
  <form action="" class="form" @submit="onSubmit">
    <slot />
    <Button v-if="showSubmitButton" type="submit">{{ buttonLabel }}</Button>
  </form>
</template>
