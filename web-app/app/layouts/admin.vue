<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" elevation="2" dark app>
      <v-app-bar-nav-icon
        :icon="navIcon"
        variant="text"
        @click.stop="drawer = !drawer"
      />

      <v-app-bar-title class="font-weight-bold">
        VMS Admin
      </v-app-bar-title>  

      <v-spacer />

      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="32">
              <v-img src="https://i.pravatar.cc/100" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item title="Profile" prepend-icon="mdi-account" />
          <v-list-item title="Settings" prepend-icon="mdi-cog" />
          <v-divider />
          <v-list-item title="Logout" prepend-icon="mdi-logout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      width="260"
      mobile
      :permanent="mdAndUp"
      class="pt-4"
      color="grey-darken-3"
      elevation="1"
    >
      <v-list nav>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.route"
          link
          active-class="v-list-item--active"
        >
          <template #prepend>
            <v-icon size="20">{{ item.icon }}</v-icon>
          </template>
          <template v-if="item.title === 'Appointment Requests' && pendingCount > 0" #append>
            <v-badge
              color="orange"
              text-color="white"
              :content="pendingCount"
              inline
            ></v-badge>
          </template> 

          {{ item.title }}
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn block variant="tonal" :to="{ name: 'admin-logout' }">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
     <!-- Main Content -->
        <v-main class="bg-grey-lighten-5">
        <v-container fluid>
          <slot />
        </v-container>
      </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

const drawer = ref(false)
const pendingCount = ref(0)
const route = useRoute()

const { mdAndUp, smAndDown } = useDisplay()

async function fetchPendingCount() {
  try {
    const data = await $fetch('/api/appointments/stats')
    pendingCount.value = data.Pending || 0
  } catch (error) {
    console.error('Failed to fetch pending count:', error)
  }
}

onMounted(fetchPendingCount)

// Refresh count on route change to keep it up to date
watch(() => route.path, fetchPendingCount)

const navIcon = computed(() =>
  drawer.value ? 'mdi-close' : 'mdi-menu'
)

const items = [
  {
    title: 'Dashboard',
    route: { name: 'admin-dashboard' },
    icon: 'mdi-view-dashboard-outline',
  },
  {
    title: 'Appointment Requests',
    route: { name: 'admin-appointment-requests' },
    icon: 'mdi-file-document-alert-outline',
  },
  {
    title: 'Appointments',
    route: { name: 'admin-appointments' },
    icon: 'mdi-calendar-check-outline',
  },
  {
    title: 'Patient Records',
    route: { name: 'admin-patient-records' },
    icon: 'mdi-text-box-edit-outline',
  },
  {
    title: 'Products',
    route: { name: 'admin-products' },
    icon: 'mdi-cart-variant',
  },
  {
    title: 'Settings',
    route: { name: 'admin-settings' },
    icon: 'mdi-cog',
  },
]
</script>
