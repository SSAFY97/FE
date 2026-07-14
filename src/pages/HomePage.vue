<template>
  <div class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-[72vh] bg-cover bg-center"
      style="background-image: url('/hero.webp')"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-surface/20 via-surface/55 to-surface"
      />
    </div>

    <div class="relative z-10 flex flex-col gap-12 pb-16 pt-10 sm:pt-16">
      <div class="mx-auto max-w-3xl px-4 text-center">
        <p class="text-3xl text-ink sm:text-4xl">LocalHub</p>
        <p class="mt-3 text-sm text-muted sm:text-base">
          서울의 관광 정보와 여행자들의 이야기를 한곳에서
        </p>
      </div>

      <TourPreviewTabs
        :tabs="tabs"
        :active="activeTab"
        :items="previewItems"
        :loading="previewLoading"
        @select="onSelectTab"
      />

      <HotPostList :posts="hotPosts" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TourPreviewTabs from '@/components/organisms/TourPreviewTabs.vue'
import HotPostList from '@/components/organisms/HotPostList.vue'
import { TOUR_CATEGORIES } from '@/constants/tourism'
import { tourismApi } from '@/services/tourismApi'
import { postApi } from '@/services/postApi'

const tabs = TOUR_CATEGORIES
const activeTab = ref(tabs[0].key)
const previewItems = ref([])
const previewLoading = ref(true)
const hotPosts = ref([])
let timer = null

async function loadPreview(category) {
  previewLoading.value = true
  try {
    previewItems.value = await tourismApi.getPreview(category, 8)
  } catch {
    previewItems.value = []
  } finally {
    previewLoading.value = false
  }
}

function nextTab() {
  const idx = tabs.findIndex((t) => t.key === activeTab.value)
  const next = tabs[(idx + 1) % tabs.length]
  activeTab.value = next.key
  loadPreview(next.key)
}

function onSelectTab(key) {
  activeTab.value = key
  loadPreview(key)
  resetTimer()
}

function resetTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(nextTab, 5000)
}

onMounted(async () => {
  await loadPreview(activeTab.value)
  resetTimer()
  try {
    hotPosts.value = await postApi.hot(3)
  } catch {
    hotPosts.value = []
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
