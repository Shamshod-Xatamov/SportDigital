import Link from "next/link";

import LandingEnhancer from "./LandingEnhancer";

const NAV_LINKS = [
  { href: "#platforma", label: "Platforma" },
  { href: "#modullar", label: "Modullar" },
  { href: "#dri", label: "DRI indeksi" },
  { href: "#rollar", label: "Rollar" },
  { href: "#natijalar", label: "Natijalar" },
];

const TICKER_ITEMS = [
  { label: "DRI", value: "68 / 100", trend: "up" },
  { label: "Muxlislar faolligi", value: "+12.4%", trend: "up" },
  { label: "ARPU", value: "128 ming so'm", trend: "up" },
  { label: "E-chipta savdosi", value: "+18%", trend: "up" },
  { label: "Marketing ROI", value: "142%", trend: "up" },
  { label: "Retention", value: "81%", trend: "flat" },
  { label: "Konversiya", value: "4.8%", trend: "up" },
  { label: "Obuna daromadi", value: "+9.3%", trend: "up" },
  { label: "Raqamli daromad ulushi", value: "37%", trend: "up" },
];

const PROBLEMS = [
  "Ma'lumotlar tarqoq jadvallar va qog'oz hisobotlarda yashaydi",
  "Muxlislar faolligi va qoniqishi umuman o'lchanmaydi",
  "Marketing xarajatlari qancha daromad keltirgani noma'lum",
  "Raqamli xizmatlar ulushi va monetizatsiya ko'rinmaydi",
  "Boshqaruv qarorlari raqamlarga emas, sezgiga asoslanadi",
];

const CHAIN_STEPS = [
  {
    num: "01",
    title: "Ma'lumot yig'ish",
    text: "Qo'lda kiritish, Excel/CSV import yoki API orqali — barcha ma'lumot yagona bazada.",
  },
  {
    num: "02",
    title: "Monitoring",
    text: "Xizmatlar, moliya, marketing va muxlislar faolligi real vaqtga yaqin rejimda kuzatiladi.",
  },
  {
    num: "03",
    title: "Tahlil",
    text: "Trend, korrelyatsiya, regressiya, segmentatsiya va anomaliyalarni aniqlash.",
  },
  {
    num: "04",
    title: "KPI va DRI",
    text: "8 ta asosiy KPI va 12 indikatorli raqamli rivojlanish indeksi avtomatik hisoblanadi.",
  },
  {
    num: "05",
    title: "Prognoz",
    text: "Regressiya va vaqt qatorlari asosida 2026–2030 yillar uchun prognoz ko'rsatkichlari.",
  },
  {
    num: "06",
    title: "Qaror",
    text: "Decision Support rahbarga aniq, asoslangan tavsiyalar shakllantiradi.",
  },
];

const MODULE_GROUPS = [
  {
    tag: "Boshqaruv",
    modules: [
      {
        title: "Boshqaruv dashboardi",
        text: "16+ asosiy ko'rsatkich: daromad, foydalanuvchilar, qoniqish, DRI — kunlikdan yillikkacha kesimda.",
        icon: "dashboard",
      },
      {
        title: "Tashkilotlar reyestri",
        text: "Federatsiya, klub, sport maktabi, fitness markazi — yagona elektron reyestr.",
        icon: "registry",
      },
      {
        title: "Sport xizmatlari",
        text: "Mashg'ulotlardan e-chiptagacha 9 guruh xizmat: narx, daromad, foydalanish, baho.",
        icon: "services",
      },
      {
        title: "Moliya va monetizatsiya",
        text: "11 daromad manbasi, rentabellik, ARPU va raqamli daromad ulushi tahlili.",
        icon: "finance",
      },
    ],
  },
  {
    tag: "Muxlislar va marketing",
    modules: [
      {
        title: "Fan Engagement / CRM",
        text: "Muxlis profili, xaridlar tarixi va 5 darajali avtomatik faollik segmentatsiyasi.",
        icon: "fans",
      },
      {
        title: "Raqamli marketing",
        text: "Telegram, Instagram, YouTube va boshqa 8 kanal: CTR, ER, konversiya va avtomatik ROI.",
        icon: "marketing",
      },
      {
        title: "Tadbirlar va e-xizmatlar",
        text: "Sport tadbirlari, elektron chiptalar, obunalar va onlayn xizmatlar boshqaruvi.",
        icon: "events",
      },
      {
        title: "Reyting",
        eyebrow: "TOP-10",
        text: "Tashkilotlar raqamli rivojlanish va samaradorlik bo'yicha yagona reytingda taqqoslanadi.",
        icon: "rating",
      },
    ],
  },
  {
    tag: "Ilmiy tahlil",
    modules: [
      {
        title: "DRI — raqamli indeks",
        text: "12 indikator, vaznli formula va 5 darajali shkala — tashkilotning raqamli yetuklik o'lchovi.",
        icon: "dri",
      },
      {
        title: "KPI monitoring",
        text: "MF, SD, XS, MS, CR, RR, ARPU, DRI — maqsad qiymati va bajarilish darajasi bilan.",
        icon: "kpi",
      },
      {
        title: "Analitika va Big Data",
        text: "Dinamik tahlil, korrelyatsiya, regressiya, vaqt qatorlari va anomaliya detektori.",
        icon: "analytics",
      },
      {
        title: "Prognozlash",
        text: "2026–2030 yillar uchun daromad, faollik va indeks prognozlari — ekonometrik modellarda.",
        icon: "forecast",
      },
    ],
  },
  {
    tag: "Qaror va hisobot",
    modules: [
      {
        title: "Decision Support",
        text: "KPI dinamikasi va chegaralar asosida rahbar uchun avtomatik boshqaruv tavsiyalari.",
        icon: "decision",
      },
      {
        title: "Hisobotlar generatori",
        text: "Oylik, choraklik, yillik va tematik hisobotlar — PDF, Excel va CSV formatlarida.",
        icon: "reports",
      },
      {
        title: "Samaradorlik oynasi",
        text: "«Platformagacha / keyin» taqqoslash — raqamli transformatsiya effektining isboti.",
        icon: "impact",
      },
      {
        title: "Import va integratsiya",
        text: "Excel, CSV va API orqali ma'lumot olish; tashqi tizimlarga ochiq arxitektura.",
        icon: "import",
      },
    ],
  },
];

const DRI_INDICATORS = [
  { label: "Raqamli infratuzilma", value: 74 },
  { label: "Raqamli xizmatlar", value: 66 },
  { label: "Boshqaruv avtomatlashuvi", value: 58 },
  { label: "Big Data", value: 52 },
  { label: "AI texnologiyalari", value: 44 },
  { label: "IoT vositalari", value: 38 },
  { label: "Mobil xizmatlar", value: 79 },
  { label: "CRM", value: 63 },
  { label: "Raqamli marketing", value: 82 },
  { label: "Elektron to'lovlar", value: 88 },
  { label: "Ma'lumotlar xavfsizligi", value: 71 },
  { label: "Raqamli innovatsiyalar", value: 47 },
];

const KPI_CARDS = [
  { code: "MF", name: "Muxlislar faolligi", value: "74%", delta: "+12.4%", target: "80%", progress: 92 },
  { code: "ARPU", name: "Foydalanuvchi daromadi", value: "128K", delta: "+8.1%", target: "150K", progress: 85 },
  { code: "ROI", name: "Marketing ROI", value: "142%", delta: "+21%", target: "120%", progress: 100 },
  { code: "RR", name: "Retention Rate", value: "81%", delta: "+3.2%", target: "85%", progress: 95 },
];

const ROLES = [
  {
    title: "Rahbar",
    badge: "Analitik kabinet",
    points: [
      "Dashboard, KPI va moliyaviy ko'rsatkichlar",
      "DRI dinamikasi va prognozlar",
      "Decision Support tavsiyalari",
    ],
  },
  {
    title: "Tashkilot administratori",
    badge: "Operatsion boshqaruv",
    points: [
      "Tashkilot, xizmatlar va moliya ma'lumotlari",
      "Marketing kampaniyalarini qayd qilish",
      "KPI hisobotlarini kuzatish",
    ],
  },
  {
    title: "Analitik",
    badge: "Ilmiy instrument",
    points: [
      "Vaqt qatorlari va korrelyatsion tahlil",
      "Ekonometrik modellar va prognozlar",
      "Tashkilotlararo taqqoslash",
    ],
  },
  {
    title: "Super administrator",
    badge: "Tizim nazorati",
    points: [
      "Tashkilotlar va foydalanuvchilarni boshqarish",
      "Rollar va huquqlarni belgilash",
      "Audit log va umumiy reyting",
    ],
  },
  {
    title: "Muxlis / mijoz",
    badge: "Ochiq portal",
    points: [
      "Tashkilotlar va xizmatlar katalogi",
      "Tadbirlarga ro'yxatdan o'tish",
      "Baho va fikr qoldirish",
    ],
  },
];

const RATING_ROWS = [
  { rank: 1, name: "Olimp sport klubi", type: "Professional klub", score: 87 },
  { rank: 2, name: "Chempion fitness tarmog'i", type: "Fitness markaz", score: 81 },
  { rank: 3, name: "Doston arena", type: "Sport majmuasi", score: 76 },
  { rank: 4, name: "Yosh avlod sport maktabi", type: "Sport maktabi", score: 68 },
  { rank: 5, name: "Vatan futbol akademiyasi", type: "Akademiya", score: 61 },
];

const SECURITY_ITEMS = [
  "Rollarga asoslangan huquqlar (RBAC)",
  "Shifrlangan parollar va HTTPS",
  "Audit log va harakatlar tarixi",
  "SQL Injection / XSS / CSRF himoyasi",
  "Muntazam zaxira nusxalari",
];

function Icon({ name }) {
  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7.5" height="10" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5" />
        <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.5" />
        <rect x="3" y="16" width="7.5" height="5" rx="1.5" />
      </>
    ),
    registry: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    services: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" />
      </>
    ),
    finance: (
      <>
        <path d="M4 19h16" />
        <path d="M6 19v-6M11 19V8M16 19v-9M21 19V5" />
      </>
    ),
    fans: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M15.5 13.6c2.7.2 4.5 1.7 5 4.4" />
      </>
    ),
    marketing: (
      <>
        <path d="M4 11v3l3 .8V21l3-.6v-6l10 3V5L7 9.5 4 10z" strokeLinejoin="round" />
      </>
    ),
    events: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
        <path d="m10.5 14.5 1.5 1.5 3-3.2" />
      </>
    ),
    rating: (
      <>
        <path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.2l5.9-.8L12 3z" strokeLinejoin="round" />
      </>
    ),
    dri: (
      <>
        <path d="M4 17a8 8 0 0 1 16 0" />
        <path d="M12 17 16 9" />
        <path d="M3 21h18" />
      </>
    ),
    kpi: (
      <>
        <path d="M4 20V10M9.5 20V4M15 20v-8M20.5 20V7" />
        <path d="M2.5 20h19" />
      </>
    ),
    analytics: (
      <>
        <path d="M3.5 16.5 9 11l3.5 3.5L20.5 6" />
        <path d="M15.5 6h5v5" />
      </>
    ),
    forecast: (
      <>
        <path d="M3.5 18c3-1 4.5-6 7-6s3.5 3 6 3 3.5-4.5 4-8" />
        <path d="M3.5 21h17" strokeDasharray="2.6 2.6" />
      </>
    ),
    decision: (
      <>
        <path d="M12 3v6M12 9l-5.5 4M12 9l5.5 4" />
        <circle cx="12" cy="4.5" r="1.8" />
        <circle cx="5.5" cy="14.5" r="1.8" />
        <circle cx="18.5" cy="14.5" r="1.8" />
        <path d="m4 20 1.5-2.5L7 20M17 20l1.5-2.5L20 20" />
      </>
    ),
    reports: (
      <>
        <path d="M6 3h8l4 4v14H6V3z" strokeLinejoin="round" />
        <path d="M14 3v4h4M9 12h6M9 16h6" />
      </>
    ),
    impact: (
      <>
        <path d="M4 12h6M14 12h6" />
        <path d="m8 8 4 4-4 4" strokeLinejoin="round" />
        <circle cx="17" cy="12" r="3.5" />
      </>
    ),
    import: (
      <>
        <path d="M12 3v10M8.5 9.5 12 13l3.5-3.5" />
        <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <rect x="5" y="8" width="34" height="28" rx="5" />
        <path d="M22 8v28" />
        <circle cx="22" cy="22" r="6" />
      </svg>
    </span>
  );
}

function DriGauge() {
  // Yarim doira gauge: 68/100
  const value = 68;
  const angle = (value / 100) * 180;
  const rad = ((180 - angle) * Math.PI) / 180;
  const cx = 60 + 46 * Math.cos(rad);
  const cy = 58 - 46 * Math.sin(rad);
  return (
    <svg className="gauge" viewBox="0 0 120 66" aria-hidden="true">
      <path d="M14 58 A46 46 0 0 1 106 58" fill="none" stroke="var(--night-line)" strokeWidth="9" strokeLinecap="round" />
      <path
        d="M14 58 A46 46 0 0 1 106 58"
        fill="none"
        stroke="var(--volt)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="144.5"
        strokeDashoffset={144.5 - (144.5 * value) / 100}
        className="gauge-arc"
      />
      <circle cx={cx} cy={cy} r="4.4" fill="var(--volt)" stroke="var(--night-2)" strokeWidth="2.4" />
    </svg>
  );
}

function Sparkline() {
  return (
    <svg className="sparkline" viewBox="0 0 220 64" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--volt)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 50 L20 46 L40 48 L60 40 L80 42 L100 33 L120 36 L140 26 L160 28 L180 18 L200 14 L220 8 V64 H0 Z"
        fill="url(#sparkFill)"
      />
      <path
        d="M0 50 L20 46 L40 48 L60 40 L80 42 L100 33 L120 36 L140 26 L160 28 L180 18 L200 14 L220 8"
        fill="none"
        stroke="var(--volt)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ForecastChart() {
  return (
    <svg className="forecast-chart" viewBox="0 0 472 220" aria-hidden="true">
      <defs>
        <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--pitch)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--pitch)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="36" x2="452" y1={36 + i * 46} y2={36 + i * 46} stroke="var(--line)" strokeWidth="1" />
      ))}
      <path
        d="M36 168 L120 152 L204 158 L288 128"
        fill="none"
        stroke="var(--pitch)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M288 128 L372 92 L452 54"
        fill="none"
        stroke="var(--pitch)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="7 7"
      />
      <path d="M36 168 L120 152 L204 158 L288 128 L372 92 L452 54 V186 H36 Z" fill="url(#forecastFill)" />
      {[
        [36, 168],
        [120, 152],
        [204, 158],
        [288, 128],
        [372, 92],
        [452, 54],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.6" fill={i >= 3 ? "var(--volt-deep)" : "var(--pitch)"} stroke="var(--paper)" strokeWidth="2" />
      ))}
      <line x1="288" y1="28" x2="288" y2="186" stroke="var(--ink)" strokeOpacity="0.22" strokeWidth="1.4" strokeDasharray="3 5" />
      {["2025", "2026", "2027", "2028", "2029", "2030"].map((year, i) => (
        <text key={year} x={36 + i * 83.2} y="206" textAnchor="middle" className="chart-label">
          {year}
        </text>
      ))}
      <text x="296" y="40" className="chart-label chart-label--strong">
        Prognoz davri
      </text>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Asosiy kontentga o'tish
      </a>

      <header className="site-header" data-header>
        <div className="container nav-shell">
          <a className="brand" href="#top" aria-label="SportDigital bosh sahifa">
            <BrandMark />
            <span className="brand-copy">
              Sport<em>Digital</em>
            </span>
          </a>

          <nav className="desktop-nav" aria-label="Asosiy navigatsiya">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <Link className="button button--ghost button--small desktop-only" href="/login">
              Kirish
            </Link>
            <a className="button button--volt button--small desktop-only" href="#demo">
              Demo ko'rish
            </a>
            <button
              className="menu-toggle"
              type="button"
              aria-expanded="false"
              aria-controls="mobile-menu"
              aria-label="Menyuni ochish"
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <div className="mobile-menu" id="mobile-menu" hidden>
          <nav aria-label="Mobil navigatsiya">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mobile-menu-actions">
            <Link className="button button--ghost" href="/login">
              Kirish
            </Link>
            <a className="button button--volt" href="#demo">
              Demo ko'rish
            </a>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* ===================== HERO ===================== */}
        <section className="hero" id="top">
          <div className="hero-glow" aria-hidden="true"></div>
          <div className="hero-lanes" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="container hero-grid">
            <div className="hero-copy" data-reveal>
              <p className="hero-eyebrow">
                <span className="live-dot" aria-hidden="true"></span>
                Sport tashkilotlari uchun raqamli boshqaruv platformasi
              </p>
              <h1>
                Sport tashkiloti boshqaruvi — <span className="volt-text">yagona raqamli tabloda</span>
              </h1>
              <p className="hero-lead">
                SportDigital xizmatlar, moliya, marketing va muxlislar faolligini real vaqtga yaqin
                rejimda kuzatadi, raqamli rivojlanish indeksini hisoblaydi va rahbarga ma'lumotga
                asoslangan qarorlar uchun aniq tavsiyalar beradi.
              </p>
              <div className="hero-actions">
                <a className="button button--volt" href="#demo">
                  Platformani ko'rish
                  <svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M3.75 9h10.5M10 4.75 14.25 9 10 13.25" />
                  </svg>
                </a>
                <a className="button button--outline" href="#modullar">
                  Modullar bilan tanishish
                </a>
              </div>
              <dl className="hero-stats">
                <div>
                  <dt>Modul</dt>
                  <dd>
                    <span data-counter="14">0</span>
                  </dd>
                </div>
                <div>
                  <dt>Asosiy KPI</dt>
                  <dd>
                    <span data-counter="8">0</span>
                  </dd>
                </div>
                <div>
                  <dt>DRI indikatori</dt>
                  <dd>
                    <span data-counter="12">0</span>
                  </dd>
                </div>
                <div>
                  <dt>Prognoz davri</dt>
                  <dd className="stat-range">2026–30</dd>
                </div>
              </dl>
            </div>

            <div className="hero-board" data-reveal data-delay="150">
              <article className="scoreboard" aria-label="Jonli monitoring namunasi">
                <header className="scoreboard-head">
                  <span className="scoreboard-title">Jonli monitoring</span>
                  <span className="scoreboard-live">
                    <span className="live-dot" aria-hidden="true"></span>
                    LIVE
                  </span>
                </header>

                <div className="scoreboard-dri">
                  <DriGauge />
                  <div className="scoreboard-dri-copy">
                    <span className="dri-value">68</span>
                    <span className="dri-caption">DRI — raqamli rivojlanish indeksi</span>
                    <span className="dri-band">Yuqori daraja</span>
                  </div>
                </div>

                <div className="scoreboard-tiles">
                  <div className="tile">
                    <span className="tile-label">Muxlislar faolligi</span>
                    <span className="tile-value">74%</span>
                    <span className="tile-delta tile-delta--up">▲ 12.4%</span>
                  </div>
                  <div className="tile">
                    <span className="tile-label">ARPU</span>
                    <span className="tile-value">128K</span>
                    <span className="tile-delta tile-delta--up">▲ 8.1%</span>
                  </div>
                  <div className="tile">
                    <span className="tile-label">Marketing ROI</span>
                    <span className="tile-value">142%</span>
                    <span className="tile-delta tile-delta--up">▲ 21%</span>
                  </div>
                </div>

                <div className="scoreboard-chart">
                  <div className="scoreboard-chart-head">
                    <span>Raqamli xizmatlar daromadi</span>
                    <span className="mono">12 oy</span>
                  </div>
                  <Sparkline />
                </div>

                <div className="scoreboard-advice">
                  <span className="advice-tag">Tavsiya</span>
                  <p>
                    E-chipta savdosi 18% oshdi — paketli xizmatlarni joriy etish maqsadga muvofiq.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===================== TICKER ===================== */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div className="ticker-group" key={copy}>
                {TICKER_ITEMS.map((item) => (
                  <span className="ticker-item" key={`${copy}-${item.label}`}>
                    <strong>{item.label}</strong>
                    <span className={`mono ticker-value ${item.trend === "up" ? "is-up" : ""}`}>
                      {item.value}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ===================== PROBLEM / SOLUTION ===================== */}
        <section className="section section--chalk" id="platforma">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="section-num" aria-hidden="true">01</span>
              <div>
                <p className="section-tag">Nega SportDigital</p>
                <h2>
                  Sport tashkilotlarida raqamlar bor, <em>lekin ular gapirmaydi</em>
                </h2>
              </div>
            </div>

            <div className="problem-grid">
              <div className="problem-col" data-reveal>
                <h3 className="col-title col-title--muted">Hozirgi holat</h3>
                <ul className="problem-list">
                  {PROBLEMS.map((problem) => (
                    <li key={problem}>
                      <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="m6 6 8 8M14 6l-8 8" />
                      </svg>
                      {problem}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="problem-col" data-reveal data-delay="120">
                <h3 className="col-title col-title--volt">SportDigital bilan</h3>
                <div className="before-after" role="table" aria-label="Platformagacha va platformadan keyin taqqoslash">
                  <div className="ba-row ba-row--head" role="row">
                    <span role="columnheader">Ko'rsatkich</span>
                    <span role="columnheader">Gacha</span>
                    <span role="columnheader">Keyin</span>
                  </div>
                  {[
                    ["Ma'lumotni qayta ishlash", "3–5 kun", "daqiqalar"],
                    ["Monitoring aniqligi", "taxminiy", "real vaqtga yaqin"],
                    ["Muxlislar faolligi", "o'lchanmaydi", "5 segmentda"],
                    ["Marketing ROI", "noma'lum", "avtomatik"],
                    ["Boshqaruv qarori", "sezgi asosida", "ma'lumot asosida"],
                  ].map(([metric, before, after]) => (
                    <div className="ba-row" role="row" key={metric}>
                      <span role="cell">{metric}</span>
                      <span role="cell" className="ba-before">{before}</span>
                      <span role="cell" className="ba-after">{after}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================== VALUE CHAIN ===================== */}
        <section className="section section--chalk section--chain">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="section-num" aria-hidden="true">02</span>
              <div>
                <p className="section-tag">Qiymat zanjiri</p>
                <h2>
                  Ma'lumotdan qarorgacha — <em>olti bosqichli yopiq sikl</em>
                </h2>
              </div>
            </div>

            <ol className="chain-track">
              {CHAIN_STEPS.map((step, i) => (
                <li className="chain-step" key={step.num} data-reveal data-delay={i * 70}>
                  <span className="chain-num mono">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ===================== MODULES ===================== */}
        <section className="section section--night" id="modullar">
          <div className="container">
            <div className="section-head section-head--night" data-reveal>
              <span className="section-num" aria-hidden="true">03</span>
              <div>
                <p className="section-tag">Platforma modullari</p>
                <h2>
                  Reyestrdan prognozgacha — <em>14 modul bitta tizimda</em>
                </h2>
              </div>
            </div>

            {MODULE_GROUPS.map((group, gi) => (
              <div className="module-group" key={group.tag}>
                <h3 className="module-group-tag" data-reveal>
                  <span className="mono">{String(gi + 1).padStart(2, "0")}</span>
                  {group.tag}
                </h3>
                <div className="module-grid">
                  {group.modules.map((mod, i) => (
                    <article className="module-card" key={mod.title} data-reveal data-delay={i * 60}>
                      <span className="module-icon">
                        <Icon name={mod.icon} />
                      </span>
                      <h4>{mod.title}</h4>
                      <p>{mod.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== DRI + KPI ===================== */}
        <section className="section section--night section--dri" id="dri">
          <div className="container">
            <div className="section-head section-head--night" data-reveal>
              <span className="section-num" aria-hidden="true">04</span>
              <div>
                <p className="section-tag">Ilmiy o'lchov tizimi</p>
                <h2>
                  DRI — tashkilot raqamli yetukligining <em>yagona o'lchovi</em>
                </h2>
              </div>
            </div>

            <div className="dri-grid">
              <div className="dri-explain" data-reveal>
                <p className="dri-formula mono" aria-label="DRI formulasi">
                  DRI = Σ ( W<sub>i</sub> × X<sub>i</sub> )
                </p>
                <p>
                  Har bir tashkilot 12 ta indikator bo'yicha 0–100 ballda baholanadi: infratuzilmadan
                  AI va IoT texnologiyalarigacha. Vaznli yig'indi tashkilotning umumiy raqamli
                  rivojlanish darajasini beradi — bu dissertatsiyaning markaziy ilmiy instrumenti.
                </p>

                <div className="dri-scale" role="img" aria-label="DRI shkalasi: 0 dan 100 gacha besh daraja, joriy qiymat 68">
                  <div className="dri-scale-bar">
                    <span className="zone zone-1"></span>
                    <span className="zone zone-2"></span>
                    <span className="zone zone-3"></span>
                    <span className="zone zone-4"></span>
                    <span className="zone zone-5"></span>
                    <span className="dri-marker" style={{ left: "68%" }}>
                      <span className="mono">68</span>
                    </span>
                  </div>
                  <div className="dri-scale-labels mono" aria-hidden="true">
                    <span>0</span>
                    <span>20</span>
                    <span>40</span>
                    <span>60</span>
                    <span>80</span>
                    <span>100</span>
                  </div>
                  <div className="dri-scale-bands" aria-hidden="true">
                    <span>Juda past</span>
                    <span>Past</span>
                    <span>O'rtacha</span>
                    <span>Yuqori</span>
                    <span>Juda yuqori</span>
                  </div>
                </div>
              </div>

              <div className="dri-indicators" data-reveal data-delay="120">
                <h3 className="col-title col-title--night">12 indikator</h3>
                <ul>
                  {DRI_INDICATORS.map((ind) => (
                    <li key={ind.label}>
                      <span className="ind-label">{ind.label}</span>
                      <span className="ind-bar" aria-hidden="true">
                        <span className="ind-fill" style={{ width: `${ind.value}%` }}></span>
                      </span>
                      <span className="ind-value mono">{ind.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="kpi-strip" data-reveal>
              <div className="kpi-strip-head">
                <h3>KPI monitoring</h3>
                <p>Har bir ko'rsatkich — joriy qiymat, o'zgarish, maqsad va bajarilish darajasi bilan.</p>
              </div>
              <div className="kpi-cards">
                {KPI_CARDS.map((kpi) => (
                  <article className="kpi-card" key={kpi.code}>
                    <div className="kpi-card-top">
                      <span className="kpi-code mono">{kpi.code}</span>
                      <span className="kpi-delta">▲ {kpi.delta.replace("+", "")}</span>
                    </div>
                    <span className="kpi-value">{kpi.value}</span>
                    <span className="kpi-name">{kpi.name}</span>
                    <div className="kpi-progress" aria-hidden="true">
                      <span style={{ width: `${kpi.progress}%` }}></span>
                    </div>
                    <span className="kpi-target mono">Maqsad: {kpi.target}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===================== ROLES ===================== */}
        <section className="section section--chalk" id="rollar">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="section-num" aria-hidden="true">05</span>
              <div>
                <p className="section-tag">Foydalanuvchi rollari</p>
                <h2>
                  Har bir rol <em>o'z qarori uchun kerakli ma'lumotni</em> ko'radi
                </h2>
              </div>
            </div>

            <div className="roles-grid">
              {ROLES.map((role, i) => (
                <article className="role-card" key={role.title} data-reveal data-delay={i * 70}>
                  <span className="role-badge">{role.badge}</span>
                  <h3>{role.title}</h3>
                  <ul>
                    {role.points.map((point) => (
                      <li key={point}>
                        <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="m4.5 10.5 3.5 3.5 7.5-8" />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== FORECAST + RATING ===================== */}
        <section className="section section--chalk section--results" id="natijalar">
          <div className="container">
            <div className="section-head" data-reveal>
              <span className="section-num" aria-hidden="true">06</span>
              <div>
                <p className="section-tag">Prognoz va reyting</p>
                <h2>
                  Bugungi raqamlardan <em>2030-yil strategiyasigacha</em>
                </h2>
              </div>
            </div>

            <div className="results-grid">
              <article className="panel panel--forecast" data-reveal>
                <div className="panel-head">
                  <h3>Raqamli daromad prognozi</h3>
                  <span className="mono panel-note">2026–2030 · regressiya modeli</span>
                </div>
                <ForecastChart />
                <p className="panel-caption">
                  Chiziqli va ko'p omilli regressiya, vaqt qatorlari va trend modellari asosida
                  daromad, faollik hamda DRI ko'rsatkichlari prognoz qilinadi.
                </p>
              </article>

              <article className="panel panel--rating" data-reveal data-delay="120">
                <div className="panel-head">
                  <h3>TOP raqamlashtirilgan tashkilotlar</h3>
                  <span className="mono panel-note">DRI bo'yicha</span>
                </div>
                <ol className="rating-list">
                  {RATING_ROWS.map((row) => (
                    <li key={row.rank}>
                      <span className="rating-rank mono">{row.rank}</span>
                      <span className="rating-org">
                        <strong>{row.name}</strong>
                        <small>{row.type}</small>
                      </span>
                      <span className="rating-score">
                        <span className="rating-bar" aria-hidden="true">
                          <span style={{ width: `${row.score}%` }}></span>
                        </span>
                        <span className="mono">{row.score}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="panel-caption">
                  Tashkilotlar iqtisodiy samaradorlik, raqamli rivojlanish va muxlislar faolligi
                  bo'yicha yagona reytingda taqqoslanadi.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ===================== SECURITY STRIP ===================== */}
        <section className="security-strip">
          <div className="container security-inner" data-reveal>
            <span className="security-title">
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 3 5 6v5c0 4.4 2.9 8.2 7 9.4 4.1-1.2 7-5 7-9.4V6l-7-3z" strokeLinejoin="round" />
                <path d="m8.8 11.8 2.2 2.2 4.2-4.6" />
              </svg>
              Axborot xavfsizligi
            </span>
            <ul>
              {SECURITY_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===================== FINAL CTA ===================== */}
        <section className="cta" id="demo">
          <div className="container cta-inner" data-reveal>
            <p className="cta-tag">SportDigital · 2026</p>
            <h2>
              Raqamli transformatsiyani
              <br />
              bugun boshlang
            </h2>
            <p className="cta-lead">
              Sport tashkilotingiz ma'lumotlarini yagona tizimga jamlang va boshqaruv qarorlarini
              raqamlarga tayangan holda qabul qiling.
            </p>
            <div className="cta-actions">
              <a className="button button--dark" href="#top">
                Demo so'rash
                <svg viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3.75 9h10.5M10 4.75 14.25 9 10 13.25" />
                </svg>
              </a>
              <a className="button button--outline-dark" href="#modullar">
                Modullarni ko'rish
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#top" aria-label="SportDigital bosh sahifa">
              <BrandMark />
              <span className="brand-copy">
                Sport<em>Digital</em>
              </span>
            </a>
            <p>
              Sport tashkilotlarining raqamli rivojlanishini boshqarish, monitoring qilish va tahlil
              etish axborot platformasi.
            </p>
          </div>

          <nav className="footer-col" aria-label="Platforma bo'limlari">
            <h3>Platforma</h3>
            <a href="#platforma">Nega SportDigital</a>
            <a href="#modullar">Modullar</a>
            <a href="#dri">DRI indeksi</a>
            <a href="#rollar">Rollar</a>
          </nav>

          <nav className="footer-col" aria-label="Natijalar bo'limlari">
            <h3>Natijalar</h3>
            <a href="#natijalar">Prognoz 2026–2030</a>
            <a href="#natijalar">Tashkilotlar reytingi</a>
            <a href="#demo">Demo so'rash</a>
          </nav>

          <div className="footer-col">
            <h3>Loyiha haqida</h3>
            <p className="footer-note">
              Platforma «Raqamli transformatsiya sharoitida sport tashkilotlarining yangi biznes
              modellarini ishlab chiqish» mavzusidagi PhD tadqiqoti doirasida ishlab chiqilmoqda.
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 SportDigital. Barcha huquqlar himoyalangan.</span>
          <span className="mono">UZ · RU</span>
        </div>
      </footer>

      <LandingEnhancer />
    </>
  );
}
