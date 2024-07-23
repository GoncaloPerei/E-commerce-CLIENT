<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { ref } from "vue";

const props = defineProps({
  name: { type: String },
  label: { type: String },
  id: { type: Number },
  iconName: { type: String },
  type: { type: String },
  active: { type: Boolean, required: false },
});

const emits = defineEmits(["handleUpdate", "handleDelete", "handleRestore"]);

const visible = ref(false);
const disableSubmit = ref(false);

const disableBtn = () => {
  disableSubmit.value = true;
  setTimeout(() => {
    disableSubmit.value = false;
  }, 3500);
};

const handleUpdate = () => {
  disableBtn();
  emits("handleUpdate", visible, disableSubmit, props.id);
};
const handleDelete = () => {
  disableBtn();
  emits("handleDelete", visible, disableSubmit, props.id);
};
const handleRestore = () => {
  disableBtn();
  emits("handleRestore", visible, disableSubmit, props.id);
};
</script>

<template>
  <button v-if="props.iconName" @click="visible = true" class="h-fit w-fit">
    <component :is="iconName" class="text-xl h-fit w-fit" />
  </button>
  <Dialog
    v-model:visible="visible"
    modal
    :draggable="false"
    dismissableMask
    :header="label + '&nbsp;' + name"
    class="tracking-wider overflow-hidden"
    :style="{ width: '25rem' }"
  >
    <div>
      <span class="text-sm block text-[#0B6BDA]"><slot name="subhead" /></span>
      <div
        class="h-auto max-h-96 overflow-y-auto flex flex-col scroll-pr-3 gap-2.5"
      >
        <slot name="main" />
      </div>
      <div class="mt-2.5 w-full flex justify-between">
        <button
          @click="handleDelete()"
          v-if="!props.active"
          class="p-3.5 bg-[#BEBEBE]/20 rounded-md hover:brightness-50 transition-all duration-300"
        >
          <b-icon-trash3-fill class="text-lg" />
        </button>
        <button
          @click="handleRestore()"
          v-else
          class="p-3.5 bg-[#BEBEBE]/20 rounded-md hover:brightness-50 transition-all duration-300"
        >
          <b-icon-arrow-counterclockwise class="text-lg" />
        </button>
        <div class="flex gap-3.5">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            class="bg-[#BEBEBE]/20 border-0 hover:brightness-50 transition-all duration-300"
            @click="visible = false"
          ></Button>
          <Button
            class="capitalize tracking-wider bg-[#0B6BDA] border-0 px-2.5 py-1.5 hover:brightness-90 transition-all duration-300"
            :label="label + '&nbsp;' + name"
            :disabled="disableSubmit"
            @click="handleUpdate()"
          ></Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>
