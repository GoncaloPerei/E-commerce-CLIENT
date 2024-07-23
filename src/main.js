import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "@/router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import VueTheMask from "vue-the-mask";

import { BootstrapIconsPlugin } from "bootstrap-icons-vue";

const pinia = createPinia();
const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "light",
      cssLayer: false,
    },
  },
});

app.use(pinia);
app.use(VueTheMask);
app.use(BootstrapIconsPlugin);
app.use(router);
app.mount("#app");
