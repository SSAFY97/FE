<template>
  <div class="flex min-h-screen flex-col">
    <NavBar @toggle-chat="chatOpen = !chatOpen" />
    <main class="relative flex-1">
      <RouterView />
    </main>
    <ChatModal :open="chatOpen" @close="chatOpen = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NavBar from '@/components/organisms/NavBar.vue'
import ChatModal from '@/components/organisms/ChatModal.vue'

const route = useRoute()
const chatOpen = ref(false)
const isHome = computed(() => route.name === 'home')
</script>
