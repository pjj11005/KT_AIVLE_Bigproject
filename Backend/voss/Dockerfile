FROM python:3.12.2-slim-bullseye

WORKDIR /usr/src/voss

COPY serious-sublime-428908-r7-6260f0141ecc.json /app/google-tts-key.json

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/google-tts-key.json
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y netcat

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/voss/entrypoint.sh
RUN chmod +x /usr/src/voss/entrypoint.sh

COPY . .

ENTRYPOINT [ "/usr/src/voss/entrypoint.sh" ]


# CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "voss.asgi:application"]