<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="relative w-full max-w-md rounded-[32px] bg-white/95 backdrop-blur-2xl border border-white p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-slate-800">
              Pengaturan Profil
            </h3>
            <p class="text-[11px] text-slate-400">
              Kelola nama, tanggal jadian, dan kode rahasia
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSave" class="space-y-4">
        <!-- Partner A (Mas) -->
        <div class="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span class="text-xs font-black uppercase text-sky-800">Profil Partner A</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Lengkap</label>
              <input
                v-model="partnerA.name"
                type="text"
                placeholder="Nama Lengkap"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Panggilan</label>
              <input
                v-model="partnerA.callsign"
                type="text"
                placeholder="Contoh: Mas"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Foto Avatar (URL)</label>
            <input
              v-model="partnerA.avatar"
              type="text"
              placeholder="https://..."
              class="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <!-- Partner B (Adek) -->
        <div class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span class="text-xs font-black uppercase text-rose-800">Profil Partner B</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Lengkap</label>
              <input
                v-model="partnerB.name"
                type="text"
                placeholder="Nama Lengkap"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Panggilan</label>
              <input
                v-model="partnerB.callsign"
                type="text"
                placeholder="Contoh: Adek"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Foto Avatar (URL)</label>
            <input
              v-model="partnerB.avatar"
              type="text"
              placeholder="https://..."
              class="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <!-- Anniversary & Secret PIN -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Tanggal Jadian</label>
            <input
              v-model="anniversary"
              type="text"
              placeholder="Contoh: 24 Agustus 2024"
              class="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">PIN Rahasia (4 Digit)</label>
            <input
              v-model="pin"
              maxlength="4"
              type="text"
              placeholder="2408"
              class="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold tracking-widest text-center"
            />
          </div>
        </div>

        <!-- Reset Button -->
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            @click="handleClearData"
            class="text-[11px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1.5"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Bersihkan Semua Data</span>
          </button>
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-sky-500 text-white text-xs font-bold shadow-md soft-tactile-btn flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Simpan Perubahan</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useCoupleStore } from '~/composables/useCoupleStore'
import { useAudioEngine } from '~/composables/useAudioEngine'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useCoupleStore()
const audio = useAudioEngine()

const partnerA = reactive({
  name: store.partners.mas.name,
  callsign: store.partners.mas.callsign,
  avatar: store.partners.mas.avatar
})

const partnerB = reactive({
  name: store.partners.adek.name,
  callsign: store.partners.adek.callsign,
  avatar: store.partners.adek.avatar
})

const anniversary = ref(store.anniversaryDate)
const pin = ref(store.secretPin)

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      partnerA.name = store.partners.mas.name
      partnerA.callsign = store.partners.mas.callsign
      partnerA.avatar = store.partners.mas.avatar
      partnerB.name = store.partners.adek.name
      partnerB.callsign = store.partners.adek.callsign
      partnerB.avatar = store.partners.adek.avatar
      anniversary.value = store.anniversaryDate
      pin.value = store.secretPin
    }
  }
)

function handleSave() {
  audio.playKeyClick(500)
  store.updateProfile('mas', partnerA.name, partnerA.callsign, partnerA.avatar)
  store.updateProfile('adek', partnerB.name, partnerB.callsign, partnerB.avatar)
  store.updateSettings(anniversary.value, pin.value)
  emit('close')
}

function handleClearData() {
  if (confirm('Yakin ingin menghapus semua catatan, lagu, perjalanan, dan kenangan kencan untuk memulai dari awal yang bersih?')) {
    audio.playKeyClick(300)
    store.clearAllData()
    emit('close')
  }
}
</script>
