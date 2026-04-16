# SmartStudent AI Portal

SmartStudent AI Portal, e-Okul benzeri bir okul yonetim sistemi olarak dusunulen, guvenlik ve katmanli mimari odakli bir MERN projesidir.

Bu repo su anda agirlikli olarak backend gelisimini icermektedir. Backend tarafinda authentication, role-based authorization, student CRUD, Redis cache ve Gemini destekli AI chatbot akisi bulunur. Frontend tarafi ise planlanmis durumdadir ve repo icinde su an notlar yer almaktadir.

## Proje Ne Yapiyor

Bu proje temel olarak 3 problemi cozuyor:

- kullanici kaydi ve girisi
- admin yetkisi ile ogrenci yonetimi
- egitsel AI destekli chatbot deneyimi

Kisa ozetle:

- kullanici register/login olabilir
- JWT ile kimlik dogrulamasi yapilir
- role kontrolu ile yetki ayrimi uygulanir
- admin, ogrenci kayitlarini yonetebilir
- ogrenci listesi Redis ile cache'lenir
- giris yapmis kullanici AI chatbot endpoint'ini kullanabilir

## Neden Bu Proje

Bu proje sadece ozellik eklemek icin degil, su kavramlari gercek proje akisi icinde ogrenmek icin gelistirilmektedir:

- katmanli mimari
- backend guvenligi
- JWT + RBAC mantigi
- validation ve hata yonetimi
- Redis cache / invalidation
- AI servis entegrasyonu
- Git branch disiplini

## Kullanilan Teknolojiler

### Backend

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- Redis
- Docker
- JWT
- bcryptjs
- Zod
- Google Gemini API (`@google/genai`)

### Frontend

- Planlanan stack: React + TypeScript + Tailwind CSS
- Bu repoda frontend uygulama kodu henuz bulunmuyor

## Bu Teknolojileri Nasil Kullandim

### TypeScript

Bu projede backend tamamen TypeScript ile yazilmistir.

TypeScript'i su amaclarla kullandim:

- request/response akislarini daha guvenli hale getirmek
- validation ile type mantigini birlikte dusunmek
- `req.user` gibi alanlarda Express type augmentation kullanmak
- gelistirme sirasinda tip hatalarini daha erken yakalamak

Projede TypeScript ozellikle su noktalarda fayda saglar:

- validation sonucu gelen verinin tipini service katmanina guvenli sekilde tasimak
- JWT'den gelen kullanici bilgisini `req.user` uzerinde kullanmak
- `string | undefined` gibi belirsiz alanlarda daha dikkatli kod yazmak

### Redis

Redis bu projede ana veri tabani olarak degil, cache katmani olarak kullanilmistir.

Su anda Redis'in rolu:

- `GET /api/v1/students` sonucunu cache'lemek
- ayni veriyi tekrar tekrar MongoDB'den cekmeyi azaltmak
- listeleme akislarini hizlandirmak

Cache mantigi:

- ilk istekte veri MongoDB'den gelir ve Redis'e yazilir
- sonraki isteklerde veri Redis'ten okunur
- `create`, `update`, `delete` sonrasi `students:all` cache'i silinir

Yani burada Redis'in amaci:

- dogrulugu degistirmek degil
- dogru veriye daha hizli erismek

### Docker

Docker bu projede lokal ortamda Redis'i ayağa kaldirmak icin kullanilmistir.

Repo kokundeki `docker-compose.yml` dosyasinda su servis vardir:

- `redis:7-alpine`

Bu tercih neden mantikli:

- hafif bir image oldugu icin lokal gelistirme icin uygundur
- Redis'i bilgisayara manuel kurmadan calistirmayi saglar
- ekipte ayni ortami tekrar uretmeyi kolaylastirir

Calisma sekli:

```bash
docker compose up -d
```

Bu komut Redis container'ini `6379` portunda arka planda baslatir.

## Mimari Yapi

Projede katmanli mimari korunur:

```text
Controller -> Service -> Model/Repository
```

Mantik su sekilde ayrilmistir:

- Controller: request alir, response doner
- Service: business logic burada bulunur
- Model/Repository: veri erisimi burada yer alir
- Validation: gelen verinin dogrulanmasi burada yapilir

Bu yaklasimla kod daha:

- okunabilir
- buyutulebilir
- test edilebilir
- hata ayiklamasi kolay

## Proje Yapisi

```text
smart-student-ai-portal/
|- backend/
|  |- src/
|  |  |- config/
|  |  |- middlewares/
|  |  |- modules/
|  |  |  |- student/
|  |  |  |- chatbot/
|  |  |- user/
|  |  |- utils/
|  |  |- types/
|- frontend/
|  |- learningsNotes-frontend.md
|- docker-compose.yml
|- README.md
```

## Backend Ozellikleri

### 1. Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

Yapilanlar:

- parola `bcryptjs` ile hashlenir
- login sonrasi JWT token uretilir
- `authMiddleware` ile token kontrol edilir

### 2. Authorization

- `authorizeRoles` middleware'i ile role kontrolu yapilir
- su an ornek olarak `admin` rolu korunmustur
- `GET /api/v1/auth/admin` route'u bu mantigi gosteren ornek endpoint'tir

### 3. Student CRUD

Tum student endpoint'leri:

- authentication ister
- admin yetkisi ister

Endpoint'ler:

- `POST /api/v1/students`
- `GET /api/v1/students`
- `GET /api/v1/students/:id`
- `PUT /api/v1/students/:id`
- `DELETE /api/v1/students/:id`

### 4. Redis Cache

Su anda cache uygulanan endpoint:

- `GET /api/v1/students`

Cache key:

- `students:all`

Invalidate edilen durumlar:

- student create
- student update
- student delete

### 5. AI Chatbot

Endpoint:

- `POST /api/v1/chatbot`

Ozellikler:

- authentication gerekir
- route bazli rate limit vardir
- Gemini `gemini-2.5-flash` modeli kullanilir
- service katmaninda sade bir educational instruction kullanilir
- dis AI servis hatalari icin `503` ayrimi yapilir

Ornek request:

```json
{
  "message": "Fotosentez nedir?"
}
```

Ornek response:

```json
{
  "success": true,
  "reply": "Fotosentez, bitkilerin isik enerjisini kullanarak besin urettigi surectir."
}
```

## Guvenlik Yaklasimi

Bu projede guvenlik en bastan dusunulmustur.

Uygulanan basliklar:

- `helmet`
- `cors`
- `express-rate-limit`
- JWT authentication
- role-based authorization
- `bcryptjs` ile password hashleme
- Zod validation
- API key'in sadece backend `.env` icinde tutulmasi
- veri minimizasyonu

Onemli not:

- TCKN gibi yuksek hassasiyetli resmi kimlik verileri bu asamada bilerek eklenmemistir
- bunun nedeni veri minimizasyonu ve erken asamada gereksiz hassas veri toplamamaktir

## API Endpoint Ozeti

### Health

- `GET /health`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/admin`

### Students

- `POST /api/v1/students`
- `GET /api/v1/students`
- `GET /api/v1/students/:id`
- `PUT /api/v1/students/:id`
- `DELETE /api/v1/students/:id`

### Chatbot

- `POST /api/v1/chatbot`

## Kurulum

### 1. Repoyu klonla

```bash
git clone <repo-url>
cd smart-student-ai-portal
```

### 2. Backend bagimliliklarini yukle

```bash
cd backend
npm install
```

### 3. Environment dosyasini hazirla

`backend/.env` dosyasi olustur:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Redis'i Docker ile baslat

Repo kokunde:

```bash
docker compose up -d
```

### 5. Backend'i calistir

```bash
cd backend
npm run dev
```

Varsayilan adres:

```text
http://localhost:5000
```

## Scriptler

`backend/package.json` icindeki temel scriptler:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
```

## Gelisim Durumu

Su anda aktif olarak tamamlanan kisimlar:

- backend TypeScript altyapisi
- auth sistemi
- JWT + RBAC
- student CRUD
- Redis cache
- Gemini chatbot entegrasyonu
- chatbot auth ve route bazli rate limit
- ogrenme notlari ve branch disiplinli gelisim akisi

Henuz tamamlanmayan kisimlar:

- frontend uygulama kodu
- otomatik test altyapisi
- deployment dokumantasyonu
- daha gelismis chatbot senaryolari

## Branch Akisi

Projede feature bazli branch mantigi kullanilmistir:

- `feat/01-infra-setup`
- `feat/02-03-auth-student-crud`
- `feat/04-redis-cache`
- `feat/05-ai-chatbot`

Bu yapi sayesinde her adim ayri bir gelisim hikayesi olarak takip edilebilir.

## Sonraki Adimlar

- frontend uygulama kodunun eklenmesi
- otomatik testlerin kurulmasi
- deployment notlarinin yazilmasi
- chatbot tarafinda sohbet gecmisi ve daha gelismis guvenlik adimlari

## Ozet

SmartStudent AI Portal, su anda guvenli backend temelleri atilmis, AI destekli, modul bazli gelistirilen bir okul yonetim sistemi altyapisidir.

Bu repo sadece calisan endpoint'lerden olusmaz; ayni zamanda:

- guvenlik dusuncesi
- veri minimizasyonu
- katmanli mimari
- cache mantigi
- AI entegrasyonu
- hata yonetimi

gibi gercek backend gelisim becerilerini gosteren bir ogrenci projesidir.
