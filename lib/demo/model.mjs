import { DRI_INDICATORS } from "../mock/dri.js";

export const STORAGE_KEY = "sportdigital.demo.v1";
export const VERSION = 1;
export const ROLES = {
  super: "Super administrator",
  admin: "Tashkilot administratori",
  leader: "Rahbar",
  analyst: "Analitik",
  fan: "Muxlis",
};
export const PROFILES = [
  {
    id: "super",
    role: "super",
    name: "Sardor Aliyev",
    organizationId: "olimp",
  },
  {
    id: "admin",
    role: "admin",
    name: "Madina Usmonova",
    organizationId: "olimp",
  },
  {
    id: "leader",
    role: "leader",
    name: "Aziz Karimov",
    organizationId: "olimp",
  },
  {
    id: "analyst",
    role: "analyst",
    name: "Nodira Saidova",
    organizationId: "olimp",
  },
  { id: "fan", role: "fan", name: "Dilshod Karimov", organizationId: "olimp" },
];
export const PERIODS = {
  day: "Bugun",
  week: "Shu hafta",
  month: "Shu oy",
  quarter: "Shu chorak",
  year: "Shu yil",
};
export const DEFAULT_TARGETS = {
  revenue: 12000000,
  sales: 30,
  customers: 15,
  digital: 80,
  dri: 75,
};
export const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
export const money = (value) =>
  `${new Intl.NumberFormat("uz-UZ").format(Math.round(value))} so'm`;
export const number = (value) =>
  new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 1 }).format(value);
export const homeFor = (role) => (role === "fan" ? "/katalog" : "/dashboard");
export function canVisit(role, path) {
  if (path === "/sozlamalar") return Boolean(ROLES[role]);
  if (role === "fan") return ["/katalog", "/arizalarim"].includes(path);
  if (!ROLES[role] || ["/katalog", "/arizalarim"].includes(path)) return false;
  if (role === "analyst")
    return [
      "/dashboard",
      "/moliya",
      "/kpi",
      "/raqamli-rivojlanish",
      "/analitika",
      "/prognoz",
      "/reyting",
      "/hisobotlar",
    ].includes(path);
  return [
    "/dashboard",
    "/tashkilotlar",
    "/xizmatlar",
    "/muxlislar",
    "/marketing",
    "/moliya",
    "/raqamli-rivojlanish",
    "/kpi",
    "/analitika",
    "/prognoz",
    "/reyting",
    "/hisobotlar",
    "/arizalar",
  ].includes(path);
}
export const canManage = (role) => ["super", "admin"].includes(role);
export const canAssess = (role) => ["super", "admin", "leader"].includes(role);
export const profileOf = (state) =>
  state.profiles.find((p) => p.id === state.session?.profileId);
export const organizationOf = (state) =>
  profileOf(state)?.role === "super"
    ? state.session.organizationId
    : profileOf(state)?.organizationId;
export const scoped = (state, collection) =>
  state[collection].filter(
    (row) => row.organizationId === organizationOf(state),
  );
const ensure = (condition, message) => {
  if (!condition) throw new Error(message);
};
const text = (value, label) => {
  const result = String(value ?? "").trim();
  ensure(
    result.length > 0 && result.length <= 250,
    `${label}: 1–250 belgi kiriting.`,
  );
  return result;
};
const amount = (value, label, zero = false) => {
  const n = Number(value);
  ensure(
    String(value).trim() !== "" &&
      Number.isSafeInteger(n) &&
      n >= (zero ? 0 : 1) &&
      n <= 1000000000000,
    `${label}: to'g'ri musbat butun son kiriting.`,
  );
  return n;
};
export function validDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function periodRange(period, anchor = today()) {
  const [y, m, d] = anchor.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  let start = anchor;
  if (period === "week") {
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
    start = date.toISOString().slice(0, 10);
  }
  if (period === "month") start = `${y}-${String(m).padStart(2, "0")}-01`;
  if (period === "quarter")
    start = `${y}-${String(Math.floor((m - 1) / 3) * 3 + 1).padStart(2, "0")}-01`;
  if (period === "year") start = `${y}-01-01`;
  return { start, end: anchor };
}
export const assessmentKey = (org, date = today()) =>
  `${org}:${date.slice(0, 7)}`;
export function driScores(state, org = organizationOf(state), date = today()) {
  return (
    state.assessments[assessmentKey(org, date)] ??
    Object.fromEntries(
      DRI_INDICATORS.map((i) => [
        i.id,
        org === "humo" ? Math.min(100, i.score + 8) : i.score,
      ]),
    )
  );
}
export function driValue(state, org = organizationOf(state), date = today()) {
  const scores = driScores(state, org, date);
  return (
    DRI_INDICATORS.reduce((sum, i) => sum + i.weight * scores[i.id], 0) /
    DRI_INDICATORS.reduce((sum, i) => sum + i.weight, 0)
  );
}
export function metrics(
  state,
  org = organizationOf(state),
  range = periodRange(state.period),
) {
  const inside = (r) =>
    r.organizationId === org &&
    r.date >= range.start &&
    r.date <= range.end &&
    r.status === "completed";
  const sales = state.sales.filter(inside),
    expenses = state.expenses.filter(inside);
  const revenue = sales.reduce((sum, r) => sum + r.total, 0),
    expense = expenses.reduce((sum, r) => sum + r.total, 0);
  const digitalRevenue = sales
    .filter((r) => r.method !== "Naqd")
    .reduce((sum, r) => sum + r.total, 0);
  return {
    revenue,
    expense,
    profit: revenue - expense,
    sales: sales.length,
    customers: new Set(sales.map((r) => r.customerId)).size,
    digital: revenue ? (digitalRevenue / revenue) * 100 : 0,
    dri: driValue(state, org),
    transactions: sales,
    expenses,
    range,
  };
}
export function customerActivity(state, customerId, anchor = today()) {
  const lastDate = state.sales
    .filter((s) => s.customerId === customerId && s.status === "completed")
    .map((s) => s.date)
    .sort()
    .at(-1);
  if (!lastDate)
    return { label: "Hali xarid qilmagan", lastDate: null, inactive: false };
  const days = Math.floor(
    (Date.parse(anchor) - Date.parse(lastDate)) / 86400000,
  );
  return {
    label: days >= 30 ? "Sust · 30+ kun" : "Faol",
    lastDate,
    inactive: days >= 30,
  };
}
export function seed(anchor = today()) {
  const organizations = [
    {
      id: "olimp",
      name: "Olimp sport klubi",
      category: "Sport klubi",
      region: "Toshkent shahri",
      phone: "+998 71 200 45 50",
      status: "active",
    },
    {
      id: "humo",
      name: "Humo Arena",
      category: "Sport majmuasi",
      region: "Toshkent shahri",
      phone: "+998 71 203 00 00",
      status: "active",
    },
  ];
  const services = organizations.flatMap((org, n) => [
    {
      id: `${org.id}-swim`,
      organizationId: org.id,
      name: n ? "Muz maydoni seansi" : "Suzish guruhi",
      category: n ? "Inshoot ijarasi" : "Mashg'ulot",
      price: n ? 90000 : 420000,
      schedule: "Du–Sh, 09:00–20:00",
      description:
        "Murabbiy nazoratida, zamonaviy sport majmuasida mashg‘ulotlar. Birinchi tashrif uchun administrator bilan vaqtni kelishing.",
      status: "active",
    },
    {
      id: `${org.id}-fitness`,
      organizationId: org.id,
      name: n ? "Individual konkida uchish" : "Fitness abonementi",
      category: "Abonement",
      price: n ? 300000 : 590000,
      schedule: "Har kuni, 07:00–22:00",
      description:
        "Sizga qulay vaqtda sport bilan shug‘ullaning. Barcha darajadagi ishtirokchilar uchun.",
      status: "active",
    },
  ]);
  const customers = organizations.flatMap((org) =>
    [
      "Dilshod Karimov",
      "Shahnoza Umarova",
      "Javohir Sobirov",
      "Malika Ergasheva",
    ].map((name, i) => ({
      id: `${org.id}-customer-${i}`,
      organizationId: org.id,
      name,
      phone: `+998 90 123 45 0${i}`,
      email: "",
      status: "active",
      joinedAt: anchor,
      profileId: org.id === "olimp" && i === 0 ? "fan" : null,
    })),
  );
  const sales = [],
    expenses = [];
  for (const org of organizations) {
    for (let i = 0; i < 24; i++) {
      const date = new Date(`${anchor}T12:00:00Z`);
      date.setUTCDate(date.getUTCDate() - i * 3);
      const service = services.find(
        (s) =>
          s.organizationId === org.id &&
          s.id.endsWith(i % 2 ? "fitness" : "swim"),
      );
      sales.push({
        id: `${org.id}-sale-${i}`,
        organizationId: org.id,
        serviceId: service.id,
        customerId: `${org.id}-customer-${i % 4}`,
        date: date.toISOString().slice(0, 10),
        quantity: 1 + (i % 3),
        unitPrice: service.price,
        total: service.price * (1 + (i % 3)),
        method: i % 4 ? "Karta" : "Naqd",
        status: "completed",
      });
      if (i % 3 === 0)
        expenses.push({
          id: `${org.id}-expense-${i}`,
          organizationId: org.id,
          date: date.toISOString().slice(0, 10),
          category: i % 2 ? "Ijara" : "Ish haqi",
          total: 250000 + i * 12000,
          note: "Boshlang‘ich demo xarajati",
          status: "completed",
        });
    }
  }
  return {
    version: VERSION,
    createdAt: anchor,
    period: "month",
    session: null,
    profiles: structuredClone(PROFILES),
    organizations,
    services,
    customers,
    sales,
    expenses,
    applications: [],
    reports: [],
    targets: {},
    assessments: {},
    settings: {},
  };
}

// All mutations, including UI-hidden actions, pass through this permission boundary.
export function transition(state, action) {
  if (action.type === "login") {
    const p = state.profiles.find((p) => p.id === action.profileId);
    ensure(p, "Demo profil topilmadi.");
    return {
      ...state,
      session: { profileId: p.id, organizationId: p.organizationId },
    };
  }
  if (action.type === "logout") return { ...state, session: null };
  const profile = profileOf(state);
  ensure(profile, "Avval demo profil bilan kiring.");
  const org = organizationOf(state);
  if (action.type === "workspace") {
    ensure(
      profile.role === "super",
      "Tashkilotni faqat super administrator almashtiradi.",
    );
    ensure(
      state.organizations.some(
        (o) => o.id === action.id && o.status === "active",
      ),
      "Faol tashkilotni tanlang.",
    );
    return {
      ...state,
      session: { ...state.session, organizationId: action.id },
    };
  }
  if (action.type === "period") {
    ensure(PERIODS[action.value], "Davr noto‘g‘ri.");
    return { ...state, period: action.value };
  }
  if (action.type === "profile") {
    const name = text(action.name, "Ism");
    return {
      ...state,
      profiles: state.profiles.map((p) =>
        p.id === profile.id ? { ...p, name } : p,
      ),
      settings: {
        ...state.settings,
        [profile.id]: { notifications: Boolean(action.notifications) },
      },
    };
  }
  if (action.type === "preferences") {
    ensure(
      action.value && typeof action.value === "object",
      "Sozlamalar noto‘g‘ri.",
    );
    const organizationValues = action.value.organization;
    const organizations =
      canManage(profile.role) && organizationValues
        ? state.organizations.map((o) =>
            o.id === org
              ? {
                  ...o,
                  name: text(organizationValues.name, "Tashkilot nomi"),
                  phone: text(organizationValues.phone, "Telefon"),
                  presentation: { ...o.presentation, ...organizationValues },
                }
              : o,
          )
        : state.organizations;
    return {
      ...state,
      organizations,
      settings: {
        ...state.settings,
        [profile.id]: { ...state.settings[profile.id], legacy: action.value },
      },
    };
  }
  if (action.type === "kpi-goals") {
    ensure(canAssess(profile.role), "Maqsadni o‘zgartirish huquqi yo‘q.");
    const values = Object.fromEntries(
      Object.entries(action.values).map(([key, value]) => {
        const n = Number(value);
        ensure(
          Number.isFinite(n) && n > 0 && n <= 1e12,
          "Maqsad musbat son bo‘lsin.",
        );
        return [key, n];
      }),
    );
    return {
      ...state,
      settings: { ...state.settings, [`kpi:${org}:${state.period}`]: values },
    };
  }
  if (action.type === "assessment") {
    ensure(canAssess(profile.role), "Baholash uchun huquq yo‘q.");
    const scores = Object.fromEntries(
      DRI_INDICATORS.map((i) => {
        const n = Number(action.scores[i.id]);
        ensure(
          String(action.scores[i.id]).trim() !== "" &&
            Number.isInteger(n) &&
            n >= 0 &&
            n <= 100,
          "Baholar 0–100 oralig‘ida bo‘lsin.",
        );
        return [i.id, n];
      }),
    );
    return {
      ...state,
      assessments: { ...state.assessments, [assessmentKey(org)]: scores },
    };
  }
  if (action.type === "targets") {
    ensure(canAssess(profile.role), "Maqsadni o‘zgartirish huquqi yo‘q.");
    const targets = Object.fromEntries(
      Object.keys(DEFAULT_TARGETS).map((key) => [
        key,
        amount(action.values[key], "Maqsad"),
      ]),
    );
    ensure(
      targets.digital <= 100 && targets.dri <= 100,
      "Foiz va DRI maqsadi 100 dan oshmasin.",
    );
    return {
      ...state,
      targets: { ...state.targets, [`${org}:${state.period}`]: targets },
    };
  }
  if (action.type === "report") {
    ensure(profile.role !== "fan", "Hisobot uchun huquq yo‘q.");
    ensure(
      ["finance", "executive"].includes(action.kind),
      "Hisobot turi noto‘g‘ri.",
    );
    ensure(
      !state.reports.some((r) => r.id === action.id),
      "Hisobot allaqachon yaratildi.",
    );
    const m = metrics(state);
    const organization = state.organizations.find((o) => o.id === org);
    const rows = [
      ...m.transactions.map((s) => ({
        date: s.date,
        kind: "Daromad",
        name:
          state.services.find((x) => x.id === s.serviceId)?.name ?? "Xizmat",
        total: s.total,
      })),
      ...m.expenses.map((e) => ({
        date: e.date,
        kind: "Xarajat",
        name: e.category,
        total: e.total,
      })),
    ];
    return {
      ...state,
      reports: [
        {
          id: action.id,
          organizationId: org,
          organization: organization.name,
          kind: action.kind,
          format: action.format === "CSV" ? "CSV" : "PDF",
          title:
            action.title?.trim() ||
            (action.kind === "finance"
              ? "Moliyaviy hisobot"
              : "Rahbar uchun umumiy hisobot"),
          createdAt: new Date().toISOString(),
          author: profile.name,
          ...m,
          transactions: undefined,
          expenses: undefined,
          rows,
        },
        ...state.reports,
      ],
    };
  }
  if (action.type === "apply") {
    ensure(profile.role === "fan", "Ariza muxlis kabinetidan beriladi.");
    ensure(
      typeof action.id === "string" &&
        !state.applications.some((a) => a.id === action.id),
      "Ariza ID takrorlangan.",
    );
    const service = state.services.find(
      (s) => s.id === action.serviceId && s.status === "active",
    );
    ensure(
      service &&
        state.organizations.some(
          (o) => o.id === service.organizationId && o.status === "active",
        ),
      "Bu xizmat hozir mavjud emas.",
    );
    ensure(
      !state.applications.some(
        (a) =>
          a.profileId === profile.id &&
          a.serviceId === service.id &&
          a.status !== "cancelled",
      ),
      "Bu xizmat uchun arizangiz allaqachon bor.",
    );
    return {
      ...state,
      applications: [
        {
          id: action.id,
          profileId: profile.id,
          organizationId: service.organizationId,
          serviceId: service.id,
          name: profile.name,
          date: today(),
          status: "pending",
        },
        ...state.applications,
      ],
    };
  }
  ensure(canManage(profile.role), "Bu amal uchun administrator huquqi kerak.");
  if (action.type === "application-status") {
    ensure(
      ["approved", "cancelled"].includes(action.status),
      "Ariza holati noto‘g‘ri.",
    );
    ensure(
      state.applications.some(
        (a) => a.id === action.id && a.organizationId === org,
      ),
      "Ariza topilmadi.",
    );
    return {
      ...state,
      applications: state.applications.map((a) =>
        a.id === action.id ? { ...a, status: action.status } : a,
      ),
    };
  }
  if (action.type === "cancel-sale") {
    ensure(
      state.sales.some((s) => s.id === action.id && s.organizationId === org),
      "Sotuv topilmadi.",
    );
    return {
      ...state,
      sales: state.sales.map((s) =>
        s.id === action.id ? { ...s, status: "cancelled" } : s,
      ),
    };
  }
  const collection = action.collection;
  ensure(
    ["organizations", "services", "customers", "expenses", "sales"].includes(
      collection,
    ),
    "Amal topilmadi.",
  );
  if (collection === "organizations")
    ensure(
      profile.role === "super",
      "Tashkilotlarni super administrator boshqaradi.",
    );
  const old = state[collection].find((r) => r.id === action.id);
  if (old && collection !== "organizations")
    ensure(
      old.organizationId === org,
      "Boshqa tashkilot yozuvini o‘zgartirib bo‘lmaydi.",
    );
  if (action.type === "archive" || action.type === "delete") {
    ensure(
      old && ["organizations", "services", "customers"].includes(collection),
      "Yozuv topilmadi.",
    );
    if (collection === "organizations")
      ensure(
        old.id !== org &&
          !state.profiles.some((p) => p.organizationId === old.id),
        "Joriy yoki demo profillar biriktirilgan tashkilotni arxivlab bo‘lmaydi.",
      );
    const linked =
      collection === "organizations"
        ? [
            "services",
            "customers",
            "sales",
            "expenses",
            "applications",
            "reports",
          ].some((c) => state[c].some((r) => r.organizationId === old.id))
        : collection === "services"
          ? state.sales.some((s) => s.serviceId === old.id) ||
            state.applications.some((a) => a.serviceId === old.id)
          : state.sales.some((s) => s.customerId === old.id) ||
            Boolean(old.profileId);
    ensure(
      action.type !== "delete" || !linked,
      "Bu yozuvda tarix bor. Uni arxivlang.",
    );
    return {
      ...state,
      [collection]:
        action.type === "delete"
          ? state[collection].filter((r) => r.id !== action.id)
          : state[collection].map((r) =>
              r.id === action.id ? { ...r, status: "archived" } : r,
            ),
    };
  }
  ensure(action.type === "save", "Amal topilmadi.");
  ensure(
    typeof action.id === "string" && action.id.length > 0,
    "Yozuv ID kerak.",
  );
  const value = action.value;
  let record = {
    id: action.id,
    organizationId: org,
    status: old?.status ?? "active",
  };
  if (collection === "organizations")
    record = {
      id: action.id,
      name: text(value.name, "Nom"),
      category: text(value.category, "Tur"),
      region: text(value.region, "Hudud"),
      phone: text(value.phone, "Telefon"),
      status: old?.status ?? "active",
    };
  if (collection === "services")
    record = {
      ...record,
      name: text(value.name, "Nom"),
      category: text(value.category, "Tur"),
      price: amount(value.price, "Narx"),
      schedule: text(value.schedule, "Jadval"),
      description: text(value.description, "Tavsif"),
    };
  if (collection === "customers") {
    const phone = text(value.phone, "Telefon");
    ensure(
      /^\+?[\d\s()-]{9,22}$/.test(phone),
      "Telefon raqamini to‘g‘ri kiriting.",
    );
    const email = String(value.email ?? "").trim();
    ensure(
      !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      "Email formatini tekshiring.",
    );
    record = {
      ...record,
      name: text(value.name, "Ism"),
      phone,
      email,
      joinedAt: old?.joinedAt ?? today(),
      profileId: old?.profileId ?? null,
    };
  }
  if (["sales", "expenses"].includes(collection)) {
    ensure(
      validDate(value.date) && value.date <= today(),
      "Sana to‘g‘ri va bugundan kech bo‘lmasin.",
    );
    record = { ...record, date: value.date, status: "completed" };
  }
  if (collection === "expenses")
    record = {
      ...record,
      category: text(value.category, "Toifa"),
      total: amount(value.total, "Summa"),
      note: String(value.note ?? "")
        .trim()
        .slice(0, 250),
    };
  if (collection === "sales") {
    ensure(!old, "Sotuv allaqachon saqlangan.");
    const service = state.services.find(
      (s) =>
        s.id === value.serviceId &&
        s.organizationId === org &&
        s.status === "active",
    );
    const customer = state.customers.find(
      (c) =>
        c.id === value.customerId &&
        c.organizationId === org &&
        c.status === "active",
    );
    ensure(service && customer, "Faol xizmat va mijozni tanlang.");
    const quantity = amount(value.quantity, "Miqdor");
    ensure(
      ["Karta", "Naqd", "Onlayn"].includes(value.method),
      "To‘lov usulini tanlang.",
    );
    const total = amount(service.price * quantity, "Jami summa");
    record = {
      ...record,
      serviceId: service.id,
      customerId: customer.id,
      quantity,
      unitPrice: service.price,
      total,
      method: value.method,
    };
  }
  if (["organizations", "services", "customers"].includes(collection)) {
    record.presentation = value.presentation ?? old?.presentation ?? {};
    if (["active", "archived"].includes(value.status))
      record.status = value.status;
  }
  return {
    ...state,
    [collection]: old
      ? state[collection].map((r) => (r.id === action.id ? record : r))
      : [record, ...state[collection]],
  };
}

export function decode(raw) {
  const state = JSON.parse(raw);
  ensure(
    state?.version === VERSION &&
      validDate(state.createdAt) &&
      PERIODS[state.period],
    "Saqlangan demo formati mos emas.",
  );
  for (const key of [
    "profiles",
    "organizations",
    "services",
    "customers",
    "sales",
    "expenses",
    "applications",
    "reports",
  ]) {
    ensure(
      Array.isArray(state[key]) &&
        state[key].every((r) => r && typeof r.id === "string"),
      "Saqlangan ro‘yxat buzilgan.",
    );
    ensure(
      new Set(state[key].map((r) => r.id)).size === state[key].length,
      "Takroriy ID topildi.",
    );
  }
  for (const key of ["targets", "assessments", "settings"])
    ensure(
      state[key] &&
        typeof state[key] === "object" &&
        !Array.isArray(state[key]),
      "Saqlangan sozlamalar buzilgan.",
    );
  ensure(
    PROFILES.every((p) =>
      state.profiles.some(
        (s) => s.id === p.id && s.role === p.role && typeof s.name === "string",
      ),
    ),
    "Demo profillar buzilgan.",
  );
  ensure(
    state.organizations.every((o) => typeof o.name === "string"),
    "Tashkilot ma’lumoti buzilgan.",
  );
  for (const key of [
    "services",
    "customers",
    "sales",
    "expenses",
    "applications",
    "reports",
  ])
    ensure(
      state[key].every((r) =>
        state.organizations.some((o) => o.id === r.organizationId),
      ),
      "Tashkilot bog‘lanishi buzilgan.",
    );
  ensure(
    state.services.every(
      (s) =>
        typeof s.name === "string" &&
        Number.isSafeInteger(s.price) &&
        s.price > 0,
    ),
    "Xizmat ma’lumoti buzilgan.",
  );
  ensure(
    state.customers.every(
      (c) => typeof c.name === "string" && typeof c.phone === "string",
    ),
    "Mijoz ma’lumoti buzilgan.",
  );
  ensure(
    [...state.sales, ...state.expenses].every(
      (r) =>
        validDate(r.date) &&
        Number.isSafeInteger(r.total) &&
        r.total > 0 &&
        ["completed", "cancelled"].includes(r.status),
    ),
    "Moliya ma’lumoti buzilgan.",
  );
  ensure(
    state.sales.every(
      (s) =>
        state.services.some(
          (x) => x.id === s.serviceId && x.organizationId === s.organizationId,
        ) &&
        state.customers.some(
          (x) => x.id === s.customerId && x.organizationId === s.organizationId,
        ) &&
        Number.isSafeInteger(s.quantity) &&
        s.quantity > 0 &&
        Number.isSafeInteger(s.unitPrice) &&
        s.unitPrice > 0 &&
        s.total === s.quantity * s.unitPrice,
    ),
    "Sotuv bog‘lanishi buzilgan.",
  );
  ensure(
    state.profiles.every((p) =>
      state.organizations.some((o) => o.id === p.organizationId),
    ),
    "Profil tashkiloti topilmadi.",
  );
  ensure(
    !state.session ||
      (profileOf(state) &&
        state.organizations.some((o) => o.id === state.session.organizationId)),
    "Sessiya buzilgan.",
  );
  ensure(
    state.reports.every(
      (r) =>
        Array.isArray(r.rows) &&
        r.range &&
        validDate(r.range.start) &&
        validDate(r.range.end) &&
        Number.isFinite(r.revenue) &&
        Number.isFinite(r.expense) &&
        Number.isFinite(r.profit) &&
        r.rows.every(
          (row) =>
            validDate(row.date) &&
            typeof row.name === "string" &&
            Number.isSafeInteger(row.total),
        ),
    ),
    "Hisobot buzilgan.",
  );
  ensure(
    Object.values(state.assessments).every((scores) =>
      DRI_INDICATORS.every(
        (i) =>
          scores &&
          Number.isFinite(scores[i.id]) &&
          scores[i.id] >= 0 &&
          scores[i.id] <= 100,
      ),
    ),
    "DRI baholari buzilgan.",
  );
  for (const key of ["organizations", "services", "customers"])
    ensure(
      state[key].every((r) => ["active", "archived"].includes(r.status)),
      "Yozuv holati buzilgan.",
    );
  ensure(
    state.applications.every(
      (a) =>
        ["pending", "approved", "cancelled"].includes(a.status) &&
        validDate(a.date) &&
        typeof a.name === "string" &&
        state.profiles.some((p) => p.id === a.profileId && p.role === "fan") &&
        state.services.some(
          (s) => s.id === a.serviceId && s.organizationId === a.organizationId,
        ),
    ),
    "Ariza bog‘lanishi buzilgan.",
  );
  ensure(
    Object.values(state.targets).every(
      (targets) =>
        targets &&
        Object.keys(DEFAULT_TARGETS).every(
          (key) => Number.isSafeInteger(targets[key]) && targets[key] > 0,
        ) &&
        targets.digital <= 100 &&
        targets.dri <= 100,
    ),
    "KPI maqsadlari buzilgan.",
  );
  return state;
}
export function csvCell(value) {
  let s = String(value ?? "");
  if (typeof value === "string" && /^[=+@\-\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replaceAll('"', '""')}"`;
}
export function reportCsv(report) {
  const rows = [
    ["SportDigital", report.title],
    ["Tashkilot", report.organization],
    ["Davr", report.range.start, report.range.end],
    ["Tushum", report.revenue],
    ["Xarajat", report.expense],
    ["Sof foyda", report.profit],
    [],
    ["Sana", "Tur", "Tavsif", "Summa (so'm)"],
    ...report.rows.map((r) => [r.date, r.kind, r.name, r.total]),
  ];
  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
