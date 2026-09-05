"use client";

import { useCallback, useMemo, useState } from "react";
import { useDemo } from "@/components/demo/DemoProvider";
import { driScores, canAssess, today } from "@/lib/demo/model.mjs";

import Drawer from "@/components/ui/Drawer";
import {
  DRI_GROUPS,
  DRI_INDICATORS,
  DRI_LEVELS,
  DRI_PERIOD as BASE_DRI_PERIOD,
  DRI_RECOMMENDATIONS,
  DRI_TREND,
  calculateDri,
  calculateGroupScore,
  getDriLevel,
  getIndicatorStatus,
} from "@/lib/mock/dri";

const INITIAL_SCORES = Object.fromEntries(DRI_INDICATORS.map((item) => [item.id, item.score]));

function Icon({ name }) {
  const icons = {
    gauge: (
      <>
        <path d="M4 17a8 8 0 0 1 16 0" />
        <path d="m12 17 4-8" />
        <path d="M3 21h18" />
      </>
    ),
    history: (
      <>
        <path d="M4 5v5h5" />
        <path d="M5.5 17.5A8 8 0 1 0 4 10" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    level: (
      <>
        <path d="M5 20V10M12 20V6M19 20V3" />
        <path d="M3 20h18" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4.2-1 10.9-10.9a2.2 2.2 0 0 0-3.2-3.2L5 15.8 4 20z" />
        <path d="m14.5 6.5 3 3" />
      </>
    ),
    check: <path d="m5 12.5 4.3 4.2L19 7" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
    server: (
      <>
        <rect x="3" y="4" width="18" height="6" rx="2" />
        <rect x="3" y="14" width="18" height="6" rx="2" />
        <path d="M7 7h.01M7 17h.01M11 7h7M11 17h7" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    data: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      </>
    ),
    growth: (
      <>
        <path d="m4 17 5-5 3.5 3.5L20 7" />
        <path d="M15 7h5v5" />
      </>
    ),
    trend: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="m7 15 4-4 3 2 5-6" />
      </>
    ),
    lightbulb: (
      <>
        <path d="M8.5 16.5h7M9.5 20h5" />
        <path d="M8.2 14.5C6.8 13.4 6 11.6 6 9.7a6 6 0 1 1 12 0c0 1.9-.8 3.7-2.2 4.8-.7.6-.8 1-.8 2H9c0-1-.1-1.4-.8-2z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
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

const roundScore = (value) => Math.round(value);
const formatDecimal = (value) => value.toFixed(1).replace(".", ",");

function SummaryCard({ icon, label, value, note, textValue = false }) {
  return (
    <article className="org-summary-card dri-summary-card">
      <span className="org-summary-icon">
        <Icon name={icon} />
      </span>
      <div>
        <span>{label}</span>
        <strong className={textValue ? "dri-summary-text" : "mono"}>{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

function DriGauge({ score, target }) {
  const angle = Math.PI - (Math.max(0, Math.min(100, target)) / 100) * Math.PI;
  const markerX = 110 + 86 * Math.cos(angle);
  const markerY = 105 - 86 * Math.sin(angle);
  const level = getDriLevel(score);

  return (
    <div className="dri-gauge-wrap">
      <svg className="dri-gauge" viewBox="0 0 220 128" role="img" aria-label={`DRI indeksi ${roundScore(score)} ball`}>
        <path className="dri-gauge-track" d="M20 105 A90 90 0 0 1 200 105" pathLength="100" />
        <path
          className="dri-gauge-value"
          d="M20 105 A90 90 0 0 1 200 105"
          pathLength="100"
          strokeDasharray={`${Math.max(0, Math.min(100, score))} 100`}
        />
        <circle className="dri-gauge-target" cx={markerX} cy={markerY} r="5" />
        <text x="110" y="83" textAnchor="middle" className="dri-gauge-number mono">
          {roundScore(score)}
        </text>
        <text x="110" y="103" textAnchor="middle" className="dri-gauge-unit">
          100 dan
        </text>
      </svg>
      <div className={`dri-level-badge is-${level.tone}`}>
        <i aria-hidden="true"></i>
        {level.label} daraja
      </div>
      <p>
        Maqsad <strong className="mono">{target}</strong> ball
      </p>
    </div>
  );
}

function TrendChart({ score, target }) {
  const items = DRI_TREND.map((item, index) =>
    index === DRI_TREND.length - 1 ? { ...item, score } : item,
  );
  const width = 620;
  const height = 208;
  const left = 38;
  const right = 16;
  const top = 16;
  const bottom = 32;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;
  const min = 40;
  const max = 90;
  const x = (index) => left + (index / (items.length - 1)) * innerWidth;
  const y = (value) => top + innerHeight - ((value - min) / (max - min)) * innerHeight;
  const line = items.map((item, index) => `${index ? "L" : "M"}${x(index)} ${y(item.score)}`).join(" ");
  const area = `${line} L${x(items.length - 1)} ${top + innerHeight} L${x(0)} ${top + innerHeight} Z`;

  return (
    <div className="dri-trend-wrap">
      <svg className="dri-trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="DRI indeksining olti oylik dinamikasi">
        {[40, 50, 60, 70, 80, 90].map((tick) => (
          <g key={tick}>
            <line x1={left} x2={width - right} y1={y(tick)} y2={y(tick)} className="dri-chart-grid" />
            <text x={left - 9} y={y(tick) + 4} textAnchor="end" className="dri-chart-label mono">
              {tick}
            </text>
          </g>
        ))}
        <line x1={left} x2={width - right} y1={y(target)} y2={y(target)} className="dri-chart-target" />
        <text x={width - right} y={y(target) - 7} textAnchor="end" className="dri-chart-target-label">
          Maqsad {target}
        </text>
        <path d={area} className="dri-chart-area" />
        <path d={line} className="dri-chart-line" />
        {items.map((item, index) => (
          <g key={item.label}>
            <circle cx={x(index)} cy={y(item.score)} r={index === items.length - 1 ? 5 : 3.5} className="dri-chart-point" />
            <text x={x(index)} y={height - 9} textAnchor="middle" className="dri-chart-label">
              {item.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MethodologyDrawer({ open, onClose }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="DRI hisoblash metodologiyasi"
      subtitle="Digital Readiness Index · 12 ta indikator"
      size="medium"
      icon={<Icon name="info" />}
      footer={
        <button type="button" className="org-secondary-button" onClick={onClose}>
          Tushunarli
        </button>
      }
    >
      <div className="dri-methodology">
        <section className="dri-formula-card">
          <span>Vaznli indeks formulasi</span>
          <strong className="mono">DRI = Σ(Wi × Xi)</strong>
          <p>
            Har bir indikatorning 0–100 oralig'idagi balli uning vazniga ko'paytiriladi. Barcha vaznlar yig'indisi 100%.
          </p>
        </section>

        <section className="org-detail-section">
          <h3>Yetuklik darajalari</h3>
          <div className="dri-method-levels">
            {DRI_LEVELS.map((level) => (
              <div key={level.id}>
                <i className={`is-${level.tone}`} aria-hidden="true"></i>
                <span>{level.label}</span>
                <strong className="mono">
                  {level.min}–{level.max}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="org-detail-section">
          <h3>Baholash tamoyillari</h3>
          <ul className="dri-method-list">
            <li>Ballar chorak yakunida tasdiqlangan tashkilot ma'lumotlari asosida yangilanadi.</li>
            <li>Yuqori vaznli indikatorlar yakuniy indeksga kuchliroq ta'sir qiladi.</li>
            <li>Davrlar kesimidagi bir xil metodologiya natijalarni taqqoslash imkonini beradi.</li>
            <li>Tavsiyalar eng past ball va rivojlanish salohiyatiga qarab shakllantiriladi.</li>
          </ul>
        </section>
      </div>
    </Drawer>
  );
}

export default function DriPage() {
  const {state,profile,organization,dispatch,setNotice}=useDemo();
  const DRI_PERIOD={...BASE_DRI_PERIOD,organization:organization.name,label:today().slice(0,7),updatedAt:'Joriy demo bahosi'};
  const savedScores = driScores(state);
  const [draftScores, setDraftScores] = useState(() => driScores(state));
  const [editing, setEditing] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const activeScores = editing ? draftScores : savedScores;
  const exactScore = useMemo(() => calculateDri(DRI_INDICATORS, activeScores), [activeScores]);
  const currentScore = roundScore(exactScore);
  const level = getDriLevel(currentScore);
  const change = currentScore - DRI_PERIOD.previousScore;
  const targetGap = Math.max(0, DRI_PERIOD.targetScore - currentScore);
  const totalWeight = DRI_INDICATORS.reduce((sum, item) => sum + item.weight, 0);

  const groupScores = useMemo(
    () =>
      DRI_GROUPS.map((group) => ({
        ...group,
        score: calculateGroupScore(group.id, activeScores),
        count: DRI_INDICATORS.filter((item) => item.group === group.id).length,
      })),
    [activeScores],
  );

  const closeMethod = useCallback(() => setMethodOpen(false), []);

  const startEditing = () => {
    setDraftScores({ ...savedScores });
    setSavedNotice(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraftScores({ ...savedScores });
    setEditing(false);
  };

  const saveAssessment = () => {
    try { dispatch({type:"assessment",scores:draftScores},"DRI baholari saqlandi."); } catch(e) { setNotice(e.message); return; }
    setEditing(false);
    setSavedNotice(true);
  };

  const changeScore = (id, value) => {
    setDraftScores((current) => ({ ...current, [id]: Number(value) }));
  };

  return (
    <div className="dri-page">
      <header className="org-page-head dri-page-head">
        <div>
          <span className="org-eyebrow">Ilmiy monitoring</span>
          <h1>Raqamli rivojlanish</h1>
          <p>12 indikator asosida tashkilotning raqamli tayyorligini o'lchang va rivojlanish ustuvorliklarini aniqlang.</p>
          <div className="dri-period-meta">
            <span>
              <Icon name="calendar" />
              {DRI_PERIOD.organization} · {DRI_PERIOD.label}
            </span>
            <span>Yangilandi: {DRI_PERIOD.updatedAt}</span>
          </div>
        </div>

        <div className="dri-head-actions">
          <button type="button" className="org-secondary-button" onClick={() => setMethodOpen(true)}>
            <Icon name="info" />
            Metodologiya
          </button>
          {editing ? (
            <>
              <button type="button" className="org-secondary-button" onClick={cancelEditing}>
                Bekor qilish
              </button>
              <button type="button" className="org-primary-button" onClick={saveAssessment}>
                <Icon name="check" />
                Bahoni saqlash
              </button>
            </>
          ) : (
            <button type="button" className="org-primary-button" onClick={startEditing} disabled={!canAssess(profile.role)}>
              <Icon name="edit" />
              Baholashni tahrirlash
            </button>
          )}
        </div>
      </header>

      {savedNotice ? (
        <div className="dri-save-notice" role="status">
          <Icon name="check" />
          Baholash saqlandi. Yangi DRI indeksi: <strong className="mono">{currentScore}</strong>
          <button type="button" aria-label="Xabarni yopish" onClick={() => setSavedNotice(false)}>×</button>
        </div>
      ) : null}

      {editing ? (
        <div className="dri-edit-banner" role="status">
          <span>
            <Icon name="edit" />
            <strong>Tahrirlash rejimi</strong> — indikator ballarini o'zgartiring, indeks real vaqtda yangilanadi.
          </span>
          <span className="mono">Joriy hisob: {formatDecimal(exactScore)}</span>
        </div>
      ) : null}

      <section className="org-summary-grid" aria-label="DRI umumiy ko'rsatkichlari">
        <SummaryCard icon="gauge" label="Joriy DRI" value={`${currentScore} / 100`} note="vaznli indeks natijasi" />
        <SummaryCard
          icon="history"
          label="Davr o'sishi"
          value={`${change >= 0 ? "+" : ""}${change} ball`}
          note={`oldingi davr: ${DRI_PERIOD.previousScore}`}
        />
        <SummaryCard icon="target" label="Maqsadgacha" value={`${targetGap} ball`} note={`maqsad: ${DRI_PERIOD.targetScore}`} />
        <SummaryCard icon="level" label="Yetuklik darajasi" value={level.label} note="61–80 ball oralig'i" textValue />
      </section>

      <div className="dri-overview-grid">
        <section className="dri-panel dri-index-panel">
          <header className="dri-panel-head">
            <div>
              <h2>Raqamli tayyorlik indeksi</h2>
              <p>Joriy holat va maqsad ko'rsatkichi</p>
            </div>
            <span className="dri-verified">
              <Icon name="check" /> Tasdiqlangan
            </span>
          </header>

          <DriGauge score={exactScore} target={DRI_PERIOD.targetScore} />

          <div className="dri-level-scale" aria-label="DRI yetuklik darajalari">
            {DRI_LEVELS.map((item) => (
              <div key={item.id} className={item.id === level.id ? "is-current" : ""}>
                <span></span>
                <small>{item.label}</small>
                <b className="mono">{item.min}–{item.max}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="dri-panel dri-directions-panel">
          <header className="dri-panel-head">
            <div>
              <h2>Yo'nalishlar kesimi</h2>
              <p>Indikatorlarning vaznli guruh natijalari</p>
            </div>
            <span className="dri-count-chip">4 yo'nalish</span>
          </header>

          <div className="dri-direction-grid">
            {groupScores.map((group) => {
              const groupLevel = getDriLevel(group.score);
              return (
                <article key={group.id}>
                  <span className="dri-direction-icon">
                    <Icon name={group.icon} />
                  </span>
                  <div className="dri-direction-copy">
                    <strong>{group.label}</strong>
                    <small>{group.description}</small>
                  </div>
                  <b className="dri-direction-score mono">{roundScore(group.score)}</b>
                  <div className="dri-direction-meter" aria-label={`${group.label}: ${roundScore(group.score)} ball`}>
                    <span style={{ width: `${group.score}%` }}></span>
                  </div>
                  <div className="dri-direction-foot">
                    <span>{group.count} indikator</span>
                    <span className={`is-${groupLevel.tone}`}>{groupLevel.label}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <section className="dri-panel dri-trend-panel">
        <header className="dri-panel-head">
          <div>
            <h2>Indeks dinamikasi</h2>
            <p>So'nggi 6 oy · 0–100 ball</p>
          </div>
          <div className="dri-trend-summary">
            <span>6 oylik o'sish</span>
            <strong className="mono">+{currentScore - DRI_TREND[0].score} ball</strong>
          </div>
        </header>
        <TrendChart score={exactScore} target={DRI_PERIOD.targetScore} />
      </section>

      <section className={`dri-panel dri-indicators-panel${editing ? " is-editing" : ""}`}>
        <header className="dri-indicators-head">
          <div>
            <h2>Indikatorlar bahosi</h2>
            <p>12 indikator · vaznlar jami <strong className="mono">{totalWeight}%</strong></p>
          </div>
          <div className="dri-formula-inline">
            <span>Vaznli formula</span>
            <strong className="mono">Σ(Wi × Xi) = {formatDecimal(exactScore)}</strong>
          </div>
        </header>

        <div className="dri-table-scroll">
          <table className="dri-table">
            <thead>
              <tr>
                <th scope="col">Indikator</th>
                <th scope="col">Yo'nalish</th>
                <th scope="col">Vazn</th>
                <th scope="col">Ball</th>
                <th scope="col">Indeksga hissa</th>
                <th scope="col">Holat</th>
              </tr>
            </thead>
            <tbody>
              {DRI_INDICATORS.map((item) => {
                const score = activeScores[item.id];
                const status = getIndicatorStatus(score);
                const group = DRI_GROUPS.find((entry) => entry.id === item.group);
                const delta = score - item.previous;
                return (
                  <tr key={item.id}>
                    <td className="dri-indicator-cell">
                      <span className="dri-code mono">{item.code}</span>
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.description}</small>
                      </span>
                    </td>
                    <td data-label="Yo'nalish">
                      <span className="dri-group-tag">{group.label}</span>
                    </td>
                    <td data-label="Vazn">
                      <strong className="dri-weight mono">{item.weight}%</strong>
                    </td>
                    <td data-label="Ball" className="dri-score-cell">
                      {editing ? (
                        <div className="dri-score-editor">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={score}
                            aria-label={`${item.label} balli`}
                            style={{ "--range-progress": `${score}%` }}
                            onChange={(event) => changeScore(item.id, event.target.value)}
                          />
                          <output className="mono">{score}</output>
                        </div>
                      ) : (
                        <div className="dri-score-display">
                          <span className="dri-score-meter" aria-hidden="true">
                            <i style={{ width: `${score}%` }}></i>
                          </span>
                          <strong className="mono">{score}</strong>
                          <small className={`mono${delta >= 0 ? " is-up" : " is-down"}`}>
                            {delta >= 0 ? "+" : ""}{delta}
                          </small>
                        </div>
                      )}
                    </td>
                    <td data-label="Indeksga hissa">
                      <strong className="dri-contribution mono">{formatDecimal((item.weight * score) / 100)}</strong>
                    </td>
                    <td data-label="Holat">
                      <span className={`dri-status is-${status.tone}`}>
                        <i aria-hidden="true"></i>{status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <footer className="dri-table-total">
          <span>Yakuniy vaznli indeks</span>
          <span>Jami vazn <strong className="mono">{totalWeight}%</strong></span>
          <strong className="mono">{formatDecimal(exactScore)} / 100</strong>
        </footer>
      </section>

      <section className="dri-recommendations">
        <header className="dri-section-heading">
          <div>
            <span className="dri-section-icon"><Icon name="lightbulb" /></span>
            <div>
              <h2>Rivojlanish ustuvorliklari</h2>
              <p>Past ko'rsatkichlar asosida shakllantirilgan amaliy tavsiyalar</p>
            </div>
          </div>
          <span>Decision Support</span>
        </header>
        <div className="dri-recommendation-grid">
          {DRI_RECOMMENDATIONS.map((recommendation, index) => {
            const indicator = DRI_INDICATORS.find((item) => item.id === recommendation.indicatorId);
            const score = activeScores[indicator.id];
            return (
              <article key={recommendation.indicatorId}>
                <div className="dri-recommendation-top">
                  <span className="mono">0{index + 1}</span>
                  <span>{recommendation.priority}</span>
                </div>
                <h3>{recommendation.title}</h3>
                <p>{recommendation.body}</p>
                <div>
                  <span>{indicator.label}</span>
                  <strong className="mono">{score} ball</strong>
                </div>
                <small>{recommendation.action}</small>
              </article>
            );
          })}
        </div>
      </section>

      <MethodologyDrawer open={methodOpen} onClose={closeMethod} />
    </div>
  );
}
