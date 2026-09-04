"use client";

import { useCallback, useMemo, useState } from "react";

import Drawer from "@/components/ui/Drawer";
import {
  REPORT_FORMATS,
  REPORT_HISTORY,
  REPORT_ORGANIZATIONS,
  REPORT_PERIODS,
  REPORT_STATUS,
  REPORT_SUMMARY,
  REPORT_TYPES,
  SCHEDULED_REPORTS,
} from "@/lib/mock/reports";

function Icon({ name }) {
  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="8" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="3" y="15" width="7" height="6" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
      </>
    ),
    finance: (
      <>
        <path d="M4 19h16M6 19v-6M11 19V8M16 19v-9M21 19V5" />
      </>
    ),
    marketing: <path d="M4 11v3l3 .8V21l3-.6v-6l10 3V5L7 9.5 4 10z" />,
    services: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 13.5c2.7.2 4.5 1.7 5 4.5" />
      </>
    ),
    gauge: (
      <>
        <path d="M4 17a8 8 0 0 1 16 0" />
        <path d="m12 17 4-8M3 21h18" />
      </>
    ),
    bars: (
      <>
        <path d="M4 20V10M9.5 20V4M15 20v-8M20.5 20V7M2.5 20h19" />
      </>
    ),
    analytics: (
      <>
        <path d="m3.5 17 5.5-6 3.5 3.5L20.5 6" />
        <path d="M15.5 6h5v5" />
      </>
    ),
    star: <path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.2l5.9-.8L12 3z" />,
    compare: (
      <>
        <path d="M4 7h13M13 3l4 4-4 4M20 17H7M11 13l-4 4 4 4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    schedule: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v10M8.5 10.5 12 14l3.5-3.5" />
        <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
      </>
    ),
    storage: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6V3z" />
        <path d="M14 3v4h4M9 12h6M9 16h6" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
        <circle cx="12" cy="12" r="2.7" />
      </>
    ),
    check: <path d="m5 12.5 4.3 4.2L19 7" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    pdf: (
      <>
        <path d="M6 3h8l4 4v14H6V3zM14 3v4h4" />
        <path d="M8.5 16v-4h1.4a1.3 1.3 0 0 1 0 2.6H8.5M12.5 12v4h1a2 2 0 0 0 0-4h-1M17 16v-4h2" />
      </>
    ),
    sheet: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M4 9h16M4 15h16M10 9v12M15 9v12" />
      </>
    ),
    code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
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

const normalizeText = (value) =>
  String(value).normalize("NFKC").toLowerCase().replace(/[ʻʼ'`]/g, "'");

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`report-toggle${checked ? " is-on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span></span>
    </button>
  );
}

function SummaryCard({ icon, label, value, note }) {
  return (
    <article className="org-summary-card report-summary-card">
      <span className="org-summary-icon"><Icon name={icon} /></span>
      <div>
        <span>{label}</span>
        <strong className="mono">{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

function CreateReportDrawer({ initialType, initialScheduled, onClose, onCreate }) {
  const initialReportType = REPORT_TYPES.find((item) => item.id === initialType) ?? REPORT_TYPES[0];
  const [form, setForm] = useState({
    title: `${initialReportType.label} — yangi hisobot`,
    type: initialReportType.id,
    organization: REPORT_ORGANIZATIONS[0],
    period: REPORT_PERIODS[0],
    format: "PDF",
    charts: true,
    recommendations: true,
    sourceData: false,
    scheduled: initialScheduled,
    cadence: "weekly",
    recipients: "aziz.karimov@olimpsk.uz",
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const changeType = (typeId) => {
    const reportType = REPORT_TYPES.find((item) => item.id === typeId);
    setForm((current) => ({
      ...current,
      type: typeId,
      title: `${reportType.label} — yangi hisobot`,
    }));
  };

  return (
    <Drawer
      open
      onClose={onClose}
      title="Yangi hisobot yaratish"
      subtitle="Shablon, davr va eksport formatini tanlang"
      size="medium"
      icon={<Icon name="file" />}
      footer={
        <>
          <button type="button" className="org-secondary-button" onClick={onClose}>Bekor qilish</button>
          <button type="submit" form="report-create-form" className="org-primary-button">
            <Icon name={form.scheduled ? "schedule" : "plus"} />
            {form.scheduled ? "Rejani saqlash" : "Hisobot yaratish"}
          </button>
        </>
      }
    >
      <form id="report-create-form" className="report-create-form" onSubmit={(event) => { event.preventDefault(); onCreate(form); }}>
        <section>
          <h3>Hisobot parametrlari</h3>
          <p>Hisobot nomi va qamrovini belgilang.</p>
          <div className="report-form-grid">
            <label className="report-field report-field--wide">
              <span>Hisobot nomi</span>
              <input required value={form.title} onChange={(event) => update("title", event.target.value)} />
            </label>
            <label className="report-field">
              <span>Hisobot turi</span>
              <select value={form.type} onChange={(event) => changeType(event.target.value)}>
                {REPORT_TYPES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <label className="report-field">
              <span>Tashkilot</span>
              <select value={form.organization} onChange={(event) => update("organization", event.target.value)}>
                {REPORT_ORGANIZATIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="report-field report-field--wide">
              <span>Hisobot davri</span>
              <select value={form.period} onChange={(event) => update("period", event.target.value)}>
                {REPORT_PERIODS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section>
          <h3>Eksport formati</h3>
          <p>Hisobotdan qanday foydalanishingizga mos formatni tanlang.</p>
          <div className="report-format-options">
            {REPORT_FORMATS.map((item) => (
              <label key={item.id} className={form.format === item.id ? "is-selected" : ""}>
                <input type="radio" name="report-format" value={item.id} checked={form.format === item.id} onChange={() => update("format", item.id)} />
                <span><Icon name={item.icon} /></span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
                <i><Icon name="check" /></i>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3>Hisobot tarkibi</h3>
          <p>Asosiy ko'rsatkichlar avtomatik kiritiladi.</p>
          <div className="report-create-options">
            <div>
              <span><strong>Grafik va vizualizatsiyalar</strong><small>Trend, taqqoslash va tarkib grafiklari</small></span>
              <Toggle checked={form.charts} label="Grafik va vizualizatsiyalar" onChange={(checked) => update("charts", checked)} />
            </div>
            <div>
              <span><strong>Avtomatik tavsiyalar</strong><small>KPI va chegaralar asosidagi Decision Support xulosasi</small></span>
              <Toggle checked={form.recommendations} label="Avtomatik tavsiyalar" onChange={(checked) => update("recommendations", checked)} />
            </div>
            <div>
              <span><strong>Manba ma'lumotlari</strong><small>Hisob-kitob uchun ishlatilgan jadval ma'lumotlari</small></span>
              <Toggle checked={form.sourceData} label="Manba ma'lumotlari" onChange={(checked) => update("sourceData", checked)} />
            </div>
          </div>
        </section>

        <section className="report-schedule-form">
          <div className="report-schedule-toggle">
            <span><strong>Avtomatik jo'natishni rejalash</strong><small>Hisobot belgilangan vaqtda avtomatik yaratiladi.</small></span>
            <Toggle checked={form.scheduled} label="Avtomatik jo'natishni rejalash" onChange={(checked) => update("scheduled", checked)} />
          </div>
          {form.scheduled ? (
            <div className="report-form-grid">
              <label className="report-field">
                <span>Takrorlanish</span>
                <select value={form.cadence} onChange={(event) => update("cadence", event.target.value)}>
                  <option value="weekly">Har hafta · Dushanba 08:00</option>
                  <option value="monthly">Har oy · 1-kun 09:00</option>
                  <option value="quarterly">Har chorak yakuni</option>
                </select>
              </label>
              <label className="report-field">
                <span>Qabul qiluvchi</span>
                <input type="email" required value={form.recipients} onChange={(event) => update("recipients", event.target.value)} />
              </label>
            </div>
          ) : null}
        </section>
      </form>
    </Drawer>
  );
}

function ReportDetailDrawer({ report, onClose, onDownload }) {
  const type = REPORT_TYPES.find((item) => item.id === report.type);
  const status = REPORT_STATUS[report.status];
  const sections = [
    "Davr bo'yicha qisqa xulosa",
    "Asosiy ko'rsatkichlar",
    "Dinamika va taqqoslash",
    "Avtomatik boshqaruv tavsiyalari",
  ];

  return (
    <Drawer
      open
      onClose={onClose}
      title={report.title}
      subtitle={`${report.id} · ${type.label}`}
      size="medium"
      icon={<Icon name={type.icon} />}
      footer={
        <>
          <button type="button" className="org-secondary-button" onClick={onClose}>Yopish</button>
          <button type="button" className="org-primary-button" disabled={report.status !== "ready"} onClick={() => onDownload(report)}>
            <Icon name="download" /> {report.format} yuklash
          </button>
        </>
      }
    >
      <div className="report-detail">
        <div className="report-detail-hero">
          <span className={`report-type-icon is-${type.accent}`}><Icon name={type.icon} /></span>
          <div><span>Hisobot holati</span><strong className={`report-status is-${status.tone}`}><i></i>{status.label}</strong></div>
          <div><span>Fayl</span><strong className="mono">{report.format} · {report.size}</strong></div>
        </div>
        <section className="org-detail-section">
          <h3>Hisobot ma'lumotlari</h3>
          <dl className="report-detail-grid">
            <div><dt>Tashkilot</dt><dd>{report.organization}</dd></div>
            <div><dt>Hisobot davri</dt><dd>{report.period}</dd></div>
            <div><dt>Yaratilgan vaqt</dt><dd>{report.createdAt}</dd></div>
            <div><dt>Mas'ul foydalanuvchi</dt><dd>{report.author}</dd></div>
          </dl>
        </section>
        <section className="org-detail-section">
          <h3>Hisobot tarkibi</h3>
          <ul className="report-detail-sections">
            {sections.map((item) => <li key={item}><Icon name="check" />{item}</li>)}
            {type.sections > sections.length ? <li><Icon name="plus" />Yana {type.sections - sections.length} ta maxsus bo'lim</li> : null}
          </ul>
        </section>
        <div className="report-detail-note"><Icon name="info" />Hisobot ma'lumotlari 5-sentabr, 01:42 holatiga yangilangan.</div>
      </div>
    </Drawer>
  );
}

export default function ReportsPage() {
  const [history, setHistory] = useState(REPORT_HISTORY);
  const [schedules, setSchedules] = useState(SCHEDULED_REPORTS);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState("executive");
  const [createScheduled, setCreateScheduled] = useState(false);
  const [selected, setSelected] = useState(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const needle = normalizeText(query.trim());
    return history.filter((item) => {
      const matchesQuery = !needle || normalizeText(`${item.title} ${item.id} ${item.organization}`).includes(needle);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesFormat = formatFilter === "all" || item.format === formatFilter;
      return matchesQuery && matchesType && matchesFormat;
    });
  }, [history, query, typeFilter, formatFilter]);

  const closeCreate = useCallback(() => setCreateOpen(false), []);
  const closeDetail = useCallback(() => setSelected(null), []);

  const openCreate = (type = "executive", scheduled = false) => {
    setCreateType(type);
    setCreateScheduled(scheduled);
    setCreateOpen(true);
    setNotice("");
  };

  const createReport = (form) => {
    if (form.scheduled) {
      const type = REPORT_TYPES.find((item) => item.id === form.type);
      setSchedules((current) => [
        {
          id: `schedule-${current.length + 1}`,
          title: form.title,
          type: form.type,
          cadence: form.cadence === "weekly" ? "Har dushanba · 08:00" : form.cadence === "monthly" ? "Har oyning 1-kuni · 09:00" : "Har chorak yakuni · 17:00",
          nextRun: "Keyingi reja bo'yicha",
          recipients: 1,
          format: form.format,
          active: true,
        },
        ...current,
      ]);
      setCreateOpen(false);
      setNotice(`${type.label} uchun avtomatik jo'natish rejasi yaratildi.`);
      return;
    }

    const id = `RPT-260905-${String(history.length + 25).padStart(3, "0")}`;
    const report = {
      id,
      title: form.title,
      type: form.type,
      organization: form.organization,
      period: form.period,
      createdAt: "Hozir",
      format: form.format,
      size: "Tayyorlanmoqda",
      status: "processing",
      author: "Aziz Karimov",
    };
    setHistory((current) => [report, ...current]);
    setCreateOpen(false);
    setNotice("Hisobot navbatga qo'shildi. Tayyor bo'lishi bilan yuklab olish mumkin.");
    window.setTimeout(() => {
      setHistory((current) => current.map((item) => item.id === id ? { ...item, status: "ready", size: form.format === "CSV" ? "742 KB" : form.format === "XLSX" ? "1,6 MB" : "2,2 MB" } : item));
      setNotice("Yangi hisobot tayyor. Uni tarix bo'limidan yuklab olishingiz mumkin.");
    }, 700);
  };

  const downloadReport = (report) => {
    setSelected(null);
    setNotice(`${report.title} · ${report.format} yuklab olish uchun tayyorlandi.`);
  };

  const toggleSchedule = (id, active) => {
    setSchedules((current) => current.map((item) => item.id === id ? { ...item, active } : item));
  };

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setFormatFilter("all");
  };

  const filtersActive = query.trim() || typeFilter !== "all" || formatFilter !== "all";

  return (
    <div className="reports-page">
      <header className="org-page-head reports-page-head">
        <div>
          <span className="org-eyebrow">Hisobot markazi</span>
          <h1>Hisobotlar</h1>
          <p>Boshqaruv ma'lumotlarini tayyor shablonlarda jamlang, eksport qiling va avtomatik jo'natishni rejalang.</p>
        </div>
        <button type="button" className="org-primary-button" onClick={() => openCreate()}>
          <Icon name="plus" /> Yangi hisobot
        </button>
      </header>

      {notice ? (
        <div className="report-notice" role="status">
          <Icon name="check" /><span>{notice}</span>
          <button type="button" aria-label="Xabarni yopish" onClick={() => setNotice("")}>×</button>
        </div>
      ) : null}

      <section className="org-summary-grid" aria-label="Hisobotlar umumiy ko'rsatkichlari">
        <SummaryCard icon="file" label="Bu oy yaratildi" value={REPORT_SUMMARY.thisMonth + history.length - REPORT_HISTORY.length} note="o'tgan oyga nisbatan +18%" />
        <SummaryCard icon="schedule" label="Rejalashtirilgan" value={schedules.filter((item) => item.active).length} note={`${schedules.length} ta avtomatik qoida`} />
        <SummaryCard icon="download" label="Yuklab olishlar" value={REPORT_SUMMARY.downloads} note="so'nggi 30 kun ichida" />
        <SummaryCard icon="storage" label="Fayllar hajmi" value={`${String(REPORT_SUMMARY.storageMb).replace(".", ",")} MB`} note="2 GB limitdan 7,4%" />
      </section>

      <section className="report-template-panel">
        <header className="report-panel-head">
          <div><h2>Hisobot shablonlari</h2><p>Kerakli hisobot turini tanlang va parametrlarini moslashtiring.</p></div>
          <span>10 ta shablon</span>
        </header>
        <div className="report-template-grid">
          {REPORT_TYPES.map((type) => (
            <button type="button" key={type.id} onClick={() => openCreate(type.id)}>
              <span className={`report-type-icon is-${type.accent}`}><Icon name={type.icon} /></span>
              <span><strong>{type.label}</strong><small>{type.description}</small></span>
              <i><Icon name="plus" /></i>
            </button>
          ))}
        </div>
      </section>

      <section className="report-registry">
        <header className="report-registry-head">
          <div className="report-panel-head">
            <div><h2>Hisobotlar tarixi</h2><p><strong className="mono">{filtered.length}</strong> ta hisobot ko'rsatilmoqda</p></div>
            <span>Yangilandi: bugun, 01:42</span>
          </div>
          <div className="report-toolbar">
            <label className="report-search">
              <span className="sr-only">Hisobotlarni qidirish</span>
              <Icon name="search" />
              <input type="search" placeholder="Hisobot nomi yoki ID bo'yicha qidirish" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <label className="report-filter">
              <span>Turi</span>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option value="all">Barcha turlar</option>
                {REPORT_TYPES.map((type) => <option key={type.id} value={type.id}>{type.shortLabel}</option>)}
              </select>
            </label>
            <label className="report-filter">
              <span>Format</span>
              <select value={formatFilter} onChange={(event) => setFormatFilter(event.target.value)}>
                <option value="all">Barcha formatlar</option>
                {REPORT_FORMATS.map((format) => <option key={format.id} value={format.id}>{format.label}</option>)}
              </select>
            </label>
            {filtersActive ? <button type="button" className="org-clear-button" onClick={clearFilters}>Tozalash</button> : null}
          </div>
        </header>

        <div className="report-table-scroll">
          <table className="report-table">
            <thead><tr><th>Hisobot</th><th>Turi</th><th>Davr</th><th>Yaratildi</th><th>Format</th><th>Holat</th><th><span className="sr-only">Amallar</span></th></tr></thead>
            <tbody>
              {filtered.map((report) => {
                const type = REPORT_TYPES.find((item) => item.id === report.type);
                const status = REPORT_STATUS[report.status];
                return (
                  <tr key={report.id}>
                    <td className="report-name-cell">
                      <button type="button" onClick={() => setSelected(report)}>
                        <span className={`report-type-icon is-${type.accent}`}><Icon name={type.icon} /></span>
                        <span><strong>{report.title}</strong><small className="mono">{report.id}</small></span>
                      </button>
                    </td>
                    <td data-label="Turi"><span className="report-type-tag">{type.shortLabel}</span></td>
                    <td data-label="Davr" className="report-period-cell">{report.period}</td>
                    <td data-label="Yaratildi"><span className="report-created"><strong>{report.createdAt}</strong><small>{report.author}</small></span></td>
                    <td data-label="Format"><span className={`report-format-badge is-${report.format.toLowerCase()}`}><b>{report.format}</b><small>{report.size}</small></span></td>
                    <td data-label="Holat"><span className={`report-status is-${status.tone}`}><i></i>{status.label}</span></td>
                    <td className="report-actions-cell">
                      <button type="button" aria-label={`${report.title} tafsilotlarini ko'rish`} onClick={() => setSelected(report)}><Icon name="eye" /></button>
                      <button type="button" disabled={report.status !== "ready"} aria-label={`${report.title} hisobotini yuklash`} onClick={() => downloadReport(report)}><Icon name="download" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 ? (
            <div className="report-empty"><span><Icon name="search" /></span><h3>Hisobot topilmadi</h3><p>Qidiruv yoki filtrlarni o'zgartirib ko'ring.</p><button type="button" onClick={clearFilters}>Filterlarni tozalash</button></div>
          ) : null}
        </div>
        {filtered.length ? <footer className="report-registry-footer"><span><b className="mono">1–{filtered.length}</b> / {filtered.length}</span><span>Barcha vaqtlar Asia/Tashkent (UTC+5)</span></footer> : null}
      </section>

      <div className="report-bottom-grid">
        <section className="report-schedule-panel">
          <header className="report-panel-head">
            <div><h2>Rejalashtirilgan hisobotlar</h2><p>Avtomatik yaratish va jo'natish qoidalari.</p></div>
            <button type="button" onClick={() => openCreate("executive", true)}><Icon name="plus" /> Yangi reja</button>
          </header>
          <div className="report-schedule-list">
            {schedules.map((schedule) => {
              const type = REPORT_TYPES.find((item) => item.id === schedule.type);
              return (
                <div key={schedule.id}>
                  <span className={`report-type-icon is-${type.accent}`}><Icon name={type.icon} /></span>
                  <div><strong>{schedule.title}</strong><p>{schedule.cadence}</p><small>Keyingi: {schedule.nextRun} · {schedule.recipients} qabul qiluvchi · {schedule.format}</small></div>
                  <Toggle checked={schedule.active} label={`${schedule.title} rejasini ${schedule.active ? "o'chirish" : "yoqish"}`} onChange={(active) => toggleSchedule(schedule.id, active)} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="report-format-guide">
          <header className="report-panel-head"><div><h2>Eksport formatlari</h2><p>Vazifaga mos formatni tanlang.</p></div></header>
          <div>
            {REPORT_FORMATS.map((format) => (
              <article key={format.id}>
                <span><Icon name={format.icon} /></span>
                <div><strong>{format.label}</strong><p>{format.description}</p></div>
                <small>{format.id === "PDF" ? "Rahbar uchun" : format.id === "XLSX" ? "Analitik uchun" : "Tizim uchun"}</small>
              </article>
            ))}
          </div>
          <p className="report-security-note"><Icon name="check" />Eksport fayllari foydalanuvchi huquqlariga muvofiq shakllantiriladi.</p>
        </section>
      </div>

      {createOpen ? <CreateReportDrawer initialType={createType} initialScheduled={createScheduled} onClose={closeCreate} onCreate={createReport} /> : null}
      {selected ? <ReportDetailDrawer report={selected} onClose={closeDetail} onDownload={downloadReport} /> : null}
    </div>
  );
}
