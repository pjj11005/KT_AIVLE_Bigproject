import os
import asyncio
from django.conf import settings
from google.cloud import texttospeech_v1
from channels.db import database_sync_to_async
from colorama import Fore, Style
from channels.layers import get_channel_layer

class TTSProcessor:
    def __init__(self):
        self.queue = asyncio.Queue()
        self.task = None
        self.loop = None
        
    async def start(self):
        try:
            self.task = asyncio.create_task(self.process_queue())
        except Exception as e:
            print(str(e))
            

    async def stop(self):
        if self.task:
            self.task.cancel()
            try:
                await self.task
            except asyncio.CancelledError:
                pass

    async def process_queue(self):
        while True:
            text, voice_name, channel_name, counter, customer_id, sentiment = await self.queue.get()
            try:
                print(f"Processing TTS for text: {text}")
                file_path = await self.text_to_speech(text, voice_name, counter, customer_id)
                # 오디오 파일 생성 완료 후 채널 레이어로 메시지 전송
                await self.send_audio_ready_message(channel_name, file_path, counter, text, sentiment)
                print(f"TTS processing completed for text: {text}")
            except Exception as e:
                print(f"Error in TTS processing: {str(e)}")
            finally:
                self.queue.task_done()

    async def add_to_queue(self, text, voice_name, channel_name, counter, customer_id, sentiment):
        await self.queue.put((text, voice_name, channel_name, counter, customer_id, sentiment))

    async def text_to_speech(self, text, voice_name, counter, customer_id):
        client = texttospeech_v1.TextToSpeechAsyncClient()

        synthesis_input = texttospeech_v1.SynthesisInput(text=text)
        voice = texttospeech_v1.VoiceSelectionParams(language_code="ko-KR", name=voice_name)
        # WAV 형식 (LINEAR16)으로 오디오 설정
        audio_config = texttospeech_v1.AudioConfig(
            audio_encoding=texttospeech_v1.AudioEncoding.MP3,
            sample_rate_hertz=16000  # 샘플 레이트 설정 (선택사항)
        )

        response = await client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

        dir_path = os.path.join('TTS_voice', customer_id)
        os.makedirs(os.path.join(settings.MEDIA_ROOT, dir_path), exist_ok=True)
        file_name = f"audio_{counter}.mp3"
        full_path = os.path.join(settings.MEDIA_ROOT, dir_path, file_name)
        
        try:
            await database_sync_to_async(self.save_audio_file)(full_path, response.audio_content)
            print(Fore.RED + f"\nTTS voice audio file saved at: {full_path}" + Style.RESET_ALL)
        except Exception as e:
            print(str(e))
            
        save_path = os.path.join(dir_path, file_name)
            
        return save_path

    @staticmethod
    def save_audio_file(filename, content):
        with open(filename, "wb") as out:
            out.write(content)

    async def send_audio_ready_message(self, channel_name, file_path, counter, text, sentiment):
        print(f"Sending audio ready message: channel={channel_name}, counter={counter}")
        channel_layer = get_channel_layer()
        try:
            await channel_layer.send(channel_name, {
                "type": "TTS.Audio",
                "file_path": file_path,
                "counter": counter,
                "text": text,
                "sentiment": sentiment
            })
            print("Audio ready message sent successfully")
        except Exception as e:
            print(f"Error sending audio ready message: {e}")
            raise

# 전역 TTS 프로세서 인스턴스 생성
tts_processor = TTSProcessor()
