import {
  ORGANIZATIONS as ORGANIZATION_TEMPLATES,
  ORGANIZATION_CATEGORIES,
} from "../mock/organizations.js";
import {
  SERVICES as SERVICE_TEMPLATES,
  SERVICE_CATEGORIES,
} from "../mock/services.js";
import { FANS as FAN_TEMPLATES, FAN_SEGMENTS } from "../mock/fans.js";
import { DASHBOARD, DIGITAL_SOURCES, KPI_ROWS } from "../mock/dashboard.js";
import { REVENUE_SOURCES, EXPENSE_CATEGORIES } from "../mock/finance.js";
import {
  metrics,
  organizationOf,
  profileOf,
  driValue,
  driScores,
  customerActivity,
  periodRange,
  today,
  DEFAULT_TARGETS,
} from "./model.mjs";

const categoryId = (value, options, fallback) =>
  options.find(
    (c) => c.id === value || c.label === value || c.shortLabel === value,
  )?.id ?? fallback;
const categoryLabel = (value, options) =>
  options.find((c) => c.id === value)?.label ?? value;
export function legacyRecords(state, collection) {
  const orgId = organizationOf(state),
    role = profileOf(state).role;
  const organization = (id) => state.organizations.find((o) => o.id === id);
  const rows = state[collection].filter((r) =>
    collection === "organizations"
      ? role === "super" || r.id === orgId
      : r.organizationId === orgId,
  );
  return rows.map((r) => {
    const org =
      collection === "organizations" ? r : organization(r.organizationId);
    const m = metrics(state, org.id, periodRange("month"));
    if (collection === "organizations")
      return {
        ...ORGANIZATION_TEMPLATES[0],
        ...ORGANIZATION_TEMPLATES.find((o) => o.name === r.name),
        ...r.presentation,
        ...r,
        category: categoryId(r.category, ORGANIZATION_CATEGORIES, "club"),
        shortName: r.presentation?.shortName || r.name,
        status: r.status === "archived" ? "inactive" : "active",
        services: state.services.filter(
          (s) => s.organizationId === r.id && s.status === "active",
        ).length,
        users: state.customers.filter((c) => c.organizationId === r.id).length,
        monthlyRevenue: m.revenue / 1e6,
        dri: Math.round(driValue(state, r.id)),
        digitalShare: Math.round(m.digital),
        updatedAt: "Joriy demo ma’lumotlari",
      };
    if (collection === "services") {
      const transactions = m.transactions.filter((s) => s.serviceId === r.id);
      const template = SERVICE_TEMPLATES.find((s) => s.name === r.name);
      return {
        ...SERVICE_TEMPLATES[0],
        ...template,
        ...r.presentation,
        ...r,
        code: r.presentation?.code || r.id.slice(0, 8).toUpperCase(),
        category: categoryId(r.category, SERVICE_CATEGORIES, "training"),
        organization: org.name,
        status: r.status === "archived" ? "paused" : "active",
        monthlyUses: transactions.reduce((n, s) => n + s.quantity, 0),
        monthlyRevenue: transactions.reduce((n, s) => n + s.total, 0) / 1e6,
        reviews: template?.reviews ?? 0,
        rating: template?.rating ?? 0,
        capacity: Number(r.presentation?.capacity ?? 0),
        occupancy: 0,
        updatedAt: "Joriy demo ma’lumotlari",
      };
    }
    const sales = state.sales.filter(
      (s) => s.customerId === r.id && s.status === "completed",
    );
    const activity = customerActivity(state, r.id);
    const segment =
      r.status === "archived" || !sales.length
        ? "inactive"
        : activity.inactive
          ? "low"
          : sales.length > 5
            ? "very-active"
            : "active";
    const score =
      segment === "very-active"
        ? 90
        : segment === "active"
          ? 70
          : segment === "low"
            ? 30
            : 10;
    return {
      ...FAN_TEMPLATES[0],
      ...r.presentation,
      ...r,
      organization: org.name,
      region: r.presentation?.region || org.region,
      segment,
      score,
      channel: r.presentation?.channel || "Mobil ilova",
      joinedAt: r.joinedAt,
      lastActivity: activity.lastDate || "Hali xarid qilmagan",
      lastAction:
        r.status === "archived" ? "Arxivlangan profil" : activity.label,
      purchases: sales.length,
      lifetimeValue: sales.reduce((n, s) => n + s.total, 0),
      visits: sales.reduce((n, s) => n + s.quantity, 0),
      interactions: sales.length,
      interests: r.presentation?.interests || [],
      scores: { visits: score, purchases: score, digital: score, feedback: 0 },
    };
  });
}
export function legacyValue(collection, row) {
  const { presentation, ...snapshot } = row;
  const value = {
    ...row,
    presentation: snapshot,
    status: ["paused", "draft", "inactive", "archived"].includes(row.status)
      ? "archived"
      : "active",
  };
  if (collection === "services") {
    value.category = categoryLabel(row.category, SERVICE_CATEGORIES);
    value.schedule ||= "Jadval belgilanmagan";
    value.description ||= "Tavsif kiritilmagan.";
  }
  if (collection === "organizations") {
    value.category = categoryLabel(row.category, ORGANIZATION_CATEGORIES);
    value.phone ||= "Telefon kiritilmagan";
  }
  return value;
}
export function legacyDashboard(state) {
  const orgId = organizationOf(state),
    period = state.period,
    m = metrics(state),
    initial = structuredClone(DASHBOARD[period]);
  const range = m.range;
  const previousEnd = new Date(`${range.start}T00:00:00Z`);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setUTCDate(
    previousStart.getUTCDate() -
      Math.round((Date.parse(range.end) - Date.parse(range.start)) / 86400000),
  );
  const previous = metrics(state, orgId, {
    start: previousStart.toISOString().slice(0, 10),
    end: previousEnd.toISOString().slice(0, 10),
  });
  const change = (a, b) =>
    b ? Math.round(((a - b) / Math.abs(b)) * 1000) / 10 : 0;
  const fans = legacyRecords(state, "customers");
  const segments = FAN_SEGMENTS.map((s) => ({
    ...s,
    count: fans.filter((f) => f.segment === s.id).length,
  }));
  const active = fans.filter((f) =>
    ["very-active", "active"].includes(f.segment),
  ).length;
  const values = {
    revenue: m.revenue / 1e6,
    users: fans.length,
    fanActivity: fans.length ? Math.round((active / fans.length) * 100) : 0,
    dri: Math.round(m.dri * 10) / 10,
  };
  for (const key of Object.keys(values))
    initial.stats[key] = {
      ...initial.stats[key],
      value: values[key],
      delta: key === "revenue" ? change(m.revenue, previous.revenue) : 0,
      spark: initial.stats[key].spark.map(
        (v, i, a) => values[key] * (a.at(-1) ? v / a.at(-1) : 0),
      ),
    };
  const count = initial.chart.labels.length;
  const totals = Array(count).fill(0),
    digital = Array(count).fill(0);
  const span = Math.max(
    1,
    Date.parse(range.end) - Date.parse(range.start) + 86400000,
  );
  for (const s of m.transactions) {
    const index =
      period === "year"
        ? Number(s.date.slice(5, 7)) - 1
        : period === "quarter"
          ? (Number(s.date.slice(5, 7)) - 1) % 3
          : period === "month"
            ? Math.min(count - 1, Math.floor((Number(s.date.slice(8)) - 1) / 7))
            : period === "week"
              ? (new Date(s.date).getUTCDay() + 6) % 7
              : Math.min(
                  count - 1,
                  Math.floor(
                    ((Date.parse(s.date) - Date.parse(range.start)) / span) *
                      count,
                  ),
                );
    totals[index] += s.total / 1e6;
    if (s.method !== "Naqd") digital[index] += s.total / 1e6;
  }
  initial.chart = { ...initial.chart, total: totals, digital };
  initial.digitalTotal = digital.reduce((n, v) => n + v, 0);
  initial.compareLabel = "oldingi teng davrga nisbatan";
  const target = state.targets[`${orgId}:${period}`] ?? DEFAULT_TARGETS;
  const kpis = KPI_ROWS.map((k) =>
    k.code === "DRI"
      ? {
          ...k,
          current: String(values.dri),
          target: String(target.dri),
          progress: Math.round((values.dri / target.dri) * 100),
          change: 0,
        }
      : k.code === "ARPU"
        ? {
            ...k,
            current: `${Math.round(m.customers ? m.revenue / m.customers / 1000 : 0)}K`,
            change: 0,
          }
        : k.code === "MF"
          ? {
              ...k,
              current: `${values.fanActivity}%`,
              progress: Math.round((values.fanActivity / 80) * 100),
              change: 0,
            }
          : k,
  );
  const scores = driScores(state);
  const low = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
  return {
    data: initial,
    digitalShare: Math.round(m.digital),
    DIGITAL_SOURCES: DIGITAL_SOURCES.map((s, i) => ({
      ...s,
      label: i === 0 ? "Karta" : i === 1 ? "Onlayn" : s.label,
      share:
        i < 2
          ? initial.digitalTotal
            ? m.transactions
                .filter((t) => t.method === (i === 0 ? "Karta" : "Onlayn"))
                .reduce((n, t) => n + t.total, 0) /
              1e6 /
              initial.digitalTotal
            : 0
          : 0,
    })).slice(0, 2),
    KPI_ROWS: kpis,
    SEGMENTS: segments.map((s, i) => ({
      label: s.label,
      count: s.count,
      share: fans.length ? Math.round((s.count / fans.length) * 100) : 0,
      tone: `s${i + 1}`,
    })),
    RECOMMENDATIONS: [
      {
        id: 1,
        tone: m.revenue >= target.revenue ? "up" : "warn",
        title:
          m.revenue >= target.revenue
            ? "Daromad maqsadi bajarildi"
            : "Daromad maqsadiga hali yo‘l bor",
        text: `Maqsad: ${target.revenue.toLocaleString("uz-UZ")} so‘m. Joriy tushum: ${m.revenue.toLocaleString("uz-UZ")} so‘m.`,
      },
      {
        id: 2,
        tone: "info",
        title: "Raqamli rivojlanishni yaxshilang",
        text: `Eng past indikator bahosi ${low[1]} ball. DRI sahifasida yo‘nalishlarni ko‘rib chiqing.`,
      },
      {
        id: 3,
        tone: "warn",
        title: `${fans.filter((f) => f.segment === "low").length} ta muxlis sust`,
        text: "30 kundan beri xarid qilmagan mijozlar uchun mos taklif tayyorlang.",
      },
    ],
  };
}
export function legacyFinance(state) {
  const org = state.organizations.find((o) => o.id === organizationOf(state)),
    m = metrics(state);
  const sources = REVENUE_SOURCES.map((r, i) => ({
    ...r,
    amount: i === 0 ? m.revenue / 1e6 : 0,
    previous: 0,
    transactions: i === 0 ? m.sales : 0,
  }));
  const expenseGroups = EXPENSE_CATEGORIES.map((r) => ({
    ...r,
    amount: 0,
    previous: 0,
  }));
  for (const e of m.expenses) {
    const i =
      e.category === "Ish haqi"
        ? 0
        : e.category === "Ijara" || e.category === "Kommunal"
          ? 1
          : e.category === "Jihozlar"
            ? 3
            : e.category === "Reklama"
              ? Math.min(7, expenseGroups.length - 1)
              : expenseGroups.length - 1;
    expenseGroups[i].amount += e.total / 1e6;
  }
  expenseGroups.sort((a, b) => b.amount - a.amount);
  const trend = { revenue: Array(12).fill(0), expense: Array(12).fill(0) };
  for (const row of m.transactions)
    trend.revenue[Number(row.date.slice(5, 7)) - 1] += row.total / 1e6;
  for (const row of m.expenses)
    trend.expense[Number(row.date.slice(5, 7)) - 1] += row.total / 1e6;
  const rows = [
    ...state.sales
      .filter(
        (s) =>
          s.organizationId === org.id &&
          s.date >= m.range.start &&
          s.date <= m.range.end,
      )
      .map((s) => ({
        ...s,
        type: "income",
        category: state.services.find((x) => x.id === s.serviceId)?.name,
        description: `${state.services.find((x) => x.id === s.serviceId)?.name} · ${state.customers.find((x) => x.id === s.customerId)?.name}`,
        organization: org.name,
        amount: s.total / 1e6,
      })),
    ...m.expenses.map((e) => ({
      ...e,
      type: "expense",
      description: e.note || e.category,
      organization: org.name,
      method: "Bank o‘tkazmasi",
      amount: e.total / 1e6,
    })),
  ];
  return {
    totalRevenue: m.revenue / 1e6,
    totalExpense: m.expense / 1e6,
    netProfit: m.profit / 1e6,
    profitability: m.revenue ? (m.profit / m.revenue) * 100 : 0,
    digitalRevenue: (m.revenue * m.digital) / 100 / 1e6,
    digitalShare: m.digital,
    arpu: m.customers ? m.revenue / m.customers : 0,
    averageTransaction: m.sales ? m.revenue / m.sales : 0,
    FINANCE_METRICS: {
      payingCustomers: m.customers,
      totalTransactions: m.sales,
      previousRevenue: 0,
      previousExpense: 0,
    },
    REVENUE_SOURCES: sources,
    EXPENSE_CATEGORIES: expenseGroups,
    FINANCE_TREND: trend,
    TRANSACTIONS: rows,
    PAYMENT_METHODS: ["Karta", "Naqd", "Onlayn", "Bank o‘tkazmasi"],
    FINANCE_ORGANIZATIONS: [org.name],
  };
}
