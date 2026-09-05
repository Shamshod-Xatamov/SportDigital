"use client";

import { useMemo, useState } from "react";

import {
  DASHBOARD,
  DIGITAL_SOURCES,
  KPI_ROWS,
  PERIODS,
  RECOMMENDATIONS,
  SEGMENTS,
  formatNumber,
} from "@/lib/mock/dashboard";

import { useDemo } from "@/components/demo/DemoProvider";
import { legacyDashboard } from "@/lib/demo/legacy.mjs";
import { getDriLevel } from "@/lib/mock/dri";
/* ---------- Kichik yordamchilar ---------- */

const niceMax = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(value));
  const candidates = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  for (const c of candidates) {
    if (c * pow >= value) return c * pow;
  }
  return 10 * pow;
};

const formatMln = (value) =>
  value >= 1000
    ? `${(value / 1000).toFixed(value >= 10000 ? 1 : 2)} mlrd`
    : `${formatNumber(Math.round(value * 10) / 10)} mln`;

function DeltaChip({ value, suffix = "%" }) {
  const up = value >= 0;
  return (
    <span className={`delta-chip ${up ? "is-up" : "is-down"}`}>
      <svg viewBox="0 0 10 10" aria-hidden="true">
        {up ? <path d="M1.5 6.5 5 3l3.5 3.5" /> : <path d="M1.5 3.5 5 7l3.5-3.5" />}
      </svg>
      {Math.abs(value)}
      {suffix}
    </span>
  );
}

function MetricIcon({ name }) {
  const paths = {
    revenue: (
      <>
        <path d="M4 18.5h16M6.5 15V9.5M11 15V5.5M15.5 15v-3M20 15V7.5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.25" />
        <path d="M3.5 19c.6-3.4 2.8-5.2 5.5-5.2s4.9 1.8 5.5 5.2" />
        <path d="M15.5 6.3a3 3 0 0 1 0 5.4M16.5 14c2.2.5 3.6 2.1 4 4.5" />
      </>
    ),
    fanActivity: (
      <>
        <path d="M4 12h3l2-5 4 10 2-5h5" />
        <path d="M3.5 5.5A9 9 0 0 1 20 7M20.5 18.5A9 9 0 0 1 4 17" />
      </>
    ),
    dri: (
      <>
        <path d="M4 17a8 8 0 0 1 16 0" />
        <path d="M12 17 16 9" />
        <path d="M3 21h18" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/* ---------- Mini sparkline (stat kartalar uchun) ---------- */

function Sparkline({ points, id }) {
  const W = 130;
  const H = 40;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * W,
    H - 5 - ((p - min) / range) * (H - 10),
  ]);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  return (
    <svg className="stat-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sparkfill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--pitch)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--pitch)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W} ${H} L0 ${H} Z`} fill={`url(#sparkfill-${id})`} />
      <path d={line} fill="none" stroke="var(--pitch)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Asosiy daromad grafigi (hover bilan) ---------- */

const CHART = { W: 660, H: 320, padL: 48, padR: 34, padT: 16, padB: 34 };

function RevenueChart({ data }) {
  const [hover, setHover] = useState(null);

  const geometry = useMemo(() => {
    const { W, H, padL, padR, padT, padB } = CHART;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;
    const max = niceMax(Math.max(...data.total));
    const n = data.labels.length;
    const x = (i) => padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const y = (v) => padT + innerH - (v / max) * innerH;
    const toPath = (series) =>
      series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    const toArea = (series) =>
      `${toPath(series)} L${x(n - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;
    return { innerW, innerH, max, n, x, y, toPath, toArea };
  }, [data]);

  const { W, H, padL, padT, padB } = CHART;
  const { innerH, max, n, x, y, toPath, toArea } = geometry;
  const gridCount = 4;
  const labelStep = n > 8 ? 2 : 1;

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = ((event.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((relX - padL) / (W - padL - CHART.padR)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, idx)));
  };

  return (
    <div className="chart-wrap" onMouseLeave={() => setHover(null)}>
      <svg
        className="revenue-chart"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMove}
        aria-label="Davr bo'yicha jami va raqamli daromad grafigi"
        role="img"
      >
        <defs>
          <linearGradient id="rev-total" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--pitch)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--pitch)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rev-digital" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--volt)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--volt)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: gridCount + 1 }, (_, i) => {
          const gy = padT + (innerH / gridCount) * i;
          const value = Math.round((max - (max / gridCount) * i) * (max < 10 ? 10 : 1)) / (max < 10 ? 10 : 1);
          return (
            <g key={i}>
              <line x1={padL} x2={W - CHART.padR} y1={gy} y2={gy} className="chart-grid" />
              <text x={padL - 8} y={gy + 3.5} textAnchor="end" className="chart-tick">
                {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              </text>
            </g>
          );
        })}

        <path d={toArea(data.total)} fill="url(#rev-total)" />
        <path d={toArea(data.digital)} fill="url(#rev-digital)" />
        <path d={toPath(data.total)} fill="none" stroke="var(--pitch)" strokeWidth="2.4" strokeLinecap="round" />
        <path d={toPath(data.digital)} fill="none" stroke="var(--volt-deep)" strokeWidth="2.4" strokeLinecap="round" />

        {data.labels.map((label, i) =>
          i % labelStep === 0 ? (
            <text key={label + i} x={x(i)} y={H - padB + 20} textAnchor="middle" className="chart-tick">
              {label}
            </text>
          ) : null,
        )}

        {hover !== null ? (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={padT}
              y2={padT + innerH}
              className="chart-cursor"
            />
            <circle cx={x(hover)} cy={y(data.total[hover])} r="4.4" fill="var(--pitch)" stroke="var(--paper)" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(data.digital[hover])} r="4.4" fill="var(--volt-deep)" stroke="var(--paper)" strokeWidth="2" />
          </g>
        ) : null}
      </svg>

      {hover !== null ? (
        <div
          className={`chart-tooltip mono${
            x(hover) / W < 0.16 ? " is-left" : x(hover) / W > 0.82 ? " is-right" : ""
          }`}
          style={{ left: `${(x(hover) / W) * 100}%` }}
          role="status"
        >
          <strong>{data.labels[hover]}</strong>
          <span>
            <i className="dot dot--total"></i>Jami: {formatNumber(data.total[hover])} mln
          </span>
          <span>
            <i className="dot dot--digital"></i>Raqamli: {formatNumber(data.digital[hover])} mln
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- DRI gauge ---------- */

function DriGauge({ value }) {
  const arcLen = Math.PI * 52;
  const angle = (value / 100) * 180;
  const rad = ((180 - angle) * Math.PI) / 180;
  const cx = 70 + 52 * Math.cos(rad);
  const cy = 70 - 52 * Math.sin(rad);
  return (
    <svg className="dri-gauge" viewBox="0 0 140 78" aria-hidden="true">
      <path d="M18 70 A52 52 0 0 1 122 70" fill="none" stroke="rgba(20, 28, 22, 0.1)" strokeWidth="10" strokeLinecap="round" />
      <path
        d="M18 70 A52 52 0 0 1 122 70"
        fill="none"
        stroke="var(--pitch)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={arcLen}
        strokeDashoffset={arcLen - (arcLen * value) / 100}
      />
      <circle cx={cx} cy={cy} r="5" fill="var(--volt)" stroke="var(--pitch-deep)" strokeWidth="2" />
    </svg>
  );
}

/* ---------- Sahifa ---------- */

const STAT_DEFS = [
  { key: "revenue", label: "Jami daromad", format: (s) => formatMln(s.value), sub: () => "so'm" },
  { key: "users", label: "Faol foydalanuvchilar", format: (s) => formatNumber(s.value), sub: () => "foydalanuvchi" },
  { key: "fanActivity", label: "Muxlislar faolligi", format: (s) => `${s.value}%`, sub: () => "MF indeksi" },
  { key: "dri", label: "Raqamli rivojlanish", format: (s) => s.value, sub: () => "DRI · 100 dan" },
];

export default function DashboardPage() {
  const { state, dispatch, organization } = useDemo();
  const period=state.period;
  const setPeriod=value=>dispatch({type:'period',value});
  const { data, digitalShare, DIGITAL_SOURCES, KPI_ROWS, RECOMMENDATIONS, SEGMENTS } = useMemo(()=>legacyDashboard(state),[state]);

  return (
    <div className="dash">
      <header className="dash-head">
        <div className="dash-title">
          <span className="dash-eyebrow">Rahbar kabineti</span>
          <h1>Boshqaruv paneli</h1>
          <p>
            <span className="live-dot" aria-hidden="true"></span>
            {organization.name} · joriy demo ma’lumotlari
          </p>
        </div>

        <div className="dash-filter">
          <span>Ko'rsatish davri</span>
          <div className="period-switch" role="tablist" aria-label="Davr bo'yicha filtr">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={period === p.id}
                className={`period-btn${period === p.id ? " is-active" : ""}`}
                onClick={() => setPeriod(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Stat kartalar */}
      <section className="stat-grid" aria-label="Asosiy ko'rsatkichlar">
        {STAT_DEFS.map((def) => {
          const stat = data.stats[def.key];
          return (
            <article className="stat-card" key={def.key}>
              <div className="stat-top">
                <span className="stat-label">
                  <i className="stat-icon">
                    <MetricIcon name={def.key} />
                  </i>
                  {def.label}
                </span>
                <DeltaChip value={stat.delta} />
              </div>
              <p className="stat-value mono">{def.format(stat)}</p>
              <p className="stat-sub">
                {def.sub(stat)} · {data.compareLabel}
              </p>
              <Sparkline points={stat.spark} id={def.key} />
            </article>
          );
        })}
      </section>

      {/* Daromad grafigi + DRI/manbalar */}
      <section className="dash-row dash-row--main">
        <article className="panel-card panel-card--chart">
          <header className="panel-card-head">
            <div>
              <h2>Daromad dinamikasi</h2>
              <p>mln so'm · davr kesimida</p>
            </div>
            <div className="chart-legend">
              <span>
                <i className="dot dot--total"></i>Jami daromad
              </span>
              <span>
                <i className="dot dot--digital"></i>Raqamli xizmatlar
              </span>
            </div>
          </header>
          <RevenueChart data={data.chart} />
          <footer className="chart-foot">
            <span>
              Raqamli xizmatlar ulushi: <strong className="mono">{digitalShare}%</strong>
            </span>
            <span>
              Raqamli daromad: <strong className="mono">{formatMln(data.digitalTotal)} so'm</strong>
            </span>
          </footer>
        </article>

        <div className="dash-side">
          <article className="panel-card dri-card">
            <header className="panel-card-head">
              <div>
                <h2>DRI indeksi</h2>
                <p>raqamli rivojlanish</p>
              </div>
              <DeltaChip value={data.stats.dri.delta} suffix="" />
            </header>
            <div className="dri-card-body">
              <DriGauge value={data.stats.dri.value} />
              <div className="dri-card-value">
                <span className="mono">{data.stats.dri.value}</span>
                <em>{getDriLevel(data.stats.dri.value).label}</em>
              </div>
            </div>
            <p className="dri-card-note">12 indikator bo'yicha vaznli baholash asosida</p>
          </article>

          <article className="panel-card sources-card">
            <header className="panel-card-head">
              <div>
                <h2>Raqamli daromad manbalari</h2>
                <p>davr bo'yicha taqsimot</p>
              </div>
            </header>
            <ul className="sources-list">
              {DIGITAL_SOURCES.map((source) => (
                <li key={source.label}>
                  <span className="source-label">{source.label}</span>
                  <span className="source-bar" aria-hidden="true">
                    <span style={{ width: `${source.share * 100}%` }}></span>
                  </span>
                  <span className="source-value mono">
                    {formatMln(data.digitalTotal * source.share)}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      {/* KPI jadvali + tavsiyalar/segmentlar */}
      <section className="dash-row dash-row--bottom">
        <article className="panel-card kpi-panel">
          <header className="panel-card-head">
            <div>
              <h2>KPI monitoring</h2>
              <p>oylik kesim · maqsadga nisbatan</p>
            </div>
          </header>
          <div className="kpi-table-scroll">
            <table className="kpi-table">
              <thead>
                <tr>
                  <th scope="col">Ko'rsatkich</th>
                  <th scope="col">Joriy</th>
                  <th scope="col">O'zgarish</th>
                  <th scope="col">Maqsad</th>
                  <th scope="col">Bajarilish</th>
                </tr>
              </thead>
              <tbody>
                {KPI_ROWS.map((row) => (
                  <tr key={row.code}>
                    <td>
                      <span className="kpi-row-code mono">{row.code}</span>
                      <span className="kpi-row-name">{row.name}</span>
                    </td>
                    <td className="mono">{row.current}</td>
                    <td>
                      <DeltaChip value={row.change} />
                    </td>
                    <td className="mono kpi-cell-muted">{row.target}</td>
                    <td>
                      <span className="kpi-bar" aria-label={`Bajarilish ${row.progress}%`}>
                        <span
                          className="kpi-bar-fill"
                          style={{ width: `${Math.min(row.progress, 100)}%` }}
                        ></span>
                      </span>
                      <span className="mono kpi-bar-value">{row.progress}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="dash-side">
          <article className="panel-card advice-card">
            <header className="panel-card-head">
              <div>
                <h2>Tavsiyalar</h2>
                <p>Decision Support</p>
              </div>
            </header>
            <ul className="advice-list">
              {RECOMMENDATIONS.map((rec) => (
                <li key={rec.id} className={`advice-item advice-item--${rec.tone}`}>
                  <strong>{rec.title}</strong>
                  <p>{rec.text}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel-card segments-card">
            <header className="panel-card-head">
              <div>
                <h2>Muxlislar segmentlari</h2>
                <p>faollik bo'yicha</p>
              </div>
            </header>
            <div className="segments-bar" aria-hidden="true">
              {SEGMENTS.map((segment) => (
                <span
                  key={segment.label}
                  className={`seg seg--${segment.tone}`}
                  style={{ width: `${segment.share}%` }}
                ></span>
              ))}
            </div>
            <ul className="segments-list">
              {SEGMENTS.map((segment) => (
                <li key={segment.label}>
                  <i className={`dot seg--${segment.tone}`} aria-hidden="true"></i>
                  <span className="segment-label">{segment.label}</span>
                  <span className="mono segment-count">{formatNumber(segment.count)}</span>
                  <span className="mono segment-share">{segment.share}%</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
