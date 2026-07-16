<template>
  <header
    class="fixed left-1/2 top-3 z-40 w-full max-w-5xl -translate-x-1/2 px-4"
  >
    <div
      class="bg-nav-glass flex h-14 items-center justify-between gap-2 rounded-2xl border border-line px-3 shadow-soft backdrop-blur-md sm:px-6"
    >
      <RouterLink
        to="/"
        class="font-display shrink-0 text-base tracking-tight text-ink transition hover:text-accent sm:text-lg"
      >
        서울이음
      </RouterLink>

      <nav class="flex min-w-0 items-center gap-0.5 sm:gap-2">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-xl px-2 py-1.5 font-sans text-xs text-ink transition hover:bg-accent-soft sm:px-3 sm:py-2 sm:text-sm"
          active-class="bg-accent !text-on-accent shadow-soft"
        >
          {{ item.label }}
        </RouterLink>
        <button
          type="button"
          class="rounded-xl p-2 text-ink transition hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          :aria-label="isDark ? '라이트모드로 전환' : '다크모드로 전환'"
          @click="toggleTheme"
        >
          <BaseIcon :name="isDark ? 'sun' : 'moon'" :size="20" />
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import { useTheme } from '@/composables/useTheme'

const navItems = [
  { to: '/tourism', label: '관광정보' },
  { to: '/directions', label: '길찾기' },
  { to: '/community', label: '커뮤니티' },
]

const { isDark, toggleTheme } = useTheme()
</script>
