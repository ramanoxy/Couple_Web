<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between px-1">
      <div>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <span>🛂</span>
          <span>Quality Time Passport</span>
        </h3>
        <p class="text-[11px] text-slate-400 font-medium">
          Cap paspor kencan & galeri kenangan cinta kita
        </p>
      </div>

      <!-- Check-in Button -->
      <button
        @click="isCheckInOpen = true"
        class="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn flex items-center gap-1.5"
      >
        <span>+</span>
        <span>Check-in Kencan</span>
      </button>
    </div>

    <!-- Empty State if no memories -->
    <div
      v-if="store.memories.length === 0"
      class="glass-card rounded-[32px] p-8 text-center flex flex-col items-center justify-center border-2 border-dashed border-rose-200/80 my-2"
    >
      <div class="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-4xl mb-3 shadow-inner">
        🛂
      </div>
      <h4 class="text-base font-extrabold text-slate-800 mb-1">
        Paspor Cinta Masih Kosong
      </h4>
      <p class="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
        Belum ada momen kencan yang dicatat. Abadikan momen kencan pertama kalian lengkap dengan foto, rating bintang, dan kesan manis berdua!
      </p>
      <button
        @click="isCheckInOpen = true"
        class="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn"
      >
        + Check-in Kencan Pertama
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

          <!-- Location Badge (Passport Stamp look) -->
          <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/90 text-slate-800 text-[10px] font-bold shadow-sm flex items-center gap-1">
            <span>📍</span>
            <span>{{ mem.location }}</span>
          </div>

          <!-- Star/Heart Rating -->
          <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/90 text-[10px] font-black text-rose-600 shadow-sm flex items-center gap-0.5">
            <span v-for="h in mem.rating" :key="h">❤️</span>
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

        <!-- Impressions & Passport Body -->
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
            <!-- Mas's Impression -->
            <div class="p-2.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-2">
              <span class="text-xs mt-0.5">💙</span>
              <div class="flex-1">
                <span class="text-[10px] font-black uppercase text-sky-700 block">
                  Kesan {{ store.partners.mas.callsign }}
                </span>
                <p class="text-[11px] text-slate-700 font-medium leading-relaxed italic">
                  "{{ mem.masImpression }}"
                </p>
              </div>
            </div>

            <!-- Adek's Impression -->
            <div class="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-2">
              <span class="text-xs mt-0.5">💖</span>
              <div class="flex-1">
                <span class="text-[10px] font-black uppercase text-rose-700 block">
                  Kesan {{ store.partners.adek.callsign }}
                </span>
                <p class="text-[11px] text-slate-700 font-medium leading-relaxed italic">
                  "{{ mem.adekImpression }}"
                </p>
              </div>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Dicap di Paspor Cinta #{{ mem.id.replace('mem-', '') }}</span>
            <div class="flex items-center gap-2">
              <button
                @click.stop="store.deleteMemory(mem.id)"
                class="text-slate-300 hover:text-red-500 transition-colors"
                title="Hapus kencan"
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
