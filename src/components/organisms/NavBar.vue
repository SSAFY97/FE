<template>
  <header
    class="fixed left-1/2 top-3 z-40 w-full max-w-5xl -translate-x-1/2 px-4"
  >
    <div
      class="flex h-14 items-center justify-between rounded-2xl border border-line/70 bg-main px-4 shadow-soft backdrop-blur-sm sm:px-6"
    >
      <RouterLink to="/" class="text-lg tracking-tight text-ink transition hover:text-accent">
        LocalHub
      </RouterLink>

      <nav class="flex items-center gap-1 sm:gap-2">
        <RouterLink
          to="/tourism"
          class="rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-accent-soft hover:text-ink"
          active-class="bg-accent-soft !text-ink"
        >
          관광정보
        </RouterLink>
        <RouterLink
          to="/community"
          class="rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-accent-soft hover:text-ink"
          active-class="bg-accent-soft !text-ink"
        >
          커뮤니티
        </RouterLink>
        <button
          ref="chatBtnRef"
          type="button"
          class="relative rounded-xl p-2 text-ink/80 transition hover:bg-accent-soft hover:text-ink"
          aria-label="챗봇 열기"
          @click="$emit('toggle-chat')"
        >
          <BaseIcon name="chat" :size="20" />
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseIcon from '@/components/atoms/BaseIcon.vue'

defineEmits(['toggle-chat'])

const chatBtnRef = ref(null)

defineExpose({ chatBtnRef })
</script>
