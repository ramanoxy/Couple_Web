<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="relative w-full max-w-sm rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white p-6 shadow-2xl flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">
            🎟️
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-800">
              Buat Tiket Kencan Baru
            </h3>
            <p class="text-[11px] text-slate-400">
              Dimasukkan oleh: <strong :class="store.activePartnerId === 'mas' ? 'text-sky-600' : 'text-rose-600'">{{ store.activePartner.callsign }}</strong>
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
          <label class="block text-xs font-bold text-slate-700 mb-1">Ide Kencan / Kegiatan</label>
          <input
            v-model="form.title"
            required
            type="text"
            placeholder="Contoh: Glamping semalam di Lembang atau Nonton Sunset"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Kategori</label>
          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="cat in ['Santai di Rumah', 'Kulineran', 'Outdoor/Jalan'] as const"
              :key="cat"
              type="button"
              @click="form.category = cat"
              class="py-1.5 px-1.5 rounded-xl text-[11px] font-bold border text-center transition-all"
              :class="form.category === cat ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-xs' : 'border-slate-200 text-slate-500 bg-white'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Cost & Duration Row -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Perkiraan Biaya</label>
            <select
              v-model="form.estimatedCost"
              class="w-full px-2.5 py-2 rounded-xl glass-input text-xs text-slate-700 font-medium"
            >
              <option value="Hemat (< 50k)">Hemat (&lt; 50k)</option>
              <option value="Sedang (50k - 200k)">Sedang (50k - 200k)</option>
              <option value="Spesial (> 200k)">Spesial (&gt; 200k)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Durasi</label>
            <select
              v-model="form.duration"
              class="w-full px-2.5 py-2 rounded-xl glass-input text-xs text-slate-700 font-medium"
            >
              <option value="1-2 Jam">1-2 Jam</option>
              <option value="Setengah Hari">Setengah Hari</option>
              <option value="Seharian">Seharian</option>
            </select>
          </div>
        </div>

        <!-- Romantic Note / Detail -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan / Detail Manis</label>
          <textarea
            v-model="form.note"
            rows="2"
            placeholder="Hal seru apa yang bakal kita lakuin di sana?"
            class="w-full px-3.5 py-2 rounded-2xl glass-input text-xs text-slate-800 font-medium leading-relaxed resize-none"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-soft to-pink-400 text-white text-xs font-bold shadow-md soft-tactile-btn mt-2 flex items-center justify-center gap-1.5"
        >
          <span>🎟️</span>
          <span>Masukkan Tiket ke Toples Cinta</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCoupleStore, type DateIdea } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()
const audio = useAudioEngine()

const form = reactive({
  title: '',
  category: 'Outdoor/Jalan' as DateIdea['category'],
  estimatedCost: 'Sedang (50k - 200k)' as DateIdea['estimatedCost'],
  duration: 'Setengah Hari' as DateIdea['duration'],
  note: ''
})

function handleSubmit() {
  if (!form.title.trim()) return

  audio.playKeyClick(500)
  store.addDateIdea({
    title: form.title.trim(),
    category: form.category,
    estimatedCost: form.estimatedCost,
    duration: form.duration,
    note: form.note.trim()
  })

  // Reset
  form.title = ''
  form.note = ''
  emit('close')
}
</script>
