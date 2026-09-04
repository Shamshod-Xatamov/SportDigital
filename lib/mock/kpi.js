/*
 * KPI monitoring moduli — TZ 12-bo'lim.
 *
 * Har bir KPI bo'yicha: joriy qiymat, oldingi davr qiymati, o'zgarish foizi,
 * maqsad qiymati va bajarilish darajasi ko'rsatiladi.
 * O'zgarish foizi va bajarilish darajasi saqlanmaydi — avtomatik hisoblanadi.
 *
 * Qiymatlar boshqa modullar bilan muvofiq:
 *  - MS (142%)   → Marketing moduli ROI ko'rsatkichi;
 *  - ARPU (128)  → Moliya moduli ARPU (127 991 so'm);
 *  - DRI (68)    → Dashboard va landing DRI indeksi.
 */

export const KPI_PERIODS = [
  { id: "month", label: "Oy" },
  { id: "quarter", label: "Chorak" },
  { id: "year", label: "Yil" },
];

export const KPI_CATEGORIES = [
  { id: "audience", label: "Auditoriya" },
  { id: "revenue", label: "Daromad" },
  { id: "efficiency", label: "Samaradorlik" },
  { id: "digital", label: "Raqamli rivojlanish" },
];

export const MONTH_LABELS = [
  "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
  "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek",
];

export const KPIS = [
  {
    code: "MF",
    name: "Muxlislar faolligi",
    category: "audience",
    unit: "%",
    decimals: 0,
    formula: "MF = (faol muxlislar / jami muxlislar) × 100%",
    description:
      "Muxlislarning tashrif, xarid va raqamli faollik bo'yicha umumiy jalb qilinganlik darajasi. CRM modulidagi segmentatsiya asosida hisoblanadi.",
    source: "Fan Engagement / CRM moduli",
    values: {
      month: { current: 74, previous: 66, target: 80 },
      quarter: { current: 73, previous: 68, target: 80 },
      year: { current: 71, previous: 63, target: 78 },
    },
    trend: [62, 64, 63, 66, 68, 67, 70, 72, 74, 73, 75, 74],
  },
  {
    code: "SD",
    name: "Xizmatlar daromadliligi",
    category: "revenue",
    unit: "",
    suffix: " ball",
    decimals: 0,
    formula: "SD = (xizmatlardan daromad / xizmat xarajatlari) × 100",
    description:
      "Sport xizmatlarining daromadlilik indeksi. Bazaviy davr 100 ball deb olinadi — 100 dan yuqori qiymat xizmatlar rentabelligi oshganini bildiradi.",
    source: "Moliya va Sport xizmatlari modullari",
    values: {
      month: { current: 118, previous: 104, target: 125 },
      quarter: { current: 116, previous: 106, target: 125 },
      year: { current: 114, previous: 101, target: 120 },
    },
    trend: [101, 104, 106, 105, 109, 112, 110, 114, 116, 118, 117, 118],
  },
  {
    code: "XS",
    name: "Xizmat ko'rsatish samaradorligi",
    category: "efficiency",
    unit: "%",
    decimals: 0,
    formula: "XS = (ko'rsatilgan xizmatlar / rejalashtirilgan xizmatlar) × 100%",
    description:
      "Rejalashtirilgan xizmatlar hajmining amalda bajarilish darajasi. Inshootlar bandligi va mashg'ulotlar jadvali asosida.",
    source: "Sport xizmatlari moduli",
    values: {
      month: { current: 86, previous: 81, target: 90 },
      quarter: { current: 85, previous: 82, target: 90 },
      year: { current: 84, previous: 79, target: 88 },
    },
    trend: [79, 80, 82, 81, 83, 84, 83, 85, 86, 85, 87, 86],
  },
  {
    code: "MS",
    name: "Marketing samaradorligi",
    category: "revenue",
    unit: "%",
    decimals: 0,
    formula: "MS = (marketing daromadi − marketing xarajati) / xarajat × 100%",
    description:
      "Marketing investitsiyalarining qaytimi (ROI). Barcha raqamli kanallar bo'yicha kampaniya natijalari asosida avtomatik hisoblanadi.",
    source: "Raqamli marketing moduli",
    values: {
      month: { current: 142, previous: 117, target: 120 },
      quarter: { current: 138, previous: 121, target: 120 },
      year: { current: 142, previous: 118, target: 125 },
    },
    trend: [112, 118, 121, 117, 124, 129, 126, 133, 138, 140, 141, 142],
  },
  {
    code: "CR",
    name: "Conversion Rate",
    category: "efficiency",
    unit: "%",
    decimals: 1,
    formula: "CR = (konversiyalar / tashriflar) × 100%",
    description:
      "Platformaga tashrif buyurgan foydalanuvchilarning maqsadli harakatga (xarid, ro'yxatdan o'tish, obuna) aylanish ulushi.",
    source: "Marketing va CRM modullari",
    values: {
      month: { current: 4.8, previous: 4.1, target: 5.5 },
      quarter: { current: 4.6, previous: 4.2, target: 5.5 },
      year: { current: 4.5, previous: 3.9, target: 5.2 },
    },
    trend: [3.9, 4.0, 4.2, 4.1, 4.3, 4.4, 4.3, 4.5, 4.6, 4.7, 4.8, 4.8],
  },
  {
    code: "RR",
    name: "Retention Rate",
    category: "audience",
    unit: "%",
    decimals: 0,
    formula: "RR = ((davr oxiridagi mijozlar − yangi mijozlar) / davr boshidagi mijozlar) × 100%",
    description:
      "Mijozlarni ushlab qolish darajasi. Obuna va abonement xizmatlarini uzaytirgan foydalanuvchilar ulushini ko'rsatadi.",
    source: "Fan Engagement / CRM moduli",
    values: {
      month: { current: 81, previous: 78, target: 85 },
      quarter: { current: 80, previous: 77, target: 85 },
      year: { current: 79, previous: 75, target: 84 },
    },
    trend: [75, 76, 77, 76, 78, 78, 79, 80, 80, 81, 81, 81],
  },
  {
    code: "ARPU",
    name: "Bir foydalanuvchi daromadi",
    category: "revenue",
    unit: "",
    suffix: " ming",
    decimals: 0,
    formula: "ARPU = jami daromad / to'lovchi foydalanuvchilar soni",
    description:
      "Bir to'lovchi foydalanuvchidan olinadigan o'rtacha oylik daromad (ming so'mda). Monetizatsiya samaradorligining asosiy o'lchovi.",
    source: "Moliya va monetizatsiya moduli",
    values: {
      month: { current: 128, previous: 118, target: 150 },
      quarter: { current: 126, previous: 119, target: 150 },
      year: { current: 122, previous: 112, target: 145 },
    },
    trend: [112, 114, 117, 116, 119, 121, 120, 123, 126, 127, 128, 128],
  },
  {
    code: "DRI",
    name: "Raqamli rivojlanish indeksi",
    category: "digital",
    unit: "",
    suffix: " ball",
    decimals: 0,
    formula: "DRI = Σ (Wi × Xi)",
    description:
      "12 ta indikator bo'yicha vaznli baholash natijasi. Tashkilotning raqamli yetuklik darajasini 0–100 ball oralig'ida aks ettiradi.",
    source: "Raqamli rivojlanish moduli",
    values: {
      month: { current: 68, previous: 64, target: 75 },
      quarter: { current: 67, previous: 63, target: 75 },
      year: { current: 68, previous: 61, target: 75 },
    },
    trend: [61, 62, 63, 63, 64, 65, 65, 66, 67, 67, 68, 68],
  },
];

/* ---------- Avtomatik hisob-kitob ---------- */

/** O'zgarish foizi = (joriy − oldingi) / oldingi × 100% */
export const calcChange = (current, previous) =>
  previous > 0 ? ((current - previous) / previous) * 100 : 0;

/** Bajarilish darajasi = joriy / maqsad × 100% */
export const calcProgress = (current, target) =>
  target > 0 ? (current / target) * 100 : 0;

/** Bajarilish darajasiga qarab holat */
export const getStatus = (progress) => {
  if (progress >= 100) return { id: "reached", label: "Maqsadga erishildi" };
  if (progress >= 90) return { id: "close", label: "Maqsadga yaqin" };
  if (progress >= 75) return { id: "mid", label: "O'rtacha" };
  return { id: "low", label: "E'tibor talab qiladi" };
};

export const getCategory = (id) =>
  KPI_CATEGORIES.find((item) => item.id === id) ?? KPI_CATEGORIES[0];
