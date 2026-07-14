<template>
  <label class="flex w-full flex-col gap-1.5 text-left">
    <span v-if="label" class="text-xs text-muted">{{ label }}</span>
    <select
      :value="modelValue"
      :disabled="disabled"
      class="w-full appearance-none rounded-xl border border-line bg-white/80 px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  disabled: Boolean,
})

defineEmits(['update:modelValue'])
</script>
