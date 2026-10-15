// Web Audio API engine for Vinyl Crackle, Audio Track Playback, and Tactile Haptics/Sounds

class AudioEngine {
  private ctx: AudioContext | null = null
  private audioElement: HTMLAudioElement | null = null
  private isSynthesizing = false
  private synthInterval: any = null
  private isUnlockedAudio = false

  private initContext() {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // Play subtle vinyl crackle sound for 1-1.5 seconds on successful PIN unlock
  public playVinylCrackle(): void {
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const bufferSize = ctx.sampleRate * 1.4 // ~1.4 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)

      // Generate soft pinkish noise with random pop crackles
      let b0 = 0, b1 = 0, b2 = 0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        let sample = (b0 + b1 + b2 + white * 0.5362) * 0.06

        // Random subtle crackle pops
        if (Math.random() < 0.0035) {
          sample += (Math.random() * 2 - 1) * 0.35
        }
        data[i] = sample
      }

      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = buffer

      // Bandpass filter to mimic warm vintage 33rpm vinyl record tone
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1400, ctx.currentTime)
      filter.Q.setValueAtTime(1.2, ctx.currentTime)

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.01, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 0.15)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.35)

      noiseSource.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      noiseSource.start()
      noiseSource.stop(ctx.currentTime + 1.4)
    } catch (e) {
      console.warn('Vinyl crackle audio synthesis notice:', e)
    }
  }

  // Soft tactile bubble click sound when tapping keypad or toggles
  public playKeyClick(freq: number = 440): void {
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.65, ctx.currentTime + 0.06)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.07)
    } catch (e) {
      // AudioContext muted/unsupported
    }
  }

  // Play charming romantic chime for success / correct PIN / unlock
  public playUnlockChime(): void {
    const ctx = this.initContext()
    if (!ctx) return

    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (warm major chord)
    notes.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        const startTime = ctx.currentTime + idx * 0.12

        osc.frequency.setValueAtTime(freq, startTime)
        gain.gain.setValueAtTime(0.001, startTime)
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.9)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.95)
      } catch (e) {}
    })
  }

  // Alias for success chime across components
  public playSuccessChime(): void {
    this.playUnlockChime()
  }

  // Soft wrong PIN buzz sound
  public playErrorBuzz(): void {
    const ctx = this.initContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(140, ctx.currentTime)
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1)

      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.26)
    } catch (e) {}
  }

  // Setup HTML5 Audio element
  public getOrCreateAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null
    if (!this.audioElement) {
      this.audioElement = new Audio()
      this.audioElement.crossOrigin = 'anonymous'
      this.audioElement.loop = true
    }
    return this.audioElement
  }

  // Start smooth music playback with fade-in from 0 to target volume (default 0.8)
  public playTrackWithFadeIn(audioUrl: string, targetVolume: number = 0.8, onProgress?: (cur: number, dur: number) => void): void {
    const audio = this.getOrCreateAudio()
    if (!audio) return

    this.initContext()

    try {
      if (audio.src !== audioUrl) {
        audio.src = audioUrl
        audio.load()
      }

      audio.volume = 0
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Smoothly ramp volume from 0 to targetVolume over 1200ms
            const stepTime = 50
            const steps = 1200 / stepTime
            const stepIncrement = targetVolume / steps
            let currentVol = 0

            const fadeInterval = setInterval(() => {
              currentVol += stepIncrement
              if (currentVol >= targetVolume) {
                audio.volume = targetVolume
                clearInterval(fadeInterval)
              } else {
                audio.volume = Math.min(targetVolume, currentVol)
              }
            }, stepTime)
          })
          .catch((err) => {
            console.warn('External audio track playback notice, enabling smooth ambient synth backup:', err)
            this.startAmbientSynth(targetVolume)
          })
      }

      if (onProgress) {
        audio.ontimeupdate = () => {
          onProgress(audio.currentTime, audio.duration || 180)
        }
      }
    } catch (e) {
      console.warn('Audio playback initialization error:', e)
      this.startAmbientSynth(targetVolume)
    }
  }

  // Smooth ambient lofi chords synthesizer as guaranteed zero-failure fallback
  public startAmbientSynth(volume: number = 0.6): void {
    if (this.isSynthesizing) return
    const ctx = this.initContext()
    if (!ctx) return

    this.isSynthesizing = true
    const chordProgression = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G7
    ]

    let chordIdx = 0

    const playNextChord = () => {
      if (!this.isSynthesizing) return
      const chord = chordProgression[chordIdx]
      chordIdx = (chordIdx + 1) % chordProgression.length

      chord.forEach((freq) => {
        try {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()

          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, ctx.currentTime)

          // Soft warm attack and gentle decay
          gain.gain.setValueAtTime(0.001, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(volume * 0.06, ctx.currentTime + 0.8)
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 3.8)

          osc.connect(gain)
          gain.connect(ctx.destination)

          osc.start()
          osc.stop(ctx.currentTime + 4.0)
        } catch (e) {}
      })
    }

    playNextChord()
    this.synthInterval = setInterval(playNextChord, 4000)
  }

  public stopAmbientSynth(): void {
    this.isSynthesizing = false
    if (this.synthInterval) {
      clearInterval(this.synthInterval)
      this.synthInterval = null
    }
  }

  public pauseTrack(): void {
    if (this.audioElement) {
      this.audioElement.pause()
    }
    this.stopAmbientSynth()
  }

  public resumeTrack(targetVolume: number = 0.8): void {
    if (this.audioElement && this.audioElement.src) {
      this.audioElement.volume = targetVolume
      this.audioElement.play().catch(() => {
        this.startAmbientSynth(targetVolume)
      })
    } else {
      this.startAmbientSynth(targetVolume)
    }
  }

  public setVolume(vol: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, vol))
    }
  }

  public seek(seconds: number): void {
    if (this.audioElement && !isNaN(this.audioElement.duration)) {
      this.audioElement.currentTime = seconds
    }
  }
}

let instance: AudioEngine | null = null

export function useAudioEngine() {
  if (!instance) {
    instance = new AudioEngine()
  }
  return instance
}
