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
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">
            ⚙️
          </div>
          <div>
            <h3 class="text-base font-extrabold text-slate-800">
              Pengaturan Profil & Ruang Kita
            </h3>
            <p class="text-[11px] text-slate-400">
              Sesuaikan identitas, tanggal jadian, dan kode rahasia
            </p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSave" class="space-y-4">
        <!-- Partner A (Mas / Sky) -->
        <div class="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black uppercase text-sky-700 flex items-center gap-1">
              <span>💙</span>
              <span>Profil Partner A (Mas)</span>
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Lengkap</label>
              <input
                v-model="partnerA.name"
                type="text"
                placeholder="Nama Lengkap Mas"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Panggilan Sayang</label>
              <input
                v-model="partnerA.callsign"
                type="text"
                placeholder="Contoh: Mas / Ayang"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Foto Avatar URL</label>
            <input
              v-model="partnerA.avatar"
              type="text"
              placeholder="https://..."
              class="w-full px-3 py-1.5 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        <!-- Partner B (Adek / Rose) -->
        <div class="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black uppercase text-rose-700 flex items-center gap-1">
              <span>💖</span>
              <span>Profil Partner B (Adek)</span>
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Nama Lengkap</label>
              <input
                v-model="partnerB.name"
                type="text"
                placeholder="Nama Lengkap Adek"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Panggilan Sayang</label>
              <input
                v-model="partnerB.callsign"
                type="text"
                placeholder="Contoh: Adek / Sayang"
                class="w-full px-3 py-1.5 rounded-xl glass-input text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-500 mb-0.5">Foto Avatar URL</label>
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
            class="text-[11px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
          >
            <span>🗑️</span>
            <span>Hapus / Bersihkan Semua Data</span>
          </button>
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          class="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-soft via-pink-400 to-sky-serene text-white text-xs font-bold shadow-liquid-rose soft-tactile-btn flex items-center justify-center gap-1.5"
        >
          <span>💾</span>
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
  if (confirm('Yakin ingin menghapus semua catatan, lagu, pertanyaan, dan tiket kencan untuk memulai dari awal yang bersih?')) {
    audio.playKeyClick(300)
    store.clearAllData()
    emit('close')
  }
}
</script>
