<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/AuthService";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import AuthError from "@/components/AuthError.vue";
import ModifyData from "@/components/ModifyData.vue";

const router = useRouter();

const authStore = useAuthStore();

const visible = ref(false);
const visible1 = ref(false);

const addBalance = async () => {
  try {
    await authStore.updateProfile();
    visible.value = false;
    alert(authStore?.response?.message);
  } catch (error) {
    console.log(error);
  }
};

const addCard = async () => {
  try {
    await authStore.addCard();
    visible1.value = false;
    alert(authStore?.response?.message);
  } catch (error) {
    console.log(error);
  }
};

const editCard = async (visible, disable, id) => {
  try {
    visible.value = false;
  } catch (error) {
    console.log(error);
  }
};

const deleteCard = async (visible, disable, id) => {
  try {
    authStore.id = id;
    await authStore.deleteCard();
    updateViewAfterAction(visible, disable);
    alert(authStore?.response?.message);
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async () => {
  try {
    await authStore.updateProfile();
    alert(authStore?.response?.message);
  } catch (error) {
    console.log(error);
  }
};

const updateViewAfterAction = (visible, disable) => {
  visible.value = false;
  disable.value = false;
};

const logout = async () => {
  try {
    await authStore.logout();
    alert(authStore?.response?.message);
    router.push({ path: "/" });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="w-full h-screen px-5 py-6 flex flex-col gap-5 overflow-y-auto">
    <div class="w-full p-2.5 flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <span class="font-bold text-2xl tracking-wider">User Profile</span>
        <span class="tracking-wider">Hello, {{ authStore.getShortName }}</span>
      </div>
      <button
        @click="logout()"
        class="bg-[#0B6BDA] rounded-full flex gap-2.5 items-center text-white tracking-wider font-bold px-5 py-5 hover:brightness-90 transition-all duration-300"
      >
        <b-icon-escape class="text-xl" />
        Logout
      </button>
    </div>
    <div
      class="w-auto h-auto mx-5 bg-[#BEBEBE]/20 p-8 rounded-lg flex flex-col gap-5"
    >
      <div class="flex justify-between">
        <div class="flex flex-col gap-1">
          <span class="tracking-wider">E-commerce balance</span>
          <span class="text-3xl font-bold">{{ authStore.user.balance }} €</span>
        </div>
        <!-- <button
          @click="visible = true"
          class="bg-transparent border-2 border-[#0B6BDA] rounded-lg flex gap-2.5 items-center text-[#0B6BDA] tracking-wider font-bold p-4 hover:bg-[#0B6BDA] hover:text-white transition-all duration-300"
        >
          <b-icon-plus-circle-fill class="text-xl" />
          Add Balance
        </button> -->
        <Dialog
          v-model:visible="visible"
          modal
          header="Add Balance"
          :style="{ width: '30rem' }"
        >
          <div
            class="h-auto max-h-96 overflow-y-auto flex flex-col scroll-pr-3 gap-5 items-end"
          >
            <div class="w-full flex flex-col gap-3.5">
              <label
                for="balance"
                class="tracking-wider w-auto text-black text-sm"
                >Balance</label
              >
              <div class="w-full flex gap-2.5">
                <button
                  class="w-full max-w-10 aspect-square rounded-md border border-[#0B6BDA]"
                  @click="authStore.decreaseBalance()"
                >
                  -
                </button>
                <InputText
                  id="balance"
                  class="h-fit flex-auto border border-[#BEBEBE] px-3.5 py-4 text-sm"
                  autocomplete="off"
                  placeholder="0"
                  v-model="authStore.balance"
                />
                <button
                  class="w-full max-w-10 aspect-square rounded-md border border-[#0B6BDA]"
                  @click="authStore.incrementBalance()"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-5">
            <Button
              type="button"
              label="Cancel"
              severity="secondary"
              @click="visible = false"
              class="bg-[#BEBEBE]/20 border-0 hover:brightness-50 transition-all duration-300"
            ></Button>
            <Button
              type="button"
              label="Save"
              class="bg-[#0B6BDA] border-0 hover:brightness-90 transition-all duration-300"
              @click="addBalance()"
            ></Button>
          </div>
        </Dialog>
      </div>
      <hr class="border-[#BEBEBE] my-2.5" />
      <span class="tracking-wider"
        >Add balance to your account at e-commerce account and start shooping
        with us!</span
      >
    </div>
    <div class="relative w-auto h-auto px-2.5">
      <div class="relative w-full h-auto flex justify-between">
        <span class="font-bold text-2xl tracking-wider">Payment Methods</span>
        <button
          @click="visible1 = true"
          class="font-bold text-[#0B6BDA] tracking-wider underline underline-offset-2"
        >
          Add Payment Method
        </button>
        <Dialog
          v-model:visible="visible1"
          modal
          header="Add Card"
          :style="{ width: '25rem' }"
        >
          <div
            class="w-full max-h-96 overflow-y-auto h-auto flex flex-col gap-2.5"
          >
            <div class="w-full flex flex-col gap-2 mb-4">
              <label
                for="cardNumber"
                class="tracking-wider w-auto text-black text-sm"
                >Card Number</label
              >
              <InputText
                id="cardNumber"
                class="border border-[#BEBEBE] px-3.5 py-4"
                autocomplete="off"
                placeholder="Card Number"
                size="small"
                maxlength="20"
                v-model="authStore.cardNumber"
                masked="true"
                v-mask="'#### #### #### ####'"
              />
              <AuthError v-if="authStore?.errors?.cardNumber">{{
                authStore?.errors?.cardNumber.toString()
              }}</AuthError>
            </div>
            <div class="w-full flex flex-col gap-2 mb-4">
              <label
                for="expirationDate"
                class="tracking-wider w-auto text-black text-sm"
                >Expiration Date</label
              >
              <InputText
                id="expirationDate"
                class="border border-[#BEBEBE] px-3.5 py-4"
                autocomplete="off"
                placeholder="Expiration Date"
                size="small"
                maxlength="5"
                v-model="authStore.expirationDate"
                masked="true"
                v-mask="'##/##'"
              />
              <AuthError v-if="authStore?.errors?.expirationDate">{{
                authStore?.errors?.expirationDate.toString()
              }}</AuthError>
            </div>
            <div class="w-full flex flex-col gap-2 mb-4">
              <label for="cvv" class="tracking-wider w-auto text-black text-sm"
                >Cvv</label
              >
              <InputText
                id="cvv"
                class="border border-[#BEBEBE] px-3.5 py-4"
                autocomplete="off"
                placeholder="Cvv"
                size="small"
                maxlength="3"
                v-model="authStore.cvv"
                masked="true"
                v-mask="'###'"
              />
              <AuthError v-if="authStore?.errors?.cvcCvv">{{
                authStore?.errors?.cvcCvv.toString()
              }}</AuthError>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-2">
            <Button
              type="button"
              label="Cancel"
              severity="secondary"
              @click="closeDialog()"
              class="bg-[#BEBEBE]/20 border-0 hover:brightness-50 transition-all duration-300"
            ></Button>
            <Button
              type="button"
              label="Save"
              class="bg-[#0B6BDA] border-0 hover:brightness-90 transition-all duration-300"
              @click="addCard()"
            ></Button>
          </div>
        </Dialog>
      </div>
      <div class="w-full h-auto flex flex-col my-5">
        <div
          v-if="authStore.user.cards?.length > 0"
          v-for="card in authStore.user.cards"
          class="w-auto h-fit flex justify-between py-5 border-b border-[#BEBEBE] mx-5 px-5"
        >
          <div class="w-auto flex gap-5">
            <img
              class="w-10"
              :src="card.cardType.image"
              :alt="card.cardType.name"
            />
            <span class="font-bold tracking-wider">{{
              card.cardType.name
            }}</span>
            <span class="tracking">{{ card.cardNumber }}</span>
            <span class="tracking">{{ card.expirationDate }}</span>
          </div>
          <ModifyData
            :id="card.id"
            label="Update"
            name="Card"
            @handle-update="editCard"
            @handle-delete="deleteCard"
            iconName="b-icon-pencil-square"
          >
            <template #main>
              <div class="w-full flex flex-col gap-2 mb-4">
                <label for="cardNumber" class="tracking-wider w-auto text-black"
                  >Card Number</label
                >
                <InputText
                  id="cardNumber"
                  class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                  autocomplete="off"
                  :value="card.cardNumber"
                  disabled="true"
                />
              </div>
              <div class="w-full flex flex-col gap-2 mb-4">
                <label
                  for="expirationDate"
                  class="tracking-wider w-auto text-black"
                  >Expiration Date</label
                >
                <InputText
                  id="expirationDate"
                  class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                  autocomplete="off"
                  :value="card.expirationDate"
                  disabled="true"
                />
              </div>
              <div class="w-full flex flex-col gap-2 mb-4">
                <label for="cvv" class="tracking-wider w-auto text-black"
                  >Cvv</label
                >
                <InputText
                  id="cvv"
                  class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                  autocomplete="off"
                  disabled="true"
                />
              </div>
            </template>
          </ModifyData>
        </div>
        <div
          v-else
          class="w-full flex justify-center items-center px-3.5 py-2 tracking-wider"
        >
          <span>Nothing to show here...</span>
        </div>
      </div>
    </div>
    <div class="w-auto h-auto px-2.5">
      <span class="font-bold text-2xl tracking-wider">Personal Info</span>
      <div class="w-full flex flex-col mt-2.5 gap-5">
        <div class="w-full flex flex-col items-center gap-2.5">
          <b-icon-person-circle class="text-8xl text-[#BEBEBE]" />
          <span class="text-lg font-bold tracking-wider">{{
            authStore.getFirstName
          }}</span>
        </div>
        <div class="w-auto h-auto flex flex-col items-end gap-5 mx-5">
          <div class="w-full h-auto flex gap-5">
            <div class="w-full h-fit flex flex-col gap-2">
              <label
                for="fullName"
                class="text-sm tracking-wider w-auto text-black"
                >Full Name</label
              >
              <InputText
                id="fullName"
                class="h-fit flex-auto border border-[#BEBEBE] px-3.5 py-4 text-sm"
                autocomplete="off"
                placeholder="Full Name"
                :value="authStore.user.fullName"
                @update:modelValue="authStore.fullName = $event"
              />
              <AuthError v-if="authStore?.errors?.name">{{
                authStore?.errors?.name.toString()
              }}</AuthError>
            </div>
            <div class="w-full h-fit flex flex-col gap-2">
              <label
                for="email"
                class="text-sm tracking-wider w-auto text-black"
                >Email</label
              >
              <InputText
                id="email"
                class="h-fit flex-auto border border-[#BEBEBE] px-3.5 py-4 text-sm"
                autocomplete="off"
                placeholder="Email"
                :value="authStore.user.email"
                @update:modelValue="authStore.email = $event"
              />
              <AuthError v-if="authStore?.errors?.email">{{
                authStore?.errors?.email.toString()
              }}</AuthError>
            </div>
          </div>
          <button
            @click="updateProfile()"
            class="w-fit bg-[#0B6BDA] rounded-lg flex gap-2.5 items-center text-white tracking-wider font-bold py-5 px-7 hover:brightness-90 transition-all duration-300 text-sm"
          >
            Save
          </button>
        </div>
        <span class="font-bold text-2xl tracking-wider">Change Password</span>
        <div class="w-auto mx-5 flex flex-col gap-5 items-end">
          <div class="w-full flex flex-col gap-2">
            <label
              for="currentPassword"
              class="text-sm tracking-wider w-auto text-black"
              >Current Password</label
            >
            <InputText
              id="oldPassword"
              class="flex-auto border border-[#BEBEBE] text-sm px-3.5 py-4"
              autocomplete="off"
              placeholder="Current Password"
              v-model="authStore.password"
            />
            <AuthError v-if="authStore?.errors?.name">{{
              authStore?.errors?.name.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex gap-5">
            <div class="w-full flex flex-col gap-2">
              <label
                for="newPassword"
                class="text-sm tracking-wider w-auto text-black"
                >New Password</label
              >
              <InputText
                id="newPassword"
                class="flex-auto border border-[#BEBEBE] text-sm px-3.5 py-4"
                autocomplete="off"
                placeholder="New Password"
                v-model="authStore.password"
              />
              <AuthError v-if="authStore?.errors?.name">{{
                authStore?.errors?.name.toString()
              }}</AuthError>
            </div>
            <div class="w-full flex flex-col gap-2">
              <label
                for="confirmPassword"
                class="text-sm tracking-wider w-auto text-black"
                >Confirm Password</label
              >
              <InputText
                id="confirmPassword"
                class="flex-auto border border-[#BEBEBE] text-sm px-3.5 py-4"
                autocomplete="off"
                placeholder="Confirm Password"
                v-model="authStore.password"
              />
              <AuthError v-if="authStore?.errors?.name">{{
                authStore?.errors?.name.toString()
              }}</AuthError>
            </div>
          </div>
          <button
            class="w-fit bg-[#0B6BDA] rounded-lg flex gap-2.5 items-center text-white tracking-wider font-bold py-5 px-7 hover:brightness-90 transition-all duration-300 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
