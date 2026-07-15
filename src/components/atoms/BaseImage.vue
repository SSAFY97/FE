<template>
  <img
    :src="displaySrc"
    :alt="alt"
    v-bind="$attrs"
    @error="onError"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { FALLBACK_IMAGE } from '@/utils/image'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
})

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const displaySrc = computed(() => {
  if (failed.value || !props.src) return FALLBACK_IMAGE
  return props.src
})

function onError() {
  if (failed.value) return
  failed.value = true
}
</script>
