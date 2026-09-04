"use client";

import { useMemo, useState } from "react";

import {
  BASE_YEAR,
  HORIZON_OPTIONS,
  INDICATORS,
  METHODS,
  SCENARIOS,
  buildForecast,
  getIndicator,
} from "@/lib/mock/forecast";

function Icon({ name }) {
  const icons = {
    forecast: (
      <>
        <path d="M3.5 18c3-1 4.5-6 7-6s3.5 3 6 3 3.5-4.5 4-8" />
        <path d="M3.5 21h17" strokeDasharray="2.6 2.6" />
      </>
    ),
    model: (
      <>
        <path d="M4 20V4M4 20h16" />
        <path d="M7 16.5 11 12l3 2.5 4-6.5" />
      </>
    ),
    compare: (
      <>
        <circle cx="7" cy="8" r="2.5" />
        <circle cx="17" cy="16" r="2.5" />
        <path d="M9.5 8H20M4 16h10.5" />
      </>
    ),
    table: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
        <path d="M3.5 9.5h17M9 9.5v10" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const fmt = (value, digits = 1) => value.toFixed(digits).replace(".", ",");
const fmtInd = (indicator, value) => `${fmt(value, indicator.decimals)}${indicator.unit}`;

/* ============================================================
   Fan chart — bashorat oralig'i kengayib boruvchi "yelpig'ich"
   ============================================================ */

const FC = { W: 760, H: 330, padL: 54, padR: 20, padT: 22, padB: 42 };

function FanChart({ indicator, forecast }) {
  const [hover, setHover] = useState(null);
  const { W, H, padL, padR, padT, padB } = FC;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const points = forecast.points;
  const n = points.length;

  const allValues = points.flatMap((p) =>
    p.isHistory ? [p.value] : [p.lower95, p.upper95, p.value],
  );
  const rawMax = Math.max(...allValues);
  const rawMin = Math.min(...allValues, 0);
  const pad = (rawMax - rawMin) * 0.1;
  const yMax = rawMax + pad;
  const yMin = Math.max(0, rawMin - pad * 0.4);

  const x = (i) => padL + (i / (n - 1)) * innerW;
  const y = (v) => padT + innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  const baseIndex = points.findIndex((p) => p.year === BASE_YEAR);
  const historyPath = points
    .filter((p) => p.isHistory)
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(" ");

  // Prognoz chizig'i bazaviy yildan boshlanadi
  const forecastPoints = points.slice(baseIndex);
  const forecastPath = forecastPoints
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(baseIndex + i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(" ");

  // Yelpig'ich: bazaviy yilda kengligi nol, keyin kengayadi
  const band = (lowerKey, upperKey) => {
    const upper = forecastPoints
      .map((p, i) => {
        const v = p.isHistory ? p.value : p[upperKey];
        return `${i === 0 ? "M" : "L"}${x(baseIndex + i).toFixed(1)} ${y(v).toFixed(1)}`;
      })
      .join(" ");
    const lower = forecastPoints
      .slice()
      .reverse()
      .map((p, i) => {
        const v = p.isHistory ? p.value : p[lowerKey];
        return `L${x(n - 1 - i).toFixed(1)} ${y(v).toFixed(1)}`;
      })
      .join(" ");
    return `${upper} ${lower} Z`;
  };

  return (
    <div className="fc-chart-wrap" onMouseLeave={() => setHover(null)}>
      <svg className="fc-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${indicator.label} bo'yicha prognoz va bashorat oralig'i`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const gy = padT + (innerH / 4) * i;
          const value = yMax - ((yMax - yMin) / 4) * i;
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={gy} y2={gy} className="fc-grid" />
              <text x={padL - 9} y={gy + 3.5} textAnchor="end" className="fc-tick">
                {fmt(value, indicator.decimals === 0 ? 0 : 1)}
              </text>
            </g>
          );
        })}

        <path d={band("lower95", "upper95")} className="fc-band fc-band--95" />
        <path d={band("lower80", "upper80")} className="fc-band fc-band--80" />

        <line x1={x(baseIndex)} x2={x(baseIndex)} y1={padT} y2={padT + innerH} className="fc-divider" />
        <text x={x(baseIndex) + 7} y={padT + 12} className="fc-divider-label">
          prognoz →
        </text>

        <path d={forecastPath} className="fc-line fc-line--forecast" />
        <path d={historyPath} className="fc-line fc-line--history" />

        {points.map((p, i) => (
          <circle
            key={p.year}
            cx={x(i)}
            cy={y(p.value)}
            r={hover === i ? 5.6 : 3.8}
            className={`fc-dot${p.isHistory ? "" : " is-forecast"}${hover === i ? " is-hover" : ""}`}
          />
        ))}

        {points.map((p, i) => (
          <text key={`lbl-${p.year}`} x={x(i)} y={H - padB + 20} textAnchor="middle" className={`fc-tick${p.isHistory ? "" : " is-forecast"}`}>
            {p.year}
          </text>
        ))}

        {points.map((p, i) => (
          <rect
            key={`hit-${p.year}`}
            x={x(i) - innerW / (n - 1) / 2}
            y={padT}
            width={innerW / (n - 1)}
            height={innerH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>

      {hover !== null ? (
        <div
          className={`fc-tip${hover < 2 ? " is-left" : hover > n - 3 ? " is-right" : ""}`}
          style={{ left: `${(x(hover) / W) * 100}%` }}
          role="status"
        >
          <strong>{points[hover].year}</strong>
          <span className="mono fc-tip-value">{fmtInd(indicator, points[hover].value)}</span>
          {points[hover].isHistory ? (
            <small>haqiqiy qiymat</small>
          ) : (
            <>
              <small className="mono">
                80%: {fmt(points[hover].lower80, indicator.decimals)} –{" "}
                {fmt(points[hover].upper80, indicator.decimals)}
              </small>
              <small className="mono">
                95%: {fmt(points[hover].lower95, indicator.decimals)} –{" "}
                {fmt(points[hover].upper95, indicator.decimals)}
              </small>
            </>
          )}
        </div>
      ) : null}

      <div className="fc-legend">
        <span>
          <i className="fc-key fc-key--history"></i>Haqiqiy
        </span>
        <span>
          <i className="fc-key fc-key--forecast"></i>Prognoz
        </span>
        <span>
          <i className="fc-key fc-key--b80"></i>80% oraliq
        </span>
        <span>
          <i className="fc-key fc-key--b95"></i>95% oraliq
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   Dumbbell — barcha ko'rsatkichlar 2026 → gorizont
   ============================================================ */

function DumbbellChart({ horizon, scenarioFactor, method }) {
  const rows = useMemo(
    () =>
      INDICATORS.map((indicator) => {
        const f = buildForecast(indicator, { horizon, scenarioFactor, method });
        return { indicator, base: f.baseValue, final: f.finalValue, growth: f.growth };
      }).sort((a, b) => b.growth - a.growth),
    [horizon, scenarioFactor, method],
  );

  return (
    <ul className="fc-dumbbell">
      {rows.map((row) => {
        // Har bir qator o'z shkalasida: chap nuqta joriy qiymatning
        // gorizont qiymatiga nisbati, o'ng nuqta — 100%
        const startPct = Math.max((row.base / row.final) * 100, 4);
        return (
          <li key={row.indicator.id}>
            <span className="fc-db-label">{row.indicator.short}</span>
            <span className="fc-db-track" aria-hidden="true">
              <i className="fc-db-bar" style={{ left: `${startPct}%`, width: `${100 - startPct}%` }}></i>
              <i className="fc-db-dot fc-db-dot--base" style={{ left: `${startPct}%` }}></i>
              <i className="fc-db-dot fc-db-dot--final" style={{ left: "100%" }}></i>
            </span>
            <span className="fc-db-values mono">
              <b>{fmtInd(row.indicator, row.base)}</b>
              <em>→</em>
              <b className="is-final">{fmtInd(row.indicator, row.final)}</b>
            </span>
            <span className="fc-db-growth mono">+{fmt(row.growth, 0)}%</span>
          </li>
        );
      })}
    </ul>
  );
}

/* ============================================================
   Sahifa
   ============================================================ */

export default function ForecastPage() {
  const [indicatorId, setIndicatorId] = useState("digital");
  const [horizon, setHorizon] = useState(2030);
  const [scenarioId, setScenarioId] = useState("base");
  const [methodId, setMethodId] = useState("linear");

  const indicator = getIndicator(indicatorId);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
  const method = METHODS.find((m) => m.id === methodId) ?? METHODS[0];

  const forecast = useMemo(
    () => buildForecast(indicator, { horizon, scenarioFactor: scenario.factor, method: methodId }),
    [indicator, horizon, scenario, methodId],
  );

  const forecastYears = forecast.points.filter((p) => !p.isHistory);

  return (
    <div className="forecast-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Prognozlash</span>
          <h1>Ko'rsatkichlar prognozi</h1>
          <p>
            2021–{BASE_YEAR} yillardagi kuzatuvlar asosida {BASE_YEAR + 1}–{horizon} yillar uchun
            ekonometrik prognoz va bashorat oralig'i.
          </p>
        </div>
        <div className="fc-horizon" role="group" aria-label="Prognoz gorizonti">
          <span>Gorizont</span>
          <div className="period-switch">
            {HORIZON_OPTIONS.map((year) => (
              <button
                key={year}
                type="button"
                className={`period-btn${horizon === year ? " is-active" : ""}`}
                aria-pressed={horizon === year}
                onClick={() => setHorizon(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Asosiy prognoz */}
      <section className="fc-panel">
        <header className="fc-panel-head">
          <div>
            <span className="fc-panel-tag">
              <Icon name="forecast" />
              Prognoz modeli
            </span>
            <h2>{indicator.label}</h2>
            <p>
              {BASE_YEAR}-yil bazasi: <b className="mono">{fmtInd(indicator, forecast.baseValue)}</b> ·{" "}
              {horizon}-yil prognozi: <b className="mono">{fmtInd(indicator, forecast.finalValue)}</b>
            </p>
          </div>

          <div className="fc-controls">
            <label>
              <span>Ko'rsatkich</span>
              <select value={indicatorId} onChange={(e) => setIndicatorId(e.target.value)}>
                {INDICATORS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Model</span>
              <select value={methodId} onChange={(e) => setMethodId(e.target.value)}>
                {METHODS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <div className="fc-scenarios" role="group" aria-label="Stsenariy">
          {SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`fc-scenario fc-scenario--${item.id}${scenarioId === item.id ? " is-active" : ""}`}
              aria-pressed={scenarioId === item.id}
              onClick={() => setScenarioId(item.id)}
            >
              <i aria-hidden="true"></i>
              {item.label}
            </button>
          ))}
        </div>

        <div className="fc-main">
          <FanChart indicator={indicator} forecast={forecast} />

          <aside className="fc-side">
            <div className="fc-stat fc-stat--hero">
              <span>{horizon}-yil prognozi</span>
              <strong className="mono">{fmtInd(indicator, forecast.finalValue)}</strong>
              <small className="mono">
                80% oraliq: {fmt(forecastYears[forecastYears.length - 1].lower80, indicator.decimals)} –{" "}
                {fmt(forecastYears[forecastYears.length - 1].upper80, indicator.decimals)}
              </small>
            </div>

            <dl className="fc-stat-grid">
              <div>
                <dt>Umumiy o'sish</dt>
                <dd className="mono">+{fmt(forecast.growth, 1)}%</dd>
              </div>
              <div>
                <dt>Yillik o'rtacha (CAGR)</dt>
                <dd className="mono">+{fmt(forecast.cagr, 1)}%</dd>
              </div>
              <div>
                <dt>Determinatsiya (R²)</dt>
                <dd className="mono">{fmt(forecast.model.r2, 3)}</dd>
              </div>
              <div>
                <dt>O'rtacha xato (MAPE)</dt>
                <dd className="mono">{fmt(forecast.model.mape, 1)}%</dd>
              </div>
            </dl>

            <div className="fc-method">
              <span className="fc-method-head">
                <Icon name="model" />
                {method.label}
              </span>
              <code className="mono">{method.formula}</code>
              <p>{method.note}</p>
            </div>

            <p className="fc-note">
              <Icon name="info" />
              Bashorat oralig'i gorizont uzoqlashgani sari kengayadi — bu prognoz
              noaniqligining tabiiy o'sishini aks ettiradi.
            </p>
          </aside>
        </div>

        {/* Yillik qiymatlar */}
        <div className="fc-years">
          {forecastYears.map((point, i) => {
            const prev = i === 0 ? forecast.baseValue : forecastYears[i - 1].value;
            const change = ((point.value - prev) / prev) * 100;
            return (
              <div className="fc-year" key={point.year}>
                <span className="fc-year-label mono">{point.year}</span>
                <strong className="mono">{fmtInd(indicator, point.value)}</strong>
                <span className="fc-year-change mono">+{fmt(change, 1)}%</span>
                <span className="fc-year-range mono">
                  {fmt(point.lower80, indicator.decimals)}–{fmt(point.upper80, indicator.decimals)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Barcha ko'rsatkichlar */}
      <section className="fc-panel">
        <header className="fc-panel-head">
          <div>
            <span className="fc-panel-tag">
              <Icon name="compare" />
              Umumiy prognoz
            </span>
            <h2>Barcha ko'rsatkichlar: {BASE_YEAR} → {horizon}</h2>
            <p>
              {scenario.label.toLowerCase()} stsenariy · o'sish sur'ati bo'yicha saralangan
            </p>
          </div>
          <div className="fc-dumbbell-legend">
            <span>
              <i className="fc-db-key fc-db-key--base"></i>
              {BASE_YEAR}
            </span>
            <span>
              <i className="fc-db-key fc-db-key--final"></i>
              {horizon}
            </span>
          </div>
        </header>

        <DumbbellChart horizon={horizon} scenarioFactor={scenario.factor} method={methodId} />
      </section>
    </div>
  );
}
