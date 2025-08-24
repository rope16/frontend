import { defineStore } from "pinia";
import { updateUserRole } from "#imports";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),
  actions: {
    async searchUsers(params) {
      this.loading = true;
      try {
        const data = await searchUsers(params);
        this.users = data.users;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updateUserRole(userId, role) {
      try {
        await updateUserRole(userId, role);
        const user = this.users.find((user) => user.userId === userId);
        if (user) {
          user.role = role;
        }
      } catch (error) {
        console.error("Error updating user role:", error);
        this.error = error;
      }
    }
  },
});
