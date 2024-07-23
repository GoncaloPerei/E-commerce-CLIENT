<script setup>
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/AuthService";
import AuthForm from "@/components/AuthForm.vue";
import InputText from "primevue/inputtext";
import AuthError from "@/components/AuthError.vue";

const router = useRouter();

const authStore = useAuthStore();

const handleSubmit = async () => {
  try {
    await authStore.login();
    alert(authStore?.response?.message);
    router.push({ path: "/" });
  } catch (error) {
    console.log(error);
  }
};

onUnmounted(async () => {
  await authStore.clearFields();
});
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <AuthForm
      @handle-submit="handleSubmit()"
      head="Login"
      subhead="Login to start shooping!"
      button="Login"
      footer="Don't have an account yet?"
      footerBold="Register now!"
      link="/auth/register"
    >
      <template #input>
        <div class="flex flex-col gap-2.5 mb-4">
          <label for="email" class="w-24 tracking-wider">Email</label>
          <InputText
            class="border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider"
            id="email"
            autocomplete="off"
            placeholder="Email"
            v-model="authStore.email"
          />
          <AuthError v-if="authStore?.errors">{{
            authStore?.errors
          }}</AuthError>
        </div>
        <div class="flex flex-col gap-2.5 mb-4">
          <label for="password" class="w-auto tracking-wider">Password</label>
          <InputText
            class="border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider"
            id="password"
            autocomplete="off"
            type="password"
            placeholder="Password"
            v-model="authStore.password"
          />
          <AuthError v-if="authStore?.errors">{{
            authStore?.errors
          }}</AuthError>
        </div>
      </template>
    </AuthForm>
  </div>
</template>
