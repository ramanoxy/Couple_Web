import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.{js,ts,vue}',
    './App.{js,ts,vue}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#FFFDF9',
        rose: {
          quartz: '#F7CAC9',
          light: '#FFF1F2',
          soft: '#FDA4AF',
          DEFAULT: '#FB7185',
          deep: '#E11D48',
        },
        sky: {
          serene: '#A2D2FF',
          light: '#F0F9FF',
          soft: '#7DD3FC',
          DEFAULT: '#38BDF8',
          deep: '#0284C7',
        },
        slate: {
          base: '#334155',
          dark: '#1E293B',
          midnight: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['Caveat', 'cursive']
      },
      animation: {
        'blob-1': 'blobFloat1 18s ease-in-out infinite alternate',
        'blob-2': 'blobFloat2 22s ease-in-out infinite alternate',
        'blob-3': 'blobFloat3 20s ease-in-out infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
        'spin-vinyl': 'spin 6s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'jar-shake': 'jarShake 0.6s ease-in-out infinite',
        'pop-in': 'popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        blobFloat1: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -60px) scale(1.15)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.92)' },
          '100%': { transform: 'translate(20px, -20px) scale(1.05)' }
        },
        blobFloat2: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-50px, 40px) scale(1.1)' },
          '66%': { transform: 'translate(35px, -45px) scale(0.95)' },
          '100%': { transform: 'translate(-20px, 20px) scale(1.08)' }
        },
        blobFloat3: {
          '0%': { transform: 'translate(0px, 0px) scale(0.95)' },
          '50%': { transform: 'translate(30px, 50px) scale(1.12)' },
          '100%': { transform: 'translate(-25px, -35px) scale(1)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' }
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(4px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-6px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(6px, 0, 0)' }
        },
        jarShake: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '20%': { transform: 'rotate(-8deg) scale(1.06)' },
          '40%': { transform: 'rotate(8deg) scale(1.08)' },
          '60%': { transform: 'rotate(-6deg) scale(1.06)' },
          '80%': { transform: 'rotate(4deg) scale(1.02)' }
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
        }
      },
      boxShadow: {
        'liquid': '0 8px 32px 0 rgba(31, 38, 135, 0.08), 0 1px 2px 0 rgba(255, 255, 255, 0.6) inset',
        'liquid-rose': '0 10px 30px -5px rgba(251, 113, 133, 0.22), 0 1px 2px 0 rgba(255, 255, 255, 0.7) inset',
        'liquid-sky': '0 10px 30px -5px rgba(56, 189, 248, 0.22), 0 1px 2px 0 rgba(255, 255, 255, 0.7) inset',
        'soft-inner': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.8), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.04)',
        'tactile': '0 4px 12px rgba(148, 163, 184, 0.15), 0 1px 2px rgba(255, 255, 255, 0.8) inset',
        'tactile-pressed': 'inset 0 3px 6px rgba(0, 0, 0, 0.08)',
        'glow-rose': '0 0 20px rgba(253, 164, 175, 0.6)',
        'glow-sky': '0 0 20px rgba(162, 210, 255, 0.6)',
      }
    }
  }
}
