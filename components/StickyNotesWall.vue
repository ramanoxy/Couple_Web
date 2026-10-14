<template>
  <div class="space-y-3.5">
    <!-- Header with Add Note Button -->
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-1.5">
        <span class="text-sm">📌</span>
        <h2 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Dinding Pesan Cinta
        </h2>
      </div>

      <!-- Add Note Button -->
      <button
        @click="isAddModalOpen = true"
        class="px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-soft to-pink-400 text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn flex items-center gap-1.5"
      >
        <span>+</span>
        <span>Tulis Catatan</span>
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

    <!-- Notes Grid / Masonry -->
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
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors"
              :class="note.isPinned ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'"
              title="Pin catatan ini"
            >
              📌
            </button>

            <!-- Delete Button -->
            <button
              @click="store.deleteNote(note.id)"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 text-xs transition-colors"
              title="Hapus catatan"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Note Text Body (Handwritten Feel) -->
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
            class="flex items-center gap-1 px-2.5 py-0.5 rounded-full transition-all text-xs"
            :class="[
              note.likes && note.likes[store.activePartnerId]
                ? 'bg-rose-500 text-white shadow-xs scale-105'
                : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/50'
            ]"
          >
            <span>❤️</span>
            <span class="font-bold text-[11px]">{{ getLikeCount(note) }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredNotes.length === 0"
      class="text-center py-8 glass-card rounded-3xl"
    >
      <span class="text-3xl block mb-2">💌</span>
      <p class="text-xs font-bold text-slate-600">Belum ada catatan di kategori ini.</p>
      <p class="text-[11px] text-slate-400">Jadilah yang pertama menulis pesan manis!</p>
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
  // Sort pinned notes first
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
