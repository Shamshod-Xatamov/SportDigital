"use client";

import { useCallback, useMemo, useState } from "react";
import {useDemo} from "@/components/demo/DemoProvider";
import {metrics,canAssess,customerActivity} from "@/lib/demo/model.mjs";
import {FormDrawer} from "@/components/demo/Common";

import Drawer from "@/components/ui/Drawer";
import {
  KPIS as BASE_KPIS,
  KPI_CATEGORIES,
  KPI_PERIODS,
  MONTH_LABELS,
  calcChange,
  calcProgress,
  getCategory,
  getStatus,
} from "@/lib/mock/kpi";

function Icon({ name }) {
  const icons = {
    target: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12.3 2.8 2.8L16 9.6" />
      </>
    ),
    trend: (
      <>
        <path d="M4 18 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),
    alert: (
      <>
        <path d="M12 4.5 21 19.5H3L12 4.5z" />
        <path d="M12 10v4M12 17h.01" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    formula: (
      <>
        <path d="M5 5h14M5 12h9M5 19h14" />
      </>
    ),
    link: (
      <>
        <path d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1" />
        <path d="M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" />
      </>
    ),
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

const formatFixed = (value, digits = 0) => value.toFixed(digits).replace(".", ",");

const formatValue = (kpi, value) =>
  `${formatFixed(value, kpi.decimals)}${kpi.unit}${kpi.suffix ?? ""}`;

function DeltaChip({ value }) {
  const up = value >= 0;
  return (
    <span className={`kpm-delta ${up ? "is-up" : "is-down"}`}>
      <svg viewBox="0 0 10 10" aria-hidden="true">
        {up ? <path d="M1.5 6.5 5 3l3.5 3.5" /> : <path d="M1.5 3.5 5 7l3.5-3.5" />}
      </svg>
      <span className="mono">{formatFixed(Math.abs(value), 1)}%</span>
    </span>
  );
}

/* ---------- Gauge (TZ 18: Gauge Chart) ---------- */

function Gauge({ progress, status }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const filled = Math.min(progress, 100);
  return (
    <span className={`kpm-gauge kpm-gauge--${status}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={r} className="kpm-gauge-track" />
        <circle
          cx="32"
          cy="32"
          r={r}
          className="kpm-gauge-fill"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * filled) / 100}
        />
      </svg>
      <span className="kpm-gauge-value mono">{Math.round(progress)}%</span>
    </span>
  );
}

/* ---------- Sparkline ---------- */

function Sparkline({ points, status }) {
  const W = 132;
  const H = 30;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * W;
      const y = H - 3 - ((p - min) / range) * (H - 6);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg className={`kpm-spark kpm-spark--${status}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---------- Batafsil trend grafigi ---------- */

const CHART = { W: 620, H: 240, padL: 44, padR: 16, padT: 20, padB: 32 };

function TrendChart({ kpi, target }) {
  const [hover, setHover] = useState(null);
  const { W, H, padL, padR, padT, padB } = CHART;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const points = kpi.trend;
  const rawMax = Math.max(...points, target);
  const rawMin = Math.min(...points);
  const pad = (rawMax - rawMin) * 0.25 || rawMax * 0.1;
  const max = rawMax + pad;
  const min = Math.max(0, rawMin - pad);
  const n = points.length;
  const x = (i) => padL + (i / (n - 1)) * innerW;
  const y = (v) => padT + innerH - ((v - min) / (max - min)) * innerH;

  const line = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)} ${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;

  return (
    <div className="kpm-chart-wrap" onMouseLeave={() => setHover(null)}>
      <svg className="kpm-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${kpi.name} — 12 oylik dinamika`}>
        {[0, 1, 2, 3].map((i) => {
          const gy = padT + (innerH / 3) * i;
          const value = max - ((max - min) / 3) * i;
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={gy} y2={gy} className="kpm-chart-grid" />
              <text x={padL - 8} y={gy + 3.5} textAnchor="end" className="kpm-chart-tick">
                {formatFixed(value, kpi.decimals)}
              </text>
            </g>
          );
        })}

        <path d={area} className="kpm-chart-area" />
        <path d={line} className="kpm-chart-line" />

        <line x1={padL} x2={W - padR} y1={y(target)} y2={y(target)} className="kpm-chart-target" />
        <text x={W - padR} y={y(target) - 6} textAnchor="end" className="kpm-chart-target-label">
          Maqsad {formatValue(kpi, target)}
        </text>

        {MONTH_LABELS.map((label, i) => (
          <text key={label} x={x(i)} y={H - padB + 19} textAnchor="middle" className="kpm-chart-tick">
            {label}
          </text>
        ))}

        {hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} className="kpm-chart-cursor" />
            <circle cx={x(hover)} cy={y(points[hover])} r="4.4" className="kpm-chart-dot" />
          </g>
        ) : null}

        {MONTH_LABELS.map((label, i) => (
          <rect
            key={`hit-${label}`}
            x={padL + (innerW / n) * i}
            y={padT}
            width={innerW / n}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {hover !== null ? (
        <div
          className={`kpm-tooltip${hover < 2 ? " is-left" : hover > 9 ? " is-right" : ""}`}
          style={{ left: `${(x(hover) / W) * 100}%` }}
          role="status"
        >
          <strong>{MONTH_LABELS[hover]} 2026</strong>
          <span className="mono">{formatValue(kpi, points[hover])}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Sahifa ---------- */

export default function KpiPage() {
  const {state,profile,organizationId,dispatch}=useDemo();
  const period=['month','quarter','year'].includes(state.period)?state.period:'month';
  const setPeriod=value=>dispatch({type:'period',value});
  const [goalsOpen,setGoalsOpen]=useState(false);
  const closeGoals=useCallback(()=>setGoalsOpen(false),[]);
  const goals=state.settings[`kpi:${organizationId}:${period}`]??{};
  const m=metrics({...state,period});
  const customers=state.customers.filter(c=>c.organizationId===organizationId);
  const dynamic={ MF:customers.length?customers.filter(c=>!customerActivity(state,c.id).inactive&&customerActivity(state,c.id).lastDate).length/customers.length*100:0, SD:m.expense?m.revenue/m.expense*100:0, ARPU:m.customers?m.revenue/m.customers/1000:0, DRI:m.dri };
  const KPIS=BASE_KPIS.map(k=>({...k,values:{...k.values,[period]:{...k.values[period],current:dynamic[k.code]??k.values[period].current,target:goals[k.code]??k.values[period].target}},source:dynamic[k.code]!==undefined?k.source:`Namuna: ${k.source}`}));
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);

  const closeDetail = useCallback(() => setSelected(null), []);

  const rows = useMemo(
    () =>
      KPIS.map((kpi) => {
        const values = kpi.values[period];
        const change = calcChange(values.current, values.previous);
        const progress = calcProgress(values.current, values.target);
        return { kpi, ...values, change, progress, status: getStatus(progress) };
      }),
    [state, period],
  );

  const visible = useMemo(
    () => (category === "all" ? rows : rows.filter((row) => row.kpi.category === category)),
    [rows, category],
  );

  const summary = useMemo(() => {
    const avg = rows.reduce((sum, row) => sum + Math.min(row.progress, 100), 0) / rows.length;
    return {
      average: avg,
      reached: rows.filter((row) => row.progress >= 100).length,
      improved: rows.filter((row) => row.change > 0).length,
      attention: rows.filter((row) => row.progress < 90).length,
    };
  }, [rows]);

  const ranked = useMemo(() => [...rows].sort((a, b) => b.progress - a.progress), [rows]);
  const periodLabel = KPI_PERIODS.find((item) => item.id === period)?.label.toLowerCase();

  return (
    <div className="kpi-page">
      {goalsOpen&&<FormDrawer title="KPI maqsadlari" initial={Object.fromEntries(KPIS.map(k=>[k.code,k.values[period].target]))} fields={KPIS.map(k=>({key:k.code,label:k.name,type:'number',min:0.01,step:'any'}))} onClose={closeGoals} onSave={values=>dispatch({type:'kpi-goals',values},'KPI maqsadlari saqlandi.')} />}
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Samaradorlik monitoringi</span>
          <h1>KPI monitoring</h1>
          <p>8 ta asosiy ko'rsatkich — joriy qiymat, o'zgarish va maqsadga erishish darajasi.</p>
        </div>
        <div className="legacy-inline-actions">{canAssess(profile.role) && <button className="org-secondary-button" onClick={()=>setGoalsOpen(true)}>Maqsadlarni o‘zgartirish</button>}<div className="period-switch" role="tablist" aria-label="Davr bo'yicha filtr">
          {KPI_PERIODS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={period === item.id}
              className={`period-btn${period === item.id ? " is-active" : ""}`}
              onClick={() => setPeriod(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div></div>
      </header>

      <section className="org-summary-grid" aria-label="KPI umumiy holati">
        <article className="org-summary-card">
          <span className="org-summary-icon">
            <Icon name="target" />
          </span>
          <div>
            <span>O'rtacha bajarilish</span>
            <strong className="mono">{formatFixed(summary.average, 1)}%</strong>
            <small>8 ta KPI bo'yicha</small>
          </div>
        </article>
        <article className="org-summary-card">
          <span className="org-summary-icon">
            <Icon name="check" />
          </span>
          <div>
            <span>Maqsadga erishgan</span>
            <strong className="mono">
              {summary.reached} / {rows.length}
            </strong>
            <small>maqsad qiymatiga yetdi</small>
          </div>
        </article>
        <article className="org-summary-card">
          <span className="org-summary-icon">
            <Icon name="trend" />
          </span>
          <div>
            <span>O'sish ko'rsatgan</span>
            <strong className="mono">
              {summary.improved} / {rows.length}
            </strong>
            <small>oldingi davrga nisbatan</small>
          </div>
        </article>
        <article className="org-summary-card">
          <span className="org-summary-icon">
            <Icon name="alert" />
          </span>
          <div>
            <span>E'tibor talab qiladi</span>
            <strong className="mono">{summary.attention}</strong>
            <small>bajarilish 90% dan past</small>
          </div>
        </article>
      </section>

      {/* Kategoriya filtri */}
      <div className="kpm-filter" role="group" aria-label="Kategoriya bo'yicha filtr">
        <button
          type="button"
          className={`kpm-chip${category === "all" ? " is-active" : ""}`}
          aria-pressed={category === "all"}
          onClick={() => setCategory("all")}
        >
          Barchasi
          <span className="mono">{rows.length}</span>
        </button>
        {KPI_CATEGORIES.map((item) => {
          const count = rows.filter((row) => row.kpi.category === item.id).length;
          if (count === 0) return null;
          return (
            <button
              key={item.id}
              type="button"
              className={`kpm-chip${category === item.id ? " is-active" : ""}`}
              aria-pressed={category === item.id}
              onClick={() => setCategory(category === item.id ? "all" : item.id)}
            >
              {item.label}
              <span className="mono">{count}</span>
            </button>
          );
        })}
      </div>

      {/* KPI kartalari */}
      <section className="kpm-grid" aria-label="KPI ko'rsatkichlari">
        {visible.map((row) => (
          <button
            type="button"
            key={row.kpi.code}
            className={`kpm-card kpm-card--${row.status.id}`}
            onClick={() => setSelected(row)}
          >
            <span className="kpm-card-top">
              <span className="kpm-code mono">{row.kpi.code}</span>
              <span className="kpm-category">{getCategory(row.kpi.category).label}</span>
              <DeltaChip value={row.change} />
            </span>

            <span className="kpm-card-body">
              <Gauge progress={row.progress} status={row.status.id} />
              <span className="kpm-card-values">
                <b className="mono">{formatValue(row.kpi, row.current)}</b>
                <small>{row.kpi.name}</small>
              </span>
            </span>

            <span className="kpm-card-foot">
              <span>
                Oldingi <b className="mono">{formatValue(row.kpi, row.previous)}</b>
              </span>
              <span>
                Maqsad <b className="mono">{formatValue(row.kpi, row.target)}</b>
              </span>
            </span>

            <Sparkline points={row.kpi.trend} status={row.status.id} />
          </button>
        ))}
      </section>

      {/* Maqsadga erishish darajasi */}
      <section className="kpm-panel">
        <header className="kpm-panel-head">
          <div>
            <h2>Maqsadga erishish darajasi</h2>
            <p>Joriy {periodLabel} kesimida, bajarilish foizi bo'yicha saralangan</p>
          </div>
          <div className="kpm-legend">
            <span>
              <i className="kpm-dot kpm-dot--reached"></i>Erishildi
            </span>
            <span>
              <i className="kpm-dot kpm-dot--close"></i>Yaqin
            </span>
            <span>
              <i className="kpm-dot kpm-dot--mid"></i>O'rtacha
            </span>
          </div>
        </header>

        <ul className="kpm-rank-list">
          {ranked.map((row) => (
            <li key={row.kpi.code}>
              <span className="kpm-rank-name">
                <b className="mono">{row.kpi.code}</b>
                <span>{row.kpi.name}</span>
              </span>
              <span className="kpm-rank-bar" aria-hidden="true">
                <i
                  className={`kpm-rank-fill kpm-rank-fill--${row.status.id}`}
                  style={{ width: `${Math.min(row.progress, 100)}%` }}
                ></i>
                <em className="kpm-rank-target"></em>
              </span>
              <span className="kpm-rank-values">
                <b className="mono">{formatValue(row.kpi, row.current)}</b>
                <small className="mono">/ {formatValue(row.kpi, row.target)}</small>
              </span>
              <span className={`kpm-rank-progress mono kpm-rank-progress--${row.status.id}`}>
                {formatFixed(row.progress, 0)}%
              </span>
            </li>
          ))}
        </ul>
      </section>

      <KpiDetail row={selected} period={period} onClose={closeDetail} />
    </div>
  );
}

function KpiDetail({ row, period, onClose }) {
  if (!row) return null;
  const { kpi } = row;
  const periodLabel = KPI_PERIODS.find((item) => item.id === period)?.label;

  return (
    <Drawer
      open={Boolean(row)}
      onClose={onClose}
      title={kpi.name}
      subtitle={`${kpi.code} · ${getCategory(kpi.category).label}`}
      size="medium"
      icon={<Icon name="target" />}
      footer={
        <button type="button" className="org-secondary-button" onClick={onClose}>
          Yopish
        </button>
      }
    >
      <div className="kpm-detail">
        <div className={`kpm-detail-hero kpm-detail-hero--${row.status.id}`}>
          <div>
            <span>Joriy qiymat · {periodLabel}</span>
            <strong className="mono">{formatValue(kpi, row.current)}</strong>
            <small className={`kpm-detail-status kpm-detail-status--${row.status.id}`}>
              {row.status.label}
            </small>
          </div>
          <Gauge progress={row.progress} status={row.status.id} />
        </div>

        <div className="org-detail-metrics kpm-detail-metrics">
          <div>
            <span>Oldingi davr</span>
            <strong className="mono">{formatValue(kpi, row.previous)}</strong>
            <small>taqqoslash bazasi</small>
          </div>
          <div>
            <span>O'zgarish</span>
            <strong className={`mono ${row.change >= 0 ? "is-up" : "is-down"}`}>
              {row.change >= 0 ? "+" : "−"}
              {formatFixed(Math.abs(row.change), 1)}%
            </strong>
            <small>oldingi davrga nisbatan</small>
          </div>
          <div>
            <span>Maqsad</span>
            <strong className="mono">{formatValue(kpi, row.target)}</strong>
            <small>{formatFixed(row.progress, 0)}% bajarildi</small>
          </div>
        </div>

        <section className="org-detail-section">
          <div className="org-detail-section-head">
            <div>
              <h3>12 oylik dinamika</h3>
              <p>Maqsad chizig'i bilan taqqoslash</p>
            </div>
          </div>
          <TrendChart kpi={kpi} target={row.target} />
        </section>

        <section className="org-detail-section">
          <h3>Hisoblash usuli</h3>
          <code className="kpm-formula mono">{kpi.formula}</code>
          <p className="kpm-detail-description">{kpi.description}</p>
          <div className="kpm-detail-source">
            <Icon name="link" />
            <span>Ma'lumot manbasi: {kpi.source}</span>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
