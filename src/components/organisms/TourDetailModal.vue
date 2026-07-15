<template>
  <BaseModal :open="open" :title="modalTitle" size="lg" @close="$emit('close')">
    <div v-if="loading" class="space-y-3">
      <div class="h-52 animate-pulse rounded-2xl bg-accent-soft" />
      <div class="h-4 w-1/3 animate-pulse rounded bg-accent-soft" />
      <div class="h-20 animate-pulse rounded-2xl bg-accent-soft" />
    </div>

    <div v-else-if="error" class="py-8 text-center">
      <p class="text-sm text-muted">{{ error }}</p>
      <BaseButton class="mt-4" variant="secondary" @click="fetchDetail">
        다시 시도
      </BaseButton>
    </div>

    <div v-else-if="detail" class="space-y-5">
      <div class="overflow-hidden rounded-2xl bg-accent-soft">
        <BaseImage
          :src="detail.firstimage || detail.firstimage2 || ''"
          :alt="detail.title"
          class="block h-52 w-full object-cover sm:h-60"
        />
      </div>

      <div v-if="categoryLabel" class="flex flex-wrap items-center gap-2">
        <BaseBadge tone="soft">{{ categoryLabel }}</BaseBadge>
        <span v-if="createdLabel !== '정보 없음'" class="text-xs text-muted">
          {{ createdLabel }} 등록
        </span>
      </div>

      <div class="overflow-hidden rounded-2xl border border-line/60 bg-surface/60">
        <div class="border-b border-line/50 px-4 py-3.5">
          <p class="text-xs font-medium text-muted">주소</p>
          <p class="mt-1 text-sm leading-relaxed text-ink">
            {{ addressText }}
          </p>
        </div>

        <div class="px-4 py-3.5">
          <p class="text-xs font-medium text-muted">전화</p>
          <a
            v-if="detail.tel"
            :href="`tel:${detail.tel}`"
            class="mt-1 inline-flex text-sm font-bold text-accent transition hover:underline"
          >
            {{ detail.tel }}
          </a>
          <p v-else class="mt-1 text-sm text-muted">등록된 번호가 없습니다</p>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/atoms/BaseModal.vue'
import BaseImage from '@/components/atoms/BaseImage.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseBadge from '@/components/atoms/BaseBadge.vue'
import { locationApi } from '@/api/locationApi'
import { TOUR_CATEGORIES } from '@/constants/tourism'

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
  if (!detail.value) return '주소 정보가 없습니다'
  const parts = [detail.value.addr1, detail.value.addr2].filter(Boolean)
  return parts.length ? parts.join(' ') : '주소 정보가 없습니다'
})

const categoryLabel = computed(() => {
  if (!detail.value) return ''
  if (detail.value.category) return detail.value.category
  const typeId = String(detail.value.contenttypeid || '')
  const found = TOUR_CATEGORIES.find((c) => c.contentTypeId === typeId)
  return found?.label || ''
})

const createdLabel = computed(() => {
  const raw = detail.value?.createdtime
  if (!raw) return '정보 없음'
  const s = String(raw).replace(/\D/g, '')
  if (s.length >= 8) {
    const y = s.slice(0, 4)
    const m = s.slice(4, 6)
    const d = s.slice(6, 8)
    return `${y}.${m}.${d}`
  }
  return String(raw)
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
