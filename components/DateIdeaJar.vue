<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between px-1">
      <div>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span>🏺</span>
          <span>Date Idea Jar (Gacha Kencan)</span>
        </h3>
        <p class="text-[11px] text-slate-400 font-medium">
          Bingung mau kencan apa? Kocok toples dan biarkan takdir memilih!
        </p>
      </div>

      <button
        @click="isAddModalOpen = true"
        class="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold hover:bg-amber-100 flex items-center gap-1 soft-tactile-btn"
      >
        <span>+</span>
        <span>Ide Baru</span>
      </button>
    </div>

    <!-- Category Filter Segment -->
    <div v-if="store.dateIdeas.length > 0" class="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
      <button
        v-for="cat in ['Semua', 'Santai di Rumah', 'Kulineran', 'Outdoor/Jalan']"
        :key="cat"
        @click="store.selectedCategoryFilter = cat"
        class="px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap"
        :class="[
          store.selectedCategoryFilter === cat
            ? 'bg-amber-500 text-white shadow-xs'
            : 'bg-white/60 text-slate-500 border border-slate-200/60 hover:bg-white'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Interactive Glass Jar Container -->
    <div
      class="glass-card p-6 rounded-[36px] text-center flex flex-col items-center justify-center relative overflow-hidden shadow-liquid border-2 border-white/80"
    >
      <!-- Background Ambient Shimmer -->
      <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />
      <div class="absolute -left-10 -top-10 w-40 h-40 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />

      <!-- The Glass Jar Graphic -->
      <div
        class="relative w-36 h-44 mb-4 flex items-center justify-center transition-transform select-none"
        :class="{ 'animate-jar-shake': store.isJarShaking }"
      >
        <!-- Glass Jar Outline Body -->
        <div class="w-full h-full rounded-b-[40px] rounded-t-[16px] bg-white/40 backdrop-blur-md border-4 border-white/90 shadow-[0_12px_24px_rgba(245,158,11,0.15)] relative overflow-hidden flex flex-col items-center p-3">
          <!-- Jar Lid / Cork -->
          <div class="w-24 h-4 rounded-full bg-amber-200/90 border-2 border-amber-300 absolute -top-1 shadow-sm" />

          <!-- Inside Floating Folded Tickets if available -->
          <div v-if="store.dateIdeas.length > 0" class="w-full h-full mt-3 flex flex-wrap gap-2 justify-center items-center content-center opacity-85">
            <div
              v-for="i in Math.min(store.dateIdeas.length, 8)"
              :key="i"
              class="w-6 h-5 rounded-md shadow-xs border text-[8px] font-black flex items-center justify-center transform"
              :class="[
                i % 3 === 0 ? 'bg-rose-200 border-rose-300 rotate-6 text-rose-800' :
                i % 3 === 1 ? 'bg-sky-200 border-sky-300 -rotate-12 text-sky-800' :
                'bg-amber-200 border-amber-300 rotate-12 text-amber-800'
              ]"
            >
              🎟️
            </div>
          </div>
          <!-- Empty jar illustration -->
          <div v-else class="w-full h-full mt-6 flex flex-col items-center justify-center text-center">
            <span class="text-2xl mb-1 opacity-70">✨</span>
            <span class="text-[9px] font-bold text-amber-700/70">Toples Kosong</span>
          </div>

          <!-- Glass Sheen Glare Reflection -->
          <div class="absolute inset-y-0 left-2 w-3 bg-white/30 rounded-full blur-[1px] transform -rotate-12 pointer-events-none" />
        </div>

        <!-- Jar Heart Tag -->
        <div class="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-white/90 border border-amber-200 text-[10px] font-black text-amber-600 shadow-xs">
          {{ store.filteredDateIdeas.length }} Tiket
        </div>
      </div>

      <!-- Action Button if Ideas Exist -->
      <template v-if="store.dateIdeas.length > 0">
        <button
          @click="triggerGacha"
          :disabled="store.isJarShaking"
          class="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white text-xs font-black shadow-lg soft-tactile-btn hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mb-2 disabled:opacity-70"
        >
          <span class="text-base">{{ store.isJarShaking ? '🌀' : '🎲' }}</span>
          <span>{{ store.isJarShaking ? 'Mengocok Toples Cinta...' : 'Kocok Ide Quality Time!' }}</span>
        </button>

        <p class="text-[10px] text-slate-400 font-medium">
          Kocok toples untuk dapat tiket kencan acak berdua
        </p>
      </template>

      <!-- Empty prompt if no ideas -->
      <template v-else>
        <button
          @click="isAddModalOpen = true"
          class="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white text-xs font-black shadow-lg soft-tactile-btn hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mb-2"
        >
          <span>+</span>
          <span>Masukkan Tiket Kencan Pertama</span>
        </button>
        <p class="text-[10px] text-slate-400 font-medium">
          Isi toples dengan rencana kencan santai, kulineran, atau jalan berdua
        </p>
      </template>
    </div>

    <!-- Popped Date Idea Ticket (Result) -->
    <transition
      enter-active-class="transition duration-400 ease-out"
      enter-from-class="transform translate-y-6 scale-90 opacity-0"
      enter-to-class="transform translate-y-0 scale-100 opacity-100"
    >
      <div
        v-if="store.lastDrawnIdea"
        class="p-5 rounded-3xl bg-gradient-to-br from-[#FFFBEB] via-[#FFFDF5] to-[#FEF3C7] border-2 border-dashed border-amber-300 shadow-xl relative overflow-hidden"
      >
        <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFFDF9] border border-amber-300" />
        <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FFFDF9] border border-amber-300" />

        <div class="flex items-center justify-between mb-2 px-1">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-black uppercase tracking-wider">
            🎉 Tiket Terpilih: {{ store.lastDrawnIdea.category }}
          </span>

          <span class="text-[10px] text-amber-700 font-semibold">
            Sudah ditarik {{ store.lastDrawnIdea.drawnCount }}x
          </span>
        </div>

        <h4 class="text-base font-black text-slate-800 my-2 leading-snug px-1">
          {{ store.lastDrawnIdea.title }}
        </h4>

        <p v-if="store.lastDrawnIdea.note" class="text-xs text-slate-600 font-medium leading-relaxed mb-3 px-1 font-handwriting text-base">
          "{{ store.lastDrawnIdea.note }}"
        </p>

        <div class="flex items-center gap-2 pt-2 border-t border-amber-200/60 px-1 text-[11px]">
          <span class="px-2 py-0.5 rounded-lg bg-white/80 border border-amber-200 text-amber-800 font-semibold">
            💰 {{ store.lastDrawnIdea.estimatedCost }}
          </span>
          <span class="px-2 py-0.5 rounded-lg bg-white/80 border border-amber-200 text-amber-800 font-semibold">
            ⏱️ {{ store.lastDrawnIdea.duration }}
          </span>
          <span class="ml-auto text-[10px] text-slate-400">
            Ide dari <strong>{{ store.lastDrawnIdea.addedBy === 'mas' ? 'Mas' : 'Adek' }}</strong>
          </span>
        </div>
      </div>
    </transition>

    <!-- Add Ticket Modal -->
    <AddDateTicketModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import confetti from 'canvas-confetti'
import AddDateTicketModal from '~/components/AddDateTicketModal.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

const isAddModalOpen = ref(false)

function triggerGacha() {
  if (store.dateIdeas.length === 0) return
  audio.playKeyClick(480)
  store.shakeAndDrawDateIdea()

  setTimeout(() => {
    audio.playKeyClick(580)
  }, 400)
  setTimeout(() => {
    audio.playKeyClick(680)
  }, 800)

  setTimeout(() => {
    audio.playUnlockChime()
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FDA4AF', '#7DD3FC', '#FBBF24', '#C084FC']
      })
    } catch (e) {}
  }, 1150)
}
</script>
