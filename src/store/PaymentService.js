import { defineStore } from "pinia";
import axios from "@/resources/axios.config";

export const usePaymentsStore = defineStore("payments", {
  state: () => ({
    data: {},

    id: null,

    errors: null,

    response: null,
  }),
  getters: {
    getPayments: (state) => state.data.data,
  },
  actions: {
    //Fetch Content Data
    async getContent() {
      try {
        const data = await axios.get(`http://localhost:8003/api/payments`);
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },
    async postContent() {
      try {
        const response = await axios.post(`http://localhost:8003/api/payments`);
        this.response = response.data;
      } catch (error) {
        throw error;
      }
    },
    async clearFields() {},
  },
});
