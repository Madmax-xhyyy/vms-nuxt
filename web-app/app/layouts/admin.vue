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

      <!-- Notification Bell -->
      <v-menu
        v-model="notifMenu"
        :close-on-content-click="false"
        max-width="360"
        offset="8"
        @update:model-value="onNotifMenuToggle"
      >
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-badge
              v-if="unreadCount > 0"
              color="orange"
              :content="unreadCount"
              floating
            >
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell-outline</v-icon>
          </v-btn>
        </template>

        <v-card min-width="320" max-height="420">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-3">
            Notifications
            <v-chip v-if="unreadCount > 0" color="orange" size="x-small" class="ml-2">
              {{ unreadCount }} unread
            </v-chip>
          </v-card-title>
          <v-divider />
          <v-list lines="two" class="overflow-y-auto" style="max-height: 340px">
            <template v-if="notifications.length">
              <v-list-item
                v-for="n in notifications"
                :key="n._id"
                :class="n.isRead ? '' : 'bg-orange-lighten-5'"
              >
                <template #prepend>
                  <v-icon :color="n.isRead ? 'grey' : 'orange'" size="20">mdi-bell</v-icon>
                </template>
                <v-list-item-title class="text-body-2 font-weight-medium">
                  {{ n.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ n.message }}
                </v-list-item-subtitle>
                <template #append>
                  <span class="text-caption text-grey">{{ formatRelative(n.createdAt) }}</span>
                </template>
              </v-list-item>
            </template>
            <v-list-item v-else>
              <v-list-item-title class="text-body-2 text-grey text-center pa-4">
                No notifications
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="32">
              <v-img src="https://i.pravatar.cc/100" />
            </v-avatar>
          </v-btn>
        </template>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

const drawer = ref(false)
const pendingCount = ref(0)
const route = useRoute()

const { mdAndUp, smAndDown } = useDisplay();

// ── Notifications ──────────────────────────────────────────────
const notifMenu = ref(false)
const notifications = ref([])
const unreadCount = ref(0)

async function fetchUnreadCount() {
  try {
    const data = await $fetch('/api/notifications/unread-count')
    unreadCount.value = data.count ?? 0
  } catch (e) {
    console.error('Failed to fetch unread count:', e)
  }
}

async function fetchNotifications() {
  try {
    const data = await $fetch('/api/notifications')
    notifications.value = data
  } catch (e) {
    console.error('Failed to fetch notifications:', e)
  }
}

async function markAllUnreadAsRead() {
  const unread = notifications.value.filter(n => !n.isRead)
  await Promise.all(
    unread.map(n =>
      $fetch(`/api/notifications/${n._id}/read`, { method: 'PATCH' }).catch(() => {})
    )
  )
  notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
  unreadCount.value = 0
}

async function onNotifMenuToggle(open) {
  if (open) {
    await fetchNotifications()
    if (unreadCount.value > 0) {
      setTimeout(markAllUnreadAsRead, 1200)
    }
  }
}

function formatRelative(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

let pollInterval = null
onMounted(() => {
  fetchUnreadCount()
  pollInterval = setInterval(fetchUnreadCount, 60000)
})
onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

// ── Pending appointments count ─────────────────────────────────
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
);

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
];

</script>
