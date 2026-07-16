<template>
  <header
    class="fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-40 w-full max-w-5xl -translate-x-1/2 px-3 sm:px-4"
  >
    <div
      ref="navShell"
      class="bg-nav-glass overflow-hidden rounded-2xl border border-line shadow-soft backdrop-blur-md"
    >
      <div class="flex h-14 items-center justify-between gap-2 px-3 sm:px-6">
        <RouterLink
          to="/"
          class="font-display shrink-0 text-base tracking-tight text-ink transition hover:text-accent sm:text-lg"
          @click="closeMenu"
        >
          서울이음
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-2 sm:flex" aria-label="주요 메뉴">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-xl px-3 py-2 font-sans text-sm text-ink transition hover:bg-accent-soft"
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

        <!-- Mobile controls -->
        <div class="flex items-center gap-0.5 sm:hidden">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            :aria-label="isDark ? '라이트모드로 전환' : '다크모드로 전환'"
            @click="toggleTheme"
          >
            <BaseIcon :name="isDark ? 'sun' : 'moon'" :size="20" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            :aria-expanded="menuOpen"
            aria-controls="mobile-nav-menu"
            :aria-label="menuOpen ? '메뉴 닫기' : '메뉴 열기'"
            @click="toggleMenu"
          >
            <BaseIcon :name="menuOpen ? 'x' : 'menu'" :size="22" />
          </button>
        </div>
      </div>

      <!-- Mobile dropdown -->
      <nav
        v-show="menuOpen"
        id="mobile-nav-menu"
        class="animate-fade-in border-t border-line px-2 pb-2 pt-1 sm:hidden"
        aria-label="주요 메뉴"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex min-h-11 items-center rounded-xl px-3 py-2.5 font-sans text-sm text-ink transition hover:bg-accent-soft"
          active-class="bg-accent !text-on-accent shadow-soft"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import { useTheme } from '@/composables/useTheme'

const navItems = [
  { to: '/tourism', label: '관광정보' },
  { to: '/directions', label: '길찾기' },
  { to: '/community', label: '커뮤니티' },
]

const { isDark, toggleTheme } = useTheme()
const route = useRoute()
const menuOpen = ref(false)
const navShell = ref(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') closeMenu()
}

function onPointerDown(event) {
  if (!menuOpen.value || !navShell.value) return
  if (!navShell.value.contains(event.target)) closeMenu()
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>
