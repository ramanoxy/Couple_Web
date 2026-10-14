<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="relative w-full max-w-sm rounded-[32px] bg-white/90 backdrop-blur-2xl border border-white p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-sm">
            🎵
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-800">
              Tambah Lagu Kenangan
            </h3>
            <p class="text-[11px] text-slate-400">
              Ditambahkan oleh <strong>{{ store.activePartner.callsign }}</strong>
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm"
        >
          ✕
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
            placeholder="Contoh: Komang / Menemukanmu"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Artist -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Artis / Penyanyi</label>
          <input
            v-model="form.artist"
            required
            type="text"
            placeholder="Contoh: Raim Laode"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Cover Image URL / Preset Selection -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Cover Foto Kenangan (URL)</label>
          <div class="flex gap-2">
            <input
              v-model="form.coverUrl"
              type="url"
              placeholder="https://... atau pilih preset di bawah"
              class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
            />
          </div>
          <!-- Preset Cover Photos -->
          <div class="flex gap-2 mt-2">
            <button
              v-for="(img, idx) in presetCovers"
              :key="idx"
              type="button"
              @click="form.coverUrl = img"
              class="w-10 h-10 rounded-xl overflow-hidden border-2 transition-all"
              :class="form.coverUrl === img ? 'border-rose-500 scale-105' : 'border-transparent opacity-70'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Romantic Memory / Story Behind The Song -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Cerita di Balik Lagu Ini 💕</label>
          <textarea
            v-model="form.story"
            required
            rows="3"
            placeholder="Kenapa lagu ini bermakna banget buat kita? Kapan pertama kali dengerin bareng?"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium leading-relaxed resize-none"
          />
        </div>

        <!-- Audio Source Option -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Sumber Audio</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              @click="form.audioType = 'preset'"
              class="py-2 px-3 rounded-xl border text-center font-semibold transition-all"
              :class="form.audioType === 'preset' ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-slate-200 text-slate-500'"
            >
              Preset Cozy Lofi
            </button>
            <button
              type="button"
              @click="form.audioType = 'custom'"
              class="py-2 px-3 rounded-xl border text-center font-semibold transition-all"
              :class="form.audioType === 'custom' ? 'border-sky-400 bg-sky-50 text-sky-600' : 'border-slate-200 text-slate-500'"
            >
              Audio URL / File
            </button>
          </div>

          <div v-if="form.audioType === 'custom'" class="mt-2 space-y-2">
            <input
              v-model="form.customAudioUrl"
              type="text"
              placeholder="Masukkan link MP3 atau stream audio"
              class="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
            <div class="relative">
              <input
                type="file"
                accept="audio/*"
                @change="handleFileUpload"
                class="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
              />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn mt-2 flex items-center justify-center gap-1.5"
        >
          <span>✨</span>
          <span>Simpan ke Playlist Cinta Kita</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()

const presetCovers = [
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&q=80'
]

const form = reactive({
  title: '',
  artist: '',
  coverUrl: presetCovers[0],
  story: '',
  audioType: 'preset' as 'preset' | 'custom',
  customAudioUrl: ''
})

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    form.customAudioUrl = URL.createObjectURL(file)
  }
}

function handleSubmit() {
  if (!form.title || !form.artist) return

  let finalAudio = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'
  if (form.audioType === 'custom' && form.customAudioUrl) {
    finalAudio = form.customAudioUrl
  }

  store.addSong({
    title: form.title,
    artist: form.artist,
    coverUrl: form.coverUrl || presetCovers[0],
    audioUrl: finalAudio,
    story: form.story,
    duration: 195
  })

  // Reset form
  form.title = ''
  form.artist = ''
  form.story = ''
  form.customAudioUrl = ''

  emit('close')
}
</script>
