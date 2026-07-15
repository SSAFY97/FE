import { computed, ref } from 'vue'

const STORAGE_KEY = 'seouleum-theme'
const theme = ref('light')
let initialized = false

function getPreferredTheme() {
  if (typeof window === 'undefined') return 'light'

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(nextTheme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', nextTheme)
}

export function initTheme() {
  if (initialized) return
  theme.value = getPreferredTheme()
  applyTheme(theme.value)
  initialized = true
}

function setTheme(nextTheme) {
  theme.value = nextTheme
  applyTheme(nextTheme)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
  }
}

export function useTheme() {
  initTheme()

  const isDark = computed(() => theme.value === 'dark')

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme: () => setTheme(isDark.value ? 'light' : 'dark'),
  }
}
