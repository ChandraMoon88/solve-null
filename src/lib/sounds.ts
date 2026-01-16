// Simple sound effect manager
export class SoundManager {
  private static instance: SoundManager
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled: boolean = true

  private constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sound_enabled')
      this.enabled = saved !== 'false'
    }
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_enabled', enabled.toString())
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  // Play sound using Web Audio API frequency
  playTone(frequency: number, duration: number = 200) {
    if (!this.enabled || typeof window === 'undefined') return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)
    } catch (e) {
      console.warn('Sound not available')
    }
  }

  // Predefined sounds
  success() {
    this.playTone(523.25, 150) // C5
    setTimeout(() => this.playTone(659.25, 150), 100) // E5
    setTimeout(() => this.playTone(783.99, 200), 200) // G5
  }

  error() {
    this.playTone(200, 150)
    setTimeout(() => this.playTone(150, 200), 100)
  }

  click() {
    this.playTone(800, 50)
  }

  notification() {
    this.playTone(440, 100) // A4
    setTimeout(() => this.playTone(554.37, 150), 120) // C#5
  }

  levelComplete() {
    this.playTone(261.63, 100) // C4
    setTimeout(() => this.playTone(329.63, 100), 120) // E4
    setTimeout(() => this.playTone(392, 100), 240) // G4
    setTimeout(() => this.playTone(523.25, 300), 360) // C5
  }

  achievementUnlocked() {
    this.playTone(659.25, 100) // E5
    setTimeout(() => this.playTone(783.99, 100), 100) // G5
    setTimeout(() => this.playTone(987.77, 100), 200) // B5
    setTimeout(() => this.playTone(1046.50, 300), 300) // C6
  }

  hintUnlocked() {
    this.playTone(440, 80) // A4
    setTimeout(() => this.playTone(554.37, 120), 90) // C#5
  }
}

export const soundManager = typeof window !== 'undefined' ? SoundManager.getInstance() : null
