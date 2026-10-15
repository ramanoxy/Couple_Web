<template>
  <div class="relative w-full">
    <!-- Floating Virtual Hug Hearts Layer -->
    <transition-group
      enter-active-class="transition duration-1000 ease-out"
      enter-from-class="transform translate-y-8 opacity-0 scale-50"
      enter-to-class="transform -translate-y-12 opacity-100 scale-125"
      leave-active-class="transition duration-700 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-y-20 scale-150"
    >
      <div
        v-if="store.isHugFlying"
        key="hearts"
        class="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      >
        <div class="text-4xl animate-bounce">💖</div>
        <div class="text-3xl animate-pulse ml-6 -mt-8">✨</div>
        <div class="text-5xl animate-bounce -ml-4 -mt-12">🤍</div>
      </div>
    </transition-group>

    <!-- Virtual Hug Toast Notification -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-3 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="store.hugFeedback"
        class="fixed top-14 inset-x-4 max-w-xs mx-auto z-50 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-rose-200 text-rose-700 text-xs font-bold shadow-xl text-center flex items-center justify-center gap-2"
      >
        <span>{{ store.hugFeedback }}</span>
      </div>
    </transition>

    <!-- Main Card: "How's your heart today?" -->
    <div class="rounded-[28px] p-5 bg-white/90 backdrop-blur-md border border-white shadow-sanctuary">
      <!-- Card Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-xs text-slate-800 tracking-tight">
          How's your heart today?
        </h3>
        <button
          @click="isEditStatusOpen = !isEditStatusOpen"
          class="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          title="Ubah perasaan & mood kamu"
        >
          <!-- Sparkle / Starburst Icon -->
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </button>
      </div>

      <!-- Dual Partner Metrics (Alif & Sayang) -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Partner A: Alif -->
        <div class="space-y-1">
          <!-- Top Row: Icon + Name -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center text-xs flex-shrink-0">
              <!-- Sun / Radiant Icon -->
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4" stroke-width="2" />
                <path stroke-linecap="round" stroke-width="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
              </svg>
            </div>
            <span class="text-xs font-bold text-slate-800 truncate">
              {{ store.partners.men.callsign }}
            </span>
          </div>

          <!-- Big Percentage -->
          <div class="text-3xl font-extrabold text-slate-800 tracking-tight leading-none pt-1">
            {{ store.partners.men.battery }}%
          </div>

          <!-- Progress Bar (Sky Gradient) -->
          <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative mt-1.5">
            <div
              class="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#7DD3FC] transition-all duration-500"
              :style="{ width: `${store.partners.men.battery}%` }"
            />
          </div>

          <!-- Status / Feeling Text -->
          <p class="text-[11px] text-slate-500 font-medium truncate pt-0.5">
            {{ store.partners.men.mood || 'Pengen dipeluk' }}
          </p>
        </div>

        <!-- Partner B: Sayang -->
        <div class="space-y-1">
          <!-- Top Row: Icon + Name -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center text-xs flex-shrink-0">
              <!-- Heart Icon -->
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-slate-800 truncate">
              {{ store.partners.women.callsign }}
            </span>
          </div>

          <!-- Big Percentage -->
          <div class="text-3xl font-extrabold text-slate-800 tracking-tight leading-none pt-1">
            {{ store.partners.women.battery }}%
          </div>

          <!-- Progress Bar (Rose Gradient) -->
          <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative mt-1.5">
            <div
              class="h-full rounded-full bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] transition-all duration-500"
              :style="{ width: `${store.partners.women.battery}%` }"
            />
          </div>

          <!-- Status / Feeling Text -->
          <p class="text-[11px] text-slate-500 font-medium truncate pt-0.5">
            {{ store.partners.women.mood || 'Butuh recharge' }}
          </p>
        </div>
      </div>

      <!-- Craving Sub-Pill at Bottom -->
      <div class="rounded-2xl p-2.5 px-3.5 bg-[#FFF0F2]/80 border border-rose-100/70 flex items-center gap-2 mt-4">
        <!-- Cup / Bowl / Craving Icon -->
        <svg class="w-3.5 h-3.5 text-[#9E5466] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" />
        </svg>
        <p class="text-xs text-[#9E5466] font-medium italic truncate">
          {{ store.partners.women.craving || 'Sayang lagi ngidam mie pedes.' }}
        </p>
      </div>

      <!-- Inline Drawer to Edit Active Partner Mood / Battery -->
      <div
        v-if="isEditStatusOpen"
        class="mt-4 pt-4 border-t border-slate-100 space-y-3"
      >
        <div class="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Energi Hati Kamu ({{ store.activePartner.callsign }})</span>
          <span class="text-sky-600 font-extrabold">{{ tempBattery }}%</span>
        </div>

        <input
          v-model.number="tempBattery"
          type="range"
          min="10"
          max="100"
          step="5"
          class="w-full h-1.5 rounded-full bg-slate-200 accent-sky-500 cursor-pointer"
        />

        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1">Perasaan / Kebutuhan saat ini</label>
          <div class="flex flex-wrap gap-1.5 mb-2">
            <button
              v-for="preset in ['Pengen dipeluk', 'Butuh recharge', 'Kangen kamu', 'Lagi capek', 'Bahagia banget']"
              :key="preset"
              @click="tempMood = preset"
              type="button"
              class="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
              :class="tempMood === preset ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' : 'bg-white border-slate-200 text-slate-600'"
            >
              {{ preset }}
            </button>
          </div>
          <input
            v-model="tempMood"
            type="text"
            placeholder="Tulis perasaanmu..."
            class="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 mb-2"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1">Lagi ngidam atau pengen apa?</label>
          <input
            v-model="tempCraving"
            type="text"
            placeholder="Contoh: Sayang lagi ngidam mie pedes."
            class="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700"
          />
        </div>

        <div class="flex items-center justify-end gap-2 pt-1">
          <button
            @click="isEditStatusOpen = false"
            class="px-3 py-1.5 rounded-full text-xs text-slate-500 hover:text-slate-800"
          >
            Batal
          </button>
          <button
            @click="saveStatus"
            class="px-4 py-1.5 rounded-full bg-[#EBF5FE] text-[#0284C7] font-bold text-xs shadow-xs hover:bg-[#DEEFFF]"
          >
            Simpan Status
          </button>
        </div>
      </div>
    </div>

    <!-- Full-Width Action Button: "♡ Kirim peluk jauh" -->
    <button
      @click="handleSendHug"
      class="w-full py-3 px-4 rounded-full bg-[#FCECEE] border border-rose-200/60 text-[#9E5466] text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-[#F9DEE2] active:scale-98 transition-all mt-3.5"
    >
      <svg class="w-3.5 h-3.5 text-[#9E5466]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>Kirim peluk jauh</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const store = useCoupleStore()
const audio = useAudioEngine()

const isEditStatusOpen = ref(false)
const tempBattery = ref(store.activePartner.battery)
const tempMood = ref(store.activePartner.mood)
const tempCraving = ref(store.activePartner.craving)

function handleSendHug() {
  try {
    audio.playSuccessChime?.()
  } catch (e) {}
  store.sendVirtualHug()
}

function saveStatus() {
  audio.playKeyClick(550)
  store.updateMyStatus(tempBattery.value, tempMood.value, tempCraving.value)
  isEditStatusOpen.value = false
}
</script>
