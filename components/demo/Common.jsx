"use client";
import { useCallback, useRef, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { PERIODS, money, number, periodRange } from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";

export function Button({
  secondary = false,
  danger = false,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`${secondary ? "org-secondary-button" : "org-primary-button"}${danger ? " demo-danger" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function PageHead({
  eyebrow = "SPORTDIGITAL / BOSHQARUV",
  title,
  description,
  children,
}) {
  return (
    <header className="org-page-head demo-page-head">
      <div>
        <span className="org-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="demo-actions">{children}</div>
    </header>
  );
}
export function PeriodControl() {
  const { state, dispatch } = useDemo();
  const range = periodRange(state.period);
  return (
    <div className="demo-period">
      <label>
        Davr{" "}
        <select
          aria-label="Hisoblash davri"
          value={state.period}
          onChange={(e) => dispatch({ type: "period", value: e.target.value })}
        >
          {Object.entries(PERIODS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <span>
        {range.start} — {range.end}
      </span>
    </div>
  );
}
export function Stat({ label, value, note, accent }) {
  return (
    <article className={`demo-stat${accent ? " is-accent" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}
export function Stats({ children }) {
  return <div className="demo-stats">{children}</div>;
}
export function Panel({ title, note, children, className = "" }) {
  return (
    <section className={`demo-panel ${className}`}>
      <header>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </header>
      {children}
    </section>
  );
}
const statuses = {
  active: "Faol",
  archived: "Arxivda",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
  pending: "Kutilmoqda",
  approved: "Tasdiqlangan",
};
export function Badge({ value }) {
  return (
    <span className={`demo-badge demo-badge-${value}`}>
      {statuses[value] ?? value}
    </span>
  );
}
export function Empty({ text = "Ma’lumot topilmadi.", children }) {
  return (
    <div className="demo-empty">
      <span aria-hidden="true">◎</span>
      <h3>{text}</h3>
      <p>Qidiruv va filtrlarni tekshiring yoki yangi yozuv qo‘shing.</p>
      {children}
    </div>
  );
}
export function DataTable({
  rows,
  columns,
  searchLabel = "Qidirish",
  filters,
  sortKey = "name",
  rowAction,
}) {
  const [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [direction, setDirection] = useState("asc");
  const filtered = rows
    .filter((row) =>
      JSON.stringify(row)
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
    )
    .sort(
      (a, b) =>
        String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""), "uz", {
          numeric: true,
        }) * (direction === "asc" ? 1 : -1),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 8)),
    activePage = Math.min(page, pages);
  return (
    <section className="demo-table-section">
      <div className="demo-toolbar">
        <input
          type="search"
          aria-label={searchLabel}
          placeholder={`${searchLabel}…`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        {filters}
        <select
          aria-label="Saralash tartibi"
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value);
            setPage(1);
          }}
        >
          <option value="asc">O‘sish tartibida</option>
          <option value="desc">Kamayish tartibida</option>
        </select>
      </div>
      {filtered.length ? (
        <>
          <div className="demo-table-scroll">
            <table className="demo-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} scope="col">
                      {c.label}
                    </th>
                  ))}
                  {rowAction && <th scope="col">Amallar</th>}
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice((activePage - 1) * 8, activePage * 8)
                  .map((row) => (
                    <tr key={row.id}>
                      {columns.map((c) => (
                        <td key={c.key}>
                          {c.render ? c.render(row) : row[c.key]}
                        </td>
                      ))}
                      {rowAction && (
                        <td>
                          <div className="demo-row-actions">
                            {rowAction(row)}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <footer className="demo-pagination">
            <span>
              {filtered.length} ta yozuv · {activePage} / {pages}
            </span>
            <div>
              <button
                disabled={activePage === 1}
                onClick={() => setPage(activePage - 1)}
              >
                ← Oldingi
              </button>
              <button
                disabled={activePage === pages}
                onClick={() => setPage(activePage + 1)}
              >
                Keyingi →
              </button>
            </div>
          </footer>
        </>
      ) : (
        <Empty>
          <button onClick={() => setQuery("")}>Qidiruvni tozalash</button>
        </Empty>
      )}
    </section>
  );
}
export function FormDrawer({
  title,
  fields,
  initial = {},
  onClose,
  onSave,
  submitLabel = "Saqlash",
  children,
}) {
  const [values, setValues] = useState(initial),
    [error, setError] = useState("");
  const busy = useRef(false);
  const close = useCallback(() => onClose(), [onClose]);
  function submit(e) {
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    try {
      onSave(values);
      onClose();
    } catch (e) {
      setError(e.message);
      busy.current = false;
    }
  }
  return (
    <Drawer
      open
      title={title}
      onClose={close}
      subtitle="Ma’lumotlar shu brauzerda saqlanadi."
    >
      <form onSubmit={submit} className="demo-form">
        {fields.map((f) => (
          <label key={f.key}>
            <span>
              {f.label}
              {f.required !== false ? " *" : ""}
            </span>
            {f.options ? (
              <select
                required={f.required !== false}
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues({ ...values, [f.key]: e.target.value })
                }
              >
                <option value="">Tanlang</option>
                {f.options.map((o) => (
                  <option
                    key={typeof o === "string" ? o : o.value}
                    value={typeof o === "string" ? o : o.value}
                  >
                    {typeof o === "string" ? o : o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                required={f.required !== false}
                maxLength={250}
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues({ ...values, [f.key]: e.target.value })
                }
              />
            ) : (
              <input
                type={f.type ?? "text"}
                required={f.required !== false}
                min={f.min}
                max={f.max}
                step={f.type === "number" ? (f.step ?? 1) : undefined}
                maxLength={250}
                value={values[f.key] ?? ""}
                onChange={(e) =>
                  setValues({ ...values, [f.key]: e.target.value })
                }
              />
            )}
            {f.note && <small>{f.note}</small>}
          </label>
        ))}
        {typeof children === "function" ? children(values) : children}
        {error && (
          <p className="demo-warning" role="alert">
            {error}
          </p>
        )}
        <div className="demo-actions">
          <Button secondary onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Drawer>
  );
}
export function Confirmation({ title, text, onConfirm, onClose }) {
  const [error, setError] = useState("");
  return (
    <Drawer open title={title} onClose={onClose}>
      <p>{text}</p>
      {error && (
        <p role="alert" className="demo-warning">
          {error}
        </p>
      )}
      <div className="demo-actions">
        <Button secondary onClick={onClose}>
          Ortga qaytish
        </Button>
        <Button
          danger
          onClick={() => {
            try {
              onConfirm();
              onClose();
            } catch (e) {
              setError(e.message);
            }
          }}
        >
          Tasdiqlash
        </Button>
      </div>
    </Drawer>
  );
}
export function MoneyStats({ metrics: m }) {
  return (
    <Stats>
      <Stat
        label="Jami tushum"
        value={money(m.revenue)}
        note={`${m.sales} ta yakunlangan sotuv`}
        accent
      />
      <Stat
        label="Jami xarajat"
        value={money(m.expense)}
        note="Tanlangan davr uchun"
      />
      <Stat label="Sof foyda" value={money(m.profit)} note="Tushum − xarajat" />
      <Stat
        label="Raqamli to‘lovlar"
        value={`${number(m.digital)}%`}
        note="Karta va onlayn tushum ulushi"
      />
    </Stats>
  );
}
export function RevenueChart({ metrics: m }) {
  const totals = new Map();
  for (const s of m.transactions)
    totals.set(s.date, (totals.get(s.date) ?? 0) + s.total);
  const points = [...totals.entries()].sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(1, ...points.map((p) => p[1]));
  return (
    <Panel
      title="Tushum dinamikasi"
      note="Yakunlangan sotuvlar · kunlar kesimida"
    >
      {points.length ? (
        <div
          className="demo-chart"
          role="img"
          aria-label={`Tushum grafigi, jami ${money(m.revenue)}`}
        >
          <div className="demo-bars">
            {points.map(([date, total]) => (
              <div key={date} className="demo-bar-column">
                <span className="demo-bar-value">{number(total / 1000)}K</span>
                <div
                  tabIndex={0}
                  title={`${date}: ${money(total)}`}
                  aria-label={`${date}: ${money(total)}`}
                  style={{ height: `${Math.max(4, (total / max) * 150)}px` }}
                />
                <small>{date.slice(5)}</small>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Empty text="Bu davrda hali sotuv yo‘q." />
      )}
    </Panel>
  );
}
