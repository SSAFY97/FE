<template>
  <section class="mx-auto w-full max-w-5xl animate-fade-in px-4">
    <div class="overflow-hidden rounded-3xl bg-main p-4 shadow-soft sm:p-6">
      <div class="mb-4 flex gap-1 overflow-x-auto pb-1" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          role="tab"
          :aria-selected="tab.key === active"
          class="shrink-0 rounded-xl px-3 py-2 text-sm transition"
          :class="
            tab.key === active
              ? 'bg-accent text-main shadow-soft'
              : 'bg-accent-soft text-ink hover:brightness-95'
          "
          @click="$emit('select', tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="preview-stage relative">
        <div
          v-if="loading && !items.length"
          class="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <div
            v-for="n in 8"
            :key="n"
            class="h-60 animate-pulse rounded-2xl bg-accent-soft"
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
              :id="item.contentid || item.id"
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
    </div>
  </section>
</template>

<script setup>
import TourCard from '@/components/molecules/TourCard.vue'
import StateMessage from '@/components/molecules/StateMessage.vue'

defineProps({
  tabs: { type: Array, default: () => [] },
  active: { type: String, default: '' },
  contentKey: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  loading: Boolean,
})

defineEmits(['select', 'select-item'])
</script>

<style scoped>
.preview-stage {
  /* 카드 h-60(240px) × 행 + gap-3 — 모바일 4행 / sm 2행 */
  min-height: calc(15rem * 4 + 0.75rem * 3);
}

@media (min-width: 640px) {
  .preview-stage {
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
</style>
