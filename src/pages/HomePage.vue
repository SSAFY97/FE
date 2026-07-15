<template>
  <div class="relative overflow-hidden">
    <div
      class="hero-fade pointer-events-none absolute inset-x-0 top-0 h-[80vh] bg-cover bg-center"
      style="background-image: url('/hero_light.webp')"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-surface/15 via-transparent to-transparent"
      />
    </div>

    <div class="relative z-10 flex flex-col gap-12 pb-16 pt-24 sm:pt-28">
      <div class="mx-auto max-w-3xl px-4 text-center">
        <p class="text-3xl text-ink sm:text-4xl">LocalHub</p>
        <p class="mt-3 text-sm text-muted sm:text-base">
          서울의 관광 정보와 여행자들의 이야기를 한곳에서
        </p>
      </div>

      <TourPreviewTabs
        :tabs="tabs"
        :active="activeTab"
        :content-key="loadedTab"
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
const loadedTab = ref(tabs[0].key)
const previewItems = ref([])
const previewLoading = ref(true)
const hotPosts = ref([])
let timer = null
let loadSeq = 0

async function loadPreview(category) {
  activeTab.value = category
  const seq = ++loadSeq
  const initial = previewItems.value.length === 0
  if (initial) previewLoading.value = true

  try {
    const items = await tourismApi.getPreview(category, 8)
    if (seq !== loadSeq) return
    previewItems.value = items
    loadedTab.value = category
  } catch {
    if (seq !== loadSeq) return
    previewItems.value = []
    loadedTab.value = category
  } finally {
    if (seq === loadSeq) previewLoading.value = false
  }
}

function nextTab() {
  const idx = tabs.findIndex((t) => t.key === activeTab.value)
  const next = tabs[(idx + 1) % tabs.length]
  loadPreview(next.key)
}

function onSelectTab(key) {
  if (key === activeTab.value) return
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

<style scoped>
.hero-fade {
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 40%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 40%,
    transparent 100%
  );
}
</style>
