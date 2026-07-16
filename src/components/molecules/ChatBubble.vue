<template>
  <div
    class="max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed"
    :class="
      role === 'user'
        ? 'ml-auto rounded-2xl rounded-br-md bg-accent-soft text-ink'
        : 'mr-auto rounded-2xl rounded-bl-md bg-main text-ink shadow-soft'
    "
  >
    {{ text }}
  </div>
</template>

<script setup>
defineProps({
  role: { type: String, default: 'bot' },
  text: { type: String, default: '' },
})
</script>
