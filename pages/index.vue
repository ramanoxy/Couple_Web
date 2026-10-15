<template>
  <div class="min-h-screen relative sanctuary-bg-gradient selection:bg-rose-100 selection:text-rose-900 flex flex-col justify-between overflow-x-hidden">
    <!-- Animated Pastel Blobs Mesh Background (Subtle ambient) -->
    <BackgroundBlobs />

    <!-- Gatekeeper PIN Lock Screen Overlay (Matches Image 2) -->
    <GatekeeperPin />

    <!-- Edit Profile & Settings Modal -->
    <EditProfileModal
      :isOpen="store.isProfileModalOpen"
      @close="store.isProfileModalOpen = false"
    />

    <!-- Interactive Card Deck Drawer / Modal -->
    <DeepTalkCardModal />

    <!-- ========================================================================= -->
    <!-- EDITORIAL SANCTUARY VIEWPORT CONTAINER (Mobile-first, Centered on Laptop) -->
    <!-- ========================================================================= -->
    <main class="w-full max-w-[420px] mx-auto px-4 pt-5 pb-8 relative z-10 flex flex-col justify-between min-h-screen">
      <!-- TOP SECTION -->
      <div class="space-y-4">
        <!-- 1. Top Bar: "a little space, just us." + Lock Icon -->
        <header class="flex items-center justify-between px-1 text-slate-500">
          <div class="flex items-center gap-2">
            <!-- Home House Icon -->
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="text-xs text-slate-500 font-medium tracking-tight">
              a little space, just us.
            </span>
          </div>

          <div class="flex items-center gap-2.5">
            <!-- Settings Modal Button -->
            <button
              @click="store.isProfileModalOpen = true"
              class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              title="Pengaturan Profil"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- Padlock / Lock Screen Button -->
            <button
              @click="handleQuickLock"
              class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              title="Kunci Ruang Rahasia"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </button>
          </div>
        </header>

        <!-- 2. Floating Partner Switcher Pill: "Alif YOU" & "Sayang" -->
        <div class="flex justify-center pt-1">
          <div class="bg-white/95 backdrop-blur-md rounded-full p-1 px-1.5 shadow-sm border border-slate-100 flex items-center gap-1">
            <!-- Partner Men (Alif) -->
            <button
              @click="store.switchPartner('men')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              :class="store.activePartnerId === 'men' ? 'bg-[#EBF5FE] text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
            >
              <span class="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <span>{{ store.partners.men.callsign }}</span>
              <span
                v-if="store.activePartnerId === 'men'"
                class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#BAE6FD] text-[#0369A1] tracking-wider"
              >
                YOU
              </span>
            </button>

            <!-- Partner Women (Sayang) -->
            <button
              @click="store.switchPartner('women')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
              :class="store.activePartnerId === 'women' ? 'bg-[#FCECEE] text-slate-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'"
            >
              <span class="w-2 h-2 rounded-full bg-[#FB7185]" />
              <span>{{ store.partners.women.callsign }}</span>
              <span
                v-if="store.activePartnerId === 'women'"
                class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#FECDD3] text-[#BE123C] tracking-wider"
              >
                YOU
              </span>
            </button>
          </div>
        </div>

        <!-- 3. Headline & Editorial Greeting -->
        <div class="pt-2 px-1">
          <p class="text-[10px] tracking-widest uppercase font-bold text-slate-400">
            {{ formattedDate }}
          </p>
          <h1 class="font-serif text-3xl sm:text-4xl text-slate-800 font-normal tracking-tight mt-0.5">
            Our little sanctuary.
          </h1>
          <p class="text-xs text-slate-500 font-normal mt-1">
            Dunia boleh ramai. Disini, cuma kita.
          </p>
        </div>

        <!-- MAIN VIEW: HOME TAB -->
        <div v-if="store.activeTab === 'home'" class="space-y-4 pt-1">
          <!-- 4. Heart Battery Card: "How's your heart today?" -->
          <HomeStatusBattery />

          <!-- 5. Little Love Notes Section -->
          <StickyNotesWall />

          <!-- 6. Card "MAKE ROOM FOR US - A little closer, tonight?" -->
          <div
            @click="store.isDeepTalkModalOpen = true"
            class="rounded-[26px] p-4.5 px-5 bg-[#E8F3FD] border border-sky-100/70 flex items-center justify-between cursor-pointer hover:bg-[#DEEEFC] active:scale-[0.99] transition-all shadow-xs"
          >
            <div>
              <span class="text-[9px] tracking-widest uppercase font-extrabold text-slate-400 block mb-0.5">
                MAKE ROOM FOR US
              </span>
              <h3 class="font-serif text-lg sm:text-xl text-slate-800 font-normal leading-snug">
                A little closer, tonight?
              </h3>
              <p class="text-xs text-slate-500 font-normal mt-0.5">
                Satu kartu. Satu cerita. Kita berdua.
              </p>
            </div>

            <!-- Sparkle Starburst Icon -->
            <div class="w-8 h-8 rounded-full text-sky-400 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>

          <!-- 7. Soundtrack Capsule Player (Nothing's Gonna Hurt You Baby) -->
          <VinylTurntableStudio />
        </div>

        <!-- SECONDARY VIEW: OUR TIME TAB (Journey & Passport) -->
        <div v-else-if="store.activeTab === 'quality-time'" class="pt-2">
          <QualityTimeHub />
        </div>
      </div>

      <!-- BOTTOM SECTION: Navigation Pill & Footer Quote -->
      <footer class="pt-8 pb-2 space-y-4">
        <!-- Floating Bottom Navigation Pill (Home / Our time) -->
        <div class="flex justify-center">
          <nav class="bg-white/95 backdrop-blur-md rounded-full p-1.5 px-3 shadow-md border border-slate-100 flex items-center gap-2">
            <!-- Home Tab Button -->
            <button
              @click="switchTab('home')"
              class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
              :class="store.activeTab === 'home' ? 'bg-[#EBF5FE] text-[#0284C7]' : 'text-slate-500 hover:text-slate-800'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </button>

            <!-- Our Time Tab Button -->
            <button
              @click="switchTab('quality-time')"
              class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all"
              :class="store.activeTab === 'quality-time' ? 'bg-[#FCECEE] text-[#E11D48]' : 'text-slate-500 hover:text-slate-800'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Our time</span>
            </button>
          </nav>
        </div>

        <!-- Footer Tagline from Image 1 -->
        <p class="text-[9px] tracking-[0.2em] uppercase font-bold text-slate-400 text-center">
          YOU & ME. THAT'S MY FAVORITE PLACE.
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import BackgroundBlobs from '~/components/BackgroundBlobs.vue'
import GatekeeperPin from '~/components/GatekeeperPin.vue'
import HomeStatusBattery from '~/components/HomeStatusBattery.vue'
import StickyNotesWall from '~/components/StickyNotesWall.vue'
import QualityTimeHub from '~/components/QualityTimeHub.vue'
import VinylTurntableStudio from '~/components/VinylTurntableStudio.vue'
import DeepTalkCardModal from '~/components/DeepTalkCardModal.vue'
import EditProfileModal from '~/components/EditProfileModal.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

onMounted(() => {
  store.loadFromStorage()
})

// Format dynamic date like "KAMIS, 15 OKTOBER"
const formattedDate = computed(() => {
  const now = new Date()
  const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU']
  const months = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER']
  
  const dayName = days[now.getDay()]
  const dateNum = now.getDate()
  const monthName = months[now.getMonth()]
  
  return `${dayName}, ${dateNum} ${monthName}`
})

function switchTab(tab: 'home' | 'quality-time') {
  audio.playKeyClick(480)
  store.activeTab = tab
}

function handleQuickLock() {
  audio.playKeyClick(280)
  audio.pauseTrack()
  store.isPlaying = false
  store.lockSpace()
}
</script>
