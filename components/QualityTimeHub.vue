<template>
  <div class="space-y-4">
    <!-- Segmented Glass Tab Switcher -->
    <div class="p-1 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm flex items-center gap-1">
      <button
        @click="selectTab('deep-talk')"
        class="flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
        :class="[
          store.qualityTimeTab === 'deep-talk'
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        ]"
      >
        <span>💬</span>
        <span>Deep Talk</span>
      </button>

      <button
        @click="selectTab('date-jar')"
        class="flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
        :class="[
          store.qualityTimeTab === 'date-jar'
            ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        ]"
      >
        <span>🏺</span>
        <span>Date Jar</span>
      </button>

      <button
        @click="selectTab('passport')"
        class="flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
        :class="[
          store.qualityTimeTab === 'passport'
            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        ]"
      >
        <span>🛂</span>
        <span>Paspor</span>
      </button>
    </div>

    <!-- Active Sub-Feature View with Transition -->
    <transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="transform translate-y-3 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      mode="out-in"
    >
      <div :key="store.qualityTimeTab">
        <!-- A. Deep Talk Card Deck -->
        <DeepTalkCardDeck v-if="store.qualityTimeTab === 'deep-talk'" />

        <!-- B. Date Idea Jar / Gacha -->
        <DateIdeaJar v-else-if="store.qualityTimeTab === 'date-jar'" />

        <!-- C. Quality Time Passport (Memory Vault) -->
        <QualityTimePassport v-else-if="store.qualityTimeTab === 'passport'" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import DeepTalkCardDeck from '~/components/DeepTalkCardDeck.vue'
import DateIdeaJar from '~/components/DateIdeaJar.vue'
import QualityTimePassport from '~/components/QualityTimePassport.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

function selectTab(tab: 'deep-talk' | 'date-jar' | 'passport') {
  if (store.qualityTimeTab !== tab) {
    audio.playKeyClick(460)
    store.qualityTimeTab = tab
  }
}
</script>
