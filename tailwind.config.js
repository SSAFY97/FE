/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        main: 'var(--color-main)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        line: 'var(--color-line)',
        danger: 'var(--color-danger)',
        'danger-soft': 'var(--color-danger-soft)',
        like: 'var(--color-like)',
        'like-soft': 'var(--color-like-soft)',
        warm: 'var(--color-warm)',
        'warm-ink': 'var(--color-warm-ink)',
        'on-accent': 'var(--color-on-accent)',
        scrim: 'var(--color-scrim)',
      },
      fontFamily: {
        display: ['YeogiOttaeJalnan', 'sans-serif'],
        sans: ['Paperlogy', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 28px -14px color-mix(in oklab, var(--color-ink) 22%, transparent)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
