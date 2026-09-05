"use client";

import { useCallback, useMemo, useState } from "react";

import { useLegacyRecords } from "@/components/demo/useLegacy";
import LegacyRowActions from "@/components/demo/LegacyRowActions";
import Drawer from "@/components/ui/Drawer";
import {
  ORGANIZATIONS,
  ORGANIZATION_CATEGORIES,
  ORGANIZATION_STATUSES,
  REGION_OPTIONS,
  getCategoryLabel,
  getStatusLabel,
} from "@/lib/mock/organizations";

const PAGE_SIZE = 8;

const EMPTY_FORM = {
  name: "",
  shortName: "",
  category: "club",
  ownership: "Xususiy",
  region: "Toshkent shahri",
  district: "",
  address: "",
  leader: "",
  phone: "",
  email: "",
  website: "",
};

function Icon({ name }) {
  const paths = {
    building: (
      <>
        <path d="M5 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M3 21h18" />
        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    map: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    pulse: (
      <>
        <path d="M4 12h3l2-5 4 10 2-5h5" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5M15 6.5a3 3 0 0 1 0 5M16 14c2.4.5 4 2.1 4.5 4.5" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    phone: (
      <path d="M7.2 3.5 4.5 5c-.8.4-.9 1.2-.6 2C6.2 13.3 10.7 17.8 17 20.1c.8.3 1.6.2 2-.6l1.5-2.7-4.2-2-1.2 1.8c-2.9-1.3-5.4-3.8-6.7-6.7l1.8-1.2-2-4.2z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.4 2.5 3.7 5.5 3.7 9S14.4 18.5 12 21M12 3C9.6 5.5 8.3 8.5 8.3 12s1.3 6.5 3.7 9" />
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
      {paths[name]}
    </svg>
  );
}

const formatNumber = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

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

const getInitials = (organization) =>
  organization.shortName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

const getDriBand = (value) => {
  if (value >= 81) return { label: "Juda yuqori", tone: "very-high" };
  if (value >= 61) return { label: "Yuqori", tone: "high" };
  if (value >= 41) return { label: "O'rta", tone: "medium" };
  if (value >= 21) return { label: "Past", tone: "low" };
  return { label: "Juda past", tone: "critical" };
};

function StatusBadge({ status }) {
  return (
    <span className={`org-status org-status--${status}`}>
      <i aria-hidden="true"></i>
      {getStatusLabel(status)}
    </span>
  );
}

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

function ScoreMeter({ value, suffix = "", label }) {
  return (
    <div className="org-score">
      <div>
        <strong className="mono">
          {value}
          {suffix}
        </strong>
        {label ? <small>{label}</small> : null}
      </div>
      <span aria-hidden="true">
        <i style={{ width: `${Math.min(value, 100)}%` }}></i>
      </span>
    </div>
  );
}

export default function OrganizationsPage() {
  const { rows: organizations, save: saveRecord, canEdit, organization: currentOrganization } = useLegacyRecords("organizations");
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const closeDetail = useCallback(() => setSelected(null), []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const summary = useMemo(() => {
    const active = organizations.filter((organization) => organization.status === "active").length;
    const averageDri = Math.round(
      organizations.reduce((total, organization) => total + organization.dri, 0) /
        (organizations.length || 1),
    );
    const regions = new Set(organizations.map((organization) => organization.region)).size;
    return { active, averageDri, regions };
  }, [organizations]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const rows = organizations.filter((organization) => {
      const haystack = normalizeText(
        `${organization.name} ${organization.shortName} ${organization.region} ${organization.leader}`,
      );
      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (category !== "all" && organization.category !== category) return false;
      if (status !== "all" && organization.status !== status) return false;
      if (region !== "all" && organization.region !== region) return false;
      return true;
    });

    return [...rows].sort((a, b) => {
      if (sort === "dri") return b.dri - a.dri;
      if (sort === "users") return b.users - a.users;
      if (sort === "digital") return b.digitalShare - a.digitalShare;
      return compareText(a.name, b.name);
    });
  }, [organizations, query, category, status, region, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const filtersActive =
    query.trim() || category !== "all" || status !== "all" || region !== "all";

  const setFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
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

  const createOrganization = (event) => {
    event.preventDefault();
    const next = {
      ...form,
      id: `org-${Date.now()}`,
      name: form.name.trim(),
      shortName: form.shortName.trim() || form.name.trim(),
      establishedYear: new Date().getFullYear(),
      employees: 0,
      services: 0,
      users: 0,
      dri: 0,
      digitalShare: 0,
      monthlyRevenue: 0,
      status: "onboarding",
      updatedAt: "Hozirgina",
    };
    next.id = form.id || crypto.randomUUID();
    try { saveRecord(next); } catch (error) { setFormError(error.message); return; }
    setFormOpen(false);
    setSelected(next);
  };

  return (
    <div className="organizations-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Boshqaruv</span>
          <h1>Tashkilotlar</h1>
          <p>Sport tashkilotlari, ularning faoliyati va raqamli rivojlanish holati.</p>
        </div>
        <button type="button" className="org-primary-button" onClick={openCreate} disabled={!canEdit} title={!canEdit ? "Bu amal uchun administrator huquqi kerak" : undefined}>
          <Icon name="plus" />
          Tashkilot qo'shish
        </button>
      </header>

      <section className="org-summary-grid" aria-label="Tashkilotlar umumiy ko'rsatkichlari">
        <SummaryCard
          icon="building"
          label="Jami tashkilotlar"
          value={organizations.length}
          note="yagona reyestrda"
        />
        <SummaryCard
          icon="pulse"
          label="Faol tashkilotlar"
          value={summary.active}
          note={`${Math.round((summary.active / organizations.length) * 100)}% faol holatda`}
        />
        <SummaryCard
          icon="users"
          label="O'rtacha DRI"
          value={summary.averageDri}
          note="100 ballik indeks"
        />
        <SummaryCard
          icon="map"
          label="Hududlar qamrovi"
          value={summary.regions}
          note="viloyat va shahar"
        />
      </section>

      <section className="org-registry">
        <header className="org-registry-head">
          <div>
            <h2>Tashkilotlar reyestri</h2>
            <p>
              <strong className="mono">{filtered.length}</strong> ta tashkilot ko'rsatilmoqda
            </p>
          </div>

          <div className="org-toolbar">
            <label className="org-search">
              <span className="sr-only">Tashkilotni qidirish</span>
              <Icon name="search" />
              <input
                type="search"
                placeholder="Nom yoki hudud bo'yicha qidirish"
                value={query}
                onChange={(event) => setFilter(setQuery, event.target.value)}
              />
            </label>

            <label className="org-filter">
              <span>Toifa</span>
              <select value={category} onChange={(event) => setFilter(setCategory, event.target.value)}>
                <option value="all">Barcha toifalar</option>
                {ORGANIZATION_CATEGORIES.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>Holat</span>
              <select value={status} onChange={(event) => setFilter(setStatus, event.target.value)}>
                <option value="all">Barcha holatlar</option>
                {ORGANIZATION_STATUSES.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>Hudud</span>
              <select value={region} onChange={(event) => setFilter(setRegion, event.target.value)}>
                <option value="all">Barcha hududlar</option>
                {REGION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="org-filter org-filter--sort">
              <span>Saralash</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="name">Nomi bo'yicha</option>
                <option value="dri">DRI bo'yicha</option>
                <option value="users">Foydalanuvchilar</option>
                <option value="digital">Raqamli ulush</option>
              </select>
            </label>

            {filtersActive ? (
              <button type="button" className="org-clear-button" onClick={clearFilters}>
                Tozalash
              </button>
            ) : null}
          </div>
        </header>

        <div className="org-table-scroll">
          <table className="org-table">
            <thead>
              <tr>
                <th scope="col">Tashkilot</th>
                <th scope="col">Toifa va hudud</th>
                <th scope="col">Foydalanuvchilar</th>
                <th scope="col">DRI</th>
                <th scope="col">Raqamli ulush</th>
                <th scope="col">Holati</th>
                <th scope="col">Yangilangan</th>
                <th scope="col">
                  <span className="sr-only">Ko'rish</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((organization) => {
                const driBand = getDriBand(organization.dri);
                return (
                  <tr key={organization.id}>
                    <td className="org-cell-primary">
                      <button type="button" onClick={() => setSelected(organization)}>
                        <span className="org-avatar mono">{getInitials(organization)}</span>
                        <span>
                          <strong>{organization.name}</strong>
                          <small>{organization.shortName}</small>
                        </span>
                      </button>
                    </td>
                    <td className="org-cell-category">
                      <strong>{getCategoryLabel(organization.category)}</strong>
                      <small>{organization.region}</small>
                    </td>
                    <td className="mono org-cell-users" data-label="Foydalanuvchi">
                      {formatNumber(organization.users)}
                    </td>
                    <td data-label="DRI">
                      <ScoreMeter value={organization.dri} label={driBand.label} />
                    </td>
                    <td data-label="Raqamli ulush">
                      <ScoreMeter value={organization.digitalShare} suffix="%" />
                    </td>
                    <td data-label="Holati">
                      <StatusBadge status={organization.status} />
                    </td>
                    <td className="org-cell-updated" data-label="Yangilangan">
                      {organization.updatedAt}
                    </td>
                    <td className="org-cell-action">
                      {!canEdit && <button
                        type="button"
                        aria-label={`${organization.name} ma'lumotlarini ko'rish`}
                        onClick={() => setSelected(organization)}
                      >
                        <Icon name="arrow" />
                      </button>}
                      {canEdit && <LegacyRowActions onView={() => setSelected(organization)} collection="organizations" row={organization} onEdit={row => { setForm({ ...row }); setSelected(null); setFormError(''); setFormOpen(true); }} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {visible.length === 0 ? (
            <div className="org-empty">
              <span>
                <Icon name="search" />
              </span>
              <h3>Natija topilmadi</h3>
              <p>Qidiruv matni yoki filterlarni o'zgartirib ko'ring.</p>
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

      <OrganizationDetail organization={selected} onClose={closeDetail} />

      <Drawer
        open={formOpen}
        onClose={closeForm}
        title="Yangi tashkilot"
        subtitle="Reyestr uchun asosiy ma'lumotlarni kiriting"
        size="wide"
        icon={<Icon name="building" />}
        footer={
          <>
            <button type="button" className="org-secondary-button" onClick={closeForm}>
              Bekor qilish
            </button>
            <button type="submit" form="organization-create-form" className="org-primary-button">
              Tashkilotni yaratish
            </button>
          </>
        }
      >
        <form id="organization-create-form" className="org-form" onSubmit={createOrganization}>
          {formError && <p className="demo-warning" role="alert">{formError}</p>}
          <div className="org-form-section">
            <h3>Asosiy ma'lumotlar</h3>
            <p>Tashkilotning reyestrda ko'rinadigan nomi va toifasi.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field org-form-field--wide">
              <span>Tashkilot nomi</span>
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="Masalan, Olimp sport klubi"
                required
                autoFocus
              />
            </label>
            <label className="org-form-field">
              <span>Qisqa nomi</span>
              <input name="shortName" value={form.shortName} onChange={updateForm} placeholder="Olimp SK" />
            </label>
            <label className="org-form-field">
              <span>Toifasi</span>
              <select name="category" value={form.category} onChange={updateForm}>
                {ORGANIZATION_CATEGORIES.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Mulkchilik shakli</span>
              <select name="ownership" value={form.ownership} onChange={updateForm}>
                <option>Xususiy</option>
                <option>Davlat</option>
                <option>Jamoat tashkiloti</option>
                <option>Davlat-xususiy sheriklik</option>
              </select>
            </label>
            <label className="org-form-field">
              <span>Hudud</span>
              <select name="region" value={form.region} onChange={updateForm}>
                {REGION_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Tuman yoki shahar</span>
              <input name="district" value={form.district} onChange={updateForm} placeholder="Chilonzor tumani" />
            </label>
            <label className="org-form-field">
              <span>Rahbar</span>
              <input name="leader" value={form.leader} onChange={updateForm} placeholder="F.I.Sh." />
            </label>
            <label className="org-form-field org-form-field--wide">
              <span>Manzil</span>
              <input name="address" value={form.address} onChange={updateForm} placeholder="Ko'cha, uy raqami" />
            </label>
          </div>

          <div className="org-form-section">
            <h3>Aloqa ma'lumotlari</h3>
            <p>Tashkilot administratori bilan bog'lanish uchun.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field">
              <span>Telefon</span>
              <input name="phone" value={form.phone} onChange={updateForm} placeholder="+998 90 000 00 00" />
            </label>
            <label className="org-form-field">
              <span>Elektron pochta</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateForm}
                placeholder="info@tashkilot.uz"
              />
            </label>
            <label className="org-form-field org-form-field--wide">
              <span>Veb-sayt</span>
              <input name="website" value={form.website} onChange={updateForm} placeholder="tashkilot.uz" />
            </label>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

function OrganizationDetail({ organization, onClose }) {
  if (!organization) return null;
  const driBand = getDriBand(organization.dri);

  return (
    <Drawer
      open={Boolean(organization)}
      onClose={onClose}
      title={organization.name}
      subtitle={`${getCategoryLabel(organization.category)} · ${organization.region}`}
      size="medium"
      icon={<Icon name="building" />}
      footer={
        <button type="button" className="org-secondary-button" onClick={onClose}>
          Yopish
        </button>
      }
    >
      <div className="org-detail">
        <div className="org-detail-identity">
          <span className="org-detail-avatar mono">{getInitials(organization)}</span>
          <div>
            <StatusBadge status={organization.status} />
            <h3>{organization.shortName}</h3>
            <p>{organization.ownership}</p>
          </div>
        </div>

        <div className="org-detail-metrics">
          <div>
            <span>DRI indeksi</span>
            <strong className="mono">{organization.dri}</strong>
            <small>{driBand.label}</small>
          </div>
          <div>
            <span>Raqamli ulush</span>
            <strong className="mono">{organization.digitalShare}%</strong>
            <small>daromadda</small>
          </div>
          <div>
            <span>Foydalanuvchilar</span>
            <strong className="mono">{formatNumber(organization.users)}</strong>
            <small>faol profil</small>
          </div>
        </div>

        <section className="org-detail-section">
          <div className="org-detail-section-head">
            <h3>Raqamli rivojlanish</h3>
            <span className={`org-dri-label org-dri-label--${driBand.tone}`}>{driBand.label}</span>
          </div>
          <div className="org-detail-progress" aria-label={`DRI indeksi ${organization.dri} ball`}>
            <span style={{ width: `${organization.dri}%` }}></span>
          </div>
          <p>12 indikator bo'yicha vaznli baholash · oxirgi yangilanish {organization.updatedAt.toLowerCase()}.</p>
        </section>

        <section className="org-detail-section">
          <h3>Tashkilot ma'lumotlari</h3>
          <dl className="org-detail-list">
            <div>
              <dt>Rahbar</dt>
              <dd>{organization.leader || "Kiritilmagan"}</dd>
            </div>
            <div>
              <dt>Hudud</dt>
              <dd>
                {organization.region}
                {organization.district ? ` · ${organization.district}` : ""}
              </dd>
            </div>
            <div>
              <dt>Manzil</dt>
              <dd>{organization.address || "Kiritilmagan"}</dd>
            </div>
            <div>
              <dt>Tashkil etilgan</dt>
              <dd>{organization.establishedYear}-yil</dd>
            </div>
            <div>
              <dt>Xodimlar</dt>
              <dd>{formatNumber(organization.employees)} nafar</dd>
            </div>
            <div>
              <dt>Xizmatlar</dt>
              <dd>{organization.services} ta</dd>
            </div>
          </dl>
        </section>

        <section className="org-detail-section">
          <h3>Aloqa</h3>
          <div className="org-contact-list">
            <a href={`tel:${organization.phone.replace(/\s/g, "")}`}>
              <Icon name="phone" />
              <span>{organization.phone || "Telefon kiritilmagan"}</span>
            </a>
            <a href={`mailto:${organization.email}`}>
              <Icon name="mail" />
              <span>{organization.email || "Email kiritilmagan"}</span>
            </a>
            <span>
              <Icon name="globe" />
              <span>{organization.website || "Veb-sayt kiritilmagan"}</span>
            </span>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
