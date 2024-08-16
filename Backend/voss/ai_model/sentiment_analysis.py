import os
import json
import tempfile
import asyncio
import io
import numpy as np
from scipy.io import wavfile
from django.conf import settings
from groq import AsyncGroq
from openai import AsyncOpenAI
from channels.db import database_sync_to_async
from colorama import Fore, Style

async def process_chunk(audio_bytes, customer_id, counter, speaker_type):
    print(Fore.YELLOW + f"\nProcessing {speaker_type} audio chunk {counter}..." + Style.RESET_ALL)
    
    transcription = await transcribe_audio_groq(audio_bytes, customer_id, counter, speaker_type)
    if not transcription:
        print(Fore.RED + f"Transcription failed or returned empty string for {speaker_type} chunk {counter}" + Style.RESET_ALL)
        return None

    negative_count = 0
    # hallucinations list
    hallucinations = ["!", " 영상이 좋으셨다면 구독과 좋아요 부탁드립니다.",
                      " 다음 영상에서 만나요.", " 영상이 좋으면 구독과 좋아요 부탁드립니다.",
                      " 다음 영상에서 만나요.", " 영상이 좋으면 구독과 좋아요 부탁드립니다.",
                      " 영상이 마음에 드셨다면 구독과 좋아요를 눌러주세요.", " 한글자막 by 한효정",
                      " 자막 제공 및 자막 제공 및 광고를 포함하고 있습니다.", " 이 영상은 제작지원에 대한 자막을 사용하였습니다.", 
                      " 아이유의 인생은? 아이유의 인생은? 아이유의 인생은?"," 자막이 필요하면 댓글에 링크를 적어주세요.",
                      " 자막은 설정에서 선택하실 수 있습니다.", " 다음 영상에서 만나요", " 다음 영상에서 만나요!",
                      " 자막 제공 및 영상 제공 및 광고를 포함하고 있습니다.", " 이 영상은 한국국토정보공사의 한 영상입니다.",
                      " 3.2mm 가스의 기능을 사용하는 방법", " 영상편집 및 자막 제공 및 광고를 포함하고 있습니다.",
                      " 이 영상은 한국어 자막을 사용하였습니다.", " 다음 시간에 뵙겠습니다.", " 수업을 진행하는 것입니다.",
                      " 다음 주에 만나요.", " 감사합니다.", " 언어는 정상으로 듣는다.", " 3. 4. 5.", " 3.",
                      " 자막이 필요하면 구독과 좋아요 부탁드립니다.", " 이 영상은 제작지원에 참여해주신 분들께 진심으로 감사드립니다.",
                      "고맙습니다.", "아 자막이 필요하면 댓글에 링크를 적어주세요.", " ㄷㄷ 자막이 필요하면 댓글에 링크를 적어주세요.",
                      "영상은 이렇게 되었습니다.", "다시 한번 자막이 필요하면 댓글에 링크를 적어주세요.",
                      " 이 영상은 제작지원에 참여해 주신 분들께 진심으로 감사드립니다.", " 제 대본이 아직 작성되지 않았습니다.",
                      " 이 영상은 제작지원으로 제작되었습니다.", " 영상이 마음에 드셨다면 구독과 좋아요 부탁드립니다.", " 3.2.1",
                      " 네 감사합니다."
                      ]
    
    if speaker_type == 'counselor': # 상담사
        if transcription in hallucinations or len(transcription) >= 60:
            return None
        else:
            return transcription
    
    if transcription in hallucinations or len(transcription) >= 100:
        return None, 'NEUTRAL', 0

    print(Fore.RED + f"Original Transcription result for chunk {counter}: " + transcription + Style.RESET_ALL)
    result_json = await classify_and_refine_sentence(transcription)
    result = json.loads(result_json)
    sentiment, transcription = result['sentiment'], result['transcription']
    print(Fore.CYAN + f"Refined Transcription result for chunk {counter}: " + transcription + Style.RESET_ALL)
    
    if 'negative' in sentiment.lower():
        negative_count = 1
    else:
        negative_count = 0

    return (transcription, sentiment, negative_count)

async def transcribe_audio_groq(audio_data, customer_id, counter, speaker_type):
    print(f"Entering transcribe_audio_groq for {speaker_type}")
    print(f"audio_data type: {type(audio_data)}")
    
    groq_api_key = os.getenv('GROQ_API_KEY')
    if not groq_api_key:
        print(Fore.RED + "Error: GROQ_API_KEY environment variable not set." + Style.RESET_ALL)
        raise EnvironmentError("GROQ_API_KEY environment variable not set.")
    
    client = AsyncGroq(api_key=groq_api_key)
    
    if isinstance(audio_data, np.ndarray):
        audio_array = audio_data
    else:
        raise ValueError(f"Unexpected audio_data type: {type(audio_data)}")

    print(f"audio_array shape: {audio_array.shape}")
    print(f"audio_array dtype: {audio_array.dtype}")
    
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
        wavfile.write(tmp_file.name, 16000, audio_array)  # Assuming 16000 Hz sample rate
        temp_filename = tmp_file.name
    
    try:
        with open(temp_filename, "rb") as file:
            transcription = await client.audio.transcriptions.create(
                file=(temp_filename, file),
                model="whisper-large-v3",
                prompt="Specify context or spelling",
                language="ko",
            )
        
        # Save the audio file in the specified directory
        dir_path = os.path.join(settings.MEDIA_ROOT, "original_voice", customer_id, speaker_type)
        os.makedirs(dir_path, exist_ok=True)
        
        final_filename = os.path.join(dir_path, f"audio_{counter}.wav")
        
        try:
            await database_sync_to_async(save_audio_file)(final_filename, audio_array)
            print(f"File saved successfully for {speaker_type}")
        except Exception as e:
            print(f"Error saving file for {speaker_type}: {str(e)}")
            raise
        
        print(Fore.GREEN + f"\n{speaker_type.capitalize()} audio file saved at: {final_filename}" + Style.RESET_ALL)

        return transcription.text

    except Exception as e:
        print(Fore.RED + f"\nError during transcription or file saving for {speaker_type} chunk {counter}: {e}" + Style.RESET_ALL)
        print(f"Error details: {str(e)}")
        if hasattr(e, 'response'):
            print(f"Response status: {e.response.status_code}")
            print(f"Response content: {e.response.content}")
        return None
    finally:
        os.remove(temp_filename)  # Remove the temporary file

def save_audio_file(filename, content):
    if isinstance(content, np.ndarray):
        wavfile.write(filename, 16000, content)  # Save as WAV file with 16000 Hz sample rate
    else:
        raise ValueError(f"Unexpected content type in save_audio_file: {type(content)}")

async def summarize_and_extract_keywords(query):
    try:
        openai_apikey = os.getenv('OPENAI_API_KEY')
        if not openai_apikey:
            print(Fore.RED + "Error: OPENAI_API_KEY environment variable not set." + Style.RESET_ALL)
            raise EnvironmentError("OPENAI_API_KEY environment variable not set.")
        client = AsyncOpenAI(api_key=openai_apikey)
        
        user_input = f"""Analyze the following Korean conversation: "{query}"
        1. Provide a concise summary of the conversation.
        2. Extract the most important keywords from the conversation.
        
        Respond in JSON format with the following keys:
        - summary: A brief summary of the conversation in Korean
        - keywords: A list of important keywords from the conversation in Korean

        Ensure that the response is in clean JSON format without any markdown wrapping."""

        completion = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert in summarizing scripts and extracting important keywords from Korean conversations."},
                {"role": "user", "content": user_input}
            ]
        )
        chat_response = completion.choices[0].message.content
        
        # Parse the JSON response
        response_data = json.loads(chat_response)
        
        return json.dumps(response_data, ensure_ascii=False, indent=2)
    except json.JSONDecodeError as e:
        return json.dumps({"error": f"JSON 파싱 오류: {str(e)}", "raw_response": chat_response}, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"error": f"예외 발생: {str(e)}"}, ensure_ascii=False, indent=2)

async def classify_and_refine_sentence(query):
    try:
        openai_apikey = os.getenv('OPENAI_API_KEY')
        if not openai_apikey:
            print(Fore.RED + "Error: OPENAI_API_KEY environment variable not set." + Style.RESET_ALL)
            raise EnvironmentError("OPENAI_API_KEY environment variable not set.")
        client = AsyncOpenAI(api_key=openai_apikey)
        
        user_input = f"""Analyze the following Korean sentence: "{query}"
        1. Determine the sentiment (POSITIVE, NEUTRAL, or NEGATIVE).
        2. If the sentiment is NEGATIVE, provide a refined version of the text that:
           - Maintains the core message and intent
           - Uses more polite and respectful language
           - Expresses the message in a more constructive manner
        3. If the sentiment is not NEGATIVE, keep the original text unchanged.

        Respond in JSON format with the following keys:
        - sentiment: The overall sentiment (POSITIVE, NEUTRAL, or NEGATIVE)
        - transcription: The original text if not NEGATIVE, or the refined text if NEGATIVE

        Do not wrap the JSON response in any markdown formatting."""

        completion = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in analyzing sentiment and refining language in Korean sentences."},
                {"role": "user", "content": user_input}
            ]
        )
        chat_response = completion.choices[0].message.content

        # Parse the JSON response
        response_data = json.loads(chat_response)
        
        formatted_response = json.dumps(response_data, ensure_ascii=False, indent=2)
        
        return formatted_response
    except json.JSONDecodeError as e:
        return json.dumps({"error": f"JSON 파싱 오류: {str(e)}", "raw_response": chat_response}, ensure_ascii=False, indent=2)
    except Exception as e:
        return json.dumps({"error": f"예외 발생: {str(e)}"}, ensure_ascii=False, indent=2)