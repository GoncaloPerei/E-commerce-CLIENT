<script setup>
import { onUnmounted } from "vue";
import { useAuthStore } from "@/store/AuthService";
import { useRouter } from "vue-router";
import AuthForm from "@/components/AuthForm.vue";
import InputText from "primevue/inputtext";
import AuthError from "@/components/AuthError.vue";

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  try {
    await authStore.register();
    alert(authStore?.response?.message);
    router.push({ path: "/auth/login" });
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
      head="Register"
      subhead="Register to start shooping!"
      button="Register"
      footer="Already have an account?"
      footerBold="Login now!"
      link="/auth/login"
    >
      <template #input>
        <div class="flex flex-col gap-2.5 mb-4">
          <label for="fullName" class="w-auto tracking-wider">Full Name</label>
          <InputText
            class="border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider"
            id="fullName"
            autocomplete="off"
            placeholder="Full Name"
            v-model="authStore.fullName"
          />
          <AuthError v-if="authStore?.errors?.fullName">{{
            authStore?.errors?.fullName.toString()
          }}</AuthError>
        </div>
        <div class="flex flex-col gap-2.5 mb-4">
          <label for="email" class="w-24 tracking-wider">Email</label>
          <InputText
            class="border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider"
            id="email"
            autocomplete="off"
            placeholder="Email"
            v-model="authStore.email"
          />
          <AuthError v-if="authStore?.errors?.email">{{
            authStore?.errors?.email.toString()
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
          <AuthError v-if="authStore?.errors?.password">{{
            authStore?.errors?.password.toString()
          }}</AuthError>
        </div>
      </template>
    </AuthForm>
  </div>
</template>
