<template>
  <header
    class="sticky top-0 z-40 border-b border-white/40 bg-white/50 backdrop-blur-sm"
  >
    <div
      class="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
    >
      <RouterLink to="/" class="text-lg tracking-tight text-ink transition hover:text-accent">
        LocalHub
      </RouterLink>

      <nav class="flex items-center gap-1 sm:gap-2">
        <RouterLink
          to="/tourism"
          class="rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-white/80 hover:text-accent"
          active-class="!text-accent bg-white/70"
        >
          관광정보
        </RouterLink>
        <RouterLink
          to="/community"
          class="rounded-xl px-3 py-2 text-sm text-ink/80 transition hover:bg-white/80 hover:text-accent"
          active-class="!text-accent bg-white/70"
        >
          커뮤니티
        </RouterLink>
        <button
          ref="chatBtnRef"
          type="button"
          class="relative rounded-xl p-2 text-ink/80 transition hover:bg-white/80 hover:text-accent"
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
