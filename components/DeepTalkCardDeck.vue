<template>
  <div class="space-y-4">
    <!-- Sub-feature Header & Action -->
    <div class="flex items-center justify-between px-1">
      <div>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span>💬</span>
          <span>Deep Talk Card Deck</span>
        </h3>
        <p class="text-[11px] text-slate-400 font-medium">
          Kartu obrolan hangat untuk pillow talk & date night
        </p>
      </div>

      <button
        @click="isAddModalOpen = true"
        class="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 flex items-center gap-1 soft-tactile-btn"
      >
        <span>+</span>
        <span>Buat Pertanyaan</span>
      </button>
    </div>

    <!-- Empty State if no cards -->
    <div
      v-if="store.deepTalkCards.length === 0"
      class="glass-card rounded-[32px] p-8 text-center flex flex-col items-center justify-center border-2 border-dashed border-purple-200/80 my-2"
    >
      <div class="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center text-4xl mb-3 shadow-inner">
        💬
      </div>
      <h4 class="text-base font-extrabold text-slate-800 mb-1">
        Belum Ada Kartu Deep Talk
      </h4>
      <p class="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
        Buat pertanyaan pertama kalian untuk saling mengenal lebih dalam saat pillow talk atau date night!
      </p>
      <button
        @click="isAddModalOpen = true"
        class="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-400 to-rose-soft text-white text-xs font-bold shadow-md soft-tactile-btn"
      >
        + Buat Pertanyaan Pertama
      </button>
    </div>

    <!-- 3D Card Deck Flip Container if cards exist -->
    <template v-else-if="currentCard">
      <div class="perspective-1000 w-full">
        <div
          class="relative w-full h-[280px] transition-transform duration-700 transform-style-3d cursor-pointer select-none"
          :class="{ 'rotate-y-180': store.isDeepTalkFlipped }"
          @click="handleFlipCard"
        >
          <!-- FRONT SIDE OF CARD -->
          <div
            class="absolute inset-0 backface-hidden rounded-[32px] p-6 glass-card bg-gradient-to-br from-white/90 via-purple-50/40 to-pink-50/40 border-2 border-white shadow-liquid flex flex-col justify-between"
          >
            <!-- Top Row: Category & Card Counter -->
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
                :class="getCategoryBadgeClass(currentCard.category)"
              >
                {{ currentCard.category }}
              </span>

              <span class="text-[11px] font-bold text-slate-400">
                #{{ store.currentDeepTalkIndex + 1 }} / {{ store.deepTalkCards.length }}
              </span>
            </div>

            <!-- Question Content -->
            <div class="my-auto py-2 text-center">
              <p class="text-base sm:text-lg font-extrabold text-slate-800 leading-snug tracking-tight">
                "{{ currentCard.question }}"
              </p>
            </div>

            <!-- Bottom: Flip Hint & Added By -->
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span class="flex items-center gap-1 font-semibold text-purple-600">
                <span>🔄</span>
                <span>Ketuk untuk spark prompt</span>
              </span>

              <span class="font-medium">
                Oleh {{ currentCard.addedBy === 'mas' ? 'Mas 💙' : 'Adek 💖' }}
              </span>
            </div>
          </div>

          <!-- BACK SIDE OF CARD -->
          <div
            class="absolute inset-0 backface-hidden rotate-y-180 rounded-[32px] p-6 glass-card bg-gradient-to-br from-[#FAF5FF] via-[#FDF2F8] to-[#FFF1F2] border-2 border-purple-200 shadow-liquid flex flex-col justify-between text-center"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                <span>✨</span>
                <span>Tantangan & Aturan Bermain</span>
              </span>
              <span class="text-xs text-slate-400">Balik 🔄</span>
            </div>

            <div class="my-auto py-4 px-2">
              <span class="text-3xl block mb-2">🤝</span>
              <p class="text-sm font-bold text-slate-700 leading-relaxed italic font-handwriting text-xl">
                "{{ currentCard.sparkPrompt }}"
              </p>
            </div>

            <p class="text-[10px] text-slate-400 font-medium">
              Dengarkan tanpa memotong dan peluk pasanganmu ❤️
            </p>
          </div>
        </div>
      </div>

      <!-- Deck Navigation Controls -->
      <div class="grid grid-cols-2 gap-2.5">
        <button
          @click="handleShuffle"
          class="py-2.5 px-4 rounded-2xl bg-white/70 backdrop-blur-md border border-white text-slate-700 text-xs font-bold soft-tactile-btn hover:bg-white flex items-center justify-center gap-2"
        >
          <span>🔀</span>
          <span>Acak Kartu</span>
        </button>

        <button
          @click="handleNextCard"
          class="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-400 to-rose-soft text-white text-xs font-bold shadow-md soft-tactile-btn flex items-center justify-center gap-2"
        >
          <span>Tarik Kartu Baru</span>
          <span>➔</span>
        </button>
      </div>
    </template>

    <!-- Add Question Modal -->
    <AddDeepTalkModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCoupleStore, type DeepTalkQuestion } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import AddDeepTalkModal from '~/components/AddDeepTalkModal.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

const isAddModalOpen = ref(false)

const currentCard = computed<DeepTalkQuestion | null>(() => {
  if (store.deepTalkCards.length === 0) return null
  return store.deepTalkCards[store.currentDeepTalkIndex] || store.deepTalkCards[0] || null
})

function handleFlipCard() {
  audio.playKeyClick(440)
  store.isDeepTalkFlipped = !store.isDeepTalkFlipped
}

function handleNextCard() {
  audio.playKeyClick(500)
  store.nextDeepTalkCard()
}

function handleShuffle() {
  audio.playKeyClick(360)
  store.shuffleDeepTalkDeck()
}

function getCategoryBadgeClass(category?: DeepTalkQuestion['category']) {
  switch (category) {
    case 'Romance':
      return 'bg-rose-100 text-rose-700'
    case 'Memories':
      return 'bg-sky-100 text-sky-700'
    case 'Vulnerability':
      return 'bg-purple-100 text-purple-700'
    case 'Future':
      return 'bg-emerald-100 text-emerald-700'
    case 'Fun':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}
</script>
