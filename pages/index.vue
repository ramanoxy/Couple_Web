<template>
  <div class="min-h-screen relative overflow-x-hidden selection:bg-rose-soft selection:text-rose-900 pb-16">
    <!-- Animated Pastel Blobs Mesh Background -->
    <BackgroundBlobs />

    <!-- Gatekeeper PIN Lock Screen Overlay -->
    <GatekeeperPin />

    <!-- Edit Profile & Settings Modal -->
    <EditProfileModal
      :isOpen="store.isProfileModalOpen"
      @close="store.isProfileModalOpen = false"
    />

    <!-- ========================================================================= -->
    <!-- NATURAL RESPONSIVE CONTAINER (Mobile to Laptop)                            -->
    <!-- ========================================================================= -->
    <div class="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 relative z-10 transition-all duration-300">
      <!-- Universal Responsive Liquid Glass Header -->
      <header class="glass-card rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-4 mb-4 sm:mb-6 shadow-liquid border border-white/80">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <!-- Left: Couple Identity & Anniversary Badge -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-sky-400 p-0.5 shadow-sm flex items-center justify-center flex-shrink-0">
              <div class="w-full h-full rounded-[14px] bg-white/95 flex items-center justify-center text-rose-500">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight leading-tight flex items-center gap-2">
                <span>Our Sweet Space</span>
                <span class="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  Private
                </span>
              </h1>
              <p class="text-[11px] sm:text-xs text-slate-500 font-medium">
                {{ store.partners.men.callsign }} & {{ store.partners.women.callsign }} • Sejak {{ store.anniversaryDate }}
              </p>
            </div>
          </div>

          <!-- Right: Who's Home Switcher & Action Buttons -->
          <div class="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <!-- "Who's Home?" Liquid Glass Pill Switcher -->
            <div class="p-1 rounded-2xl bg-white/70 border border-white/90 shadow-sm flex items-center flex-1 sm:flex-initial sm:w-64">
              <button
                @click="store.switchPartner('men')"
                class="flex-1 py-1.5 px-2.5 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
                :class="store.activePartnerId === 'men' ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              >
                <div class="w-4 h-4 rounded-full overflow-hidden border border-white/80 flex-shrink-0">
                  <img :src="store.partners.men.avatar" class="w-full h-full object-cover" />
                </div>
                <span>{{ store.partners.men.callsign }}</span>
                <span v-if="store.activePartnerId === 'men'" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </button>

              <button
                @click="store.switchPartner('women')"
                class="flex-1 py-1.5 px-2.5 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
                :class="store.activePartnerId === 'women' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              >
                <div class="w-4 h-4 rounded-full overflow-hidden border border-white/80 flex-shrink-0">
                  <img :src="store.partners.women.avatar" class="w-full h-full object-cover" />
                </div>
                <span>{{ store.partners.women.callsign }}</span>
                <span v-if="store.activePartnerId === 'women'" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </button>
            </div>

            <!-- Settings & Profile Modal Button -->
            <button
              @click="store.isProfileModalOpen = true"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 soft-tactile-btn"
              title="Pengaturan Profil"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- Sound Mute/Play Toggle -->
            <button
              @click="toggleMuteSound"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 soft-tactile-btn"
              :title="isMuted ? 'Nyalakan Musik' : 'Heningkan'"
            >
              <svg v-if="!isMuted" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </button>

            <!-- Lock Space -->
            <button
              @click="handleQuickLock"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-rose-500 soft-tactile-btn"
              title="Kunci Ruang Rahasia"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Responsive Content Grid (1 Column on Mobile, 12 Columns on Laptop) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
        <!-- ================================================================= -->
        <!-- LEFT COLUMN: Status Battery & Vinyl Turntable Studio (lg: 4 cols) -->
        <!-- ================================================================= -->
        <div class="lg:col-span-4 space-y-4 sm:space-y-6">
          <!-- Couple Milestone Card -->
          <div class="glass-surface p-3 sm:p-3.5 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  Hari Jadian
                </span>
                <span class="text-xs font-extrabold text-slate-800">
                  {{ store.anniversaryDate }}
                </span>
              </div>
            </div>
            <button
              @click="store.isProfileModalOpen = true"
              class="px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 text-[10px] font-bold shadow-xs hover:border-rose-300 transition-all"
            >
              Ubah Tanggal
            </button>
          </div>

          <!-- Partner Energy Battery & Mood Sliders -->
          <HomeStatusBattery />

          <!-- Vinyl Turntable Studio (Embedded player on both Mobile and Laptop!) -->
          <VinylTurntableStudio />
        </div>

        <!-- ================================================================= -->
        <!-- RIGHT COLUMN: Sticky Notes & Quality Time Hub (lg: 8 cols)       -->
        <!-- ================================================================= -->
        <div class="lg:col-span-8 space-y-4 sm:space-y-6">
          <!-- Section Navigation Bar Tabs -->
          <div class="glass-card p-1.5 rounded-2xl border border-white/80 shadow-sm flex items-center gap-1.5">
            <button
              @click="store.activeTab = 'home'"
              class="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              :class="store.activeTab === 'home' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span>Dinding Pesan</span>
              <span
                class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                :class="store.activeTab === 'home' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'"
              >
                {{ store.stickyNotes.length }}
              </span>
            </button>

            <button
              @click="store.activeTab = 'quality-time'"
              class="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              :class="store.activeTab === 'quality-time' ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Quality Time Hub</span>
            </button>
          </div>

          <!-- Main Tab Body -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform translate-y-3 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            mode="out-in"
          >
            <!-- 1. Sticky Notes Wall Tab -->
            <div v-if="store.activeTab === 'home'" key="notes">
              <StickyNotesWall />
            </div>

            <!-- 2. Quality Time Hub Tab (Journey Milestones & Passport) -->
            <div v-else-if="store.activeTab === 'quality-time'" key="quality">
              <QualityTimeHub />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import BackgroundBlobs from '~/components/BackgroundBlobs.vue'
import GatekeeperPin from '~/components/GatekeeperPin.vue'
import HomeStatusBattery from '~/components/HomeStatusBattery.vue'
import StickyNotesWall from '~/components/StickyNotesWall.vue'
import QualityTimeHub from '~/components/QualityTimeHub.vue'
import VinylTurntableStudio from '~/components/VinylTurntableStudio.vue'
import EditProfileModal from '~/components/EditProfileModal.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

const isMuted = ref(false)

onMounted(() => {
  store.loadFromStorage()
})

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
