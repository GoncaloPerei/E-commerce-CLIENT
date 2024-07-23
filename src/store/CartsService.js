import { defineStore } from "pinia";
import axios from "@/resources/axios.config";

export const useCartsStore = defineStore("carts", {
  state: () => ({
    cart: {},

    id: null,

    response: null,

    quantity: 1,

    errors: null,
  }),
  getters: {
    getVariables: (state) => {
      const variables = {};
      if (state.quantity !== null) {
        variables.quantity = state.quantity;
      }
      return variables;
    },
  },
  actions: {
    async getCart() {
      try {
        const data = await axios.get("http://localhost:8002/api/cart");
        this.cart = data.data.data;
      } catch (error) {
        throw error;
      }
    },
    async updateCart() {
      try {
        const response = await axios.patch(
          `http://localhost:8002/api/item/${this.id}`,
          this.getVariables
        );

        this.response = response.data;
      } catch (error) {
        throw error;
      }
    },
    async addProduct() {
      try {
        const response = await axios.patch(
          `http://localhost:8002/api/cart/${this.id}`,
          this.getVariables
        );

        this.response = response.data;
      } catch (error) {
        throw error;
      }
    },
    async removeProduct() {
      try {
        const response = await axios.delete(`http://localhost:8002/api/item/${this.id}`);

        this.response = response.data;
      } catch (error) {
        throw error;
      }
    },
    async cleanCart() {
      try {
        const response = await axios.delete(`http://localhost:8002/api/cart/${this.cart.id}`);

        this.response = response.data;
      } catch (error) {
        throw error;
      }
    },
    async clearFields() {
      this.id = null;
      this.quantity = 1;
    },
  },
});
