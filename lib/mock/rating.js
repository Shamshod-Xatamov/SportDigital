/*
 * Sport tashkilotlari reytingi — TZ 16-bo'lim.
 *
 * Reyting balli va o'rinlar saqlanmaydi: har bir tashkilotning 6 ta mezon
 * bo'yicha bahosi vazn koeffitsiyentlari bilan yig'iladi va o'rinlar shu
 * yig'indi asosida avtomatik aniqlanadi.
 *
 * Baholar boshqa modullar bilan muvofiq — Analitika radar profilidagi
 * to'rt tashkilot bir xil qiymatlarga ega.
 */

export const RATING_PERIODS = [
  { id: "q4-2025", label: "IV/2025" },
  { id: "q1-2026", label: "I/2026" },
  { id: "q2-2026", label: "II/2026" },
  { id: "q3-2026", label: "III/2026", current: true },
];

/* Mezonlar va vazn koeffitsiyentlari — Σ Wi = 1,00 */
export const CRITERIA = [
  { id: "economic", label: "Iqtisodiy samaradorlik", short: "Iqtisodiy", weight: 0.2, tone: "c1" },
  { id: "digital", label: "Raqamli rivojlanish", short: "Raqamli", weight: 0.25, tone: "c2" },
  { id: "marketing", label: "Marketing samaradorligi", short: "Marketing", weight: 0.15, tone: "c3" },
  { id: "fans", label: "Muxlislar faolligi", short: "Muxlislar", weight: 0.15, tone: "c4" },
  { id: "services", label: "Raqamli xizmatlar ulushi", short: "Xizmatlar", weight: 0.15, tone: "c5" },
  { id: "innovation", label: "Innovatsion faollik", short: "Innovatsiya", weight: 0.1, tone: "c6" },
];

export const ORG_TYPES = [
  "Professional klub",
  "Fitness markaz",
  "Sport majmuasi",
  "Sport maktabi",
  "Federatsiya",
  "Akademiya",
];

/*
 * scores — joriy davr (III/2026) uchun 6 mezon bahosi (0–100).
 * history — oldingi 3 davr uchun umumiy ball (o'rin dinamikasi uchun).
 */
export const ORGANIZATIONS = [
  {
    id: "olimp",
    name: "Olimp sport klubi",
    type: "Professional klub",
    region: "Toshkent shahri",
    scores: { economic: 87, digital: 82, marketing: 91, fans: 78, services: 84, innovation: 72 },
    history: [80.2, 81.4, 82.4],
  },
  {
    id: "befit",
    name: "BeFit Eco fitness markazi",
    type: "Fitness markaz",
    region: "Toshkent shahri",
    scores: { economic: 81, digital: 79, marketing: 86, fans: 74, services: 88, innovation: 70 },
    history: [72.1, 75.2, 78.1],
  },
  {
    id: "humo",
    name: "Humo Arena",
    type: "Sport majmuasi",
    region: "Toshkent shahri",
    scores: { economic: 76, digital: 74, marketing: 68, fans: 81, services: 72, innovation: 65 },
    history: [76.8, 75.4, 74.2],
  },
  {
    id: "chempion",
    name: "Chempion fitness tarmog'i",
    type: "Fitness markaz",
    region: "Samarqand viloyati",
    scores: { economic: 74, digital: 77, marketing: 79, fans: 70, services: 81, innovation: 68 },
    history: [62.1, 66.4, 71.2],
  },
  {
    id: "tennis",
    name: "Milliy tennis markazi",
    type: "Sport majmuasi",
    region: "Toshkent shahri",
    scores: { economic: 68, digital: 63, marketing: 59, fans: 66, services: 61, innovation: 58 },
    history: [67.4, 65.8, 64.2],
  },
  {
    id: "andijon",
    name: "Andijon universal sport majmuasi",
    type: "Sport majmuasi",
    region: "Andijon viloyati",
    scores: { economic: 66, digital: 61, marketing: 64, fans: 69, services: 58, innovation: 54 },
    history: [57.1, 59.4, 61.2],
  },
  {
    id: "vatan",
    name: "Vatan futbol akademiyasi",
    type: "Akademiya",
    region: "Toshkent viloyati",
    scores: { economic: 62, digital: 66, marketing: 61, fans: 72, services: 64, innovation: 61 },
    history: [52.4, 56.8, 61.2],
  },
  {
    id: "olimpiya",
    name: "Respublika olimpiya zaxiralari kolleji",
    type: "Sport maktabi",
    region: "Toshkent shahri",
    scores: { economic: 59, digital: 57, marketing: 48, fans: 61, services: 52, innovation: 56 },
    history: [58.9, 57.4, 56.4],
  },
  {
    id: "buxoro",
    name: "Buxoro sport federatsiyasi",
    type: "Federatsiya",
    region: "Buxoro viloyati",
    scores: { economic: 57, digital: 54, marketing: 52, fans: 58, services: 49, innovation: 51 },
    history: [50.8, 52.1, 53.4],
  },
  {
    id: "yosh",
    name: "Yosh avlod sport maktabi",
    type: "Sport maktabi",
    region: "Farg'ona viloyati",
    scores: { economic: 54, digital: 51, marketing: 46, fans: 63, services: 47, innovation: 48 },
    history: [49.2, 50.6, 51.8],
  },
  {
    id: "navoiy",
    name: "Navoiy sport majmuasi",
    type: "Sport majmuasi",
    region: "Navoiy viloyati",
    scores: { economic: 51, digital: 46, marketing: 43, fans: 54, services: 42, innovation: 44 },
    history: [47.6, 47.1, 46.8],
  },
  {
    id: "surxon",
    name: "Surxon sport maktabi",
    type: "Sport maktabi",
    region: "Surxondaryo viloyati",
    scores: { economic: 47, digital: 41, marketing: 38, fans: 49, services: 36, innovation: 39 },
    history: [43.2, 42.6, 42.1],
  },
];

/* ---------- Hisob-kitob ---------- */

/** Umumiy ball = Σ (Wi × Xi) */
export const compositeScore = (scores) =>
  CRITERIA.reduce((sum, c) => sum + c.weight * scores[c.id], 0);

/** Mezonning umumiy balldagi ulushi */
export const criterionShare = (scores, criterion) =>
  criterion.weight * scores[criterion.id];

/** Barcha davrlar uchun ball qatori (tarix + joriy) */
export const scoreSeries = (org) => [...org.history, compositeScore(org.scores)];

/**
 * Har bir davr uchun o'rinlarni hisoblaydi.
 * Natija: { [orgId]: [o'rin1, o'rin2, o'rin3, o'rin4] }
 */
export const buildRankHistory = () => {
  const periods = RATING_PERIODS.length;
  const table = {};
  ORGANIZATIONS.forEach((org) => {
    table[org.id] = [];
  });
  for (let p = 0; p < periods; p += 1) {
    const ordered = [...ORGANIZATIONS]
      .map((org) => ({ id: org.id, score: scoreSeries(org)[p] }))
      .sort((a, b) => b.score - a.score);
    ordered.forEach((row, index) => {
      table[row.id].push(index + 1);
    });
  }
  return table;
};

/** Joriy reyting — ball bo'yicha tartiblangan */
export const buildRanking = () => {
  const ranks = buildRankHistory();
  return [...ORGANIZATIONS]
    .map((org) => {
      const score = compositeScore(org.scores);
      const orgRanks = ranks[org.id];
      const rank = orgRanks[orgRanks.length - 1];
      const previousRank = orgRanks[orgRanks.length - 2];
      const previousScore = org.history[org.history.length - 1];
      return {
        org,
        score,
        rank,
        previousRank,
        rankChange: previousRank - rank,
        scoreChange: score - previousScore,
        ranks: orgRanks,
      };
    })
    .sort((a, b) => a.rank - b.rank);
};

/** DRI shkalasiga mos daraja */
export const getLevel = (score) => {
  if (score >= 81) return { id: "very-high", label: "Juda yuqori" };
  if (score >= 61) return { id: "high", label: "Yuqori" };
  if (score >= 41) return { id: "medium", label: "O'rtacha" };
  if (score >= 21) return { id: "low", label: "Past" };
  return { id: "very-low", label: "Juda past" };
};
