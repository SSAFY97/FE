<template>
  <div class="mx-auto max-w-2xl px-4 pt-24">
    <div v-if="loading" class="h-72 animate-pulse rounded-2xl bg-main" />
    <article v-else-if="post" class="animate-fade-in">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <RouterLink to="/community" class="text-sm text-ink hover:underline">
          ← 목록
        </RouterLink>
      </div>

      <div class="rounded-2xl bg-main p-6 shadow-soft">
        <h1 class="text-2xl text-ink">{{ post.title }}</h1>
        <p class="mt-2 text-sm text-muted">
          {{ post.author }} · {{ formatDate(post.createdAt) }}
        </p>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-accent-soft"
            :class="post.liked ? 'text-danger' : ''"
            @click="toggleLike"
          >
            <BaseIcon name="heart" :size="16" />
            {{ post.likes }}
          </button>
          <span class="inline-flex items-center gap-1">
            <BaseIcon name="eye" :size="16" />
            {{ post.views }}
          </span>
        </div>

        <div class="mt-6 whitespace-pre-wrap text-sm leading-7 text-ink">
          {{ post.content }}
        </div>

        <div class="mt-6 flex gap-2 border-t border-line/70 pt-4">
          <BaseButton variant="secondary" @click="$router.push(`/community/${post.id}/edit`)">
            수정
          </BaseButton>
          <BaseButton variant="danger" @click="pwOpen = true">삭제</BaseButton>
        </div>
      </div>
    </article>

    <BaseModal :open="pwOpen" title="비밀번호 확인" @close="pwOpen = false">
      <p class="mb-3 text-sm text-muted">삭제하려면 작성 시 비밀번호를 입력하세요.</p>
      <BaseInput
        v-model="password"
        type="password"
        placeholder="비밀번호"
        class="mb-4"
      />
      <p v-if="deleteError" class="mb-3 text-sm text-danger">{{ deleteError }}</p>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="pwOpen = false">취소</BaseButton>
        <BaseButton variant="danger" :loading="deleting" @click="onDelete">
          삭제
        </BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseModal from '@/components/atoms/BaseModal.vue'
import { postApi } from '@/services/postApi'
import { formatDate } from '@/utils/hash'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const loading = ref(true)
const pwOpen = ref(false)
const password = ref('')
const deleting = ref(false)
const deleteError = ref('')

onMounted(async () => {
  try {
    post.value = await postApi.get(route.params.id)
  } catch {
    router.replace('/community')
  } finally {
    loading.value = false
  }
})

async function toggleLike() {
  try {
    post.value = await postApi.like(route.params.id)
  } catch {
    /* ignore */
  }
}

async function onDelete() {
  deleteError.value = ''
  deleting.value = true
  try {
    await postApi.remove(route.params.id, { password: password.value })
    router.push('/community')
  } catch (e) {
    deleteError.value =
      e.message === 'FORBIDDEN'
        ? '비밀번호가 올바르지 않습니다.'
        : '삭제에 실패했습니다.'
  } finally {
    deleting.value = false
  }
}
</script>
