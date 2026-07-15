<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <h1 class="mb-6 text-2xl text-ink">글쓰기</h1>
    <div class="rounded-2xl bg-main p-5 shadow-soft">
      <PostForm
        :loading="loading"
        submit-label="등록"
        @update:form="(v) => (form = v)"
        @submit="onSubmit"
        @cancel="$router.push('/community')"
      />
      <p v-if="error" class="mt-3 text-sm text-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PostForm from '@/components/organisms/PostForm.vue'
import { postApi } from '@/services/postApi'

const router = useRouter()
const loading = ref(false)
const error = ref('')
let form = {
  author: '',
  password: '',
  title: '',
  content: '',
}

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const post = await postApi.create(form)
    router.push(`/community/${post.id}`)
  } catch {
    error.value = '작성에 실패했습니다. 입력값을 확인해 주세요.'
  } finally {
    loading.value = false
  }
}
</script>
