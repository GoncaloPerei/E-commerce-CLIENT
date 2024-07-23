<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import CrudLayout from "@/layouts/CrudLayout.vue";
import { useCategoriesStore } from "@/store/CategoriesService";
import { useCrudOptionsStore } from "@/store/useCrudOptions";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import AuthError from "@/components/AuthError.vue";
import Table from "@/components/Table.vue";
import ModifyData from "@/components/ModifyData.vue";
import checkIfNull from "@/resources/checkIfNull";

// Initialize Stores
const store = useCategoriesStore();
const crudOptionsStore = useCrudOptionsStore();

// Reactive References
const visible = ref(false);
const filtersVisible = ref(false);

const handleActive = async () => {
  store.params.filter.trashed = `${store.trashed.id}`;
  await store.getContent();
};

const removeActive = async () => {
  store.trashed = null;
  store.params.filter.trashed = null;
  await store.getContent();
};

// CRUD Operations
const addContent = async () => {
  try {
    await store.postContent();
    visible.value = false;
    alert(store?.response?.message);
  } catch (error) {
    console.error(error);
  }
};

const editContent = async (visible, disable, id) => {
  try {
    store.id = id;
    await store.putContent();
    updateViewAfterAction(visible, disable);
    alert(store?.response?.message);
  } catch (error) {
    console.log(error);
  }
};

const deleteContent = async (visible, disable, id) => {
  try {
    store.id = id;
    await store.deleteContent();
    updateViewAfterAction(visible, disable);
    alert(store?.response?.message);
  } catch (error) {
    console.error(error);
  }
};

const restoreContent = async (visible, disable, id) => {
  try {
    store.id = id;
    await store.restoreContent();
    updateViewAfterAction(visible, disable);
    alert(store?.response?.message);
  } catch (error) {
    console.error(error);
  }
};

// Helper Functions
const updateViewAfterAction = (visible, disable) => {
  visible.value = false;
  disable.value = false;
  handleSearch();
};

const handleSearch = async () => {
  try {
    await store.getContent();
  } catch (error) {
    console.error(error);
  }
};

// Lifecycle Hooks
onMounted(async () => {
  store.params.paginate = "6";
  await store.getContent();
  await store.getStatuses();
});

onUnmounted(async () => {
  await store.$reset();
  await crudOptionsStore.$reset();
});
</script>

<template>
  <CrudLayout
    crudName="Categories"
    newBtn="New Category"
    @handle-add="visible = true"
    @handle-filters="filtersVisible = !filtersVisible"
  >
    <template #newDialog>
      <Dialog
        v-model:visible="visible"
        modal
        header="Add Category"
        :style="{ width: '25rem' }"
      >
        <div
          class="w-full max-h-96 overflow-y-auto h-auto flex flex-col gap-2.5"
        >
          <div class="w-full flex flex-col gap-2 mb-4">
            <label for="name" class="tracking-wider w-auto text-black"
              >Name</label
            >
            <InputText
              id="name"
              class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Name"
              v-model="store.name"
            />
            <AuthError v-if="store?.errors?.name">{{
              store?.errors?.name.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex flex-col gap-2 mb-4">
            <label for="image" class="tracking-wider w-auto text-black"
              >Image</label
            >
            <InputText
              id="image"
              class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Image"
              v-model="store.image"
            />
            <AuthError v-if="store?.errors?.image">{{
              store?.errors?.image.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex flex-col gap-2 mb-4">
            <label for="status" class="tracking-wider w-auto text-black"
              >Status</label
            >
            <Select
              id="status"
              v-model="store.status"
              :options="store.statuses"
              optionLabel="name"
              class="w-full border border-[#BEBEBE] p-2"
              placeholder="Status"
            />
            <AuthError v-if="store?.errors?.status">{{
              store?.errors?.status.toString()
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
            label="Add"
            class="bg-[#0B6BDA] border-0 hover:brightness-90 transition-all duration-300"
            @click="addContent()"
          ></Button>
        </div>
      </Dialog>
    </template>
    <template #searchBar>
      <InputText
        class="border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider max-w-[400px] w-full"
        id="search"
        autocomplete="off"
        placeholder="Search a category"
        v-model="store.params.filter.name"
        @input="handleSearch()"
      />
    </template>
    <template #filtersOn>
      <div
        v-if="filtersVisible"
        class="w-full h-auto border border-[#BEBEBE] px-7 py-5 rounded-md flex gap-5"
      >
        <div class="w-full max-w-[200px] flex flex-col gap-2">
          <div class="w-full flex justify-between items-center">
            <label
              for="password"
              class="tracking-wider text-[#0B6BDA] text-sm w-auto font-bold underline underline-offset-2"
              >Role</label
            >
            <button
              v-if="store.params.filter.role_id"
              @click="(store.params.filter.role_id = null), store.getContent()"
            >
              <b-icon-x class="text-xl" />
            </button>
          </div>
          <Select
            v-model="store.params.filter.role_id"
            @change="store.getContent()"
            :options="store.roles"
            optionLabel="name"
            class="w-full border border-[#BEBEBE] p-2 text-sm"
            placeholder="Role"
          />
        </div>
        <hr class="w-px h-full bg-[#BEBEBE] border-[#BEBEBE]" />
        <div class="w-full max-w-[200px] flex flex-col gap-2">
          <div class="w-full flex justify-between items-center">
            <label
              for="password"
              class="tracking-wider text-[#0B6BDA] text-sm w-auto font-bold underline underline-offset-2"
              >Active</label
            >
            <button v-if="store.params.filter.trashed" @click="removeActive()">
              <b-icon-x class="text-xl" />
            </button>
          </div>
          <Select
            v-model="store.trashed"
            @update:modelValue="handleActive()"
            :options="store.options"
            optionLabel="name"
            class="w-full border border-[#BEBEBE] p-2 text-sm"
            placeholder="Active"
          />
        </div>
      </div>
    </template>
    <template #table>
      <Table
        :storeMeta="store?.data?.meta"
        :storeData="store?.data?.data"
        tableDataPr="8"
        @changePage="store.getContent()"
      >
        <template #header>
          <th
            align="left"
            class="w-max p-4 max-w-36 text-nowrap border-r border-[#BEBEBE]"
            data-priority="1"
          >
            Category ID
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="2">
            Name
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="4">
            Status
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="3">
            Image
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="4">
            Created At
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="5">
            Updated At
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="6">
            Deleted At
          </th>
          <th
            align="left"
            class="w-fit p-5 border-l border-[#BEBEBE]"
            data-priority="7"
          ></th>
        </template>
        <template #body="{ data }">
          <td
            class="w-max px-5 py-6 max-w-36 truncate font-bold border-r border-[#BEBEBE]"
            align="center"
          >
            {{ checkIfNull(data.id) }}
          </td>
          <td class="w-full px-5 py-6 max-w-xs truncate tracking-wider">
            {{ checkIfNull(data.name) }}
          </td>
          <td
            v-if="data.status.id === 1"
            class="w-auto m-2.5 p-3.5 rounded-full max-w-xs truncate flex gap-2.5 items-center bg-[#008000]/20 justify-center tracking-wider"
          >
            <b-icon-check-lg />
            {{ checkIfNull(data.status.name) }}
          </td>
          <td
            v-if="data.status.id === 2"
            class="w-auto m-2.5 p-3.5 rounded-full max-w-xs truncate flex gap-2.5 items-center bg-red-500/20 justify-center tracking-wider"
          >
            <b-icon-x-lg />
            {{ checkIfNull(data.status.name) }}
          </td>
          <td
            class="w-full p-1 max-w-xs truncate tracking-wider"
            align="center"
          >
            <img :src="data.image" class="w-16 rounded-lg" />
          </td>
          <td class="w-full px-5 py-6 text-nowrap tracking-wider">
            {{ checkIfNull(data.createdAt) }}
          </td>
          <td class="w-full px-5 py-6 text-nowrap tracking-wider">
            {{ checkIfNull(data.updatedAt) }}
          </td>
          <td
            class="w-full px-5 py-6 text-nowrap tracking-wider"
            align="center"
          >
            {{ checkIfNull(data.deletedAt) }}
          </td>
          <td class="w-fit p-5 border-l border-[#BEBEBE]" align="center">
            <ModifyData
              :id="data.id"
              label="Update"
              name="Category"
              @handle-update="editContent"
              @handle-delete="deleteContent"
              @handle-restore="restoreContent"
              iconName="b-icon-pencil-square"
              :active="data.deletedAt != '1970-01-01 00:00:00'"
            >
              <template #main>
                <div class="w-full flex flex-col gap-2 mb-4">
                  <label for="fullName" class="tracking-wider w-auto text-black"
                    >Name</label
                  >
                  <InputText
                    id="fullName"
                    class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                    autocomplete="off"
                    placeholder="Name"
                    :value="data.name"
                    @update:modelValue="store.name = $event"
                  />
                  <AuthError v-if="store?.errors?.name">{{
                    store?.errors?.name.toString()
                  }}</AuthError>
                </div>
                <div class="w-full flex flex-col gap-2 mb-4">
                  <label for="image" class="tracking-wider w-auto text-black"
                    >Image</label
                  >
                  <InputText
                    id="image"
                    class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                    autocomplete="off"
                    placeholder="Image"
                    :value="data.image"
                    @update:modelValue="store.image = $event"
                  />
                  <AuthError v-if="store?.errors?.image">{{
                    store?.errors?.image.toString()
                  }}</AuthError>
                </div>
                <div class="w-full flex flex-col gap-2 mb-4">
                  <label for="status" class="tracking-wider w-auto text-black"
                    >Status</label
                  >
                  <Select
                    id="status"
                    v-model="store.status"
                    @update:modelValue="store.status = $event"
                    :options="store.statuses"
                    optionLabel="name"
                    class="w-full border border-[#BEBEBE] p-2"
                    :placeholder="data.status.name"
                  />
                  <AuthError v-if="store?.errors?.status">{{
                    store?.errors?.status.toString()
                  }}</AuthError>
                </div>
              </template>
            </ModifyData>
          </td>
        </template>
      </Table>
    </template>
  </CrudLayout>
</template>
