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

  // Clean Partners Profile Data (Our Sanctuary: Alif & Sayang)
  const partners = ref<Record<PartnerId, Partner>>({
    men: {
      id: 'men',
      name: 'Alif',
      callsign: 'Alif',
      role: 'Alif',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      accent: 'sky',
      battery: 80,
      mood: 'Pengen dipeluk',
      craving: 'Pengen ngobrol santai berdua',
      lastUpdated: 'Hari ini'
    },
    women: {
      id: 'women',
      name: 'Sayang',
      callsign: 'Sayang',
      role: 'Sayang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      accent: 'rose',
      battery: 45,
      mood: 'Butuh recharge',
      craving: 'Sayang lagi ngidam mie pedes.',
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

  // --- Virtual Hug & Deep Talk Modal State ---
  const isDeepTalkModalOpen = ref(false)
  const isHugFlying = ref(false)
  const hugFeedback = ref<string | null>(null)

  function sendVirtualHug() {
    isHugFlying.value = true
    hugFeedback.value = `Pelukan hangat terkirim untuk ${otherPartner.value.callsign} ♡`
    setTimeout(() => {
      isHugFlying.value = false
    }, 2200)
    setTimeout(() => {
      hugFeedback.value = null
    }, 3800)
  }

  // --- Music Player State (Our Soundtrack) ---
  const isPlaying = ref(false)
  const isPlayerModalOpen = ref(false)
  const isStoryFlipped = ref(false)
  const currentTrackIndex = ref(0)
  const playerVolume = ref(0.8)
  const currentTime = ref(0)
  const currentDuration = ref(180)

  const playlist = ref<SongTrack[]>([
    {
      id: 'track-cas',
      title: "Nothing's Gonna Hurt You Baby",
      artist: 'Cigarettes After Sex',
      coverUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      addedBy: 'women',
      story: 'our soundtrack',
      duration: 285,
      createdAt: 'Hari ini'
    }
  ])

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

  // --- Little Love Notes ---
  const stickyNotes = ref<StickyNote[]>([
    {
      id: 'note-sayang-1',
      authorId: 'women',
      content: 'Jangan lupa makan, ya. Ada yang sayang kamu di sini.',
      tag: 'Sweet',
      color: 'rose',
      isPinned: true,
      likes: { men: true, women: true },
      createdAt: '10:24'
    },
    {
      id: 'note-alif-2',
      authorId: 'men',
      content: 'Nanti sore jalan sebentar? Aku kangen cerita random kamu.',
      tag: 'Sweet',
      color: 'sky',
      isPinned: false,
      likes: { men: true, women: false },
      createdAt: '11:08'
    }
  ])

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

  // Persistence to LocalStorage (Version 5: Sanctuary)
  const STORAGE_KEY = 'couple_sanctuary_data_v5'

  function saveToStorage() {
    if (import.meta.client) {
      try {
        const payload = {
          version: 5,
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
        const rawV5 = localStorage.getItem(STORAGE_KEY)
        if (rawV5) {
          const data = JSON.parse(rawV5)
          if (data.version === 5) {
            if (data.partners) partners.value = data.partners
            if (data.anniversaryDate) anniversaryDate.value = data.anniversaryDate
            if (data.secretPin) secretPin.value = data.secretPin
            if (data.stickyNotes && data.stickyNotes.length) stickyNotes.value = data.stickyNotes
            if (data.journeyMilestones) journeyMilestones.value = data.journeyMilestones
            if (data.memories) memories.value = data.memories
            if (data.playlist && data.playlist.length) playlist.value = data.playlist
            if (data.activePartnerId) activePartnerId.value = data.activePartnerId
            return
          }
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

    // Virtual Hug & Deep Talk
    isDeepTalkModalOpen,
    isHugFlying,
    hugFeedback,
    sendVirtualHug,

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
