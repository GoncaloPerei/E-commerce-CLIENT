import { defineStore } from "pinia";
import axios from "@/resources/axios.config";
import { useOrdersStore } from "@/store/OrdersService";
const ordersStore = useOrdersStore();

export const useGeoApiStore = defineStore("geoApi", {
  state: () => ({
    postalCode: null,
  }),
  getters: {},
  actions: {
    async getContent() {
      try {
        const data = await axios.get(
          `https:/json.geoapi.pt/cp/${this.postalCode}?json=1`,
          {
            headers: {
              Accept: "application/json",
            },
            withCredentials: false,
          }
        );
        ordersStore.city = `${data.data.Localidade}, ${data.data.Distrito}`
      } catch (error) {
        throw error;
      }
    },
    async clearFields() {
      this.name = null;
      this.image = null;
    },
  },
});
