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
          <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">
            💬
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-800">
              Buat Pertanyaan Deep Talk
            </h3>
            <p class="text-[11px] text-slate-400">
              Oleh: <strong :class="store.activePartnerId === 'mas' ? 'text-sky-600' : 'text-rose-600'">{{ store.activePartner.callsign }}</strong>
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
        <!-- Category Selection -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Kategori Pertanyaan</label>
          <div class="grid grid-cols-3 gap-1.5">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              @click="selectedCategory = cat"
              class="py-1.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all"
              :class="selectedCategory === cat ? 'border-purple-400 bg-purple-50 text-purple-700 shadow-xs' : 'border-slate-200 text-slate-500 bg-white'"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Question Prompt -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Pertanyaan / Topik Ngobrol</label>
          <textarea
            v-model="questionText"
            required
            rows="3"
            placeholder="Contoh: Kapan kamu merasa paling bangga punya aku sebagai pasanganmu?"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium leading-relaxed resize-none"
          />
        </div>

        <!-- Spark Action Prompt -->
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Tantangan / Spark Prompt (Opsional)</label>
          <input
            v-model="sparkPrompt"
            type="text"
            placeholder="Contoh: Tatap mata selama 10 detik atau peluk dulu!"
            class="w-full px-3.5 py-2.5 rounded-2xl glass-input text-xs text-slate-800 font-medium"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-400 to-rose-soft text-white text-xs font-bold shadow-md soft-tactile-btn mt-2 flex items-center justify-center gap-1.5"
        >
          <span>✨</span>
          <span>Masukkan ke Kartu Deep Talk</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCoupleStore, type DeepTalkQuestion } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()
const audio = useAudioEngine()

const selectedCategory = ref<DeepTalkQuestion['category']>('Romance')
const questionText = ref('')
const sparkPrompt = ref('')

const categories: DeepTalkQuestion['category'][] = ['Romance', 'Memories', 'Vulnerability', 'Future', 'Fun']

function handleSubmit() {
  if (!questionText.value.trim()) return

  audio.playKeyClick(550)
  store.addDeepTalkQuestion(
    questionText.value.trim(),
    selectedCategory.value,
    sparkPrompt.value.trim()
  )

  questionText.value = ''
  sparkPrompt.value = ''
  emit('close')
}
</script>
