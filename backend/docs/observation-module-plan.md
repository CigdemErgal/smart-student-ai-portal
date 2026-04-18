# Observation Module Plan

## 1. Bu Dokuman Ne Icin Var

Bu dokuman, SmartStudent projesinde observation modulunu neden baslattigimizi, hangi teknik kararleri aldigimizi, uygulamada neleri yaptigimizi ve bugun hangi noktada oldugumuzu sade bir ders notu mantigiyla anlatmak icin hazirlandi.

Bu dosyanin amaci:

- urun yonunu unutmamak
- observation modulunun sinirlarini net tutmak
- implementasyon sirasini kaydetmek
- tamamlanan isleri ve kalanlari karistirmadan gormek
- sonraki modullere gecerken temiz bir referans birakmak

## 2. Projenin Yeni Yonelimi

Proje artik ogrencilerin kullandigi bir portal degil.

Yeni urun kimligi:

- okul ici ogrenci takip ve destek sistemi
- ana kullanim amaci: okul personelinin ogrencilerle ilgili surecleri duzenli ve yetki kontrollu sekilde takip etmesi

Bu yeni yonelimle birlikte temel kabul:

- ogrenciler sistem kullanicisi degildir
- veliler sistem kullanicisi degildir
- ogrenciler veri varligidir
- sistem tani koymaz
- sistem otomatik ceza mekanizmasi degildir
- AI karar verici degil, yardimci ozetleyici roldedir

## 3. Backend ve Mimari Baglam

Projede observation modulu su teknik zemin uzerine kuruldu:

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Redis
- Docker

Mimari yaklasim:

- `Controller -> Service -> Model/Repository`

Bu mimaride:

- controller request ve response ile ilgilenir
- service is kurallarini yonetir
- repository veri erisimini yapar
- model veritabanindaki yapinin tanimini tutar

Observation modulu bu mevcut mimariyi bozmadan eklendi.

## 4. Observation Modulu Neden Ilk Secildi

Yeni urun kimligine gecerken hassas takip alanlari arasinda ilk adim olarak observation secildi.

Bunun nedeni:

- observation, ogrenci takip sisteminin en temel veri giris noktalarindan biridir
- timeline, counseling ve red-flag gibi alanlar ileride observation verisinden beslenecektir
- observation, behavior ve support takibini baslatan cekirdek kayittir

Kisa fikir:

- once observation
- sonra observation uzerinden okuma ve baglama yapan moduller

## 5. Observation Nedir

Observation, belirli bir ogrenci icin, belirli bir tarihte, belirli bir okul personeli tarafindan sisteme girilen somut okul ici gozlem kaydidir.

Temel ilke:

- yorum degil gozlem yazilir

Yanlis ornek:

- "sorunlu ogrenci"

Dogru ornek:

- "ders boyunca 3 kez arkadasinin sozunu kesti"

Bu ilke secildi cunku sistemin amaci ogrenciyi etiketlemek degil, gozlenebilir durumu kayit altina almaktir.

## 6. Observation Domain Siniri

Observation modulu icin baslangicta su sinirlar cizildi:

Observation icinde olacaklar:

- observation create
- observation list
- single observation detail

Observation ilk MVP icinde olmayacaklar:

- update
- delete
- medya upload
- risk score
- kalici etiketleme

Bu sinir sayesinde ilk surum kucuk tutuldu ve gereksiz complexity ertelendi.

## 7. Observation Ile Ilgili Temel Domain Kararlari

### 7.1 Ana kullanicilar

Urun dusuncesinde observation ile ilgilenecek roller:

- admin
- branch_teacher
- homeroom_teacher
- counselor

Fakat kod tabaninin mevcut gercek durumu farkliydi.

Kodda bulunan aktif roller:

- `admin`
- `teacher`
- `student`

Bu nedenle observation icin gecici teknik karar su oldu:

- observation endpointleri su an sadece `admin` ve `teacher` rollerine acik olacak
- `student` observation endpointlerini kullanamayacak
- daha ince rol ayrimi daha sonra ayri bir rol refactor'u ile ele alinacak

### 7.2 Observation ile counseling ayri kalacak

Observation:

- okul ici somut gozlem

Counseling:

- daha hassas ve daha farkli bir domain

Bu ayrim bilincli olarak korundu. Observation icinde counselor private notes tutulmayacak.

### 7.3 Timeline ayri domain ama ilk MVP'de ayri model olmak zorunda degil

Observation sonrasinda timeline modulunun gelmesi daha mantikli goruldu.

Sebep:

- timeline, observation verisini zaman ekseninde bir araya getiren okuma odakli bir katman olabilir
- counseling kadar hassas degildir
- observation altyapisinin uzerine daha kolay oturur

## 8. Observation Veri Tasarimi

### 8.1 Request body ile gelen alanlar

- `studentId`
- `category`
- `observedAt`
- `summary`
- `details`

### 8.2 Sistem tarafinda set edilen alanlar

- `id`
- `recordedBy`
- `recordedByRole`
- `flagStatus`
- `createdAt`
- `updatedAt`

### 8.3 Category enum karari

- `class_participation`
- `attendance_behavior`
- `peer_interaction`
- `emotional_signal`
- `rule_violation`
- `support_need`

### 8.4 Flag status enum karari

- `normal`
- `needs_review`
- `reviewed`

## 9. Validation Kurallari

Observation create request'i icin temel validation kurallari:

- `studentId` zorunlu
- `category` zorunlu ve enum icinde olmali
- `observedAt` zorunlu ve gecerli tarih olmali
- `summary` zorunlu
- `details` zorunlu

Pratik sinirlar:

- `summary`: min 5, max 120 karakter
- `details`: min 10, max 1000 karakter
- `observedAt`: gelecekte bir tarih olmamali

Guvenlik kurali:

- `recordedBy` request body'den gelmez
- `recordedByRole` request body'den gelmez
- bu alanlar auth context'ten set edilir

## 10. Hata ve Yetki Mantigi

### 10.1 Hata kodu beklentisi

- `400 Bad Request`: request formati veya alanlar hatali
- `401 Unauthorized`: token yok veya gecersiz
- `403 Forbidden`: rol yetkisi yok
- `404 Not Found`: ogrenci veya observation bulunamadi
- `500 Internal Server Error`: beklenmeyen sunucu hatasi

### 10.2 RBAC ve domain policy farki

RBAC su soruyu sorar:

- bu rol bu endpointi genel olarak kullanabilir mi

Domain policy su soruyu sorar:

- bu spesifik kullanici bu spesifik ogrenci uzerinde islem yapabilir mi

Observation MVP'de once minimum RBAC kapisi eklendi.
Daha ileri domain policy sonraya birakildi.

## 11. Observation Endpoint Kararlari

Observation MVP endpointleri:

- `POST /api/v1/observations`
- `GET /api/v1/observations/student/:id`
- `GET /api/v1/observations/:id`

Bilerek MVP disinda birakilan endpointler:

- `PUT /api/v1/observations/:id`
- `DELETE /api/v1/observations/:id`

Not:

- ilk planda list endpointi `GET /api/v1/students/:id/observations` diye dusunuldu
- uygulama icinde daha tutarli bir observation route yapisi icin final karar `GET /api/v1/observations/student/:id` oldu

## 12. Klasor Yapisi

Observation modulu `src/modules` altinda feature bazli yapida kuruldu.

```text
backend/src/modules/observation/
  controllers/
    observation.controller.ts
  models/
    observation.model.ts
  repositories/
    observation.repository.ts
  routes/
    observation.routes.ts
  services/
    observation.service.ts
  types/
    observation.types.ts
  validations/
    observation.validation.ts
```

## 13. Katman Sorumluluklari

### Controller

- request alir
- auth bilgisini service'e tasir
- response doner
- hata durumlarini uygun status code ile cevaba cevirir

### Service

- business logic tasir
- ogrenci var mi kontrol eder
- observation var mi kontrol eder
- create, list ve detail akislarini yonetir
- ileride domain policy kurallarinin eklenecegi katmandir

### Repository

- veri erisim katmanidir
- create ve read sorgularini yapar
- business karar vermez
- yetki kontrolu yapmaz

### Model

- mongoose schema'yi tanimlar
- enum alanlarini tutar
- timestamps yapisini tanimlar

### Validation

- request body'sinin seklini kontrol eder
- is kurali kontrolu yapmaz

## 14. Dosya Bazli Ne Yazildi

### `observation.types.ts`

Bu dosya observation modulunun ortak veri dilini tanimlamak icin yazildi.

Icindeki ana yapilar:

- `ObservationCategory`
- `ObservationFlagStatus`
- `CreateObservationInput`
- `ObservationRecord`

Neden onemli:

- validation neyi kontrol edecegini bilir
- model hangi alanlari tutacagini bilir
- service hangi input ile calisacagini bilir

### `observation.validation.ts`

Bu dosya create request'ini dogrulamak icin yazildi.

Ana gorevleri:

- `studentId` var mi
- `category` dogru mu
- `observedAt` tarih mi
- `summary` ve `details` sinirlara uyuyor mu

### `observation.model.ts`

Bu dosya observation kaydinin veritabaninda nasil tutulacagini tanimlamak icin yazildi.

Onemli alanlar:

- `studentId`
- `category`
- `observedAt`
- `summary`
- `details`
- `recordedBy`
- `recordedByRole`
- `flagStatus`

### `observation.repository.ts`

Bu dosya observation verisiyle konusan veri katmanidir.

Yazilan temel fonksiyonlar:

- `createObservation`
- `getObservationsByStudentId`
- `getObservationById`

### `observation.service.ts`

Bu dosya observation modulunun dusunen katmanidir.

Son durumda service tarafinda su mantiklar vardir:

- create oncesi ogrenci var mi kontrolu
- list oncesi ogrenci var mi kontrolu
- detail icin observation var mi kontrolu
- create sirasinda `recordedBy` ve `recordedByRole` set edilmesi

### `observation.controller.ts`

Bu dosya request ve response akisini yonetir.

Son durumda controller:

- create/list/detail endpointlerini calistirir
- service'ten gelen "not found" durumlarini uygun response'a cevirir

### `observation.routes.ts`

Bu dosya endpointleri uygulamaya baglar.

Son durumda route'larda:

- `authMiddleware` var
- minimum `authorizeRoles("admin", "teacher")` korumasi var

## 15. Uygulama Sirasinda Izlenen Yol

Observation modulu rastgele degil, kontrollu bir sira ile gelistirildi:

1. `types`
2. `validation`
3. `model`
4. `repository`
5. `service`
6. `controller`
7. `routes`
8. `app.ts` entegrasyonu
9. create testi
10. list testi
11. detail testi
12. hardening

Bu siralama secildi cunku:

- once veri sozlesmesi netlesti
- sonra veri yapisi kuruldu
- sonra is akisi baglandi
- en sonda manuel test ve sertlestirme yapildi

## 16. Uygulamada Neler Yapildi

Observation modulu icin tamamlananlar:

- observation klasor yapisi kuruldu
- `types`, `validation`, `model`, `repository`, `service`, `controller`, `routes` dosyalari yazildi
- `app.ts` icine observation route baglantisi eklendi
- create observation akisi yazildi
- `recordedBy` ve `recordedByRole` service tarafinda set edildi
- auth middleware observation route'larina baglandi
- token payload ile user uyumu duzeltildi
- TypeScript build temiz gecti
- `POST /api/v1/observations` endpointi manuel olarak test edildi
- `GET /api/v1/observations/student/:id` endpointi manuel olarak test edildi
- `GET /api/v1/observations/:id` endpointi manuel olarak test edildi
- service katmanina `student exists` kontrolu eklendi
- olmayan ogrenci durumlari icin `404` davranisi netlestirildi
- olmayan observation durumu icin `404` davranisi eklendi
- observation route'larina minimum role guard eklendi
- observation endpointleri gecici olarak sadece `admin` ve `teacher` rollerine acildi
- branch uzerinde temiz commit ve push alindi

## 17. Observation Modulu Bugun Hangi Durumda

Observation modulu icin bugun dogru durum ifadesi:

- `backend MVP complete`
- `manual testing complete for core happy paths`
- `basic hardening complete`

Bu ne demek:

- create calisiyor
- list calisiyor
- detail calisiyor
- temel not found davranislari var
- minimum rol korumasi var

Bu ne demek degil:

- tum ileri seviye policy kurallari tamamlandi
- tum response standardizasyonu bitti
- rol refactor'u yapildi

## 18. Observation Icinde Bilerek Sonraya Birakilanlar

Bu maddeler observation'in temel MVP'sini kapatmak icin zorunlu gorulmedi:

- `branch_teacher`, `homeroom_teacher`, `counselor` ayrimini koda tasimak
- daha ince domain policy
- response standardizasyonunu daha da guclendirmek
- update ve delete endpointleri
- media upload
- red-flag otomasyonu
- AI summary entegrasyonu

Bu kararlar bilincli olarak ertelendi; cunku observation'in temel create/list/detail omurgasi once tamamlanmak istendi.

## 19. Branch Disiplini

Observation modulu icin kullanilan branch:

- `feature/observation-module`

Bu branch icin uygulanan ilke:

- observation bitmeden branch degistirme
- yeni modula observation kapanmadan gecme
- once temiz checkpoint al
- sonra yeni branch ac

Observation son durum:

- bu branch icinde observation icin MVP + temel hardening tamamlandi

## 20. Sonraki Modul Karari

Observation sonrasinda bir sonraki mantikli modul olarak `timeline` onerildi.

Gerekceler:

- timeline observation verisinin uzerine daha dogal oturur
- counseling'e gore daha az hassaslik ve policy karmasasi vardir
- ilk MVP'de ayri veri modeli zorunlu olmayabilir
- read odakli bir modul olarak daha dusuk riskle baslanabilir

Onerilen sonraki branch:

- `feature/timeline-module`

## 21. Rol Sistemi Icinde Bilincli Gecici Karar

Urun dusuncesi ile mevcut kod tabani arasinda bir gecis durumu vardir.

Urun tarafinda hedef roller:

- admin
- branch_teacher
- homeroom_teacher
- counselor

Kod tabaninda aktif roller:

- admin
- teacher
- student

Bu yuzden observation icin gecici teknik karar su oldu:

- observation endpointleri `admin` ve `teacher` ile korunacak
- `student` observation kullanicisi olmayacak

Bu gecici karar dogrudur cunku:

- urun kimligine daha yakindir
- mevcut kodla uyumludur
- buyuk rol refactor'unu observation branch'ine yuklemez

## 22. AI Siniri

AI observation domaininde sadece destekleyici rolde dusunulmelidir.

AI'nin yapabilecekleri:

- observation kayitlarini ozetlemek
- timeline ozetlemek
- personel icin yardimci metin uretmek

AI'nin yapmamasi gerekenler:

- tani koymak
- risk puani vermek
- ogrenciyi etiketlemek
- ceza veya kritik karar onermek

## 23. Ilk Surumde Bilerek Tutulmayan Hassas Alanlar

- TCKN
- resmi kimlik verileri
- klinik tani verisi
- medya upload
- kalici risk skoru
- kalici ogrenci etiketi
- asiri detayli aile ici hassas veri

Bu sinir urun guvenligi ve etik cizgiyi korumak icin bilincli olarak cizildi.

## 24. Tek Cumlelik Ozet

Observation modulu, okul personelinin ogrenciyle ilgili somut gozlemlerini kaydetmesi icin tasarlandi; create, list ve detail akislari tamamlandi, temel hardening yapildi ve sonraki mantikli adim olarak timeline modulune gecilmesi planlandi.

## 25. Dokumantasyon ve Mentor Notu

Bu dosya, proje icindeki en onemli referans dokumanlardan biri olarak korunacaktir.

Bu dosya ile ilgili calisma ilkesi:

- observation modulu ile ilgili nedenler burada kalacak
- ne istendi, ne yazildi ve neden o sekilde yazildigi bu dokumanda izlenebilir olacak
- observation ile ilgili yeni kararlar geldikce bu dokuman guncellenecek
- geri donup bakildiginda sadece kod degil, karar mantigi da okunabilecek

Proje genelinde mentor modunda ilerleme ve dokumantasyon disiplini icin ek referans:

- `backend/docs/mentor-mode-working-agreement.md`
