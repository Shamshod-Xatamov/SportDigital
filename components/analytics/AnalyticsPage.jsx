"use client";

import { useMemo, useState } from "react";

import {
  ANOMALY_NOTES,
  ANOMALY_SERIES,
  OBSERVATION_LABELS,
  RADAR_AXES,
  RADAR_ORGANIZATIONS,
  VARIABLES,
  describeStrength,
  detectAnomalies,
  getVariable,
  linearRegression,
  pearson,
} from "@/lib/mock/analytics";

function Icon({ name }) {
  const icons = {
    grid: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    scatter: (
      <>
        <path d="M4 20V4M4 20h16" />
        <circle cx="9" cy="15" r="1.6" />
        <circle cx="13" cy="11" r="1.6" />
        <circle cx="17" cy="7" r="1.6" />
      </>
    ),
    radar: (
      <>
        <path d="M12 3.5 20 9l-3 9.5H7L4 9z" />
        <path d="M12 8.5 16.5 12l-1.7 5.2H9.2L7.5 12z" />
      </>
    ),
    alert: (
      <>
        <path d="M12 4.5 21 19.5H3L12 4.5z" />
        <path d="M12 10v4M12 17h.01" />
      </>
    ),
    sigma: <path d="M17 5H7l6 7-6 7h10" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const fmt = (value, digits = 2) => value.toFixed(digits).replace(".", ",");

/* ============================================================
   1. Korrelyatsiya matritsasi — HEATMAP
   ============================================================ */

function CorrelationHeatmap({ onSelectPair, xVar, yVar }) {
  const [hover, setHover] = useState(null);

  const matrix = useMemo(
    () =>
      VARIABLES.map((row) =>
        VARIABLES.map((col) => pearson(row.series, col.series)),
      ),
    [],
  );

  const n = VARIABLES.length;
  const cell = 46;
  const labelW = 52;
  const labelH = 34;
  const W = labelW + cell * n;
  const H = labelH + cell * n;

  const cellFill = (r, isDiagonal) => {
    if (isDiagonal) return "var(--an-diagonal)";
    const alpha = Math.min(Math.abs(r), 1) * 0.92;
    return r >= 0
      ? `color-mix(in srgb, var(--an-pos) ${alpha * 100}%, var(--app-panel))`
      : `color-mix(in srgb, var(--an-neg) ${alpha * 100}%, var(--app-panel))`;
  };

  return (
    <div className="an-heatmap-wrap">
      <svg className="an-heatmap" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ko'rsatkichlar orasidagi korrelyatsiya matritsasi">
        {VARIABLES.map((v, c) => (
          <text key={`top-${v.id}`} x={labelW + c * cell + cell / 2} y={labelH - 11} textAnchor="middle" className="an-heat-label">
            {v.code}
          </text>
        ))}
        {VARIABLES.map((v, r) => (
          <text key={`left-${v.id}`} x={labelW - 9} y={labelH + r * cell + cell / 2 + 4} textAnchor="end" className="an-heat-label">
            {v.code}
          </text>
        ))}

        {matrix.map((row, r) =>
          row.map((value, c) => {
            const isDiagonal = r === c;
            const isHover = hover && hover.r === r && hover.c === c;
            const isSelected =
              (VARIABLES[c].id === xVar && VARIABLES[r].id === yVar) ||
              (VARIABLES[r].id === xVar && VARIABLES[c].id === yVar);
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={labelW + c * cell + 2}
                  y={labelH + r * cell + 2}
                  width={cell - 4}
                  height={cell - 4}
                  rx="6"
                  fill={cellFill(value, isDiagonal)}
                  className={`an-heat-cell${isHover ? " is-hover" : ""}${isSelected ? " is-selected" : ""}`}
                  onMouseEnter={() => setHover({ r, c })}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => !isDiagonal && onSelectPair(VARIABLES[c].id, VARIABLES[r].id)}
                />
                <text
                  x={labelW + c * cell + cell / 2}
                  y={labelH + r * cell + cell / 2 + 4}
                  textAnchor="middle"
                  className={`an-heat-value${Math.abs(value) > 0.62 && !isDiagonal ? " is-strong" : ""}`}
                  pointerEvents="none"
                >
                  {isDiagonal ? "1" : fmt(value, 2).replace("0,", ",")}
                </text>
              </g>
            );
          }),
        )}
      </svg>

      {hover ? (
        <div className="an-heat-tip" role="status">
          <strong>
            {VARIABLES[hover.r].code} ~ {VARIABLES[hover.c].code}
          </strong>
          <span>
            r = <b className="mono">{fmt(matrix[hover.r][hover.c], 3)}</b>
          </span>
          <small>{describeStrength(matrix[hover.r][hover.c])} bog'lanish</small>
        </div>
      ) : null}

      <div className="an-heat-scale" aria-hidden="true">
        <span>−1,0</span>
        <i className="an-heat-gradient"></i>
        <span>+1,0</span>
      </div>
    </div>
  );
}

/* ============================================================
   2. Regressiya — SCATTER + moslashtirilgan chiziq
   ============================================================ */

const SC = { W: 480, H: 320, padL: 52, padR: 18, padT: 18, padB: 44 };

function ScatterPlot({ xVar, yVar }) {
  const [hover, setHover] = useState(null);
  const x = getVariable(xVar);
  const y = getVariable(yVar);
  const model = useMemo(() => linearRegression(x.series, y.series), [x, y]);

  const { W, H, padL, padR, padT, padB } = SC;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const xMin = Math.min(...x.series);
  const xMax = Math.max(...x.series);
  const yMin = Math.min(...y.series);
  const yMax = Math.max(...y.series);
  const xPad = (xMax - xMin) * 0.08 || 1;
  const yPad = (yMax - yMin) * 0.08 || 1;
  const x0 = xMin - xPad;
  const x1 = xMax + xPad;
  const y0 = yMin - yPad;
  const y1 = yMax + yPad;

  const px = (v) => padL + ((v - x0) / (x1 - x0)) * innerW;
  const py = (v) => padT + innerH - ((v - y0) / (y1 - y0)) * innerH;

  const lineY0 = model.intercept + model.slope * x0;
  const lineY1 = model.intercept + model.slope * x1;

  return (
    <div className="an-scatter-wrap">
      <svg className="an-scatter" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${x.label} va ${y.label} orasidagi regressiya tahlili`}>
        {[0, 1, 2, 3].map((i) => {
          const gy = padT + (innerH / 3) * i;
          const value = y1 - ((y1 - y0) / 3) * i;
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={gy} y2={gy} className="an-grid" />
              <text x={padL - 8} y={gy + 3.5} textAnchor="end" className="an-tick">
                {Math.round(value)}
              </text>
            </g>
          );
        })}
        {[0, 1, 2, 3].map((i) => {
          const gx = padL + (innerW / 3) * i;
          const value = x0 + ((x1 - x0) / 3) * i;
          return (
            <text key={`x-${i}`} x={gx} y={H - padB + 18} textAnchor="middle" className="an-tick">
              {Math.round(value)}
            </text>
          );
        })}

        <line x1={px(x0)} y1={py(lineY0)} x2={px(x1)} y2={py(lineY1)} className="an-fit-line" />

        {x.series.map((vx, i) => (
          <circle
            key={i}
            cx={px(vx)}
            cy={py(y.series[i])}
            r={hover === i ? 6 : 4.4}
            className={`an-point${hover === i ? " is-hover" : ""}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}

        <text x={W / 2} y={H - 8} textAnchor="middle" className="an-axis-title">
          {x.label} ({x.code})
        </text>
        <text x={14} y={padT + innerH / 2} textAnchor="middle" className="an-axis-title" transform={`rotate(-90 14 ${padT + innerH / 2})`}>
          {y.label} ({y.code})
        </text>
      </svg>

      {hover !== null ? (
        <div
          className="an-scatter-tip"
          style={{
            left: `${(px(x.series[hover]) / W) * 100}%`,
            top: `${(py(y.series[hover]) / H) * 100}%`,
          }}
          role="status"
        >
          <strong>{OBSERVATION_LABELS[hover]}</strong>
          <span className="mono">
            {x.code} {fmt(x.series[hover], 1)}
            {x.unit}
          </span>
          <span className="mono">
            {y.code} {fmt(y.series[hover], 1)}
            {y.unit}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- R² donut (Pie Chart) ---------- */

function VarianceDonut({ r2 }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const explained = Math.max(0, Math.min(r2, 1));
  return (
    <div className="an-donut">
      <svg viewBox="0 0 90 90" aria-hidden="true">
        <circle cx="45" cy="45" r={r} className="an-donut-track" />
        <circle
          cx="45"
          cy="45"
          r={r}
          className="an-donut-fill"
          strokeDasharray={c}
          strokeDashoffset={c - c * explained}
        />
      </svg>
      <span className="an-donut-center">
        <b className="mono">{fmt(explained * 100, 1)}%</b>
        <small>R²</small>
      </span>
    </div>
  );
}

/* ============================================================
   3. Tashkilotlar taqqoslashi — RADAR
   ============================================================ */

function RadarChart({ active }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const radius = 112;
  const axes = RADAR_AXES.length;

  const point = (axisIndex, value) => {
    const angle = (Math.PI * 2 * axisIndex) / axes - Math.PI / 2;
    const r = (value / 100) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const orgs = RADAR_ORGANIZATIONS.filter((org) => active.includes(org.id));

  return (
    <svg className="an-radar" viewBox={`0 0 ${size} ${size + 16}`} role="img" aria-label="Tashkilotlarni ko'p o'lchovli taqqoslash">
      {[20, 40, 60, 80, 100].map((level) => (
        <polygon
          key={level}
          className="an-radar-grid"
          points={RADAR_AXES.map((_, i) => point(i, level).join(",")).join(" ")}
        />
      ))}

      {RADAR_AXES.map((axis, i) => {
        const [ax, ay] = point(i, 100);
        const [lx, ly] = point(i, 128);
        return (
          <g key={axis.id}>
            <line x1={cx} y1={cy} x2={ax} y2={ay} className="an-radar-spoke" />
            <text x={lx} y={ly} textAnchor="middle" className="an-radar-label">
              {axis.label.split(" ").map((word, wi, arr) => (
                <tspan key={word} x={lx} dy={wi === 0 ? (arr.length > 1 ? -4 : 3) : 11}>
                  {word}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      {orgs.map((org) => (
        <polygon
          key={org.id}
          className={`an-radar-shape an-radar-shape--${org.tone}`}
          points={org.values.map((v, i) => point(i, v).join(",")).join(" ")}
        />
      ))}
      {orgs.map((org) =>
        org.values.map((v, i) => {
          const [dx, dy] = point(i, v);
          return <circle key={`${org.id}-${i}`} cx={dx} cy={dy} r="3.2" className={`an-radar-dot an-radar-dot--${org.tone}`} />;
        }),
      )}
    </svg>
  );
}

/* ============================================================
   4. Anomaliyalar — LOLLIPOP (trenddan chetlanish)
   ============================================================ */

const LP = { W: 720, H: 250, padL: 46, padR: 16, padT: 22, padB: 40 };

function DeviationChart({ analysis }) {
  const [hover, setHover] = useState(null);
  const { W, H, padL, padR, padT, padB } = LP;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const values = analysis.residuals;
  const maxAbs = Math.max(...values.map(Math.abs)) * 1.15;
  const n = values.length;
  const step = innerW / n;
  const zeroY = padT + innerH / 2;
  const y = (v) => zeroY - (v / maxAbs) * (innerH / 2);
  const x = (i) => padL + step * i + step / 2;

  return (
    <div className="an-dev-wrap" onMouseLeave={() => setHover(null)}>
      <svg className="an-dev" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Trenddan chetlanish va aniqlangan anomaliyalar">
        <rect
          x={padL}
          y={y(analysis.bound)}
          width={innerW}
          height={y(-analysis.bound) - y(analysis.bound)}
          className="an-dev-band"
        />
        <line x1={padL} x2={W - padR} y1={y(analysis.bound)} y2={y(analysis.bound)} className="an-dev-bound" />
        <line x1={padL} x2={W - padR} y1={y(-analysis.bound)} y2={y(-analysis.bound)} className="an-dev-bound" />
        <line x1={padL} x2={W - padR} y1={zeroY} y2={zeroY} className="an-dev-zero" />

        <text x={padL - 8} y={y(analysis.bound) + 3.5} textAnchor="end" className="an-tick">
          +2σ
        </text>
        <text x={padL - 8} y={y(-analysis.bound) + 3.5} textAnchor="end" className="an-tick">
          −2σ
        </text>
        <text x={padL - 8} y={zeroY + 3.5} textAnchor="end" className="an-tick">
          0
        </text>

        {analysis.points.map((p, i) => (
          <g key={i} onMouseEnter={() => setHover(i)}>
            <line
              x1={x(i)}
              x2={x(i)}
              y1={zeroY}
              y2={y(p.residual)}
              className={`an-dev-stem${p.isAnomaly ? " is-anomaly" : ""}`}
            />
            <circle
              cx={x(i)}
              cy={y(p.residual)}
              r={p.isAnomaly ? 6 : 3.6}
              className={`an-dev-dot${p.isAnomaly ? " is-anomaly" : ""}${hover === i ? " is-hover" : ""}`}
            />
            <rect x={padL + step * i} y={padT} width={step} height={innerH} fill="transparent" />
          </g>
        ))}

        {OBSERVATION_LABELS.map((label, i) =>
          i % 3 === 0 ? (
            <text key={label} x={x(i)} y={H - padB + 20} textAnchor="middle" className="an-tick">
              {label}
            </text>
          ) : null,
        )}
      </svg>

      {hover !== null ? (
        <div
          className={`an-dev-tip${hover < 3 ? " is-left" : hover > n - 4 ? " is-right" : ""}`}
          style={{ left: `${(x(hover) / W) * 100}%` }}
          role="status"
        >
          <strong>{OBSERVATION_LABELS[hover]}</strong>
          <span className="mono">
            Chetlanish: {analysis.residuals[hover] >= 0 ? "+" : "−"}
            {fmt(Math.abs(analysis.residuals[hover]), 0)} mln
          </span>
          <span className="mono">z = {fmt(analysis.points[hover].z, 2)}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================
   Sahifa
   ============================================================ */

export default function AnalyticsPage() {
  const [xVar, setXVar] = useState("mx");
  const [yVar, setYVar] = useState("rd");
  const [activeOrgs, setActiveOrgs] = useState(["olimp", "humo"]);

  const x = getVariable(xVar);
  const y = getVariable(yVar);
  const model = useMemo(() => linearRegression(x.series, y.series), [x, y]);
  const analysis = useMemo(() => detectAnomalies(ANOMALY_SERIES.values), []);
  const anomalies = analysis.points.filter((p) => p.isAnomaly);

  const toggleOrg = (id) =>
    setActiveOrgs((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((item) => item !== id)
          : current
        : [...current, id],
    );

  const strongPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < VARIABLES.length; i += 1) {
      for (let j = i + 1; j < VARIABLES.length; j += 1) {
        pairs.push({
          a: VARIABLES[i],
          b: VARIABLES[j],
          r: pearson(VARIABLES[i].series, VARIABLES[j].series),
        });
      }
    }
    return pairs.sort((p, q) => Math.abs(q.r) - Math.abs(p.r));
  }, []);

  return (
    <div className="analytics-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Big Data va analitika</span>
          <h1>Statistik tahlil</h1>
          <p>
            24 oylik kuzatuv bazasi asosida korrelyatsion, regression va anomaliya tahlillari.
          </p>
        </div>
        <div className="an-dataset">
          <Icon name="sigma" />
          <span>
            <b className="mono">{VARIABLES.length}</b> o'zgaruvchi ·{" "}
            <b className="mono">{OBSERVATION_LABELS.length}</b> kuzatuv
          </span>
        </div>
      </header>

      {/* 1. Korrelyatsiya — Heatmap */}
      <section className="an-panel">
        <header className="an-panel-head">
          <div>
            <span className="an-panel-tag">
              <Icon name="grid" />
              Korrelyatsion tahlil
            </span>
            <h2>Ko'rsatkichlar o'zaro bog'liqligi</h2>
            <p>
              Pirson koeffitsiyenti (r). Katakchani bosing — quyidagi regressiya modeli shu juftlik
              uchun qayta hisoblanadi.
            </p>
          </div>
        </header>

        <div className="an-corr-layout">
          <CorrelationHeatmap onSelectPair={(nx, ny) => { setXVar(nx); setYVar(ny); }} xVar={xVar} yVar={yVar} />

          <div className="an-corr-side">
            <h3>O'zgaruvchilar</h3>
            <ul className="an-legend-list">
              {VARIABLES.map((v) => (
                <li key={v.id}>
                  <b className="mono">{v.code}</b>
                  <span>{v.label}</span>
                </li>
              ))}
            </ul>

            <h3 className="an-corr-subhead">Eng kuchli bog'lanishlar</h3>
            <ul className="an-pair-list">
              {strongPairs.slice(0, 6).map((pair) => (
                <li key={`${pair.a.id}-${pair.b.id}`}>
                  <button type="button" onClick={() => { setXVar(pair.a.id); setYVar(pair.b.id); }}>
                    <span className="an-pair-codes">
                      <b>{pair.a.code}</b>
                      <i>~</i>
                      <b>{pair.b.code}</b>
                    </span>
                    <span className={`an-pair-r mono ${pair.r >= 0 ? "is-pos" : "is-neg"}`}>
                      {fmt(pair.r, 2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="an-corr-subhead">Eng kuchsiz bog'lanishlar</h3>
            <ul className="an-pair-list">
              {strongPairs.slice(-4).reverse().map((pair) => (
                <li key={`weak-${pair.a.id}-${pair.b.id}`}>
                  <button type="button" onClick={() => { setXVar(pair.a.id); setYVar(pair.b.id); }}>
                    <span className="an-pair-codes">
                      <b>{pair.a.code}</b>
                      <i>~</i>
                      <b>{pair.b.code}</b>
                    </span>
                    <span className="an-pair-r mono is-weak">{fmt(pair.r, 2)}</span>
                  </button>
                </li>
              ))}
            </ul>

            <p className="an-corr-note">
              Manfiy qiymat teskari bog'lanishni bildiradi: masalan raqamli rivojlanish o'sgani sari
              chiqib ketish darajasi pasayadi. Kuchsiz bog'lanish esa ko'rsatkichlar bir-biriga
              deyarli ta'sir qilmasligini anglatadi — e-chipta savdosi mavsumga bog'liq bo'lgani
              uchun umumiy trendlar bilan zaif bog'langan.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Regressiya — Scatter */}
      <section className="an-panel">
        <header className="an-panel-head">
          <div>
            <span className="an-panel-tag">
              <Icon name="scatter" />
              Regressiya tahlili
            </span>
            <h2>Omillar ta'sirini baholash</h2>
            <p>Eng kichik kvadratlar usuli bo'yicha chiziqli model</p>
          </div>
          <div className="an-var-picker">
            <label>
              <span>Omil (X)</span>
              <select value={xVar} onChange={(event) => setXVar(event.target.value)}>
                {VARIABLES.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.id === yVar}>
                    {v.code} — {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Natija (Y)</span>
              <select value={yVar} onChange={(event) => setYVar(event.target.value)}>
                {VARIABLES.map((v) => (
                  <option key={v.id} value={v.id} disabled={v.id === xVar}>
                    {v.code} — {v.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <div className="an-reg-layout">
          <ScatterPlot xVar={xVar} yVar={yVar} />

          <div className="an-model">
            <div className="an-model-equation">
              <span>Regressiya tenglamasi</span>
              <code className="mono">
                {y.code} = {fmt(model.intercept, 2)} {model.slope >= 0 ? "+" : "−"}{" "}
                {fmt(Math.abs(model.slope), 3)} × {x.code}
              </code>
            </div>

            <div className="an-model-donut">
              <VarianceDonut r2={model.r2} />
              <p>
                Model {x.code} o'zgarishi {y.code} dispersiyasining{" "}
                <b>{fmt(model.r2 * 100, 1)}%</b> ini izohlaydi.
              </p>
            </div>

            <dl className="an-model-stats">
              <div>
                <dt>Korrelyatsiya (r)</dt>
                <dd className="mono">{fmt(model.r, 3)}</dd>
              </div>
              <div>
                <dt>Determinatsiya (R²)</dt>
                <dd className="mono">{fmt(model.r2, 3)}</dd>
              </div>
              <div>
                <dt>Regressiya koeffitsiyenti (b)</dt>
                <dd className="mono">{fmt(model.slope, 3)}</dd>
              </div>
              <div>
                <dt>Kuzatishlar (n)</dt>
                <dd className="mono">{model.n}</dd>
              </div>
            </dl>

            <p className="an-model-reading">
              {x.code} ko'rsatkichi <b className="mono">1{x.unit}</b> ga oshganda, {y.code}{" "}
              o'rtacha{" "}
              <b className="mono">
                {model.slope >= 0 ? "+" : "−"}
                {fmt(Math.abs(model.slope), 2)}
                {y.unit}
              </b>{" "}
              ga o'zgaradi. Bog'lanish kuchi: <b>{describeStrength(model.r).toLowerCase()}</b>.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Taqqoslash — Radar */}
      <section className="an-panel">
        <header className="an-panel-head">
          <div>
            <span className="an-panel-tag">
              <Icon name="radar" />
              Segmentatsiya va taqqoslash
            </span>
            <h2>Tashkilotlarning ko'p o'lchovli profili</h2>
            <p>Olti mezon bo'yicha 0–100 ball baholash</p>
          </div>
        </header>

        <div className="an-radar-layout">
          <RadarChart active={activeOrgs} />

          <div className="an-radar-side">
            <h3>Tashkilotlar</h3>
            <div className="an-org-toggles">
              {RADAR_ORGANIZATIONS.map((org) => {
                const isActive = activeOrgs.includes(org.id);
                return (
                  <button
                    key={org.id}
                    type="button"
                    className={`an-org-toggle an-org-toggle--${org.tone}${isActive ? " is-active" : ""}`}
                    aria-pressed={isActive}
                    onClick={() => toggleOrg(org.id)}
                  >
                    <i aria-hidden="true"></i>
                    <span>{org.label}</span>
                    <b className="mono">
                      {Math.round(org.values.reduce((s, v) => s + v, 0) / org.values.length)}
                    </b>
                  </button>
                );
              })}
            </div>

            <table className="an-radar-table">
              <thead>
                <tr>
                  <th scope="col">Mezon</th>
                  {RADAR_ORGANIZATIONS.filter((o) => activeOrgs.includes(o.id)).map((org) => (
                    <th key={org.id} scope="col">
                      <span className={`an-dot an-dot--${org.tone}`} aria-hidden="true"></span>
                      {org.label.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RADAR_AXES.map((axis, i) => (
                  <tr key={axis.id}>
                    <td>{axis.label}</td>
                    {RADAR_ORGANIZATIONS.filter((o) => activeOrgs.includes(o.id)).map((org) => (
                      <td key={org.id} className="mono">
                        {org.values[i]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Anomaliyalar — Lollipop */}
      <section className="an-panel">
        <header className="an-panel-head">
          <div>
            <span className="an-panel-tag">
              <Icon name="alert" />
              Anomaliyalarni aniqlash
            </span>
            <h2>Trenddan chetlanish tahlili</h2>
            <p>
              {ANOMALY_SERIES.label} qatoriga chiziqli trend moslashtirilib, qoldiqlar (residual)
              hisoblanadi. |chetlanish| &gt; 2σ bo'lgan kuzatuvlar anomaliya deb belgilanadi.
            </p>
          </div>
          <div className="an-anomaly-count">
            <b className="mono">{anomalies.length}</b>
            <span>anomaliya aniqlandi</span>
          </div>
        </header>

        <DeviationChart analysis={analysis} />

        <ul className="an-anomaly-list">
          {anomalies.map((point) => (
            <li key={point.index} className={point.residual >= 0 ? "is-high" : "is-low"}>
              <span className="an-anomaly-badge">{point.residual >= 0 ? "▲" : "▼"}</span>
              <span className="an-anomaly-body">
                <strong>
                  {OBSERVATION_LABELS[point.index]} ·{" "}
                  {point.residual >= 0 ? "kutilganidan yuqori" : "kutilganidan past"}
                </strong>
                <small>{ANOMALY_NOTES[point.index] ?? "Sabab aniqlanmagan"}</small>
              </span>
              <span className="an-anomaly-values mono">
                <b>
                  {point.residual >= 0 ? "+" : "−"}
                  {fmt(Math.abs(point.residual), 0)} mln
                </b>
                <small>z = {fmt(point.z, 2)}</small>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
