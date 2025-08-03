<template>
  <div class="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
    <div v-if="profileStore.profile != null && !profileStore.loading">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <!-- Avatar + Info -->
        <div class="flex items-center gap-6 flex-wrap">
          <Avatar :name="fullName" size="md" />

          <div>
            <h2 class="text-2xl font-bold text-gray-800">{{ fullName }}</h2>

            <RoleBadge
              v-if="profileStore.profile?.role"
              :role="profileStore.profile.role"
              class="mt-2"
            />
          </div>
        </div>

        <!-- Dugme za uređivanje -->
        <button
          v-if="isOwnProfile"
          @click="showEditModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
        >
          Uredi profil
        </button>
      </div>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 class="text-gray-500 text-sm font-medium">Ime</h4>
          <p class="text-gray-800 font-semibold">{{ profileStore.profile?.firstName }}</p>
        </div>

        <div>
          <h4 class="text-gray-500 text-sm font-medium">Prezime</h4>
          <p class="text-gray-800 font-semibold">{{ profileStore.profile?.lastName }}</p>
        </div>

        <div>
          <h4 class="text-gray-500 text-sm font-medium">Email</h4>
          <p class="text-gray-800 font-semibold">{{ profileStore.profile?.email }}</p>
        </div>

        <div>
          <h4 class="text-gray-500 text-sm font-medium">Rola</h4>
          <p class="text-gray-800 font-semibold capitalize">{{ profileStore.profile?.role }}</p>
        </div>
      </div>
      <!-- Modal -->
      <EditProfileModal
        :visible="showEditModal"
        :profile="profileStore.profile"
        @close="showEditModal = false"
      />
    </div>
    <div v-else>Greska prilikom ucitavanja profila.</div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import RoleBadge from '~/components/RoleBadge.vue'
import Avatar from '~/components/Avatar.vue'
import EditProfileModal from '~/components/EditProfileModal.vue'

const route = useRoute()
const profileStore = useProfileStore()
const auth = useAuthStore()
const showEditModal = ref(false)

onMounted(() => {
  const userId = route.params.userId
  profileStore.fetchUserProfile(userId)
})

const fullName = computed(() =>
  profileStore.profile ? `${profileStore.profile?.firstName} ${profileStore.profile?.lastName}` : ''
)

const isOwnProfile = computed(() =>
  auth.user?.id === profileStore.profile?.id
)
</script>