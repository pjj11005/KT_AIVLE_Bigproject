import json
import asyncio
import numpy as np
import os
import aiohttp
from django.conf import settings
from django.apps import apps
from channels.generic.websocket import AsyncWebsocketConsumer
from ai_model.sentiment_analysis import process_chunk, summarize_and_extract_keywords
from ai_model.tts import TTSProcessor
from channels.db import database_sync_to_async
from datetime import datetime
from asgiref.sync import sync_to_async

THRESHOLD = 7000 # 음량 기준

class CallConsumer(AsyncWebsocketConsumer):
    active_connections = 0  # 클래스 변수로 활성 연결 수 추적
    make_db_count = 0 
    call_id = ''
    async def connect(self):
        await self.accept()
        CallConsumer.active_connections = 0
        if CallConsumer.make_db_count > 2:
            CallConsumer.make_db_count = 0 # 2 이상일 때 0으로 초기화
        CallConsumer.make_db_count += 1  # 연결 시 카운트 증가
        print('Make DB Counts:', CallConsumer.make_db_count)
        self.customer_id = ''
        self.VocRecord = apps.get_model('call', 'VocRecord')
        # self.call_id = ''
        self.total_count = 0
        self.full_conversation = []
        self.tts_processor = TTSProcessor()
        self.id = ''
        self.phone = 0
        self.dir_path = ''
        self.log_file_path = ''
        await self.tts_processor.start()

        # 호스트 정보 저장
        self.host = self.scope['headers'][0][1].decode('utf-8')
        
    async def disconnect(self, close_code):
        CallConsumer.active_connections -= 1  # 연결 해제 시 카운트 감소
        # CallConsumer.make_db_count -= 1
        print('Active Connection:', CallConsumer.active_connections)
        print('Make DB Counts:', CallConsumer.make_db_count)
        
        if CallConsumer.active_connections == 0:  # 모든 연결이 종료된 경우에만 요약 생성
            summary_result = await self.summarize_conversation()
            if summary_result:
                print('Summary, Keyword and Context Results:', summary_result)
                summary = summary_result['summary']
                keywords = summary_result['keywords']
                context = summary_result['context']
            
            # 동기 함수를 비동기 컨텍스트에서 실행(값 대입)
            await self.update_voc_record(summary, keywords, context, summary_result)
         
        await self.tts_processor.stop()
        await self.close()

    async def receive(self, text_data=None, bytes_data=None):
        if CallConsumer.active_connections < 2:
            CallConsumer.active_connections += 1  # 연결 시 카운트 증가
        print('Active Connection:', CallConsumer.active_connections)
        
        if bytes_data:
            header_length = int.from_bytes(bytes_data[:4], byteorder='little')
            
            header = json.loads(bytes_data[4:4+header_length].decode())
            
            audio_data = np.frombuffer(bytes_data[4+header_length:], dtype=np.int16)
            
            audio_type = header['type']
            sample_rate = header['sampleRate']
            counter = header['counter']
            customer_id = header['customerId'] # 임의로 생성한 customer ID 값
            id = header['agentId'] # 상담사 ID
            phone = header['phone'] # 민원인 전화번호
            
            self.id = id
            self.phone = phone
            self.customer_id = customer_id

            CallConsumer.make_db_count -= 1
            # db에 필드 생성
            if CallConsumer.make_db_count == 1:
                call_id = await self.create_voc_record(self.phone, self.id)
                print(f"Counselor ID: {self.id}")
                print(f"Consumer phone: {self.phone}")
                CallConsumer.call_id = int(call_id)
                print("Call ID:", CallConsumer.call_id)

            CallConsumer.make_db_count += 2
            self.dir_path = os.path.join(settings.MEDIA_ROOT, "logs", self.customer_id)
            os.makedirs(self.dir_path, exist_ok=True)
            self.log_file_path = os.path.join(self.dir_path, "full_conversation.txt")
            
            decibel_count = await self.calculate_decibels(audio_data)
            self.total_count += decibel_count

            # type 수정 필요
            if audio_type == 'sender' and np.max(audio_data) > THRESHOLD:
                await self.process_client_chunk(audio_data, counter, customer_id)
            elif audio_type == 'receiver' and np.max(audio_data) > THRESHOLD:
                await self.process_counselor_audio(audio_data, counter, customer_id)
                
        elif text_data:
            data = json.loads(text_data)
            print(f"Received text data: {data}")
                
        else:
            print("Neither text data nor binary data received")
    
    async def create_voc_record(self, phone, id):
        async with aiohttp.ClientSession() as session:
            async with session.post('http://localhost:8000/api/call/receive/', json={'phone': phone, 'id': id}) as response:
                if response.status == 200:
                    data = await response.json()
                    print('VocRecord Data:', data)
                    CallConsumer.call_id = data['result']['id']
                    print("Success create VocRecord Data")
                    print("Send Call ID")
                    return CallConsumer.call_id
                else:
                    print(f"Error creating VocRecord: {await response.text()}")
                    return None
    
    @database_sync_to_async    
    def update_voc_record(self, summary, keywords, context, summary_result):
        try:
            # 이미 존재하는 VocRecord를 찾거나 새로 생성합니다.
            voc_record, created = self.VocRecord.objects.get_or_create(
                id = CallConsumer.call_id,
                defaults={'summary': summary, 'keyword': keywords, 'context': context}
            )
            if not created:
                # 이미 존재하는 레코드라면 summary와 keyword만 업데이트합니다.
                voc_record.summary = summary
                voc_record.keyword = keywords
                voc_record.context = context
                voc_record.save(update_fields=['summary', 'keyword', 'context'])
            print(f"Summary, keywords and Context updated in VocRecord: {summary_result}")
        except Exception as e:
            print(f"Error occured when update DB: {str(e)}")

    @database_sync_to_async
    def calculate_decibels(self, audio_data):
        data_float = audio_data.astype(np.float64)
        rms = np.sqrt(np.mean(np.abs(data_float)**2))
        if rms > 0:
            db = 20 * np.log10(rms / 32768)
        else:
            db = -100

        display_db = min(max(db, -60), 0)
        level = "loud" if display_db > -5 else "not loud"

        if level == "loud":
            print("Client Voice is TOO LOUD!!")
            return 1
        return 0

    async def process_client_chunk(self, audio_data, counter, customer_id):
        transcription, sentiment, negative_count = await process_chunk(audio_data, customer_id, counter, 'client')
        if transcription is None or sentiment is None or negative_count is None:
            print("process_chunk returned None")
            return

        self.total_count += negative_count

        current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        await self.send(json.dumps({
            'type': 'current_time',
            'time': current_datetime
        }))
        
        with open(self.log_file_path, "a", encoding="utf-8") as log_file:
            log_file.write(f"{current_datetime}: 민원인: {transcription}\n")
                        
        if self.total_count == 0:
            audio_file_url = self.get_audio_url(os.path.join('original_voice', customer_id, 'client', f'audio_{counter}.wav'))
            await self.send(json.dumps({
                'type': 'client_transcription_non_negative',
                'text': transcription,
                'sentiment': sentiment,
                'audio_file_path': audio_file_url}))
        else:
            await self.handle_negative_speech(transcription, counter, customer_id, sentiment)
        
    async def TTS_Audio(self, event):
        print(f"TTS_Audio called with event: {event}")
        audio_file_url = self.get_audio_url(event['file_path'])
        await self.send(json.dumps({
            'type': 'client_transcription_negative',
            'text': event['text'],
            'sentiment': event['sentiment'],
            'audio_file_path': audio_file_url,
            'counter': event['counter']
        }))
        print(f"TTS Audio sent to client: {audio_file_url}")

    async def process_counselor_audio(self, audio_data, counter, customer_id):
        transcription = await process_chunk(audio_data, customer_id, counter, 'counselor')
        if transcription is None:
            return
        else:
            current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            with open(self.log_file_path, "a", encoding="utf-8") as log_file:
                log_file.write(f"{current_datetime}: 상담사: {transcription}\n")
                
            await self.send(json.dumps({
                'type': 'counselor_transcription',
                'text': transcription
            }))
    
    # 절대 경로
    def get_audio_url(self, path):
        return f"http://{self.host}{settings.MEDIA_URL}{path}"

    async def handle_negative_speech(self, transcription, counter, customer_id, sentiment):
        print(f"Handling negative speech: {transcription}")
        voice_name = "ko-KR-Standard-D"  # 기본값으로 남성 음성 사용
        await self.tts_processor.add_to_queue(
            transcription, 
            voice_name, 
            self.channel_name,
            counter,
            customer_id,
            sentiment
        )
        print(f"Added to TTS queue")
                
    def read_full_conversation(self):
        """파일 경로 테스트 : 아래 log_file_path 변수를 self.log_file_path로 바꿈
        dir_path, log_file_path 만드는 코드 겹친다고 판단"""
        full_conversation = ""
        
        try:
            with open(self.log_file_path, "r", encoding="utf-8") as log_file:
                lines = log_file.readlines()
                full_conversation = "\n".join(line.strip() for line in lines)
        except FileNotFoundError:
            print(f"File not found: {self.log_file_path}")
        except Exception as e:
            print(f"An error occurred while reading the file: {str(e)}")
        
        return full_conversation
                
    async def summarize_conversation(self):
        if CallConsumer.active_connections == 0:
            try:
                sorted_conversation = self.read_full_conversation()
                result = await summarize_and_extract_keywords(sorted_conversation)
                result_dict = json.loads(result)
                
                if 'error' not in result_dict:
                    return {
                        'type': 'summary',
                        'summary': result_dict['summary'],
                        'keywords': result_dict['keywords'],
                        'context' : sorted_conversation,
                    }
                else:
                    return {
                        'type': 'error',
                        'message': f"오류 발생: {result_dict['error']}"
                    }
            except json.JSONDecodeError as e:
                return {
                    'type': 'error',
                    'message': f"JSON 파싱 중 오류 발생: {str(e)}"
                }
            except Exception as e:
                return {
                    'type': 'error',
                    'message': f"예외 발생: {str(e)}"
                }
        else:
            return None  # 모든 연결이 종료되지 않았거나 대화 내용이 없는 경우