export const DRI_PERIOD = {
  label: "2026-yil · III chorak",
  organization: "Olimp sport klubi",
  updatedAt: "5-sentabr, 01:42",
  previousScore: 64,
  targetScore: 75,
};

export const DRI_LEVELS = [
  { id: "very-low", label: "Juda past", min: 0, max: 20, tone: "critical" },
  { id: "low", label: "Past", min: 21, max: 40, tone: "warning" },
  { id: "medium", label: "O'rtacha", min: 41, max: 60, tone: "developing" },
  { id: "high", label: "Yuqori", min: 61, max: 80, tone: "good" },
  { id: "very-high", label: "Juda yuqori", min: 81, max: 100, tone: "excellent" },
];

export const DRI_GROUPS = [
  {
    id: "foundation",
    label: "Texnologik tayanch",
    description: "Infratuzilma, IoT va axborot xavfsizligi",
    icon: "server",
  },
  {
    id: "services",
    label: "Raqamli xizmatlar",
    description: "Mobil servislar, CRM va elektron to'lovlar",
    icon: "layers",
  },
  {
    id: "data",
    label: "Ma'lumotlar va avtomatlashtirish",
    description: "Big Data, sun'iy intellekt va boshqaruv",
    icon: "data",
  },
  {
    id: "growth",
    label: "Raqamli o'sish",
    description: "Marketing va innovatsion tashabbuslar",
    icon: "growth",
  },
];

export const DRI_INDICATORS = [
  {
    id: "infrastructure",
    code: "DRI-01",
    label: "Raqamli infratuzilma",
    description: "Tarmoq, server va texnik ta'minot tayyorligi",
    group: "foundation",
    weight: 10,
    score: 74,
    previous: 70,
  },
  {
    id: "digital-services",
    code: "DRI-02",
    label: "Raqamli xizmatlar",
    description: "Onlayn xizmatlar qamrovi va foydalanish darajasi",
    group: "services",
    weight: 10,
    score: 66,
    previous: 62,
  },
  {
    id: "automation",
    code: "DRI-03",
    label: "Boshqaruv avtomatlashuvi",
    description: "Ichki jarayonlarning raqamlashtirilgan ulushi",
    group: "data",
    weight: 10,
    score: 64,
    previous: 59,
  },
  {
    id: "big-data",
    code: "DRI-04",
    label: "Big Data texnologiyalari",
    description: "Katta ma'lumotlarni yig'ish va tahlil qilish",
    group: "data",
    weight: 8,
    score: 58,
    previous: 54,
  },
  {
    id: "ai",
    code: "DRI-05",
    label: "Sun'iy intellekt",
    description: "AI asosidagi prognoz va qarorlarni qo'llab-quvvatlash",
    group: "data",
    weight: 6,
    score: 56,
    previous: 50,
  },
  {
    id: "iot",
    code: "DRI-06",
    label: "IoT texnologiyalari",
    description: "Sport obyektlaridagi ulangan qurilmalar qamrovi",
    group: "foundation",
    weight: 6,
    score: 50,
    previous: 44,
  },
  {
    id: "mobile",
    code: "DRI-07",
    label: "Mobil xizmatlar",
    description: "Mobil ilova va moslashtirilgan servislar sifati",
    group: "services",
    weight: 8,
    score: 79,
    previous: 75,
  },
  {
    id: "crm",
    code: "DRI-08",
    label: "CRM tizimi",
    description: "Muxlis va mijoz ma'lumotlaridan foydalanish",
    group: "services",
    weight: 8,
    score: 68,
    previous: 63,
  },
  {
    id: "digital-marketing",
    code: "DRI-09",
    label: "Raqamli marketing",
    description: "Kanallar integratsiyasi va kampaniyalar samaradorligi",
    group: "growth",
    weight: 8,
    score: 82,
    previous: 77,
  },
  {
    id: "payments",
    code: "DRI-10",
    label: "Elektron to'lovlar",
    description: "Naqd pulsiz to'lovlar ulushi va qulayligi",
    group: "services",
    weight: 10,
    score: 88,
    previous: 84,
  },
  {
    id: "security",
    code: "DRI-11",
    label: "Ma'lumotlar xavfsizligi",
    description: "Himoya siyosati, nazorat va uzluksizlik",
    group: "foundation",
    weight: 8,
    score: 71,
    previous: 67,
  },
  {
    id: "innovation",
    code: "DRI-12",
    label: "Raqamli innovatsiyalar",
    description: "Yangi texnologiyalarni sinash va joriy etish",
    group: "growth",
    weight: 8,
    score: 47,
    previous: 42,
  },
];

export const DRI_TREND = [
  { label: "Aprel", score: 56 },
  { label: "May", score: 59 },
  { label: "Iyun", score: 61 },
  { label: "Iyul", score: 64 },
  { label: "Avgust", score: 66 },
  { label: "Sentabr", score: 68 },
];

export const DRI_RECOMMENDATIONS = [
  {
    indicatorId: "innovation",
    priority: "Yuqori ustuvorlik",
    title: "Raqamli innovatsiyalar portfelini yarating",
    body: "90 kunlik pilotlar rejasini tuzing va har bir tashabbus uchun o'lchanadigan natija belgilang.",
    action: "3 ta pilot tashabbus",
  },
  {
    indicatorId: "iot",
    priority: "Yuqori ustuvorlik",
    title: "IoT kuzatuvini bitta obyektdan boshlang",
    body: "Energiya sarfi va tashrif oqimini sensorlar orqali kuzatish uchun kichik pilot ishga tushiring.",
    action: "+6 ball salohiyat",
  },
  {
    indicatorId: "ai",
    priority: "Rivojlantirish",
    title: "AI uchun amaliy foydalanish holatini tanlang",
    body: "Xizmatlarga talab prognozi yoki mijoz murojaatlarini tasniflashdan boshlash tavsiya etiladi.",
    action: "1 ta use-case",
  },
];

export function calculateDri(indicators, scores) {
  const totalWeight = indicators.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  const weighted = indicators.reduce(
    (sum, item) => sum + item.weight * Number(scores[item.id] ?? item.score),
    0,
  );
  return weighted / totalWeight;
}

export function getDriLevel(score) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  return DRI_LEVELS.find((level) => normalized >= level.min && normalized <= level.max) ?? DRI_LEVELS[0];
}

export function getIndicatorStatus(score) {
  if (score >= 81) return { label: "Kuchli", tone: "excellent" };
  if (score >= 61) return { label: "Barqaror", tone: "good" };
  if (score >= 41) return { label: "Rivojlantirish", tone: "developing" };
  return { label: "Kritik", tone: "critical" };
}

export function calculateGroupScore(groupId, scores) {
  const groupIndicators = DRI_INDICATORS.filter((item) => item.group === groupId);
  return calculateDri(groupIndicators, scores);
}
