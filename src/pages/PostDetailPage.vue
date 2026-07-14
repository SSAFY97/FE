<template>
  <div class="mx-auto max-w-2xl px-4 py-8">
    <div v-if="loading" class="h-72 animate-pulse rounded-2xl bg-white/70" />
    <article v-else-if="post" class="animate-fade-in">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <RouterLink to="/community" class="text-sm text-accent hover:underline">
          ← 목록
        </RouterLink>
      </div>

      <div class="rounded-2xl bg-white/80 p-6 shadow-soft">
        <h1 class="text-2xl text-ink">{{ post.title }}</h1>
        <p class="mt-2 text-sm text-muted">
          {{ post.author }} · {{ formatDate(post.createdAt) }}
        </p>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-accent-soft"
            :class="post.liked ? 'text-red-500' : ''"
            @click="toggleLike"
          >
            <BaseIcon name="heart" :size="16" />
            {{ post.likes }}
          </button>
          <span class="inline-flex items-center gap-1">
            <BaseIcon name="eye" :size="16" />
            {{ post.views }}
          </span>
          <span>댓글 {{ post.commentCount ?? 0 }}</span>
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

      <section class="mt-6 rounded-2xl bg-white/75 p-5 shadow-soft">
        <h2 class="mb-4 text-lg text-ink">댓글</h2>
        <ul class="mb-5 space-y-3">
          <li
            v-for="c in post.comments || []"
            :key="c.id"
            class="rounded-xl bg-surface/80 px-3 py-2"
          >
            <p class="text-sm text-ink">{{ c.content }}</p>
            <p class="mt-1 text-xs text-muted">
              {{ c.author }} · {{ formatDate(c.createdAt) }}
            </p>
          </li>
          <li v-if="!(post.comments || []).length" class="text-sm text-muted">
            아직 댓글이 없습니다.
          </li>
        </ul>

        <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="addComment">
          <BaseInput v-model="commentAuthor" placeholder="닉네임" class="sm:w-32" />
          <BaseInput v-model="commentContent" placeholder="댓글 내용" class="flex-1" />
          <BaseButton type="submit" :loading="commentLoading">등록</BaseButton>
        </form>
        <p v-if="commentError" class="mt-2 text-sm text-red-500">{{ commentError }}</p>
      </section>
    </article>

    <BaseModal :open="pwOpen" title="비밀번호 확인" @close="pwOpen = false">
      <p class="mb-3 text-sm text-muted">삭제하려면 작성 시 비밀번호를 입력하세요.</p>
      <BaseInput
        v-model="password"
        type="password"
        placeholder="비밀번호"
        class="mb-4"
      />
      <p v-if="deleteError" class="mb-3 text-sm text-red-500">{{ deleteError }}</p>
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
const commentAuthor = ref('')
const commentContent = ref('')
const commentLoading = ref(false)
const commentError = ref('')

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

async function addComment() {
  commentError.value = ''
  commentLoading.value = true
  try {
    post.value = await postApi.addComment(route.params.id, {
      author: commentAuthor.value,
      content: commentContent.value,
    })
    commentContent.value = ''
  } catch {
    commentError.value = '댓글을 등록할 수 없습니다.'
  } finally {
    commentLoading.value = false
  }
}
</script>
