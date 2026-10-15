<template>
  <div
    v-if="store.isDeepTalkModalOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-md transition-all duration-300"
    @click.self="store.isDeepTalkModalOpen = false"
  >
    <div
      class="relative w-full max-w-sm rounded-[32px] bg-[#FAF7F2] border border-white/90 p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden"
    >
      <!-- Top Close Button -->
      <button
        @click="store.isDeepTalkModalOpen = false"
        class="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/80 border border-slate-200/60 text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Badge -->
      <span class="text-[9px] tracking-widest uppercase font-extrabold text-slate-400 mb-1">
        MAKE ROOM FOR US
      </span>

      <!-- Title -->
      <h3 class="font-serif text-2xl text-slate-800 font-normal tracking-tight mb-1">
        A little closer, tonight?
      </h3>
      <p class="text-xs text-slate-500 font-normal mb-5">
        Satu kartu. Satu cerita. Kita berdua.
      </p>

      <!-- Flip Card / Prompt Card Container -->
      <div
        class="w-full min-h-[220px] rounded-[24px] p-6 bg-gradient-to-br from-[#E8F3FD] via-white to-[#FCE8EB] border border-white shadow-sanctuary flex flex-col justify-between items-center text-center transition-all duration-300"
      >
        <!-- Star Icon -->
        <div class="w-7 h-7 rounded-full bg-white/80 text-sky-500 flex items-center justify-center shadow-xs mb-3">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>

        <!-- Question / Prompt Text -->
        <p class="font-editorial text-lg sm:text-xl text-slate-800 leading-relaxed italic px-2">
          "{{ currentPrompt }}"
        </p>

        <!-- Bottom Index Indicator -->
        <span class="text-[10px] tracking-wider uppercase font-semibold text-slate-400 mt-4">
          Kartu {{ currentIndex + 1 }} dari {{ prompts.length }}
        </span>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex items-center gap-3 w-full mt-5">
        <button
          @click="prevCard"
          class="flex-1 py-2.5 rounded-full bg-white border border-slate-200/80 text-slate-600 text-xs font-semibold shadow-xs hover:bg-slate-50 active:scale-95 transition-all"
        >
          Kartu Sebelumnya
        </button>
        <button
          @click="nextCard"
          class="flex-1 py-2.5 rounded-full bg-[#EBF5FE] border border-sky-200/80 text-[#0284C7] text-xs font-bold shadow-xs hover:bg-[#DEEFFF] active:scale-95 transition-all"
        >
          Ganti Kartu ✨
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const store = useCoupleStore()
const audio = useAudioEngine()

const currentIndex = ref(0)

const prompts = [
  'Apa satu hal kecil dariku minggu ini yang diam-diam bikin kamu tersenyum?',
  'Kapan terakhir kali kamu merasa paling aman dan tenang saat bersamaku?',
  'Kalau kita bisa kabur berdua malam ini tanpa mikirin apa-apa, kamu mau ke mana?',
  'Hal apa tentang kita yang paling kamu syukuri saat kamu lagi lelah?',
  'Apa pelukan atau sentuhan kecil yang paling kamu rindukan saat kita berjauhan?',
  'Ceritakan satu momen pertama kali kamu sadar kalau kamu beneran jatuh cinta sama aku.'
]

const currentPrompt = computed(() => prompts[currentIndex.value])

function nextCard() {
  audio.playKeyClick(520)
  currentIndex.value = (currentIndex.value + 1) % prompts.length
}

function prevCard() {
  audio.playKeyClick(420)
  currentIndex.value = (currentIndex.value - 1 + prompts.length) % prompts.length
}
</script>
