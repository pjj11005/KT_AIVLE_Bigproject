## Docker 실행

### 1. 빌드 및 실행

#### Docker 이미지 빌드

docker-compose build

#### Docker 컨테이너를 실행합니다.

docker-compose up

#### Docker 이미지를 빌드하고 시작

docker-compose up build

### 2. 백그라운드에서 실행

#### 백그라운드에서 Docker 컨테이너를 실행

docker-compose up -d

### 3. 컨테이너 중지 및 제거

#### 컨테이너를 중지시킴

docker-compose stop

#### docker컨테이너를 중지하고 모든 컨테이너를 제거

docker-compose down

## Django 명령어 실행

### 1. 마이그레이션 생성
   docker-compose exec web python manage.py makemigrations
### 2. 마이그레이션 적용
   docker-compose exec web python manage.py migrate
### 3. Django관리자 사용자 생성
   docker-compose exec web python manage.py createsuperuser
### 4. Django shell 접속
   compose exec web python manage.py shell
