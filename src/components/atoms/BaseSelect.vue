<template>
  <div class="flex w-full flex-col gap-1.5 text-left">
    <span v-if="label" :id="labelId" class="text-xs text-muted">{{ label }}</span>
    <div ref="rootRef" class="relative">
      <button
        type="button"
        role="combobox"
        :id="triggerId"
        :aria-expanded="open"
        :aria-controls="listboxId"
        :aria-labelledby="label ? labelId : triggerId"
        :aria-activedescendant="open ? activeDescendantId : undefined"
        :disabled="disabled"
        class="flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-surface py-2.5 pl-3 pr-3 text-left text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-[color-mix(in_oklab,var(--color-accent)_28%,transparent)] disabled:cursor-not-allowed disabled:opacity-50"
        :class="open ? 'border-accent' : ''"
        @click="toggle"
        @keydown="onTriggerKeydown"
      >
        <span class="min-w-0 flex-1 truncate">{{ selectedLabel }}</span>
        <BaseIcon
          name="chevron-down"
          :size="16"
          class="shrink-0 text-muted transition"
          :class="open ? 'rotate-180' : ''"
        />
      </button>

      <ul
        v-if="open"
        :id="listboxId"
        role="listbox"
        class="absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-xl border border-line bg-main p-1 shadow-soft"
        @keydown="onListKeydown"
      >
        <li
          v-for="(opt, i) in options"
          :id="`${listboxId}-opt-${i}`"
          :key="String(opt.value)"
          role="option"
          :aria-selected="isSelected(opt)"
          class="cursor-pointer rounded-lg px-3 py-2 text-sm transition"
          :class="itemClass(opt, i)"
          @click="selectOption(opt)"
          @mouseenter="activeIndex = i"
        >
          {{ opt.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  disabled: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const uid = Math.random().toString(36).slice(2, 9)
const labelId = `base-select-label-${uid}`
const triggerId = `base-select-trigger-${uid}`
const listboxId = `base-select-listbox-${uid}`

const rootRef = ref(null)
const open = ref(false)
const activeIndex = ref(-1)

const selectedLabel = computed(() => {
  const found = props.options.find((o) => String(o.value) === String(props.modelValue))
  return found?.label ?? '선택'
})

const activeDescendantId = computed(() => {
  if (activeIndex.value < 0) return undefined
  return `${listboxId}-opt-${activeIndex.value}`
})

function isSelected(opt) {
  return String(opt.value) === String(props.modelValue)
}

function itemClass(opt, i) {
  if (isSelected(opt)) {
    return 'bg-accent font-medium text-on-accent'
  }
  if (i === activeIndex.value) {
    return 'bg-accent-soft text-ink'
  }
  return 'text-ink hover:bg-accent-soft'
}

function selectedIndex() {
  return props.options.findIndex((o) => String(o.value) === String(props.modelValue))
}

function openMenu() {
  if (props.disabled) return
  open.value = true
  const idx = selectedIndex()
  activeIndex.value = idx >= 0 ? idx : 0
}

function closeMenu() {
  open.value = false
  activeIndex.value = -1
}

function toggle() {
  if (open.value) closeMenu()
  else openMenu()
}

function selectOption(opt) {
  emit('update:modelValue', opt.value)
  closeMenu()
}

function moveActive(delta) {
  if (!props.options.length) return
  const len = props.options.length
  let next = activeIndex.value
  if (next < 0) next = selectedIndex()
  if (next < 0) next = 0
  else next = (next + delta + len) % len
  activeIndex.value = next
  nextTick(() => {
    document.getElementById(`${listboxId}-opt-${next}`)?.scrollIntoView({ block: 'nearest' })
  })
}

function selectActive() {
  const opt = props.options[activeIndex.value]
  if (opt) selectOption(opt)
}

function onTriggerKeydown(e) {
  if (props.disabled) return
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault()
      if (!open.value) openMenu()
      else moveActive(e.key === 'ArrowDown' ? 1 : -1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      if (!open.value) openMenu()
      else selectActive()
      break
    case 'Escape':
      if (open.value) {
        e.preventDefault()
        closeMenu()
      }
      break
    case 'Home':
      if (open.value) {
        e.preventDefault()
        activeIndex.value = 0
      }
      break
    case 'End':
      if (open.value) {
        e.preventDefault()
        activeIndex.value = props.options.length - 1
      }
      break
    default:
      break
  }
}

function onListKeydown(e) {
  onTriggerKeydown(e)
}

function onPointerDown(e) {
  if (!open.value || !rootRef.value) return
  if (!rootRef.value.contains(e.target)) closeMenu()
}

watch(
  () => props.disabled,
  (v) => {
    if (v) closeMenu()
  },
)

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>
