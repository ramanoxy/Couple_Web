<template>
  <div class="space-y-3.5">
    <!-- Header with Add Note Button -->
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <h2 class="text-xs font-extrabold uppercase tracking-wider text-slate-600">
          Dinding Pesan
        </h2>
      </div>

      <!-- Add Note Button -->
      <button
        @click="isAddModalOpen = true"
        class="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-soft to-pink-400 text-white text-xs font-bold shadow-sm soft-tactile-btn flex items-center gap-1.5"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tulis Pesan</span>
      </button>
    </div>

    <!-- Category Filter Pills -->
    <div class="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
      <button
        v-for="cat in ['Semua', 'Sweet', 'Reminder', 'Secret', 'Gratitude', 'Funny']"
        :key="cat"
        @click="selectedCategory = cat"
        class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap"
        :class="[
          selectedCategory === cat
            ? 'bg-slate-800 text-white shadow-xs'
            : 'bg-white/60 text-slate-500 border border-slate-200/60 hover:bg-white'
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Notes Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="relative p-4 rounded-3xl border transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between shadow-sm"
        :class="[
          getNoteColorClass(note.color),
          note.isPinned ? 'ring-2 ring-rose-300/80 shadow-md' : ''
        ]"
      >
        <!-- Top Row: Tag, Author & Pin -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-1.5">
            <span
              class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full"
              :class="getTagBadgeClass(note.tag)"
            >
              {{ note.tag }}
            </span>
            <span class="text-[10px] text-slate-500 font-medium">
              oleh <strong>{{ note.authorId === 'mas' ? store.partners.mas.callsign : store.partners.adek.callsign }}</strong>
            </span>
          </div>

          <div class="flex items-center gap-1">
            <!-- Pin Button -->
            <button
              @click="store.togglePinNote(note.id)"
              class="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
              :class="note.isPinned ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'"
              title="Sematkan catatan ini"
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4v4l2 2v2h-5v8l-1 1-1-1v-8H6v-2l2-2V4a1 1 0 011-1h6a1 1 0 011 1z" />
              </svg>
            </button>

            <!-- Delete Button -->
            <button
              @click="store.deleteNote(note.id)"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
              title="Hapus catatan"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Note Text Body -->
        <p class="text-sm text-slate-800 font-medium leading-relaxed font-handwriting text-lg my-1.5">
          {{ note.content }}
        </p>

        <!-- Footer: Timestamp & Reaction -->
        <div class="pt-2 border-t border-black/5 flex items-center justify-between mt-2">
          <span class="text-[10px] text-slate-400 font-medium">
            {{ note.createdAt }}
          </span>

          <!-- Love Reaction Button -->
          <button
            @click="handleLike(note.id)"
            class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full transition-all text-xs"
            :class="[
              note.likes && note.likes[store.activePartnerId]
                ? 'bg-rose-500 text-white shadow-xs scale-105'
                : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/50'
            ]"
          >
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span class="font-bold text-[11px]">{{ getLikeCount(note) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredNotes.length === 0"
      class="text-center py-8 glass-card rounded-3xl flex flex-col items-center justify-center border border-white/80"
    >
      <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <p class="text-xs font-bold text-slate-600">Belum ada catatan di dinding.</p>
      <p class="text-[11px] text-slate-400">Tulis pesan manis pertama untuk pasanganmu.</p>
    </div>

    <!-- Add Note Modal -->
    <AddNoteModal
      :isOpen="isAddModalOpen"
      @close="isAddModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCoupleStore, type StickyNote } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'
import AddNoteModal from '~/components/AddNoteModal.vue'

const store = useCoupleStore()
const audio = useAudioEngine()

const isAddModalOpen = ref(false)
const selectedCategory = ref('Semua')

const filteredNotes = computed(() => {
  let list = store.stickyNotes
  if (selectedCategory.value !== 'Semua') {
    list = list.filter(n => n.tag === selectedCategory.value)
  }
  return [...list].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
})

function getLikeCount(note: StickyNote): number {
  if (!note.likes) return 0
  let count = 0
  if (note.likes.mas) count++
  if (note.likes.adek) count++
  return count
}

function handleLike(noteId: string) {
  audio.playKeyClick(600)
  store.toggleLikeNote(noteId)
}

function getNoteColorClass(color: StickyNote['color']) {
  switch (color) {
    case 'rose':
      return 'bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] border-rose-200/80'
    case 'sky':
      return 'bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] border-sky-200/80'
    case 'amber':
      return 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border-amber-200/80'
    case 'lavender':
      return 'bg-gradient-to-br from-[#FAF5FF] to-[#F3E8FF] border-purple-200/80'
    default:
      return 'bg-white/80 border-slate-200'
  }
}

function getTagBadgeClass(tag: StickyNote['tag']) {
  switch (tag) {
    case 'Sweet':
      return 'bg-rose-200/80 text-rose-800'
    case 'Reminder':
      return 'bg-sky-200/80 text-sky-800'
    case 'Secret':
      return 'bg-purple-200/80 text-purple-800'
    case 'Gratitude':
      return 'bg-emerald-200/80 text-emerald-800'
    case 'Funny':
      return 'bg-amber-200/80 text-amber-800'
    default:
      return 'bg-slate-200 text-slate-800'
  }
}
</script>
