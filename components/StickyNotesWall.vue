<template>
  <div class="space-y-3 mt-6">
    <!-- Header: Title + Minimalist Plus Button -->
    <div class="flex items-center justify-between px-1">
      <h2 class="font-serif text-2xl text-slate-800 font-normal tracking-tight">
        Little love notes
      </h2>

      <!-- Plus Button -->
      <button
        @click="isAddModalOpen = true"
        class="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 text-base active:scale-95 transition-all"
        title="Tulis catatan cinta"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- Notes Grid (2 Columns like Image 1) -->
    <div class="grid grid-cols-2 gap-3.5">
      <div
        v-for="note in displayNotes"
        :key="note.id"
        class="relative p-4 rounded-[24px] border flex flex-col justify-between min-h-[175px] shadow-xs transition-transform hover:scale-[1.01]"
        :class="getCardStyle(note)"
      >
        <!-- Top Icon -->
        <div class="flex items-center justify-between mb-2">
          <!-- Icon: Heart for Rose, Sun for Sky -->
          <div v-if="note.color === 'rose' || note.authorId === 'women'" class="text-[#8F6770]">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div v-else class="text-[#5E7A94]">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" stroke-width="2" />
              <path stroke-linecap="round" stroke-width="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
            </svg>
          </div>

          <!-- Subtle Delete Button on Hover -->
          <button
            @click.stop="store.deleteNote(note.id)"
            class="w-4 h-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Hapus"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Note Text (Editorial Serif Font) -->
        <p
          class="font-editorial text-base sm:text-lg leading-snug my-1 italic"
          :class="note.color === 'sky' || note.authorId === 'men' ? 'text-[#2C465E]' : 'text-[#54383E]'"
        >
          {{ note.content }}
        </p>

        <!-- Bottom Tag / Author + Time -->
        <div class="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
          <span
            class="text-[9px] tracking-wider uppercase font-bold"
            :class="note.color === 'sky' || note.authorId === 'men' ? 'text-[#5E7A94]' : 'text-[#8F6770]'"
          >
            {{ getAuthorLabel(note) }} • {{ note.createdAt || '10:24' }}
          </span>

          <!-- Like Heart Indicator -->
          <button
            @click.stop="handleLike(note.id)"
            class="text-xs transition-transform active:scale-125"
            :class="isLikedByMe(note) ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'"
            title="Suka"
          >
            ♥
          </button>
        </div>
      </div>
    </div>

    <!-- Poetic Caption Underneath Notes -->
    <p class="text-[11px] text-slate-400 text-center font-medium mt-3">
      Hal kecil yang bikin hari terasa lebih hangat.
    </p>

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

const displayNotes = computed(() => {
  return store.stickyNotes.slice(0, 4)
})

function getCardStyle(note: StickyNote) {
  if (note.color === 'sky' || note.authorId === 'men') {
    return 'bg-[#E2F0FD] border-sky-200/50'
  }
  return 'bg-[#FCE8EB] border-rose-200/50'
}

function getAuthorLabel(note: StickyNote) {
  if (note.authorId === 'men') {
    return store.partners.men.callsign.toUpperCase()
  }
  return store.partners.women.callsign.toUpperCase()
}

function isLikedByMe(note: StickyNote) {
  if (!note.likes) return false
  return Boolean(note.likes[store.activePartnerId])
}

function handleLike(noteId: string) {
  audio.playKeyClick(600)
  store.toggleLikeNote(noteId)
}
</script>
