import { defineStore } from "pinia";
import { loginUser } from "../composables/auth";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    error: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login({ email, password }) {
      this.loading = true
      this.error = null

      try {
        const data = await loginUser(email, password);
        this.token = data;

        const payloadBase64 = data.split('.')[1]
        const decodedPayload = JSON.parse(atob(payloadBase64))

        console.log('Decoded Payload:', decodedPayload);

        if (decodedPayload) {
          var user = {
            email: decodedPayload.email,
            role: decodedPayload.role,
            userId: decodedPayload.userId,
            name: decodedPayload.name,
          };

          this.user = user;
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['user', 'token']
      }
    ]
  }
})