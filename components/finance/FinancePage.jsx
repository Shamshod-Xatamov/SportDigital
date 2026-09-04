"use client";

import { useCallback, useMemo, useState } from "react";

import Drawer from "@/components/ui/Drawer";
import {
  EXPENSE_CATEGORIES,
  FINANCE_METRICS,
  FINANCE_ORGANIZATIONS,
  FINANCE_TREND,
  MONTH_LABELS,
  PAYMENT_METHODS,
  REVENUE_SOURCES,
  TRANSACTIONS,
  TRANSACTION_TYPES,
  arpu,
  averageTransaction,
  calcChange,
  digitalRevenue,
  digitalShare,
  netProfit,
  profitability,
  totalExpense,
  totalRevenue,
} from "@/lib/mock/finance";

const PAGE_SIZE = 8;

function Icon({ name }) {
  const icons = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    revenue: (
      <>
        <path d="M4 18 10 11l4 4 6-8" />
        <path d="M15 7h5v5" />
      </>
    ),
    expense: (
      <>
        <path d="M4 7l6 7 4-4 6 8" />
        <path d="M20 18h-5v-5" />
      </>
    ),
    profit: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M9.5 9.5h4a1.8 1.8 0 0 1 0 3.6h-3a1.8 1.8 0 0 0 0 3.6h4" />
      </>
    ),
    percent: (
      <>
        <path d="m6 18 12-12" />
        <circle cx="7.5" cy="7.5" r="2.2" />
        <circle cx="16.5" cy="16.5" r="2.2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c.7-3.7 3.4-5.6 7-5.6s6.3 1.9 7 5.6" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3 10h18" />
      </>
    ),
    digital: (
      <>
        <rect x="3.5" y="4" width="17" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    download: (
      <>
        <path d="M12 4v10M8.5 10.5 12 14l3.5-3.5" />
        <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </>
    ),
    building: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
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

const groupDigits = (value) => String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const formatFixed = (value, digits = 1) => value.toFixed(digits).replace(".", ",");

/** mln so'mdagi qiymatni o'qilishi oson ko'rinishga keltiradi */
const formatMln = (value) => {
  if (Math.abs(value) >= 1000) return `${formatFixed(value / 1000, 2)} mlrd`;
  return `${formatFixed(value, 1)} mln`;
};

const normalizeText = (value) =>
  String(value).normalize("NFKC").toLowerCase().replace(/[ʻʼ'`]/g, "'");

function DeltaChip({ value }) {
  const up = value >= 0;
  return (
    <span className={`fin-delta ${up ? "is-up" : "is-down"}`}>
      <svg viewBox="0 0 10 10" aria-hidden="true">
        {up ? <path d="M1.5 6.5 5 3l3.5 3.5" /> : <path d="M1.5 3.5 5 7l3.5-3.5" />}
      </svg>
      <span className="mono">{formatFixed(Math.abs(value), 1)}%</span>
    </span>
  );
}

function SummaryCard({ icon, label, value, note, tone }) {
  return (
    <article className={`org-summary-card${tone ? ` fin-summary--${tone}` : ""}`}>
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

/* ---------- Daromad / xarajat / foyda grafigi ---------- */

const CHART = { W: 740, H: 268, padL: 50, padR: 16, padT: 18, padB: 34 };

function ProfitChart({ revenue, expense }) {
  const [hover, setHover] = useState(null);
  const { W, H, padL, padR, padT, padB } = CHART;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.ceil(Math.max(...revenue) / 400) * 400;
  const n = revenue.length;
  const x = (i) => padL + (i / (n - 1)) * innerW;
  const y = (v) => padT + innerH - (v / max) * innerH;

  const line = (series) =>
    series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  // Foyda maydoni: daromad chizig'i bo'ylab borib, xarajat chizig'i bo'ylab qaytadi
  const band = `${line(revenue)} ${expense
    .map((v, i) => `L${x(n - 1 - i).toFixed(1)} ${y(expense[n - 1 - i]).toFixed(1)}`)
    .join(" ")} Z`;

  return (
    <div className="fin-chart-wrap" onMouseLeave={() => setHover(null)}>
      <svg
        className="fin-chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Oylik daromad, xarajat va sof foyda dinamikasi"
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const gy = padT + (innerH / 4) * i;
          const value = Math.round(max - (max / 4) * i);
          return (
            <g key={i}>
              <line x1={padL} x2={W - padR} y1={gy} y2={gy} className="fin-chart-grid" />
              <text x={padL - 9} y={gy + 3.5} textAnchor="end" className="fin-chart-tick">
                {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              </text>
            </g>
          );
        })}

        <path d={band} className="fin-chart-band" />
        <path d={line(expense)} className="fin-chart-line fin-chart-line--expense" />
        <path d={line(revenue)} className="fin-chart-line fin-chart-line--revenue" />

        {MONTH_LABELS.map((label, i) => (
          <text key={label} x={x(i)} y={H - padB + 20} textAnchor="middle" className="fin-chart-tick">
            {label}
          </text>
        ))}

        {hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + innerH} className="fin-chart-cursor" />
            <circle cx={x(hover)} cy={y(revenue[hover])} r="4.4" className="fin-chart-dot fin-chart-dot--revenue" />
            <circle cx={x(hover)} cy={y(expense[hover])} r="4.4" className="fin-chart-dot fin-chart-dot--expense" />
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
          className={`fin-tooltip${hover < 2 ? " is-left" : hover > 9 ? " is-right" : ""}`}
          style={{ left: `${(x(hover) / W) * 100}%` }}
          role="status"
        >
          <strong>{MONTH_LABELS[hover]} 2026</strong>
          <span>
            <i className="fin-dot fin-dot--revenue"></i>Daromad:{" "}
            <b className="mono">{groupDigits(revenue[hover])} mln</b>
          </span>
          <span>
            <i className="fin-dot fin-dot--expense"></i>Xarajat:{" "}
            <b className="mono">{groupDigits(expense[hover])} mln</b>
          </span>
          <span className="fin-tooltip-profit">
            Sof foyda: <b className="mono">{groupDigits(revenue[hover] - expense[hover])} mln</b>
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Sahifa ---------- */

export default function FinancePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [method, setMethod] = useState("all");
  const [organization, setOrganization] = useState("all");
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const closeDetail = useCallback(() => setSelected(null), []);

  const revenueChange = calcChange(totalRevenue, FINANCE_METRICS.previousRevenue);
  const expenseChange = calcChange(totalExpense, FINANCE_METRICS.previousExpense);
  const previousProfit = FINANCE_METRICS.previousRevenue - FINANCE_METRICS.previousExpense;
  const profitChange = calcChange(netProfit, previousProfit);
  const previousProfitability = (previousProfit / FINANCE_METRICS.previousRevenue) * 100;

  const sortedSources = useMemo(
    () => [...REVENUE_SOURCES].sort((a, b) => b.amount - a.amount),
    [],
  );
  const maxSource = sortedSources[0].amount;
  const maxExpense = EXPENSE_CATEGORIES[0].amount;
  const traditionalRevenue = totalRevenue - digitalRevenue;

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const rows = TRANSACTIONS.filter((item) => {
      const haystack = normalizeText(
        `${item.id} ${item.category} ${item.description} ${item.organization}`,
      );
      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (type !== "all" && item.type !== type) return false;
      if (method !== "all" && item.method !== method) return false;
      if (organization !== "all" && item.organization !== organization) return false;
      return true;
    });

    return [...rows].sort((left, right) => {
      if (sort === "amount") return right.amount - left.amount;
      if (sort === "amount-asc") return left.amount - right.amount;
      if (sort === "category") return left.category.localeCompare(right.category, "uz");
      return 0;
    });
  }, [query, type, method, organization, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const filtersActive =
    query.trim() || type !== "all" || method !== "all" || organization !== "all";

  const setFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setType("all");
    setMethod("all");
    setOrganization("all");
    setPage(1);
  };

  return (
    <div className="finance-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Moliya va monetizatsiya</span>
          <h1>Moliyaviy ko'rsatkichlar</h1>
          <p>Daromad manbalari, xarajatlar tarkibi va monetizatsiya samaradorligini tahlil qiling.</p>
        </div>
        <button type="button" className="org-primary-button">
          <Icon name="download" />
          Hisobotni yuklash
        </button>
      </header>

      <section className="org-summary-grid" aria-label="Moliyaviy umumiy ko'rsatkichlar">
        <SummaryCard
          icon="revenue"
          label="Jami daromad"
          value={formatMln(totalRevenue)}
          note={`${formatFixed(revenueChange, 1)}% o'tgan yilga nisbatan`}
        />
        <SummaryCard
          icon="expense"
          label="Jami xarajat"
          value={formatMln(totalExpense)}
          note={`daromadning ${formatFixed((totalExpense / totalRevenue) * 100, 0)}%i`}
        />
        <SummaryCard
          icon="profit"
          label="Sof foyda"
          value={formatMln(netProfit)}
          note={`+${formatFixed(profitChange, 1)}% o'sish`}
        />
        <SummaryCard
          icon="percent"
          label="Rentabellik"
          value={`${formatFixed(profitability, 1)}%`}
          note={`o'tgan yil: ${formatFixed(previousProfitability, 1)}%`}
        />
      </section>

      {/* Monetizatsiya ko'rsatkichlari */}
      <section className="fin-metric-strip" aria-label="Monetizatsiya ko'rsatkichlari">
        <article>
          <span className="fin-metric-icon">
            <Icon name="user" />
          </span>
          <div>
            <span>ARPU — bir foydalanuvchi daromadi</span>
            <strong className="mono">{groupDigits(arpu)} so'm</strong>
            <small>oyiga · {groupDigits(FINANCE_METRICS.payingCustomers)} to'lovchi mijoz</small>
          </div>
        </article>
        <article>
          <span className="fin-metric-icon">
            <Icon name="card" />
          </span>
          <div>
            <span>O'rtacha tranzaksiya summasi</span>
            <strong className="mono">{groupDigits(averageTransaction)} so'm</strong>
            <small>yil davomida {groupDigits(FINANCE_METRICS.totalTransactions)} ta operatsiya</small>
          </div>
        </article>
        <article>
          <span className="fin-metric-icon">
            <Icon name="digital" />
          </span>
          <div>
            <span>Raqamli xizmatlar ulushi</span>
            <strong className="mono">{formatFixed(digitalShare, 1)}%</strong>
            <small>{formatMln(digitalRevenue)} raqamli daromad</small>
          </div>
        </article>
      </section>

      {/* Dinamika */}
      <section className="fin-panel">
        <header className="fin-panel-head">
          <div>
            <h2>Daromad va xarajat dinamikasi</h2>
            <p>2026-yil · mln so'm · yashil maydon — sof foyda</p>
          </div>
          <div className="fin-legend">
            <span>
              <i className="fin-dot fin-dot--revenue"></i>Daromad
            </span>
            <span>
              <i className="fin-dot fin-dot--expense"></i>Xarajat
            </span>
            <span>
              <i className="fin-dot fin-dot--profit"></i>Sof foyda
            </span>
          </div>
        </header>
        <ProfitChart revenue={FINANCE_TREND.revenue} expense={FINANCE_TREND.expense} />
      </section>

      {/* Daromad manbalari va xarajatlar */}
      <div className="fin-columns">
        <section className="fin-panel">
          <header className="fin-panel-head">
            <div>
              <h2>Daromad manbalari</h2>
              <p>11 ta manba bo'yicha yillik taqsimot</p>
            </div>
          </header>

          <div className="fin-split" aria-label="An'anaviy va raqamli daromad nisbati">
            <div className="fin-split-bar">
              <span
                className="fin-split-seg fin-split-seg--traditional"
                style={{ width: `${100 - digitalShare}%` }}
              ></span>
              <span
                className="fin-split-seg fin-split-seg--digital"
                style={{ width: `${digitalShare}%` }}
              ></span>
            </div>
            <div className="fin-split-legend">
              <span>
                <i className="fin-dot fin-dot--traditional"></i>
                An'anaviy · <b className="mono">{formatMln(traditionalRevenue)}</b>
              </span>
              <span>
                <i className="fin-dot fin-dot--digital"></i>
                Raqamli · <b className="mono">{formatMln(digitalRevenue)}</b>
              </span>
            </div>
          </div>

          <ul className="fin-source-list">
            {sortedSources.map((item) => (
              <li key={item.id}>
                <div className="fin-source-head">
                  <span className="fin-source-name">
                    <strong>{item.label}</strong>
                    <small>{item.note}</small>
                  </span>
                  <span className="fin-source-values">
                    <b className="mono">{formatMln(item.amount)}</b>
                    <DeltaChip value={calcChange(item.amount, item.previous)} />
                  </span>
                </div>
                <div className="fin-source-meter">
                  <span className="fin-source-bar" aria-hidden="true">
                    <i
                      className={`fin-source-fill fin-source-fill--${item.kind}`}
                      style={{ width: `${(item.amount / maxSource) * 100}%` }}
                    ></i>
                  </span>
                  <span className={`fin-kind fin-kind--${item.kind}`}>
                    {item.kind === "digital" ? "Raqamli" : "An'anaviy"}
                  </span>
                  <span className="fin-source-share mono">
                    {formatFixed((item.amount / totalRevenue) * 100, 1)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="fin-panel">
          <header className="fin-panel-head">
            <div>
              <h2>Xarajatlar tarkibi</h2>
              <p>Jami {formatMln(totalExpense)}</p>
            </div>
          </header>

          <ul className="fin-expense-list">
            {EXPENSE_CATEGORIES.map((item) => (
              <li key={item.id}>
                <span className="fin-expense-label">{item.label}</span>
                <span className="fin-expense-bar" aria-hidden="true">
                  <i style={{ width: `${(item.amount / maxExpense) * 100}%` }}></i>
                </span>
                <span className="fin-expense-amount mono">{formatMln(item.amount)}</span>
                <span className="fin-expense-share mono">
                  {formatFixed((item.amount / totalExpense) * 100, 0)}%
                </span>
              </li>
            ))}
          </ul>

          <div className="fin-expense-summary">
            <div>
              <span>Jami daromad</span>
              <strong className="mono">{formatMln(totalRevenue)}</strong>
            </div>
            <div>
              <span>Jami xarajat</span>
              <strong className="mono">−{formatMln(totalExpense)}</strong>
            </div>
            <div className="fin-expense-summary-total">
              <span>Sof foyda</span>
              <strong className="mono">{formatMln(netProfit)}</strong>
            </div>
          </div>
        </section>
      </div>

      {/* Tranzaksiyalar */}
      <section className="fin-registry">
        <header className="crm-registry-head">
          <div className="crm-registry-title">
            <div>
              <h2>Moliyaviy operatsiyalar</h2>
              <p>
                <strong className="mono">{filtered.length}</strong> ta operatsiya ko'rsatilmoqda
              </p>
            </div>
          </div>

          <div className="crm-toolbar">
            <label className="org-search crm-search">
              <span className="sr-only">Operatsiyani qidirish</span>
              <Icon name="search" />
              <input
                type="search"
                placeholder="Operatsiya ID yoki tavsif bo'yicha qidirish"
                value={query}
                onChange={(event) => setFilter(setQuery, event.target.value)}
              />
            </label>

            <label className="org-filter">
              <span>Turi</span>
              <select value={type} onChange={(event) => setFilter(setType, event.target.value)}>
                <option value="all">Barchasi</option>
                {TRANSACTION_TYPES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>To'lov usuli</span>
              <select value={method} onChange={(event) => setFilter(setMethod, event.target.value)}>
                <option value="all">Barcha usullar</option>
                {PAYMENT_METHODS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>Tashkilot</span>
              <select
                value={organization}
                onChange={(event) => setFilter(setOrganization, event.target.value)}
              >
                <option value="all">Barcha tashkilotlar</option>
                {FINANCE_ORGANIZATIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="org-filter crm-sort-filter">
              <span>Saralash</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="date">Sana bo'yicha</option>
                <option value="amount">Katta summa bo'yicha</option>
                <option value="amount-asc">Kichik summa bo'yicha</option>
                <option value="category">Kategoriya bo'yicha</option>
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
          <table className="crm-table fin-table">
            <thead>
              <tr>
                <th scope="col">Operatsiya</th>
                <th scope="col">Kategoriya</th>
                <th scope="col">Tashkilot</th>
                <th scope="col">Sana</th>
                <th scope="col">Usul</th>
                <th scope="col">Summa</th>
                <th scope="col">
                  <span className="sr-only">Ko'rish</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id}>
                  <td className="fin-cell-op">
                    <button type="button" onClick={() => setSelected(item)}>
                      <span className={`fin-op-icon fin-op-icon--${item.type}`} aria-hidden="true">
                        {item.type === "income" ? "+" : "−"}
                      </span>
                      <span>
                        <strong>{item.description}</strong>
                        <small className="mono">{item.id}</small>
                      </span>
                    </button>
                  </td>
                  <td data-label="Kategoriya" className="fin-cell-category">
                    {item.category}
                  </td>
                  <td data-label="Tashkilot" className="fin-cell-org">
                    {item.organization}
                  </td>
                  <td data-label="Sana" className="fin-cell-date">
                    {item.date}
                  </td>
                  <td data-label="Usul">
                    <span className="fin-method">{item.method}</span>
                  </td>
                  <td data-label="Summa" className={`fin-cell-amount fin-cell-amount--${item.type}`}>
                    <strong className="mono">
                      {item.type === "income" ? "+" : "−"}
                      {formatFixed(item.amount, 1)} mln
                    </strong>
                    {item.status === "pending" ? <small>kutilmoqda</small> : null}
                  </td>
                  <td className="org-cell-action crm-cell-action">
                    <button
                      type="button"
                      aria-label={`${item.id} operatsiyasini ko'rish`}
                      onClick={() => setSelected(item)}
                    >
                      <Icon name="arrow" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visible.length === 0 ? (
            <div className="org-empty">
              <span>
                <Icon name="search" />
              </span>
              <h3>Operatsiya topilmadi</h3>
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

      <TransactionDetail transaction={selected} onClose={closeDetail} />
    </div>
  );
}

function TransactionDetail({ transaction, onClose }) {
  if (!transaction) return null;
  const isIncome = transaction.type === "income";

  return (
    <Drawer
      open={Boolean(transaction)}
      onClose={onClose}
      title={transaction.description}
      subtitle={`${transaction.id} · ${transaction.category}`}
      size="medium"
      icon={<Icon name={isIncome ? "revenue" : "expense"} />}
      footer={
        <button type="button" className="org-secondary-button" onClick={onClose}>
          Yopish
        </button>
      }
    >
      <div className="fin-detail">
        <div className={`fin-detail-amount fin-detail-amount--${transaction.type}`}>
          <span>{isIncome ? "Kirim" : "Chiqim"}</span>
          <strong className="mono">
            {isIncome ? "+" : "−"}
            {formatFixed(transaction.amount, 1)} mln so'm
          </strong>
          <small>
            {transaction.status === "pending" ? "To'lov kutilmoqda" : "Amalga oshirilgan"}
          </small>
        </div>

        <section className="org-detail-section">
          <h3>Operatsiya ma'lumotlari</h3>
          <div className="fin-detail-list">
            <div>
              <Icon name="tag" />
              <span>{transaction.category}</span>
            </div>
            <div>
              <Icon name="building" />
              <span>{transaction.organization}</span>
            </div>
            <div>
              <Icon name="calendar" />
              <span>{transaction.date}</span>
            </div>
            <div>
              <Icon name="card" />
              <span>{transaction.method}</span>
            </div>
          </div>
        </section>

        <section className="org-detail-section">
          <h3>Yillik ko'rsatkichga hissasi</h3>
          <div className="fin-detail-contribution">
            <div>
              <span>{isIncome ? "Jami daromaddagi ulush" : "Jami xarajatdagi ulush"}</span>
              <strong className="mono">
                {formatFixed(
                  (transaction.amount / (isIncome ? totalRevenue : totalExpense)) * 100,
                  2,
                )}
                %
              </strong>
            </div>
            <div>
              <span>{isIncome ? "Yillik jami daromad" : "Yillik jami xarajat"}</span>
              <strong className="mono">{formatMln(isIncome ? totalRevenue : totalExpense)}</strong>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
