<template>
  <div
    v-if="open"
    class="pointer-events-none fixed inset-0 z-50"
  >
    <div class="absolute inset-0 bg-ink/20" />
    <div
      class="pointer-events-auto animate-scale-in absolute right-3 top-16 flex h-[min(560px,70vh)] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-soft sm:right-6"
      role="dialog"
      aria-label="챗봇"
    >
      <div class="flex items-center justify-between border-b border-line/60 bg-main px-4 py-3">
        <div>
          <p class="text-sm text-ink">LocalHub 챗봇</p>
          <p class="text-xs text-muted">서울 여행 도우미</p>
        </div>
        <button
          type="button"
          class="rounded-lg p-1 text-muted hover:bg-main"
          aria-label="닫기"
          @click="$emit('close')"
        >
          <BaseIcon name="x" :size="18" />
        </button>
      </div>

      <div ref="scrollRef" class="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        <ChatBubble
          v-for="(msg, i) in messages"
          :key="i"
          :role="msg.role"
          :text="msg.text"
        />
        <ChatBubble v-if="sending" role="bot" text="입력 중…" />
      </div>

      <form
        class="flex gap-2 border-t border-line/60 bg-main p-3"
        @submit.prevent="onSend"
      >
        <input
          v-model="draft"
          type="text"
          class="flex-1 rounded-xl border border-line bg-main px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="메시지를 입력하세요"
          :disabled="sending"
        />
        <BaseButton type="submit" :disabled="!draft.trim() || sending">
          <BaseIcon name="send" :size="16" />
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import ChatBubble from '@/components/molecules/ChatBubble.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import { chatApi } from '@/services/chatApi'

const props = defineProps({
  open: Boolean,
})

defineEmits(['close'])

const messages = ref([
  {
    role: 'bot',
    text: '안녕하세요! LocalHub 챗봇입니다. 서울 관광·커뮤니티에 대해 물어보세요.',
  },
])
const draft = ref('')
const sending = ref(false)
const scrollRef = ref(null)

async function scrollBottom() {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}

watch(
  () => props.open,
  (v) => {
    if (v) scrollBottom()
  },
)

async function onSend() {
  const text = draft.value.trim()
  if (!text || sending.value) return
  messages.value.push({ role: 'user', text })
  draft.value = ''
  sending.value = true
  await scrollBottom()
  try {
    const { reply } = await chatApi.send({
      message: text,
      history: messages.value,
    })
    messages.value.push({ role: 'bot', text: reply })
  } catch {
    messages.value.push({
      role: 'bot',
      text: '잠시 오류가 났어요. 다시 시도해 주세요.',
    })
  } finally {
    sending.value = false
    await scrollBottom()
  }
}
</script>
