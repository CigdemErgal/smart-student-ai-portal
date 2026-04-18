# Mentor Mode Working Agreement

## 1. Bu Dosya Ne Icin Var

Bu dosya, SmartStudent projesinde bundan sonraki tum gelisim surecinin nasil ilerleyecegini kayit altina almak icin tutulur.

Bu dosyanin amaci:

- kullanicinin temel beklentilerini kalici sekilde saklamak
- her asamada ne istendigini unutmamak
- neden o sekilde ilerledigimizi not etmek
- geri donup bakildiginda karar mantigini gorebilmek
- mentor modunu proje icinde resmi calisma bicimine cevirmek

## 2. Temel Calisma Karari

Bu projede bundan sonra gelisim su sekilde ilerleyecek:

- once backend yazilacak
- backend oturduktan sonra frontend yazilacak
- AI kismina simdilik hic girilmeyecek
- proje branch yapisi ile disiplinli sekilde ilerleyecek
- kullanici kodu kendi yazacak
- assistant mentor gibi yonlendirecek, aciklayacak, sira verecek ve sorulari cevaplayacak

Bu karar kritik cunku proje sadece calisan kod uretmek icin degil, dogru mimari ve dogru dusunceyle gelissin diye kuruluyor.

## 3. Teknik Cekirdek

Backend icin kullanilacak teknoloji yiginı:

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Redis
- Docker

Frontend backend tamamlandiktan sonra su teknoloji ile kurulacak:

- React
- Tailwind CSS

## 4. Guvenlik Cizgisi

Bu proje OWASP Top 10 mantigina uygun bir disiplinle gelistirilecektir.

Bu, en azindan su basliklarin surekli dikkate alinmasi demektir:

- authentication
- authorization
- least privilege
- input validation
- secure error handling
- veri minimizasyonu
- guvenli konfigurasyon
- rate limiting
- hassas veriyi gereksiz toplamamak
- object-level authorization

Bu projede sadece endpoint calisiyor olmak yeterli kabul edilmeyecektir.
Yetki ve veri gorunurlugu de domain duzeyinde dusunulecektir.

## 5. Urun Yonelimi

Proje bir ogrenci veya veli portali degildir.

Projenin yeni urun kimligi:

- okul ici ogrenci takip ve destek sistemi
- okul personelinin yetki kontrollu sekilde ogrenci sureclerini takip ettigi yapi

Temel kabul:

- ogrenciler sistem kullanicisi degildir
- veliler sistem kullanicisi degildir
- ogrenciler veri varligidir
- sistem tani koymaz
- sistem otomatik ceza mekanizmasi degildir

## 6. Ana Domain Beklentisi

Projede zamanla su yapi bulunacaktir:

- okul
- siniflar
- subeler
- ogrenci listeleri
- sinif ogretmeni
- brans ogretmenleri
- rehber ogretmen
- observation
- ileride timeline

Bu yapi, role dayali gorunurluk ve erisim politikasini tasimak icin kurulacaktir.

## 7. Kritik Gorunurluk Kurallari

Bu proje icinde en onemli domain kararlardan biri gorunurluk politikasidir.

Temel senaryolar:

- brans ogretmeni kendi dersiyle ilgili observation girer
- sinif ogretmeni bu observation'i gorebilir
- sinif ogretmeni ogrenciyle ilgili bazi kayitlar girdiginde brans ogretmeni bunlari goremez
- brans ogretmenleri kendi alanlarindaki davranis listelerini gorur
- rehber ogretmen hem sinif hem brans ogretmeni girislerini gorebilir

Bu nedenle projede sadece RBAC yetmez.
Domain policy de ayrica ele alinacaktir.

## 8. Mentor Modu Kurali

Bu projede assistant'in gorevi:

- bir sonraki dogru adimi belirlemek
- neden o adimin secildigini aciklamak
- hangi dosyalarin acilacagini soylemek
- kullaniciya kucuk ve kontrollu gorevler vermek
- takildigi yerde kod mantigini aciklamak
- soru geldikce sabirla cevaplamak

Bu projede assistant'in gorevi, kullanici yerine tum gelisimi tek basina yapmak degildir.
Ana hedef, kullanicinin projeyi anlayarak kurmasidir.

## 9. Dokumantasyon Protokolu

Bu proje icinde `.md` dosyalari cok onemlidir.

Bu nedenle bundan sonra su bilgi tipleri duzenli olarak kaydedilecektir:

- ne istendi
- neden istendi
- ne yazildi
- neden o sekilde yazildi
- hangi teknik karar alindi
- hangi maddeler bilerek sonraya birakildi
- hangi branch uzerinde ilerlendi
- bir sonraki adim ne oldu

Dokumantasyon ilkesi:

- sadece kod degil, karar mantigi da yazilacak
- geri donup bakildiginda gelisim sirasi anlasilacak
- moduller arasi geciste eski kararlar kaybolmayacak

## 10. Kayit Tutma Kurali

Her buyuk modulde veya mimari kararda en az bir ilgili `.md` dokumani guncellenecek.

Ozellikle su durumlarda not dusulmesi gerekir:

- yeni modul baslangici
- MVP sinir karari
- role veya yetki karari
- model tasarimi karari
- endpoint karari
- guvenlik karari
- modulu kapatma veya checkpoint alma

## 11. Mevcut Referans Dosyasi

Observation tarafi icin ana referans dosyasi:

- `backend/docs/observation-module-plan.md`

Bu dosya korunacak ve gerekli oldugunda guncellenecektir.

Bu dosyaya ek olarak bundan sonra mentor modu ve genel proje yonu icin bu dosya da referans kabul edilir:

- `backend/docs/mentor-mode-working-agreement.md`

## 12. Tek Cumlelik Ozet

Bu projede gelisim, mentor modunda, backend once olacak sekilde, OWASP duyarliligi ve branch disiplini ile ilerleyecek; her onemli karar ve nedenleri `.md` dosyalarinda kalici olarak kaydedilecektir.
