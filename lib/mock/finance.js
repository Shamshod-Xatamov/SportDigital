/*
 * Moliya va monetizatsiya moduli — TZ 10-bo'lim.
 * Barcha pul ko'rsatkichlari mln so'mda.
 *
 * Ma'lumotlar boshqa modullar bilan muvofiqlashtirilgan:
 *  - yillik jami daromad 15 620 mln  → Dashboard "Yil" kesimi;
 *  - raqamli daromad 6 596 mln (42,2%) → Dashboard raqamli ulushi;
 *  - marketing xarajati 460 mln       → Marketing moduli jami xarajati.
 */

export const REVENUE_SOURCES = [
  {
    id: "services",
    label: "Sport xizmatlari",
    note: "Mashg'ulot, abonement, inshoot ijarasi",
    amount: 3920,
    previous: 3480,
    kind: "traditional",
    transactions: 28400,
  },
  {
    id: "etickets",
    label: "Elektron chiptalar",
    note: "Onlayn chipta savdosi",
    amount: 2780,
    previous: 2210,
    kind: "digital",
    transactions: 21600,
  },
  {
    id: "sponsorship",
    label: "Homiylik",
    note: "Homiylik shartnomalari",
    amount: 1840,
    previous: 1720,
    kind: "traditional",
    transactions: 42,
  },
  {
    id: "subscription",
    label: "Obuna xizmatlari",
    note: "Premium obuna va raqamli paketlar",
    amount: 1810,
    previous: 1420,
    kind: "digital",
    transactions: 9840,
  },
  {
    id: "advertising",
    label: "Reklama",
    note: "Raqamli va stadion reklamasi",
    amount: 1526,
    previous: 1310,
    kind: "digital",
    transactions: 186,
  },
  {
    id: "merchandising",
    label: "Merchandising",
    note: "Atributika va forma savdosi",
    amount: 1160,
    previous: 980,
    kind: "traditional",
    transactions: 8420,
  },
  {
    id: "media",
    label: "Media huquqlari",
    note: "Translyatsiya huquqlarini sotish",
    amount: 960,
    previous: 940,
    kind: "traditional",
    transactions: 18,
  },
  {
    id: "training",
    label: "Treninglar va seminarlar",
    note: "Murabbiylar uchun ta'lim dasturlari",
    amount: 610,
    previous: 520,
    kind: "traditional",
    transactions: 1240,
  },
  {
    id: "streaming",
    label: "Onlayn translyatsiyalar",
    note: "Pay-per-view va jonli efir",
    amount: 480,
    previous: 290,
    kind: "digital",
    transactions: 6180,
  },
  {
    id: "licensing",
    label: "Litsenziyalash",
    note: "Brend va logotip litsenziyalari",
    amount: 344,
    previous: 310,
    kind: "traditional",
    transactions: 24,
  },
  {
    id: "other",
    label: "Boshqa xizmatlar",
    note: "Kafe, parking va qo'shimcha xizmatlar",
    amount: 190,
    previous: 168,
    kind: "traditional",
    transactions: 3420,
  },
];

export const EXPENSE_CATEGORIES = [
  { id: "payroll", label: "Xodimlar maoshi", amount: 4320, previous: 3960 },
  { id: "facilities", label: "Inshoot va kommunal", amount: 2180, previous: 2040 },
  { id: "events", label: "Musobaqa va tadbirlar", amount: 1480, previous: 1290 },
  { id: "equipment", label: "Sport inventari", amount: 1240, previous: 1120 },
  { id: "maintenance", label: "Ta'mirlash va texnik xizmat", amount: 720, previous: 680 },
  { id: "it", label: "Raqamli infratuzilma", amount: 680, previous: 470 },
  { id: "taxes", label: "Soliq va yig'imlar", amount: 560, previous: 520 },
  { id: "marketing", label: "Marketing", amount: 460, previous: 390 },
  { id: "other", label: "Boshqa xarajatlar", amount: 200, previous: 180 },
];

export const MONTH_LABELS = [
  "Yan", "Fev", "Mar", "Apr", "May", "Iyn",
  "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek",
];

/* Oylik dinamika — mln so'm */
export const FINANCE_TREND = {
  revenue: [980, 1040, 1180, 1140, 1280, 1350, 1220, 1320, 1410, 1480, 1560, 1660],
  expense: [760, 800, 900, 870, 970, 1010, 930, 1000, 1060, 1110, 1170, 1260],
};

export const FINANCE_METRICS = {
  payingCustomers: 10170,
  totalTransactions: 73000,
  previousRevenue: 13210,
  previousExpense: 10580,
};

export const PAYMENT_METHODS = ["Payme", "Click", "Uzcard", "Humo", "Bank o'tkazmasi", "Naqd"];

export const TRANSACTION_TYPES = [
  { id: "income", label: "Daromad" },
  { id: "expense", label: "Xarajat" },
];

export const FINANCE_ORGANIZATIONS = [
  "Olimp sport klubi",
  "Humo Arena",
  "Milliy tennis markazi",
  "BeFit Eco fitness markazi",
  "Andijon universal sport majmuasi",
];

export const TRANSACTIONS = [
  {
    id: "TRX-48210",
    type: "income",
    category: "Elektron chiptalar",
    description: "Derbi o'yini — onlayn chipta savdosi (1 240 ta)",
    organization: "Olimp sport klubi",
    amount: 186.4,
    method: "Payme",
    date: "Bugun, 14:20",
    status: "completed",
  },
  {
    id: "TRX-48209",
    type: "income",
    category: "Obuna xizmatlari",
    description: "Premium obuna — sentabr oyi uzaytirishlari",
    organization: "BeFit Eco fitness markazi",
    amount: 142.8,
    method: "Click",
    date: "Bugun, 12:05",
    status: "completed",
  },
  {
    id: "TRX-48208",
    type: "expense",
    category: "Xodimlar maoshi",
    description: "Sentabr oyi uchun murabbiylar maoshi",
    organization: "Olimp sport klubi",
    amount: 358.0,
    method: "Bank o'tkazmasi",
    date: "Bugun, 09:40",
    status: "completed",
  },
  {
    id: "TRX-48207",
    type: "income",
    category: "Homiylik",
    description: "Yillik homiylik shartnomasi — 3-chorak to'lovi",
    organization: "Humo Arena",
    amount: 460.0,
    method: "Bank o'tkazmasi",
    date: "Kecha, 16:30",
    status: "completed",
  },
  {
    id: "TRX-48206",
    type: "income",
    category: "Sport xizmatlari",
    description: "Suzish guruhi abonementlari — haftalik yig'im",
    organization: "Olimp sport klubi",
    amount: 94.2,
    method: "Uzcard",
    date: "Kecha, 15:10",
    status: "completed",
  },
  {
    id: "TRX-48205",
    type: "expense",
    category: "Inshoot va kommunal",
    description: "Avgust oyi uchun kommunal to'lovlar",
    organization: "Humo Arena",
    amount: 182.6,
    method: "Bank o'tkazmasi",
    date: "Kecha, 11:00",
    status: "completed",
  },
  {
    id: "TRX-48204",
    type: "income",
    category: "Merchandising",
    description: "Yangi mavsum formasi — onlayn do'kon savdosi",
    organization: "Olimp sport klubi",
    amount: 78.4,
    method: "Payme",
    date: "2-sentabr, 17:45",
    status: "completed",
  },
  {
    id: "TRX-48203",
    type: "expense",
    category: "Marketing",
    description: "Instagram kampaniyasi — kuzgi abonement",
    organization: "BeFit Eco fitness markazi",
    amount: 24.8,
    method: "Click",
    date: "2-sentabr, 14:20",
    status: "completed",
  },
  {
    id: "TRX-48202",
    type: "income",
    category: "Onlayn translyatsiyalar",
    description: "Pay-per-view — chempionat yarim finali",
    organization: "Humo Arena",
    amount: 62.4,
    method: "Payme",
    date: "1-sentabr, 21:30",
    status: "completed",
  },
  {
    id: "TRX-48201",
    type: "expense",
    category: "Sport inventari",
    description: "Tennis kortlari uchun yangi jihozlar",
    organization: "Milliy tennis markazi",
    amount: 118.0,
    method: "Bank o'tkazmasi",
    date: "1-sentabr, 10:15",
    status: "pending",
  },
  {
    id: "TRX-48200",
    type: "income",
    category: "Reklama",
    description: "Stadion banner reklamasi — 3-chorak",
    organization: "Humo Arena",
    amount: 214.0,
    method: "Bank o'tkazmasi",
    date: "31-avgust, 16:00",
    status: "completed",
  },
  {
    id: "TRX-48199",
    type: "income",
    category: "Treninglar va seminarlar",
    description: "Murabbiylar uchun malaka oshirish kursi",
    organization: "Andijon universal sport majmuasi",
    amount: 48.6,
    method: "Humo",
    date: "31-avgust, 12:40",
    status: "completed",
  },
  {
    id: "TRX-48198",
    type: "expense",
    category: "Raqamli infratuzilma",
    description: "CRM va bilet tizimi yillik litsenziyasi",
    organization: "Olimp sport klubi",
    amount: 96.0,
    method: "Bank o'tkazmasi",
    date: "30-avgust, 09:00",
    status: "completed",
  },
  {
    id: "TRX-48197",
    type: "income",
    category: "Media huquqlari",
    description: "Telekanal bilan translyatsiya shartnomasi",
    organization: "Olimp sport klubi",
    amount: 320.0,
    method: "Bank o'tkazmasi",
    date: "29-avgust, 15:20",
    status: "completed",
  },
  {
    id: "TRX-48196",
    type: "expense",
    category: "Musobaqa va tadbirlar",
    description: "Mintaqaviy turnir tashkiliy xarajatlari",
    organization: "Andijon universal sport majmuasi",
    amount: 142.4,
    method: "Bank o'tkazmasi",
    date: "28-avgust, 11:30",
    status: "completed",
  },
  {
    id: "TRX-48195",
    type: "income",
    category: "Litsenziyalash",
    description: "Brend litsenziyasi — sport kiyimlari ishlab chiqaruvchisi",
    organization: "Olimp sport klubi",
    amount: 86.0,
    method: "Bank o'tkazmasi",
    date: "27-avgust, 14:00",
    status: "completed",
  },
  {
    id: "TRX-48194",
    type: "income",
    category: "Sport xizmatlari",
    description: "Yozgi lager to'lovlari — yakuniy hisob",
    organization: "Milliy tennis markazi",
    amount: 132.8,
    method: "Uzcard",
    date: "26-avgust, 10:10",
    status: "completed",
  },
  {
    id: "TRX-48193",
    type: "expense",
    category: "Ta'mirlash va texnik xizmat",
    description: "Muz maydoni sovutish tizimi profilaktikasi",
    organization: "Humo Arena",
    amount: 74.2,
    method: "Bank o'tkazmasi",
    date: "25-avgust, 13:25",
    status: "completed",
  },
];

/* ---------- Avtomatik hisob-kitob (TZ 10-bo'lim) ---------- */

export const totalRevenue = REVENUE_SOURCES.reduce((sum, item) => sum + item.amount, 0);
export const totalExpense = EXPENSE_CATEGORIES.reduce((sum, item) => sum + item.amount, 0);
export const netProfit = totalRevenue - totalExpense;

export const digitalRevenue = REVENUE_SOURCES.filter((item) => item.kind === "digital").reduce(
  (sum, item) => sum + item.amount,
  0,
);

/** Rentabellik = sof foyda / jami daromad × 100% */
export const profitability = (totalRevenue > 0 ? netProfit / totalRevenue : 0) * 100;

/** Raqamli xizmatlar ulushi */
export const digitalShare = (totalRevenue > 0 ? digitalRevenue / totalRevenue : 0) * 100;

/** ARPU = oylik o'rtacha daromad / to'lovchi mijozlar (so'm) */
export const arpu =
  (totalRevenue / 12 / FINANCE_METRICS.payingCustomers) * 1_000_000;

/** O'rtacha tranzaksiya summasi (so'm) */
export const averageTransaction =
  (totalRevenue / FINANCE_METRICS.totalTransactions) * 1_000_000;

export const calcChange = (current, previous) =>
  previous > 0 ? ((current - previous) / previous) * 100 : 0;
