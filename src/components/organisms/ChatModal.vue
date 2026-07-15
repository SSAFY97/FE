<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50"
  >
    <div
      class="absolute inset-0 bg-ink/20"
      aria-hidden="true"
      @click="emit('close')"
    />
    <div
      class="pointer-events-auto animate-scale-in absolute right-3 top-16 flex h-[min(560px,70vh)] w-[min(380px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-soft sm:right-6"
      role="dialog"
      aria-label="챗봇"
    >
      <div class="flex items-center justify-between border-b border-line/60 bg-main px-4 py-3">
        <div>
          <p class="text-sm text-ink">서울이음 챗봇</p>
          <p class="text-xs text-muted">서울 여행 도우미</p>
        </div>
        <button
          type="button"
          class="rounded-lg p-1 text-muted hover:bg-main"
          aria-label="닫기"
          @click="emit('close')"
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
        <div
          v-if="sending"
          class="mr-auto flex max-w-[85%] items-center gap-1 rounded-2xl bg-main px-3.5 py-3 shadow-soft"
          aria-label="입력 중"
        >
          <span class="typing-dot" />
          <span class="typing-dot" />
          <span class="typing-dot" />
        </div>
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
import { ref, watch, nextTick, onUnmounted } from 'vue'
import ChatBubble from '@/components/molecules/ChatBubble.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import { chatApi } from '@/services/chatApi'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['close'])

const messages = ref([
  {
    role: 'bot',
    text: '안녕하세요! 서울이음 챗봇입니다. 서울 관광·커뮤니티에 대해 물어보세요.',
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

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      scrollBottom()
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
)

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

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

<style scoped>
.typing-dot {
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background: var(--color-muted);
  animation: typing-bounce 1s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  30% {
    transform: translateY(-3px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typing-dot {
    animation: none;
    opacity: 0.7;
  }
}
</style>
