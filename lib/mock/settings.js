export const SETTINGS_TABS = [
  {
    id: "general",
    label: "Umumiy",
    description: "Tashkilot va hududiy sozlamalar",
    icon: "organization",
  },
  {
    id: "notifications",
    label: "Bildirishnomalar",
    description: "Ogohlantirishlar va hisobotlar",
    icon: "bell",
  },
  {
    id: "security",
    label: "Xavfsizlik",
    description: "Kirish va sessiyalar nazorati",
    icon: "shield",
  },
  {
    id: "integrations",
    label: "Integratsiyalar",
    description: "Tashqi xizmatlar va API",
    icon: "plug",
  },
];

export const DEFAULT_SETTINGS = {
  organization: {
    name: "Olimp sport klubi",
    shortName: "Olimp SK",
    category: "Professional sport klubi",
    taxId: "309 874 215",
    email: "info@olimpsk.uz",
    phone: "+998 71 245 18 80",
    website: "https://olimpsk.uz",
    address: "Toshkent shahri, Chilonzor tumani, Bunyodkor ko'chasi 47",
  },
  localization: {
    language: "uz",
    timezone: "Asia/Tashkent",
    currency: "UZS",
    dateFormat: "DD.MM.YYYY",
    weekStart: "monday",
  },
  notifications: {
    digest: "weekly",
    email: "aziz.karimov@olimpsk.uz",
    kpiAlerts: true,
    driUpdates: true,
    financeAlerts: true,
    crmDigest: false,
    marketingReports: true,
    systemUpdates: false,
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: "30",
    auditLog: true,
  },
  integrations: {
    payme: true,
    click: true,
    oneId: false,
    telegram: true,
    apiAccess: false,
  },
};

export const NOTIFICATION_OPTIONS = [
  {
    id: "kpiAlerts",
    title: "Kritik KPI ogohlantirishlari",
    description: "Ko'rsatkich maqsaddan 15% dan ko'p chetlashganda xabar yuboriladi.",
    channels: ["Platforma", "Email"],
  },
  {
    id: "driUpdates",
    title: "DRI bahosi yangilanishi",
    description: "Indikator ballari yoki raqamli yetuklik darajasi o'zgarganda xabar bering.",
    channels: ["Platforma", "Email"],
  },
  {
    id: "financeAlerts",
    title: "Moliyaviy ogohlantirishlar",
    description: "Yirik tranzaksiya, xarajat limiti va rentabellik bo'yicha muhim xabarlar.",
    channels: ["Platforma", "Email"],
  },
  {
    id: "crmDigest",
    title: "CRM faollik xulosasi",
    description: "Muxlislar segmenti va faollikdagi o'zgarishlar bo'yicha davriy xulosa.",
    channels: ["Email"],
  },
  {
    id: "marketingReports",
    title: "Marketing kampaniyalari",
    description: "Kampaniya tugashi, ROI va konversiya natijalari bo'yicha hisobot.",
    channels: ["Platforma", "Email"],
  },
  {
    id: "systemUpdates",
    title: "Tizim yangiliklari",
    description: "Yangi imkoniyatlar va rejalashtirilgan texnik ishlar haqida ma'lumot.",
    channels: ["Email"],
  },
];

export const ACTIVE_SESSIONS = [
  {
    id: "current",
    device: "Windows 11 · Chrome",
    location: "Toshkent, O'zbekiston",
    activity: "Hozir faol",
    current: true,
    icon: "desktop",
  },
  {
    id: "mobile",
    device: "Samsung Galaxy S24",
    location: "Toshkent, O'zbekiston",
    activity: "Bugun, 09:18",
    current: false,
    icon: "mobile",
  },
];

export const INTEGRATION_OPTIONS = [
  {
    id: "payme",
    name: "Payme Business",
    short: "P",
    tone: "payme",
    description: "To'lovlar va tranzaksiyalarni avtomatik sinxronlash.",
    lastSync: "5 daqiqa oldin",
  },
  {
    id: "click",
    name: "Click Business",
    short: "C",
    tone: "click",
    description: "Elektron to'lovlar va qaytarish operatsiyalari.",
    lastSync: "12 daqiqa oldin",
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    short: "T",
    tone: "telegram",
    description: "Rahbarlar uchun tezkor KPI va tizim bildirishnomalari.",
    lastSync: "Faol",
  },
  {
    id: "oneId",
    name: "OneID",
    short: "ID",
    tone: "oneid",
    description: "Yagona identifikatsiya tizimi orqali xavfsiz kirish.",
    lastSync: "Sozlanmagan",
  },
];
