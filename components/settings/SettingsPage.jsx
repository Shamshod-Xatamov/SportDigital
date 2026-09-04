"use client";

import { useCallback, useState } from "react";

import Drawer from "@/components/ui/Drawer";
import {
  ACTIVE_SESSIONS,
  DEFAULT_SETTINGS,
  INTEGRATION_OPTIONS,
  NOTIFICATION_OPTIONS,
  SETTINGS_TABS,
} from "@/lib/mock/settings";

function Icon({ name }) {
  const icons = {
    organization: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.7 3 8 7.5 9.5 4.5-1.5 7.5-4.8 7.5-9.5V6L12 3z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    plug: (
      <>
        <path d="m8 12 8-8M14 4l6 6M4 14l6 6M12 12l-2.5 2.5" />
        <path d="M6.5 17.5 3 21" />
      </>
    ),
    check: <path d="m5 12.5 4.3 4.2L19 7" />,
    undo: (
      <>
        <path d="M4 8h10a6 6 0 1 1 0 12h-2" />
        <path d="m8 4-4 4 4 4" />
      </>
    ),
    save: (
      <>
        <path d="M5 3h12l3 3v15H4V4a1 1 0 0 1 1-1z" />
        <path d="M8 3v6h8V3M8 21v-7h8v7" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.3 2.5 3.5 5.5 3.5 9S14.3 18.5 12 21M12 3c-2.3 2.5-3.5 5.5-3.5 9S9.7 18.5 12 21" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    key: (
      <>
        <circle cx="8" cy="12" r="4" />
        <path d="M12 12h9M17 12v3M20 12v2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    audit: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </>
    ),
    desktop: (
      <>
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
    mobile: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    logout: (
      <>
        <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
        <path d="M10 12h10M16.5 8.5 20 12l-3.5 3.5" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
        <circle cx="12" cy="12" r="2.7" />
      </>
    ),
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

const cloneSettings = (value) => JSON.parse(JSON.stringify(value));

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      className={`settings-toggle${checked ? " is-on" : ""}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span></span>
    </button>
  );
}

function SettingsCardHeader({ icon, title, description, aside }) {
  return (
    <header className="settings-card-head">
      <div>
        <span className="settings-card-icon"><Icon name={icon} /></span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {aside}
    </header>
  );
}

function GeneralSettings({ values, update }) {
  const organization = values.organization;
  const localization = values.localization;

  return (
    <div className="settings-panel-stack">
      <section className="settings-card">
        <SettingsCardHeader
          icon="organization"
          title="Tashkilot profili"
          description="Platforma bo'ylab ko'rinadigan asosiy tashkilot ma'lumotlari."
          aside={<span className="settings-verified"><Icon name="check" /> Tasdiqlangan</span>}
        />

        <div className="settings-profile-strip">
          <span className="settings-org-avatar mono">OS</span>
          <div>
            <strong>{organization.name}</strong>
            <span>Professional sport klubi · Toshkent</span>
          </div>
          <label className="settings-upload-button">
            Logotipni almashtirish
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) update("organization", "logoFile", file.name);
              }}
            />
          </label>
        </div>

        {organization.logoFile ? (
          <p className="settings-file-note" role="status">
            <Icon name="check" /> {organization.logoFile} saqlash uchun tayyor.
          </p>
        ) : null}

        <div className="settings-form-grid">
          <label className="settings-field">
            <span>Tashkilot nomi</span>
            <input value={organization.name} onChange={(event) => update("organization", "name", event.target.value)} />
          </label>
          <label className="settings-field">
            <span>Qisqa nomi</span>
            <input value={organization.shortName} onChange={(event) => update("organization", "shortName", event.target.value)} />
          </label>
          <label className="settings-field">
            <span>Tashkilot turi</span>
            <select value={organization.category} onChange={(event) => update("organization", "category", event.target.value)}>
              <option>Professional sport klubi</option>
              <option>Sport federatsiyasi</option>
              <option>Sport maktabi</option>
              <option>Fitness markazi</option>
            </select>
          </label>
          <label className="settings-field">
            <span>STIR</span>
            <input className="mono" value={organization.taxId} onChange={(event) => update("organization", "taxId", event.target.value)} />
          </label>
          <label className="settings-field">
            <span>Elektron pochta</span>
            <input type="email" value={organization.email} onChange={(event) => update("organization", "email", event.target.value)} />
          </label>
          <label className="settings-field">
            <span>Telefon raqami</span>
            <input value={organization.phone} onChange={(event) => update("organization", "phone", event.target.value)} />
          </label>
          <label className="settings-field settings-field--wide">
            <span>Veb-sayt</span>
            <input type="url" value={organization.website} onChange={(event) => update("organization", "website", event.target.value)} />
          </label>
          <label className="settings-field settings-field--wide">
            <span>Yuridik manzil</span>
            <input value={organization.address} onChange={(event) => update("organization", "address", event.target.value)} />
          </label>
        </div>
      </section>

      <section className="settings-card">
        <SettingsCardHeader
          icon="globe"
          title="Til va hudud"
          description="Hisobotlar, raqamlar va sanalar ko'rinishini moslashtiring."
        />
        <div className="settings-form-grid settings-form-grid--locale">
          <label className="settings-field">
            <span>Asosiy til</span>
            <select value={localization.language} onChange={(event) => update("localization", "language", event.target.value)}>
              <option value="uz">O'zbek tili</option>
              <option value="ru">Русский язык</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className="settings-field">
            <span>Vaqt mintaqasi</span>
            <select value={localization.timezone} onChange={(event) => update("localization", "timezone", event.target.value)}>
              <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
              <option value="Asia/Samarkand">Asia/Samarkand (UTC+5)</option>
            </select>
          </label>
          <label className="settings-field">
            <span>Valyuta</span>
            <select value={localization.currency} onChange={(event) => update("localization", "currency", event.target.value)}>
              <option value="UZS">UZS — O'zbek so'mi</option>
              <option value="USD">USD — AQSh dollari</option>
            </select>
          </label>
          <label className="settings-field">
            <span>Sana formati</span>
            <select value={localization.dateFormat} onChange={(event) => update("localization", "dateFormat", event.target.value)}>
              <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}

function NotificationSettings({ values, update }) {
  const notifications = values.notifications;

  return (
    <div className="settings-panel-stack">
      <section className="settings-card">
        <SettingsCardHeader
          icon="mail"
          title="Yetkazib berish sozlamalari"
          description="Hisobotlar qayerga va qanchalik tez-tez yuborilishini belgilang."
        />
        <div className="settings-form-grid">
          <label className="settings-field">
            <span>Qabul qiluvchi email</span>
            <input type="email" value={notifications.email} onChange={(event) => update("notifications", "email", event.target.value)} />
          </label>
          <label className="settings-field">
            <span>Umumiy hisobot davri</span>
            <select value={notifications.digest} onChange={(event) => update("notifications", "digest", event.target.value)}>
              <option value="daily">Har kuni</option>
              <option value="weekly">Har hafta</option>
              <option value="monthly">Har oy</option>
              <option value="off">Yuborilmasin</option>
            </select>
          </label>
        </div>
      </section>

      <section className="settings-card settings-card--flush">
        <SettingsCardHeader
          icon="bell"
          title="Bildirishnoma turlari"
          description="Faqat boshqaruv qarorlariga ta'sir qiladigan xabarlarni yoqing."
          aside={<span className="settings-channel-count">6 ta qoida</span>}
        />
        <div className="settings-option-list">
          {NOTIFICATION_OPTIONS.map((item) => (
            <div className="settings-option-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="settings-channel-list">
                  {item.channels.map((channel) => <i key={channel}>{channel}</i>)}
                </span>
              </div>
              <Toggle
                checked={notifications[item.id]}
                label={`${item.title} bildirishnomasini ${notifications[item.id] ? "o'chirish" : "yoqish"}`}
                onChange={(checked) => update("notifications", item.id, checked)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SecuritySettings({ values, update, sessions, onPassword, onRevoke }) {
  const security = values.security;
  const securityScore = security.twoFactor ? 100 : 75;

  return (
    <div className="settings-panel-stack">
      <section className="settings-security-score">
        <span className="settings-security-shield"><Icon name="shield" /></span>
        <div>
          <span>Hisob himoyasi</span>
          <strong>{security.twoFactor ? "Barcha himoya qatlamlari faol" : "Himoya yaxshi, ammo yaxshilash mumkin"}</strong>
          <p>{security.twoFactor ? "Hisobingiz tavsiya etilgan xavfsizlik talablariga mos." : "Ikki bosqichli tasdiqlashni yoqish tavsiya etiladi."}</p>
        </div>
        <div className="settings-security-meter">
          <strong className="mono">{securityScore}%</strong>
          <span><i style={{ width: `${securityScore}%` }}></i></span>
          <small>{security.twoFactor ? "4 / 4 himoya" : "3 / 4 himoya"}</small>
        </div>
      </section>

      <section className="settings-card settings-card--flush">
        <SettingsCardHeader
          icon="lock"
          title="Kirish xavfsizligi"
          description="Parol, tasdiqlash va sessiya qoidalarini boshqaring."
        />
        <div className="settings-security-list">
          <div className="settings-security-row">
            <span className="settings-row-icon"><Icon name="key" /></span>
            <div>
              <strong>Hisob paroli</strong>
              <p>Oxirgi marta 28-avgust kuni yangilangan.</p>
            </div>
            <button type="button" className="settings-inline-button" onClick={onPassword}>Parolni almashtirish</button>
          </div>
          <div className="settings-security-row">
            <span className="settings-row-icon"><Icon name="shield" /></span>
            <div>
              <strong>Ikki bosqichli tasdiqlash</strong>
              <p>Kirishda autentifikator ilovasidan qo'shimcha kod so'raladi.</p>
            </div>
            <Toggle checked={security.twoFactor} label="Ikki bosqichli tasdiqlash" onChange={(checked) => update("security", "twoFactor", checked)} />
          </div>
          <div className="settings-security-row">
            <span className="settings-row-icon"><Icon name="bell" /></span>
            <div>
              <strong>Yangi kirish ogohlantirishlari</strong>
              <p>Noma'lum qurilmadan kirilganda darhol email yuboriladi.</p>
            </div>
            <Toggle checked={security.loginAlerts} label="Yangi kirish ogohlantirishlari" onChange={(checked) => update("security", "loginAlerts", checked)} />
          </div>
          <div className="settings-security-row">
            <span className="settings-row-icon"><Icon name="audit" /></span>
            <div>
              <strong>Audit jurnalini saqlash</strong>
              <p>Muhim o'zgarishlar va foydalanuvchi harakatlari qayd etiladi.</p>
            </div>
            <Toggle checked={security.auditLog} label="Audit jurnalini saqlash" onChange={(checked) => update("security", "auditLog", checked)} />
          </div>
          <div className="settings-security-row settings-security-row--select">
            <span className="settings-row-icon"><Icon name="clock" /></span>
            <div>
              <strong>Avtomatik chiqish vaqti</strong>
              <p>Faollik bo'lmaganda sessiya avtomatik yakunlanadi.</p>
            </div>
            <label className="settings-compact-select">
              <span className="sr-only">Sessiya vaqti</span>
              <select value={security.sessionTimeout} onChange={(event) => update("security", "sessionTimeout", event.target.value)}>
                <option value="15">15 daqiqa</option>
                <option value="30">30 daqiqa</option>
                <option value="60">1 soat</option>
                <option value="240">4 soat</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section className="settings-card settings-card--flush">
        <SettingsCardHeader
          icon="desktop"
          title="Faol sessiyalar"
          description="Hisobingizga kirilgan qurilmalarni kuzating."
          aside={<span className="settings-channel-count">{sessions.length} ta qurilma</span>}
        />
        <div className="settings-session-list">
          {sessions.map((session) => (
            <div key={session.id}>
              <span className="settings-row-icon"><Icon name={session.icon} /></span>
              <div>
                <strong>{session.device}</strong>
                <p>{session.location} · {session.activity}</p>
              </div>
              {session.current ? (
                <span className="settings-current-session"><i></i>Joriy sessiya</span>
              ) : (
                <button type="button" className="settings-session-close" onClick={() => onRevoke(session.id)}>
                  <Icon name="logout" /> Sessiyani tugatish
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IntegrationSettings({ values, update }) {
  const integrations = values.integrations;
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiKey = "sdk_test_73BK_49DE_Q92A";

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="settings-panel-stack">
      <section className="settings-card">
        <SettingsCardHeader
          icon="plug"
          title="Ulangan xizmatlar"
          description="Ma'lumot almashinuvi va avtomatlashtirish xizmatlarini boshqaring."
          aside={<span className="settings-channel-count">{INTEGRATION_OPTIONS.filter((item) => integrations[item.id]).length} ta ulangan</span>}
        />
        <div className="settings-integration-grid">
          {INTEGRATION_OPTIONS.map((item) => {
            const connected = integrations[item.id];
            return (
              <article key={item.id}>
                <div className="settings-integration-top">
                  <span className={`settings-integration-logo is-${item.tone}`}>{item.short}</span>
                  <span className={`settings-connection-status${connected ? " is-connected" : ""}`}>
                    <i></i>{connected ? "Ulangan" : "Ulanmagan"}
                  </span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="settings-integration-foot">
                  <span>{connected ? `Sinxron: ${item.lastSync}` : item.lastSync}</span>
                  <button type="button" onClick={() => update("integrations", item.id, !connected)}>
                    {connected ? "Uzish" : "Ulash"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="settings-card">
        <SettingsCardHeader
          icon="link"
          title="API kirishi"
          description="SportDigital ma'lumotlarini ichki tizimlar bilan xavfsiz almashing."
          aside={<Toggle checked={integrations.apiAccess} label="API kirishi" onChange={(checked) => update("integrations", "apiAccess", checked)} />}
        />
        <div className={`settings-api-box${integrations.apiAccess ? " is-enabled" : ""}`}>
          <div className="settings-api-state">
            <span><i></i>{integrations.apiAccess ? "Test muhiti faol" : "API kirishi o'chirilgan"}</span>
            <small>{integrations.apiAccess ? "Faqat o'qish · 60 so'rov/daqiqa" : "Kalit yaratish uchun API kirishini yoqing."}</small>
          </div>
          <div className="settings-api-key">
            <span className="mono">{showKey ? apiKey : "•••• •••• •••• Q92A"}</span>
            <button type="button" disabled={!integrations.apiAccess} aria-label="API kalitini ko'rsatish" onClick={() => setShowKey((current) => !current)}>
              <Icon name="eye" />
            </button>
            <button type="button" disabled={!integrations.apiAccess} aria-label="API kalitini nusxalash" onClick={copyKey}>
              <Icon name={copied ? "check" : "copy"} />
            </button>
          </div>
          <p><Icon name="info" /> Haqiqiy API kaliti faqat backend integratsiyasi yoqilgandan keyin yaratiladi.</p>
        </div>
      </section>
    </div>
  );
}

function PasswordDrawer({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!form.current) {
      setError("Joriy parolni kiriting.");
      return;
    }
    if (form.next.length < 8) {
      setError("Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    if (form.next !== form.confirm) {
      setError("Yangi parollar bir xil emas.");
      return;
    }
    setError("");
    setForm({ current: "", next: "", confirm: "" });
    onSuccess();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Parolni almashtirish"
      subtitle="Aziz Karimov · Rahbar kabineti"
      size="small"
      icon={<Icon name="key" />}
      footer={
        <>
          <button type="button" className="org-secondary-button" onClick={onClose}>Bekor qilish</button>
          <button type="submit" form="settings-password-form" className="org-primary-button">Parolni yangilash</button>
        </>
      }
    >
      <form id="settings-password-form" className="settings-password-form" onSubmit={submit}>
        <div className="settings-password-note">
          <Icon name="shield" />
          <p>Kuchli parol uchun katta-kichik harflar, raqam va maxsus belgidan foydalaning.</p>
        </div>
        <label className="settings-field">
          <span>Joriy parol</span>
          <input type="password" autoComplete="current-password" value={form.current} onChange={(event) => setForm((current) => ({ ...current, current: event.target.value }))} />
        </label>
        <label className="settings-field">
          <span>Yangi parol</span>
          <input type="password" autoComplete="new-password" value={form.next} onChange={(event) => setForm((current) => ({ ...current, next: event.target.value }))} />
          <small>Kamida 8 ta belgi</small>
        </label>
        <label className="settings-field">
          <span>Yangi parolni tasdiqlang</span>
          <input type="password" autoComplete="new-password" value={form.confirm} onChange={(event) => setForm((current) => ({ ...current, confirm: event.target.value }))} />
        </label>
        {error ? <p className="settings-form-error" role="alert">{error}</p> : null}
      </form>
    </Drawer>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [values, setValues] = useState(() => cloneSettings(DEFAULT_SETTINGS));
  const [savedValues, setSavedValues] = useState(() => cloneSettings(DEFAULT_SETTINGS));
  const [notice, setNotice] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);

  const dirty = JSON.stringify(values) !== JSON.stringify(savedValues);
  const active = SETTINGS_TABS.find((tab) => tab.id === activeTab);

  const update = (section, key, value) => {
    setValues((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value },
    }));
    setNotice("");
  };

  const save = () => {
    setSavedValues(cloneSettings(values));
    setNotice("Sozlamalar muvaffaqiyatli saqlandi.");
  };

  const reset = () => {
    setValues(cloneSettings(savedValues));
    setNotice("Saqlanmagan o'zgarishlar bekor qilindi.");
  };

  const closePassword = useCallback(() => setPasswordOpen(false), []);
  const passwordSuccess = useCallback(() => {
    setPasswordOpen(false);
    setNotice("Parol muvaffaqiyatli yangilandi.");
  }, []);

  const revokeSession = (id) => {
    setSessions((current) => current.filter((session) => session.id !== id));
    setNotice("Tanlangan sessiya xavfsiz tarzda tugatildi.");
  };

  return (
    <div className="settings-page">
      <header className="org-page-head settings-page-head">
        <div>
          <span className="org-eyebrow">Tizim boshqaruvi</span>
          <h1>Sozlamalar</h1>
          <p>Tashkilot profili, bildirishnomalar, hisob xavfsizligi va tashqi integratsiyalarni boshqaring.</p>
        </div>
        <div className="settings-head-actions">
          <span className={`settings-save-state${dirty ? " is-dirty" : ""}`}>
            <i></i>{dirty ? "Saqlanmagan o'zgarishlar" : "Barcha o'zgarishlar saqlangan"}
          </span>
          <button type="button" className="org-secondary-button" disabled={!dirty} onClick={reset}>
            <Icon name="undo" /> Bekor qilish
          </button>
          <button type="button" className="org-primary-button" disabled={!dirty} onClick={save}>
            <Icon name="save" /> Saqlash
          </button>
        </div>
      </header>

      {notice ? (
        <div className="settings-notice" role="status">
          <Icon name="check" /><span>{notice}</span>
          <button type="button" aria-label="Xabarni yopish" onClick={() => setNotice("")}>×</button>
        </div>
      ) : null}

      <div className="settings-layout">
        <aside className="settings-section-nav" aria-label="Sozlamalar bo'limlari">
          <div className="settings-nav-heading">
            <span>Sozlamalar paneli</span>
            <small>Olimp sport klubi</small>
          </div>
          <div role="tablist" aria-orientation="vertical">
            {SETTINGS_TABS.map((tab) => (
              <button
                type="button"
                role="tab"
                key={tab.id}
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? "is-active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <span><Icon name={tab.icon} /></span>
                <span>
                  <strong>{tab.label}</strong>
                  <small>{tab.description}</small>
                </span>
              </button>
            ))}
          </div>
          <div className="settings-nav-help">
            <Icon name="shield" />
            <div>
              <strong>Ma'lumotlar himoyalangan</strong>
              <p>Barcha o'zgarishlar audit jurnalida qayd etiladi.</p>
            </div>
          </div>
        </aside>

        <main className="settings-content" role="tabpanel" aria-label={active.label}>
          <header className="settings-mobile-panel-head">
            <span><Icon name={active.icon} /></span>
            <div><h2>{active.label}</h2><p>{active.description}</p></div>
          </header>
          {activeTab === "general" ? <GeneralSettings values={values} update={update} /> : null}
          {activeTab === "notifications" ? <NotificationSettings values={values} update={update} /> : null}
          {activeTab === "security" ? (
            <SecuritySettings
              values={values}
              update={update}
              sessions={sessions}
              onPassword={() => setPasswordOpen(true)}
              onRevoke={revokeSession}
            />
          ) : null}
          {activeTab === "integrations" ? <IntegrationSettings values={values} update={update} /> : null}
        </main>
      </div>

      {passwordOpen ? (
        <PasswordDrawer open onClose={closePassword} onSuccess={passwordSuccess} />
      ) : null}
    </div>
  );
}
