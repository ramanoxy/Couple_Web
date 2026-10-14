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
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">
            🛂
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-800">
              Check-in Quality Time
            </h3>
            <p class="text-[11px] text-slate-400">
              Dicatat oleh: <strong :class="store.activePartnerId === 'mas' ? 'text-sky-600' : 'text-rose-600'">{{ store.activePartner.callsign }}</strong>
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

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-3.5">
        <!-- Title -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Nama Momen / Kencan</label>
          <input
            v-model="form.title"
            required
            type="text"
            placeholder="Contoh: Sunset Hunting & Angin Sejuk Tebing Breksi"
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

        <!-- Heart Rating (1-5 Hearts) -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Rating Kebahagiaan</label>
          <div class="flex items-center gap-2">
            <button
              v-for="r in 5"
              :key="r"
              type="button"
              @click="form.rating = r"
              class="text-2xl transition-transform hover:scale-125 active:scale-95"
            >
              <span :class="r <= form.rating ? 'text-rose-500' : 'text-slate-300'">❤️</span>
            </button>
            <span class="text-xs font-bold text-rose-500 ml-2">{{ form.rating }} / 5 Hearts</span>
          </div>
        </div>

        <!-- Photo URL & Preview -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Foto Kenangan</label>
          <input
            v-model="form.photoUrl"
            type="text"
            placeholder="Link foto atau pilih preset di bawah"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium mb-2"
          />
          <!-- Presets -->
          <div class="flex gap-2">
            <button
              v-for="(img, idx) in presetPhotos"
              :key="idx"
              type="button"
              @click="form.photoUrl = img"
              class="w-12 h-12 rounded-xl overflow-hidden border-2 transition-all"
              :class="form.photoUrl === img ? 'border-rose-500 scale-105' : 'border-transparent opacity-70'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Mas Impression -->
        <div>
          <label class="block text-xs font-bold text-sky-700 mb-1">Kesan 1 Kalimat dari {{ store.partners.mas.callsign }} 💙</label>
          <input
            v-model="form.masImpression"
            type="text"
            :placeholder="`Apa momen paling berkesan buat ${store.partners.mas.callsign}?`"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Adek Impression -->
        <div>
          <label class="block text-xs font-bold text-rose-600 mb-1">Kesan 1 Kalimat dari {{ store.partners.adek.callsign }} 💖</label>
          <input
            v-model="form.adekImpression"
            type="text"
            :placeholder="`Apa momen paling bikin ${store.partners.adek.callsign} bahagia?`"
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
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn mt-2 flex items-center justify-center gap-1.5"
        >
          <span>🛂</span>
          <span>Cap Paspor Kenangan Kita</span>
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

const presetPhotos = [
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80'
]

const tagInput = ref('Quality Time, Date Night')

const form = reactive({
  title: '',
  date: 'Hari ini',
  location: 'Bandung / Jakarta',
  rating: 5,
  photoUrl: presetPhotos[0],
  masImpression: '',
  adekImpression: ''
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
    location: form.location.trim(),
    rating: form.rating,
    photoUrl: form.photoUrl || presetPhotos[0],
    masImpression: form.masImpression.trim() || 'Momen yang sangat berharga bareng kamu.',
    adekImpression: form.adekImpression.trim() || 'Bahagia banget bisa ngelewatin hari ini bareng Mas.',
    tags: tags.length ? tags : ['Romantic Date']
  })

  // Reset
  form.title = ''
  form.masImpression = ''
  form.adekImpression = ''
  emit('close')
}
</script>
