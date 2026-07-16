<template>
  <form class="flex flex-col gap-4" @submit.prevent="$emit('submit')">
    <BaseInput
      v-model="form.author"
      label="닉네임"
      placeholder="익명 닉네임"
      :disabled="lockAuthor"
      required
    />
    <BaseInput
      v-model="form.password"
      label="비밀번호"
      type="password"
      :placeholder="passwordPlaceholder"
      required
    />
    <BaseInput v-model="form.title" label="제목" placeholder="제목을 입력하세요" required />
    <BaseTextarea
      v-model="form.content"
      label="내용"
      placeholder="내용을 입력하세요"
      :rows="10"
      required
    />
    <div class="flex justify-end gap-2">
      <BaseButton variant="ghost" type="button" @click="$emit('cancel')">
        취소
      </BaseButton>
      <BaseButton type="submit" :loading="loading">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseTextarea from '@/components/atoms/BaseTextarea.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps({
  initial: {
    type: Object,
    default: () => ({ author: '', password: '', title: '', content: '' }),
  },
  submitLabel: { type: String, default: '등록' },
  passwordPlaceholder: { type: String, default: '4자리 이상' },
  loading: Boolean,
  lockAuthor: Boolean,
})

const emit = defineEmits(['submit', 'cancel', 'update:form'])

const form = reactive({
  author: props.initial.author || '',
  password: props.initial.password || '',
  title: props.initial.title || '',
  content: props.initial.content || '',
})

watch(
  form,
  () => emit('update:form', { ...form }),
  { deep: true, immediate: true },
)

watch(
  () => props.initial,
  (v) => {
    form.author = v.author || ''
    form.title = v.title || ''
    form.content = v.content || ''
  },
)
</script>
