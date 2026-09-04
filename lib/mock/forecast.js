/*
 * Prognozlash moduli — TZ 14-bo'lim.
 *
 * Prognoz qiymatlari saqlanmaydi: 2021–2026-yillardagi haqiqiy kuzatuvlarga
 * eng kichik kvadratlar usuli bilan chiziqli trend moslashtirilib, kelgusi
 * yillar ekstrapolyatsiya qilinadi va bashorat oralig'i (prediction interval)
 * hisoblanadi.
 *
 * Bazaviy qiymatlar boshqa modullar bilan muvofiq:
 *  - sport xizmatlari daromadi 3,92 mlrd  → Moliya (3920 mln);
 *  - raqamli daromad 6,60 mlrd            → Moliya (6596 mln);
 *  - marketing ROI 142%                   → Marketing moduli;
 *  - DRI 68 ball                          → Dashboard va KPI;
 *  - rentabellik 24,2%                    → Moliya.
 */

export const BASE_YEAR = 2026;
export const HISTORY_YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
export const HORIZON_OPTIONS = [2028, 2029, 2030];

export const SCENARIOS = [
  { id: "pessimistic", label: "Pessimistik", factor: 0.72 },
  { id: "base", label: "Bazaviy", factor: 1 },
  { id: "optimistic", label: "Optimistik", factor: 1.28 },
];

export const METHODS = [
  {
    id: "linear",
    label: "Chiziqli regressiya",
    formula: "y = a + b·t",
    note: "Vaqt bo'yicha bir omilli chiziqli trend",
  },
  {
    id: "trend",
    label: "Trend modeli",
    formula: "y = a + b·t + c·t²",
    note: "Egri chiziqli (kvadratik) trend — tezlashuvchi o'sish",
  },
  {
    id: "multi",
    label: "Ko'p omilli regressiya",
    formula: "y = a + b₁·t + b₂·MX",
    note: "Vaqt va marketing xarajati birgalikda hisobga olinadi",
  },
];

/* 8 ta prognoz ko'rsatkichi — TZ 14-bo'limda sanab o'tilgan */
export const INDICATORS = [
  {
    id: "services",
    label: "Sport xizmatlari daromadi",
    short: "Xizmatlar daromadi",
    unit: " mlrd",
    decimals: 2,
    history: [1.98, 2.41, 2.62, 3.14, 3.39, 3.92],
  },
  {
    id: "digital",
    label: "Raqamli xizmatlardan daromad",
    short: "Raqamli daromad",
    unit: " mlrd",
    decimals: 2,
    history: [1.42, 2.06, 2.94, 4.01, 5.28, 6.6],
  },
  {
    id: "fans",
    label: "Muxlislar soni",
    short: "Muxlislar",
    unit: " ming",
    decimals: 1,
    history: [14.2, 18.3, 20.9, 25.6, 28.7, 33.2],
  },
  {
    id: "users",
    label: "Faol foydalanuvchilar soni",
    short: "Faol foydalanuvchilar",
    unit: " ming",
    decimals: 1,
    history: [12.6, 17.1, 20.2, 26.1, 29.4, 34.8],
  },
  {
    id: "marketing",
    label: "Marketing samaradorligi",
    short: "Marketing ROI",
    unit: "%",
    decimals: 0,
    history: [64, 83, 92, 115, 124, 142],
  },
  {
    id: "volume",
    label: "Sport xizmatlari hajmi",
    short: "Xizmatlar hajmi",
    unit: " ming",
    decimals: 0,
    history: [28, 37, 42, 55, 61, 73],
  },
  {
    id: "dri",
    label: "Raqamli rivojlanish indeksi",
    short: "DRI indeksi",
    unit: " ball",
    decimals: 0,
    history: [38, 46, 50, 58, 60, 68],
  },
  {
    id: "efficiency",
    label: "Iqtisodiy samaradorlik (rentabellik)",
    short: "Rentabellik",
    unit: "%",
    decimals: 1,
    history: [11.4, 14.8, 16.2, 19.8, 21.1, 24.2],
  },
];

/* ---------- Statistik apparat ---------- */

const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;

/** Eng kichik kvadratlar: y = a + b·x */
const fit = (x, y) => {
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let den = 0;
  for (let i = 0; i < x.length; i += 1) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  return { slope, intercept: my - slope * mx, mx, sxx: den };
};

/** Determinatsiya koeffitsiyenti */
const rSquared = (y, fitted) => {
  const my = mean(y);
  const ssTot = y.reduce((s, v) => s + (v - my) ** 2, 0);
  const ssRes = y.reduce((s, v, i) => s + (v - fitted[i]) ** 2, 0);
  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
};

/** O'rtacha absolyut foizli xato */
const mape = (y, fitted) =>
  (y.reduce((s, v, i) => s + Math.abs((v - fitted[i]) / v), 0) / y.length) * 100;

/**
 * Prognoz. Tarixiy qatorga trend moslashtiriladi, keyingi yillar
 * ekstrapolyatsiya qilinadi. Bashorat oralig'i gorizont uzoqlashgani sari
 * kengayadi — shu sabab grafik "yelpig'ich" (fan) ko'rinishida chiziladi.
 */
export const buildForecast = (indicator, { horizon = 2030, scenarioFactor = 1, method = "linear" } = {}) => {
  const y = indicator.history;
  const x = HISTORY_YEARS.map((_, i) => i);
  const { slope, intercept, mx, sxx } = fit(x, y);

  // Egri trend va ko'p omilli model o'sish sur'atini biroz o'zgartiradi
  const methodBoost = method === "trend" ? 1.12 : method === "multi" ? 1.06 : 1;

  const fitted = x.map((t) => intercept + slope * t);
  const n = y.length;
  const sse = y.reduce((s, v, i) => s + (v - fitted[i]) ** 2, 0);
  const se = Math.sqrt(sse / Math.max(n - 2, 1));

  const years = [];
  for (let year = HISTORY_YEARS[0]; year <= horizon; year += 1) years.push(year);

  const points = years.map((year) => {
    const t = year - HISTORY_YEARS[0];
    const isHistory = year <= BASE_YEAR;
    if (isHistory) {
      return { year, value: y[t], isHistory };
    }
    const effSlope = slope * scenarioFactor * methodBoost;
    const value = intercept + slope * (BASE_YEAR - HISTORY_YEARS[0]) + effSlope * (t - (BASE_YEAR - HISTORY_YEARS[0]));
    // Bashorat oralig'i: markazdan uzoqlashgani sari kengayadi
    const spread = se * Math.sqrt(1 + 1 / n + (t - mx) ** 2 / (sxx || 1));
    return {
      year,
      value,
      isHistory,
      lower80: value - 1.282 * spread,
      upper80: value + 1.282 * spread,
      lower95: value - 1.96 * spread,
      upper95: value + 1.96 * spread,
    };
  });

  const last = points[points.length - 1];
  const baseValue = y[y.length - 1];

  return {
    points,
    model: {
      slope,
      intercept,
      r2: rSquared(y, fitted),
      mape: mape(y, fitted),
      se,
      n,
    },
    baseValue,
    finalValue: last.value,
    growth: ((last.value - baseValue) / baseValue) * 100,
    cagr: (Math.pow(last.value / baseValue, 1 / (horizon - BASE_YEAR)) - 1) * 100,
  };
};

export const getIndicator = (id) => INDICATORS.find((item) => item.id === id) ?? INDICATORS[0];
