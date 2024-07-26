<script setup>
defineProps({
  head: { type: String, required: true },
  subhead: { type: String, required: false },
  button: { type: String, required: true },
  footer: { type: String, required: true },
  footerBold: { type: String, required: true },
  link: { type: String, required: true },
});

defineEmits(["handleSubmit"]);
</script>

<template>
  <form
    v-on:submit.prevent="$emit('handleSubmit')"
    class="border border-[#BEBEBE] rounded-xl w-1/4 h-auto px-6 py-7 flex flex-col gap-10 max-h-[600px] overflow-hidden overflow-y-auto"
  >
    <div class="flex flex-col gap-1.5">
      <span class="font-bold text-[#0B6BDA] text-3xl tracking-wider">{{
        head
      }}</span>
      <span class="text-lg tracking-wider">{{ subhead }}</span>
    </div>
    <div class="flex flex-col gap-5">
      <slot name="input" />
    </div>
    <div class="w-full h-auto flex flex-col gap-3.5">
      <button
        type="submit"
        class="w-full bg-[#0B6BDA] text-white py-4 rounded-md font-bold tracking-wider text-lg"
      >
        {{ button }}
      </button>
      <RouterLink :to="link" class="w-full text-center tracking-wider"
        >{{ footer }}
        <span class="font-bold underline underline-offset-2">{{
          footerBold
        }}</span></RouterLink
      >
    </div>
  </form>
</template>
