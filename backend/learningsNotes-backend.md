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
  - `backend/src/config/redis.ts` dosyasini olusturup temel Redis baglanti iskeletini yazdim.
  - `server.ts` icinde `connectRedis()` cagrisi ekleyerek uygulama acilis akisina Redis baglantisini dahil ettim.
  - Redis'in lokal calismasi icin proje kok dizininde `docker-compose.yml` dosyasi olusturdum.
  - Docker Desktop acildiktan sonra `docker compose up -d` ile Redis container'ini basariyla baslattim.
- Neyi cacheledim:
  - Bu asamada henuz uygulama seviyesinde bir veri cachelemedim.
  - Ilk aday olarak `GET /api/v1/students` endpoint'inin uygun oldugunu belirledim.
  - `GET /api/v1/students` icin `students:all` key'i ile ogrenci listesini cachelemeye basladim.
- Neden cacheledim:
  - Redis, sik erisilen veriyi memory'de tutarak daha hizli cevap uretmeye yardim eder.
  - Bu projede ilk amac, ayni veriler icin MongoDB'ye gereksiz tekrar sorgu gitmesini azaltmaktir.
  - Listeleme endpoint'leri genelde okuma agirlikli oldugu icin cache'e iyi bir baslangic ornegidir.
  - Ilk basarili istekte veri MongoDB'den alip Redis'e yazildi, sonraki isteklerde ayni veri Redis'ten daha hizli dondu.
- Karsilastigim hata:
  - Ilk Redis baglanti denemesinde `ECONNREFUSED` hatasi aldim.
  - MongoDB baglandi ama Redis baglantisi `127.0.0.1:6379` ve `::1:6379` uzerinden reddedildi.
  - Bu hata kodun yazimindan cok, Redis servisinin calismadigini veya erisilebilir olmadigini gosterdi.
  - `GET /api/v1/students` testinde once `401 No token provided`, sonra `Invalid or expired token` hatalari aldim.
  - Bir noktada `EADDRINUSE` hatasi aldim, cunku backend'i ayni portta ikinci kez calistirmaya calistim.
- Cozum:
  - Daha kod yazmadan once cache'in amacini ve ilk kullanilacak yeri netlestirdim.
  - Create, update ve delete islemlerinden sonra cache temizlenmezse stale data donulebilecegini not ettim.
  - Bu nedenle cache eklerken sadece hiz degil, veri tutarliligini da dusunmem gerektigini ogrendim.
  - Redis istemcisinin dogru yazilmasinin tek basina yetmedigini, Redis server tarafinin da acik olmasi gerektigini ogrendim.
  - Sonraki adimda Redis'i lokal veya Docker uzerinden calistirip tekrar test etmem gerektigini not ettim.
  - Docker Desktop kapaliyken `docker compose` komutunun calismadigini, once Docker engine'in acik olmasi gerektigini ogrendim.
  - Docker acildiktan sonra Redis image'i cekildi ve `smartstudent-redis` container'i basariyla ayaga kalkti.
  - Korumali route'lari test etmek icin once `register`, sonra `login` yapip token almam gerektigini tekrar ettim.
  - `GET /api/v1/students` icin ilk testlerde sadece `cache hit` gordum; gercek `cache miss` davranisini gormek icin Redis'teki `students:all` key'ini sildim.
  - `docker exec smartstudent-redis redis-cli DEL students:all` komutundan sonra ilk istekte `cache miss`, ikinci istekte `cache hit` davranisini net olarak gordum.
  - `createStudent` sonrasina cache invalidation ekledikten sonra, basarili `POST /api/v1/students` sonrasindaki ilk `GET /api/v1/students` isteginde yeniden `cache miss` gordum.
  - Bir sonraki `GET /api/v1/students` isteginde tekrar `cache hit` gordum ve invalidation mantiginin calistigini dogruladim.

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
- `students:all` neyi temsil ediyor
  - Bu, Redis'te tum ogrenci listesini tuttugumuz key adidir.
  - Kisa ve acik bir etiket gibidir.
  - Gercek hayat ornegi: Dosya dolabindaki "Tum Ogrenciler" yazili klasor etiketi gibi dusunulebilir.
- `cache miss` ne zaman gordum
  - Redis'te `students:all` olmadiginda ilk istek `cache miss` oldu.
  - Bu durumda sistem veriyi MongoDB'den aldi ve sonra Redis'e yazdi.
  - Yani `miss`, "hazir kopya yok, gidip asil kaynaktan al" demektir.
- `cache hit` ne zaman gordum
  - `students:all` Redis'te oldugunda sonraki isteklerde `cache hit` gordum.
  - Bu durumda veri tekrar MongoDB'den alinmadi, Redis'ten hizli sekilde dondu.
  - Yani `hit`, "hazir kopya var, onu kullan" demektir.
- Neden sadece `cache hit` gordum
  - Cunku key daha once Redis'e yazilmisti.
  - Bu nedenle sonraki istekler direkt Redis'ten cevaplandi.
  - Gercek `miss` davranisini gormek icin key'i silmek gerekti.
- Redis key silme neden onemli
  - Bazen testte sifirdan baslamak icin cache'i temizlemek gerekir.
  - Bunun icin `DEL students:all` kullanildi.
  - Boylece sistemin once `miss`, sonra `hit` davranisi izlenebildi.
- Neden `create`, `update`, `delete` sonrasi cache temizlemeliyiz
  - Cunku bu islemler ogrenci listesini degistirir.
  - Liste degisince eski `students:all` cache'i yanlis bilgi tasiyabilir.
  - Bu yuzden veri degistiren islemlerden sonra o key silinmelidir.
- Invalidation testinde neyi kanitladim
  - Basarili bir `createStudent` isleminden sonra eski liste cache'i silindi.
  - Sonraki ilk `GET /api/v1/students` istegi Redis'te veri bulamadi ve `cache miss` oldu.
  - Bundan sonraki `GET /api/v1/students` istegi ise yeniden cache'e yazilan veriyi kullandi ve `cache hit` oldu.
- Cache silme hangi katmanda olmali
  - En mantikli yer yine `service` katmanidir.
  - Cunku veri degisimi ve is kurallari service katmaninda yonetilir.
  - Controller'in gorevi request/response yonetmektir; cache temizleme karari business flow'a daha yakindir.
- `async` fonksiyon ne ise yarar
  - `async`, icinde zaman alan bir is yapilacaksa kullanilir.
  - Veritabani veya Redis baglantisi anlik olmaz; biraz bekleme olabilir.
  - Bu fonksiyon sayesinde JavaScript "baglanti tamamlanana kadar bekle, sonra devam et" mantigiyla calisir.
  - Gercek hayat ornegi: Bir arkadasini disaridan cagirirsin ve gelmesini beklersin; gelmeden derse baslamazsin.
- `await` neden kullanilir
  - `await`, sadece `async` fonksiyon icinde kullanilir.
  - "Bu is bitsin, sonra alt satira gec" demektir.
  - `await redisClient.connect()` yazinca, Redis baglantisi tamamlanmadan basarili kabul etmeyiz.
- `process.exit(1)` nedir
  - `process.exit(1)`, Node.js uygulamasini hata ile durdurur.
  - Buradaki `1`, programin normal degil hatali sekilde kapandigini anlatir.
  - Redis veya MongoDB baglanamiyorsa uygulamanin yari calisir halde acik kalmasindansa kontrollu sekilde durmasi daha iyidir.
  - Gercek hayat ornegi: Okulun elektrik sistemi calismiyorsa derse devam ediyor gibi yapmak yerine okulu gecici olarak kapatmak daha dogrudur.
- `ECONNREFUSED` ne demek
  - Bu hata "o adreste bir kapiyi calmaya calistim ama kimse acmadi" gibi dusunulebilir.
  - Uygulama `127.0.0.1:6379` adresindeki Redis'e baglanmak istedi ama o adreste calisan bir Redis server bulamadi.
  - Gercek hayat ornegi: Dogru apartman numarasina gittin ama dairede kimse yok veya dukkan kapali.
- `127.0.0.1:6379` ne demek
  - `127.0.0.1`, bu bilgisayarin kendisini ifade eder. Buna bazen `localhost` da denir.
  - `6379`, Redis'in varsayilan portudur.
  - Yani uygulama aslinda "Ben bu bilgisayarda calisan Redis'e baglanmak istiyorum" dedi.
- `docker compose up -d` ne yapar
  - `docker compose up`, `docker-compose.yml` icindeki servisleri calistirir.
  - `-d`, bunu arka planda yapar; yani terminali kilitlemeden servis ayakta kalir.
  - Bu projede bu komut Redis server'ini lokal ortamda ayaga kaldirmak icin kullanildi.
- `version is obsolete` uyarisinin anlami
  - Bu bir durdurucu hata degil, sadece eski stil bir alan kullandigimizi soyler.
  - Docker yeni surumlerde `version` satiri olmadan da compose dosyasini okuyabilir.
  - Yani su an Redis'in calismasini engelleyen sey bu degildi.
- `401 No token provided` ne demek
  - Route var ama kullanicinin kimlik bilgisi gonderilmemis demektir.
  - Yani daha service katmanina bile gecilmeden istek reddedilir.
  - Bu durumda ne DB ne Redis cache mantigi calisir.
- `Invalid or expired token` ne demek
  - Token gonderildi ama backend onu dogrulayamadı demektir.
  - Token eksik kopyalanmis, bozulmus veya gecersiz olabilir.
  - Dogru test icin login response'undaki token degeri eksiksiz kullanilmalidir.
- `EADDRINUSE` ne demek
  - Ayni portta zaten calisan bir uygulama varken ikinci kez server baslatilmaya calisildiginda olur.
  - Bu projede `5000` portu zaten kullanildigi icin ikinci backend acilisi hata verdi.
  - Basit mantik: Ayni kapiyi iki farkli server ayni anda kullanamaz.

#### Gun 4 Mikro Yol Haritasi

- 1. Redis'in projedeki rolunu netlestir. [Tamamlandi]
- 2. Redis baglanti dosyasinin yerini planla. [Tamamlandi]
- 3. `src/config/redis.ts` dosyasini olustur. [Tamamlandi]
- 4. `server.ts` icinde Redis baglantisini startup akisina ekle. [Tamamlandi]
- 5. Redis'i Docker ile lokal ortamda ayaga kaldir. [Tamamlandi]
- 6. Ilk cache adayi endpoint olarak `GET /api/v1/students` sec. [Tamamlandi]
- 7. `getAllStudents` service icine cache hit / miss mantigi ekle. [Tamamlandi]
- 8. `students:all` key'i ile ilk liste cache'ini yaz. [Tamamlandi]
- 9. Token ile korumali route testini gec ve endpoint'i calistir. [Tamamlandi]
- 10. `cache miss` ve `cache hit` davranisini gercek istekte gozlemle. [Tamamlandi]
- 11. `create`, `update`, `delete` sonrasi cache invalidation mantigini planla. [Tamamlandi]
- 12. `createStudent` sonrasinda `students:all` key silmeyi ekle. [Tamamlandi]
- 13. `updateStudent` sonrasinda `students:all` key silmeyi ekle. [Tamamlandi]
- 14. `deleteStudent` sonrasinda `students:all` key silmeyi ekle. [Tamamlandi]
- 15. Invalidation sonrasi test akislarini tekrar calistir. [Tamamlandi]

#### Gun 4 Mentor Ozeti

- Redis'i bu projede ana veri kaynagi olarak degil, hizlandirici cache katmani olarak kullandim.
- MongoDB asil kaynak olarak kaldi; Redis ise sik istenen liste verisini gecici olarak tuttu.
- `GET /api/v1/students` icin `students:all` key'i ile ilk cache akisini kurdum.
- Ilk istekte `cache miss`, sonraki istekte `cache hit` davranisini gercek olarak gozlemledim.
- `create`, `update` ve `delete` sonrasi stale data olusmamasi icin `students:all` key'ini service katmaninda temizledim.
- Basarili `createStudent` sonrasi yeniden `cache miss` gorerek invalidation mantiginin dogru calistigini dogruladim.
- Bu gunden ogrenilen en kritik fikir: Redis hiz kazandirir, ama veri tutarliligi korunmazsa yanlis veri dondurebilir. Bu nedenle cache her zaman invalidation mantigi ile birlikte dusunulmelidir.
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
