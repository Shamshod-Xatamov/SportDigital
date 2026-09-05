"use client";

import { useCallback, useMemo, useState } from "react";

import { useLegacyRecords } from "@/components/demo/useLegacy";
import LegacyRowActions from "@/components/demo/LegacyRowActions";
import Drawer from "@/components/ui/Drawer";
import {
  CRM_METRICS,
  FANS,
  FAN_CHANNELS,
  FAN_ORGANIZATIONS,
  FAN_REGIONS,
  FAN_SEGMENTS as BASE_FAN_SEGMENTS,
  getFanSegment,
} from "@/lib/mock/fans";

const PAGE_SIZE = 8;

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  region: "Toshkent shahri",
  organization: FAN_ORGANIZATIONS[0],
  channel: "Telegram",
  favoriteSport: "",
  consent: "yes",
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
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5M15 6.5a3 3 0 0 1 0 5M16 14c2.4.5 4 2.1 4.5 4.5" />
      </>
    ),
    pulse: (
      <>
        <path d="M4 12h3l2-5 4 10 2-5h5" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
    retention: (
      <>
        <path d="M20 8a8 8 0 1 0 1 7" />
        <path d="M20 3v5h-5" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 6h14a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12" />
        <path d="M15 11h6v4h-6a2 2 0 0 1 0-4z" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    phone: <path d="M7 4 4 5.5c-.7.4-.8 1.1-.5 1.9 2.4 6.3 6.8 10.7 13.1 13.1.8.3 1.5.2 1.9-.5l1.5-3-4.1-2-1.2 1.8c-2.8-1.3-5.2-3.7-6.5-6.5L10 9.1 8 5z" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    map: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    message: (
      <>
        <path d="M4 5h16v12H9l-5 4V5z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
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

const formatNumber = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const formatMoney = (value) => {
  if (value >= 1000000) {
    const millions = String(Number((value / 1000000).toFixed(1))).replace(".", ",");
    return `${millions} mln`;
  }
  return `${formatNumber(value)} so'm`;
};

const normalizeText = (value) =>
  String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ʻʼ’`]/g, "'");

const compareText = (left, right) => {
  const normalizedLeft = normalizeText(left);
  const normalizedRight = normalizeText(right);
  if (normalizedLeft < normalizedRight) return -1;
  if (normalizedLeft > normalizedRight) return 1;
  return 0;
};

const getInitials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

function SegmentBadge({ segment }) {
  const item = getFanSegment(segment);
  return <span className={`crm-segment-badge crm-segment-badge--${segment}`}>{item.label}</span>;
}

function ScoreBar({ value, label }) {
  return (
    <div className="crm-score-bar">
      <div>
        <span>{label}</span>
        <strong className="mono">{value}</strong>
      </div>
      <span aria-hidden="true">
        <i style={{ width: `${value}%` }}></i>
      </span>
    </div>
  );
}

export default function CrmPage() {
  const { rows: fans, save: saveRecord, canEdit, organization: currentOrganization } = useLegacyRecords("customers");
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const [channel, setChannel] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("score");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const closeDetail = useCallback(() => setSelected(null), []);
  const closeForm = useCallback(() => setFormOpen(false), []);
  const FAN_SEGMENTS=BASE_FAN_SEGMENTS.map(s=>({...s,count:fans.filter(f=>f.segment===s.id).length}));
  const addedFans = 0;
  const totalFans = fans.length;
  const activeFans = FAN_SEGMENTS[0].count + FAN_SEGMENTS[1].count;

  const segmentCounts = useMemo(
    () =>
      Object.fromEntries(
        FAN_SEGMENTS.map((item) => [
          item.id,
          item.count + fans.slice(0, addedFans).filter((fan) => fan.segment === item.id).length,
        ]),
      ),
    [fans, addedFans],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const rows = fans.filter((fan) => {
      const haystack = normalizeText(
        `${fan.name} ${fan.id} ${fan.phone} ${fan.email} ${fan.region} ${fan.favoriteSport}`,
      );
      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (segment !== "all" && fan.segment !== segment) return false;
      if (channel !== "all" && fan.channel !== channel) return false;
      if (region !== "all" && fan.region !== region) return false;
      return true;
    });

    return [...rows].sort((left, right) => {
      if (sort === "recent") return right.interactions - left.interactions;
      if (sort === "value") return right.lifetimeValue - left.lifetimeValue;
      if (sort === "visits") return right.visits - left.visits;
      if (sort === "name") return compareText(left.name, right.name);
      return right.score - left.score;
    });
  }, [fans, query, segment, channel, region, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const filtersActive =
    query.trim() || segment !== "all" || channel !== "all" || region !== "all";

  const selectSegment = (value) => {
    setSegment(value);
    setPage(1);
  };

  const setFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setSegment("all");
    setChannel("all");
    setRegion("all");
    setPage(1);
  };

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, organization: currentOrganization?.name });
    setFormError("");
    setFormOpen(true);
  };

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const createFan = (event) => {
    event.preventDefault();
    const nextNumber = CRM_METRICS.total + addedFans + 1;
    const next = {
      id: `CRM-${nextNumber}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      region: form.region,
      organization: form.organization,
      segment: "average",
      score: 50,
      channel: form.channel,
      joinedAt: "Bugun",
      lastActivity: "Hozirgina",
      lastAction: "CRM profil yaratildi",
      interactions: 1,
      visits: 0,
      purchases: 0,
      lifetimeValue: 0,
      favoriteSport: form.favoriteSport.trim() || "Belgilanmagan",
      interests: form.favoriteSport.trim() ? [form.favoriteSport.trim()] : [],
      consent: form.consent === "yes",
      scores: { visits: 50, purchases: 50, digital: 50, feedback: 50 },
    };
    next.id = form.id || crypto.randomUUID();
    try { saveRecord(next); } catch (error) { setFormError(error.message); return; }
    setFormOpen(false);
    setSelected(next);
  };

  return (
    <div className="crm-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Fan engagement</span>
          <h1>Muxlislar va CRM</h1>
          <p>Muxlislar faolligi, segmentlari va tashkilot bilan barcha aloqalarini boshqaring.</p>
        </div>
        <button type="button" className="org-primary-button" onClick={openCreate} disabled={!canEdit} title={!canEdit ? "Bu amal uchun administrator huquqi kerak" : undefined}>
          <Icon name="plus" />
          Muxlis qo'shish
        </button>
      </header>

      <section className="org-summary-grid" aria-label="CRM umumiy ko'rsatkichlari">
        <SummaryCard icon="users" label="Jami muxlislar" value={formatNumber(totalFans)} note="yagona CRM bazasida" />
        <SummaryCard
          icon="pulse"
          label="Faol auditoriya"
          value={formatNumber(activeFans)}
          note={`${Math.round((activeFans / totalFans) * 100)}% yuqori faollikda`}
        />
        <SummaryCard
          icon="message"
          label="Faollik indeksi"
          value={`${CRM_METRICS.engagementScore}%`}
          note={`+${CRM_METRICS.engagementChange}% o'tgan oyga`}
        />
        <SummaryCard
          icon="retention"
          label="Retention rate"
          value={`${CRM_METRICS.retention}%`}
          note={`+${CRM_METRICS.retentionChange}% o'sish`}
        />
      </section>

      <section className="crm-segments" aria-labelledby="crm-segments-title">
        <header>
          <div>
            <h2 id="crm-segments-title">Faollik segmentlari</h2>
            <p>Score tashrif, xarid, raqamli faollik va fikrlar asosida avtomatik hisoblanadi.</p>
          </div>
          <span>
            <Icon name="pulse" />
            Avtomatik segmentatsiya
          </span>
        </header>
        <div className="crm-segment-grid">
          {FAN_SEGMENTS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`crm-segment-card crm-segment-card--${item.id}${segment === item.id ? " is-active" : ""}`}
              aria-pressed={segment === item.id}
              onClick={() => selectSegment(segment === item.id ? "all" : item.id)}
            >
              <span className="crm-segment-card-head">
                <i aria-hidden="true"></i>
                <strong>{item.label}</strong>
                <small>{item.range}</small>
              </span>
              <span className="crm-segment-card-value">
                <strong className="mono">{formatNumber(segmentCounts[item.id])}</strong>
                <small className="mono">{item.share}%</small>
              </span>
              <span className="crm-segment-progress" aria-hidden="true">
                <i style={{ width: `${item.share * 3}%` }}></i>
              </span>
              <span className="crm-segment-description">{item.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="crm-registry">
        <header className="crm-registry-head">
          <div className="crm-registry-title">
            <div>
              <h2>Muxlislar reyestri</h2>
              <p>
                <strong className="mono">{filtered.length}</strong> ta namuna profil ko'rsatilmoqda
              </p>
            </div>
            {segment !== "all" ? (
              <span className="service-active-filter">
                {getFanSegment(segment).label}
                <button type="button" aria-label="Segment filtrini tozalash" onClick={() => selectSegment("all")}>
                  ×
                </button>
              </span>
            ) : null}
          </div>

          <div className="crm-toolbar">
            <label className="org-search crm-search">
              <span className="sr-only">Muxlisni qidirish</span>
              <Icon name="search" />
              <input
                type="search"
                placeholder="Ism, CRM ID yoki telefon bo'yicha qidirish"
                value={query}
                onChange={(event) => setFilter(setQuery, event.target.value)}
              />
            </label>

            <label className="org-filter">
              <span>Aloqa kanali</span>
              <select value={channel} onChange={(event) => setFilter(setChannel, event.target.value)}>
                <option value="all">Barcha kanallar</option>
                {FAN_CHANNELS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>Hudud</span>
              <select value={region} onChange={(event) => setFilter(setRegion, event.target.value)}>
                <option value="all">Barcha hududlar</option>
                {FAN_REGIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="org-filter crm-sort-filter">
              <span>Saralash</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="score">Faollik score bo'yicha</option>
                <option value="recent">Interaction bo'yicha</option>
                <option value="value">Mijoz qiymati bo'yicha</option>
                <option value="visits">Tashriflar bo'yicha</option>
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
          <table className="crm-table">
            <thead>
              <tr>
                <th scope="col">Muxlis</th>
                <th scope="col">Segment va score</th>
                <th scope="col">Oxirgi faollik</th>
                <th scope="col">Tashriflar</th>
                <th scope="col">Mijoz qiymati</th>
                <th scope="col">Kanal</th>
                <th scope="col">Qo'shilgan</th>
                <th scope="col"><span className="sr-only">Ko'rish</span></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((fan) => (
                <tr key={fan.id}>
                  <td className="crm-cell-profile">
                    <button type="button" onClick={() => setSelected(fan)}>
                      <span className={`crm-avatar crm-avatar--${fan.segment}`}>{getInitials(fan.name)}</span>
                      <span>
                        <strong>{fan.name}</strong>
                        <small className="mono">{fan.id}</small>
                      </span>
                    </button>
                  </td>
                  <td data-label="Segment">
                    <div className="crm-cell-segment">
                      <SegmentBadge segment={fan.segment} />
                      <strong className="mono">{fan.score}</strong>
                    </div>
                  </td>
                  <td className="crm-cell-activity" data-label="Oxirgi faollik">
                    <strong>{fan.lastActivity}</strong>
                    <small>{fan.lastAction}</small>
                  </td>
                  <td className="crm-cell-visits" data-label="Tashriflar">
                    <strong className="mono">{fan.visits}</strong>
                    <small>{fan.interactions} interaction</small>
                  </td>
                  <td className="crm-cell-value" data-label="Mijoz qiymati">
                    <strong className="mono">{formatMoney(fan.lifetimeValue)}</strong>
                    <small>{fan.purchases} ta xarid</small>
                  </td>
                  <td className="crm-cell-channel" data-label="Kanal">
                    <span>{fan.channel}</span>
                    <small>{fan.consent ? "Opt-in" : "Opt-out"}</small>
                  </td>
                  <td className="crm-cell-joined" data-label="Qo'shilgan">{fan.joinedAt}</td>
                  <td className="org-cell-action crm-cell-action">
                    {!canEdit && <button
                      type="button"
                      aria-label={`${fan.name} profilini ko'rish`}
                      onClick={() => setSelected(fan)}
                    >
                      <Icon name="arrow" />
                    </button>}
                      {canEdit && <LegacyRowActions onView={() => setSelected(fan)} collection="customers" row={fan} onEdit={row => { setForm({ ...row, consent:row.consent?'yes':'no' }); setSelected(null); setFormError(''); setFormOpen(true); }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {visible.length === 0 ? (
            <div className="org-empty">
              <span><Icon name="search" /></span>
              <h3>Muxlis topilmadi</h3>
              <p>Qidiruv yoki segment filterlarini o'zgartirib ko'ring.</p>
              <button type="button" onClick={clearFilters}>Filterlarni tozalash</button>
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

      <FanDetail fan={selected} onClose={closeDetail} />

      <Drawer
        open={formOpen}
        onClose={closeForm}
        title="Yangi muxlis"
        subtitle="CRM profil uchun asosiy ma'lumotlarni kiriting"
        size="wide"
        icon={<Icon name="users" />}
        footer={
          <>
            <button type="button" className="org-secondary-button" onClick={closeForm}>Bekor qilish</button>
            <button type="submit" form="fan-create-form" className="org-primary-button">Profil yaratish</button>
          </>
        }
      >
        <form id="fan-create-form" className="org-form" onSubmit={createFan}>
          {formError && <p className="demo-warning" role="alert">{formError}</p>}
          <div className="org-form-section">
            <h3>Shaxsiy ma'lumotlar</h3>
            <p>Muxlis bilan bog'lanish va profilni aniqlash uchun.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field org-form-field--wide">
              <span>F.I.Sh.</span>
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="Masalan, Jamshid Aliyev"
                required
                autoFocus
              />
            </label>
            <label className="org-form-field">
              <span>Telefon</span>
              <input name="phone" value={form.phone} onChange={updateForm} placeholder="+998 90 000 00 00" required />
            </label>
            <label className="org-form-field">
              <span>Elektron pochta</span>
              <input name="email" type="email" value={form.email} onChange={updateForm} placeholder="name@example.uz" />
            </label>
            <label className="org-form-field">
              <span>Hudud</span>
              <select name="region" value={form.region} onChange={updateForm}>
                {FAN_REGIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="org-form-field">
              <span>Tashkilot</span>
              <select name="organization" value={form.organization} onChange={updateForm}>
                {[currentOrganization.name].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          <div className="org-form-section">
            <h3>CRM sozlamalari</h3>
            <p>Aloqa kanali va marketing roziligini belgilang.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field">
              <span>Afzal aloqa kanali</span>
              <select name="channel" value={form.channel} onChange={updateForm}>
                {FAN_CHANNELS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="org-form-field">
              <span>Marketing roziligi</span>
              <select name="consent" value={form.consent} onChange={updateForm}>
                <option value="yes">Rozilik berilgan</option>
                <option value="no">Rozilik berilmagan</option>
              </select>
            </label>
            <label className="org-form-field org-form-field--wide">
              <span>Sevimli sport turi</span>
              <input
                name="favoriteSport"
                value={form.favoriteSport}
                onChange={updateForm}
                placeholder="Futbol, tennis, fitnes..."
              />
            </label>
          </div>
          <div className="crm-form-note">
            <Icon name="pulse" />
            <p>Yangi profil dastlab “O'rtacha” segmentga qo'shiladi. Score keyingi interactionlar asosida avtomatik yangilanadi.</p>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

function FanDetail({ fan, onClose }) {
  if (!fan) return null;
  const segment = getFanSegment(fan.segment);

  return (
    <Drawer
      open={Boolean(fan)}
      onClose={onClose}
      title={fan.name}
      subtitle={`${fan.id} · ${fan.region}`}
      size="medium"
      icon={<Icon name="users" />}
      footer={<button type="button" className="org-secondary-button" onClick={onClose}>Yopish</button>}
    >
      <div className="crm-detail">
        <div className="crm-detail-identity">
          <span className={`crm-detail-avatar crm-avatar--${fan.segment}`}>{getInitials(fan.name)}</span>
          <div>
            <SegmentBadge segment={fan.segment} />
            <h3>{fan.favoriteSport}</h3>
            <p>{fan.organization}</p>
          </div>
          <div className="crm-detail-score">
            <strong className="mono">{fan.score}</strong>
            <span>score</span>
          </div>
        </div>

        <div className="org-detail-metrics crm-detail-metrics">
          <div>
            <span>Interaction</span>
            <strong className="mono">{fan.interactions}</strong>
            <small>jami faollik</small>
          </div>
          <div>
            <span>Tashriflar</span>
            <strong className="mono">{fan.visits}</strong>
            <small>jami tashrif</small>
          </div>
          <div>
            <span>Mijoz qiymati</span>
            <strong className="mono">{formatMoney(fan.lifetimeValue)}</strong>
            <small>{fan.purchases} ta xarid</small>
          </div>
        </div>

        <section className="org-detail-section crm-score-section">
          <div className="org-detail-section-head">
            <div>
              <h3>Avtomatik faollik hisobi</h3>
              <p>Tashrif 30% · xarid 30% · digital 25% · feedback 15%</p>
            </div>
            <span className={`crm-score-status crm-score-status--${fan.segment}`}>{segment.range}</span>
          </div>
          <div className="crm-score-grid">
            <ScoreBar label="Tashriflar" value={fan.scores.visits} />
            <ScoreBar label="Xaridlar" value={fan.scores.purchases} />
            <ScoreBar label="Raqamli faollik" value={fan.scores.digital} />
            <ScoreBar label="Fikr va baholar" value={fan.scores.feedback} />
          </div>
        </section>

        <section className="org-detail-section">
          <h3>Aloqa ma'lumotlari</h3>
          <div className="org-contact-list crm-contact-list">
            <a href={`tel:${fan.phone.replace(/\s/g, "")}`}>
              <Icon name="phone" /><span>{fan.phone || "Telefon kiritilmagan"}</span>
            </a>
            <a href={`mailto:${fan.email}`}>
              <Icon name="mail" /><span>{fan.email || "Email kiritilmagan"}</span>
            </a>
            <span>
              <Icon name="message" />
              <span>{fan.channel} · {fan.consent ? "marketingga rozilik bor" : "marketingga rozilik yo'q"}</span>
            </span>
          </div>
        </section>

        <section className="org-detail-section">
          <h3>Qiziqishlar</h3>
          <div className="crm-interest-list">
            {fan.interests.length ? fan.interests.map((item) => <span key={item}>{item}</span>) : <span>Belgilanmagan</span>}
          </div>
        </section>

        <section className="org-detail-section">
          <h3>Faollik tarixi</h3>
          <ol className="crm-timeline">
            <li>
              <i aria-hidden="true"><Icon name="pulse" /></i>
              <div><strong>{fan.lastAction}</strong><span>{fan.lastActivity}</span></div>
            </li>
            <li>
              <i aria-hidden="true"><Icon name="wallet" /></i>
              <div><strong>{fan.purchases} ta xarid · {formatMoney(fan.lifetimeValue)}</strong><span>Mijozning umumiy qiymati</span></div>
            </li>
            <li>
              <i aria-hidden="true"><Icon name="calendar" /></i>
              <div><strong>CRM profil yaratildi</strong><span>{fan.joinedAt}</span></div>
            </li>
          </ol>
        </section>
      </div>
    </Drawer>
  );
}
