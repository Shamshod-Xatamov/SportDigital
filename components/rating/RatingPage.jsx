"use client";

import { useCallback, useMemo, useState } from "react";

import Drawer from "@/components/ui/Drawer";
import {
  CRITERIA,
  ORGANIZATIONS,
  RATING_PERIODS,
  buildRanking,
  compositeScore,
  criterionShare,
  getLevel,
  scoreSeries,
} from "@/lib/mock/rating";

const TOP_N = 10;

function Icon({ name }) {
  const icons = {
    trophy: (
      <>
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4z" />
        <path d="M8 5.5H5.5a2.5 2.5 0 0 0 2.5 4M16 5.5h2.5a2.5 2.5 0 0 1-2.5 4" />
        <path d="M10 13v3h4v-3M8 20h8M12 16v4" />
      </>
    ),
    bump: (
      <>
        <path d="M4 8h4l4 8h4l4-6" />
        <circle cx="8" cy="8" r="1.6" />
        <circle cx="16" cy="16" r="1.6" />
      </>
    ),
    scale: (
      <>
        <path d="M12 4v16M6 8h12" />
        <path d="M6 8 3.5 14h5zM18 8l-2.5 6h5z" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    map: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    tag: (
      <>
        <path d="M3.5 11.5V5a1.5 1.5 0 0 1 1.5-1.5h6.5L20.5 12 12 20.5z" />
        <circle cx="8" cy="8" r="1.4" />
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

function RankChange({ value }) {
  if (value === 0) {
    return <span className="rt-change rt-change--same">—</span>;
  }
  const up = value > 0;
  return (
    <span className={`rt-change ${up ? "rt-change--up" : "rt-change--down"}`}>
      {up ? "▲" : "▼"}
      <span className="mono">{Math.abs(value)}</span>
    </span>
  );
}

/* ============================================================
   Ball taqsimoti — darajalar bo'yicha nuqtali diagramma
   ============================================================ */

const DP = { W: 900, H: 214, padL: 20, padR: 20, padT: 48, padB: 30 };
const BANDS = [
  { from: 35, to: 41, label: "Past", tone: "low" },
  { from: 41, to: 61, label: "O'rtacha", tone: "medium" },
  { from: 61, to: 81, label: "Yuqori", tone: "high" },
  { from: 81, to: 92, label: "Juda yuqori", tone: "very-high" },
];
const X_MIN = 35;
const X_MAX = 92;

function DistributionChart({ ranking, hovered, onHover }) {
  const { W, H, padL, padR, padT, padB } = DP;
  const innerW = W - padL - padR;
  const x = (score) => padL + ((score - X_MIN) / (X_MAX - X_MIN)) * innerW;

  // Yorliqlar ustma-ust tushmasligi uchun qatorlarga taqsimlanadi
  const lanes = [];
  const placed = ranking.map((row) => {
    const cx = x(row.score);
    let lane = lanes.findIndex((lastX) => cx - lastX > 138);
    if (lane === -1) {
      lanes.push(cx);
      lane = lanes.length - 1;
    } else {
      lanes[lane] = cx;
    }
    return { row, cx, lane };
  });
  const laneCount = Math.max(lanes.length, 1);
  const laneH = 30;
  const chartH = padT + padB + laneCount * laneH;
  const axisY = padT - 12;

  return (
    <div className="rt-dist-wrap">
      <svg className="rt-dist" viewBox={`0 0 ${W} ${chartH}`} role="img" aria-label="Tashkilotlarning umumiy ball bo'yicha taqsimoti">
        {BANDS.map((band) => (
          <g key={band.tone}>
            <rect
              x={x(band.from)}
              y={axisY - 12}
              width={x(band.to) - x(band.from)}
              height={chartH - axisY - padB + 18}
              className={`rt-band rt-band--${band.tone}`}
            />
            <text x={(x(band.from) + x(band.to)) / 2} y={axisY - 18} textAnchor="middle" className="rt-band-label">
              {band.label}
            </text>
          </g>
        ))}

        {[40, 50, 60, 70, 80, 90].map((tick) => (
          <text key={tick} x={x(tick)} y={chartH - 8} textAnchor="middle" className="rt-dist-tick">
            {tick}
          </text>
        ))}

        {placed.map(({ row, cx, lane }) => {
          const cy = padT + lane * laneH + laneH / 2;
          const isHovered = hovered === row.org.id;
          const level = getLevel(row.score);
          return (
            <g
              key={row.org.id}
              className={`rt-dist-item rt-dist-item--${level.id}${isHovered ? " is-hovered" : ""}${hovered && !isHovered ? " is-dimmed" : ""}`}
              onMouseEnter={() => onHover(row.org.id)}
              onMouseLeave={() => onHover(null)}
            >
              <line x1={cx} y1={cy} x2={cx} y2={chartH - padB + 2} className="rt-dist-stem" />
              <circle cx={cx} cy={cy} r={isHovered ? 8 : 6.5} className="rt-dist-dot" />
              <text x={cx} y={cy + 3.2} textAnchor="middle" className="rt-dist-rank">
                {row.rank}
              </text>
              <text x={cx + 12} y={cy + 3.5} className="rt-dist-name">
                {row.org.name.length > 20 ? `${row.org.name.slice(0, 19)}…` : row.org.name}
                <tspan className="rt-dist-score"> {fmt(row.score, 1)}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ============================================================
   Sahifa
   ============================================================ */

export default function RatingPage() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const closeDetail = useCallback(() => setSelected(null), []);

  const ranking = useMemo(() => buildRanking(), []);
  const top = ranking.slice(0, TOP_N);
  const podium = ranking.slice(0, 3);
  const currentPeriod = RATING_PERIODS[RATING_PERIODS.length - 1];
  const maxScore = ranking[0].score;

  const risers = ranking.filter((r) => r.rankChange > 0).length;
  const movers = ranking.filter((r) => r.rankChange !== 0);
  const avgScore = ranking.reduce((s, r) => s + r.score, 0) / ranking.length;

  return (
    <div className="rating-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Sport tashkilotlari reytingi</span>
          <h1>TOP-10 raqamlashtirilgan tashkilotlar</h1>
          <p>
            Olti mezon bo'yicha vaznli baholash · {currentPeriod.label} davri ·{" "}
            {ORGANIZATIONS.length} ta tashkilot baholandi.
          </p>
        </div>
        <div className="rt-summary">
          <div>
            <span>O'rtacha ball</span>
            <b className="mono">{fmt(avgScore, 1)}</b>
          </div>
          <div>
            <span>O'rnini yaxshilagan</span>
            <b className="mono">{risers}</b>
          </div>
        </div>
      </header>

      {/* Podium */}
      <section className="rt-podium" aria-label="Reyting yetakchilari">
        {[1, 0, 2].map((order) => {
          const row = podium[order];
          const level = getLevel(row.score);
          return (
            <button
              type="button"
              key={row.org.id}
              className={`rt-podium-card rt-podium-card--${row.rank}`}
              onClick={() => setSelected(row)}
            >
              <span className="rt-podium-rank mono">{row.rank}</span>
              <span className="rt-podium-body">
                <strong>{row.org.name}</strong>
                <small>{row.org.type} · {row.org.region}</small>
              </span>
              <span className="rt-podium-score">
                <b className="mono">{fmt(row.score, 1)}</b>
                <em>{level.label}</em>
              </span>
              <RankChange value={row.rankChange} />
            </button>
          );
        })}
      </section>

      {/* Ball taqsimoti */}
      <section className="rt-panel">
        <header className="rt-panel-head">
          <div>
            <span className="rt-panel-tag">
              <Icon name="scale" />
              Ball taqsimoti
            </span>
            <h2>Tashkilotlar darajalar bo'yicha qanday joylashgan</h2>
            <p>
              Har bir nuqta — bitta tashkilot. O'ng tomonga siljish yuqoriroq umumiy ballni
              bildiradi; fon zonalari DRI darajalariga mos keladi.
            </p>
          </div>
          <div className="rt-gap-note">
            <span>Yetakchi va oxirgi o'rin farqi</span>
            <b className="mono">{fmt(ranking[0].score - ranking[ranking.length - 1].score, 1)} ball</b>
          </div>
        </header>

        <DistributionChart ranking={ranking} hovered={hovered} onHover={setHovered} />

        {movers.length > 0 ? (
          <div className="rt-movers">
            <h3>Chorak ichidagi o'zgarishlar</h3>
            <ul>
              {movers.map((row) => (
                <li
                  key={row.org.id}
                  className={row.rankChange > 0 ? "is-up" : "is-down"}
                  onMouseEnter={() => setHovered(row.org.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="rt-mover-arrow">{row.rankChange > 0 ? "▲" : "▼"}</span>
                  <span className="rt-mover-name">{row.org.name}</span>
                  <span className="rt-mover-move mono">
                    {row.previousRank} → {row.rank}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* TOP-10 */}
      <section className="rt-panel">
        <header className="rt-panel-head">
          <div>
            <span className="rt-panel-tag">
              <Icon name="trophy" />
              Umumiy reyting
            </span>
            <h2>TOP-{TOP_N} tashkilot</h2>
            <p>Ustun uzunligi umumiy ballni, ranglar mezonlar hissasini bildiradi</p>
          </div>
          <ul className="rt-criteria-legend">
            {CRITERIA.map((c) => (
              <li key={c.id}>
                <i className={`rt-key rt-key--${c.tone}`}></i>
                {c.short}
                <b className="mono">{Math.round(c.weight * 100)}%</b>
              </li>
            ))}
          </ul>
        </header>

        <ol className="rt-list">
          {top.map((row) => (
            <li
              key={row.org.id}
              className={hovered === row.org.id ? "is-hovered" : ""}
              onMouseEnter={() => setHovered(row.org.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <button type="button" onClick={() => setSelected(row)}>
                <span className={`rt-rank rt-rank--${row.rank <= 3 ? row.rank : "rest"} mono`}>
                  {row.rank}
                </span>

                <span className="rt-org">
                  <strong>{row.org.name}</strong>
                  <small>{row.org.type} · {row.org.region}</small>
                </span>

                <span className="rt-stack" aria-hidden="true">
                  {CRITERIA.map((c) => (
                    <i
                      key={c.id}
                      className={`rt-seg rt-seg--${c.tone}`}
                      style={{ width: `${(criterionShare(row.org.scores, c) / maxScore) * 100}%` }}
                      title={`${c.short}: ${row.org.scores[c.id]}`}
                    ></i>
                  ))}
                </span>

                <span className="rt-score mono">{fmt(row.score, 1)}</span>
                <RankChange value={row.rankChange} />
                <span className="rt-go" aria-hidden="true">
                  <Icon name="arrow" />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <footer className="rt-method">
          <Icon name="scale" />
          <p>
            Umumiy ball <b className="mono">Σ (Wi × Xi)</b> formulasi bo'yicha hisoblanadi: har bir
            mezon 0–100 ballda baholanib, vazn koeffitsiyentiga ko'paytiriladi. Vaznlar yig'indisi —{" "}
            <b className="mono">1,00</b>.
          </p>
        </footer>
      </section>

      <OrgDetail row={selected} onClose={closeDetail} />
    </div>
  );
}

function OrgDetail({ row, onClose }) {
  if (!row) return null;
  const level = getLevel(row.score);
  const series = scoreSeries(row.org);

  return (
    <Drawer
      open={Boolean(row)}
      onClose={onClose}
      title={row.org.name}
      subtitle={`${row.rank}-o'rin · ${row.org.type}`}
      size="medium"
      icon={<Icon name="trophy" />}
      footer={
        <button type="button" className="org-secondary-button" onClick={onClose}>
          Yopish
        </button>
      }
    >
      <div className="rt-detail">
        <div className={`rt-detail-hero rt-detail-hero--${level.id}`}>
          <div>
            <span>Umumiy ball</span>
            <strong className="mono">{fmt(row.score, 1)}</strong>
            <small>{level.label} daraja</small>
          </div>
          <div className="rt-detail-rank">
            <b className="mono">{row.rank}</b>
            <span>o'rin</span>
            <RankChange value={row.rankChange} />
          </div>
        </div>

        <section className="org-detail-section">
          <h3>Mezonlar bo'yicha baho</h3>
          <ul className="rt-detail-criteria">
            {CRITERIA.map((c) => (
              <li key={c.id}>
                <span className="rt-dc-label">
                  <i className={`rt-key rt-key--${c.tone}`}></i>
                  {c.label}
                </span>
                <span className="rt-dc-bar" aria-hidden="true">
                  <i className={`rt-seg--${c.tone}`} style={{ width: `${row.org.scores[c.id]}%` }}></i>
                </span>
                <span className="rt-dc-value mono">{row.org.scores[c.id]}</span>
                <span className="rt-dc-weight mono">×{fmt(c.weight, 2)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="org-detail-section">
          <h3>Ball dinamikasi</h3>
          <div className="rt-detail-history">
            {RATING_PERIODS.map((period, i) => (
              <div key={period.id} className={period.current ? "is-current" : ""}>
                <span>{period.label}</span>
                <b className="mono">{fmt(series[i], 1)}</b>
                <small className="mono">{row.ranks[i]}-o'rin</small>
              </div>
            ))}
          </div>
        </section>

        <section className="org-detail-section">
          <h3>Tashkilot ma'lumotlari</h3>
          <div className="rt-detail-list">
            <div>
              <Icon name="tag" />
              <span>{row.org.type}</span>
            </div>
            <div>
              <Icon name="map" />
              <span>{row.org.region}</span>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
