# SportDigital — demo yo‘riqnomasi

## Ishga tushirish

```sh
pnpm install
pnpm dev
```

`http://localhost:3000/login` sahifasini oching. Agar development server allaqachon ishlayotgan bo‘lsa, shu manzilga kiring. Bir loyiha uchun ikkinchi `next dev` jarayonini ochish kerak emas.

Taqdimot uchun production rejimi:

```sh
pnpm build
pnpm start
```

Production serverning standart 3000-portidan foydalanish uchun development server avval to‘xtatilgan bo‘lishi kerak.

## Dizaynni saqlash qoidasi

Login, AppShell va oldingi barcha boshqaruv sahifalari original komponentlaridan foydalanadi. Mavjud sahifalarni `components/demo/` dagi boshqa to‘liq sahifalar bilan almashtirmang. Demo funksiyalarini original formalar va kartalarga `useLegacyRecords`, `legacyDashboard`, `legacyFinance` hamda umumiy provider orqali ulang. Yangi muxlis kabineti va arizalar sahifalari alohida qo‘shilgan.

## Kirish va demo profillar

Demo uchun bitta Super Administrator hisobi bor. Kirish ma’lumotlari repo ichidagi `lib/demo/auth.mjs` faylida saqlanadi va kichik server route orqali tekshiriladi; ma’lumotlar bazasi ishlatilmaydi.

- Email: `superadmin@sportdigital.uz`
- Parol: `SportDigital2026!`

Kirishdan keyin boshqa rollarni namoyish qilish uchun yuqori o‘ngdagi account/avatar menyusini oching va **Demo profil** tanlovidan foydalaning. Bu menyu telefonda ham avatar orqali ochiladi. Rol almashtirilganda yozuvlar saqlanadi.

| Rol | Boshlang‘ich profil | Imkoniyatlar |
|---|---|---|
| Super administrator | Sardor Aliyev | Tashkilot yaratish/tahrirlash, tashkilotlar orasida o‘tish, barcha boshqaruv amallari. |
| Tashkilot administratori | Madina Usmonova | Olimp xizmatlari, mijozlari, sotuv va xarajatlari, arizalarini boshqarish. |
| Rahbar | Aziz Karimov | Olimp natijalari va hisobotlari, KPI maqsadlari hamda DRI baholari. |
| Analitik | Nodira Saidova | Natijalar, tahlil va prognozni ko‘rish, hisobot olish; asosiy yozuvlarni tahrirlamaydi. |
| Muxlis | Dilshod Karimov | Faol tashkilotlar xizmatlarini ko‘rish, ariza qoldirish, o‘z arizalarini kuzatish. |

Barcha ichki profillar boshlanishida Olimp sport klubiga biriktirilgan. Super administrator yon menyu pastidagi tanlov orqali Humo Arena yoki yangi yaratilgan tashkilotga o‘ta oladi. Muxlis katalogda barcha faol tashkilotlarni ko‘radi. Reytingda boshqa tashkilotlarning faqat umumiy DRI baholari ko‘rsatiladi.

## 5–7 daqiqalik namoyish

1. **Administrator** bilan kiring. Dashboarddagi boshlang‘ich tushum va foydani eslab qoling. Davr sifatida “Shu oy”ni qoldiring.
2. **Sport xizmatlari → Xizmat qo‘shish**: “Suzish abonementi”, turi “Abonement”, narxi **200 000 so‘m**, jadvali “Du–Sh 10:00”, qisqa tavsif yozing va saqlang.
3. **Muxlislar / CRM → Muxlis qo‘shish**: ism va telefon kiriting.
4. **Moliya → Sotuv kiritish**: yangi xizmat va mijozni tanlang, miqdor **2**, to‘lov “Karta”, sana bugun. Jami **400 000 so‘m** bo‘ladi.
5. **Moliya → Xarajat**: “Ijara”, **100 000 so‘m**, sana bugun. Dashboardda tushum boshlang‘ich qiymatga nisbatan **400 000**, foyda **300 000 so‘mga** oshganini ko‘rsating. Sahifani yangilang: natija qoladi.
6. **Rahbar** roliga o‘ting. **KPI**da maqsadni va **Raqamli rivojlanish**da bir indikatorni o‘zgartiring. Bajarilish foizi va DRI darhol yangilanadi; DRI reytingga ham ta’sir qiladi.
7. **Hisobotlar → Yangi hisobot** orqali moliyaviy yoki boshqaruv hisobotini yarating. **CSV yuklash** orqali faylni oling. **Chop etish / PDF** tugmasi brauzerning chop etish oynasini ochadi; “Save as PDF / PDF sifatida saqlash”ni tanlang.
8. **Muxlis** roliga o‘ting. Katalogda xizmatning **Batafsil ko‘rish → Ariza qoldirish** tugmasini bosing.
9. **Administrator → Arizalar**da arizani tasdiqlang. **Muxlis → Mening arizalarim**da “Tasdiqlangan” holati chiqadi. Bu ariza hali to‘lov hisoblanmaydi.
10. **Super administrator** bilan Humo Arenaga o‘ting. Olimpga kiritilgan yozuvlar uning ichki ro‘yxatlarida chiqmasligini ko‘rsating.

## Asosiy tugmalar holati

| Qism | Natija |
|---|---|
| Login, rol almashtirish, chiqish | Demo sessiya saqlanadi yoki tozalanadi; rolga mos navigatsiya ishlaydi. |
| Xizmat / mijoz / tashkilot qo‘shish va tahrirlash | Umumiy demo ma’lumoti yangilanadi va brauzerda saqlanadi. |
| Arxivlash | Yozuv va tarixi saqlanadi, yangi sotuv/katalog tanlovidan chiqariladi. |
| O‘chirish | Bog‘liq tarix bo‘lmagan yozuv tasdiq bilan o‘chiriladi. Tarix bo‘lsa arxivlash taklif qilinadi. |
| Sotuv / xarajat | Moliya, Dashboard, KPI va keyingi yaratiladigan hisobotlarga ta’sir qiladi. |
| Sotuvni bekor qilish | Tushumdan chiqariladi, tarixda qoladi; qayta ayirib yuborilmaydi. |
| DRI / KPI saqlash | Baholar va maqsadlar saqlanadi, natijalar qayta hisoblanadi. |
| Hisobot / CSV / PDF | Hisobot nusxasi tarixda qoladi, CSV fayl yuklanadi, PDF chop etish orqali olinadi. |
| Muxlis arizasi / administrator tasdig‘i | Ikki rol o‘rtasida holat o‘zgaradi; ariza avtomatik sotuvga aylanmaydi. |
| Profil / tavsiyalar sozlamasi | Ism account menyuda yangilanadi; eski sozlamalar tablaridagi tanlovlar saqlanadi. |
| Marketing kampaniyasi yaratish | Tugma faol emas va namuna ekanligi izohlangan. Filtrlar va tafsilot oynalari ishlaydi. |
| Analitika / prognoz | Mavjud interaktiv hisoblashlar tayyor tarixiy namuna asosida ishlaydi. |
| Demo reset | Faqat SportDigital ma’lumotlari tiklanadi; brauzerdagi boshqa ma’lumotga tegmaydi. |

## Hisoblash va saqlash qoidalari

- Tushum — tanlangan davrdagi yakunlangan sotuvlar jami. Foyda — tushum minus xarajat.
- Pul ichkarida butun so‘mda saqlanadi. Xizmat narxi o‘zgarsa, oldingi sotuv narxi o‘zgarmaydi.
- “Bugun / Shu hafta / Shu oy / Shu chorak / Shu yil” davrlari **Asia/Tashkent** bo‘yicha boshlanish sanasidan bugungacha olinadi. Hafta dushanbadan boshlanadi.
- Boshlang‘ich yozuvlar demo birinchi ochilgan sanaga nisbatan yaratiladi. Taqdimot boshqa oyga ko‘chsa, boshlang‘ich sanalarni yangilash uchun demoni tiklash mumkin.
- KPI maqsadlari tashkilot va davr turi bo‘yicha saqlanadi. Oldingi sakkizta KPI kartasi saqlangan. MF, SD, ARPU va DRI umumiy demo yozuvlaridan hisoblanadi; qolgan ko‘rsatkichlar namunaviy bo‘lib, tafsilotdagi manbada belgilangan. Maqsadlar eski KPI sahifasidagi tugma orqali tahrirlanadi.
- DRI baholari tashkilot va **joriy oy** bo‘yicha saqlanadi. DRI moliyaviy davr filtridan mustaqil; Dashboard/KPI/reyting shu joriy bahoni ko‘rsatadi.
- CRM faolligi yakunlangan sotuvlar tarixidan olinadi; oxirgi xariddan 30 kun o‘tgan mijoz “Sust” deb belgilanadi.
- Hisobot yaratilgan paytdagi natijalarni saqlaydi. Keyingi sotuv eski hisobotni o‘zgartirmaydi; yangi natijalar uchun yangi hisobot yarating.
- Ma’lumotlar `sportdigital.demo.v1` kaliti bilan brauzer xotirasida turadi. Namoyishni bitta brauzer oynasida, rollarni almashtirib o‘tkazing. Turli qurilmalar va bir paytda ochilgan tablar o‘rtasida sinxronlashtirish yo‘q.
- Chiqish biznes yozuvlarini o‘chirmaydi. Xotira to‘lsa yoki saqlash bloklansa, ogohlantirish chiqadi va joriy oynada ishlash davom etadi.
- Buzilgan yoki mos kelmaydigan saqlangan ma’lumot avtomatik ustidan yozilmaydi: foydalanuvchiga tiklash taklif qilinadi.

## Demoni tiklash

**Sozlamalar → Umumiy → Hisob va demo boshqaruvi → Demoni tiklash**. Ochilgan tasdiqlash savolini tasdiqlang.

Yaratilgan xizmat, mijoz, sotuv, xarajat, hisobot va arizalar o‘chadi. Profillar, ikki boshlang‘ich tashkilot va namunaviy yozuvlar qayta tiklanadi. Kirish sahifasi ochiladi. Buzilgan ma’lumot topilsa, kirish ekranidagi **Demoni tiklash** tugmasidan foydalaning.

Joriy yoki demo profillar biriktirilgan tashkilotni arxivlash/o‘chirish cheklangan: aks holda shu profillar o‘z tashkilotini yo‘qotib qo‘yadi.

## Demo chegaralari

Haqiqiy akkaunt, parolni tiklash, to‘lov, email/SMS, ijtimoiy tarmoq va AI integratsiyalari ulanmagan. Marketing, tarixiy analitika va prognozlar oldindan tayyorlangan ma’lumotlardan ishlaydi; ular yangi sotuvlar bilan sinxron emas. Bu sahifalarda tegishli izoh bor.

Oldingi 10 ta shablon va hisobot tarixi UI’da saqlangan. Haqiqiy CSV/PDF fayli yangi moliyaviy yoki boshqaruv hisobotidan olinadi; tarixiy namunaviy hisobotlar va qolgan shablonlar tegishli izoh chiqaradi. XLSX faol emas. Jo‘natish rejalari demo sozlamasi sifatida saqlanadi, haqiqiy jo‘natma yuborilmaydi. Tadbirlar va baho/fikr qoldirish keyingi bosqichga qoldirilgan. Oddiy userning asosiy jarayoni — xizmatga ariza berish.

## Tekshirish

```sh
pnpm test
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
pnpm build
```

Brauzer testi `localhost:3000` manzilidagi mavjud development serverni ishlatadi yoki o‘zi ishga tushiradi. Testlar alohida brauzer kontekstlarida bajariladi va taqdimot qilayotgan brauzeringizdagi yozuvlarga tegmaydi.

Ushbu ish muhitida Chromium uchun `libnspr4` va `libnss3` tizimda topilmadi. Ular tizimga o‘rnatilmasdan `/tmp/sportdigital-browser-libs/` ichiga chiqarildi. Shu muhitda alternativ ishga tushirish:

```sh
LD_LIBRARY_PATH=/tmp/sportdigital-browser-libs/usr/lib/x86_64-linux-gnu pnpm test:e2e
```

Bu vaqtinchalik katalog boshqa kompyuterda mavjud bo‘lishi shart emas; odatiy o‘rnatish uchun yuqoridagi Playwright install buyrug‘i ishlatiladi.
