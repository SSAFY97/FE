<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <TourCard
      v-for="item in items"
      :key="item.contentid + (item.title || '')"
      class="min-h-[240px]"
      :title="item.title"
      :address="item.addr1"
      :image="item.firstimage2 || item.firstimage"
    />
  </div>
</template>

<script setup>
import TourCard from '@/components/molecules/TourCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
})
</script>
