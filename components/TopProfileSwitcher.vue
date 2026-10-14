<template>
  <header class="sticky top-0 z-30 pt-3 pb-2 px-4 backdrop-blur-md bg-white/40 border-b border-white/50 transition-all duration-300">
    <!-- Top Row: App Title & Controls -->
    <div class="flex items-center justify-between mb-2.5">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-soft via-pink-400 to-sky-serene p-0.5 shadow-sm flex items-center justify-center">
          <div class="w-full h-full rounded-full bg-white/85 flex items-center justify-center text-xs">
            💑
          </div>
        </div>
        <div>
          <h1 class="text-sm font-extrabold text-slate-800 tracking-tight leading-none flex items-center gap-1.5">
            <span>Our Space</span>
            <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
              Private
            </span>
          </h1>
          <p class="text-[11px] text-slate-500 font-medium">
            {{ store.partners.mas.callsign }} & {{ store.partners.adek.callsign }}
          </p>
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex items-center gap-1.5">

        <!-- Edit Profile & Settings Button -->
        <button
          @click="store.isProfileModalOpen = true"
          class="w-8 h-8 rounded-full bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-800 soft-tactile-btn"
          title="Pengaturan Profil Pasangan"
        >
          <span class="text-xs">⚙️</span>
        </button>

        <!-- Mute / Unmute Button -->
        <button
          @click="toggleMuteSound"
          class="w-8 h-8 rounded-full bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-800 soft-tactile-btn"
          :title="isMuted ? 'Nyalakan Suara' : 'Hening'"
        >
          <span class="text-xs">{{ isMuted ? '🔇' : '🎵' }}</span>
        </button>

        <!-- Quick Lock Button -->
        <button
          @click="handleQuickLock"
          class="w-8 h-8 rounded-full bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-rose-500 soft-tactile-btn"
          title="Kunci Ruang Rahasia"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- "Who's Home?" Liquid Glass Pill Switcher -->
    <div class="p-1 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm flex items-center relative">
      <!-- Background Slider Indicator -->
      <div
        class="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-300 ease-out shadow-sm"
        :class="[
          store.activePartnerId === 'mas'
            ? 'left-1 bg-gradient-to-r from-sky-serene to-sky-soft text-white'
            : 'left-[calc(50%+2px)] bg-gradient-to-r from-rose-soft to-pink-400 text-white'
        ]"
      />

      <!-- Partner A: Mas -->
      <button
        @click="selectPartner('mas')"
        class="relative flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 z-10"
        :class="[
          store.activePartnerId === 'mas'
            ? 'text-slate-900 font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <div class="w-5 h-5 rounded-full overflow-hidden border border-white/80 shadow-xs flex-shrink-0">
          <img
            :src="store.partners.mas.avatar"
            :alt="store.partners.mas.callsign"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex items-center gap-1 truncate">
          <span>{{ store.partners.mas.callsign }} (Mas)</span>
          <span
            v-if="store.activePartnerId === 'mas'"
            class="w-1.5 h-1.5 rounded-full bg-sky-900 animate-pulse"
          />
        </div>
      </button>

      <!-- Partner B: Adek -->
      <button
        @click="selectPartner('adek')"
        class="relative flex-1 py-1.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-200 z-10"
        :class="[
          store.activePartnerId === 'adek'
            ? 'text-slate-900 font-extrabold'
            : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <div class="w-5 h-5 rounded-full overflow-hidden border border-white/80 shadow-xs flex-shrink-0">
          <img
            :src="store.partners.adek.avatar"
            :alt="store.partners.adek.callsign"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="flex items-center gap-1 truncate">
          <span>{{ store.partners.adek.callsign }} (Adek)</span>
          <span
            v-if="store.activePartnerId === 'adek'"
            class="w-1.5 h-1.5 rounded-full bg-rose-900 animate-pulse"
          />
        </div>
      </button>
    </div>

    <!-- Active Identity Sub-Greeting Banner -->
    <div class="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
      <div class="flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          :class="store.activePartnerId === 'mas' ? 'bg-sky-500' : 'bg-rose-500'"
        />
        <span>
          Sedang aktif sebagai:
          <strong :class="store.activePartnerId === 'mas' ? 'text-sky-700' : 'text-rose-700'">
            {{ store.activePartner.callsign }}
          </strong>
        </span>
      </div>
      <span class="text-[10px] text-slate-400">
        {{ greetingMessage }}
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCoupleStore, type PartnerId } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const store = useCoupleStore()
const audio = useAudioEngine()

const isMuted = ref(false)

const greetingMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Pagi manis ☕'
  if (hour < 15) return 'Siang cerah ☀️'
  if (hour < 18) return 'Sore syahdu ⛅'
  return 'Malam tenang 🌙'
})

function selectPartner(id: PartnerId) {
  if (store.activePartnerId !== id) {
    audio.playKeyClick(id === 'mas' ? 380 : 460)
    store.switchPartner(id)
  }
}



function handleQuickLock() {
  audio.playKeyClick(280)
  audio.pauseTrack()
  store.isPlaying = false
  store.lockSpace()
}

function toggleMuteSound() {
  isMuted.value = !isMuted.value
  if (isMuted.value) {
    audio.setVolume(0)
    audio.pauseTrack()
    store.isPlaying = false
  } else {
    audio.setVolume(0.8)
    audio.resumeTrack(0.8)
    store.isPlaying = true
  }
}
</script>
