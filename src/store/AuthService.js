import { defineStore } from "pinia";
import axios from "@/resources/axios.config";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
    authStatus: false,

    errors: null,

    response: null,

    id: null,

    fullName: null,
    email: null,
    password: null,
    balance: null,

    cardNumber: null,
    expirationDate: null,
    cvv: null,
  }),
  getters: {
    user: (state) => state.authUser.user,
    status: (state) => state.authStatus,
    getVariables: (state) => {
      const variables = {};
      if (state.fullName !== null) {
        variables.fullName = state.fullName;
      }
      if (state.email !== null) {
        variables.email = state.email;
      }
      if (state.balance !== null) {
        const card = state.user.cards.find((card) => card.id === state.id);
        variables.balance =
          parseFloat(card.balance) + parseFloat(state.balance);
      }
      if (state.cardNumber !== null) {
        variables.cardNumber = state.cardNumber.replace(/\s+/g, "");
      }
      if (state.expirationDate !== null) {
        variables.expirationDate = state.expirationDate;
      }
      if (state.cvv !== null) {
        variables.cvv = state.cvv;
      }
      return variables;
    },
    getFirstName: (state) => {
      return state.user.fullName.split(" ")[0];
    },
    getShortName: (state) => {
      let nameParts = state.user.fullName.trim().split(" ");
      let firstName = nameParts[0];
      let lastNameInitial =
        nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
      return `${firstName} ${lastNameInitial}.`;
    },
  },
  actions: {
    async getUser() {
      try {
        const data = await axios.get("http://localhost:8000/api/profile");

        this.authUser = data.data;
        this.authStatus = true;
      } catch (error) {
        throw error;
      }
    },
    async login() {
      try {
        const response = await axios.post("http://localhost:8000/api/login", {
          email: this.email,
          password: this.password,
        });

        this.response = response.data;
        await this.clearFields();
      } catch (error) {
        this.errors = error.response.data.message;
        throw error;
      }
    },
    async register() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/register",
          {
            fullName: this.fullName,
            email: this.email,
            password: this.password,
          }
        );

        this.response = response.data;
        await this.clearFields();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async logout() {
      try {
        const response = await axios.post("http://localhost:8000/api/logout");

        this.response = response.data;
        this.authUser = null;
        this.authStatus = false;
      } catch (error) {
        throw error;
      }
    },
    async updateProfile() {
      try {
        const response = await axios.patch(
          "http://localhost:8000/api/profile",
          this.getVariables
        );

        this.response = response.data;
        await this.clearFields();
        await this.getUser();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async addCard() {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/user/card",
          this.getVariables
        );
        this.response = response.data;
        await this.clearFields();
        await this.getUser();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async editCard() {
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/user/card/${this.id}`,
          this.getVariables
        );
        this.response = response.data;
        await this.clearFields();
        await this.getUser();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async deleteCard() {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/user/card/${this.id}`
        );
        this.response = response.data;
        await this.clearFields();
        await this.getUser();
      } catch (error) {
        this.errors = error.response.data.errors;
        throw error;
      }
    },
    async clearFields() {
      try {
        this.fullName = null;
        this.email = null;
        this.password = null;
        this.balance = null;
        this.cardNumber = null;
        this.expirationDate = null;
        this.cvv = null;
        this.errors = null;
      } catch (error) {
        throw error;
      }
    },
    incrementBalance() {
      this.balance += 10;
    },
    decreaseBalance() {
      if (this.balance > 0) {
        this.balance -= 10;
      }
    },
  },
});
