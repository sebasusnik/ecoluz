/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      animation: {
        'move': 'move 35s infinite alternate',
        'move-reverse': 'move 40s infinite alternate-reverse',
        'move-slow': 'move 30s infinite alternate',
        'scroll': 'scroll 40s linear infinite',
      },
      keyframes: {
        move: {
          from: {
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
          },
          to: {
            transform: 'translate(150px, 100px) rotate(120deg) scale(1.1)',
          },
        },
        scroll: {
          to: {
            transform: 'translateX(calc(-50% - 10px))',
          },
        },
      },
    },
  },
  plugins: [],
};
