<template>
  <div
    v-if="!store.isUnlocked"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-800 ease-out select-none"
    :class="[
      store.isGatekeeperMelting
        ? 'opacity-0 scale-105 pointer-events-none'
        : 'opacity-100 scale-100'
    ]"
    :style="{
      backdropFilter: store.isGatekeeperMelting ? 'blur(0px)' : 'blur(28px)',
      WebkitBackdropFilter: store.isGatekeeperMelting ? 'blur(0px)' : 'blur(28px)',
      backgroundColor: store.isGatekeeperMelting ? 'rgba(255, 253, 249, 0)' : 'rgba(255, 253, 249, 0.42)'
    }"
  >
    <!-- Background Floating Blobs -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-10 -left-10 w-72 h-72 bg-rose-soft/30 rounded-full blur-2xl animate-blob-1" />
      <div class="absolute -bottom-10 -right-10 w-72 h-72 bg-sky-serene/30 rounded-full blur-2xl animate-blob-2" />
    </div>

    <!-- Main Gatekeeper Glass Container -->
    <div
      class="relative w-full max-w-sm rounded-[36px] bg-white/60 backdrop-blur-2xl border border-white/80 p-7 shadow-[0_20px_50px_rgba(31,38,135,0.12)] flex flex-col items-center text-center overflow-hidden"
    >
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

      <!-- Romantic Header Badge & Icon -->
      <div class="relative mb-5 flex items-center justify-center">
        <!-- Vinyl Record Spin during unlocking transition or idle -->
        <div
          class="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-rose-soft/40 via-white to-sky-serene/40 shadow-liquid flex items-center justify-center"
          :class="{ 'animate-spin-vinyl': store.isGatekeeperMelting || isUnlocking }"
        >
          <div class="w-full h-full rounded-full bg-slate-900 border-2 border-slate-700/60 shadow-inner flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-2 rounded-full border border-slate-700/50" />
            <div class="absolute inset-4 rounded-full border border-slate-700/40" />
            <div class="absolute inset-6 rounded-full border border-slate-700/30" />
            
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-rose-soft to-sky-serene flex items-center justify-center shadow-md text-slate-800">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div class="absolute w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
        </div>

        <!-- Lock Status Badge -->
        <div class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <!-- Welcome Title -->
      <h2 class="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">
        Rumah Kita Berdua
      </h2>
      <p class="text-xs text-slate-500 font-medium max-w-[240px] leading-relaxed mb-6">
        Ruang rahasia {{ store.partners.men.callsign }} & {{ store.partners.women.callsign }}. Masukkan 4-digit kode rahasia.
      </p>

      <!-- PIN Indicator Dots -->
      <div
        class="flex items-center justify-center gap-4 mb-4 py-2"
        :class="{ 'animate-shake': isShaking }"
      >
        <div
          v-for="idx in 4"
          :key="idx"
          class="w-4 h-4 rounded-full transition-all duration-300 relative flex items-center justify-center"
          :class="[
            pinInput.length >= idx
              ? 'scale-110 shadow-liquid-rose'
              : 'scale-90 border border-slate-300/80 bg-white/50'
          ]"
        >
          <div
            v-if="pinInput.length >= idx"
            class="w-full h-full rounded-full bg-gradient-to-tr from-rose-soft via-pink-400 to-sky-soft animate-pop-in"
          />
          <div
            v-else
            class="w-1.5 h-1.5 rounded-full bg-slate-300/70"
          />
        </div>
      </div>

      <!-- Warning Toast on Wrong PIN -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-2 opacity-0"
      >
        <div
          v-if="warningMessage"
          class="mb-3 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-semibold shadow-sm flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ warningMessage }}</span>
        </div>
      </transition>

      <!-- Clue Hint Toggle -->
      <button
        @click="showClue = !showClue"
        class="text-[11px] text-slate-400 hover:text-rose-600 transition-colors mb-4 flex items-center gap-1 font-medium"
      >
        <span>{{ showClue ? 'Sembunyikan Petunjuk' : 'Lupa kodenya? Lihat petunjuk' }}</span>
      </button>

      <div
        v-if="showClue"
        class="mb-4 px-3.5 py-2.5 rounded-2xl bg-sky-50/90 border border-sky-100 text-sky-800 text-xs font-medium text-left w-full flex items-start gap-2"
      >
        <svg class="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Petunjuk: Tanggal jadian kita berdua ({{ store.anniversaryDate }} = PIN: <b>{{ store.secretPin }}</b>)</p>
      </div>

      <!-- Tactile Soft-UI Keypad Grid -->
      <div class="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-2">
        <button
          v-for="digit in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
          :key="digit"
          @click="handleDigitPress(digit)"
          class="h-14 rounded-2xl bg-white/70 backdrop-blur-md border border-white text-slate-700 text-xl font-bold soft-tactile-btn flex items-center justify-center hover:bg-white/90 active:scale-95"
        >
          {{ digit }}
        </button>

        <button
          @click="handleClear"
          class="h-14 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 text-slate-500 text-xs font-bold soft-tactile-btn flex items-center justify-center hover:text-slate-700 active:scale-95 uppercase tracking-wider"
        >
          Clear
        </button>

        <button
          @click="handleDigitPress('0')"
          class="h-14 rounded-2xl bg-white/70 backdrop-blur-md border border-white text-slate-700 text-xl font-bold soft-tactile-btn flex items-center justify-center hover:bg-white/90 active:scale-95"
        >
          0
        </button>

        <button
          @click="handleDelete"
          class="h-14 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 text-slate-500 text-sm font-semibold soft-tactile-btn flex items-center justify-center hover:text-rose-600 active:scale-95"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.172a2 2 0 01-1.414-.586L3 12z" />
          </svg>
        </button>
      </div>

      <!-- Quick Demo Unlock Pill -->
      <div class="mt-3">
        <button
          @click="instantUnlockDemo"
          class="text-[11px] text-slate-400 hover:text-sky-600 underline transition-colors"
        >
          (Buka Langsung dengan PIN Rahasia {{ store.secretPin }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const store = useCoupleStore()
const audio = useAudioEngine()

const pinInput = ref('')
const isShaking = ref(false)
const isUnlocking = ref(false)
const warningMessage = ref('')
const showClue = ref(false)

const wrongGreetings = [
  'Kode rahasia yang dimasukkan belum tepat.',
  'Coba ingat kembali tanggal rahasia kita.',
  'PIN salah, silakan coba kembali.'
]

function handleDigitPress(digit: string) {
  if (pinInput.value.length >= 4 || isUnlocking.value) return

  audio.playKeyClick(400 + pinInput.value.length * 80)
  pinInput.value += digit
  warningMessage.value = ''

  if (pinInput.value.length === 4) {
    checkPin()
  }
}

function handleDelete() {
  if (pinInput.value.length > 0 && !isUnlocking.value) {
    audio.playKeyClick(320)
    pinInput.value = pinInput.value.slice(0, -1)
    warningMessage.value = ''
  }
}

function handleClear() {
  if (!isUnlocking.value) {
    audio.playKeyClick(300)
    pinInput.value = ''
    warningMessage.value = ''
  }
}

function checkPin() {
  if (pinInput.value === store.secretPin) {
    triggerCorrectUnlockTransition()
  } else {
    triggerWrongPin()
  }
}

function triggerWrongPin() {
  audio.playErrorBuzz()
  isShaking.value = true

  const randomGreeting = wrongGreetings[Math.floor(Math.random() * wrongGreetings.length)]
  warningMessage.value = randomGreeting

  setTimeout(() => {
    isShaking.value = false
    pinInput.value = ''
  }, 600)
}

function triggerCorrectUnlockTransition() {
  isUnlocking.value = true
  warningMessage.value = ''

  audio.playUnlockChime()
  audio.playVinylCrackle()

  store.isPlaying = true
  if (store.currentTrack) {
    audio.playTrackWithFadeIn(store.currentTrack.audioUrl, 0.8, (cur, dur) => {
      store.currentTime = cur
      store.currentDuration = dur
    })
  }

  store.unlockSpace()
}

function instantUnlockDemo() {
  pinInput.value = store.secretPin
  triggerCorrectUnlockTransition()
}
</script>
