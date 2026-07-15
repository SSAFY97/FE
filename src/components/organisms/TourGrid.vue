<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <TourCard
      v-for="item in items"
      :key="item.contentid + (item.title || '')"
      :id="item.contentid || item.id"
      :title="item.title"
      :address="item.addr1"
      :image="item.firstimage2 || item.firstimage"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script setup>
import TourCard from '@/components/molecules/TourCard.vue'

defineProps({
  items: { type: Array, default: () => [] },
})

defineEmits(['select'])
</script>
