import { defineStore } from "pinia";
import axios from "@/resources/axios.config";
import { useCrudOptionsStore } from "@/store/useCrudOptions";
const crudOptionsStore = useCrudOptionsStore();

export const useProductsStore = defineStore("products", {
  state: () => ({
    data: {},
    product: {},
    categories: [],
    statuses: [],

    options: [
      { name: "Yes", id: "none" },
      { name: "No", id: "only" },
    ],

    sortByOptions: [
      { name: "A-Z", id: "title" },
      { name: "Z-A", id: "-title" },
      { name: "Lower Price", id: "price" },
      { name: "Higher Price", id: "-price" },
    ],

    id: null,

    errors: null,

    response: null,

    title: null,
    description: null,
    price: null,
    image: null,
    stock: null,
    category: null,
    status: null,

    minPrice: 0,
    maxPrice: null,

    trashed: null,

    sort: null,

    params: {
      paginate: null,
      filter: {
        title: null,
        product_category_id: null,
        product_status_id: null,
        price_range: null,
        trashed: null,
      },
      sort: {},
    },
  }),
  getters: {
    getVariables: (state) => {
      const variables = {};
      if (state.title !== null) {
        variables.title = state.title;
      }
      if (state.description !== null) {
        variables.description = state.description;
      }
      if (state.price !== null) {
        variables.price = state.price;
      }
      if (state.image !== null) {
        variables.image = state.image;
      }
      if (state.stock !== null) {
        variables.stock = state.stock;
      }
      if (state.category !== null) {
        variables.category = state.category.id;
      }
      if (state.status !== null) {
        variables.status = state.status.id;
      }
      return variables;
    },
  },
  actions: {
    //Fetch
    async getCategories() {
      try {
        const data = await axios.get(`${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/categories`);
        if (!this.categories.length) {
          for (let category of data.data.data) {
            this.categories.push({ name: category?.name, id: category?.id });
          }
        }
      } catch (error) {
        throw error;
      }
    },
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

    //Fetch Content Data
    async getCustomerContent() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/products?page=${crudOptionsStore.getCurrentPage}`,
          {
            params: this.params,
          }
        );
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },
    async getContent() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/products?page=${crudOptionsStore.getCurrentPage}`,
          {
            params: this.params,
          }
        );
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },
    async getProduct() {
      try {
        const data = await axios.get(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/products/${this.id}`
        );
        this.product = data.data.data;
      } catch (error) {
        throw error;
      }
    },

    //CRUD Operations
    async postContent() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/products`,
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
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/products/${this.id}`,
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
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/products/${this.id}`
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
          `${import.meta.env.VITE_ECMM_PRODUCTS_URL}/api/administrator/products/${this.id}/restore`
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
      this.title = null;
      this.description = null;
      this.image = null;
      this.stock = null;
      this.category = null;
      this.status = null;
      this.params.filter.title = null;
      this.params.filter.price_range = null;
    },
  },
});
