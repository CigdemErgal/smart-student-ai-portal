# Observation Module Plan

## 1. Amac

Bu dokuman, SmartStudent projesinde yeni konumlandirilan okul ici ogrenci takip ve destek sistemi icin observation modulu kararlarini kaydetmek amaciyla hazirlandi.

Bu dosya:
- urun sinirlarini hatirlatir
- observation modulu icin ilk teknik dusunceyi toplar
- implementasyon sirasinda referans olur

## 2. Yeni Urun Kimligi

SmartStudent, okul personelinin ogrencilerle ilgili akademik, davranissal ve rehberlik sureclerini duzenli, yetki kontrollu ve kayit altinda yonetmesini saglayan okul ici ogrenci takip ve destek sistemidir.

### Birincil kullanicilar

- admin
- branch_teacher
- homeroom_teacher
- counselor

### Sistem disinda kalanlar

- ogrenciler sistem kullanicisi degildir
- veliler sistem kullanicisi degildir
- AI karar verici degildir
- sistem tani veya otomatik ceza sistemi degildir

## 3. Domain Siniri

### Cekirdek platform

- auth
- users / roles
- student-profile
- school-structure
- validation
- cache
- error handling
- AI integration adapter

### Hassas takip domaini

- observation
- timeline
- counseling
- red-flag
- ai-summary

Not:
- `observation` ile `counseling` ayri domain mantiginda kalmalidir
- `timeline` ilk MVP'de ayri veri modeli olmak zorunda degildir

## 4. Rol Mantigi

### admin

- sistem ve okul yapisi yonetimi yapar
- varsayilan olarak counselor private notes gormemelidir

### branch_teacher

- somut sinif ici observation girer
- counselor private notes goremez

### homeroom_teacher

- ogrencinin genel surec takibini yapar
- counselor private notes goremez

### counselor

- en genis observation gorunumune sahiptir
- private counseling notes tutar
- red-flag incelemesini yonetir

## 5. Observation MVP Kapsami

Ilk surumde hedef:
- observation create
- observation list
- single observation detail

Ilk surumde olmayacaklar:
- update
- delete
- medya upload
- risk score
- kalici etiketleme

## 6. Observation Kaydinin Tanimi

Observation:

Belirli bir tarihte, belirli bir ogrenci icin, belirli bir personelin girdigi somut okul ici gozlem kaydidir.

Temel ilke:
- yorum degil, gozlem yazilir

Yanlis ornek:
- "sorunlu ogrenci"

Dogru ornek:
- "ders boyunca 3 kez arkadasinin sozunu kesti"

## 7. Observation Alanlari

### Request body'den gelecek alanlar

- `studentId`
- `category`
- `observedAt`
- `summary`
- `details`

### Sistem tarafinda set edilecek alanlar

- `id`
- `recordedBy`
- `recordedByRole`
- `flagStatus`
- `createdAt`
- `updatedAt`

### Onerilen category enum

- `class_participation`
- `attendance_behavior`
- `peer_interaction`
- `emotional_signal`
- `rule_violation`
- `support_need`

### Onerilen flagStatus enum

- `normal`
- `needs_review`
- `reviewed`

## 8. Validation Kurallari

### Request validation

- `studentId` zorunlu
- `category` zorunlu ve enum icinde olmali
- `observedAt` zorunlu ve gecerli tarih olmali
- `summary` zorunlu
- `details` zorunlu

### Pratik sinirlar

- `summary`: min 5, max 120 karakter
- `details`: min 10, max 1000 karakter
- `observedAt`: gelecekte bir tarih olmamali

### Guvenlik mantigi

- `recordedBy` request body'den gelmez
- `recordedByRole` request body'den gelmez
- bu alanlar auth context'ten set edilir

## 9. Yetki Mantigi

### Temel ayrim

RBAC sunu sorar:
- bu rol genel olarak bu islemi yapabilir mi

Domain policy sunu sorar:
- bu spesifik kullanici, bu spesifik ogrenci uzerinde bu islemi yapabilir mi

### Observation create

Ilk MVP'de observation create yapabilecek roller:
- branch_teacher
- homeroom_teacher
- gerekirse counselor

Ek kural:
- branch_teacher her ogrenciye degil, bagli oldugu ogrenciler icin kayit girebilmelidir

### Observation read

- branch_teacher sinirli gorunum alir
- homeroom_teacher daha genis gorunum alir
- counselor en genis gorunumu alir
- counselor private notes observation modulu icinde tutulmaz

## 10. Hata Mantigi

- `400 Bad Request`: request formati veya alanlar hatali
- `401 Unauthorized`: token yok veya gecersiz
- `403 Forbidden`: rol veya domain policy yetkisi yok
- `404 Not Found`: ogrenci veya observation bulunamadi
- `500 Internal Server Error`: beklenmeyen sunucu hatasi

## 11. Endpoint MVP

- `POST /api/v1/observations`
- `GET /api/v1/students/:id/observations`
- `GET /api/v1/observations/:id`

Ilk MVP disinda:
- `PUT /api/v1/observations/:id`
- `DELETE /api/v1/observations/:id`

## 12. Klasor Yapisi

Observation modulu `src/modules` altinda feature bazli yapida ilerleyecek.

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

### controller

- request alir
- auth bilgisini service'e tasir
- response doner

### service

- business logic
- ogrenci var mi kontrolu
- domain policy kontrolu
- red-flag tetik mantigi

### repository

- veri erisim katmani
- create ve read sorgulari

### model

- mongoose schema
- enum alanlari
- timestamps

### validation

- request body yapisini kontrol eder

## 13.1 Su Ana Kadar Yazdigimiz Dosyalar Ne Ise Yarar

Bu bolum tekrar ederken hizli hatirlatma icin yazildi.

### `observation.types.ts`

Bu dosya observation modulunun ortak dilidir.

Icine sunlari koyduk:
- `ObservationCategory`
- `ObservationFlagStatus`
- `CreateObservationInput`
- `ObservationRecord`

Kisa mantik:
- `ObservationCategory`: observation turlerini sabit bir listeye baglar
- `ObservationFlagStatus`: kayit normal mi, inceleme gerekiyor mu bilgisini tutar
- `CreateObservationInput`: create isteginde hangi alanlarin beklendigini anlatir
- `ObservationRecord`: observation kaydinin tam halini anlatir

Neden once bunu yazdik:
- validation hangi alanlari kontrol edecegini bilir
- model hangi alanlari tasiyacagini bilir
- service hangi input ile calisacagini bilir

### `observation.validation.ts`

Bu dosya gelen istegin sekil olarak dogru olup olmadigini kontrol eder.

Icine sunlari koyduk:
- `createObservationSchema`
- `CreateObservationBody`

Kisa mantik:
- `studentId` bos mu
- `category` dogru enum mu
- `observedAt` tarih mi
- `summary` yeterince uzun mu
- `details` yeterince uzun mu

Onemli not:
- validation is kurali kontrolu degildir
- validation sadece gelen verinin yapisini kontrol eder
- "bu ogretmen bu ogrenci icin kayit girebilir mi" sorusu service katmaninda cozulur

### `observation.model.ts`

Bu dosya observation kaydinin veritabaninda nasil tutulacagini tanimlar.

Icine sunlari koyduk:
- `IObservation`
- `observationSchema`
- `Observation` mongoose modeli

Alan mantigi:
- `studentId`: observation hangi ogrenciye ait
- `category`: gozlemin turu
- `observedAt`: olay ne zaman oldu
- `summary`: kisa ozet
- `details`: detayli gozlem
- `recordedBy`: kaydi kim girdi
- `recordedByRole`: kaydi giren kisinin rolu
- `flagStatus`: kayit review gerektiriyor mu

Onemli fark:
- `observedAt` olay zamani
- `createdAt` kaydin sisteme yazildigi zaman

### `observation.repository.ts`

Bu dosya veritabaniyla konusan katmandir.

Su fonksiyonlari yazdik:
- `createObservation`
- `getObservationsByStudentId`
- `getObservationById`

Kisa mantik:
- repository veri ceker veya kaydeder
- business karar vermez
- yetki kontrolu yapmaz

Yani:
- "kaydi olustur" der
- "bu ogrencinin kayitlarini getir" der
- "bu observation kaydini getir" der

### `observation.service.ts`

Bu dosya controller ile repository arasindaki dusunen katmandir.

Bu dosyada yapilacaklar:
- ogrenci var mi kontrol etmek
- create/list/detail akislarini yonetmek
- ileride domain policy kontrolu eklemek
- gerekirse red-flag mantigini tetiklemek

Kisa mantik:
- validation = veri dogru mu
- repository = veri kaydet / getir
- service = is kurali dogru mu

## 14. Uygulama Sirasi

1. `types`
2. `validation`
3. `model`
4. `repository`
5. `service`
6. `controller`
7. `routes`
8. `app.ts` baglantisi

## 14.1 Branch Onerisi

Bu modul icin ayri bir feature branch kullanilmasi onerilir.

Onerilen branch adi:

- `feature/observation-module`

Amac:
- yeni domaini mevcut kodlari dagitmadan gelistirmek
- observation modulu tamamlanana kadar degisiklikleri kontrollu tutmak

### Simdi acilacak branch

- `feature/observation-module`

### Yol haritasinda isimleri belirlenmis ama daha sonra acilacak branchler

- `feature/timeline-module`
- `feature/counseling-module`
- `feature/red-flag-module`
- `feature/ai-summary-module`
- `feature/school-structure-module`
- `feature/audit-log-module`

Not:
- tum branchleri bastan acmak zorunlu degildir
- en saglikli yaklasim, sadece aktif olarak gelistirilecek branch'i acmaktir
- diger branch adlari roadmap ve planlama amaciyla simdiden belirlenmistir

## 14.2 Iki Gunluk Calisma Plani

Bu plan ilk MVP observation modulu icindir.

### Gun 1

Hedef:
- veri sozlesmesini ve temel veri katmanini kurmak

Adimlar:

1. feature branch ac
2. `observation.types.ts` icinde enum ve type'lari tanimla
3. `observation.validation.ts` icinde create request validation kur
4. `observation.model.ts` icinde mongoose schema'yi yaz
5. `observation.repository.ts` icinde create ve read sorgularini hazirla
6. category ve flag enum isimlerini tekrar kontrol et
7. student iliskisi icin `studentId` alaninin modelde dogru tanimlandigini kontrol et
8. gun sonunda dosya isimleri ve klasor yapisini tekrar gozden gecir

Gun 1 sonunda beklenen durum:
- observation tipi belli
- validation belli
- model belli
- repository iskeleti hazir

### Gun 2

Hedef:
- business logic, endpoint akisi ve uygulama entegrasyonunu tamamlamak

Adimlar:

1. `observation.service.ts` icinde create/list/detail akisini kur
2. service katmaninda ogrenci var mi kontrolu ekle
3. service katmaninda role + domain policy mantigini basit MVP seviyesinde uygula
4. `observation.controller.ts` icinde create/list/detail controller'larini yaz
5. `observation.routes.ts` icinde endpointleri bagla
6. `app.ts` icine observation route'unu ekle
7. Postman ile create endpoint test et
8. Postman ile student observation list endpointini test et
9. Postman ile single observation detail endpointini test et
10. hata kodlarini gozden gecir: `400`, `401`, `403`, `404`, `500`
11. naming, import ve response yapisini temizle

Gun 2 sonunda beklenen durum:
- observation modulu temel olarak calisiyor
- route uygulamaya baglanmis
- ilk manuel testler gecmis

### Tampon Gun Onerisi

Zorunlu degil ama cok faydali olur.

Bu gunde sunlari yapabilirsin:

1. bug fix
2. error message temizligi
3. notes guncelleme
4. README veya teknik dokuman guncelleme
5. entegrasyon sirasinda gereken kucuk eski kod duzeltmeleri

## 14.3 Net Yapilacaklar Listesi

Observation modulu icin su anda net backlog:

1. `feature/observation-module` branch'ini ac
2. `observation.types.ts` dosyasini doldur
3. `observation.validation.ts` dosyasini doldur
4. `observation.model.ts` dosyasini doldur
5. `observation.repository.ts` dosyasini doldur
6. `observation.service.ts` dosyasini doldur
7. `observation.controller.ts` dosyasini doldur
8. `observation.routes.ts` dosyasini doldur
9. `app.ts` icine route baglantisini ekle
10. create observation endpointini test et
11. list observation endpointini test et
12. single observation detail endpointini test et
13. gereken eski kod entegrasyonlarini kontrollu sekilde yap
14. notlari ve dokumani guncelle

## 14.4 Eski Kodlara Ne Zaman Dokunulacak

Temel ilke:

- once observation modulu kendi icinde yazilacak
- sonra mevcut sistemle temas noktalari duzenlenecek

Observation tamamlanmadan eski kodlarda buyuk daginik duzenleme yapilmayacak.

Observation sonrasi dokunulabilecek yerler:

- `app.ts` route baglantisi
- role mantiginda yeni roller veya rol genisletmeleri
- auth tarafinda gerekirse rol destekleri
- student modulu ile observation iliskisi
- README ve teknik dokumanlar

Bu yaklasim daha guvenlidir cunku:
- once yeni modul kendi siniriyla kurulur
- sonra kontrollu entegrasyon yapilir
- mevcut calisan kodlar gereksiz yere erken bozulmaz

## 15. AI Siniri

AI bu domain icinde sadece destekleyici rolde kullanilmalidir.

AI sunlari yapabilir:
- observation kayitlarini ozetlemek
- timeline ozetlemek
- counselor icin yardimci metin uretmek

AI sunlari yapmamalidir:
- tani koymak
- risk puani vermek
- ogrenciyi etiketlemek
- ceza veya kritik karar onermek

## 16. Ilk Surumde Eklenmeyecek Hassas Alanlar

- TCKN
- resmi kimlik verileri
- klinik tani verisi
- medya upload
- kalici risk skoru
- kalici ogrenci etiketi
- asiri detayli aile ici hassas veri
