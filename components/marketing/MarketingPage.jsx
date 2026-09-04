"use client";

import { useCallback, useMemo, useState } from "react";

import Drawer from "@/components/ui/Drawer";
import {
  CAMPAIGNS,
  CAMPAIGN_GOALS,
  CAMPAIGN_STATUSES,
  MARKETING_CHANNELS,
  MARKETING_ORGANIZATIONS,
  MARKETING_TREND,
  MONTH_LABELS,
  calcCr,
  calcCtr,
  calcEngagement,
  calcRoi,
  getChannel,
  getStatus,
} from "@/lib/mock/marketing";

const PAGE_SIZE = 8;

const EMPTY_FORM = {
  name: "",
  channel: "telegram",
  organization: MARKETING_ORGANIZATIONS[0],
  goal: CAMPAIGN_GOALS[0],
  period: "",
  spend: "",
  description: "",
};

function Icon({ name }) {
  const icons = {
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    roi: (
      <>
        <path d="M4 18 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),
    audience: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5M15 6.5a3 3 0 0 1 0 5M16 14c2.4.5 4 2.1 4.5 4.5" />
      </>
    ),
    revenue: (
      <>
        <path d="M4 6h14a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" />
        <path d="M15 11h6v4h-6a2 2 0 0 1 0-4z" />
      </>
    ),
    spend: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M9.5 9.5h4a1.8 1.8 0 0 1 0 3.6h-3a1.8 1.8 0 0 0 0 3.6h4" />
      </>
    ),
    megaphone: <path d="M4 11v3l3 .8V21l3-.6v-6l10 3V5L7 9.5 4 10z" strokeLinejoin="round" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    target: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    eye: (
      <>
        <path d="M2.8 12C4.7 8.4 8 6 12 6s7.3 2.4 9.2 6c-1.9 3.6-5.2 6-9.2 6s-7.3-2.4-9.2-6z" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    ),
    click: <path d="m7 4 11 8-4.6 1.4L16 19l-3 1.2-2.4-5.4L7 18z" strokeLinejoin="round" />,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

const formatNumber = (value) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const formatDecimal = (value, digits = 1) =>
  String(Number(value.toFixed(digits))).replace(".", ",");

/* Jadval ustunlarida o'nlik xona doim ko'rinishi uchun (13,0% / 4,9%). */
const formatFixed = (value, digits = 1) => value.toFixed(digits).replace(".", ",");

const formatMln = (value) => {
  if (value >= 1000) return `${formatDecimal(value / 1000, 2)} mlrd`;
  return `${formatDecimal(value, 1)} mln`;
};

const formatCompact = (value) => {
  if (value >= 1000000) return `${formatDecimal(value / 1000000, 1)}M`;
  if (value >= 1000) return `${formatDecimal(value / 1000, 1)}K`;
  return formatNumber(value);
};

const normalizeText = (value) =>
  String(value).normalize("NFKC").toLowerCase().replace(/[ʻʼ'`]/g, "'");

function SummaryCard({ icon, label, value, note }) {
  return (
    <article className="org-summary-card">
      <span className="org-summary-icon">
        <Icon name={icon} />
      </span>
      <div>
        <span>{label}</span>
        <strong className="mono">{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

function RoiBadge({ value }) {
  const tone = value >= 100 ? "high" : value >= 40 ? "mid" : "low";
  return (
    <span className={`mkt-roi-badge mkt-roi-badge--${tone}`}>
      <span className="mono">{formatDecimal(value, 0)}%</span>
    </span>
  );
}

/* ---------- Xarajat va daromad dinamikasi ---------- */

const CHART = { W: 720, H: 260, padL: 46, padR: 14, padT: 16, padB: 34 };

function TrendChart({ spend, revenue }) {
  const [hover, setHover] = useState(null);
  const { W, H, padL, padR, padT, padB } = CHART;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.ceil(Math.max(...revenue) / 40) * 40;
  const groupW = innerW / MONTH_LABELS.length;
  const barW = Math.min(13, groupW / 2.9);
  const y = (value) => padT + innerH - (value / max) * innerH;

  return (
    <div className="mkt-chart-wrap" onMouseLeave={() => setHover(null)}>
      <svg className="mkt-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Oylik marketing xarajati va daromadi">
        {[0, 1, 2, 3, 4].map((i) => {
          const gy = padT + (innerH / 4) * i;
          const value = Math.round(max - (max / 4) * i);
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={gy} y2={gy} className="mkt-chart-grid" />
              <text x={padL - 9} y={gy + 3.5} textAnchor="end" className="mkt-chart-tick">
                {value}
              </text>
            </g>
          );
        })}

        {MONTH_LABELS.map((label, i) => {
          const cx = padL + groupW * i + groupW / 2;
          const isHover = hover === i;
          return (
            <g key={label}>
              {isHover ? (
                <rect
                  x={padL + groupW * i}
                  y={padT}
                  width={groupW}
                  height={innerH}
                  className="mkt-chart-hoverband"
                />
              ) : null}
              <rect
                x={cx - barW - 2}
                y={y(spend[i])}
                width={barW}
                height={padT + innerH - y(spend[i])}
                rx="3"
                className="mkt-bar mkt-bar--spend"
              />
              <rect
                x={cx + 2}
                y={y(revenue[i])}
                width={barW}
                height={padT + innerH - y(revenue[i])}
                rx="3"
                className="mkt-bar mkt-bar--revenue"
              />
              <text x={cx} y={H - padB + 20} textAnchor="middle" className="mkt-chart-tick">
                {label}
              </text>
              <rect
                x={padL + groupW * i}
                y={padT}
                width={groupW}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            </g>
          );
        })}
      </svg>

      {hover !== null ? (
        <div
          className={`mkt-chart-tooltip${hover < 2 ? " is-left" : hover > 9 ? " is-right" : ""}`}
          style={{ left: `${((padL + groupW * hover + groupW / 2) / W) * 100}%` }}
          role="status"
        >
          <strong>{MONTH_LABELS[hover]} 2026</strong>
          <span>
            <i className="mkt-dot mkt-dot--spend"></i>Xarajat:{" "}
            <b className="mono">{formatDecimal(spend[hover], 0)} mln</b>
          </span>
          <span>
            <i className="mkt-dot mkt-dot--revenue"></i>Daromad:{" "}
            <b className="mono">{formatDecimal(revenue[hover], 0)} mln</b>
          </span>
          <span className="mkt-chart-tooltip-roi">
            ROI: <b className="mono">{formatDecimal(calcRoi(revenue[hover], spend[hover]), 0)}%</b>
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Funnel (kampaniya detali) ---------- */

function Funnel({ impressions, clicks, conversions }) {
  const steps = [
    { label: "Ko'rsatishlar", value: impressions, icon: "eye", width: 100 },
    {
      label: "Bosishlar",
      value: clicks,
      icon: "click",
      width: impressions ? Math.max((clicks / impressions) * 100, 6) : 0,
    },
    {
      label: "Konversiyalar",
      value: conversions,
      icon: "check",
      width: impressions ? Math.max((conversions / impressions) * 100, 4) : 0,
    },
  ];

  return (
    <div className="mkt-funnel">
      {steps.map((step, index) => (
        <div className="mkt-funnel-step" key={step.label}>
          <div className="mkt-funnel-head">
            <span className="mkt-funnel-icon">
              <Icon name={step.icon} />
            </span>
            <span className="mkt-funnel-label">{step.label}</span>
            <strong className="mono">{formatNumber(step.value)}</strong>
          </div>
          <span className="mkt-funnel-bar" aria-hidden="true">
            <i style={{ width: `${step.width}%` }}></i>
          </span>
          {index === 0 ? (
            <small className="mkt-funnel-rate">
              CTR <b className="mono">{formatFixed(calcCtr(clicks, impressions), 2)}%</b>
            </small>
          ) : null}
          {index === 1 ? (
            <small className="mkt-funnel-rate">
              Conversion Rate <b className="mono">{formatFixed(calcCr(conversions, clicks), 2)}%</b>
            </small>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ---------- Sahifa ---------- */

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState("all");
  const [goal, setGoal] = useState("all");
  const [sort, setSort] = useState("roi");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const closeDetail = useCallback(() => setSelected(null), []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const totals = useMemo(() => {
    const audience = MARKETING_CHANNELS.reduce((sum, item) => sum + item.audience, 0);
    const newSubscribers = MARKETING_CHANNELS.reduce((sum, item) => sum + item.newSubscribers, 0);
    const spend = MARKETING_CHANNELS.reduce((sum, item) => sum + item.spend, 0);
    const revenue = MARKETING_CHANNELS.reduce((sum, item) => sum + item.revenue, 0);
    return { audience, newSubscribers, spend, revenue, roi: calcRoi(revenue, spend) };
  }, []);

  const bestChannel = useMemo(
    () =>
      [...MARKETING_CHANNELS].sort(
        (a, b) => calcRoi(b.revenue, b.spend) - calcRoi(a.revenue, a.spend),
      )[0],
    [],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const rows = campaigns.filter((item) => {
      const haystack = normalizeText(`${item.name} ${item.code} ${item.organization} ${item.goal}`);
      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (channel !== "all" && item.channel !== channel) return false;
      if (status !== "all" && item.status !== status) return false;
      if (goal !== "all" && item.goal !== goal) return false;
      return true;
    });

    return [...rows].sort((left, right) => {
      if (sort === "revenue") return right.revenue - left.revenue;
      if (sort === "spend") return right.spend - left.spend;
      if (sort === "conversions") return right.conversions - left.conversions;
      if (sort === "name") return left.name.localeCompare(right.name, "uz");
      return calcRoi(right.revenue, right.spend) - calcRoi(left.revenue, left.spend);
    });
  }, [campaigns, query, channel, status, goal, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const filtersActive = query.trim() || channel !== "all" || status !== "all" || goal !== "all";

  const setFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const selectChannel = (value) => {
    setChannel(value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setChannel("all");
    setStatus("all");
    setGoal("all");
    setPage(1);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createCampaign = (event) => {
    event.preventDefault();
    const nextNumber = 17 + campaigns.length - CAMPAIGNS.length;
    const next = {
      id: `cmp-${Date.now()}`,
      code: `CMP-2026-0${nextNumber}`,
      name: form.name.trim(),
      channel: form.channel,
      organization: form.organization,
      goal: form.goal,
      status: "planned",
      period: form.period.trim() || "Belgilanmagan",
      startedAt: "Belgilanmagan",
      spend: Number(form.spend) || 0,
      revenue: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      audienceGrowth: 0,
      description: form.description.trim() || "Tavsif kiritilmagan.",
      updatedAt: "Hozirgina",
    };
    setCampaigns((current) => [next, ...current]);
    setFormOpen(false);
    setSelected(next);
  };

  return (
    <div className="marketing-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Raqamli marketing</span>
          <h1>Marketing samaradorligi</h1>
          <p>Kanallar bo'yicha auditoriya, kampaniyalar natijasi va ROI ko'rsatkichlarini kuzating.</p>
        </div>
        <button type="button" className="org-primary-button" onClick={openCreate}>
          <Icon name="plus" />
          Kampaniya qo'shish
        </button>
      </header>

      <section className="org-summary-grid" aria-label="Marketing umumiy ko'rsatkichlari">
        <SummaryCard
          icon="roi"
          label="Marketing ROI"
          value={`${formatDecimal(totals.roi, 0)}%`}
          note="maqsad: 120%"
        />
        <SummaryCard
          icon="audience"
          label="Jami auditoriya"
          value={formatNumber(totals.audience)}
          note={`+${formatNumber(totals.newSubscribers)} yangi obunachi`}
        />
        <SummaryCard
          icon="revenue"
          label="Kampaniya daromadi"
          value={`${formatMln(totals.revenue)}`}
          note="8 ta kanal bo'yicha jami"
        />
        <SummaryCard
          icon="spend"
          label="Marketing xarajati"
          value={`${formatMln(totals.spend)}`}
          note={`daromadning ${formatDecimal((totals.spend / totals.revenue) * 100, 0)}%i`}
        />
      </section>

      {/* ROI formulasi — TZ 9-bo'lim */}
      <section className="mkt-formula" aria-label="Marketing ROI formulasi">
        <div className="mkt-formula-head">
          <span className="mkt-formula-icon">
            <Icon name="roi" />
          </span>
          <div>
            <h2>Marketing ROI avtomatik hisobi</h2>
            <p>Ko'rsatkich har bir kampaniya va kanal uchun real vaqtda qayta hisoblanadi.</p>
          </div>
        </div>
        <div className="mkt-formula-body">
          <code className="mono">
            ROI = (Daromad − Xarajat) / Xarajat × 100%
          </code>
          <span className="mkt-formula-equals" aria-hidden="true">
            =
          </span>
          <code className="mono mkt-formula-values">
            ({formatDecimal(totals.revenue, 0)} − {formatDecimal(totals.spend, 0)}) /{" "}
            {formatDecimal(totals.spend, 0)} × 100% ={" "}
            <b>{formatDecimal(totals.roi, 0)}%</b>
          </code>
        </div>
      </section>

      {/* Dinamika */}
      <section className="mkt-panel">
        <header className="mkt-panel-head">
          <div>
            <h2>Xarajat va daromad dinamikasi</h2>
            <p>2026-yil · mln so'm</p>
          </div>
          <div className="mkt-legend">
            <span>
              <i className="mkt-dot mkt-dot--spend"></i>Xarajat
            </span>
            <span>
              <i className="mkt-dot mkt-dot--revenue"></i>Daromad
            </span>
          </div>
        </header>
        <TrendChart spend={MARKETING_TREND.spend} revenue={MARKETING_TREND.revenue} />
      </section>

      {/* Kanallar */}
      <section className="mkt-channels" aria-labelledby="mkt-channels-title">
        <header>
          <div>
            <h2 id="mkt-channels-title">Kanallar samaradorligi</h2>
            <p>Kanalni tanlang — kampaniyalar ro'yxati shu kanal bo'yicha filtrlanadi.</p>
          </div>
          <span>
            <Icon name="target" />
            Eng yuqori ROI: {bestChannel.label}
          </span>
        </header>

        <div className="mkt-channel-grid">
          {MARKETING_CHANNELS.map((item) => {
            const roi = calcRoi(item.revenue, item.spend);
            const engagement = calcEngagement(item);
            const isActive = channel === item.id;
            return (
              <button
                type="button"
                key={item.id}
                className={`mkt-channel-card mkt-channel-card--${item.tone}${isActive ? " is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => selectChannel(isActive ? "all" : item.id)}
              >
                <span className="mkt-channel-top">
                  <i aria-hidden="true"></i>
                  <strong>{item.label}</strong>
                  <RoiBadge value={roi} />
                </span>

                <span className="mkt-channel-audience">
                  <b className="mono">{formatCompact(item.audience)}</b>
                  <small>auditoriya · +{formatCompact(item.newSubscribers)}</small>
                </span>

                <span className="mkt-channel-metrics">
                  <span>
                    <small>ER</small>
                    <b className="mono">{formatFixed(engagement, 1)}%</b>
                  </span>
                  <span>
                    <small>CTR</small>
                    <b className="mono">{formatFixed(calcCtr(item.clicks, item.impressions), 1)}%</b>
                  </span>
                  <span>
                    <small>CR</small>
                    <b className="mono">{formatFixed(calcCr(item.conversions, item.clicks), 1)}%</b>
                  </span>
                </span>

                <span className="mkt-channel-foot">
                  <span className="mkt-channel-bar" aria-hidden="true">
                    <i style={{ width: `${Math.min(roi / 2.4, 100)}%` }}></i>
                  </span>
                  <small className="mono">
                    {formatDecimal(item.spend, 0)} → {formatDecimal(item.revenue, 0)} mln
                  </small>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Kampaniyalar reyestri */}
      <section className="mkt-registry">
        <header className="crm-registry-head">
          <div className="crm-registry-title">
            <div>
              <h2>Kampaniyalar</h2>
              <p>
                <strong className="mono">{filtered.length}</strong> ta kampaniya ko'rsatilmoqda
              </p>
            </div>
            {channel !== "all" ? (
              <span className="service-active-filter">
                {getChannel(channel).label}
                <button type="button" aria-label="Kanal filtrini tozalash" onClick={() => selectChannel("all")}>
                  ×
                </button>
              </span>
            ) : null}
          </div>

          <div className="crm-toolbar">
            <label className="org-search crm-search">
              <span className="sr-only">Kampaniyani qidirish</span>
              <Icon name="search" />
              <input
                type="search"
                placeholder="Kampaniya nomi yoki kodi bo'yicha qidirish"
                value={query}
                onChange={(event) => setFilter(setQuery, event.target.value)}
              />
            </label>

            <label className="org-filter">
              <span>Kanal</span>
              <select value={channel} onChange={(event) => setFilter(setChannel, event.target.value)}>
                <option value="all">Barcha kanallar</option>
                {MARKETING_CHANNELS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>Holat</span>
              <select value={status} onChange={(event) => setFilter(setStatus, event.target.value)}>
                <option value="all">Barcha holatlar</option>
                {CAMPAIGN_STATUSES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>Maqsad</span>
              <select value={goal} onChange={(event) => setFilter(setGoal, event.target.value)}>
                <option value="all">Barcha maqsadlar</option>
                {CAMPAIGN_GOALS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="org-filter crm-sort-filter">
              <span>Saralash</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="roi">ROI bo'yicha</option>
                <option value="revenue">Daromad bo'yicha</option>
                <option value="spend">Xarajat bo'yicha</option>
                <option value="conversions">Konversiya bo'yicha</option>
                <option value="name">Nomi bo'yicha</option>
              </select>
            </label>

            {filtersActive ? (
              <button type="button" className="org-clear-button" onClick={clearFilters}>
                Tozalash
              </button>
            ) : null}
          </div>
        </header>

        <div className="crm-table-scroll">
          <table className="crm-table mkt-table">
            <thead>
              <tr>
                <th scope="col">Kampaniya</th>
                <th scope="col">Kanal</th>
                <th scope="col">Holat</th>
                <th scope="col">Xarajat</th>
                <th scope="col">Daromad</th>
                <th scope="col">ROI</th>
                <th scope="col">CTR / CR</th>
                <th scope="col">
                  <span className="sr-only">Ko'rish</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => {
                const channelInfo = getChannel(item.channel);
                const statusInfo = getStatus(item.status);
                return (
                  <tr key={item.id}>
                    <td className="mkt-cell-name">
                      <button type="button" onClick={() => setSelected(item)}>
                        <strong>{item.name}</strong>
                        <small className="mono">
                          {item.code} · {item.organization}
                        </small>
                      </button>
                    </td>
                    <td data-label="Kanal">
                      <span className={`mkt-channel-tag mkt-channel-tag--${channelInfo.tone}`}>
                        {channelInfo.label}
                      </span>
                    </td>
                    <td className="mkt-cell-status" data-label="Holat">
                      <span className={`mkt-status mkt-status--${item.status}`}>{statusInfo.label}</span>
                      <small>{item.period}</small>
                    </td>
                    <td className="mono mkt-cell-num" data-label="Xarajat">
                      {item.spend > 0 ? `${formatDecimal(item.spend, 1)} mln` : "—"}
                    </td>
                    <td className="mono mkt-cell-num" data-label="Daromad">
                      {item.revenue > 0 ? `${formatDecimal(item.revenue, 1)} mln` : "—"}
                    </td>
                    <td data-label="ROI">
                      {item.spend > 0 ? <RoiBadge value={calcRoi(item.revenue, item.spend)} /> : <span className="mkt-muted">—</span>}
                    </td>
                    <td className="mkt-cell-rates" data-label="CTR / CR">
                      {item.impressions > 0 ? (
                        <>
                          <strong className="mono">{formatFixed(calcCtr(item.clicks, item.impressions), 1)}%</strong>
                          <small className="mono">{formatFixed(calcCr(item.conversions, item.clicks), 1)}% CR</small>
                        </>
                      ) : (
                        <span className="mkt-muted">—</span>
                      )}
                    </td>
                    <td className="org-cell-action crm-cell-action">
                      <button
                        type="button"
                        aria-label={`${item.name} kampaniyasini ko'rish`}
                        onClick={() => setSelected(item)}
                      >
                        <Icon name="arrow" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visible.length === 0 ? (
            <div className="org-empty">
              <span>
                <Icon name="search" />
              </span>
              <h3>Kampaniya topilmadi</h3>
              <p>Qidiruv yoki filtrlarni o'zgartirib ko'ring.</p>
              <button type="button" onClick={clearFilters}>
                Filterlarni tozalash
              </button>
            </div>
          ) : null}
        </div>

        {filtered.length > 0 ? (
          <footer className="org-registry-footer">
            <p>
              <span className="mono">{(safePage - 1) * PAGE_SIZE + 1}</span>–
              <span className="mono">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> /{" "}
              <span className="mono">{filtered.length}</span>
            </p>
            <div className="org-pagination">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Oldingi
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                <button
                  type="button"
                  key={number}
                  className={number === safePage ? "is-active" : ""}
                  aria-current={number === safePage ? "page" : undefined}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage === pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              >
                Keyingi
              </button>
            </div>
          </footer>
        ) : null}
      </section>

      <CampaignDetail campaign={selected} onClose={closeDetail} />

      <Drawer
        open={formOpen}
        onClose={closeForm}
        title="Yangi kampaniya"
        subtitle="Kampaniya rejasi uchun asosiy ma'lumotlarni kiriting"
        size="wide"
        icon={<Icon name="megaphone" />}
        footer={
          <>
            <button type="button" className="org-secondary-button" onClick={closeForm}>
              Bekor qilish
            </button>
            <button type="submit" form="campaign-create-form" className="org-primary-button">
              Kampaniya yaratish
            </button>
          </>
        }
      >
        <form id="campaign-create-form" className="org-form" onSubmit={createCampaign}>
          <div className="org-form-section">
            <h3>Asosiy ma'lumotlar</h3>
            <p>Kampaniya nomi, kanali va maqsadini belgilang.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field org-form-field--wide">
              <span>Kampaniya nomi</span>
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="Masalan, Qishki abonement chegirmasi"
                required
                autoFocus
              />
            </label>
            <label className="org-form-field">
              <span>Kanal</span>
              <select name="channel" value={form.channel} onChange={updateForm}>
                {MARKETING_CHANNELS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Maqsad</span>
              <select name="goal" value={form.goal} onChange={updateForm}>
                {CAMPAIGN_GOALS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Tashkilot</span>
              <select name="organization" value={form.organization} onChange={updateForm}>
                {MARKETING_ORGANIZATIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Davr</span>
              <input
                name="period"
                value={form.period}
                onChange={updateForm}
                placeholder="1–31 dekabr, 2026"
              />
            </label>
          </div>

          <div className="org-form-section">
            <h3>Byudjet va tavsif</h3>
            <p>Rejalashtirilgan xarajat asosida ROI keyinchalik avtomatik hisoblanadi.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field">
              <span>Rejadagi xarajat (mln so'm)</span>
              <input
                name="spend"
                type="number"
                min="0"
                step="0.1"
                value={form.spend}
                onChange={updateForm}
                placeholder="12.5"
              />
            </label>
            <label className="org-form-field org-form-field--wide">
              <span>Qisqacha tavsif</span>
              <input
                name="description"
                value={form.description}
                onChange={updateForm}
                placeholder="Kampaniya mazmuni va auditoriyasi"
              />
            </label>
          </div>

          <div className="crm-form-note">
            <Icon name="roi" />
            <p>
              Yangi kampaniya “Rejalashtirilgan” holatida yaratiladi. Ko'rsatishlar va konversiyalar
              qayd etilgach, CTR, CR va ROI avtomatik hisoblanadi.
            </p>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

function CampaignDetail({ campaign, onClose }) {
  if (!campaign) return null;

  const channelInfo = getChannel(campaign.channel);
  const statusInfo = getStatus(campaign.status);
  const roi = calcRoi(campaign.revenue, campaign.spend);
  const profit = campaign.revenue - campaign.spend;
  const hasResults = campaign.impressions > 0;

  return (
    <Drawer
      open={Boolean(campaign)}
      onClose={onClose}
      title={campaign.name}
      subtitle={`${campaign.code} · ${channelInfo.label}`}
      size="medium"
      icon={<Icon name="megaphone" />}
      footer={
        <button type="button" className="org-secondary-button" onClick={onClose}>
          Yopish
        </button>
      }
    >
      <div className="mkt-detail">
        <div className="mkt-detail-head">
          <span className={`mkt-status mkt-status--${campaign.status}`}>{statusInfo.label}</span>
          <span className={`mkt-channel-tag mkt-channel-tag--${channelInfo.tone}`}>
            {channelInfo.label}
          </span>
          <span className="mkt-detail-goal">{campaign.goal}</span>
        </div>

        <p className="mkt-detail-description">{campaign.description}</p>

        {hasResults ? (
          <div className="mkt-roi-summary">
            <div className="mkt-roi-summary-main">
              <span>Marketing ROI</span>
              <strong className="mono">{formatDecimal(roi, 0)}%</strong>
              <small>
                ({formatDecimal(campaign.revenue, 1)} − {formatDecimal(campaign.spend, 1)}) /{" "}
                {formatDecimal(campaign.spend, 1)} × 100%
              </small>
            </div>
            <div className="mkt-roi-summary-side">
              <div>
                <span>Sof foyda</span>
                <strong className="mono">{formatDecimal(profit, 1)} mln</strong>
              </div>
              <div>
                <span>1 konversiya narxi</span>
                <strong className="mono">
                  {campaign.conversions
                    ? `${formatNumber((campaign.spend * 1000000) / campaign.conversions)} so'm`
                    : "—"}
                </strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="mkt-detail-empty">
            <Icon name="calendar" />
            <p>Kampaniya hali boshlanmagan — natijalar qayd etilmagan.</p>
          </div>
        )}

        <div className="org-detail-metrics mkt-detail-metrics">
          <div>
            <span>Xarajat</span>
            <strong className="mono">{formatDecimal(campaign.spend, 1)} mln</strong>
            <small>rejadagi byudjet</small>
          </div>
          <div>
            <span>Daromad</span>
            <strong className="mono">{formatDecimal(campaign.revenue, 1)} mln</strong>
            <small>kampaniyadan</small>
          </div>
          <div>
            <span>Auditoriya o'sishi</span>
            <strong className="mono">+{formatNumber(campaign.audienceGrowth)}</strong>
            <small>yangi obunachi</small>
          </div>
        </div>

        {hasResults ? (
          <section className="org-detail-section">
            <div className="org-detail-section-head">
              <div>
                <h3>Konversiya voronkasi</h3>
                <p>Ko'rsatishdan yakuniy harakatgacha</p>
              </div>
            </div>
            <Funnel
              impressions={campaign.impressions}
              clicks={campaign.clicks}
              conversions={campaign.conversions}
            />
          </section>
        ) : null}

        <section className="org-detail-section">
          <h3>Kampaniya ma'lumotlari</h3>
          <div className="mkt-detail-list">
            <div>
              <Icon name="building" />
              <span>{campaign.organization}</span>
            </div>
            <div>
              <Icon name="calendar" />
              <span>{campaign.period}</span>
            </div>
            <div>
              <Icon name="target" />
              <span>Maqsad: {campaign.goal}</span>
            </div>
            <div>
              <Icon name="megaphone" />
              <span>Oxirgi yangilanish: {campaign.updatedAt}</span>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
