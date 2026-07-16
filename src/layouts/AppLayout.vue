<template>
  <div class="flex min-h-screen flex-col">
    <NavBar />
    <main class="relative flex-1">
      <RouterView />
    </main>
    <button
      v-if="!chatOpen"
      type="button"
      class="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-main/40 bg-accent text-on-accent shadow-soft transition duration-200 hover:scale-105 hover:brightness-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label="챗봇 열기"
      @click="chatOpen = true"
    >
      <BaseIcon name="bot" :size="24" />
    </button>
    <ChatModal :open="chatOpen" @close="chatOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from '@/components/organisms/NavBar.vue'
import ChatModal from '@/components/organisms/ChatModal.vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'

const chatOpen = ref(false)
</script>
