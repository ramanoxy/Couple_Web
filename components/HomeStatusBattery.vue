<template>
  <div class="space-y-4">
    <!-- Section Title -->
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-1.5">
        <span class="text-sm">⚡</span>
        <h2 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Status & Mood Kita Hari Ini
        </h2>
      </div>
      <span class="text-[10px] text-slate-400 font-medium">
        Sinkron real-time
      </span>
    </div>

    <!-- Dual Partner Status Cards (Mas & Adek) -->
    <div class="grid grid-cols-1 gap-3.5">
      <!-- Card for Partner: Loop over both partners -->
      <div
        v-for="p in [store.partners.mas, store.partners.adek]"
        :key="p.id"
        class="glass-card p-4 rounded-3xl relative overflow-hidden transition-all duration-300"
        :class="[
          p.id === store.activePartnerId
            ? 'ring-2 ring-white/90 shadow-liquid'
            : 'opacity-90'
        ]"
      >
        <!-- Background Tint -->
        <div
          class="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40"
          :class="p.id === 'mas' ? 'bg-sky-serene' : 'bg-rose-soft'"
        />

        <!-- Top Row: Avatar, Callsign, Role & Live Indicator -->
        <div class="flex items-center justify-between mb-3 relative z-10">
          <div class="flex items-center gap-2.5">
            <div
              class="w-10 h-10 rounded-2xl overflow-hidden p-0.5 border"
              :class="p.id === 'mas' ? 'border-sky-300 bg-sky-100' : 'border-rose-300 bg-rose-100'"
            >
              <img :src="p.avatar" :alt="p.callsign" class="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-sm font-black text-slate-800 leading-tight">
                  {{ p.callsign }}
                </h3>
                <span
                  v-if="p.id === store.activePartnerId"
                  class="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase"
                  :class="p.id === 'mas' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'"
                >
                  Kamu
                </span>
              </div>
              <p class="text-[10px] text-slate-400">
                Diperbarui {{ p.lastUpdated }}
              </p>
            </div>
          </div>

          <!-- Battery Gauge Badge -->
          <div
            class="px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border"
            :class="getBatteryBadgeClass(p.battery, p.id)"
          >
            <span>{{ getBatteryIcon(p.battery) }}</span>
            <span>{{ p.battery }}%</span>
          </div>
        </div>

        <!-- Battery Energy Bar (Slider for Active Partner, Static display for other) -->
        <div class="mb-3.5 relative z-10">
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
            <span>Energy / Social Battery</span>
            <span class="text-[10px] text-slate-400 font-normal">
              {{ p.id === store.activePartnerId ? 'Geser untuk update' : 'Level baterai pasangan' }}
            </span>
          </div>

          <!-- Interactive Slider if Active Partner, Progress bar if Other -->
          <div v-if="p.id === store.activePartnerId" class="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              v-model.number="myBattery"
              @input="handleBatteryChange"
              class="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-slate-200/80"
              :class="p.id === 'mas' ? 'accent-sky-500' : 'accent-rose-500'"
            />
          </div>

          <div v-else class="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="p.id === 'mas' ? 'bg-gradient-to-r from-sky-400 to-sky-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'"
              :style="{ width: `${p.battery}%` }"
            />
          </div>
        </div>

        <!-- Mood & Craving Info -->
        <div class="space-y-2 relative z-10">
          <!-- Mood Row -->
          <div class="p-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex items-start gap-2">
            <span class="text-sm mt-0.5">💭</span>
            <div class="flex-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mood Sekarang
              </span>
              <p class="text-xs font-semibold text-slate-700">
                {{ p.mood }}
              </p>
            </div>
          </div>

          <!-- Craving Row -->
          <div class="p-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex items-start gap-2">
            <span class="text-sm mt-0.5">🍩</span>
            <div class="flex-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lagi Pengen / Craving
              </span>
              <p class="text-xs font-semibold text-slate-700">
                {{ p.craving }}
              </p>
            </div>
          </div>
        </div>

        <!-- Interactive Quick Mood Updater for Active Partner -->
        <div v-if="p.id === store.activePartnerId" class="mt-3 pt-3 border-t border-slate-100 relative z-10">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold text-slate-500 uppercase">
              Update Mood Cepat:
            </span>
            <button
              @click="showCustomMoodPrompt = !showCustomMoodPrompt"
              class="text-[11px] font-semibold text-rose-500 hover:underline"
            >
              {{ showCustomMoodPrompt ? 'Tutup' : '+ Tulis Custom' }}
            </button>
          </div>

          <!-- Preset Craving Pills -->
          <div class="flex flex-wrap gap-1.5 mb-2">
            <button
              v-for="(tag, idx) in presetMoods"
              :key="idx"
              @click="applyPresetMood(tag.mood, tag.craving)"
              class="px-2.5 py-1 rounded-xl bg-white/80 border border-slate-200/80 text-[11px] font-medium text-slate-600 hover:border-rose-300 hover:text-rose-600 transition-all active:scale-95 shadow-xs"
            >
              {{ tag.emoji }} {{ tag.label }}
            </button>
          </div>

          <!-- Custom Text Inputs if expanded -->
          <div v-if="showCustomMoodPrompt" class="p-3 rounded-2xl bg-white/80 border border-white space-y-2 mt-2">
            <input
              v-model="customMood"
              type="text"
              placeholder="Apa yang lagi kamu rasain? (Contoh: Butuh ditemenin ngobrol)"
              class="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
            />
            <input
              v-model="customCraving"
              type="text"
              placeholder="Lagi pengen makan/ngapain? (Contoh: Pengen es krim gelato)"
              class="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
            />
            <button
              @click="saveCustomStatus"
              class="w-full py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-all"
            >
              Simpan Mood Saya
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const store = useCoupleStore()
const audio = useAudioEngine()

const myBattery = ref(store.activePartner.battery)
const showCustomMoodPrompt = ref(false)
const customMood = ref('')
const customCraving = ref('')

watch(
  () => store.activePartnerId,
  () => {
    myBattery.value = store.activePartner.battery
  }
)

const presetMoods = [
  { emoji: '🤗', label: 'Butuh Dipeluk', mood: 'Butuh dipeluk erat & disayang 💕', craving: 'Pelukan hangat 10 menit' },
  { emoji: '🍦', label: 'Pengen Es Krim', mood: 'Sedikit lelah tapi bahagia', craving: 'Es krim coklat/gelato manis' },
  { emoji: '☕', label: 'Ngopi Berdua', mood: 'Santai & butuh obrolan deep talk', craving: 'Kopi susu & pastry hangat' },
  { emoji: '🔋', label: 'Low Battery', mood: 'Energi habis butuh istirahat', craving: 'Tidur pulas diusap kepalanya' },
  { emoji: '🥰', label: 'Bucin Maksimal', mood: 'Kangen parah sama kamu!', craving: 'Video call / ketemu sekarang' }
]

function getBatteryBadgeClass(battery: number, id: string) {
  if (battery > 70) {
    return id === 'mas' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-rose-50 text-rose-700 border-rose-200'
  }
  if (battery > 35) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-red-50 text-red-600 border-red-200 animate-pulse'
}

function getBatteryIcon(battery: number) {
  if (battery > 75) return '🔋'
  if (battery > 40) return '🪫'
  return '⚠️'
}

function handleBatteryChange() {
  audio.playKeyClick(300 + myBattery.value * 2)
  store.updateMyStatus(myBattery.value, store.activePartner.mood, store.activePartner.craving)
}

function applyPresetMood(mood: string, craving: string) {
  audio.playKeyClick(480)
  store.updateMyStatus(myBattery.value, mood, craving)
}

function saveCustomStatus() {
  if (!customMood.value && !customCraving.value) return
  audio.playKeyClick(500)
  store.updateMyStatus(
    myBattery.value,
    customMood.value || store.activePartner.mood,
    customCraving.value || store.activePartner.craving
  )
  showCustomMoodPrompt.value = false
  customMood.value = ''
  customCraving.value = ''
}
</script>
