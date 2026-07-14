<template>
  <div
    class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
    :class="
      role === 'user'
        ? 'ml-auto bg-accent text-white'
        : 'mr-auto bg-white text-ink shadow-soft'
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
