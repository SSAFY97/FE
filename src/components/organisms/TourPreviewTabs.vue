<template>
  <section
    class="mx-auto w-full max-w-5xl animate-fade-in px-4"
    @mouseenter="$emit('pause')"
    @mouseleave="$emit('resume')"
    @focusin="$emit('pause')"
    @focusout="onFocusOut"
  >
    <div
      class="overflow-hidden rounded-3xl border border-line bg-surface/80 p-4 shadow-soft backdrop-blur-md sm:p-6"
    >
      <div class="mb-4 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:thin]" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          role="tab"
          :aria-selected="tab.key === active"
          class="shrink-0 rounded-xl border px-3 py-2 text-sm transition"
          :class="
            tab.key === active
              ? 'border-accent bg-accent text-on-accent shadow-soft'
              : 'border-line bg-main text-ink hover:border-accent/40'
          "
          @click="$emit('select', tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div
        class="preview-stage relative"
        :class="{ 'preview-stage--reserved': loading && !items.length }"
      >
        <div
          v-if="loading && !items.length"
          class="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="h-60 animate-pulse rounded-2xl border border-line bg-accent-soft"
          />
        </div>

        <Transition v-else name="fade" mode="out-in">
          <div
            :key="contentKey"
            class="grid grid-cols-2 items-start gap-3 sm:grid-cols-4"
          >
            <TourCard
              v-for="item in items"
              :key="item.contentid"
              :item="item"
              :title="item.title"
              :address="item.addr1"
              :image="item.firstimage2 || item.firstimage"
              @select="$emit('select-item', $event)"
            />
            <StateMessage
              v-if="!items.length"
              class="col-span-full"
              title="표시할 장소가 없습니다"
            />
          </div>
        </Transition>
      </div>

      <div
        v-if="tabs.length"
        class="mt-4 flex items-center justify-center gap-1.5"
        aria-hidden="true"
      >
        <span
          v-for="tab in tabs"
          :key="tab.key"
          class="h-2 rounded-full transition-all duration-300"
          :class="
            tab.key === active
              ? 'w-5 bg-accent'
              : 'w-2 bg-line'
          "
        />
      </div>

      <div class="mt-4 text-center">
        <RouterLink
          to="/tourism"
          class="text-sm font-medium text-accent transition hover:underline"
        >
          관광정보 전체 보기
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import TourCard from '@/components/molecules/TourCard.vue'
import StateMessage from '@/components/molecules/StateMessage.vue'

defineProps({
  tabs: { type: Array, default: () => [] },
  active: { type: String, default: '' },
  contentKey: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  loading: Boolean,
})

const emit = defineEmits(['select', 'select-item', 'pause', 'resume'])

function onFocusOut(e) {
  const root = e.currentTarget
  if (root && !root.contains(e.relatedTarget)) {
    emit('resume')
  }
}
</script>

<style scoped>
.preview-stage--reserved {
  /* 카드 h-60(240px) × 행 + gap-3 — 모바일 4행 / sm 2행 */
  min-height: calc(15rem * 4 + 0.75rem * 3);
}

@media (min-width: 640px) {
  .preview-stage--reserved {
    min-height: calc(15rem * 2 + 0.75rem);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.28s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
