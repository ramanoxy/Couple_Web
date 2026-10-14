<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="relative w-full max-w-md rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800">
              Catat Langkah Perjalanan
            </h3>
            <p class="text-[11px] text-slate-400">
              Ditulis oleh {{ store.activePartner.callsign }}
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

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-3.5">
        <!-- Title -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Momen / Milestone</label>
          <input
            v-model="form.title"
            required
            type="text"
            placeholder="Contoh: Pertama Kali Kenalan / Nonton Konser Berdua"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Chapter Category -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Fase Cerita</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            <button
              v-for="chap in chapters"
              :key="chap"
              type="button"
              @click="form.chapter = chap"
              class="py-1.5 px-2 rounded-xl text-[11px] font-semibold border text-center transition-all truncate"
              :class="form.chapter === chap ? 'border-rose-400 bg-rose-50 text-rose-700 font-bold' : 'border-slate-200 text-slate-500 bg-white'"
            >
              {{ chap }}
            </button>
          </div>
        </div>

        <!-- Date & Feeling -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
            <input
              v-model="form.date"
              required
              type="text"
              placeholder="Contoh: 14 Okt 2024"
              class="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-800 font-medium"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Catatan Rasa / Mood</label>
            <input
              v-model="form.feeling"
              type="text"
              placeholder="Contoh: Sangat berkesan"
              class="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-800 font-medium"
            />
          </div>
        </div>

        <!-- Story / Narrative -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Kisah di Balik Momen Ini</label>
          <textarea
            v-model="form.story"
            required
            rows="4"
            placeholder="Ceritakan detail apa yang terjadi, apa yang kalian rasakan saat itu, dan kenapa ini penting bagi kalian..."
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium leading-relaxed resize-none"
          />
        </div>

        <!-- Photo URL -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Foto Kenangan (Opsional)</label>
          <input
            v-model="form.photoUrl"
            type="text"
            placeholder="Masukkan tautan foto (https://...)"
            class="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-sky-500 text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-98 transition-all mt-2 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Simpan ke Perjalanan Cinta</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCoupleStore, type JourneyMilestone } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()
const audio = useAudioEngine()

const chapters: JourneyMilestone['chapter'][] = [
  'Awal Cerita',
  'Kencan Pertama',
  'Momen Manis',
  'Langkah Baru',
  'Rencana Masa Depan'
]

const form = reactive({
  title: '',
  chapter: 'Awal Cerita' as JourneyMilestone['chapter'],
  date: 'Hari ini',
  feeling: '',
  story: '',
  photoUrl: ''
})

function handleSubmit() {
  if (!form.title.trim() || !form.story.trim()) return

  audio.playKeyClick(520)
  store.addJourneyMilestone({
    title: form.title.trim(),
    chapter: form.chapter,
    date: form.date.trim(),
    feeling: form.feeling.trim() || 'Momen berharga kita',
    story: form.story.trim(),
    photoUrl: form.photoUrl.trim() || undefined
  })

  // Reset
  form.title = ''
  form.feeling = ''
  form.story = ''
  form.photoUrl = ''
  emit('close')
}
</script>
