<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="relative w-full max-w-sm rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white p-6 shadow-2xl flex flex-col"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-sm">
            📝
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-800">
              Tulis Sticky Note Cinta
            </h3>
            <p class="text-[11px] text-slate-400">
              Dari: <strong :class="store.activePartnerId === 'mas' ? 'text-sky-600' : 'text-rose-600'">{{ store.activePartner.callsign }}</strong>
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
        <!-- Note Content -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Isi Pesan Manis</label>
          <textarea
            v-model="content"
            required
            rows="4"
            placeholder="Tulis pesan penyemangat, gombalan, pengingat, atau rahasia kecilmu untuk pasangan..."
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium leading-relaxed resize-none font-handwriting text-base"
          />
        </div>

        <!-- Tag Selector -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Kategori Catatan</label>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="t in tags"
              :key="t"
              type="button"
              @click="selectedTag = t"
              class="px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all"
              :class="selectedTag === t ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-xs' : 'border-slate-200 text-slate-500 bg-white'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <!-- Pastel Color Theme -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Warna Kertas Pastel</label>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="c in colors"
              :key="c.id"
              type="button"
              @click="selectedColor = c.id"
              class="h-9 rounded-xl border flex items-center justify-center text-xs font-bold transition-all"
              :class="[
                c.bgClass,
                selectedColor === c.id ? 'ring-2 ring-slate-800 scale-105' : 'opacity-80 border-transparent'
              ]"
            >
              {{ c.name }}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn mt-2 flex items-center justify-center gap-1.5"
        >
          <span>📌</span>
          <span>Tempel di Dinding Kenangan</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCoupleStore, type StickyNote } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()
const audio = useAudioEngine()

const content = ref('')
const selectedTag = ref<StickyNote['tag']>('Sweet')
const selectedColor = ref<StickyNote['color']>(store.activePartnerId === 'mas' ? 'sky' : 'rose')

const tags: StickyNote['tag'][] = ['Sweet', 'Reminder', 'Secret', 'Gratitude', 'Funny']

const colors: { id: StickyNote['color']; name: string; bgClass: string }[] = [
  { id: 'rose', name: 'Rose', bgClass: 'bg-rose-100 text-rose-700 border-rose-300' },
  { id: 'sky', name: 'Sky', bgClass: 'bg-sky-100 text-sky-700 border-sky-300' },
  { id: 'amber', name: 'Honey', bgClass: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'lavender', name: 'Lilac', bgClass: 'bg-purple-100 text-purple-700 border-purple-300' }
]

function handleSubmit() {
  if (!content.value.trim()) return

  audio.playKeyClick(520)
  store.addStickyNote(content.value.trim(), selectedTag.value, selectedColor.value)
  content.value = ''
  emit('close')
}
</script>
