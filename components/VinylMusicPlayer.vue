<template>
  <div>
    <!-- 1. Floating Mini Player Capsule (Positioned above bottom nav) -->
    <div
      v-if="store.isUnlocked"
      class="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-30"
    >
      <div
        @click="store.isPlayerModalOpen = true"
        class="glass-card p-2.5 rounded-full flex items-center justify-between shadow-liquid cursor-pointer hover:bg-white/60 transition-all duration-300 border border-white/80 active:scale-[0.99]"
      >
        <!-- Left: Spinning Vinyl Icon & Track Info -->
        <div class="flex items-center gap-3 overflow-hidden pr-2">
          <!-- Mini Vinyl Disc -->
          <div
            class="w-11 h-11 rounded-full bg-slate-900 p-1 flex-shrink-0 relative shadow-sm flex items-center justify-center border border-slate-700"
            :class="{ 'animate-spin-vinyl': store.isPlaying && store.currentTrack }"
          >
            <!-- Vinyl Grooves -->
            <div class="absolute inset-1.5 rounded-full border border-slate-700/60" />
            <!-- Center Cover Art -->
            <div class="w-5 h-5 rounded-full overflow-hidden border border-white/80 relative z-10 bg-slate-800 flex items-center justify-center">
              <img
                v-if="store.currentTrack"
                :src="store.currentTrack.coverUrl"
                :alt="store.currentTrack.title"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-[9px] text-white">🎵</span>
            </div>
            <!-- Center Hole -->
            <div class="absolute w-1 h-1 rounded-full bg-slate-900 z-20" />
          </div>

          <!-- Track Title & Artist -->
          <div class="truncate text-left">
            <template v-if="store.currentTrack">
              <div class="flex items-center gap-1.5">
                <h4 class="text-xs font-bold text-slate-800 truncate">
                  {{ store.currentTrack.title }}
                </h4>
                <span
                  class="text-[9px] font-semibold px-1.5 py-0.2 rounded-full uppercase"
                  :class="store.currentTrack.addedBy === 'mas' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'"
                >
                  {{ store.currentTrack.addedBy === 'mas' ? 'Mas' : 'Adek' }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 truncate">
                {{ store.currentTrack.artist }}
              </p>
            </template>
            <template v-else>
              <h4 class="text-xs font-bold text-slate-700 truncate">
                Belum Ada Lagu Kenangan
              </h4>
              <p class="text-[10px] text-rose-500 font-semibold truncate">
                + Sentuh untuk tambah lagu cinta
              </p>
            </template>
          </div>
        </div>

        <!-- Right: Mini Controls -->
        <div class="flex items-center gap-1 flex-shrink-0" @click.stop>
          <template v-if="store.currentTrack">
            <!-- Play / Pause Button -->
            <button
              @click="handleTogglePlay"
              class="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-soft to-pink-400 text-white flex items-center justify-center shadow-sm soft-tactile-btn hover:scale-105"
            >
              <svg v-if="!store.isPlaying" class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>

            <!-- Next Button -->
            <button
              @click="handleNextTrack"
              class="w-8 h-8 rounded-full bg-white/70 text-slate-600 flex items-center justify-center soft-tactile-btn hover:text-slate-900"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </template>

          <template v-else>
            <button
              @click="isAddModalOpen = true"
              class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold hover:bg-rose-200"
            >
              + Tambah
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- 2. Full Expanded Sheet / Modal with 3D Flip Card -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-full opacity-0"
    >
      <div
        v-if="store.isPlayerModalOpen"
        class="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/40 backdrop-blur-md select-none"
      >
        <div
          class="relative w-full max-w-md mx-auto rounded-t-[36px] bg-white/95 backdrop-blur-2xl border-t border-white p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto no-scrollbar"
        >
          <!-- Top Drag Bar & Close -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <button
              @click="store.isPlayerModalOpen = false"
              class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div class="text-center">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vinyl Turntable</span>
              <p class="text-xs font-extrabold text-slate-700">Playlist Cinta Kita</p>
            </div>

            <!-- Add Song Button -->
            <button
              @click="isAddModalOpen = true"
              class="px-2.5 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-200 hover:bg-rose-100 flex items-center gap-1"
            >
              <span>+</span>
              <span>Lagu Baru</span>
            </button>
          </div>

          <!-- If Empty State -->
          <div v-if="!store.currentTrack" class="py-10 text-center flex flex-col items-center">
            <div class="w-24 h-24 rounded-full bg-rose-50 border-2 border-dashed border-rose-200 flex items-center justify-center text-4xl mb-3 shadow-inner">
              💿
            </div>
            <h4 class="text-base font-extrabold text-slate-800 mb-1">
              Piringan Hitam Masih Kosong
            </h4>
            <p class="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
              Belum ada lagu yang ditambahkan. Masukkan lagu pertama yang paling berkesan dalam perjalanan cinta kalian!
            </p>
            <button
              @click="isAddModalOpen = true"
              class="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn"
            >
              + Tambah Lagu Kenangan Sekarang
            </button>
          </div>

          <!-- If Track Exists -->
          <template v-else>
            <!-- Flip Helper Tip -->
            <div class="mb-3 text-center">
              <button
                @click="store.isStoryFlipped = !store.isStoryFlipped"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-slate-200/80 text-[11px] font-semibold text-slate-600 shadow-xs hover:border-rose-300 transition-all"
              >
                <span>{{ store.isStoryFlipped ? '🎵 Kembali ke Vinyl' : '📖 Baca Cerita di Balik Lagu Ini' }}</span>
                <svg class="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>

            <!-- 3D Card Container (Perspective & Flip) -->
            <div class="perspective-1000 w-full mb-4">
              <div
                class="relative w-full h-[300px] transition-transform duration-700 transform-style-3d cursor-pointer"
                :class="{ 'rotate-y-180': store.isStoryFlipped }"
                @click="store.isStoryFlipped = !store.isStoryFlipped"
              >
                <!-- FRONT: The Spinning Vinyl Player -->
                <div
                  class="absolute inset-0 backface-hidden rounded-3xl p-6 bg-gradient-to-br from-white/90 via-rose-50/40 to-sky-50/40 border border-white shadow-liquid flex flex-col items-center justify-center overflow-hidden"
                >
                  <div
                    class="relative w-48 h-48 rounded-full bg-slate-950 p-2 shadow-2xl flex items-center justify-center border-4 border-slate-800"
                    :class="{ 'animate-spin-vinyl': store.isPlaying }"
                  >
                    <div class="absolute inset-3 rounded-full border border-slate-700/60 pointer-events-none" />
                    <div class="absolute inset-6 rounded-full border border-slate-700/50 pointer-events-none" />
                    <div class="absolute inset-9 rounded-full border border-slate-700/40 pointer-events-none" />
                    <div class="absolute inset-12 rounded-full border border-slate-700/30 pointer-events-none" />

                    <div class="w-18 h-18 rounded-full overflow-hidden border-2 border-white/90 shadow-md relative z-10">
                      <img
                        :src="store.currentTrack.coverUrl"
                        :alt="store.currentTrack.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="absolute w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 z-20" />
                  </div>

                  <p class="text-[10px] text-slate-400 mt-3 font-medium flex items-center gap-1">
                    <span>Sentuh piringan hitam untuk baca cerita cinta 💿</span>
                  </p>
                </div>

                <!-- BACK: "Story Behind This Song" -->
                <div
                  class="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1F2] border border-rose-200/60 shadow-liquid flex flex-col justify-between text-left overflow-y-auto no-scrollbar"
                >
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                        <span>💌</span>
                        <span>Cerita di Balik Lagu</span>
                      </span>
                      <span class="text-[10px] text-slate-400 font-medium">
                        {{ store.currentTrack.createdAt }}
                      </span>
                    </div>

                    <h3 class="text-lg font-extrabold text-slate-800 tracking-tight leading-snug">
                      "{{ store.currentTrack.title }}"
                    </h3>
                    <p class="text-xs text-slate-500 mb-3">
                      {{ store.currentTrack.artist }}
                    </p>

                    <div class="p-3.5 rounded-2xl bg-white/70 border border-rose-100/80 shadow-inner">
                      <p class="text-xs text-slate-700 font-medium leading-relaxed italic font-handwriting text-base">
                        "{{ store.currentTrack.story }}"
                      </p>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
                    <span class="text-[11px] text-slate-500">
                      Ditambahkan oleh:
                    </span>
                    <span
                      class="px-2 py-0.5 rounded-full text-[11px] font-bold"
                      :class="store.currentTrack.addedBy === 'mas' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'"
                    >
                      {{ store.currentTrack.addedBy === 'mas' ? 'Mas 💙' : 'Adek 💖' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Track Info Details -->
            <div class="text-center mb-3">
              <h3 class="text-lg font-black text-slate-800 tracking-tight">
                {{ store.currentTrack.title }}
              </h3>
              <p class="text-xs font-semibold text-slate-500">
                {{ store.currentTrack.artist }}
              </p>
            </div>

            <!-- Progress Bar & Timers -->
            <div class="mb-4">
              <div class="relative w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden cursor-pointer" @click="handleSeek">
                <div
                  class="h-full bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene rounded-full transition-all duration-150"
                  :style="{ width: `${progressPercent}%` }"
                />
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1.5 px-0.5">
                <span>{{ formatTime(store.currentTime) }}</span>
                <span>{{ formatTime(store.currentDuration) }}</span>
              </div>
            </div>

            <!-- Main Player Controls -->
            <div class="flex items-center justify-center gap-6 mb-4">
              <button
                @click="handlePrevTrack"
                class="w-11 h-11 rounded-full bg-white border border-slate-200/80 text-slate-600 flex items-center justify-center soft-tactile-btn hover:text-slate-900"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                @click="handleTogglePlay"
                class="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-soft via-pink-400 to-sky-serene text-white flex items-center justify-center shadow-liquid-rose soft-tactile-btn hover:scale-105"
              >
                <svg v-if="!store.isPlaying" class="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              </button>

              <button
                @click="handleNextTrack"
                class="w-11 h-11 rounded-full bg-white border border-slate-200/80 text-slate-600 flex items-center justify-center soft-tactile-btn hover:text-slate-900"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            <!-- Playlist Drawer / List in Modal -->
            <div class="mt-4 pt-3 border-t border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[11px] font-bold text-slate-600 uppercase">Daftar Lagu ({{ store.playlist.length }})</span>
                <button
                  @click="isAddModalOpen = true"
                  class="text-[11px] text-rose-500 font-bold hover:underline"
                >
                  + Tambah
                </button>
              </div>

              <div class="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                <div
                  v-for="(song, idx) in store.playlist"
                  :key="song.id"
                  @click="store.currentTrackIndex = idx"
                  class="p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all"
                  :class="store.currentTrackIndex === idx ? 'bg-rose-50 border-rose-200 font-bold text-slate-800' : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white'"
                >
                  <div class="flex items-center gap-2 truncate">
                    <span>{{ store.currentTrackIndex === idx && store.isPlaying ? '🔊' : '🎵' }}</span>
                    <span class="truncate">{{ song.title }} — {{ song.artist }}</span>
                  </div>
                  <button
                    @click.stop="store.deleteSong(song.id)"
                    class="text-slate-300 hover:text-red-500 ml-2"
                    title="Hapus lagu"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>

    <!-- Add Song CMS Modal -->
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
