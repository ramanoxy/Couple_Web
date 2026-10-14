import { defineStore } from 'pinia'

export type PartnerId = 'mas' | 'adek'

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

export interface DeepTalkQuestion {
  id: string
  category: 'Romance' | 'Memories' | 'Vulnerability' | 'Future' | 'Fun'
  question: string
  sparkPrompt: string
  addedBy: PartnerId
}

export interface DateIdea {
  id: string
  title: string
  category: 'Santai di Rumah' | 'Kulineran' | 'Outdoor/Jalan'
  estimatedCost: 'Hemat (< 50k)' | 'Sedang (50k - 200k)' | 'Spesial (> 200k)'
  duration: '1-2 Jam' | 'Setengah Hari' | 'Seharian'
  note: string
  addedBy: PartnerId
  drawnCount: number
}

export interface MemoryPassport {
  id: string
  title: string
  date: string
  location: string
  rating: number
  photoUrl: string
  masImpression: string
  adekImpression: string
  tags: string[]
  addedBy: PartnerId
}

export const useCoupleStore = defineStore('coupleStore', () => {
  // --- Gatekeeper State ---
  const isUnlocked = ref(false)
  const secretPin = ref('2408')
  const isGatekeeperMelting = ref(false)
  const activeTab = ref<'home' | 'quality-time' | 'passport'>('home')

  // Screen View Mode: 'responsive' (full laptop dashboard on lg screens) vs 'mobile' (simulated phone frame)
  const viewMode = ref<'responsive' | 'mobile'>('responsive')

  // Anniversary date (configurable)
  const anniversaryDate = ref('24 Agustus 2024')

  // Profile Edit Modal State
  const isProfileModalOpen = ref(false)

  // --- Active Identity ("Who's Home?") ---
  const activePartnerId = ref<PartnerId>('mas')

  // Clean Partners Profile Data (No hardcoded couple names, ready for user customization)
  const partners = ref<Record<PartnerId, Partner>>({
    mas: {
      id: 'mas',
      name: 'Partner A',
      callsign: 'Mas',
      role: 'Mas / Gua',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      accent: 'sky',
      battery: 100,
      mood: 'Belum diisi mood hari ini',
      craving: 'Belum ada craving',
      lastUpdated: 'Hari ini'
    },
    adek: {
      id: 'adek',
      name: 'Partner B',
      callsign: 'Adek',
      role: 'Sayang / Dia',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      accent: 'rose',
      battery: 100,
      mood: 'Belum diisi mood hari ini',
      craving: 'Belum ada craving',
      lastUpdated: 'Hari ini'
    }
  })

  // Computed Active Partner
  const activePartner = computed(() => partners.value[activePartnerId.value])
  const otherPartner = computed(() => partners.value[activePartnerId.value === 'mas' ? 'adek' : 'mas'])

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

  // --- Music Player State (Zero dummy songs) ---
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

  // --- Sticky Notes Wall (Zero dummy notes) ---
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

  // --- Module 2: Quality Time Hub (Zero dummy data) ---
  const qualityTimeTab = ref<'deep-talk' | 'date-jar' | 'passport'>('deep-talk')

  // A. Deep Talk Card Deck (Zero dummy questions)
  const deepTalkCards = ref<DeepTalkQuestion[]>([])
  const currentDeepTalkIndex = ref(0)
  const isDeepTalkFlipped = ref(false)

  function nextDeepTalkCard() {
    if (deepTalkCards.value.length === 0) return
    isDeepTalkFlipped.value = false
    currentDeepTalkIndex.value = (currentDeepTalkIndex.value + 1) % deepTalkCards.value.length
  }

  function shuffleDeepTalkDeck() {
    if (deepTalkCards.value.length === 0) return
    isDeepTalkFlipped.value = false
    const copy = [...deepTalkCards.value]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]]
    }
    deepTalkCards.value = copy
    currentDeepTalkIndex.value = 0
  }

  function addDeepTalkQuestion(question: string, category: DeepTalkQuestion['category'], sparkPrompt: string) {
    deepTalkCards.value.unshift({
      id: `dt-${Date.now()}`,
      category,
      question,
      sparkPrompt: sparkPrompt || 'Jawab dengan jujur dari lubuk hati terdalam ✨',
      addedBy: activePartnerId.value
    })
    currentDeepTalkIndex.value = 0
    isDeepTalkFlipped.value = false
    saveToStorage()
  }

  function deleteDeepTalkCard(id: string) {
    deepTalkCards.value = deepTalkCards.value.filter(c => c.id !== id)
    if (currentDeepTalkIndex.value >= deepTalkCards.value.length) {
      currentDeepTalkIndex.value = 0
    }
    saveToStorage()
  }

  // B. Date Idea Jar (Zero dummy tickets)
  const dateIdeas = ref<DateIdea[]>([])
  const selectedCategoryFilter = ref<string>('Semua')
  const lastDrawnIdea = ref<DateIdea | null>(null)
  const isJarShaking = ref(false)

  const filteredDateIdeas = computed(() => {
    if (selectedCategoryFilter.value === 'Semua') return dateIdeas.value
    return dateIdeas.value.filter(i => i.category === selectedCategoryFilter.value)
  })

  function shakeAndDrawDateIdea() {
    if (isJarShaking.value || dateIdeas.value.length === 0) return
    isJarShaking.value = true
    lastDrawnIdea.value = null

    setTimeout(() => {
      const pool = filteredDateIdeas.value.length > 0 ? filteredDateIdeas.value : dateIdeas.value
      if (pool.length > 0) {
        const randomIndex = Math.floor(Math.random() * pool.length)
        const picked = pool[randomIndex]
        picked.drawnCount++
        lastDrawnIdea.value = picked
      }
      isJarShaking.value = false
      saveToStorage()
    }, 1100)
  }

  function addDateIdea(idea: Omit<DateIdea, 'id' | 'addedBy' | 'drawnCount'>) {
    dateIdeas.value.unshift({
      ...idea,
      id: `idea-${Date.now()}`,
      addedBy: activePartnerId.value,
      drawnCount: 0
    })
    saveToStorage()
  }

  function deleteDateIdea(id: string) {
    dateIdeas.value = dateIdeas.value.filter(i => i.id !== id)
    if (lastDrawnIdea.value && lastDrawnIdea.value.id === id) {
      lastDrawnIdea.value = null
    }
    saveToStorage()
  }

  // C. Quality Time Passport (Zero dummy memories)
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

  // Clear all data back to clean slate
  function clearAllData() {
    playlist.value = []
    stickyNotes.value = []
    deepTalkCards.value = []
    dateIdeas.value = []
    memories.value = []
    lastDrawnIdea.value = null
    saveToStorage()
  }

  // Persistence to LocalStorage (Clean V2 Storage)
  const STORAGE_KEY = 'couple_web_space_data_v2'

  function saveToStorage() {
    if (import.meta.client) {
      try {
        const payload = {
          version: 2,
          partners: partners.value,
          anniversaryDate: anniversaryDate.value,
          secretPin: secretPin.value,
          stickyNotes: stickyNotes.value,
          deepTalkCards: deepTalkCards.value,
          dateIdeas: dateIdeas.value,
          memories: memories.value,
          playlist: playlist.value,
          activePartnerId: activePartnerId.value,
          viewMode: viewMode.value
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
        // Clear old dummy storage key if present
        localStorage.removeItem('couple_web_space_data')

        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const data = JSON.parse(raw)
          if (data.version === 2) {
            if (data.partners) partners.value = data.partners
            if (data.anniversaryDate) anniversaryDate.value = data.anniversaryDate
            if (data.secretPin) secretPin.value = data.secretPin
            if (data.stickyNotes) stickyNotes.value = data.stickyNotes
            if (data.deepTalkCards) deepTalkCards.value = data.deepTalkCards
            if (data.dateIdeas) dateIdeas.value = data.dateIdeas
            if (data.memories) memories.value = data.memories
            if (data.playlist) playlist.value = data.playlist
            if (data.activePartnerId) activePartnerId.value = data.activePartnerId
            if (data.viewMode) viewMode.value = data.viewMode
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
    viewMode,
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

    // Quality Time Hub
    qualityTimeTab,
    deepTalkCards,
    currentDeepTalkIndex,
    isDeepTalkFlipped,
    nextDeepTalkCard,
    shuffleDeepTalkDeck,
    addDeepTalkQuestion,
    deleteDeepTalkCard,

    // Date Jar
    dateIdeas,
    selectedCategoryFilter,
    lastDrawnIdea,
    isJarShaking,
    filteredDateIdeas,
    shakeAndDrawDateIdea,
    addDateIdea,
    deleteDateIdea,

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
