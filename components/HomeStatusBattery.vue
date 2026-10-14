<template>
  <div class="space-y-4">
    <!-- Section Title -->
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <h2 class="text-xs font-extrabold uppercase tracking-wider text-slate-600">
          Status & Energi Kita
        </h2>
      </div>
      <span class="text-[10px] text-slate-400 font-medium">
        Sinkron real-time
      </span>
    </div>

    <!-- Dual Partner Status Cards (Mas & Adek) -->
    <div class="grid grid-cols-1 gap-3.5">
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
                  Aktif
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
            <span class="w-2 h-2 rounded-full" :class="p.battery > 50 ? 'bg-emerald-500' : 'bg-amber-500'" />
            <span>{{ p.battery }}%</span>
          </div>
        </div>

        <!-- Battery Energy Bar -->
        <div class="mb-3.5 relative z-10">
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
            <span>Level Energi Sosial</span>
            <span class="text-[10px] text-slate-400 font-normal">
              {{ p.id === store.activePartnerId ? 'Geser untuk memperbarui' : 'Status pasangan' }}
            </span>
          </div>

          <div v-if="p.id === store.activePartnerId" class="relative flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              v-model.number="myBattery"
              @input="handleBatteryChange"
              class="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200/80"
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
          <div class="p-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex items-start gap-2.5">
            <div class="w-5 h-5 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Kondisi Hati
              </span>
              <p class="text-xs font-semibold text-slate-700">
                {{ p.mood }}
              </p>
            </div>
          </div>

          <!-- Craving Row -->
          <div class="p-2.5 rounded-2xl bg-white/70 border border-white/80 shadow-xs flex items-start gap-2.5">
            <div class="w-5 h-5 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Sedang Ingin
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
              Pilihan Cepat:
            </span>
            <button
              @click="showCustomMoodPrompt = !showCustomMoodPrompt"
              class="text-[11px] font-semibold text-rose-600 hover:underline"
            >
              {{ showCustomMoodPrompt ? 'Tutup' : '+ Tulis Sendiri' }}
            </button>
          </div>

          <!-- Clean Preset Chips without emojis -->
          <div class="flex flex-wrap gap-1.5 mb-2">
            <button
              v-for="(tag, idx) in presetMoods"
              :key="idx"
              @click="applyPresetMood(tag.mood, tag.craving)"
              class="px-2.5 py-1 rounded-xl bg-white/80 border border-slate-200/80 text-[11px] font-medium text-slate-600 hover:border-rose-300 hover:text-rose-600 transition-all active:scale-95 shadow-xs"
            >
              {{ tag.label }}
            </button>
          </div>

          <!-- Custom Text Inputs if expanded -->
          <div v-if="showCustomMoodPrompt" class="p-3 rounded-2xl bg-white/80 border border-white space-y-2 mt-2">
            <input
              v-model="customMood"
              type="text"
              placeholder="Apa yang sedang kamu rasakan saat ini?"
              class="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
            />
            <input
              v-model="customCraving"
              type="text"
              placeholder="Sedang ingin melakukan atau makan apa?"
              class="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
            />
            <button
              @click="saveCustomStatus"
              class="w-full py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-all"
            >
              Perbarui Status
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
  { label: 'Butuh Istirahat', mood: 'Energi habis, butuh tenang berdua', craving: 'Rebahan santai tanpa gangguan' },
  { label: 'Quality Time', mood: 'Kangen mengobrol lama', craving: 'Ngobrol santai & bercerita' },
  { label: 'Jalan Santai', mood: 'Segar dan ingin keluar', craving: 'Jalan sore atau kulineran' },
  { label: 'Butuh Didengarkan', mood: 'Banyak pikiran seharian', craving: 'Ditemani dan didengarkan' }
]

function getBatteryBadgeClass(battery: number, id: string) {
  if (battery > 70) {
    return id === 'mas' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-rose-50 text-rose-700 border-rose-200'
  }
  if (battery > 35) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-red-50 text-red-600 border-red-200'
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
