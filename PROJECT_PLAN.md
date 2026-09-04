# SportDigital — UI/UX Implementation Plan

## 1. TZ tahlili — mahsulotni tushunish

SportDigital — sport tashkilotlarining raqamli transformatsiyasini boshqarish, monitoring qilish va tahlil etish platformasi. PhD dissertatsiya (08.00.16 — Raqamli iqtisodiyot) doirasida ishlab chiqiladi, ya'ni platforma bir vaqtning o'zida **amaliy boshqaruv vositasi** va **ilmiy-tadqiqot instrumenti** bo'lishi kerak.

Asosiy qiymat zanjiri (TZ 20-bo'lim):

`Sport tashkilotlari → Data Collection → Central DB → Processing → Big Data/Analytics → KPI & DRI → Prognoz → Decision Support → Dashboard → Boshqaruv qarori`

### 1.1. Ilmiy yadro (platformani boshqalardan ajratib turadigan qism)

1. **DRI — Digital Readiness Index** (TZ 11): 12 indikator, har biri 0–100 ball, vaznli yig'indi `DRI = Σ(Wi × Xi)`. Natija 5 daraja: juda past (0–20) → juda yuqori (81–100). Bu platformaning markaziy ilmiy tushunchasi — UIda hamma joyda ko'rinishi kerak.
2. **KPI tizimi** (TZ 12): MF, SD, XS, MS, CR, RR, ARPU, DRI — har biri joriy qiymat / oldingi davr / o'zgarish % / maqsad / bajarilish darajasi bilan.
3. **Marketing ROI** (TZ 9): `(daromad − xarajat) / xarajat × 100%` — avtomatik hisoblanadi.
4. **Prognozlash** (TZ 14): 2026–2030, chiziqli/ko'p omilli regressiya, vaqt qatorlari, trend.
5. **Decision Support** (TZ 15): KPI + chegaralar asosida avtomatik matnli tavsiyalar.
6. **Samaradorlik oynasi** (TZ 26): "Platformagacha / Platformadan keyin" taqqoslash — dissertatsiya natijalarini ko'rsatish uchun.

### 1.2. Foydalanuvchi rollari (TZ 3)

1. **Super Administrator** — tashkilotlar, foydalanuvchilar, tizim sozlamalari, loglar, umumiy reyting.
2. **Tashkilot administratori** — faqat o'z tashkiloti: ma'lumot kiritish, xizmatlar, moliya, marketing.
3. **Rahbar** — analitik kabinet: Dashboard, KPI, moliya, DRI, prognozlar, tavsiyalar.
4. **Analitik** — statistika, vaqt qatorlari, korrelyatsiya, ekonometrika, taqqoslash.
5. **Oddiy foydalanuvchi / muxlis** — tashkilotlar, xizmatlar, tadbirlar, baho/fikr.

### 1.3. Modullar xaritasi (TZ 4–17)

| Modul | TZ | Mazmuni |
|---|---|---|
| Auth + rollar | 4.1 | Login, parol tiklash, profil, RBAC, 2FA (keyin) |
| Dashboard | 5 | 16+ ko'rsatkich, kun/hafta/oy/chorak/yil filtrlari |
| Tashkilotlar reyestri | 6 | 16 maydon, 8 toifa (federatsiya, klub, maktab, fitness...) |
| Sport xizmatlari | 7 | 9 guruh, narx/daromad/foydalanish/baho |
| Fan Engagement / CRM | 8 | Muxlis profili, 5 faollik segmenti, avtomatik faollik hisobi |
| Raqamli marketing | 9 | 8 kanal (Telegram, Instagram...), CTR/ER/CR, ROI |
| Moliya / monetizatsiya | 10 | 11 daromad manbasi, rentabellik, ARPU, raqamli ulush |
| DRI | 11 | 12 indikator, vaznli indeks, 5 daraja |
| KPI monitoring | 12 | 8 KPI, maqsad va bajarilish |
| Big Data / Analitika | 13 | Trend, korrelyatsiya, regressiya, segmentatsiya, anomaliya |
| Prognozlash | 14 | 8 ko'rsatkich, 2026–2030 |
| Decision Support | 15 | Avtomatik tavsiyalar |
| Reyting | 16 | TOP-10 raqamlashtirilgan tashkilotlar |
| Hisobotlar | 17 | 10 tur, PDF/Excel/CSV eksport |
| Import | 19 | Qo'lda, Excel/CSV, API |

### 1.4. Loyiha cheklovlari va kelishuvlar

- **Byudjet:** $200 — barcha ma'lumotlar **mock/simulyatsiya**, real backend hisob-kitob keyingi bosqichga (AI-BPM Monitor loyihasidagi kabi frontend data layer).
- **Tillar:** UZ (asosiy), RU keyin; struktura i18n-ga tayyor bo'lsin.
- **Menyu (TZ 23):** Bosh sahifa, Dashboard, Tashkilotlar, Xizmatlar, Muxlislar/CRM, Marketing, Moliya, Raqamli rivojlanish, KPI, Analitika, Prognoz, Reyting, Hisobotlar, Sozlamalar.
- **Grafiklar (TZ 18):** Line, Bar, Pie, Area, Radar, Gauge, Heatmap, KPI Cards — barchasi qo'lda SVG bilan yozilgan (kutubxonasiz). Holat: Line/Area (Dashboard, Moliya, KPI), Bar (Marketing), Gauge (KPI, DRI), Heatmap + Scatter + Radar + Pie (Analitika).

## 2. Texnik stack (Business_Process bilan bir xil tashkilot, boshqa dizayn)

- Package manager: **pnpm**
- Framework: **Next.js (App Router)**, React, JSX
- Styling: **global CSS design tokenlari** + komponent classlari (Tailwind yo'q)
- Fontlar: `next/font` orqali self-host
- Landing statik prerender, interaktiv qismlar kichik client enhancer
- Keyingi bosqich: mock data layer (`lib/mock/`), app shell `app/(product)/`

## 3. Vizual yo'nalish — "Night Stadium / Scoreboard Editorial"

AI-BPM Monitor (iliq ivory + ember) va standart AI-ko'k/binafsha gradientlardan ongli ravishda uzoqlashamiz. SportDigital identiteti — **kechki stadion transляциyasi + sport plakati estetikasi**:

- **Fon ritmi:** to'q "pitch night" yashil-qora seksiyalar (hero, footer) bilan ohak-oq "chalk" seksiyalar almashinadi.
- **Brand aksent:** **volt/lime** (sport ekipirovkasi rangi) — CTA, jonli ko'rsatkichlar, urg'ular.
- **Ikkinchi darajali:** chuqur maydon yashili, chartlar uchun teal/clay; statuslar an'anaviy (yashil/amber/qizil) + ikonka/matn.
- **Tipografika:** displey — kondensat sport-plakat shrifti (Barlow Condensed), matn — toza grotesk (Instrument Sans), raqamlar/scoreboard — mono (Chivo Mono, tabular).
- **Motivlar:** yugurish yo'lakchasi chiziqlari, tablo (scoreboard) plitkalari, KPI ticker-lenta, katta "jersey" raqamlari bilan seksiya nomerlari, prожектор radial yoritish.
- Glassmorphism, neon-gradient va boshqa "standart AI" bezaklar ishlatilmaydi.

## 4. Bosqichma-bosqich yo'l xaritasi

### Phase 1 — Landing page (HOZIRGI FOKUS)

- [x] TZni chuqur tahlil qilish va plan tuzish.
- [x] Next.js skeletini yaratish (pnpm, App Router, fontlar, tokenlar).
- [x] Design tokenlar: ranglar, spacing, radius, shadow, typography.
- [x] Sticky header + responsive navigation + mobil menyu.
- [x] Hero: stadion-kecha muhiti, va'da, CTA, jonli dashboard preview (mini tablo: KPI, DRI gauge, sparkline).
- [x] KPI ticker-lenta (marquee).
- [x] Muammo → Yechim bloki (before/after jadvali bilan).
- [x] Qiymat zanjiri: Data → Monitoring → Analitika → DRI/KPI → Prognoz → Qaror.
- [x] Modullar seksiyasi (16 karta, 4 guruh).
- [x] DRI seksiyasi: 12 indikator, formula, 5 darajali shkala vizuali + KPI kartalari.
- [x] Rollar seksiyasi (5 rol).
- [x] Reyting + prognoz 2026–2030 teaser.
- [x] Xavfsizlik/ishonch strip.
- [x] Yakuniy CTA (volt fon) + footer.
- [x] Scroll reveal, counterlar, reduced-motion hurmati.
- [x] Build, responsive (1440/390, horizontal overflow 0px) va accessibility QA.
- [ ] Landing vizual yo'nalishini client bilan tasdiqlash.

### Phase 2 — App foundation

- [x] Login ekrani (mock auth): markazlashgan karta, validatsiya, parolni tiklash rejimi.
- [x] App shell: night sidebar (TZ 23 menyu, 4 guruh), mobil drawer, user karta.
- [x] Mock data layer boshlanishi: `lib/mock/dashboard.js` (5 davr kesimi, KPI, tavsiyalar, segmentlar).
- [x] Login submit → /dashboard redirect.

### Phase 3 — Asosiy ekranlar (mock data bilan)

- [x] Rahbar Dashboard: 4 stat karta (sparkline), interaktiv daromad grafigi (hover tooltip), DRI gauge, daromad manbalari, KPI jadvali, Decision Support tavsiyalari, muxlislar segmentlari — kun/hafta/oy/chorak/yil filtrlari bilan.
- [x] Tashkilotlar reyestri (jadval + detail).
- [x] Sport xizmatlari (katalog + detail).
- [x] Muxlislar / CRM (segmentlar + reyestr + profil).
- [x] Marketing: 8 kanal samaradorligi, ROI formulasi (avtomatik), oylik xarajat/daromad grafigi, kampaniyalar reyestri, konversiya voronkasi.
- [x] Moliya: 11 daromad manbasi, xarajat tarkibi, sof foyda grafigi, rentabellik, ARPU, o'rtacha tranzaksiya, raqamli ulush, operatsiyalar reyestri.
- [x] DRI hisoblagich sahifasi: 12 indikator, vaznli indeks, yo'nalishlar kesimi, interaktiv baholash va avtomatik tavsiyalar.
- [x] KPI monitoring: 8 KPI (joriy/oldingi/o'zgarish/maqsad/bajarilish), gauge kartalar, kategoriya filtri, oy/chorak/yil kesimi, reyting paneli, 12 oylik trend + formula oynasi.
- [x] Analitika: korrelyatsiya matritsasi (heatmap), regressiya tahlili (scatter + R² donut), tashkilotlarni ko'p o'lchovli taqqoslash (radar), anomaliyalarni aniqlash (trenddan chetlanish, ±2σ). Barcha statistika real formulalar bilan hisoblanadi.
- [x] Prognoz: 8 ko'rsatkich, fan chart (bashorat oralig'i 80%/95%), 3 stsenariy, 3 model, gorizont tanlash (2028/2029/2030), yillik qiymatlar va dumbbell taqqoslash. Trend, R², MAPE va oraliqlar real formulalar bilan hisoblanadi.
- [x] Reyting: 6 mezon vaznli baholash (Σ Wi × Xi), TOP-10, podium, ball taqsimoti (darajalar bo'yicha nuqtali diagramma), o'zgarishlar ro'yxati, mezonlar bo'yicha stacked bar va tashkilot profili.
- [ ] Decision Support tavsiyalar.
- [x] Hisobotlar: 10 turdagi shablon, PDF/Excel/CSV formatlari, tarix reyestri va rejalashtirilgan jo'natmalar UI.
- [ ] "Platforma samaradorligi" before/after oynasi (TZ 26).

### Phase 4 — Sayqallash va topshirish

- [ ] Empty/loading/error holatlari, mobil optimizatsiya.
- [ ] RU tili, foydalanuvchi yo'riqnomasi, texnik hujjat.

## 5. Landing qabul mezonlari

- 5–8 soniyada "bu sport tashkilotlari uchun raqamli boshqaruv platformasi" ekani anglashiladi.
- Vizual identitet avvalgi loyihalardan va standart AI-landinglardan aniq farq qiladi.
- 360px+ ekranlarda horizontal scroll yo'q; klaviatura navigatsiyasi ishlaydi.
- Ranglar faqat CSS custom property orqali; animatsiyalar `prefers-reduced-motion`ga bo'ysunadi.
- `pnpm build` xatosiz o'tadi.
