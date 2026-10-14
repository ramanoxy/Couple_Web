<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between px-1">
      <div>
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Paspor Kencan</span>
        </h3>
        <p class="text-[11px] text-slate-400 font-medium">
          Galeri momen kencan dan catatan kenangan kita
        </p>
      </div>

      <!-- Check-in Button -->
      <button
        @click="isCheckInOpen = true"
        class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-sky-500 text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
        </svg>
        <span>Check-in Kencan</span>
      </button>
    </div>

    <!-- Empty State if no memories -->
    <div
      v-if="store.memories.length === 0"
      class="glass-card rounded-[32px] p-8 text-center flex flex-col items-center justify-center border-2 border-dashed border-rose-200/80 my-2"
    >
      <div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3 shadow-inner">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h4 class="text-sm sm:text-base font-extrabold text-slate-800 mb-1">
        Paspor Masih Kosong
      </h4>
      <p class="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
        Belum ada momen kencan yang dicatat. Abadikan momen kencan pertama kalian lengkap dengan foto, rating, dan kesan masing-masing.
      </p>
      <button
        @click="isCheckInOpen = true"
        class="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-sky-500 text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Check-in Kencan Pertama</span>
      </button>
    </div>

    <!-- Apple-style Bento Grid Gallery if memories exist -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      <div
        v-for="(mem, idx) in store.memories"
        :key="mem.id"
        @click="toggleExpand(mem.id)"
        class="glass-card rounded-[32px] overflow-hidden border border-white/80 shadow-liquid transition-all duration-300 hover:scale-[1.01] cursor-pointer"
        :class="[
          expandedId === mem.id ? 'ring-2 ring-rose-400/80 shadow-2xl' : '',
          idx === 0 ? 'sm:col-span-2' : ''
        ]"
      >
        <!-- Memory Image Header -->
        <div class="relative w-full h-44 overflow-hidden bg-slate-100">
          <img
            :src="mem.photoUrl"
            :alt="mem.title"
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          <!-- Location Badge -->
          <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white text-slate-800 text-[10px] font-bold shadow-sm flex items-center gap-1">
            <svg class="w-3 h-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ mem.location }}</span>
          </div>

          <!-- Rating -->
          <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white text-[10px] font-black text-rose-600 shadow-sm flex items-center gap-0.5">
            <span v-for="h in mem.rating" :key="h" class="text-rose-500">
              <svg class="w-3 h-3 inline" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          </div>

          <!-- Bottom Title & Date on Image -->
          <div class="absolute bottom-3 inset-x-3 text-white">
            <p class="text-[10px] font-medium text-slate-200 uppercase tracking-wider">
              {{ mem.date }}
            </p>
            <h4 class="text-sm font-black tracking-tight leading-snug drop-shadow-sm">
              {{ mem.title }}
            </h4>
          </div>
        </div>

        <!-- Impressions & Details -->
        <div class="p-4 bg-white/70 backdrop-blur-md">
          <!-- Tags Row -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="tag in mem.tags"
              :key="tag"
              class="px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-600"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Dual Partner Impressions -->
          <div class="space-y-2 text-xs">
            <!-- Men's Impression -->
            <div class="p-2.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2">
              <span class="w-2 h-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0" />
              <div class="flex-1">
                <span class="text-[10px] font-black uppercase text-sky-700 block">
                  Kesan {{ store.partners.men.callsign }}
                </span>
                <p class="text-[11px] text-slate-700 font-medium leading-relaxed italic">
                  "{{ mem.menImpression }}"
                </p>
              </div>
            </div>

            <!-- Women's Impression -->
            <div class="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-2">
              <span class="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
              <div class="flex-1">
                <span class="text-[10px] font-black uppercase text-rose-700 block">
                  Kesan {{ store.partners.women.callsign }}
                </span>
                <p class="text-[11px] text-slate-700 font-medium leading-relaxed italic">
                  "{{ mem.womenImpression }}"
                </p>
              </div>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Dicatat oleh {{ mem.addedBy === 'men' ? store.partners.men.callsign : store.partners.women.callsign }}</span>
            <div class="flex items-center gap-2">
              <button
                @click.stop="store.deleteMemory(mem.id)"
                class="text-slate-300 hover:text-red-500 transition-colors"
                title="Hapus kenangan"
              >
                Hapus
              </button>
              <span class="text-rose-500 font-bold">
                {{ expandedId === mem.id ? 'Tutup' : 'Detail' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Check-in Modal -->
    <AddCheckInModal
      :isOpen="isCheckInOpen"
      @close="isCheckInOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import AddCheckInModal from '~/components/AddCheckInModal.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

const isCheckInOpen = ref(false)
const expandedId = ref<string | null>(null)

function toggleExpand(id: string) {
  audio.playKeyClick(420)
  expandedId.value = expandedId.value === id ? null : id
}
</script>
