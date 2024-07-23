<script setup>
import { ref } from "vue";
import Paginator from "primevue/paginator";
import { useCrudOptionsStore } from "@/store/useCrudOptions";
const crudOptionsStore = useCrudOptionsStore();

const props = defineProps({
  storeMeta: { type: Object, default: () => ({}), required: true },
  storeData: { type: Object, default: () => ({}), required: true },
  tableDataPr: { type: String, default: "0", required: true },
});

const first = ref(0);

const emits = defineEmits(["changePage"]);

const handleChange = () => {
  crudOptionsStore.page = first.value;
  emits("changePage");
};
</script>

<template>
  <div class="w-full max-w-full rounded-xl overflow-hidden">
    <div class="overflow-x-scroll">
      <table class="relative w-fit min-w-full tracking-wider">
        <thead class="relative bg-[#BEBEBE]/20 text-base">
          <tr class="border-b border-white/20">
            <slot name="header" />
          </tr>
        </thead>
        <tbody class="relative bg-white overflow-hidden">
          <template v-if="props?.storeMeta?.total > 0">
            <tr
              v-for="data in props?.storeData"
              :key="data.id"
              class="border-t border-[#BEBEBE] overflow-hidden"
            >
              <slot name="body" :data="data" />
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="props.tableDataPr">
                <div
                  class="relative w-full min-h-52 flex justify-center items-center bg-white px-3.5 py-2 tracking-wider"
                >
                  <span>Nothing to show here...</span>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      class="relative w-full bg-[#BEBEBE]/20 flex justify-end items-center p-4"
    >
      <Paginator
        v-model:first="first"
        @update:first="handleChange"
        :rows="1"
        :totalRecords="props?.storeMeta?.last_page"
        template="PrevPageLink CurrentPageReport NextPageLink"
        class="absolute m-auto left-0 right-0 font-bold"
      />
      <span class="text-black"
        >Showing {{ props?.storeMeta?.from ?? "0" }} -
        {{ props?.storeMeta?.to ?? "0" }} of
        {{ props?.storeMeta?.total ?? "0" }} registers</span
      >
    </div>
  </div>
</template>
