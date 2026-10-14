<template>
  <nav
    v-if="store.isUnlocked"
    class="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40 select-none pointer-events-auto"
  >
    <div
      class="glass-card px-4 py-2.5 rounded-full flex items-center justify-around shadow-2xl border border-white/80 backdrop-blur-2xl bg-white/70"
    >
      <!-- Home Tab -->
      <button
        @click="selectTab('home')"
        class="flex flex-col items-center gap-0.5 text-xs font-bold transition-all relative py-1 px-3 rounded-2xl"
        :class="[
          store.activeTab === 'home'
            ? 'text-rose-600 scale-105'
            : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <span class="text-base">🏡</span>
        <span class="text-[10px]">Home Status</span>
        <span
          v-if="store.activeTab === 'home'"
          class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-rose-500"
        />
      </button>

      <!-- Music Vinyl Center Button -->
      <button
        @click="openPlayerModal"
        class="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border-2 border-white/90 shadow-liquid flex items-center justify-center soft-tactile-btn group"
        title="Buka Vinyl Player"
      >
        <!-- Vinyl Grooves -->
        <div class="absolute inset-1.5 rounded-full border border-slate-700/60 pointer-events-none" />
        <!-- Center Spinning Badge -->
        <div
          class="w-5 h-5 rounded-full overflow-hidden border border-white/80"
          :class="{ 'animate-spin-vinyl': store.isPlaying }"
        >
          <img
            v-if="store.currentTrack"
            :src="store.currentTrack.coverUrl"
            :alt="store.currentTrack.title"
            class="w-full h-full object-cover"
          />
          <span v-else class="text-[8px] text-white">🎵</span>
        </div>
        <!-- Little playing pulse badge -->
        <span
          v-if="store.isPlaying"
          class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-white animate-pulse"
        />
      </button>

      <!-- Quality Time Tab -->
      <button
        @click="selectTab('quality-time')"
        class="flex flex-col items-center gap-0.5 text-xs font-bold transition-all relative py-1 px-3 rounded-2xl"
        :class="[
          store.activeTab === 'quality-time'
            ? 'text-sky-600 scale-105'
            : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <span class="text-base">✨</span>
        <span class="text-[10px]">Quality Time</span>
        <span
          v-if="store.activeTab === 'quality-time'"
          class="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-sky-500"
        />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const store = useCoupleStore()
const audio = useAudioEngine()

function selectTab(tab: 'home' | 'quality-time') {
  if (store.activeTab !== tab) {
    audio.playKeyClick(420)
    store.activeTab = tab
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function openPlayerModal() {
  audio.playKeyClick(500)
  store.isPlayerModalOpen = true
}
</script>
