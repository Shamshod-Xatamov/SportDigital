/*
 * Boshqaruv paneli uchun demo (mock) ma'lumotlar.
 * Keyingi bosqichda real API bilan almashtiriladi — struktura shunga tayyor.
 */

export const PERIODS = [
  { id: "day", label: "Kun" },
  { id: "week", label: "Hafta" },
  { id: "month", label: "Oy" },
  { id: "quarter", label: "Chorak" },
  { id: "year", label: "Yil" },
];

/*
 * Har bir davr uchun: stat kartalar, daromad grafigi (jami + raqamli, mln so'm)
 * va raqamli daromad manbalari uchun umumiy hajm.
 */
export const DASHBOARD = {
  day: {
    compareLabel: "kechagi kunga nisbatan",
    stats: {
      revenue: { value: 42.6, unit: "mln so'm", delta: 6.2, spark: [28, 31, 27, 33, 35, 32, 38, 36, 40, 42.6] },
      users: { value: 4812, delta: 3.4, spark: [4100, 4230, 4180, 4390, 4460, 4420, 4610, 4700, 4750, 4812] },
      fanActivity: { value: 71, delta: 1.2, spark: [66, 67, 69, 68, 70, 69, 70, 71, 70, 71] },
      dri: { value: 68, delta: 0.4, spark: [66, 66, 67, 67, 67, 68, 68, 68, 68, 68] },
    },
    chart: {
      labels: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"],
      total: [2.4, 3.8, 5.1, 4.6, 5.8, 7.9, 8.4, 4.6],
      digital: [1.1, 1.9, 2.6, 2.2, 3.0, 4.4, 4.9, 2.8],
    },
    digitalTotal: 22.9,
  },
  week: {
    compareLabel: "o'tgan haftaga nisbatan",
    stats: {
      revenue: { value: 298, unit: "mln so'm", delta: 4.8, spark: [242, 250, 246, 262, 270, 266, 281, 288, 292, 298] },
      users: { value: 12640, delta: 5.1, spark: [10900, 11150, 11080, 11460, 11720, 11690, 12050, 12280, 12470, 12640] },
      fanActivity: { value: 72, delta: 2.5, spark: [66, 67, 68, 67, 69, 70, 69, 71, 72, 72] },
      dri: { value: 68, delta: 0.9, spark: [65, 66, 66, 67, 67, 67, 68, 68, 68, 68] },
    },
    chart: {
      labels: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
      total: [34, 38, 36, 41, 47, 56, 46],
      digital: [14, 16, 15, 18, 21, 27, 22],
    },
    digitalTotal: 133,
  },
  month: {
    compareLabel: "o'tgan oyga nisbatan",
    stats: {
      revenue: { value: 1284, unit: "mln so'm", delta: 8.1, spark: [980, 1010, 1090, 1060, 1130, 1180, 1160, 1220, 1250, 1284] },
      users: { value: 28450, delta: 7.6, spark: [23400, 24100, 24700, 24500, 25600, 26200, 26800, 27400, 27900, 28450] },
      fanActivity: { value: 74, delta: 12.4, spark: [62, 64, 63, 66, 68, 67, 70, 72, 73, 74] },
      dri: { value: 68, delta: 2.1, spark: [61, 62, 63, 64, 64, 65, 66, 67, 67, 68] },
    },
    chart: {
      labels: ["1-hafta", "2-hafta", "3-hafta", "4-hafta"],
      total: [284, 302, 336, 362],
      digital: [116, 128, 152, 178],
    },
    digitalTotal: 574,
  },
  quarter: {
    compareLabel: "o'tgan chorakka nisbatan",
    stats: {
      revenue: { value: 3860, unit: "mln so'm", delta: 11.4, spark: [2900, 3020, 3150, 3080, 3260, 3390, 3480, 3620, 3740, 3860] },
      users: { value: 31200, delta: 6.9, spark: [26100, 26800, 27300, 27100, 28200, 28900, 29600, 30300, 30800, 31200] },
      fanActivity: { value: 73, delta: 5.8, spark: [64, 65, 67, 66, 68, 69, 71, 72, 72, 73] },
      dri: { value: 68, delta: 4.6, spark: [58, 59, 61, 62, 63, 64, 65, 66, 67, 68] },
    },
    chart: {
      labels: ["Iyul", "Avgust", "Sentabr"],
      total: [1180, 1290, 1390],
      digital: [498, 562, 636],
    },
    digitalTotal: 1696,
  },
  year: {
    compareLabel: "o'tgan yilga nisbatan",
    stats: {
      revenue: { value: 15620, unit: "mln so'm", delta: 18.2, spark: [10400, 10900, 11600, 11400, 12300, 12900, 13400, 14100, 14900, 15620] },
      users: { value: 34780, delta: 21.4, spark: [24300, 25600, 26800, 26500, 28400, 29700, 30900, 32400, 33700, 34780] },
      fanActivity: { value: 74, delta: 9.3, spark: [61, 63, 65, 64, 67, 68, 70, 72, 73, 74] },
      dri: { value: 68, delta: 7.9, spark: [52, 54, 56, 58, 59, 61, 63, 65, 66, 68] },
    },
    chart: {
      labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
      total: [980, 1040, 1180, 1120, 1260, 1330, 1180, 1290, 1390, 1460, 1540, 1620],
      digital: [340, 380, 450, 430, 510, 560, 498, 562, 636, 690, 740, 800],
    },
    digitalTotal: 6596,
  },
};

/* Raqamli daromad manbalari — ulushlar barcha davrlarda bir xil (demo) */
export const DIGITAL_SOURCES = [
  { label: "Elektron chiptalar", share: 0.34 },
  { label: "Obuna xizmatlari", share: 0.22 },
  { label: "Reklama", share: 0.18 },
  { label: "Homiylik", share: 0.16 },
  { label: "Merchandising", share: 0.1 },
];

/* KPI monitoring — TZ 12-bo'lim (oylik kesim, demo) */
export const KPI_ROWS = [
  { code: "MF", name: "Muxlislar faolligi", current: "74%", previous: "66%", change: 12.1, target: "80%", progress: 92 },
  { code: "SD", name: "Xizmatlar daromadliligi", current: "118", previous: "104", change: 13.5, target: "125", progress: 94 },
  { code: "XS", name: "Xizmat samaradorligi", current: "86%", previous: "81%", change: 6.2, target: "90%", progress: 96 },
  { code: "MS", name: "Marketing samaradorligi", current: "142%", previous: "117%", change: 21.4, target: "120%", progress: 100 },
  { code: "CR", name: "Conversion Rate", current: "4.8%", previous: "4.1%", change: 17.1, target: "5.5%", progress: 87 },
  { code: "RR", name: "Retention Rate", current: "81%", previous: "78%", change: 3.8, target: "85%", progress: 95 },
  { code: "ARPU", name: "Foydalanuvchi daromadi", current: "128K", previous: "118K", change: 8.5, target: "150K", progress: 85 },
  { code: "DRI", name: "Raqamli rivojlanish", current: "68", previous: "64", change: 6.3, target: "75", progress: 91 },
];

/* Decision Support — avtomatik tavsiyalar (TZ 15-bo'lim, demo) */
export const RECOMMENDATIONS = [
  {
    id: 1,
    tone: "up",
    title: "E-chipta savdosi 18% oshdi",
    text: "Elektron chipta asosidagi paketli xizmatlarni joriy etish maqsadga muvofiq.",
  },
  {
    id: 2,
    tone: "warn",
    title: "4 214 muxlis 30 kundan beri sust",
    text: "Sust segmentga individual taklif va push-xabarnoma yuborish tavsiya etiladi.",
  },
  {
    id: 3,
    tone: "info",
    title: "Instagram — eng samarali kanal (ER 6.4%)",
    text: "Kanal byudjetini 15% oshirish marketing ROI ko'rsatkichini yaxshilaydi.",
  },
];

/* Muxlislar segmentatsiyasi — TZ 8-bo'lim (demo) */
export const SEGMENTS = [
  { label: "Juda faol", count: 3980, share: 12, tone: "s1" },
  { label: "Faol", count: 8620, share: 26, tone: "s2" },
  { label: "O'rtacha", count: 10270, share: 31, tone: "s3" },
  { label: "Sust", count: 6300, share: 19, tone: "s4" },
  { label: "Faol emas", count: 3980, share: 12, tone: "s5" },
];

export const formatNumber = (value) =>
  String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
