import { defineStore } from "pinia";
import axios from "@/resources/axios.config";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    data: {},

    id: null,

    errors: null,

    response: null,

    firstName: null,
    lastName: null,
    address: null,
    postalCode: null,
    city: null,
    nif: null,

    aditionalComments: null,

    method: null,

    currentPage: null,

    params: {
      paginate: null,
    },
  }),
  getters: {
    getOrders: (state) => state.data.data,
    getVariables: (state) => {
      const variables = {};
      if (state.firstName !== null) {
        variables.firstName = state.firstName;
      }
      if (state.lastName !== null) {
        variables.lastName = state.lastName;
      }
      if (state.address !== null) {
        variables.address = state.address;
      }
      if (state.postalCode !== null) {
        variables.postalCode = state.postalCode;
      }
      if (state.city !== null) {
        variables.city = state.city;
      }
      if (state.nif !== null) {
        variables.nif = state.nif;
      }
      if (state.method !== null) {
        variables.method = state.method;
      }
      if (state.cardName !== null) {
        variables.cardName = state.cardName;
      }
      if (state.cardNumber !== null) {
        variables.cardNumber = state.cardNumber;
      }
      if (state.expirationDate !== null) {
        variables.expirationDate = state.expirationDate;
      }
      if (state.cvcCvv !== null) {
        variables.cvcCvv = state.cvcCvv;
      }
      if (state.aditionalComments !== null) {
        variables.aditionalComments = state.aditionalComments;
      }
      return variables;
    },
  },
  actions: {
    //Fetch Content Data
    async getContent() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_ORDERS_URL}/api/orders?page=${this.currentPage + 1}`,
          {
            params: this.params,
          }
        );
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },
    async getOrder() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_ORDERS_URL}/api/orders/${this.id}`
        );
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },
    async testDetails() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ECMM_ORDERS_URL}/api/test`,
          this.getVariables
        );

        this.response = response.data;
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async postContent() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ECMM_ORDERS_URL}/api/orders`,
          this.getVariables
        );
        this.response = response.data;
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async clearFields() {},
  },
});
