<template>
  <div class="flex w-full gap-2">
    <BaseInput
      :model-value="modelValue"
      class="flex-1"
      :placeholder="placeholder"
      @update:model-value="$emit('update:modelValue', $event)"
      @keyup.enter="$emit('search')"
    />
    <BaseButton @click="$emit('search')">
      <BaseIcon name="search" :size="16" />
      검색
    </BaseButton>
  </div>
</template>

<script setup>
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '검색어를 입력하세요' },
})

defineEmits(['update:modelValue', 'search'])
</script>
