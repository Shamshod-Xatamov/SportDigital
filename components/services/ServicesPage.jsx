"use client";

import { useCallback, useMemo, useState } from "react";

import { useLegacyRecords } from "@/components/demo/useLegacy";
import LegacyRowActions from "@/components/demo/LegacyRowActions";
import Drawer from "@/components/ui/Drawer";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  SERVICE_FORMATS,
  SERVICE_ORGANIZATIONS,
  SERVICE_STATUSES,
  getServiceCategory,
  getServiceStatus,
} from "@/lib/mock/services";

const PAGE_SIZE = 6;

const CATEGORY_ICONS = {
  training: "activity",
  membership: "card",
  facility: "field",
  events: "ticket",
  coaching: "coach",
  health: "health",
  education: "education",
  equipment: "equipment",
  digital: "digital",
};

const EMPTY_FORM = {
  name: "",
  category: "training",
  organization: SERVICE_ORGANIZATIONS[0],
  format: "Oflayn",
  billing: "Oylik abonement",
  price: "",
  capacity: "",
  status: "active",
  schedule: "",
  description: "",
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
    activity: (
      <>
        <path d="M5 20c2.7-4.5 4.2-8.8 4.5-13M9.5 11l4 2.5 2.5 6M10 7l3-3 3 2" />
        <circle cx="13.5" cy="3.5" r="1.5" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18M7 15h4" />
      </>
    ),
    field: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M12 4v16M3 12h18" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6z" />
        <path d="M12 8v2M12 14v2" />
      </>
    ),
    coach: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M5 21c.6-5 3-7.5 7-7.5S18.4 16 19 21M4 9h3M17 9h3" />
      </>
    ),
    health: (
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    ),
    education: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5z" />
        <path d="M7 12v5c3 2 7 2 10 0v-5M21 9v6" />
      </>
    ),
    equipment: (
      <>
        <path d="M7 8v8M17 8v8M4 10v4M20 10v4M7 12h10" />
        <path d="M2 9v6M22 9v6" />
      </>
    ),
    digital: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h5M8 15h8M8 19h4" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-3.3 2.7-5 5.5-5s5 1.7 5.5 5M15 6.5a3 3 0 0 1 0 5M16 14c2.4.5 4 2.1 4.5 4.5" />
      </>
    ),
    revenue: (
      <>
        <path d="M5 19V9M10 19V5M15 19v-7M20 19V3" />
        <path d="M3 21h19" />
      </>
    ),
    star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />,
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4M17 3v4M3 10h18" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="2.5" />
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

const formatNumber = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const formatPrice = (value) => (value === 0 ? "Bepul" : `${formatNumber(value)} so'm`);

const formatRevenue = (value) => `${String(Number(value.toFixed(1))).replace(".", ",")} mln`;

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

function ServiceStatus({ status }) {
  return (
    <span className={`service-status service-status--${status}`}>
      <i aria-hidden="true"></i>
      {getServiceStatus(status).label}
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

function Rating({ value, reviews, compact = false }) {
  if (!reviews) return <span className="service-new-label">Yangi</span>;
  return (
    <span className={`service-rating${compact ? " is-compact" : ""}`}>
      <Icon name="star" />
      <strong className="mono">{String(value).replace(".", ",")}</strong>
      {!compact ? <small>{reviews} ta baho</small> : null}
    </span>
  );
}

function ServiceCard({ service, onOpen }) {
  const category = getServiceCategory(service.category);
  return (
    <article className="service-card">
      <header className="service-card-head">
        <span className="service-card-category">
          <i>
            <Icon name={CATEGORY_ICONS[service.category]} />
          </i>
          {category.shortLabel}
        </span>
        <ServiceStatus status={service.status} />
      </header>

      <button type="button" className="service-card-title" onClick={() => onOpen(service)}>
        <span className="mono">{service.code}</span>
        <h3>{service.name}</h3>
        <p>{service.organization}</p>
      </button>

      <div className="service-price-row">
        <div>
          <span>Narxi</span>
          <strong className="mono">{formatPrice(service.price)}</strong>
          <small>{service.billing}</small>
        </div>
        <span className="service-format">{service.format}</span>
      </div>

      <div className="service-card-metrics">
        <div>
          <span>Foydalanish</span>
          <strong className="mono">{formatNumber(service.monthlyUses)}</strong>
          <small>oylik</small>
        </div>
        <div>
          <span>Daromad</span>
          <strong className="mono">{formatRevenue(service.monthlyRevenue)}</strong>
          <small>oylik</small>
        </div>
        <div>
          <span>Baho</span>
          <Rating value={service.rating} reviews={service.reviews} compact />
          <small>{service.reviews ? `${service.reviews} fikr` : "hali yo'q"}</small>
        </div>
      </div>

      <div className="service-occupancy">
        <div>
          <span>Bandlik darajasi</span>
          <strong className="mono">{service.occupancy}%</strong>
        </div>
        <span role="img" aria-label={`Bandlik darajasi ${service.occupancy} foiz`}>
          <i style={{ width: `${service.occupancy}%` }}></i>
        </span>
      </div>

      <footer className="service-card-foot">
        <span>{service.updatedAt}</span>
        <button type="button" onClick={() => onOpen(service)}>
          Batafsil
          <Icon name="arrow" />
        </button>
      </footer>
    </article>
  );
}

export default function ServicesPage() {
  const { rows: services, save: saveRecord, canEdit, organization: currentOrganization } = useLegacyRecords("services");
  const [formError, setFormError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("all");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const closeDetail = useCallback(() => setSelected(null), []);
  const closeForm = useCallback(() => setFormOpen(false), []);

  const summary = useMemo(() => {
    const available = services.filter((service) => ["active", "limited"].includes(service.status)).length;
    const monthlyUses = services.reduce((total, service) => total + service.monthlyUses, 0);
    const monthlyRevenue = services.reduce((total, service) => total + service.monthlyRevenue, 0);
    const rated = services.filter((service) => service.reviews > 0);
    const averageRating = rated.reduce((total, service) => total + service.rating, 0) / (rated.length || 1);
    return { available, monthlyUses, monthlyRevenue, averageRating };
  }, [services]);

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        SERVICE_CATEGORIES.map((item) => [
          item.id,
          services.filter((service) => service.category === item.id).length,
        ]),
      ),
    [services],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    const rows = services.filter((service) => {
      const haystack = normalizeText(
        `${service.name} ${service.code} ${service.organization} ${service.location}`,
      );
      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (category !== "all" && service.category !== category) return false;
      if (status !== "all" && service.status !== status) return false;
      if (format !== "all" && service.format !== format) return false;
      return true;
    });

    return [...rows].sort((left, right) => {
      if (sort === "revenue") return right.monthlyRevenue - left.monthlyRevenue;
      if (sort === "rating") return right.rating - left.rating;
      if (sort === "price") return left.price - right.price;
      if (sort === "name") return compareText(left.name, right.name);
      return right.monthlyUses - left.monthlyUses;
    });
  }, [services, query, category, status, format, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const filtersActive =
    query.trim() || category !== "all" || status !== "all" || format !== "all";

  const selectCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  const setFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setStatus("all");
    setFormat("all");
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

  const createService = (event) => {
    event.preventDefault();
    const nextNumber = services.length + 1;
    const next = {
      id: `srv-custom-${nextNumber}`,
      code: `YX-${String(nextNumber).padStart(3, "0")}`,
      name: form.name.trim(),
      category: form.category,
      organization: form.organization,
      location: form.format === "Onlayn" ? "Onlayn" : "Manzil belgilanmagan",
      format: form.format,
      billing: form.billing,
      price: Number(form.price) || 0,
      monthlyUses: 0,
      monthlyRevenue: 0,
      rating: 0,
      reviews: 0,
      capacity: Number(form.capacity) || 0,
      occupancy: 0,
      status: form.status,
      schedule: form.schedule.trim() || "Jadval belgilanmagan",
      description: form.description.trim() || "Xizmat tavsifi kiritilmagan.",
      updatedAt: "Hozirgina",
    };
    next.id = form.id || crypto.randomUUID();
    try { saveRecord(next); } catch (error) { setFormError(error.message); return; }
    setFormOpen(false);
    setSelected(next);
  };

  return (
    <div className="services-page">
      <header className="org-page-head">
        <div>
          <span className="org-eyebrow">Xizmatlar boshqaruvi</span>
          <h1>Sport xizmatlari</h1>
          <p>Narxlar, foydalanish, daromad va mijozlar bahosini yagona katalogda boshqaring.</p>
        </div>
        <button type="button" className="org-primary-button" onClick={openCreate} disabled={!canEdit} title={!canEdit ? "Bu amal uchun administrator huquqi kerak" : undefined}>
          <Icon name="plus" />
          Xizmat qo'shish
        </button>
      </header>

      <section className="org-summary-grid" aria-label="Sport xizmatlari umumiy ko'rsatkichlari">
        <SummaryCard
          icon="layers"
          label="Jami xizmatlar"
          value={services.length}
          note={`${summary.available} ta foydalanish mumkin`}
        />
        <SummaryCard
          icon="users"
          label="Oylik foydalanish"
          value={formatNumber(summary.monthlyUses)}
          note="buyurtma va tashriflar"
        />
        <SummaryCard
          icon="revenue"
          label="Xizmatlar daromadi"
          value={formatRevenue(summary.monthlyRevenue)}
          note="joriy oy natijasi"
        />
        <SummaryCard
          icon="star"
          label="O'rtacha baho"
          value={String(summary.averageRating.toFixed(1)).replace(".", ",")}
          note="mijozlar fikri asosida"
        />
      </section>

      <section className="service-category-panel" aria-labelledby="service-groups-title">
        <header>
          <div>
            <h2 id="service-groups-title">Xizmat guruhlari</h2>
            <p>TZ bo'yicha 9 ta asosiy xizmat yo'nalishi</p>
          </div>
          <span className="mono">9 guruh</span>
        </header>
        <div className="service-category-list" aria-label="Xizmat guruhlari filtri">
          <button
            type="button"
            className={category === "all" ? "is-active" : ""}
            aria-pressed={category === "all"}
            onClick={() => selectCategory("all")}
          >
            <i>
              <Icon name="layers" />
            </i>
            <span>
              <strong>Barchasi</strong>
              <small>{services.length} ta</small>
            </span>
          </button>
          {SERVICE_CATEGORIES.map((item) => (
            <button
              type="button"
              key={item.id}
              className={category === item.id ? "is-active" : ""}
              aria-pressed={category === item.id}
              onClick={() => selectCategory(item.id)}
            >
              <i>
                <Icon name={CATEGORY_ICONS[item.id]} />
              </i>
              <span>
                <strong>{item.shortLabel}</strong>
                <small>{categoryCounts[item.id]} ta</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="service-catalog">
        <header className="service-catalog-head">
          <div className="service-catalog-title">
            <div>
              <h2>Xizmatlar katalogi</h2>
              <p>
                <strong className="mono">{filtered.length}</strong> ta xizmat ko'rsatilmoqda
              </p>
            </div>
            {category !== "all" ? (
              <span className="service-active-filter">
                {getServiceCategory(category).label}
                <button type="button" aria-label="Guruh filtrini tozalash" onClick={() => selectCategory("all")}>
                  ×
                </button>
              </span>
            ) : null}
          </div>

          <div className="service-toolbar">
            <label className="org-search service-search">
              <span className="sr-only">Xizmatni qidirish</span>
              <Icon name="search" />
              <input
                type="search"
                placeholder="Xizmat, kod yoki tashkilot bo'yicha qidirish"
                value={query}
                onChange={(event) => setFilter(setQuery, event.target.value)}
              />
            </label>

            <label className="org-filter">
              <span>Holati</span>
              <select value={status} onChange={(event) => setFilter(setStatus, event.target.value)}>
                <option value="all">Barcha holatlar</option>
                {SERVICE_STATUSES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="org-filter">
              <span>Format</span>
              <select value={format} onChange={(event) => setFilter(setFormat, event.target.value)}>
                <option value="all">Barcha formatlar</option>
                {SERVICE_FORMATS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="org-filter service-sort-filter">
              <span>Saralash</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="popular">Eng ko'p foydalanilgan</option>
                <option value="revenue">Daromad bo'yicha</option>
                <option value="rating">Baho bo'yicha</option>
                <option value="price">Narxi bo'yicha</option>
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

        {visible.length ? (
          <div className="service-grid">
            {visible.map((service) => (
              <ServiceCard key={service.id} service={service} onOpen={setSelected} />
            ))}
          </div>
        ) : (
          <div className="org-empty">
            <span>
              <Icon name="search" />
            </span>
            <h3>Xizmat topilmadi</h3>
            <p>Qidiruv matni yoki tanlangan filterlarni o'zgartirib ko'ring.</p>
            <button type="button" onClick={clearFilters}>
              Filterlarni tozalash
            </button>
          </div>
        )}

        {filtered.length > 0 ? (
          <footer className="org-registry-footer service-catalog-footer">
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

      <ServiceDetail service={selected} onClose={closeDetail} actions={canEdit && selected ? <LegacyRowActions collection="services" row={selected} onEdit={row => { setForm({ ...row }); setSelected(null); setFormError(''); setFormOpen(true); }} /> : null} />

      <Drawer
        open={formOpen}
        onClose={closeForm}
        title={form.id ? "Xizmatni tahrirlash" : "Yangi xizmat"}
        subtitle="Katalog uchun asosiy ma'lumotlarni kiriting"
        size="wide"
        icon={<Icon name="layers" />}
        footer={
          <>
            <button type="button" className="org-secondary-button" onClick={closeForm}>
              Bekor qilish
            </button>
            <button type="submit" form="service-create-form" className="org-primary-button">
              Xizmatni yaratish
            </button>
          </>
        }
      >
        <form id="service-create-form" className="org-form" onSubmit={createService}>
          {formError && <p className="demo-warning" role="alert">{formError}</p>}
          <div className="org-form-section">
            <h3>Asosiy ma'lumotlar</h3>
            <p>Xizmat nomi, guruhi va uni taqdim etuvchi tashkilot.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field org-form-field--wide">
              <span>Xizmat nomi</span>
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="Masalan, Yoshlar uchun suzish guruhi"
                required
                autoFocus
              />
            </label>
            <label className="org-form-field">
              <span>Xizmat guruhi</span>
              <select name="category" value={form.category} onChange={updateForm}>
                {SERVICE_CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Tashkilot</span>
              <select name="organization" value={form.organization} onChange={updateForm}>
                {[currentOrganization.name].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Format</span>
              <select name="format" value={form.format} onChange={updateForm}>
                {SERVICE_FORMATS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="org-form-field">
              <span>Holati</span>
              <select name="status" value={form.status} onChange={updateForm}>
                {SERVICE_STATUSES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="org-form-section">
            <h3>Narx va sig'im</h3>
            <p>Xizmatning hisoblash turi, narxi va oylik reja sig'imi.</p>
          </div>
          <div className="org-form-grid">
            <label className="org-form-field">
              <span>Hisoblash turi</span>
              <select name="billing" value={form.billing} onChange={updateForm}>
                <option>Oylik abonement</option>
                <option>Bir martalik</option>
                <option>Bir mashg'ulot</option>
                <option>Soatlik</option>
                <option>Kurs uchun</option>
              </select>
            </label>
            <label className="org-form-field">
              <span>Narxi, so'm</span>
              <input
                name="price"
                type="number"
                min="0"
                step="1000"
                value={form.price}
                onChange={updateForm}
                placeholder="450000"
                required
              />
            </label>
            <label className="org-form-field">
              <span>Oylik sig'im</span>
              <input
                name="capacity"
                type="number"
                min="0"
                value={form.capacity}
                onChange={updateForm}
                placeholder="300"
              />
            </label>
            <label className="org-form-field">
              <span>Ish jadvali</span>
              <input
                name="schedule"
                value={form.schedule}
                onChange={updateForm}
                placeholder="Du–Sh, 09:00–20:00"
              />
            </label>
            <label className="org-form-field org-form-field--wide service-form-field">
              <span>Qisqa tavsif</span>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={updateForm}
                placeholder="Xizmat tarkibi va foydalanuvchi oladigan qiymat..."
              ></textarea>
            </label>
          </div>
        </form>
      </Drawer>
    </div>
  );
}

function ServiceDetail({ service, onClose, actions }) {
  if (!service) return null;
  const category = getServiceCategory(service.category);

  return (
    <Drawer
      open={Boolean(service)}
      onClose={onClose}
      title={service.name}
      subtitle={`${service.code} · ${category.label}`}
      size="medium"
      icon={<Icon name={CATEGORY_ICONS[service.category]} />}
      footer={<>
        {actions}
        <button type="button" className="org-secondary-button" onClick={onClose}>
          Yopish
        </button></>
      }
    >
      <div className="service-detail">
        <div className="service-detail-intro">
          <div>
            <ServiceStatus status={service.status} />
            <span className="service-format">{service.format}</span>
          </div>
          <h3>{service.organization}</h3>
          <p>{service.description}</p>
        </div>

        <div className="org-detail-metrics service-detail-metrics">
          <div>
            <span>Narxi</span>
            <strong className="mono">{formatPrice(service.price)}</strong>
            <small>{service.billing}</small>
          </div>
          <div>
            <span>Foydalanish</span>
            <strong className="mono">{formatNumber(service.monthlyUses)}</strong>
            <small>joriy oy</small>
          </div>
          <div>
            <span>Daromad</span>
            <strong className="mono">{formatRevenue(service.monthlyRevenue)}</strong>
            <small>joriy oy</small>
          </div>
        </div>

        <section className="org-detail-section">
          <div className="org-detail-section-head">
            <h3>Bandlik darajasi</h3>
            <strong className="mono service-detail-percent">{service.occupancy}%</strong>
          </div>
          <div className="org-detail-progress" aria-label={`Bandlik darajasi ${service.occupancy} foiz`}>
            <span style={{ width: `${service.occupancy}%` }}></span>
          </div>
          <p>
            Oylik sig'im: <strong>{formatNumber(service.capacity)} ta</strong> · oxirgi yangilanish{" "}
            {service.updatedAt.toLowerCase()}.
          </p>
        </section>

        <section className="service-detail-rating">
          <div>
            <span>Mijozlar bahosi</span>
            <Rating value={service.rating} reviews={service.reviews} />
          </div>
          <div className="service-stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Icon key={index} name="star" />
            ))}
          </div>
        </section>

        <section className="org-detail-section">
          <h3>Xizmat ma'lumotlari</h3>
          <dl className="org-detail-list service-detail-list">
            <div>
              <dt>Xizmat guruhi</dt>
              <dd>{category.label}</dd>
            </div>
            <div>
              <dt>Tashkilot</dt>
              <dd>{service.organization}</dd>
            </div>
            <div>
              <dt>Manzil</dt>
              <dd>{service.location}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{service.format}</dd>
            </div>
            <div>
              <dt>Hisoblash</dt>
              <dd>{service.billing}</dd>
            </div>
            <div>
              <dt>Ish jadvali</dt>
              <dd>{service.schedule}</dd>
            </div>
          </dl>
        </section>

        <div className="service-detail-notes">
          <span>
            <Icon name="calendar" />
          </span>
          <div>
            <strong>Bronlash va jadval</strong>
            <p>Real bronlash tizimi backend integratsiyasi bilan keyingi bosqichda ulanadi.</p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
