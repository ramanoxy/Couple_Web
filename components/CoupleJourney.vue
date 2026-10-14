<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between px-1">
      <div>
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Perjalanan Cerita</span>
        </h3>
        <p class="text-[11px] text-slate-400 font-medium">
          Langkah demi langkah kisah perjalanan kita berdua
        </p>
      </div>

      <button
        @click="isAddModalOpen = true"
        class="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100 flex items-center gap-1.5 soft-tactile-btn"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Catat Langkah</span>
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-if="store.journeyMilestones.length === 0"
      class="glass-card rounded-[32px] p-8 text-center flex flex-col items-center justify-center border-2 border-dashed border-rose-200/80 my-2"
    >
      <div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3 shadow-inner">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <h4 class="text-sm sm:text-base font-extrabold text-slate-800 mb-1">
        Belum Ada Langkah Perjalanan
      </h4>
      <p class="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
        Mulailah mencatat momen penting, babak cerita, dan kenangan berharga perjalanan cinta kalian di sini.
      </p>
      <button
        @click="isAddModalOpen = true"
        class="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-sky-500 text-white text-xs font-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Catat Langkah Pertama</span>
      </button>
    </div>

    <!-- Timeline of Journey Milestones -->
    <div v-else class="space-y-4 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-rose-300 before:via-sky-300 before:to-transparent">
      <div
        v-for="item in store.journeyMilestones"
        :key="item.id"
        class="relative pl-9 sm:pl-11 group"
      >
        <!-- Timeline Marker Dot -->
        <div class="absolute left-2.5 sm:left-3.5 top-5 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-3 border-rose-500 shadow-sm flex items-center justify-center" />

        <!-- Card Container -->
        <div class="glass-card rounded-[28px] p-4 sm:p-5 border border-white/80 shadow-liquid hover:shadow-xl transition-all">
          <!-- Top Row: Chapter, Date & Delete -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                :class="getChapterBadgeClass(item.chapter)"
              >
                {{ item.chapter }}
              </span>
              <span class="text-[11px] font-semibold text-slate-400">
                {{ item.date }}
              </span>
            </div>

            <button
              @click="store.deleteJourneyMilestone(item.id)"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
              title="Hapus catatan"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Title -->
          <h4 class="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight mb-2">
            {{ item.title }}
          </h4>

          <!-- Story Text -->
          <p class="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-3 whitespace-pre-line">
            {{ item.story }}
          </p>

          <!-- Optional Photo -->
          <div v-if="item.photoUrl" class="w-full h-44 rounded-2xl overflow-hidden mb-3 bg-slate-100">
            <img :src="item.photoUrl" :alt="item.title" class="w-full h-full object-cover" />
          </div>

          <!-- Bottom Row: Feeling & Author Tag -->
          <div class="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
            <span v-if="item.feeling" class="italic text-slate-600">
              "{{ item.feeling }}"
            </span>
            <span class="ml-auto text-slate-400 font-medium">
              Ditulis oleh <strong class="text-slate-700">{{ item.addedBy === 'men' ? store.partners.men.callsign : store.partners.women.callsign }}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Milestone Modal -->
    <AddJourneyModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCoupleStore, type JourneyMilestone } from '~/composables/useCoupleStore'
import AddJourneyModal from '~/components/AddJourneyModal.vue'

const store = useCoupleStore()
const isAddModalOpen = ref(false)

function getChapterBadgeClass(chapter: JourneyMilestone['chapter']) {
  switch (chapter) {
    case 'Awal Cerita':
      return 'bg-sky-50 text-sky-700 border border-sky-200/60'
    case 'Kencan Pertama':
      return 'bg-rose-50 text-rose-700 border border-rose-200/60'
    case 'Momen Manis':
      return 'bg-pink-50 text-pink-700 border border-pink-200/60'
    case 'Langkah Baru':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
    case 'Rencana Masa Depan':
      return 'bg-amber-50 text-amber-700 border border-amber-200/60'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}
</script>
