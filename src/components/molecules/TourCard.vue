<template>
  <article
    class="group flex h-full min-h-[240px] flex-col overflow-hidden rounded-2xl bg-main shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div class="relative h-[60%] min-h-[144px] flex-[3] overflow-hidden bg-accent-soft">
      <img
        v-if="image"
        :src="image"
        :alt="title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-full items-center justify-center text-sm text-muted"
      >
        이미지 없음
      </div>
    </div>
    <div class="flex flex-[2] flex-col gap-1 p-3">
      <h3 class="line-clamp-2 text-sm text-ink">{{ title }}</h3>
      <p class="line-clamp-2 text-xs text-muted">{{ address || '주소 정보 없음' }}</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  address: { type: String, default: '' },
  image: { type: String, default: '' },
})
</script>
