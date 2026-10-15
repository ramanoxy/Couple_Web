<template>
  <div
    v-if="!store.isUnlocked"
    class="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 py-10 sanctuary-bg-gradient transition-all duration-700 ease-out select-none"
    :class="[
      store.isGatekeeperMelting
        ? 'opacity-0 scale-105 pointer-events-none'
        : 'opacity-100 scale-100'
    ]"
  >
    <!-- Background Ambient Glow -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 -left-12 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl animate-blob-1" />
      <div class="absolute bottom-1/4 -right-12 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl animate-blob-2" />
    </div>

    <!-- Top Spacer for Natural Centering -->
    <div class="w-full flex justify-end relative z-10">
      <button
        @click="showClue = !showClue"
        class="text-[11px] text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
        title="Petunjuk PIN"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <!-- Main Content Area: Emblem, Typography & Keypad -->
    <div class="w-full max-w-[320px] flex flex-col items-center text-center relative z-10">
      <!-- Top Emblem: Rotated Squircle with Line-art Heart -->
      <div class="relative mb-5 flex items-center justify-center">
        <div
          class="w-20 h-20 rounded-[28px] rotate-45 bg-gradient-to-tr from-[#FDF0F2] via-white to-[#E8F3FD] border border-white/90 shadow-[0_10px_25px_rgba(253,164,175,0.2)] flex items-center justify-center transition-transform hover:scale-105"
          :class="{ 'animate-spin-slow': store.isGatekeeperMelting }"
        >
          <!-- Center Heart Icon -->
          <svg
            class="-rotate-45 w-8 h-8 text-[#D88A9A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.6"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Editorial Typography Headline -->
      <h1 class="font-serif text-3xl sm:text-4xl text-slate-800 font-normal tracking-tight mb-1.5">
        Welcome home.
      </h1>
      <p class="text-xs text-slate-500 font-normal mb-6">
        Satu kunci kecil, untuk dunia kita berdua.
      </p>

      <!-- PIN Indicator Dots (4 Dots) -->
      <div
        class="flex items-center justify-center gap-3.5 mb-8"
        :class="{ 'animate-shake': isShaking }"
      >
        <div
          v-for="idx in 4"
          :key="idx"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="[
            pinInput.length >= idx
              ? 'bg-gradient-to-r from-rose-300 to-sky-300 shadow-sm scale-110'
              : 'bg-slate-200/70 border border-slate-300/40'
          ]"
        />
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
          class="mb-4 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold shadow-xs"
        >
          {{ warningMessage }}
        </div>
      </transition>

      <!-- Clue Hint Drawer -->
      <div
        v-if="showClue"
        class="mb-4 px-3.5 py-2 rounded-2xl bg-white/80 border border-slate-200/80 text-slate-600 text-[11px] font-medium text-left w-full shadow-xs"
      >
        <p>Petunjuk: Tanggal jadian kita (PIN: <b>{{ store.secretPin }}</b>)</p>
      </div>

      <!-- Keypad Grid (3 Columns, Circular Buttons) -->
      <div class="grid grid-cols-3 gap-y-4 gap-x-6 w-full max-w-[260px] justify-items-center">
        <!-- Digits 1 to 9 -->
        <button
          v-for="digit in ['1', '2', '3', '4', '5', '6', '7', '8', '9']"
          :key="digit"
          @click="handleDigitPress(digit)"
          class="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-2xl font-light text-slate-700 flex items-center justify-center hover:bg-white active:scale-95 transition-all"
        >
          {{ digit }}
        </button>

        <!-- Bottom Row: Empty Spacer, 0, Backspace -->
        <div class="w-16 h-16" />

        <button
          @click="handleDigitPress('0')"
          class="w-16 h-16 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-2xl font-light text-slate-700 flex items-center justify-center hover:bg-white active:scale-95 transition-all"
        >
          0
        </button>

        <button
          @click="handleDelete"
          class="w-16 h-16 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-all"
          title="Hapus"
        >
          <!-- Minimalist Backspace Icon -->
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.172a2 2 0 01-1.414-.586L3 12z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Bottom Pill Action: "♡ Masuk ke sanctuary" -->
    <div class="w-full flex justify-center relative z-10 pt-4">
      <button
        @click="autoFillOrUnlock"
        class="px-5 py-2.5 rounded-full bg-[#FCECEE] border border-rose-200/60 text-[#9E5466] text-xs font-semibold flex items-center gap-2 shadow-xs hover:bg-[#F9DEE2] active:scale-95 transition-all"
      >
        <svg class="w-3.5 h-3.5 text-[#9E5466]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>Masuk ke sanctuary</span>
      </button>
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
const showClue = ref(false)
const warningMessage = ref('')

function handleDigitPress(digit: string) {
  if (pinInput.value.length >= 4) return

  audio.playKeyClick(400 + pinInput.value.length * 40)
  pinInput.value += digit

  if (pinInput.value.length === 4) {
    validatePin()
  }
}

function handleDelete() {
  if (pinInput.value.length > 0) {
    audio.playKeyClick(320)
    pinInput.value = pinInput.value.slice(0, -1)
    warningMessage.value = ''
  }
}

function validatePin() {
  if (pinInput.value === store.secretPin) {
    audio.playSuccessChime()
    store.unlockSpace()
  } else {
    audio.playErrorBuzz()
    isShaking.value = true
    warningMessage.value = 'Kode rahasia belum tepat'
    setTimeout(() => {
      isShaking.value = false
      pinInput.value = ''
    }, 600)
  }
}

function autoFillOrUnlock() {
  audio.playSuccessChime()
  pinInput.value = store.secretPin
  setTimeout(() => {
    store.unlockSpace()
  }, 200)
}
</script>
