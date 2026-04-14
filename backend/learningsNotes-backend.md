# Backend Learning Notes

## Proje

- Proje: SmartStudent AI Portal
- Katmanli Mimari: Controller -> Service -> Model
- Odak: OWASP Top 10, Docker, Redis, TypeScript

## Gunluk Kayit

### Gun 1 - Altyapi ve Docker

- Bugun ne yaptim:
  - `npm init -y` ile backend projesini baslattim.
  - `package.json` icinde `dev`, `build`, `start`, `lint`, `format` script yapisini kurdum.
  - MongoDB + Redis + guvenlik odakli runtime paketlerini kurdum.
  - TypeScript, ts-node-dev, ESLint, Prettier ve gerekli type paketlerini devDependencies olarak kurdum.
  - `dev` script hedefini `src/server.ts` olarak duzelttim.
  - `src` klasorunu acip `app.ts` ve `server.ts` dosyalarini olusturdum.
  - `tsconfig.json` dosyasini backend yapisina gore duzenledim (`rootDir`, `outDir`, `include`, `exclude`).
  - `npm run build` komutunu backend klasorunde basariyla calistirdim.
  - `app.ts` icine temel guvenlik middlewarelerini ekledim (`helmet`, `cors`, `morgan`, `express.json`).
  - Global rate limiter ekleyip tum API istekleri icin sinirlama uyguladim.
  - Katmanli mimari klasorlerini terminalden tek komutla olusturdum.
- Neden boyle yaptim:
  - Iskeleti once kurup sonra paketleri eklemek, hatayi nerede yaptigimi daha kolay bulmam icin.
- Kullandigim paketler ve amaclari:
  - `express`: API sunucusu.
  - `mongoose`: MongoDB model/veri erisim katmani.
  - `dotenv`: ortam degiskenleri yonetimi.
  - `cors`: frontend-backend erisim kontrolu.
  - `helmet`: temel HTTP guvenlik basliklari.
  - `express-rate-limit`: brute-force ve abuse korumasi.
  - `zod`: girdi dogrulama.
  - `bcryptjs`: parola hashleme.
  - `jsonwebtoken`: JWT tabanli kimlik dogrulama.
  - `redis`: cache ve hizlandirma.
  - `morgan`: HTTP istek loglama.
  - `typescript`: TS derleme altyapisi.
  - `ts-node-dev`: gelistirme sirasinda otomatik yeniden baslatma.
  - `eslint` + `@typescript-eslint/*`: kod kalite kurallari.
  - `prettier` + `eslint-config-prettier`: kod bicimlendirme standardi.
  - `@types/*`: TypeScript tip destegi.
- Karsilastigim hata:
  - `package.json` icinde iki adet `scripts` anahtari olustugu icin duplicate key hatasi.
  - `npm run build` komutunu kok dizinde calistirinca `package.json` bulunamadi hatasi.
  - `tsconfig.json` icinde `include/exclude` yanlis yerde oldugu icin TS5023 hatasi.
  - `TS2459`: `./app` modulu `app` degiskenini export etmiyor hatasi.
- Hatayi nasil cozdum:
  - Tek `scripts` blogu birakarak JSON yapisini duzelttim.
  - Komutu dogru dizinde (`backend`) calistirdim.
  - `include/exclude` alanlarini `compilerOptions` disina tasidim.
  - `app.ts` icinde `export default app` kullanip `server.ts` icinde `import app from './app'` ile eslestirdim.
  - Duzeltme sonrasi `npm run build` basariyla gecti.
- Ogrendigim en onemli seyler:
  - Scriptler, gelistirme ve production akisinin temelidir.
  - Runtime ve dev dependency ayrimi kritiktir.
  - Guvenlik paketleri Day 1'de eklenirse sonraki adimlar daha saglam olur.
  - Middleware sirasi dogru olmazsa beklenmeyen davranis olusabilir.
  - Uzun klasor yapilarini terminalde tek komutla olusturmak zaman kazandirir.

#### Pratik Terminal Komutu

- Backend `src` altinda klasorleri tek komutla olusturmak icin:
  - `New-Item -ItemType Directory -Force -Path backend/src/controllers,backend/src/services,backend/src/models,backend/src/routes,backend/src/middlewares,backend/src/validation,backend/src/utils,backend/src/interfaces,backend/src/constants`

### Gun 2 - Auth ve Guvenlik

- Bugun ne yaptim:
  - `backend/src/user` altinda domain bazli auth klasorlerini actim:
    - `model`
    - `repository`
    - `service`
    - `controller`
    - `validation`
    - `routes`
  - `User` modelini yazdim.
  - `registerSchema` ve `loginSchema` ile validation yapisini kurdum.
  - `registerUser` service'i ile email tekrar kontrolu yaptim.
  - `bcryptjs` ile register sirasinda password hashleme ekledim.
  - `loginUser` service'i icinde `bcrypt.compare()` ile parola dogrulama kurdum.
  - `registerController` ve `loginController` yazdim.
  - `auth.routes.ts` icinde `POST /register` ve `POST /login` route'larini tanimladim.
  - `app.ts` icinde auth route'unu `/api/v1/auth` altina bagladim.
  - `safeUser` mantigi ile response icinden `password` alanini cikardim.
  - `authMiddleware` ile token kontrolu ekledim.
  - Express `Request` tipini genisletip `req.user` problemini cozdum.
  - `authorizeRoles` middleware'i ile role tabanli yetkilendirme baslangicini ekledim.
  - `GET /api/v1/auth/admin` ornek korumali route'unu olusturdum.
- JWT ve role tabanli yetki notlari:
  - `role` alanini en bastan modele koymak dogru, cunku yetkilendirme daha sonra bu alan uzerinden kurulacak.
  - Role kontrol middleware'ini hemen yazmiyoruz; once register/login temel akisinin calismasi gerekiyor.
  - JWT daha sonra login sonrasi kimlik bilgisini tasimak icin eklenecek.
- OWASP ile ilgili uyguladigim maddeler:
  - Hassas veri minimizasyonu: `tckn` gibi hassas alanlari ilk auth modeline hemen eklemiyorum.
  - Password guvenligi: parola modelde alan olarak var ama asla duz metin saklanmiyor; `bcrypt` ile hashleniyor.
  - Input validation: auth istekleri icin ayri validation katmani kullaniyorum.
  - Response minimizasyonu: login/register response'unda `password` alanini istemciye donmuyorum.
  - Least privilege mantigi: role tabanli yetkiyi kontrollu sekilde daha sonra ekleyecegim.
  - Authentication ve authorization ayrimini middleware seviyesinde baslattim.
- Karsilastigim hatalar:
  - Dosya isimlendirmesinde standart farki oldu.
  - Gereksiz import ekleme hatasi yaptim.
  - Controller icinde `try/catch` kayboldugu an oldu.
  - Route mount sirasinda middleware once gelmesi gerektigini tekrar ettim.
  - `req.user` ifadesinde TypeScript hatasi aldim, cunku varsayilan Express `Request` tipinde `user` alani yoktu.
- Cozum:
  - Type/interface isimlerinde PascalCase kullanmayi not ettim.
  - Gereksiz importlari kontrol etmeyi aliskanlik yapmaliyim.
  - Once middleware, sonra route mantigini netlestirdim.
  - Once sade ve calisan auth yapisi, sonra guvenlik sertlestirmesi mantigi ile ilerliyorum.
  - `src/types/express/index.d.ts` ile `Request` tipini genislettim.

#### Gun 2 Kavram Notlari

- `timestamps: true`
  - Mongoose bu ayar ile `createdAt` ve `updatedAt` alanlarini otomatik ekler.
  - Kaydin ne zaman olusturuldugunu ve ne zaman guncellendigini takip etmemi saglar.
- `isActive`
  - Kullanici hesabinin aktif mi pasif mi oldugunu tutar.
  - Kullaniciyi tamamen silmeden devre disi birakmak icin kullanilabilir.
- `default: true`
  - Bu alan kullanici olusturulurken verilmezse Mongoose otomatik olarak `true` atar.
- `IUser`
  - TypeScript interface'idir.
  - `User` nesnesinde hangi alanlarin ve hangi tiplerin oldugunu tanimlar.
- `createdAt: Date`
  - Bu alanin veri tipi tarih-zamandir.
  - String veya boolean degil, zaman bilgisini temsil eder.
- `import mongoose, { Schema, Document } from "mongoose"`
  - `mongoose`: model olusturmak icin.
  - `Schema`: alan yapisini tanimlamak icin.
  - `Document`: TypeScript tarafinda Mongoose document tipini temsil etmek icin.
- `endpoint`
  - Backend'de disaridan istek atilan adrestir.
  - Ornek: `POST /api/v1/auth/register`
  - Formul: ana yol + route dosyasindaki alt yol
- `bcrypt.hash(password, 10)`
  - Parolayi guvenli saklama formatina cevirir.
  - `10`, hashleme zorluk seviyesidir.
- `bcrypt.compare(duzParola, hashliParola)`
  - Login sirasinda kullanicinin girdigi parola ile veritabanindaki hash'i karsilastirir.
- `z.infer<typeof schema>`
  - Zod schema'sindan TypeScript tipi uretir.
  - Boylece validation ve type ayni kaynaktan gelir.
- `LoginInput` / `RegisterInput`
  - Validation schema'larindan uretilen TypeScript tipleridir.
  - Service katmanina giden verinin seklini netlestirir.
- `safeUser`
  - Response'ta sadece gerekli alanlari dondurmek icin olusturulan guvenli objedir.
  - `password` gibi hassas alanlari istemciye acmaz.
- `authMiddleware`
  - Gelen request'teki `Authorization: Bearer <token>` bilgisini kontrol eder.
  - Token yoksa veya gecersizse `401` dondurur.
- `authorizeRoles(...allowedRoles)`
  - Kullanici giris yapmis olsa bile sadece izin verilen rollere erisim saglar.
  - Yetki yoksa `403` dondurur.
- `401` ve `403` farki
  - `401`: kimlik dogrulama yok veya token gecersiz.
  - `403`: kimlik dogrulama var ama yetki yok.

#### Gun 2 Mikro Yol Haritasi

- 1. `User` modelini temiz naming ile tamamla. [Tamamlandi]
- 2. Register validation yaz. [Tamamlandi]
- 3. Register service yaz. [Tamamlandi]
- 4. Register controller yaz. [Tamamlandi]
- 5. Register route yaz. [Tamamlandi]
- 6. Register password hashleme (`bcrypt`) ekle. [Tamamlandi]
- 7. Login validation yaz. [Tamamlandi]
- 8. Login service yaz. [Tamamlandi]
- 9. Login controller yaz. [Tamamlandi]
- 10. Login route yaz. [Tamamlandi]
- 11. Safe response uygula. [Tamamlandi]
- 12. JWT utility ekle.
- 12. JWT utility ekle. [Tamamlandi]
- 13. Auth middleware ekle. [Tamamlandi]
- 14. Role check baslangici ekle. [Tamamlandi]

### Gun 3 - Student CRUD

- Bugun ne yaptim:
  - `src/modules/student` altinda `controllers`, `services`, `models`, `routes`, `validations` klasor yapisini olusturdum.
  - `Student` modelini yazdim.
  - `Student` ile `User` arasinda `userId` referansi kurdum.
  - `createStudentSchema` ile create student validation yazdim.
  - `updateStudentSchema` ile update student validation yazdim.
  - `createStudent` service'ini yazdim.
  - `getAllStudents`, `getStudentById`, `updateStudent`, `deleteStudent` service'lerini yazdim.
  - `createStudentController` yazdim.
  - `getAllStudentsController`, `getStudentByIdController`, `updateStudentController`, `deleteStudentController` yazdim.
  - `student.routes.ts` icinde `POST /` route'unu tanimladim.
  - `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id` route'larini ekledim.
  - `app.ts` icinde student route'unu `/api/v1/students` altina bagladim.
  - Postman ile `POST /api/v1/students` endpoint'ini test ettim.
  - `GET /api/v1/students` endpoint'ini test ettim.
  - `GET /api/v1/students/:id` endpoint'ini test ettim.
  - `PUT /api/v1/students/:id` endpoint'ini test ettim.
  - `DELETE /api/v1/students/:id` endpoint'ini test ettim.
  - MongoDB Atlas baglantisini `.env` icine ekleyip backend ile bagladim.
  - Create student endpoint'inden `201 Created` cevabi aldim.
  - Tum temel Student CRUD endpoint'lerinin calistigini dogruladim.
  - Student route'larina `authMiddleware` ekledim.
  - Student route'larina `authorizeRoles("admin")` ekleyerek ilk RBAC korumasini uyguladim.
  - Student response'larini `safeStudentResponse` mantigi ile daha tutarli hale getirdim.
  - `req.params.id` icin TypeScript tarafinda `string | string[] | undefined` uyarisi aldigim yerlerde koruyucu kontrol ekledim.
- Validation kurallari:
  - `firstName` ve `lastName` en az 2 karakter olacak.
  - `studentNumber`, `className`, `section`, `schoolName`, `userId` zorunlu kabul edildi.
  - `isActive` optional tutuldu.
  - Request body dogrulamasi `zod` ile controller'a gelmeden once yapildi.
- Service katmaninda is kurallari:
  - Ayni `studentNumber` ile ikinci kayit acilmasin diye once `findOne` kontrolu yaptim.
  - Yeni kaydi `Student.create()` ile service katmaninda olusturdum.
  - `isActive` gelmezse `true` varsayilan mantigini korudum.
  - `getStudentById` icinde kayit yoksa `Student not found` hatasi dondurdum.
  - `updateStudent` icinde `findByIdAndUpdate(..., { new: true })` kullanarak guncel kaydi dondurdum.
  - `deleteStudent` icinde kayit yoksa hata, varsa silme mantigi kurdum.
  - Role bazli erisimi ilk asamada tum student route'lari icin sadece `admin` ile sinirladim.
- Karsilastigim hata:
  - Schema icinde `type: string` yazdigim icin Mongoose tip hatasi oldu.
  - `student.controller.ts` icinde `_id`, `createdAt`, `updatedAt` alanlarinda TypeScript uyari verdi.
  - `student.routes.ts` dosyasi ilk denemede olusturulmamis oldugu icin route bulunamadi.
  - Postman'de yanlis endpoint ve yanlis port ile istek attigim icin `ECONNREFUSED` gordum.
  - MongoDB baglantisi olmadigi icin `students.findOne() buffering timed out after 10000ms` hatasi aldim.
  - `.env` dosyasi kok dizinde oldugu icin `MONGO_URI is not defined in environment variables` hatasi aldim.
  - `npm run dev` komutunu kok dizinde calistirdigim icin `package.json` bulunamadi.
- Cozum:
  - Schema icinde `String`, TypeScript interface icinde `string` kullanmam gerektigini ogrendim.
  - `IStudent extends Document` yapip `createdAt` ve `updatedAt` alanlarini interface'e ekledim.
  - `student.routes.ts` dosyasini dogru klasorde olusturdum.
  - Dogru test endpoint'inin `POST /api/v1/students` oldugunu netlestirdim.
  - `src/config/db.ts` dosyasini olusturup `connectDB` fonksiyonunu yazdim.
  - `server.ts` icinde `dotenv/config` import edip `connectDB()` cagrisi ekledim.
  - `.env` dosyasini `backend/.env` altina tasidim.
  - Local MongoDB yerine MongoDB Atlas connection string kullanarak baglantiyi kurdum.
  - `Cast to ObjectId failed` hatasinin kayit yok anlamina gelmedigini, bazen bozuk `id` formati anlamina geldigini ogrendim.
  - `GET by id` testinde URL sonuna fark edilmeden eklenen bosluk veya satir sonu karakterinin hataya neden olabildigini gordum.
  - `req.params.id` degerini service'e gondermeden once kontrol ederek TypeScript union type uyarisini giderdim.
  - `getAll`, `getById` ve `update` endpoint'lerinde ham Mongoose document dondurmek yerine kontrollu response yapisi kullandim.

#### Gun 3 Kavram Notlari

- `type: String` ve `firstName: string` farki
  - `String`, Mongoose schema tanimidir.
  - `string`, TypeScript tipidir.
  - Biri veritabani yapisini, digeri uygulama icindeki tipi anlatir.
- `userId`
  - Auth mantigi degil, iliski alanidir.
  - Hangi student kaydinin hangi `User` kaydina bagli oldugunu tutar.
- `ref: "User"`
  - Bu alanin `User` modeline referans verdigini soyler.
- `Document`
  - Mongoose document ozelliklerini TypeScript tarafina tasir.
  - `_id` gibi alanlarin tip tarafinda taninmasini saglar.
- `buffering timed out`
  - Sorgu kodu calisti ama veritabani baglantisi hazir degildi.
  - Bu hata genelde route degil, DB baglanti problemine isaret eder.
- `ECONNREFUSED`
  - Istek backend koduna bile ulasamadi.
  - Genelde server kapali, yanlis port, ya da yanlis URL kullanildiginda gorulur.
- `.env` konumu
  - Uygulama hangi klasorde calisiyorsa `.env` dosyasi orada olmalidir.
  - Bu projede `npm run dev` `backend` klasorunde calistigi icin `.env` de `backend/.env` icinde olmali.
- `authMiddleware` ve `authorizeRoles` farki
  - `authMiddleware`, kullanicinin giris yapip yapmadigini kontrol eder.
  - `authorizeRoles`, giris yapan kullanicinin yetkili role sahip olup olmadigini kontrol eder.
- Middleware sirasi
  - Once `authMiddleware`, sonra `authorizeRoles`, en son controller gelmelidir.
  - Cunku rol kontrolu yapmadan once kullanicinin kimligi dogrulanmis olmalidir.
- `safeStudentResponse`
  - Controller icinde response'a cikacak alanlari tek noktadan secmek icin yardimci fonksiyondur.
  - Response tutarliligini artirir ve gereksiz alanlarin disa cikmasini azaltir.
- `req.params.id` tipi neden problem oldu
  - TypeScript, route parametresinin her zaman duz `string` oldugundan emin degildi.
  - Bu yuzden service sadece `string` beklerken controller tarafinda once kontrol eklemek gerekti.

#### Gun 3 Mikro Yol Haritasi

- 1. Student domain klasor yapisini netlestir. [Tamamlandi]
- 2. Student model alanlarini planla. [Tamamlandi]
- 3. Student modelini yaz. [Tamamlandi]
- 4. Create student validation yaz. [Tamamlandi]
- 5. Create student service yaz. [Tamamlandi]
- 6. Create student controller yaz. [Tamamlandi]
- 7. Create student route yaz. [Tamamlandi]
- 8. Student route'unu `app.ts` icine bagla. [Tamamlandi]
- 9. MongoDB baglantisini kur ve create endpoint'ini test et. [Tamamlandi]
- 10. Get all students service/controller/route. [Tamamlandi]
- 11. Get student by id service/controller/route. [Tamamlandi]
- 12. Update student validation + service/controller/route. [Tamamlandi]
- 13. Delete student service/controller/route. [Tamamlandi]
- 14. Student route'larina auth middleware ekle. [Tamamlandi]
- 15. Gerekli route'lara role middleware ekle. [Tamamlandi]
- 16. Test akislarini tekrar kontrol et. [Tamamlandi]

### Gun 4 - Redis Cache

- Bugun ne yaptim:
  - Redis'in bu projede neden kullanilacagini netlestirdim.
  - Cache'in ilk asamada hangi endpoint icin uygun olabilecegini planladim.
  - Veri tutarliligi acisindan cache invalidation mantigini giris seviyesinde not ettim.
- Neyi cacheledim:
  - Bu asamada henuz uygulama seviyesinde bir veri cachelemedim.
  - Ilk aday olarak `GET /api/v1/students` endpoint'inin uygun oldugunu belirledim.
- Neden cacheledim:
  - Redis, sik erisilen veriyi memory'de tutarak daha hizli cevap uretmeye yardim eder.
  - Bu projede ilk amac, ayni veriler icin MongoDB'ye gereksiz tekrar sorgu gitmesini azaltmaktir.
  - Listeleme endpoint'leri genelde okuma agirlikli oldugu icin cache'e iyi bir baslangic ornegidir.
- Karsilastigim hata:
  - Bu asamada teknik bir hata ile karsilasmadim.
  - Ama cache kullanirken eski veri donme riskinin asil sorunlardan biri oldugunu fark ettim.
- Cozum:
  - Daha kod yazmadan once cache'in amacini ve ilk kullanilacak yeri netlestirdim.
  - Create, update ve delete islemlerinden sonra cache temizlenmezse stale data donulebilecegini not ettim.
  - Bu nedenle cache eklerken sadece hiz degil, veri tutarliligini da dusunmem gerektigini ogrendim.

#### Gun 4 Kavram Notlari

- Redis nedir
  - Redis, veriyi gecici olarak memory'de tutan cok hizli bir veri yapisidir.
  - Basit dusunursek: MongoDB buyuk bir arsiv dolabiysa, Redis masanin ustundeki hizli not kagididir.
  - Siklikla gereken bilgiye her seferinde dolaptan bakmak yerine, once masadaki nottan bakariz.
- Cache nedir
  - Cache, sik kullanilan verinin gecici olarak hizli bir yerde tutulmasidir.
  - Gercek hayat ornegi: Ogretmen yoklama listesini her ders mudur odasindan almiyorsa, masasinin ustunde tutuyorsa bu cache mantigina benzer.
  - Ama liste degisirse ve eski kagit masada kalirsa yanlis bilgi kullanilmis olur.
- Neden cache kullaniriz
  - Cunku bazi veriler cok sik okunur ama her seferinde yeniden hesaplanmasi veya veritabanindan cekilmesi gereksiz maliyet olusturur.
  - Cache kullaninca cevap daha hizli gelir ve veritabani daha az yorulur.
  - Gercek hayat ornegi: Kantindeki fiyat listesini herkes her seferinde depodan sormaz; duvara bir liste asilidir ve hizli bakilir.
- Bu projede Redis ne ise yarayacak
  - Bu projede Redis'i ilk asamada tekrar tekrar istenen verileri hizli donmek icin dusunuyoruz.
  - Ilk uygun yer `GET /api/v1/students` gibi listeleme endpoint'idir.
  - Cunku ayni ogrenci listesi kisa sure icinde birden fazla kez istenebilir.
- Cache hit nedir
  - Aranan veri Redis'in icinde varsa buna `cache hit` denir.
  - Yani sistem "Bu bilgi bende hazir var" der ve hizli cevap verir.
  - Gercek hayat ornegi: Defterde cevap zaten yaziliysa yeniden arastirma yapmazsin.
- Cache miss nedir
  - Aranan veri Redis'te yoksa buna `cache miss` denir.
  - Bu durumda sistem veriyi MongoDB'den alir, cevabi doner ve isterse Redis'e de kaydeder.
  - Gercek hayat ornegi: Masanda not yoksa gidip arsiv dolabindan dosyayi getirirsin.
- Neden her seyi cache'lemiyoruz
  - Cunku her veri cache icin uygun degildir.
  - Cok sik degisen verilerde cache eski bilgi tutabilir.
  - Bu yuzden genelde once okuma agirlikli ve tekrarli endpoint'lerde baslanir.
- Stale data nedir
  - `Stale data`, eski kalmis veri demektir.
  - Ornegin bir ogrenci guncellendi ama Redis'teki eski liste silinmediysa, kullanici guncel olmayan veri gorebilir.
  - Gercek hayat ornegi: Panodaki sinif listesi degisti ama eski kagit hala asili kaldi.
- Cache invalidation nedir
  - `Cache invalidation`, eski cache verisini temizleme veya gecersiz hale getirme islemidir.
  - Create, update, delete sonrasi bunu dusunmemiz gerekir.
  - Basit mantik: Bilgi degistiyse, eski hizli notu cope atip yenisini hazirlariz.
- Bu konudan ogrenmem gereken en temel fikir
  - Redis'in amaci dogrulugu degistirmek degil, dogru veriyi daha hizli ulasabilir hale getirmektir.
  - Ama hiz kazanirken veri tutarliligini kaybetmemek gerekir.
  - Yani hiz ve dogruluk birlikte dusunulmelidir.

### Gun 5 - AI Chatbot ve Entegrasyon

- Bugun ne yaptim:
- API entegrasyon notlari:
- Guvenlik notlari:
- Karsilastigim hata:
- Cozum:

### Gun 6 - Test ve Hardening

- Bugun ne yaptim:
- Guvenlik iyilestirmeleri:
- Performans iyilestirmeleri:
- Karsilastigim hata:
- Cozum:

### Gun 7 - Final Touch ve Sunum

- Bugun ne yaptim:
- Deploy notlari:
- Sunumda vurgulayacagim noktalar:
- Karsilastigim hata:
- Cozum:

## Hata Defteri

- Tarih:
- Hata mesaji:
- Kok neden:
- Kalici cozum:

## Mentor Notlari

- Bir sonraki adim:
  - `.env` icinde `JWT_SECRET` tanimla.
  - Auth akislarini Postman/Thunder Client ile test et.
  - Day 3 icin Student domain planlamasina basla.
- Tekrar etmem gereken konu:
  - `Schema`, `Document`, `timestamps`, `default`, `Date`, `interface`, `required`, `unique`, `bcrypt`, `compare`, `endpoint`, `z.infer`, `auth`, `authorization`, `401`, `403`
- Mini odev:
  - Kendi cumlelerinle su soruyu cevapla: `password` neden modelde var ama neden duz metin tutulmuyor?
