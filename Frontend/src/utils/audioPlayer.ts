export class AudioPlayer {
    private audioElement: HTMLAudioElement;
  
    constructor() {
      this.audioElement = new Audio();
    }
  
    playAudio(url: string): Promise<void> {
      this.audioElement.src = url;
      return this.audioElement.play();
    }
  
    stop(): void {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
  
    setVolume(volume: number): void {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }