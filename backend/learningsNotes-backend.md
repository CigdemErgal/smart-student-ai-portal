# Backend Learning Notes

## Proje

- Proje: SmartStudent AI Portal
- Katmanlı Mimari: Controller -> Service -> Model
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
  - `zod`: girdi dogrulama (OWASP A03).
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
- Ogrendigim en onemli 3 sey:
  - Scriptler, gelistirme ve production akisinin temelidir.
  - Runtime ve dev dependency ayrimi kritik.
  - Guvenlik paketleri Day 1'de eklenirse sonraki adimlar daha saglam olur.
  - TypeScript projede tooling kurmadan kod yazmaya baslamak teknik borc olusturur.
  - Middleware sirasi (app -> guvenlik -> parser -> route) dogru olmazsa beklenmeyen davranis olusur.
  - Uzun klasor yapilarini terminalde tek komutla olusturmak zaman kazandirir.

#### Pratik Terminal Komutu (Tekrar Kullan)

- Backend `src` altinda klasorleri tek komutla terminalden olusturmak icin:
  - `New-Item -ItemType Directory -Force -Path backend/src/controllers,backend/src/services,backend/src/models,backend/src/routes,backend/src/middlewares,backend/src/validation,backend/src/utils,backend/src/interfaces,backend/src/constants`

### Gun 2 - Auth ve Guvenlik

- Bugun ne yaptim:
- JWT ve role tabanli yetki notlari:
- OWASP ile ilgili uyguladigim maddeler:
- Karsilastigim hata:
- Cozum:

### Gun 3 - Student CRUD

- Bugun ne yaptim:
- Validation kurallari:
- Service katmaninda is kurallari:
- Karsilastigim hata:
- Cozum:

### Gun 4 - Redis Cache

- Bugun ne yaptim:
- Neyi cacheledim:
- Neden cacheledim:
- Karsilastigim hata:
- Cozum:

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
  - Katmanli mimari klasorlerini ac (`controllers`, `services`, `models`, `routes`, `middlewares`, `validation`, `utils`, `interfaces`, `constants`).
- Tekrar etmem gereken konu:
- Mini odev:
