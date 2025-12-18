/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Use CSS variables for theme colors
        'brand-softer': 'var(--color-brand-softer)',
        'brand-soft': 'var(--color-brand-soft)',
        'brand-medium': 'var(--color-brand-medium)',
        'fg-brand-strong': 'var(--color-fg-brand-strong)',
        'danger-soft': 'var(--color-danger-soft)',
        'danger-medium': 'var(--color-danger-medium)',
        'fg-danger-strong': 'var(--color-fg-danger-strong)',
        'success-soft': 'var(--color-success-soft)',
        'success-medium': 'var(--color-success-medium)',
        'fg-success-strong': 'var(--color-fg-success-strong)',
        'warning-soft': 'var(--color-warning-soft)',
        'warning-medium': 'var(--color-warning-medium)',
        'fg-warning': 'var(--color-fg-warning)',
        'neutral-secondary-medium': 'var(--color-neutral-secondary-medium)',
        'neutral-tertiary': 'var(--color-neutral-tertiary)',
        'neutral-tertiary-medium': 'var(--color-neutral-tertiary-medium)',
        'heading': 'var(--color-heading)',
      },
      borderRadius: {
        'base': '0.5rem',
      },
    },
  },
  plugins: [],
}
