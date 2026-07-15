<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <h1 class="mb-6 text-2xl text-ink">글 수정</h1>
    <div v-if="loadingPost" class="h-64 animate-pulse rounded-2xl bg-main" />
    <div v-else-if="post" class="rounded-2xl bg-main p-5 shadow-soft">
      <PostForm
        :initial="{
          author: post.author,
          title: post.title,
          content: post.content,
          password: '',
        }"
        lock-author
        :loading="loading"
        submit-label="수정"
        password-placeholder="작성 시 입력한 비밀번호"
        @update:form="(v) => (form = v)"
        @submit="onSubmit"
        @cancel="$router.push(`/community/${id}`)"
      />
      <p v-if="error" class="mt-3 text-sm text-danger">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostForm from '@/components/organisms/PostForm.vue'
import { postApi } from '@/services/postApi'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const post = ref(null)
const loadingPost = ref(true)
const loading = ref(false)
const error = ref('')
let form = { author: '', password: '', title: '', content: '' }

onMounted(async () => {
  try {
    post.value = await postApi.get(id, { incrementView: false })
  } catch {
    router.replace('/community')
  } finally {
    loadingPost.value = false
  }
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await postApi.update(id, {
      title: form.title,
      content: form.content,
      password: form.password,
    })
    router.push(`/community/${id}`)
  } catch (e) {
    error.value =
      e.message === 'FORBIDDEN'
        ? '비밀번호가 올바르지 않습니다.'
        : '수정에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>
