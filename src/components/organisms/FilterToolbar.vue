<template>
  <div
    class="flex flex-col gap-3 rounded-2xl border border-line/70 bg-main p-3 shadow-soft md:flex-row md:items-end"
  >
    <SearchField
      v-model="localQuery"
      class="md:flex-1"
      :placeholder="searchPlaceholder"
      @search="emitSearch"
    />
    <BaseSelect
      v-if="showCategory"
      v-model="localCategory"
      class="md:w-44"
      :options="categoryOptions"
      @update:model-value="emitChange"
    />
    <BaseSelect
      v-model="localSort"
      class="md:w-40"
      :options="sortOptions"
      @update:model-value="emitChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import SearchField from '@/components/molecules/SearchField.vue'
import BaseSelect from '@/components/atoms/BaseSelect.vue'

const props = defineProps({
  query: { type: String, default: '' },
  category: { type: String, default: '전체' },
  sort: { type: String, default: 'latest' },
  categoryOptions: { type: Array, default: () => [] },
  sortOptions: { type: Array, default: () => [] },
  searchPlaceholder: { type: String, default: '검색어를 입력하세요' },
  showCategory: { type: Boolean, default: true },
})

const emit = defineEmits(['update:query', 'update:category', 'update:sort', 'search'])

const localQuery = ref(props.query)
const localCategory = ref(props.category)
const localSort = ref(props.sort)

watch(
  () => props.query,
  (v) => {
    localQuery.value = v
  },
)
watch(
  () => props.category,
  (v) => {
    localCategory.value = v
  },
)
watch(
  () => props.sort,
  (v) => {
    localSort.value = v
  },
)

function emitSearch() {
  emit('update:query', localQuery.value)
  emit('search')
}

function emitChange() {
  emit('update:category', localCategory.value)
  emit('update:sort', localSort.value)
  emit('search')
}
</script>
