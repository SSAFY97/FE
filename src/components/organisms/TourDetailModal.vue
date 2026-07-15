<template>
  <BaseModal :open="open" :title="modalTitle" size="lg" @close="$emit('close')">
    <div v-if="loading" class="space-y-3">
      <div class="h-48 animate-pulse rounded-xl bg-accent-soft" />
      <div class="h-4 w-2/3 animate-pulse rounded bg-accent-soft" />
      <div class="h-3 w-1/2 animate-pulse rounded bg-accent-soft" />
    </div>

    <div v-else-if="error" class="py-6 text-center">
      <p class="text-sm text-muted">{{ error }}</p>
      <BaseButton class="mt-4" variant="secondary" @click="fetchDetail">
        다시 시도
      </BaseButton>
    </div>

    <div v-else-if="detail" class="space-y-4">
      <div class="h-48 overflow-hidden rounded-xl bg-accent-soft sm:h-56">
        <BaseImage
          :src="detail.firstimage || detail.firstimage2 || ''"
          :alt="detail.title"
          class="block h-full w-full object-cover"
        />
      </div>
      <div class="space-y-2">
        <p class="text-sm text-ink">
          <span class="text-muted">주소</span>
          <span class="mt-0.5 block">{{ addressText }}</span>
        </p>
        <p v-if="detail.tel" class="text-sm text-ink">
          <span class="text-muted">전화</span>
          <span class="mt-0.5 block">{{ detail.tel }}</span>
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/atoms/BaseModal.vue'
import BaseImage from '@/components/atoms/BaseImage.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { locationApi } from '@/api/locationApi'

const props = defineProps({
  open: Boolean,
  locationId: { type: [String, Number], default: '' },
})

defineEmits(['close'])

const loading = ref(false)
const error = ref('')
const detail = ref(null)

const modalTitle = computed(() => detail.value?.title || '장소 상세')

const addressText = computed(() => {
  if (!detail.value) return '주소 정보 없음'
  const parts = [detail.value.addr1, detail.value.addr2].filter(Boolean)
  return parts.length ? parts.join(' ') : '주소 정보 없음'
})

async function fetchDetail() {
  if (!props.locationId) return
  loading.value = true
  error.value = ''
  detail.value = null
  try {
    detail.value = await locationApi.get(props.locationId)
  } catch {
    error.value = '장소 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.open, props.locationId],
  ([open, id]) => {
    if (open && id) fetchDetail()
    if (!open) {
      detail.value = null
      error.value = ''
    }
  },
)
</script>
