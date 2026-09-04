/*
 * Big Data va analitik modul — TZ 13-bo'lim.
 *
 * Korrelyatsiya, regressiya va anomaliya ko'rsatkichlari saqlanmaydi —
 * ular quyidagi vaqt qatorlaridan real statistik formulalar bilan hisoblanadi.
 */

/* 24 oylik kuzatuv davri: 2025-yil yanvardan 2026-yil dekabrgacha */
export const OBSERVATION_LABELS = [
  "25/Yan", "25/Fev", "25/Mar", "25/Apr", "25/May", "25/Iyn",
  "25/Iyl", "25/Avg", "25/Sen", "25/Okt", "25/Noy", "25/Dek",
  "26/Yan", "26/Fev", "26/Mar", "26/Apr", "26/May", "26/Iyn",
  "26/Iyl", "26/Avg", "26/Sen", "26/Okt", "26/Noy", "26/Dek",
];

/*
 * Tahlil o'zgaruvchilari. Har birida 24 ta oylik kuzatuv.
 * Qatorlar ataylab turlicha xatti-harakatga ega:
 *  - o'suvchi trend (DRI, ARPU, RD);
 *  - mavsumiy tebranish (EC — sport mavsumiga bog'liq);
 *  - kamayuvchi trend (CH — chiqib ketish darajasi).
 * Shu sabab korrelyatsiya matritsasi kuchli musbat, kuchsiz va manfiy
 * bog'lanishlarni birgalikda ko'rsatadi.
 */
export const VARIABLES = [
  {
    id: "dri",
    code: "DRI",
    label: "Raqamli rivojlanish indeksi",
    unit: " ball",
    series: [56, 57, 56, 58, 57, 59, 60, 59, 61, 60, 62, 63, 61, 62, 64, 63, 65, 64, 66, 65, 67, 66, 68, 68],
  },
  {
    id: "mf",
    code: "MF",
    label: "Muxlislar faolligi",
    unit: "%",
    series: [58, 60, 61, 60, 63, 64, 63, 66, 67, 66, 69, 70, 62, 64, 63, 66, 68, 67, 70, 72, 74, 73, 75, 74],
  },
  {
    id: "rd",
    code: "RD",
    label: "Raqamli daromad",
    unit: " mln",
    series: [52, 51, 68, 49, 64, 84, 66, 71, 79, 78, 88, 110, 70, 64, 81, 70, 90, 87, 95, 94, 115, 106, 131, 128],
  },
  {
    id: "mx",
    code: "MX",
    label: "Marketing xarajati",
    unit: " mln",
    series: [18, 22, 26, 21, 28, 32, 24, 30, 34, 29, 38, 42, 26, 28, 31, 30, 34, 38, 36, 41, 44, 46, 51, 55],
  },
  {
    id: "arpu",
    code: "ARPU",
    label: "Bir foydalanuvchi daromadi",
    unit: " ming",
    series: [104, 108, 105, 110, 109, 113, 110, 116, 114, 118, 117, 121, 113, 117, 115, 120, 118, 122, 120, 125, 123, 127, 126, 128],
  },
  {
    id: "rr",
    code: "RR",
    label: "Retention Rate",
    unit: "%",
    series: [72, 73, 74, 73, 75, 74, 76, 75, 77, 76, 78, 77, 75, 76, 77, 76, 78, 78, 79, 80, 80, 81, 81, 81],
  },
  {
    id: "ec",
    code: "EC",
    label: "E-chipta savdosi",
    unit: " ming",
    series: [12, 14, 19, 22, 24, 16, 11, 13, 21, 26, 23, 15, 14, 16, 22, 25, 27, 18, 12, 15, 24, 29, 26, 17],
  },
  {
    id: "ch",
    code: "CH",
    label: "Chiqib ketish darajasi",
    unit: "%",
    series: [14.2, 13.6, 14.0, 13.3, 13.5, 12.7, 13.4, 12.6, 12.9, 12.2, 12.4, 11.6, 12.6, 11.9, 12.3, 11.5, 11.8, 11.2, 11.6, 10.8, 11.0, 10.3, 10.1, 9.6],
  },
];

/* Anomaliya tahlili uchun oylik umumiy daromad (mln so'm).
   9-oyda derbi o'yini sababli keskin o'sish, 19-oyda inshoot ta'miri
   sababli pasayish kuzatilgan — algoritm ularni trenddan chetlanish
   sifatida mustaqil aniqlaydi. */
export const ANOMALY_SERIES = {
  label: "Oylik umumiy daromad",
  unit: " mln",
  values: [
    980, 1010, 1060, 1040, 1090, 1130, 1080, 1140, 1560, 1180, 1240, 1290,
    1210, 1250, 1300, 1280, 1340, 1380, 940, 1420, 1470, 1500, 1560, 1620,
  ],
};

export const ANOMALY_NOTES = {
  8: "Toshkent derbisi — bir martalik chipta va merchandising portlashi",
  18: "Asosiy inshoot ta'mirlash uchun 3 haftaga yopilgan",
};

/* Tashkilotlarni ko'p o'lchovli taqqoslash — TZ 16-bo'lim mezonlari */
export const RADAR_AXES = [
  { id: "economic", label: "Iqtisodiy samaradorlik" },
  { id: "digital", label: "Raqamli rivojlanish" },
  { id: "marketing", label: "Marketing samaradorligi" },
  { id: "fans", label: "Muxlislar faolligi" },
  { id: "services", label: "Raqamli xizmatlar ulushi" },
  { id: "innovation", label: "Innovatsion faollik" },
];

export const RADAR_ORGANIZATIONS = [
  { id: "olimp", label: "Olimp sport klubi", tone: "a", values: [87, 82, 91, 78, 84, 72] },
  { id: "befit", label: "BeFit Eco fitness markazi", tone: "b", values: [81, 79, 86, 74, 88, 70] },
  { id: "humo", label: "Humo Arena", tone: "c", values: [76, 74, 68, 81, 72, 65] },
  { id: "tennis", label: "Milliy tennis markazi", tone: "d", values: [68, 63, 59, 66, 61, 58] },
];

/* ---------- Statistik funksiyalar ---------- */

const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;

/** Pirson korrelyatsiya koeffitsiyenti */
export const pearson = (x, y) => {
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < x.length; i += 1) {
    const a = x[i] - mx;
    const b = y[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
};

/** Eng kichik kvadratlar usuli: y = a + b·x */
export const linearRegression = (x, y) => {
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let den = 0;
  for (let i = 0; i < x.length; i += 1) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = my - slope * mx;
  const r = pearson(x, y);
  return { slope, intercept, r, r2: r * r, n: x.length };
};

/** Bog'lanish kuchini izohlash */
export const describeStrength = (r) => {
  const abs = Math.abs(r);
  if (abs >= 0.9) return "Juda kuchli";
  if (abs >= 0.7) return "Kuchli";
  if (abs >= 0.5) return "O'rtacha";
  if (abs >= 0.3) return "Kuchsiz";
  return "Bog'lanish yo'q";
};

/**
 * Anomaliyalarni aniqlash: qatorga chiziqli trend moslashtiriladi,
 * qoldiqlar (residual) hisoblanadi va |qoldiq| > threshold·σ bo'lgan
 * kuzatuvlar anomaliya deb belgilanadi.
 */
export const detectAnomalies = (values, threshold = 2) => {
  const index = values.map((_, i) => i);
  const { slope, intercept } = linearRegression(index, values);
  const fitted = index.map((i) => intercept + slope * i);
  const residuals = values.map((v, i) => v - fitted[i]);
  const mr = mean(residuals);
  const sigma = Math.sqrt(
    residuals.reduce((sum, r) => sum + (r - mr) ** 2, 0) / residuals.length,
  );
  return {
    fitted,
    residuals,
    sigma,
    bound: threshold * sigma,
    points: residuals.map((r, i) => ({
      index: i,
      residual: r,
      z: sigma === 0 ? 0 : r / sigma,
      isAnomaly: sigma > 0 && Math.abs(r) > threshold * sigma,
    })),
  };
};

export const getVariable = (id) => VARIABLES.find((item) => item.id === id) ?? VARIABLES[0];
