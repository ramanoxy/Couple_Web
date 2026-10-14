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
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-soft via-pink-400 to-sky-serene p-0.5 shadow-sm flex items-center justify-center flex-shrink-0">
              <div class="w-full h-full rounded-[14px] bg-white/90 flex items-center justify-center text-lg">
                💑
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
                {{ store.partners.mas.callsign }} & {{ store.partners.adek.callsign }} • Sejak {{ store.anniversaryDate }}
              </p>
            </div>
          </div>

          <!-- Right: Who's Home Switcher & Action Buttons -->
          <div class="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <!-- "Who's Home?" Liquid Glass Pill Switcher -->
            <div class="p-1 rounded-2xl bg-white/70 border border-white/90 shadow-sm flex items-center flex-1 sm:flex-initial sm:w-60">
              <button
                @click="store.switchPartner('mas')"
                class="flex-1 py-1 px-2.5 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
                :class="store.activePartnerId === 'mas' ? 'bg-gradient-to-r from-sky-serene to-sky-soft text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
              >
                <div class="w-4 h-4 rounded-full overflow-hidden border border-white/80 flex-shrink-0">
                  <img :src="store.partners.mas.avatar" class="w-full h-full object-cover" />
                </div>
                <span>{{ store.partners.mas.callsign }}</span>
                <span v-if="store.activePartnerId === 'mas'" class="w-1.5 h-1.5 rounded-full bg-sky-900 animate-pulse" />
              </button>

              <button
                @click="store.switchPartner('adek')"
                class="flex-1 py-1 px-2.5 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
                :class="store.activePartnerId === 'adek' ? 'bg-gradient-to-r from-rose-soft to-pink-400 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
              >
                <div class="w-4 h-4 rounded-full overflow-hidden border border-white/80 flex-shrink-0">
                  <img :src="store.partners.adek.avatar" class="w-full h-full object-cover" />
                </div>
                <span>{{ store.partners.adek.callsign }}</span>
                <span v-if="store.activePartnerId === 'adek'" class="w-1.5 h-1.5 rounded-full bg-rose-900 animate-pulse" />
              </button>
            </div>

            <!-- Settings & Profile Modal Button -->
            <button
              @click="store.isProfileModalOpen = true"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 soft-tactile-btn"
              title="Pengaturan Profil & Ruang"
            >
              <span class="text-xs sm:text-sm">⚙️</span>
            </button>

            <!-- Sound Mute/Play Toggle -->
            <button
              @click="toggleMuteSound"
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/70 border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 soft-tactile-btn"
              :title="isMuted ? 'Nyalakan Musik' : 'Heningkan'"
            >
              <span class="text-xs sm:text-sm">{{ isMuted ? '🔇' : '🎵' }}</span>
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
            <div class="flex items-center gap-2">
              <span class="text-sm">🗓️</span>
              <div>
                <span class="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  Hari Jadian Kita
                </span>
                <span class="text-xs font-extrabold text-slate-800">
                  {{ store.anniversaryDate }}
                </span>
              </div>
            </div>
            <button
              @click="store.isProfileModalOpen = true"
              class="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-soft/80 to-sky-serene/80 text-slate-800 text-[10px] font-black shadow-xs hover:scale-105 transition-all"
            >
              ❤️ Edit Tanggal
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
              <span>🏡</span>
              <span>Dinding Pesan Cinta</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-black">
                {{ store.stickyNotes.length }}
              </span>
            </button>

            <button
              @click="store.activeTab = 'quality-time'"
              class="flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              :class="store.activeTab === 'quality-time' ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'"
            >
              <span>✨</span>
              <span>Our Quality Time Hub</span>
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

            <!-- 2. Quality Time Hub Tab (Deep Talk Deck, Date Jar, Passport) -->
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
