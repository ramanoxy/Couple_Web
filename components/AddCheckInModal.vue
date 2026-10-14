<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="relative w-full max-w-sm rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800">
              Check-in Kencan
            </h3>
            <p class="text-[11px] text-slate-400">
              Dicatat oleh {{ store.activePartner.callsign }}
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
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Momen / Kencan</label>
          <input
            v-model="form.title"
            required
            type="text"
            placeholder="Contoh: Sunset Hunting di Tebing Breksi"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Date & Location -->
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
            <label class="block text-xs font-bold text-slate-700 mb-1">Lokasi</label>
            <input
              v-model="form.location"
              required
              type="text"
              placeholder="Contoh: Yogyakarta"
              class="w-full px-3 py-2 rounded-xl glass-input text-xs text-slate-800 font-medium"
            />
          </div>
        </div>

        <!-- Rating -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Rating Momen</label>
          <div class="flex items-center gap-1.5">
            <button
              v-for="r in 5"
              :key="r"
              type="button"
              @click="form.rating = r"
              class="p-1 transition-transform hover:scale-125 active:scale-95 text-slate-300"
              :class="{ 'text-rose-500': r <= form.rating }"
            >
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            <span class="text-xs font-bold text-rose-600 ml-2">{{ form.rating }} / 5</span>
          </div>
        </div>

        <!-- Photo URL -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Foto Kenangan (Link URL)</label>
          <input
            v-model="form.photoUrl"
            type="text"
            placeholder="Masukkan tautan foto (https://...)"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium mb-2"
          />
        </div>

        <!-- Men Impression -->
        <div>
          <label class="block text-xs font-bold text-sky-700 mb-1">Kesan 1 Kalimat dari {{ store.partners.men.callsign }}</label>
          <input
            v-model="form.menImpression"
            type="text"
            :placeholder="`Apa kesan paling berharga buat ${store.partners.men.callsign}?`"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Women Impression -->
        <div>
          <label class="block text-xs font-bold text-rose-600 mb-1">Kesan 1 Kalimat dari {{ store.partners.women.callsign }}</label>
          <input
            v-model="form.womenImpression"
            type="text"
            :placeholder="`Apa kesan paling berharga buat ${store.partners.women.callsign}?`"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Tags (Pisahkan dengan koma)</label>
          <input
            v-model="tagInput"
            type="text"
            placeholder="First Date, Gelato, Romantic Walk"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
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
          <span>Simpan ke Paspor Kencan</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()
const audio = useAudioEngine()

const presetDefault = 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80'
const tagInput = ref('Quality Time, Date')

const form = reactive({
  title: '',
  date: 'Hari ini',
  location: 'Indonesia',
  rating: 5,
  photoUrl: '',
  menImpression: '',
  womenImpression: ''
})

function handleSubmit() {
  if (!form.title.trim()) return

  audio.playKeyClick(550)
  const tags = tagInput.value
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  store.addMemory({
    title: form.title.trim(),
    date: form.date.trim(),
    location: form.location.trim() || 'Tempat Spesial',
    rating: form.rating,
    photoUrl: form.photoUrl.trim() || presetDefault,
    menImpression: form.menImpression.trim() || 'Momen yang sangat berharga.',
    womenImpression: form.womenImpression.trim() || 'Sangat bahagia di momen ini.',
    tags: tags.length ? tags : ['Date']
  })

  // Reset
  form.title = ''
  form.menImpression = ''
  form.womenImpression = ''
  form.photoUrl = ''
  emit('close')
}
</script>
