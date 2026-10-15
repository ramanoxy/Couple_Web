<template>
  <div class="relative w-full">
    <!-- Image 1 Design: Sleek Dark Capsule Player -->
    <div
      class="w-full rounded-full bg-[#4A4758] text-white p-2 sm:p-2.5 px-3.5 sm:px-4 flex items-center justify-between shadow-lg shadow-black/10 border border-white/10 transition-all hover:bg-[#524E62]"
    >
      <!-- Left: Mini Spinning Vinyl Disc + Track Info -->
      <div
        class="flex items-center gap-3 cursor-pointer flex-1 min-w-0 mr-2"
        @click="isPlayerModalOpen = true"
        title="Buka pemutar piringan hitam"
      >
        <!-- Mini Vinyl Disc -->
        <div
          class="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950 p-1 flex items-center justify-center flex-shrink-0 shadow-md border border-slate-700/60"
          :class="{ 'animate-spin-vinyl': store.isPlaying }"
        >
          <!-- Vinyl Groove Circles -->
          <div class="absolute inset-1 rounded-full border border-slate-800/80 pointer-events-none" />
          <div class="absolute inset-2 rounded-full border border-slate-800/50 pointer-events-none" />

          <!-- Center Album Art (CAS or custom cover) -->
          <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-white/60 relative z-10 flex items-center justify-center bg-black">
            <img
              v-if="store.currentTrack?.coverUrl"
              :src="store.currentTrack.coverUrl"
              :alt="store.currentTrack.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-[9px]">🌸</div>
          </div>
          <!-- Center Spindle Hole -->
          <div class="absolute w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700 z-20" />
        </div>

        <!-- Track Text -->
        <div class="min-w-0 flex-1">
          <h4 class="text-xs sm:text-[13px] font-semibold text-white truncate tracking-tight">
            {{ store.currentTrack?.title || "Nothing's Gonna Hurt You Baby" }}
          </h4>
          <p class="text-[10px] text-slate-300/80 truncate font-light flex items-center gap-1">
            <span>{{ store.currentTrack?.artist || 'Cigarettes After Sex' }}</span>
            <span>•</span>
            <span class="text-rose-200/90">our soundtrack</span>
          </p>
        </div>
      </div>

      <!-- Right: Play/Pause Action Button -->
      <button
        @click="handleTogglePlay"
        class="w-9 h-9 rounded-full flex items-center justify-center text-slate-200 hover:text-white transition-transform active:scale-90 flex-shrink-0"
        :title="store.isPlaying ? 'Jeda' : 'Putar'"
      >
        <!-- Play / Pause Icon -->
        <svg v-if="!store.isPlaying" class="w-6 h-6 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14.752 11.168l-6.518-3.759A1 1 0 007 8.24v7.52a1 1 0 001.234.97l6.518-1.758a1 1 0 000-1.804z" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10 9v6m4-6v6" />
        </svg>
      </button>
    </div>

    <!-- Full Vinyl & Story Modal (Opened when clicking the capsule) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isPlayerModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
        @click.self="isPlayerModalOpen = false"
      >
        <div class="relative w-full max-w-sm rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white p-5 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <!-- Modal Top Bar -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-serif italic text-slate-400">Our Soundtrack</span>
            </div>
            <button
              @click="isPlayerModalOpen = false"
              class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          <!-- Flip Vinyl Disc / Story Page -->
          <div class="perspective-1000 w-full mb-4">
            <div
              class="relative w-full h-[200px] transition-transform duration-700 transform-style-3d cursor-pointer select-none"
              :class="{ 'rotate-y-180': store.isStoryFlipped }"
              @click="store.isStoryFlipped = !store.isStoryFlipped"
            >
              <!-- Front: Vinyl Disc -->
              <div class="absolute inset-0 backface-hidden rounded-2xl p-4 bg-gradient-to-br from-[#FAF7F2] to-[#FCE8EB]/40 border border-slate-100 flex flex-col items-center justify-center overflow-hidden shadow-inner">
                <div
                  class="relative w-36 h-36 rounded-full bg-slate-950 p-1.5 shadow-xl flex items-center justify-center border-4 border-slate-800"
                  :class="{ 'animate-spin-vinyl': store.isPlaying }"
                >
                  <div class="absolute inset-2 rounded-full border border-slate-700/60 pointer-events-none" />
                  <div class="absolute inset-4 rounded-full border border-slate-700/50 pointer-events-none" />
                  <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white/90 shadow-md relative z-10">
                    <img
                      v-if="store.currentTrack?.coverUrl"
                      :src="store.currentTrack.coverUrl"
                      :alt="store.currentTrack.title"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="absolute w-2 h-2 rounded-full bg-slate-900 border border-slate-700 z-20" />
                </div>
                <p class="text-[10px] text-slate-400 mt-2 font-medium">
                  Ketuk untuk membalik & baca cerita kenangan
                </p>
              </div>

              <!-- Back: Story Behind The Song -->
              <div class="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-4 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1F2] border border-rose-200/60 flex flex-col justify-between text-left overflow-y-auto no-scrollbar shadow-inner">
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[10px] font-bold text-rose-600 uppercase">Cerita di Balik Lagu</span>
                    <span class="text-[9px] text-slate-400">{{ store.currentTrack?.createdAt }}</span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 truncate">"{{ store.currentTrack?.title }}"</h4>
                  <p class="text-[10px] text-slate-500 mb-2 truncate">{{ store.currentTrack?.artist }}</p>
                  <div class="p-2.5 rounded-xl bg-white/80 border border-rose-100">
                    <p class="text-xs text-slate-700 italic font-editorial leading-relaxed">
                      "{{ store.currentTrack?.story || 'Lagu ini selalu mengingatkanku pada kita berdua.' }}"
                    </p>
                  </div>
                </div>
                <div class="pt-2 border-t border-rose-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Ditambahkan oleh: <strong>{{ store.currentTrack?.addedBy === 'men' ? store.partners.men.callsign : store.partners.women.callsign }}</strong></span>
                  <span class="text-rose-500 font-semibold">Kembali</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Track Info -->
          <div class="text-center mb-2">
            <h4 class="text-sm font-bold text-slate-800 truncate">{{ store.currentTrack?.title }}</h4>
            <p class="text-xs text-slate-500 truncate">{{ store.currentTrack?.artist }}</p>
          </div>

          <!-- Progress Bar & Seek -->
          <div class="mb-3 px-1">
            <div class="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden cursor-pointer" @click="handleSeek">
              <div
                class="h-full bg-gradient-to-r from-rose-400 to-sky-400 rounded-full transition-all duration-150"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-[9px] text-slate-400 font-medium mt-1">
              <span>{{ formatTime(store.currentTime) }}</span>
              <span>{{ formatTime(store.currentDuration) }}</span>
            </div>
          </div>

          <!-- Playback Controls -->
          <div class="flex items-center justify-center gap-4 mb-3">
            <button
              @click="handlePrevTrack"
              class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:text-slate-900"
              title="Lagu Sebelumnya"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              @click="handleTogglePlay"
              class="w-11 h-11 rounded-full bg-[#4A4758] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              :title="store.isPlaying ? 'Jeda' : 'Putar'"
            >
              <svg v-if="!store.isPlaying" class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>

            <button
              @click="handleNextTrack"
              class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:text-slate-900"
              title="Lagu Berikutnya"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          <!-- Playlist Drawer -->
          <div class="pt-2 border-t border-slate-100 overflow-y-auto no-scrollbar max-h-32">
            <div class="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
              <span>Daftar Lagu ({{ store.playlist.length }})</span>
              <button
                @click="isAddModalOpen = true"
                class="text-rose-600 font-bold hover:underline"
              >
                + Tambah
              </button>
            </div>
            <div class="space-y-1">
              <div
                v-for="(song, idx) in store.playlist"
                :key="song.id"
                @click="store.currentTrackIndex = idx"
                class="px-2.5 py-1.5 rounded-xl border text-[11px] flex items-center justify-between cursor-pointer transition-all"
                :class="store.currentTrackIndex === idx ? 'bg-rose-50 border-rose-200 font-bold text-slate-800' : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white'"
              >
                <div class="flex items-center gap-1.5 truncate">
                  <span class="truncate">{{ song.title }} — {{ song.artist }}</span>
                </div>
                <button
                  @click.stop="store.deleteSong(song.id)"
                  class="text-slate-300 hover:text-red-500 ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Add Song Modal -->
    <AddSongModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import AddSongModal from '~/components/AddSongModal.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

const isPlayerModalOpen = ref(false)
const isAddModalOpen = ref(false)

const progressPercent = computed(() => {
  if (!store.currentDuration) return 0
  return Math.min(100, (store.currentTime / store.currentDuration) * 100)
})

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

function handleTogglePlay() {
  if (!store.currentTrack) return
  audio.playKeyClick(420)
  store.togglePlay()
  if (store.isPlaying) {
    audio.playTrackWithFadeIn(store.currentTrack.audioUrl, store.playerVolume, (cur, dur) => {
      store.currentTime = cur
      store.currentDuration = dur
    })
  } else {
    audio.pauseTrack()
  }
}

function handleNextTrack() {
  if (!store.currentTrack) return
  audio.playKeyClick(460)
  store.nextTrack()
  if (store.isPlaying && store.currentTrack) {
    audio.playTrackWithFadeIn(store.currentTrack.audioUrl, store.playerVolume, (cur, dur) => {
      store.currentTime = cur
      store.currentDuration = dur
    })
  }
}

function handlePrevTrack() {
  if (!store.currentTrack) return
  audio.playKeyClick(380)
  store.prevTrack()
  if (store.isPlaying && store.currentTrack) {
    audio.playTrackWithFadeIn(store.currentTrack.audioUrl, store.playerVolume, (cur, dur) => {
      store.currentTime = cur
      store.currentDuration = dur
    })
  }
}

function handleSeek(event: MouseEvent) {
  if (!store.currentTrack) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const ratio = Math.max(0, Math.min(1, clickX / rect.width))
  const newTime = ratio * store.currentDuration
  store.currentTime = newTime
  audio.seek(newTime)
}
</script>
