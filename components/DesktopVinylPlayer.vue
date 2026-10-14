<template>
  <div class="glass-card rounded-[32px] p-5 border border-white/80 shadow-liquid relative overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100/80 mb-3">
      <div class="flex items-center gap-2">
        <span class="text-base">💿</span>
        <div>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">
            Vinyl Turntable Studio
          </h3>
          <p class="text-[10px] text-slate-400 font-medium">
            Pemutar piringan hitam kenangan
          </p>
        </div>
      </div>

      <button
        @click="isAddModalOpen = true"
        class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold hover:bg-rose-100 flex items-center gap-1 soft-tactile-btn"
      >
        <span>+</span>
        <span>Lagu Baru</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!store.currentTrack" class="py-6 text-center flex flex-col items-center">
      <div class="w-20 h-20 rounded-full bg-rose-50 border-2 border-dashed border-rose-200 flex items-center justify-center text-3xl mb-2.5 shadow-inner">
        💿
      </div>
      <h4 class="text-xs font-bold text-slate-700 mb-1">
        Belum Ada Lagu Kenangan
      </h4>
      <p class="text-[10px] text-slate-400 max-w-xs mb-3">
        Tambahkan lagu favorit yang bermakna bagi kalian berdua
      </p>
      <button
        @click="isAddModalOpen = true"
        class="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-[11px] font-bold shadow-sm soft-tactile-btn"
      >
        + Tambah Lagu Pertama
      </button>
    </div>

    <!-- Live Turntable if Track Exists -->
    <template v-else>
      <!-- 3D Card Container -->
      <div class="perspective-1000 w-full mb-3">
        <div
          class="relative w-full h-[220px] transition-transform duration-700 transform-style-3d cursor-pointer select-none"
          :class="{ 'rotate-y-180': store.isStoryFlipped }"
          @click="store.isStoryFlipped = !store.isStoryFlipped"
        >
          <!-- Front Side: Vinyl Record -->
          <div
            class="absolute inset-0 backface-hidden rounded-2xl p-4 bg-gradient-to-br from-white/90 via-rose-50/40 to-sky-50/40 border border-white flex flex-col items-center justify-center overflow-hidden shadow-inner"
          >
            <!-- Vinyl Disc -->
            <div
              class="relative w-36 h-36 rounded-full bg-slate-950 p-1.5 shadow-xl flex items-center justify-center border-4 border-slate-800"
              :class="{ 'animate-spin-vinyl': store.isPlaying }"
            >
              <div class="absolute inset-2 rounded-full border border-slate-700/60 pointer-events-none" />
              <div class="absolute inset-4 rounded-full border border-slate-700/50 pointer-events-none" />
              <div class="absolute inset-6 rounded-full border border-slate-700/40 pointer-events-none" />

              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white/90 shadow-md relative z-10">
                <img
                  :src="store.currentTrack.coverUrl"
                  :alt="store.currentTrack.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="absolute w-2 h-2 rounded-full bg-slate-900 border border-slate-700 z-20" />
            </div>

            <p class="text-[9px] text-slate-400 mt-2 font-medium">
              Ketuk untuk baca cerita cinta di baliknya 📖
            </p>
          </div>

          <!-- Back Side: Story Behind The Song -->
          <div
            class="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-4 bg-gradient-to-br from-[#FFF9F2] to-[#FFF1F2] border border-rose-200/60 flex flex-col justify-between text-left overflow-y-auto no-scrollbar shadow-inner"
          >
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1">
                  <span>💌</span>
                  <span>Cerita Lagu</span>
                </span>
                <span class="text-[9px] text-slate-400">
                  {{ store.currentTrack.createdAt }}
                </span>
              </div>
              <h4 class="text-xs font-black text-slate-800 truncate">
                "{{ store.currentTrack.title }}"
              </h4>
              <p class="text-[10px] text-slate-500 mb-2 truncate">
                {{ store.currentTrack.artist }}
              </p>
              <p class="text-xs text-slate-700 font-medium leading-relaxed italic font-handwriting text-base">
                "{{ store.currentTrack.story }}"
              </p>
            </div>
            <div class="pt-1.5 border-t border-rose-100 flex items-center justify-between text-[10px] text-slate-400">
              <span>Oleh {{ store.currentTrack.addedBy === 'mas' ? 'Mas 💙' : 'Adek 💖' }}</span>
              <span class="text-rose-500 font-semibold">Balik 🔄</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Track Info -->
      <div class="text-center mb-2">
        <h4 class="text-xs font-black text-slate-800 truncate">
          {{ store.currentTrack.title }}
        </h4>
        <p class="text-[10px] font-semibold text-slate-500 truncate">
          {{ store.currentTrack.artist }}
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-3">
        <div class="relative w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden cursor-pointer" @click="handleSeek">
          <div
            class="h-full bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene rounded-full transition-all duration-150"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
        <div class="flex items-center justify-between text-[9px] text-slate-400 font-medium mt-1">
          <span>{{ formatTime(store.currentTime) }}</span>
          <span>{{ formatTime(store.currentDuration) }}</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-4 mb-3">
        <button
          @click="handlePrevTrack"
          class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center soft-tactile-btn hover:text-slate-900"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          @click="handleTogglePlay"
          class="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-soft via-pink-400 to-sky-serene text-white flex items-center justify-center shadow-md soft-tactile-btn hover:scale-105"
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
          class="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center soft-tactile-btn hover:text-slate-900"
        >
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      <!-- Playlist Mini Drawer -->
      <div class="pt-2 border-t border-slate-100">
        <div class="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5 uppercase">
          <span>Playlist ({{ store.playlist.length }})</span>
        </div>
        <div class="space-y-1 max-h-28 overflow-y-auto no-scrollbar">
          <div
            v-for="(song, idx) in store.playlist"
            :key="song.id"
            @click="store.currentTrackIndex = idx"
            class="px-2 py-1 rounded-lg border text-[11px] flex items-center justify-between cursor-pointer transition-all"
            :class="store.currentTrackIndex === idx ? 'bg-rose-50 border-rose-200 font-bold text-slate-800' : 'bg-white/60 border-slate-100 text-slate-600 hover:bg-white'"
          >
            <div class="flex items-center gap-1.5 truncate">
              <span>{{ store.currentTrackIndex === idx && store.isPlaying ? '🔊' : '🎵' }}</span>
              <span class="truncate">{{ song.title }}</span>
            </div>
            <button
              @click.stop="store.deleteSong(song.id)"
              class="text-slate-300 hover:text-red-500 ml-1 text-xs"
              title="Hapus"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </template>

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
