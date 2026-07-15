<template>
  <label class="flex w-full flex-col gap-1.5 text-left">
    <span v-if="label" class="text-xs text-muted">{{ label }}</span>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full rounded-xl border border-line bg-main px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: Boolean,
})

defineEmits(['update:modelValue'])
</script>
