<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="relative w-full max-w-sm rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800">
              Tambah Lagu Kenangan
            </h3>
            <p class="text-[11px] text-slate-400">
              Ditambahkan oleh {{ store.activePartner.callsign }}
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Inputs -->
      <form @submit.prevent="handleSubmit" class="space-y-3.5">
        <!-- Song Title -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Judul Lagu</label>
          <input
            v-model="form.title"
            required
            type="text"
            placeholder="Contoh: Sempurna / Monokrom"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Artist -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Penyanyi / Musisi</label>
          <input
            v-model="form.artist"
            required
            type="text"
            placeholder="Contoh: Andra and the BackBone"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Cover Image URL -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Cover Foto (Link URL)</label>
          <input
            v-model="form.coverUrl"
            type="url"
            placeholder="https://... atau biarkan kosong untuk cover standar"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Story Behind The Song -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Cerita di Balik Lagu Ini</label>
          <textarea
            v-model="form.story"
            required
            rows="3"
            placeholder="Mengapa lagu ini berkesan bagi kalian berdua? Kapan momen pertama kali mendengarkannya bersama?"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium leading-relaxed resize-none"
          />
        </div>

        <!-- Audio Source Option -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Audio Lagu</label>
          <input
            v-model="form.customAudioUrl"
            type="text"
            placeholder="Link file MP3 atau audio stream (opsional)"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-sky-500 text-white text-xs font-bold shadow-md soft-tactile-btn mt-2 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Simpan ke Playlist</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()

const defaultCover = 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80'

const form = reactive({
  title: '',
  artist: '',
  coverUrl: '',
  story: '',
  customAudioUrl: ''
})

function handleSubmit() {
  if (!form.title || !form.artist) return

  const finalAudio = form.customAudioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'

  store.addSong({
    title: form.title.trim(),
    artist: form.artist.trim(),
    coverUrl: form.coverUrl.trim() || defaultCover,
    audioUrl: finalAudio,
    story: form.story.trim(),
    duration: 195
  })

  // Reset form
  form.title = ''
  form.artist = ''
  form.story = ''
  form.customAudioUrl = ''
  form.coverUrl = ''

  emit('close')
}
</script>
