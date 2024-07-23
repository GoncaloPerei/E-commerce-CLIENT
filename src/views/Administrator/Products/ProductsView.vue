<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import CrudLayout from "@/layouts/CrudLayout.vue";
import { useProductsStore } from "@/store/ProductsService";
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
const store = useProductsStore();
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
    console.log(error);
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
    console.log(error);
  }
};

const restoreContent = async (visible, disable, id) => {
  try {
    store.id = id;
    await store.restoreContent();
    updateViewAfterAction(visible, disable);
    alert(store?.response?.message);
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

// Lifecycle Hooks
onMounted(async () => {
  store.params.paginate = "6";
  await store.getContent();
  await store.getCategories();
  await store.getStatuses();
});

onUnmounted(async () => {
  await store.$reset();
  await crudOptionsStore.$reset();
});
</script>

<template>
  <CrudLayout
    crudName="Products"
    newBtn="New Product"
    @handle-add="visible = true"
    @handle-filters="filtersVisible = !filtersVisible"
  >
    <template #newDialog>
      <Dialog
        v-model:visible="visible"
        modal
        header="Add Product"
        :style="{ width: '25rem' }"
      >
        <div
          class="w-full max-h-96 overflow-y-auto h-auto flex flex-col gap-2.5"
        >
          <div class="w-full flex flex-col gap-2 mb-4">
            <label for="title" class="tracking-wider w-auto text-black"
              >Title</label
            >
            <InputText
              id="title"
              class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Title"
              v-model="store.title"
            />
            <AuthError v-if="store?.errors?.title">{{
              store?.errors?.title.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex flex-col gap-2 mb-4">
            <label for="description" class="tracking-wider w-auto text-black"
              >Description</label
            >
            <InputText
              id="description"
              class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Description"
              v-model="store.description"
            />
            <AuthError v-if="store?.errors?.description">{{
              store?.errors?.description.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex flex-col gap-2 mb-4">
            <label for="price" class="tracking-wider w-auto text-black"
              >Price</label
            >
            <InputText
              id="price"
              class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Price"
              type="number"
              v-model="store.price"
            />
            <AuthError v-if="store?.errors?.price">{{
              store?.errors?.price.toString()
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
            <label for="stock" class="tracking-wider w-auto text-black"
              >Stock</label
            >
            <InputText
              id="stock"
              class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Stock"
              type="number"
              v-model="store.stock"
            />
            <AuthError v-if="store?.errors?.stock">{{
              store?.errors?.stock.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex flex-col gap-2 mb-4">
            <label for="category" class="tracking-wider w-auto text-black"
              >Category</label
            >
            <Select
              id="category"
              v-model="store.category"
              :options="store.categories"
              optionLabel="name"
              class="w-full border border-[#BEBEBE] p-2"
              placeholder="Category"
            />
            <AuthError v-if="store?.errors?.category">{{
              store?.errors?.category.toString()
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
        placeholder="Search a product"
        v-model="store.params.filter.title"
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
              for="category"
              class="tracking-wider text-[#0B6BDA] text-sm w-auto font-bold underline underline-offset-2"
              >Category</label
            >
            <button
              v-if="store.params.filter.product_category_id"
              @click="
                (store.params.filter.product_category_id = null),
                  store.getContent()
              "
            >
              <b-icon-x class="text-xl" />
            </button>
          </div>
          <Select
            id="category"
            v-model="store.params.filter.product_category_id"
            @change="store.getContent()"
            :options="store.categories"
            optionLabel="name"
            class="w-full border border-[#BEBEBE] p-2 text-sm"
            placeholder="Category"
          />
        </div>
        <hr class="w-px h-full bg-[#BEBEBE] border-[#BEBEBE]" />
        <div class="w-full max-w-[200px] flex flex-col gap-2">
          <div class="w-full flex justify-between items-center">
            <label
              for="status"
              class="tracking-wider text-[#0B6BDA] text-sm w-auto font-bold underline underline-offset-2"
              >Status</label
            >
            <button
              v-if="store.params.filter.product_status_id"
              @click="
                (store.params.filter.product_status_id = null),
                  store.getContent()
              "
            >
              <b-icon-x class="text-xl" />
            </button>
          </div>
          <Select
            id="status"
            v-model="store.params.filter.product_status_id"
            @change="store.getContent()"
            :options="store.statuses"
            optionLabel="name"
            class="w-full border border-[#BEBEBE] p-2 text-sm"
            placeholder="Status"
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
        tableDataPr="12"
        @changePage="store.getContent()"
      >
        <template #header>
          <th
            align="left"
            class="w-max p-4 text-nowrap border-r border-[#BEBEBE]"
            data-priority="1"
          >
            Product ID
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="2">
            Title
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="3">
            Description
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="4">
            Price
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="5">
            Stock
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="6">
            Category
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="7">
            Status
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="8">
            Image
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="9">
            Created At
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="10">
            Updated At
          </th>
          <th align="left" class="w-fit p-4 text-nowrap" data-priority="11">
            Deleted At
          </th>
          <th
            align="left"
            class="w-fit p-5 border-l border-[#BEBEBE]"
            data-priority="12"
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
            {{ checkIfNull(data.title) }}
          </td>
          <td class="w-full px-5 py-6 max-w-xs truncate tracking-wider">
            {{ checkIfNull(data.description) }}
          </td>
          <td class="w-full px-5 py-6 max-w-xs truncate tracking-wider">
            {{ data.price }} €
          </td>
          <td
            class="w-full px-5 py-6 max-w-xs truncate tracking-wider flex gap-2.5 items-center"
          >
            {{ data.stock }} Uni.
            <b-icon-boxes class="text-[#0B6BDA] text-xl" />
          </td>
          <td class="w-full px-5 py-6 max-w-xs truncate tracking-wider">
            {{ checkIfNull(data.category.name) }}
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
            class="w-full p-1 max-w-xs truncate tracking-wider max-h<-[73px]"
            align="center"
          >
            <img :src="data.image" class="h-10 rounded-lg" />
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
              name="Product"
              @handle-update="editContent"
              @handle-delete="deleteContent"
              @handle-restore="restoreContent"
              iconName="b-icon-pencil-square"
              :active="data.deletedAt != '1970-01-01 00:00:00'"
              label="Update"
            >
              <template #main>
                <div class="w-full flex flex-col gap-2 mb-4">
                  <label for="title" class="tracking-wider w-auto text-black"
                    >Title</label
                  >
                  <InputText
                    id="title"
                    class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                    autocomplete="off"
                    placeholder="Title"
                    :value="data.title"
                    @update:modelValue="store.title = $event"
                  />
                  <AuthError v-if="store?.errors?.title">{{
                    store?.errors?.title.toString()
                  }}</AuthError>
                </div>
                <div class="w-full flex flex-col gap-2 mb-4">
                  <label
                    for="description"
                    class="tracking-wider w-auto text-black"
                    >Description</label
                  >
                  <InputText
                    id="description"
                    class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                    autocomplete="off"
                    placeholder="Description"
                    :value="data.description"
                    @update:modelValue="store.description = $event"
                  />
                  <AuthError v-if="store?.errors?.description">{{
                    store?.errors?.description.toString()
                  }}</AuthError>
                </div>
                <div class="w-full flex flex-col gap-2 mb-4">
                  <label for="price" class="tracking-wider w-auto text-black"
                    >Price</label
                  >
                  <InputText
                    id="price"
                    class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                    autocomplete="off"
                    placeholder="Price"
                    type="number"
                    :value="data.price"
                    @update:modelValue="store.price = $event"
                  />
                  <AuthError v-if="store?.errors?.price">{{
                    store?.errors?.price.toString()
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
                  <label for="stock" class="tracking-wider w-auto text-black"
                    >Stock</label
                  >
                  <InputText
                    id="stock"
                    class="flex-auto border border-[#BEBEBE] px-3.5 py-4"
                    autocomplete="off"
                    placeholder="Stock"
                    type="number"
                    :value="data.stock"
                    @update:modelValue="store.stock = $event"
                  />
                  <AuthError v-if="store?.errors?.stock">{{
                    store?.errors?.stock.toString()
                  }}</AuthError>
                </div>
                <div class="w-full flex flex-col gap-2 mb-4">
                  <label for="category" class="tracking-wider w-auto text-black"
                    >Category</label
                  >
                  <Select
                    id="category"
                    v-model="store.category"
                    @update:modelValue="store.category = $event"
                    :options="store.categories"
                    optionLabel="name"
                    class="w-full border border-[#BEBEBE] p-2"
                    :placeholder="data.category.name"
                  />
                  <AuthError v-if="store?.errors?.category">{{
                    store?.errors?.category.toString()
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
