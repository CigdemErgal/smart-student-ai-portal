# Role And School Structure Plan

## 1. Bu Dokuman Ne Icin Var

Bu dokuman, observation sonrasinda backend tarafinda neden role ve school structure fazina gecildigini kayit altina almak icin hazirlanmistir.

Bu dosyanin amaci:

- yeni branch'in neden acildigini netlestirmek
- urun senaryosunu veri modeli seviyesinde toparlamak
- hangi modellerin neden gerekli oldugunu yazmak
- kod yazmadan once domain sinirlarini belirlemek
- geri donup bakildiginda ne istendi, neden istendi ve neden bu sirayla ilerlendigini gostermek

## 2. Neden Bu Faz Observation'dan Sonra Geliyor

Observation modulu backend MVP seviyesinde tamamlandi.

Observation tarafinda su temel alanlar hazir durumdadir:

- create
- student observation list
- observation detail
- not found kontrolleri
- temel role guard

Fakat observation'dan sonra dogrudan timeline'a gecmek yerine once role ve school structure fazina gecmek daha dogrudur.

Bunun nedeni:

- observation gorunurlugu dogrudan okul yapisina baglidir
- hangi ogretmenin hangi ogrenciye erisecegi henuz veri modeli seviyesinde net degildir
- homeroom teacher, branch teacher ve counselor farki ancak school structure ile anlamli olur
- timeline gibi okuma modulleri de bu zemin uzerine oturacaktir

Kisa karar:

- observation tamam
- simdi zemin kurma fazi
- sonra access policy
- sonra timeline

## 3. Urun Yonu

Proje bir ogrenci portali degildir.

Bu sistemin yeni urun kimligi:

- okul ici ogrenci takip ve destek sistemi
- okul personelinin kullandigi, yetki kontrollu bir ic panel mantigi

Temel kabul:

- ogrenciler sistem kullanicisi degildir
- veliler sistem kullanicisi degildir
- ogrenciler veri varligidir
- sistem tani koymaz
- sistem otomatik ceza sistemi degildir
- AI kismina simdilik girilmeyecektir

## 4. User Ile Student Farki

Bu fazin en kritik domain ayrimlarindan biri `User` ile `Student` arasindaki farktir.

`User`:

- sisteme giris yapan kisi
- okul personelidir
- yetki ve rol tasir

`Student`:

- sistemde hakkinda kayit tutulan varliktir
- sisteme giris yapan kullanici degildir
- observation, timeline ve ileride diger takip kayitlarinin merkezindedir

Bu ayrim korunacaktir.

Yani:

- `User` auth domain'indedir
- `Student` school domain'indedir

## 5. Hedef Roller

Bu projede hedef aktif roller sunlardir:

- `admin`
- `homeroom_teacher`
- `branch_teacher`
- `counselor`

Bu roller urun senaryosu ile uyumludur.

Temel rol mantigi:

- `admin`: sistemsel yonetim ve genis erisim
- `homeroom_teacher`: sorumlu oldugu sinif veya subedeki ogrenci akislarini takip eder
- `branch_teacher`: kendi ders ve bagli oldugu siniflar uzerinden observation girer ve belirli kayitlari gorur
- `counselor`: daha genis destek ve takip perspektifine sahip olur

## 6. Okul Yapisi

Bu projede modelleme asamasinda en az su yapi dusunulecektir:

- school
- classroom
- section
- student
- teacher assignment

Bu yapida temel ihtiyac:

- bir ogrencinin hangi okulda oldugu belli olmali
- bir ogrencinin hangi sinif ve subede oldugu belli olmali
- homeroom teacher iliskisi tanimli olmali
- branch teacher hangi siniflarda hangi ders kapsaminda gorevli belli olmali

## 7. Ogretmen Atama Mantigi

Bu fazda en onemli modelleme kararlarindan biri ogretmen atamasidir.

Homeroom teacher icin:

- bir sinif veya sube ile dogrudan iliski beklenir

Branch teacher icin:

- bir veya daha fazla sinif/sube ile iliski beklenir
- bu iliski ideal olarak ders bilgisi ile birlikte tutulur

Counselor icin:

- okul bazli, sinif bazli veya ogrenci grubu bazli erisim modeli dusunulebilir
- ilk MVP'de daha sade bir kapsama ile baslanabilir

## 8. Gorunurluk Kurallarinin Zemini

Bu proje icinde sadece RBAC yeterli olmayacaktir.

Cunku urun senaryosu su ayrimlari istiyor:

- branch teacher kendi alaniyla ilgili observation girer
- homeroom teacher bunu gorebilir
- homeroom teacher'in girdigi bazi kayitlari branch teacher gormeyebilir
- counselor hem homeroom teacher hem branch teacher tarafini gorebilir

Bu nedenle iki katmanli dusunce korunacaktir:

- RBAC: role seviyesinde genel modül erisimi
- Domain policy: spesifik kullanicinin spesifik ogrenci veya kayda erisimi

Bu dokuman daha cok ikinci katmanin veri zeminini hazirlamak icindir.

## 9. Ilk MVP'de Yazilacak Modeller

Bu fazda once en kucuk ama dogru zemin kurulacaktir.

Ilk aday modeller:

- mevcut `User` modelinin rol mantigini netlestirmek
- mevcut `Student` modelini school structure ile uyumlu hale getirmek
- yeni bir `Classroom` veya `Section` modeli eklemek

Ilk MVP icin muhtemel alanlar:

`Student`

- firstName
- lastName
- studentNumber
- schoolName veya schoolId
- classLevel
- section
- homeroomTeacherId gibi gecici veya kalici baglar

`Classroom` veya `Section`

- school bilgisi
- class level
- section code
- homeroomTeacherId
- branchAssignments

Bu bolum kod yazmadan once daha da netlestirilecektir.

## 10. Bu Fazda Hemen Yapilmayacaklar

Ilk school structure fazinda su maddeler bilerek sonraya birakilabilir:

- tum detayli scheduling yapisi
- ders programi
- veli iliskileri
- not sistemi
- attendance modulu
- counseling private notes
- red flag otomasyonu
- AI destekli ozetleme

Bu erteleme bilincli yapilacaktir.
Amac once dogru domain zeminini kurmaktir.

## 11. Branch Notu

Bu dokuman yeni branch uzerinde role ve school structure fazini aciklamak icin tutulur.

Bu branch'te temel hedef:

- role sistemini urunle hizalamak
- school structure icin ilk veri modelini netlestirmek
- access policy icin saglam temel hazirlamak

## 12. Sonraki Adim

Bu dokumandan sonraki ilk teknik is:

- mevcut `Student` modelini incelemek
- hangi alanlarin korunacagina karar vermek
- hangi alanlarin yeni school structure modeline tasinacagini belirlemek

Sonra:

- ilk yeni model secilecek
- dosya plani cikarilacak
- kucuk ve kontrollu kod adimlari baslatilacak

## 13. Student Modeli Icın Ilk Karar

Mevcut `Student` modelinde su alanlar vardir:

- `firstName`
- `lastName`
- `studentNumber`
- `className`
- `section`
- `schoolName`
- `userId`
- `isActive`

Bu alanlar icin ilk karar su sekildedir:

Korunacak alanlar:

- `firstName`
- `lastName`
- `studentNumber`
- `isActive`

Gecici olarak kalabilecek ama sonra refactor edilebilecek alanlar:

- `className`
- `section`
- `schoolName`

Bu alanlar ilk school structure fazinda tamamen silinmek zorunda degildir.
Ancak orta vadede `Classroom`, `Section` ve muhtemel `School` modeli ile daha iliskisel bir yapiya tasinmalari daha dogrudur.

En kritik problemli alan:

- `userId`

Bu proje artik ogrenciyi sistem kullanicisi olarak gormedigi icin `Student -> User` baglantisi urun yonu ile uyumlu degildir.
Bu nedenle `userId` alani kaldirilmasi gereken ilk aday alandir.

Kisa karar:

- `Student` bir auth varligi degil
- `Student` bir school domain varligidir
- bu nedenle `userId` baglantisi yeni urun yonunde gerekli degildir

## 14. Ilk Kod Gorevi

Bu fazdaki ilk hizli ve dogru kod gorevi:

- `Student` modelinden `userId` alanini kaldirmak
- `student.validation.ts` icindeki `userId` zorunlulugunu kaldirmak
- ilgili create/update akislarinda `userId` bagimliligini temizlemek

Bu adim secildi cunku:

- domain ile kod tabanini hizalar
- ogrenciyi kullanici degil veri varligi olarak netlestirir
- sonraki `Classroom` modeline gecisi kolaylastirir

## 15. Tek Cumlelik Ozet

Observation sonrasinda bu faza gecilmesinin nedeni, okul yapisi ve rol iliskileri netlesmeden observation gorunurlugu, access policy ve timeline gibi modullerin saglam kurulamayacak olmasidir.
