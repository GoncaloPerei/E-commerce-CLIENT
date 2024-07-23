import { defineStore } from "pinia";
import axios from "@/resources/axios.config";
import { useCrudOptionsStore } from "@/store/useCrudOptions";
const crudOptionsStore = useCrudOptionsStore();

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    data: {},
    category: {},
    statuses: [],

    options: [
      { name: "Yes", id: "none" },
      { name: "No", id: "only" },
    ],

    id: null,

    errors: null,

    response: null,

    name: null,
    image: null,
    status: null,

    trashed: null,

    params: {
      paginate: null,
      filter: {
        name: null,
        product_status_id: null,
        trashed: null,
      },
      include: null,
    },
  }),
  getters: {
    getVariables: (state) => {
      const variables = {};
      if (state.name !== null) {
        variables.name = state.name;
      }
      if (state.image !== null) {
        variables.image = state.image;
      }
      if (state.status !== null) {
        variables.status = state.status.id;
      }
      return variables;
    },
  },
  actions: {
    async getStatuses() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrador/status`
        );
        if (!this.statuses.length) {
          for (let status of data.data.data) {
            this.statuses.push({ name: status?.name, id: status?.id });
          }
        }
      } catch (error) {
        throw error;
      }
    },
    async getContent() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/categories?page=${crudOptionsStore.getCurrentPage}`,
          {
            params: this.params,
          }
        );
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },
    async getCustomerContent() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/categories`,
          {
            params: this.params,
          }
        );
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },
    async getCategory() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/categories/${this.id}`
        );
        this.category = data.data;
      } catch (error) {
        throw error;
      }
    },

    //CRUD Operations
    async postContent() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/categories`,
          this.getVariables
        );

        this.response = response.data;
        await this.clearFields();
        await this.getContent();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async putContent() {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/categories/${this.id}`,
          this.getVariables
        );

        this.response = response.data;
        await this.clearFields();
        await this.getContent();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async deleteContent() {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/categories/${this.id}`
        );

        this.response = response.data;
        await this.clearFields();
        await this.getContent();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async restoreContent() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/categories/${this.id}/restore`
        );

        this.response = response.data;
        await this.clearFields();
        await this.getContent();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async clearFields() {
      this.name = null;
      this.image = null;
      this.status = null;
    },
  },
});
