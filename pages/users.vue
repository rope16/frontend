<template>
  <div class="px-6 pb-8 max-w-6xl mx-auto">
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <input
        v-model="query"
        @input="onSearchInput"
        type="text"
        placeholder="Pretraži korisnike po imenu, prezimenu ili emailu..."
        class="input w-full sm:max-w-md"
      />

      <button v-if="isAdmin()" @click="showAddUserModal = true" class="btn-primary py-2 px-4 rounded-full whitespace-nowrap">
        + Dodaj korisnika
      </button>

      <CreateUserModal 
        v-if="showAddUserModal" 
        @close="showAddUserModal = false" 
        @user-added="fetchUsers" 
      />
    </div>

    <!-- Tabela korisnika -->
    <div class="overflow-auto rounded-xl shadow">
      <table class="min-w-full divide-y divide-gray-200 bg-white">
        <thead class="bg-gray-100 text-sm font-semibold text-gray-700">
          <tr>
            <th class="px-6 py-3 text-left">Ime</th>
            <th class="px-6 py-3 text-left">Prezime</th>
            <th class="px-6 py-3 text-left">Email</th>
            <th class="px-6 py-3 text-left">Rola</th>
            <th class="px-6 py-3 text-left">Aktivan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm text-gray-800">
          <tr v-for="user in users" :key="user.userId">
            <td class="px-6 py-4">{{ user.firstName }}</td>
            <td class="px-6 py-4">{{ user.lastName }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">
              <template v-if="isAdmin() && user.userId !== currentLoggedUserId">
                <select
                  v-model="user.role"
                  @change="changeUserRole(user)"
                  class="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </template>
              <template v-else>
                {{ user.role }}
              </template>
            </td>
            <td class="px-6 py-4">
              <span :class="user.isActive ? 'text-green-600 font-semibold' : 'text-red-500 font-medium'">
                {{ user.isActive ? 'Da' : 'Ne' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginate -->
    <div class="mt-6 flex justify-end gap-2 text-sm">
      <button
        @click="loadPreviousPage"
        :disabled="page === 1"
        class="btn-secondary px-4 py-2 rounded-full cursor-pointer"
      >
        Prethodna
      </button>
      <button
        @click="loadNextPage"
        :disabled="users.length < pageSize"
        class="btn-primary px-4 py-2 rounded-full cursor-pointer"
      >
        Sledeća
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { debounce } from 'lodash-es'
import CreateUserModal from '~/components/modals/CreateUserModal.vue'
import { isAdmin } from '#imports'
import { useAuthStore } from '#imports'

const store = useUsersStore()
const authStore = useAuthStore()

const currentLoggedUserId = authStore.user.userId

const users = ref([])
const query = ref('')
const page = ref(1)
const pageSize = 10

const showAddUserModal = ref(false)

const fetchUsers = async () => {
    const payload = {
        query: query.value?.trim() || '',
        page: page.value,
        pageSize: pageSize
    }
  await store.searchUsers(payload)
  users.value = store.users
}

const onSearchInput = debounce(() => {
  page.value = 1
  fetchUsers()
}, 400)

const loadNextPage = () => {
  page.value++
  fetchUsers()
}

const loadPreviousPage = () => {
  if (page.value > 1) {
    page.value--
    fetchUsers()
  }
}

const changeUserRole = async (user) => {
  try {
    await store.updateUserRole(user.userId, user.role);
  } catch (err) {
    console.error('Error updating user role:', err)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.input {
  @apply px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 font-semibold;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold;
}
</style>