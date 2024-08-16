export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isProcessing = false;
  private audioBuffer: Int16Array[] = [];
  private audioBufferDuration = 0;
  private readonly SAMPLE_RATE = 16000;
  private readonly CHUNK_SIZE = 1024;
  private readonly CHANNELS = 1;
  private readonly CHUNK_DURATION = 4;
  private audioCounter = 0;
  private audioSocket: WebSocket | null = null;

  constructor(
    private type: 'sender' | 'receiver',
    private onResultCallback: (result: any) => void,
    private customerId: string,
    private agentId: string,
    private phone: string,
  ) {
    this.type = type;
    this.onResultCallback = onResultCallback;
    this.customerId = customerId;
    this.agentId = agentId;
  }

  start(stream: MediaStream) {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContextClass();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.processor = this.audioContext.createScriptProcessor(
      this.CHUNK_SIZE,
      this.CHANNELS,
      this.CHANNELS,
    );

    source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);

    this.processor.onaudioprocess = (e) => {
      if (!this.isProcessing) return;

      const inputData = e.inputBuffer.getChannelData(0);
      const resampledData = this.resampleAudio(
        inputData,
        this.audioContext!.sampleRate,
        this.SAMPLE_RATE,
      );
      const intData = new Int16Array(resampledData.length);
      for (let i = 0; i < resampledData.length; i++) {
        intData[i] = Math.max(
          -32768,
          Math.min(32767, Math.floor(resampledData[i] * 32768)),
        );
      }

      this.addToAudioBuffer(intData);
    };

    this.isProcessing = true;
    this.connectWebSocket();
  }

  private addToAudioBuffer(audioData: Int16Array) {
    this.audioBuffer.push(audioData);
    this.audioBufferDuration += audioData.length / this.SAMPLE_RATE;

    if (this.audioBufferDuration >= this.CHUNK_DURATION) {
      const combinedBuffer = this.combineAudioBuffers(this.audioBuffer);
      this.sendAudioData(combinedBuffer);
      this.audioBuffer = [];
      this.audioBufferDuration = 0;
    }
  }

  private combineAudioBuffers(buffers: Int16Array[]): Int16Array {
    const totalLength = buffers.reduce((sum, buffer) => sum + buffer.length, 0);
    const result = new Int16Array(totalLength);
    let offset = 0;
    for (const buffer of buffers) {
      result.set(buffer, offset);
      offset += buffer.length;
    }
    return result;
  }

  stop() {
    this.isProcessing = false;

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }
    if (this.audioSocket) {
      this.audioSocket.close();
      this.audioSocket = null;
    }
  }

  private connectWebSocket() {
    this.audioSocket = new WebSocket('ws://localhost:8000/ws/');

    this.audioSocket.onopen = () => {
      console.log('WebSocket connected to Django server');
    };

    this.audioSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleServerMessage(data);
    };

    this.audioSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.audioSocket.onclose = (event) => {
      if (event.wasClean) {
        console.log(
          `WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`,
        );
      } else {
        console.error('WebSocket connection died');
      }
    };

    setTimeout(() => {
      if (this.audioSocket && this.audioSocket.readyState !== WebSocket.OPEN) {
        console.error(
          'WebSocket connection failed to establish within timeout',
        );
        this.audioSocket.close();
      }
    }, 5000);
  }

  private sendAudioData(audioData: Int16Array) {
    if (this.audioSocket && this.audioSocket.readyState === WebSocket.OPEN) {
      const wavHeader = this.createWavHeader(audioData.length * 2);
      const header = JSON.stringify({
        type: this.type,
        sampleRate: this.SAMPLE_RATE,
        counter: ++this.audioCounter,
        customerId: this.customerId,
        agentId: this.agentId,
        phone: this.phone,
      });
      const headerBuffer = new TextEncoder().encode(header);
      const headerLengthBuffer = new Uint32Array([headerBuffer.byteLength]);

      const message = new Uint8Array(
        4 +
          headerBuffer.byteLength +
          wavHeader.byteLength +
          audioData.length * 2,
      );
      message.set(new Uint8Array(headerLengthBuffer.buffer), 0);
      message.set(headerBuffer, 4);
      message.set(wavHeader, 4 + headerBuffer.byteLength);

      const audioUint8 = new Uint8Array(audioData.buffer);
      message.set(
        audioUint8,
        4 + headerBuffer.byteLength + wavHeader.byteLength,
      );

      this.audioSocket.send(message.buffer);
    } else {
      console.error(
        `Cannot send ${this.type} audio data: WebSocket is not open`,
      );
      this.reconnectWebSocket();
    }
  }

  private reconnectWebSocket() {
    if (this.audioSocket) {
      this.audioSocket.close();
    }
    this.connectWebSocket();
  }

  private createWavHeader(dataLength: number): Uint8Array {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    view.setUint32(0, 0x52494646, false);
    view.setUint32(4, 36 + dataLength, true);
    view.setUint32(8, 0x57415645, false);
    view.setUint32(12, 0x666d7420, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 16000, true);
    view.setUint32(28, 16000 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    view.setUint32(36, 0x64617461, false);
    view.setUint32(40, dataLength, true);

    return new Uint8Array(header);
  }

  private resampleAudio(
    audioData: Float32Array,
    fromSampleRate: number,
    toSampleRate: number,
  ): Float32Array {
    if (fromSampleRate === toSampleRate) {
      return audioData;
    }

    const ratio = fromSampleRate / toSampleRate;
    const newLength = Math.round(audioData.length / ratio);
    const result = new Float32Array(newLength);

    let offsetResult = 0;
    let offsetAudio = 0;

    while (offsetResult < result.length) {
      const nextOffsetAudio = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;

      for (
        let i = offsetAudio;
        i < nextOffsetAudio && i < audioData.length;
        i++
      ) {
        accum += audioData[i];
        count++;
      }

      result[offsetResult] = accum / count;
      offsetResult++;
      offsetAudio = nextOffsetAudio;
    }

    return result;
  }

  private handleServerMessage(data: any) {
    if (this.onResultCallback) {
      this.onResultCallback(data);
    }
  }
}
