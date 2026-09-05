# SportDigital — ishlaydigan demo uchun bosqichma-bosqich reja

Sana: 2026-09-05

Holat: backendsiz demo implementatsiyasi yakunlandi. 14 ta model testi, 5 ta brauzer ssenariysi va production build tekshiruvdan o‘tdi.

## 1. Maqsad va kelishilgan yo'nalish

Taqdimotda foydalanuvchi platformaning vazifasini tushunsin, amallarni bajarsin va natijasini boshqa tegishli sahifalarda ham ko'rsin. Barcha tashqi xizmatlarni haqiqatan ulash talab qilinmaydi.

**UI talabi:** original login, navigatsiya, kartalar, jadvallar, grafiklar va sahifa tartibi saqlanadi. Funksiyalar shu komponentlar ichiga ulanadi.

Birinchi versiya backendsiz ishlaydi. Ma'lumotlar shu brauzerda saqlanadi. Mavjud dizayn, o'zbekcha matnlar va tayyor grafiklardan foydalaniladi.

Asosiy namoyish jarayoni:

> Administrator xizmat yaratadi → mijoz va sotuv kiritadi → Moliya hamda Dashboard yangilanadi → rahbar natijani ko'radi → hisobot yuklaydi → sahifa yangilanganda ma'lumotlar saqlanadi.

Demo ekanini kirish sahifasida va demo boshqaruvi yonida qisqa ko'rsatish yetarli. Haqiqiy email yuborilmagan yoki to'lov olinmagan bo'lsa, interfeys buni bajarildi deb ko'rsatmaydi.

## 2. Hozirgi holat

- Asosiy sahifalar va rahbar paneli mavjud.
- Ma'lumotlar asosan `lib/mock/` fayllaridan olinadi.
- Ayrim yaratish, filtrlash va sozlash amallari sahifa ichidagi vaqtinchalik holatda ishlaydi.
- Login repo ichidagi yagona Super Administrator credentialini server route orqali tekshiradi; foydalanuvchilar bazasi yo'q.
- Profil hozir bitta namunaviy rahbar sifatida ko'rsatiladi.
- Umumiy doimiy ma'lumotlar qatlami va ishlaydigan rol tizimi hali yo'q.
- Hisobot yaratish interfeysi mavjud; haqiqiy fayl eksportini alohida ulash kerak.

Bu hujjat demo implementatsiyasi uchun ish tartibidir. `PROJECT_PLAN.md` mahsulotning kengroq g'oyasi va oldingi ishlar tarixini saqlaydi.

## 3. Demo chegaralari

### Amalda ishlaydigan qismlar

- Demo profil va rol tanlash, chiqish, rolga mos menyu.
- Tashkilot, xizmat va mijoz yaratish/tahrirlash/arxivlash.
- Sotuv va xarajat kiritish, ulardan hisoblangan natijalar.
- Qidiruv, filtr, saralash, sahifalash va tafsilot oynalari.
- Ma'lumotlarni sahifa yangilanganda saqlash.
- KPI maqsadlari, DRI baholari va ularga bog'liq sodda tavsiyalar.
- CSV yuklash va chop etish orqali PDF saqlash.
- Demo ma'lumotlarini boshlang'ich holatga qaytarish.

### Namuna ma'lumotlari bilan qoladigan qismlar

- Instagram/Telegram reklama statistikasi va tashqi integratsiyalar.
- Tarixiy analitika hamda uzoq muddatli prognozlar; namunaviy ma'lumotga asoslangani ko'rsatiladi.
- Tashqi tashkilotlarning tarixiy reyting ko'rsatkichlari.
- Email/SMS/push yuborish, haqiqiy to'lov va parol tiklash.
- Avtomatik hisobot jo'natish rejasi saqlanishi mumkin, lekin jo'natma bajarilmaydi.

### Ushbu bosqichga kirmaydi

- Backend, server bazasi, haqiqiy autentifikatsiya va xavfsizlik kafolatlari.
- Turli qurilmalarda bir xil ma'lumotni sinxronlashtirish.
- To'lov provayderlari, ijtimoiy tarmoqlar yoki AI xizmatlarini ulash.
- Alohida mobil ilova va ruscha tarjima.
- XLSX eksporti: dastlab Excel ochadigan CSV yetarli; CSV faylga `.xlsx` nomi berilmaydi.

## 4. Rollar va ko'rinadigan imkoniyatlar

Barcha rollar bitta umumiy demo ma'lumotidan foydalanadi. Rol almashtirish ma'lumotni tiklamaydi. Bu mijoz tomonidagi namoyish cheklovi, haqiqiy xavfsizlik mexanizmi emas.

| Rol | Demo imkoniyatlari |
|---|---|
| Super administrator | Barcha tashkilotlar, tashkilot yaratish va tahrirlash, umumiy reyting, demo profil/rol boshqaruvi. |
| Tashkilot administratori | Faqat tanlangan tashkilotning xizmatlari, mijozlari, sotuvlari, xarajatlari va sozlamalarini yuritish. |
| Rahbar | O'z tashkilotining Dashboard, Moliya, Marketing, KPI, DRI va hisobotlarini ko'rish; KPI maqsadlari va DRI baholarini o'zgartirish. |
| Analitik | O'z tashkilotining tahlil, prognoz, KPI, DRI va hisobotlarini ko'rish/eksport qilish; asosiy yozuvlarni o'zgartirmaslik. |
| Muxlis | Tashkilot/xizmat katalogi, xizmat tafsiloti, demo ariza qoldirish va o'z arizalarini ko'rish. |

Menyu bilan birga sahifaga to'g'ridan-to'g'ri kirish va o'zgartirish amallari ham rolga mos tekshiriladi. Super administrator barcha tashkilotlarga o'ta oladi; boshqa ichki rollar o'z tashkilotiga bog'lanadi. Ochiq katalog ichki moliyaviy va mijoz ma'lumotlarini ko'rsatmaydi.

## 5. Ma'lumotlar qanday bog'lanadi?

| Yozuv | Asosiy maydonlar va bog'lanishlar |
|---|---|
| Tashkilot | ID, nom, tur, hudud, aloqa, holat. |
| Demo profil | ID, ism, rol, tashkilot ID; muxlis uchun mijoz profili bilan bog'lanish. |
| Xizmat | ID, tashkilot ID, nom, tur, narx (so'm), holat. |
| Mijoz/muxlis | ID, tashkilot ID, ism, aloqa, faollik ma'lumotlari. |
| Sotuv | ID, tashkilot ID, xizmat ID, mijoz ID, sana, miqdor, sotuv paytidagi birlik narxi, jami summa, to'lov usuli, holat. |
| Xarajat | ID, tashkilot ID, sana, toifa, summa, izoh, holat. |
| Ariza | ID, muxlis/profil ID, tashkilot ID, xizmat ID, sana, holat. |
| KPI va DRI | Tashkilot ID, davr, KPI maqsadlari, 12 ta DRI indikatorining baholari. |
| Hisobot | ID, tashkilot ID, davr, tur, format, yaratilgan sana va o'sha paytdagi natijalar nusxasi. |

Hisoblash qoidalari:

- Sotuv yagona daromad manbai bo'ladi: Moliya uchun yana alohida daromad yozuvi yaratib, summani ikki marta hisoblamaymiz.
- Tushum = tanlangan davrdagi yakunlangan sotuvlar jami; foyda = tushum − xarajat.
- Xizmat narxi keyin o'zgarsa, oldingi sotuv summasi o'zgarmaydi.
- Bekor qilingan sotuv tushumdan chiqariladi; uni qayta bekor qilish yana ayirishga olib kelmaydi.
- Xizmat/mijoz/tashkilotga bog'liq tarix mavjud bo'lsa, o'chirish o'rniga arxivlash ishlatiladi. Bo'sh yozuvni tasdiq bilan o'chirish mumkin.
- Ariza avtomatik ravishda to'lov yoki sotuvga aylanmaydi. Administrator sotuvni alohida tasdiqlaydi.
- Barcha pul qiymatlari ichkarida butun so'mda saqlanadi; ming/mln ko'rinishi faqat chiqarishda qo'llanadi.
- Sana filtrlari Dashboard, Moliya va hisobotlarda bir xil qoidada ishlaydi. Nolga bo'lish va ma'lumotsiz davrlar alohida hisobga olinadi.
- Namunaviy boshlang'ich sotuvlar va xarajatlardan yig'indi hisoblanadi; eski mustaqil statik umumiy summalar ustiga yangi yozuvlar qo'shilmaydi.

## 6. Implementatsiya bosqichlari

### 1-bosqich — mavjud interfeys va demo ssenariysini tayyorlash

- [x] Implementatsiyadan oldin `node_modules/next/dist/docs/` ichidagi tegishli Next.js qo'llanmalarini o'qish.
- [x] Sahifalardagi asosiy tugmalarni ro'yxatlash: ishlaydi / ulash kerak / demo sifatida belgilash kerak.
- [x] Mavjud formalar, filtrlar va hisoblash funksiyalaridan qayta foydalanish joylarini aniqlash.
- [x] Ikki tashkilot, besh demo profil, xizmatlar, mijozlar, sotuvlar va xarajatlardan izchil boshlang'ich dataset tayyorlash.
- [x] Dataset sanalarini birinchi ishga tushishdagi demo sanasiga moslash; taqdimot payti davrlar bo'shab qolmasin.

Tayyorlik mezoni: har bir asosiy amal uchun kutilgan natija ma'lum; namunaviy sotuvlar va umumiy summalar mos.

### 2-bosqich — umumiy ma'lumotlar qatlami va saqlash

- [x] `lib/demo/` ichida boshlang'ich ma'lumotlar, saqlash, amallar, hisoblash va rol qoidalarini ajratish.
- [x] React provider orqali sahifalarni bitta umumiy holatga ulash.
- [x] `localStorage` uchun versiyalangan kalit va ma'lumot formati yaratish.
- [x] Birinchi ochilishda boshlang'ich ma'lumotni yuklash, keyingi ochilishlarda saqlangan holatni tiklash.
- [x] Brauzer ma'lumoti yuklanishidan oldin uni boshlang'ich qiymatlar bilan ustidan yozib yubormaslik.
- [x] Buzilgan yoki mos kelmaydigan saqlangan ma'lumot uchun tiklash yo'lini berish.
- [x] Xotiraga yozish ishlamasa, ilova shu sessiyada ishlasin va saqlanmaganini tushunarli bildirsin.
- [x] Demo reset faqat SportDigital kalitlarini tozalasin; boshqa sayt/ilova ma'lumotlariga tegmasin.

Tayyorlik mezoni: yaratilgan yozuv boshqa sahifada ko'rinadi, refresh va brauzerni qayta ochishdan keyin saqlanadi; reset boshlang'ich holatni qaytaradi.

### 3-bosqich — demo kirish, rollar va tashkilot tanlash

- [x] Login sahifasini repo ichidagi bitta Super Administrator credentialiga ulash.
- [x] Kirilgan profil, rol va tashkilotni saqlash; yuqori profil kartasini shundan chiqarish.
- [x] Har rol uchun boshlang'ich sahifa va menyuni belgilash.
- [x] Sessiyasiz ichki sahifadan login sahifasiga yo'naltirish.
- [x] Rolga mos bo'lmagan sahifa va amallarga mijoz tomonidagi cheklov qo'yish.
- [x] Tashkilot almashtirishni barcha tegishli ro'yxat, karta va grafiklar bilan bog'lash.
- [x] Chiqishda sessiyani tozalash, demo biznes ma'lumotlarini saqlab qolish.
- [x] Parol tiklashdagi yolg'on “email yuborildi” natijasini demo izohi bilan almashtirish.

Tayyorlik mezoni: administrator faqat o'z tashkilotini ko'radi; rahbar/analitik uchun yozish imkoniyatlari jadvalga mos; muxlis ichki panelga kirmaydi.

### 4-bosqich — tashkilotlar, xizmatlar va mijozlar

- [x] Mavjud ro'yxatlarni umumiy ma'lumotlar qatlamiga o'tkazish.
- [x] Qo'shish, tahrirlash, arxivlash va tegishli bo'sh yozuvni o'chirishni ulash.
- [x] Majburiy maydonlar, narx va aloqa ma'lumotlariga sodda validatsiya qo'yish.
- [x] Qidiruv, filtr, saralash, sahifalash va tafsilot oynalarini yangi ma'lumotga moslash.
- [x] Saqlashdan so'ng natijani darhol ko'rsatish; bekor qilishda o'zgarish saqlanmasin.
- [x] Xavfli amallar uchun tasdiqlash oynasi; ishlayotgan amal davomida takror submitni to'sish.

Tayyorlik mezoni: yangi xizmat va mijoz refreshdan keyin ham bor; tahrir tafsilot oynasida aks etadi; arxivlangan xizmat yangi sotuv tanlovida chiqmaydi.

### 5-bosqich — sotuv → Moliya → Dashboard

- [x] Xizmat va mijozni tanlab sotuv kiritish formasini yaratish.
- [x] Xarajat qo'shish/tahrirlash va sotuvni bekor qilish imkoniyatini ulash.
- [x] Moliya operatsiyalari, tushum, xarajat va foydani umumiy yozuvlardan hisoblash.
- [x] Dashboard daromad kartalari, grafiklari va tegishli xizmat natijalarini shu hisoblashlarga ulash.
- [x] Barcha tegishli joylarda tashkilot va davr filtrlarini bir xil qo'llash.
- [x] CRM mijoz tarixida uning sotuvlarini ko'rsatish.

Tayyorlik mezoni: 200 000 so'mlik ikki birlik sotuv tushumni 400 000 so'mga oshiradi; 100 000 so'm xarajat bilan foyda jami 300 000 so'mga oshadi. Sotuv bekor qilinsa, tushum qaytadi, xarajat qoladi. Natijalar boshqa tashkilotda ko'rinmaydi.

### 6-bosqich — KPI, DRI, marketing va tavsiyalar

- [x] KPI maqsadlarini saqlash va mavjud haqiqiy demo yozuvlaridan hisoblash mumkin bo'lgan KPIlarni ulash.
- [x] Qolgan KPIlar uchun namunaviy baholash manbasini aniq belgilash; hammasi sotuvdan kelayotgandek ko'rsatmaslik.
- [x] DRI indikatorlarini saqlash; umumiy ball, daraja va tegishli reyting qiymatini qayta hisoblash.
- [x] Past DRI, bajarilmagan KPI va sust mijozlar asosida sodda qoidaviy tavsiyalar chiqarish.
- [x] Marketing kanal filtrlari, kampaniya tafsilotlari va ROI hisobini tekshirish; tashqi statistika demo bo'lib qoladi.
- [x] Analitika/prognozning namunaviy tarixdan ishlaydigan qismlarini belgilash; DRI/KPI o'zgarsa tegishli dinamik ko'rsatkichlarni yangilash.

Tayyorlik mezoni: KPI maqsadi o'zgarsa bajarilish foizi, DRI bahosi o'zgarsa uning umumiy balli yangilanadi va saqlanadi. Tavsiya sababi ko'rinib turadi.

### 7-bosqich — hisobotlar va sozlamalar

- [x] Avval moliyaviy va rahbar uchun umumiy hisobotlarni amalda ishlatish.
- [x] Hisobotga tashkilot, davr, natijalar va yaratilgan vaqtni kiritish; tarixni saqlash.
- [x] CSV eksportida o'zbekcha belgilar, vergul, qo'shtirnoq va yangi qatorlarni to'g'ri chiqarish.
- [x] Chop etishga mos hisobot ko'rinishi orqali “PDF sifatida saqlash” imkonini berish.
- [x] Tayyor bo'lmagan hisobot turlari va formatlarini tanlashga qo'ymaslik, qisqa izoh berish.
- [x] Profil va asosiy sozlamalarni saqlash; ism o'zgarsa panelda ham yangilash.
- [x] Integratsiya va jo'natma tugmalarini aniq demo holatiga moslash.

Tayyorlik mezoni: CSV haqiqatan yuklanadi va ochiladi; PDF chop etish oynasida to'g'ri ko'rinadi; hisobot qiymatlari yaratilgan paytdagi tanlangan davrga mos.

### 8-bosqich — oddiy foydalanuvchi uchun kichik kabinet

- [x] Tashkilot va xizmatlar katalogi, qidiruv, filtr va tafsilot sahifasini yaratish.
- [x] Faol xizmat uchun demo ariza qoldirishni ulash.
- [x] “Mening arizalarim” sahifasida faqat shu demo profil arizalarini ko'rsatish.
- [x] Administratorga o'z tashkilotidagi arizalarni ko'rsatish va holatini o'zgartirish imkonini berish.
- [x] Holat o'zgarishini muxlis kabinetida aks ettirish; takror bosishda dublikat ariza yaratmaslik.

Tayyorlik mezoni: muxlis ariza qoldiradi, administrator uni ko'radi va tasdiqlaydi, muxlis yangi holatni ko'radi. Ariza tushumni avtomatik oshirmaydi.

Chegara: tadbirlar katalogi va baho/fikr qoldirish umumiy mahsulot rejasida qoladi; ushbu demo uchun xizmat → ariza jarayoni yetarli.

### 9-bosqich — sayqallash va tekshirish

- [x] Ko'rinadigan asosiy tugmalarni qayta ko'rish: amal bajaradi yoki nega mavjud emasligini bildiradi.
- [x] Bo'sh ro'yxat, natija topilmasligi, xato forma, saqlash xatosi va yuklanish holatlarini tekshirish.
- [x] Formani ochish/yopish, klaviatura bilan ishlash va telefondagi asosiy jarayonlarni tekshirish.
- [x] Ma'lumotlar saqlanishi, reset, tashkilotlar ajralishi va moliyaviy hisoblar uchun muhim avtomatlashtirilgan tekshiruvlarni qo'shish.
- [x] `pnpm build` bajarish; brauzerda quyidagi to'liq ssenariyni sinash.
- [x] `DEMO_GUIDE.md` yozish: ishga tushirish, profillar, 5–7 daqiqalik namoyish tartibi, reset va demo chegaralari.

Tayyorlik mezoni: asosiy ssenariy uzilmaydi, konsolda jiddiy xato yo'q, build o'tadi va taqdimot boshlang'ich holatini tiklash mumkin.

## 7. Yakuniy qabul ssenariysi

1. Demoni tiklash va administrator sifatida kirish.
2. “Suzish abonementi” xizmatini 200 000 so'm narxda yaratish.
3. Yangi mijoz qo'shish va unga 2 birlik sotuv kiritish.
4. Moliya va Dashboardda tanlangan davr tushumi 400 000 so'mga oshganini tekshirish.
5. 100 000 so'm xarajat kiritib, foyda o'zgarishi 300 000 so'm ekanini tekshirish.
6. Sahifani yangilash va yozuvlar saqlanganini ko'rish.
7. Rahbar profiliga o'tib shu tashkilot natijalarini ko'rish, KPI maqsadi va DRI bahosini o'zgartirish.
8. Moliyaviy hisobotni CSV va chop etish/PDF orqali olish.
9. Analitik profilida tahlillar ochilishini va asosiy yozuvlarni o'zgartirish imkoni yo'qligini tekshirish.
10. Super administrator orqali boshqa tashkilotga o'tib, uning ma'lumotlari ajralganini tekshirish.
11. Muxlis profilida xizmatga ariza berish; administrator bilan holatini o'zgartirib, muxlisda natijani ko'rish.
12. Sotuvni bekor qilish, xizmatni arxivlash va moliyaviy tarix buzilmaganini tekshirish.
13. Demoni yana tiklash; yangi yozuvlar yo'qolib, boshlang'ich holat qaytishini tekshirish.

## 8. Ustuvorlik va bajarish tartibi

- **P0 — asosiy ishlaydigan demo:** 1–5-bosqichlar, 7-bosqichdagi moliyaviy eksport va 9-bosqichning shu qismlarga tegishli tekshiruvlari.
- **P1 — to'liq rol va tahlil namoyishi:** 6-bosqich, 7-bosqichning qolgan ishlari, 8-bosqich va yakuniy to'liq tekshiruv.
- **Keyingi alohida bosqich:** haqiqiy backend, qurilmalararo ishlash va tashqi integratsiyalar faqat shunday talab paydo bo'lganda.

Implementatsiya 1 → 2 → 3 → 4 → 5 tartibida boshlanadi. Asosiy zanjir tekshirilgach, eksport va qolgan bo'limlar ulanadi. Har bosqich tugaganda shu fayldagi tegishli kataklar belgilanadi; bajarilmagan imkoniyat tayyor deb yozilmaydi.


## 9. UI bo‘yicha tuzatish — original dizayn saqlanadi

Foydalanuvchi talabi: mavjud UI qaytarildi. Demo ishlashini qo‘shish mavjud sahifalarni almashtirishga ruxsat bermaydi.

- Login yana oldingi email/parol formasida. Yagona Super Administrator credentiali `/api/auth/login` orqali tekshiriladi; boshqa demo rollar account menyusidan tanlanadi.
- Original AppShell, account menyusi va tashkilot almashtirish ko‘rinishi qaytdi. Rol tanlash account menyusiga ulandi.
- Dashboard original to‘rtta karta, SVG area grafik, yarim doira DRI gauge, KPI jadvali va tavsiya panellari bilan ishlaydi.
- Tashkilotlar, xizmatlar va CRM o‘zining original formalari, kartalari, filtrlari va detail oynalaridan foydalanadi. Ma’lumotlar `useLegacyRecords` orqali umumiy xotiraga yoziladi.
- Moliya original grafik va jadvallarni saqlaydi; sotuv/xarajat tugmalari va fayl yuklash ulab qo‘yildi.
- KPI original sakkizta ko‘rsatkich bilan, DRI original 12 indikatorli sahifasi bilan, reyting original TOP-10 va olti mezonli ko‘rinishi bilan ishlaydi. Saqlangan DRI tegishli tashkilotning reytingdagi raqamli mezoniga ta’sir qiladi; qolgan reyting mezonlari tarixiy namuna.
- Hisobotlar original 10 ta shablon, tarix va rejalashtirish UI’sini saqlaydi. Yangi moliyaviy/boshqaruv hisobotlaridan real CSV va PDF olinadi. Qolgan shablon va tarixiy yozuvlar namuna sifatida belgilangan.
- Sozlamalar original tablar bilan qaytdi. Profilni tahrirlash va demo reset kichik qo‘shimcha karta orqali bajariladi. Tashqi integratsiyalar namuna ekanligi ko‘rsatilgan.
- Yangi muxlis katalogi va arizalar sahifalari saqlangan; ular uchun ilgari alohida UI mavjud emas edi.
- `lib/demo/model.mjs` saqlash va hisoblash qoidalarini, `lib/demo/legacy.mjs` original UI uchun ma’lumot moslashtirishni bajaradi.
- Tekshiruv: original login va asosiy sahifa strukturalari, eski formalardan sotuvgacha jarayon, KPI/DRI, CSV/PDF, rollar, mobil profil va reset, xotira xatolari.

Foydalanish va taqdimot tartibi: [DEMO_GUIDE.md](DEMO_GUIDE.md).
