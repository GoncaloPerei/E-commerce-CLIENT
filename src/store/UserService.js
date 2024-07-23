import { defineStore } from "pinia";
import axios from "@/resources/axios.config";
import { useCrudOptionsStore } from "@/store/useCrudOptions";
const crudOptionsStore = useCrudOptionsStore();

export const useUsersStore = defineStore("users", {
  state: () => ({
    data: {},
    roles: [],

    options: [
      { name: "Yes", id: "none" },
      { name: "No", id: "only" },
    ],

    id: null,

    errors: null,

    response: null,

    fullName: null,
    email: null,
    password: null,
    role: null,

    trashed: null,

    params: {
      paginate: null,
      filter: {
        full_name: null,
        role_id: null,
        trashed: null,
      },
    },
  }),
  getters: {
    getVariables: (state) => {
      const variables = {};
      if (state.fullName !== null) {
        variables.fullName = state.fullName;
      }
      if (state.email !== null) {
        variables.email = state.email;
      }
      if (state.password !== null) {
        variables.password = state.password;
      }
      if (state.role !== null) {
        variables.role = state.role.id;
      }
      return variables;
    },
  },
  actions: {
    //Fetch
    async getRoles() {
      try {
        const data = await axios.get(
          "http://localhost:8000/api/administrator/roles"
        );
        if (!this.roles.length) {
          for (let role of data.data) {
            this.roles.push({ id: role?.id, name: role?.name });
          }
        }
      } catch (error) {
        throw error;
      }
    },

    //Fetch Content Data
    async getContent() {
      try {
        const data = await axios.get(
          `http://localhost:8000/api/administrator/users?page=${crudOptionsStore.getCurrentPage}`,
          {
            params: this.params,
          }
        );
        this.data = data.data;
      } catch (error) {
        throw error;
      }
    },

    //CRUD Operations
    async postContent() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/administrator/users",
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
          `http://localhost:8000/api/administrator/users/${this.id}`,
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
          `http://localhost:8000/api/administrator/users/${this.id}`
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
          `http://localhost:8000/api/administrator/users/${this.id}/restore`
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
      this.fullName = null;
      this.email = null;
      this.password = null;
      this.role = null;
      this.errors = null;
    },
  },
});
