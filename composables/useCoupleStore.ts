import { defineStore } from 'pinia'

export type PartnerId = 'men' | 'women'

export interface Partner {
  id: PartnerId
  name: string
  callsign: string
  role: string
  avatar: string
  accent: 'sky' | 'rose'
  battery: number
  mood: string
  craving: string
  lastUpdated: string
}

export interface SongTrack {
  id: string
  title: string
  artist: string
  coverUrl: string
  audioUrl: string
  addedBy: PartnerId
  story: string
  duration: number
  createdAt: string
}

export interface StickyNote {
  id: string
  authorId: PartnerId
  content: string
  tag: 'Sweet' | 'Reminder' | 'Secret' | 'Gratitude' | 'Funny'
  color: 'rose' | 'sky' | 'amber' | 'lavender'
  isPinned: boolean
  likes: { [key in PartnerId]?: boolean }
  createdAt: string
}

export interface JourneyMilestone {
  id: string
  title: string
  date: string
  chapter: 'Awal Cerita' | 'Kencan Pertama' | 'Momen Manis' | 'Langkah Baru' | 'Rencana Masa Depan'
  story: string
  photoUrl?: string
  feeling?: string
  addedBy: PartnerId
  createdAt: string
}

export interface MemoryPassport {
  id: string
  title: string
  date: string
  location: string
  rating: number
  photoUrl: string
  menImpression: string
  womenImpression: string
  tags: string[]
  addedBy: PartnerId
}

export const useCoupleStore = defineStore('coupleStore', () => {
  // --- Gatekeeper State ---
  const isUnlocked = ref(false)
  const secretPin = ref('2408')
  const isGatekeeperMelting = ref(false)
  const activeTab = ref<'home' | 'quality-time'>('home')

  // Anniversary date (configurable)
  const anniversaryDate = ref('24 Agustus 2024')

  // Profile Edit Modal State
  const isProfileModalOpen = ref(false)

  // --- Active Identity ("Who's Home?") ---
  const activePartnerId = ref<PartnerId>('men')

  // Clean Partners Profile Data
  const partners = ref<Record<PartnerId, Partner>>({
    men: {
      id: 'men',
      name: 'Partner Men',
      callsign: 'Men',
      role: 'Men',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      accent: 'sky',
      battery: 100,
      mood: 'Belum diisi mood hari ini',
      craving: 'Belum ada keinginan khusus',
      lastUpdated: 'Hari ini'
    },
    women: {
      id: 'women',
      name: 'Partner Women',
      callsign: 'Women',
      role: 'Women',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      accent: 'rose',
      battery: 100,
      mood: 'Belum diisi mood hari ini',
      craving: 'Belum ada keinginan khusus',
      lastUpdated: 'Hari ini'
    }
  })

  const activePartner = computed(() => partners.value[activePartnerId.value])
  const otherPartner = computed(() => partners.value[activePartnerId.value === 'men' ? 'women' : 'men'])

  function switchPartner(id: PartnerId) {
    activePartnerId.value = id
  }

  function updateMyStatus(battery: number, mood: string, craving: string) {
    const p = partners.value[activePartnerId.value]
    p.battery = battery
    p.mood = mood
    p.craving = craving
    p.lastUpdated = 'Baru saja'
    saveToStorage()
  }

  function updateProfile(partnerId: PartnerId, name: string, callsign: string, avatar: string) {
    const p = partners.value[partnerId]
    p.name = name
    p.callsign = callsign
    if (avatar) p.avatar = avatar
    saveToStorage()
  }

  function updateSettings(annivDate: string, pin: string) {
    if (annivDate) anniversaryDate.value = annivDate
    if (pin && pin.length === 4) secretPin.value = pin
    saveToStorage()
  }

  // --- Music Player State ---
  const isPlaying = ref(false)
  const isPlayerModalOpen = ref(false)
  const isStoryFlipped = ref(false)
  const currentTrackIndex = ref(0)
  const playerVolume = ref(0.8)
  const currentTime = ref(0)
  const currentDuration = ref(180)

  const playlist = ref<SongTrack[]>([])

  const currentTrack = computed<SongTrack | null>(() => {
    if (playlist.value.length === 0) return null
    return playlist.value[currentTrackIndex.value] || playlist.value[0] || null
  })

  function nextTrack() {
    if (playlist.value.length === 0) return
    currentTrackIndex.value = (currentTrackIndex.value + 1) % playlist.value.length
    currentTime.value = 0
    isStoryFlipped.value = false
  }

  function prevTrack() {
    if (playlist.value.length === 0) return
    currentTrackIndex.value = (currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length
    currentTime.value = 0
    isStoryFlipped.value = false
  }

  function togglePlay() {
    isPlaying.value = !isPlaying.value
  }

  function addSong(song: Omit<SongTrack, 'id' | 'createdAt' | 'addedBy'>) {
    const newSong: SongTrack = {
      ...song,
      id: `song-${Date.now()}`,
      addedBy: activePartnerId.value,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    playlist.value.unshift(newSong)
    currentTrackIndex.value = 0
    saveToStorage()
  }

  function deleteSong(id: string) {
    playlist.value = playlist.value.filter(s => s.id !== id)
    if (currentTrackIndex.value >= playlist.value.length) {
      currentTrackIndex.value = 0
    }
    saveToStorage()
  }

  // --- Sticky Notes Wall ---
  const stickyNotes = ref<StickyNote[]>([])

  function addStickyNote(content: string, tag: StickyNote['tag'], color: StickyNote['color']) {
    const newNote: StickyNote = {
      id: `note-${Date.now()}`,
      authorId: activePartnerId.value,
      content,
      tag,
      color,
      isPinned: false,
      likes: {},
      createdAt: 'Baru saja'
    }
    stickyNotes.value.unshift(newNote)
    saveToStorage()
  }

  function toggleLikeNote(noteId: string) {
    const note = stickyNotes.value.find(n => n.id === noteId)
    if (note) {
      if (!note.likes) note.likes = {}
      const pid = activePartnerId.value
      note.likes[pid] = !note.likes[pid]
      saveToStorage()
    }
  }

  function togglePinNote(noteId: string) {
    const note = stickyNotes.value.find(n => n.id === noteId)
    if (note) {
      note.isPinned = !note.isPinned
      saveToStorage()
    }
  }

  function deleteNote(noteId: string) {
    stickyNotes.value = stickyNotes.value.filter(n => n.id !== noteId)
    saveToStorage()
  }

  // --- Quality Time Hub: Journey Milestones & Passport ---
  const qualityTimeTab = ref<'journey' | 'passport'>('journey')

  // Journey Milestones (replacing DeepTalk & DateJar)
  const journeyMilestones = ref<JourneyMilestone[]>([])

  function addJourneyMilestone(data: Omit<JourneyMilestone, 'id' | 'createdAt' | 'addedBy'>) {
    const newMilestone: JourneyMilestone = {
      ...data,
      id: `journey-${Date.now()}`,
      addedBy: activePartnerId.value,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    journeyMilestones.value.unshift(newMilestone)
    saveToStorage()
  }

  function deleteJourneyMilestone(id: string) {
    journeyMilestones.value = journeyMilestones.value.filter(j => j.id !== id)
    saveToStorage()
  }

  // Quality Time Passport
  const memories = ref<MemoryPassport[]>([])

  function addMemory(memory: Omit<MemoryPassport, 'id' | 'addedBy'>) {
    memories.value.unshift({
      ...memory,
      id: `mem-${Date.now()}`,
      addedBy: activePartnerId.value
    })
    saveToStorage()
  }

  function deleteMemory(id: string) {
    memories.value = memories.value.filter(m => m.id !== id)
    saveToStorage()
  }

  // Clear all data
  function clearAllData() {
    playlist.value = []
    stickyNotes.value = []
    journeyMilestones.value = []
    memories.value = []
    saveToStorage()
  }

  // Persistence to LocalStorage (Version 4: Men & Women)
  const STORAGE_KEY = 'couple_web_space_data_v4'

  function saveToStorage() {
    if (import.meta.client) {
      try {
        const payload = {
          version: 4,
          partners: partners.value,
          anniversaryDate: anniversaryDate.value,
          secretPin: secretPin.value,
          stickyNotes: stickyNotes.value,
          journeyMilestones: journeyMilestones.value,
          memories: memories.value,
          playlist: playlist.value,
          activePartnerId: activePartnerId.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } catch (e) {
        console.warn('Storage save failed:', e)
      }
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      try {
        localStorage.removeItem('couple_web_space_data')
        localStorage.removeItem('couple_web_space_data_v2')

        const rawV4 = localStorage.getItem(STORAGE_KEY)
        if (rawV4) {
          const data = JSON.parse(rawV4)
          if (data.version === 4) {
            if (data.partners) partners.value = data.partners
            if (data.anniversaryDate) anniversaryDate.value = data.anniversaryDate
            if (data.secretPin) secretPin.value = data.secretPin
            if (data.stickyNotes) stickyNotes.value = data.stickyNotes
            if (data.journeyMilestones) journeyMilestones.value = data.journeyMilestones
            if (data.memories) memories.value = data.memories
            if (data.playlist) playlist.value = data.playlist
            if (data.activePartnerId) activePartnerId.value = data.activePartnerId
            return
          }
        }

        // Migration from previous v3 data (mas & adek -> men & women)
        const rawV3 = localStorage.getItem('couple_web_space_data_v3')
        if (rawV3) {
          const data = JSON.parse(rawV3)
          if (data.partners) {
            if (data.partners.mas) {
              partners.value.men = {
                ...partners.value.men,
                ...data.partners.mas,
                id: 'men',
                callsign: data.partners.mas.callsign === 'Mas' ? 'Men' : data.partners.mas.callsign,
                role: data.partners.mas.role === 'Mas' ? 'Men' : data.partners.mas.role
              }
            }
            if (data.partners.adek) {
              partners.value.women = {
                ...partners.value.women,
                ...data.partners.adek,
                id: 'women',
                callsign: data.partners.adek.callsign === 'Adek' ? 'Women' : data.partners.adek.callsign,
                role: data.partners.adek.role === 'Adek' ? 'Women' : data.partners.adek.role
              }
            }
          }
          if (data.anniversaryDate) anniversaryDate.value = data.anniversaryDate
          if (data.secretPin) secretPin.value = data.secretPin
          if (data.stickyNotes) {
            stickyNotes.value = data.stickyNotes.map((n: any) => ({
              ...n,
              authorId: n.authorId === 'mas' ? 'men' : n.authorId === 'adek' ? 'women' : n.authorId,
              likes: {
                men: Boolean(n.likes?.mas || n.likes?.men),
                women: Boolean(n.likes?.adek || n.likes?.women)
              }
            }))
          }
          if (data.journeyMilestones) {
            journeyMilestones.value = data.journeyMilestones.map((j: any) => ({
              ...j,
              addedBy: j.addedBy === 'mas' ? 'men' : j.addedBy === 'adek' ? 'women' : j.addedBy
            }))
          }
          if (data.memories) {
            memories.value = data.memories.map((m: any) => ({
              ...m,
              menImpression: m.menImpression || m.masImpression || '',
              womenImpression: m.womenImpression || m.adekImpression || '',
              addedBy: m.addedBy === 'mas' ? 'men' : m.addedBy === 'adek' ? 'women' : m.addedBy
            }))
          }
          if (data.playlist) {
            playlist.value = data.playlist.map((p: any) => ({
              ...p,
              addedBy: p.addedBy === 'mas' ? 'men' : p.addedBy === 'adek' ? 'women' : p.addedBy
            }))
          }
          if (data.activePartnerId) {
            activePartnerId.value = data.activePartnerId === 'mas' ? 'men' : data.activePartnerId === 'adek' ? 'women' : data.activePartnerId
          }
          saveToStorage()
          localStorage.removeItem('couple_web_space_data_v3')
        }
      } catch (e) {
        console.warn('Storage load failed:', e)
      }
    }
  }

  // Gatekeeper Unlock Logic
  function unlockSpace() {
    isGatekeeperMelting.value = true
    setTimeout(() => {
      isUnlocked.value = true
      isGatekeeperMelting.value = false
    }, 850)
  }

  function lockSpace() {
    isUnlocked.value = false
    isGatekeeperMelting.value = false
  }

  return {
    // Gatekeeper & Views
    isUnlocked,
    secretPin,
    isGatekeeperMelting,
    unlockSpace,
    lockSpace,
    activeTab,
    anniversaryDate,
    isProfileModalOpen,

    // Partners
    activePartnerId,
    partners,
    activePartner,
    otherPartner,
    switchPartner,
    updateMyStatus,
    updateProfile,
    updateSettings,

    // Music Player
    isPlaying,
    isPlayerModalOpen,
    isStoryFlipped,
    currentTrackIndex,
    playerVolume,
    currentTime,
    currentDuration,
    playlist,
    currentTrack,
    nextTrack,
    prevTrack,
    togglePlay,
    addSong,
    deleteSong,

    // Sticky Notes
    stickyNotes,
    addStickyNote,
    toggleLikeNote,
    togglePinNote,
    deleteNote,

    // Quality Time Hub: Journey & Passport
    qualityTimeTab,
    journeyMilestones,
    addJourneyMilestone,
    deleteJourneyMilestone,

    // Passport
    memories,
    addMemory,
    deleteMemory,

    // Reset & Storage
    clearAllData,
    saveToStorage,
    loadFromStorage
  }
})
