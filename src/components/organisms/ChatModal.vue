<template>
  <div
    v-if="open"
    class="pointer-events-none fixed inset-0 z-50 max-sm:pointer-events-auto"
  >
    <div
      class="absolute inset-0 bg-ink/20 sm:hidden"
      aria-hidden="true"
      @click="emit('close')"
    />
    <div
      class="pointer-events-auto animate-scale-in absolute inset-0 flex h-full w-full flex-col overflow-hidden border-0 bg-main sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(560px,70vh)] sm:w-[min(380px,calc(100vw-3rem))] sm:origin-bottom-right sm:rounded-2xl sm:border sm:border-line sm:shadow-soft"
      role="dialog"
      aria-label="챗봇"
    >
      <div class="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-main px-4 py-3">
        <div class="flex min-w-0 items-center gap-3">
          <span
            class="flex shrink-0 items-center justify-center rounded-xl bg-accent-soft p-1.5 text-accent"
            aria-hidden="true"
          >
            <BaseIcon name="bot" :size="18" />
          </span>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-ink">서울이음 챗봇</p>
            <p class="text-xs text-muted">서울 여행 도우미</p>
          </div>
        </div>
        <button
          type="button"
          class="rounded-lg p-1 text-muted transition hover:bg-accent-soft"
          aria-label="닫기"
          @click="emit('close')"
        >
          <BaseIcon name="x" :size="18" />
        </button>
      </div>

      <div
        ref="scrollRef"
        class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain bg-surface p-3"
      >
        <ChatBubble
          v-for="(msg, i) in messages"
          :key="i"
          :role="msg.role"
          :text="msg.text"
        />
        <div
          v-if="sending"
          class="mr-auto flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-md bg-main px-3.5 py-3 shadow-soft"
          aria-label="입력 중"
        >
          <span class="typing-dot" />
          <span class="typing-dot" />
          <span class="typing-dot" />
        </div>
      </div>

      <form
        class="flex shrink-0 gap-2 border-t border-line bg-main p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        @submit.prevent="onSend"
      >
        <input
          v-model="draft"
          type="text"
          class="flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="메시지를 입력하세요"
          :disabled="sending"
        />
        <BaseButton
          type="submit"
          class="!size-10 !shrink-0 !px-0"
          :disabled="!draft.trim() || sending"
        >
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

function isMobileViewport() {
  return window.matchMedia('(max-width: 639px)').matches
}

function lockBodyScroll(lock) {
  if (typeof document === 'undefined') return
  // PC에서는 배경 스크롤/클릭 유지, 모바일 전체화면일 때만 잠금
  const shouldLock = lock && isMobileViewport()
  document.documentElement.style.overflow = shouldLock ? 'hidden' : ''
  document.body.style.overflow = shouldLock ? 'hidden' : ''
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      scrollBottom()
      window.addEventListener('keydown', onKeydown)
      lockBodyScroll(true)
    } else {
      window.removeEventListener('keydown', onKeydown)
      lockBodyScroll(false)
    }
  },
)

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  lockBodyScroll(false)
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
