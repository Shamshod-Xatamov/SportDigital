"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <rect x="5" y="8" width="34" height="28" rx="5" />
        <path d="M22 8v28" />
        <circle cx="22" cy="22" r="6" />
      </svg>
    </span>
  );
}

function NavIcon({ name }) {
  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7.5" height="10" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5" />
        <rect x="13.5" y="11.5" width="7.5" height="9.5" rx="1.5" />
        <rect x="3" y="16" width="7.5" height="5" rx="1.5" />
      </>
    ),
    orgs: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    services: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21" />
      </>
    ),
    fans: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M15.5 13.6c2.7.2 4.5 1.7 5 4.4" />
      </>
    ),
    marketing: (
      <path d="M4 11v3l3 .8V21l3-.6v-6l10 3V5L7 9.5 4 10z" strokeLinejoin="round" />
    ),
    finance: (
      <>
        <path d="M4 19h16" />
        <path d="M6 19v-6M11 19V8M16 19v-9M21 19V5" />
      </>
    ),
    dri: (
      <>
        <path d="M4 17a8 8 0 0 1 16 0" />
        <path d="M12 17 16 9" />
        <path d="M3 21h18" />
      </>
    ),
    kpi: (
      <>
        <path d="M4 20V10M9.5 20V4M15 20v-8M20.5 20V7" />
        <path d="M2.5 20h19" />
      </>
    ),
    analytics: (
      <>
        <path d="M3.5 16.5 9 11l3.5 3.5L20.5 6" />
        <path d="M15.5 6h5v5" />
      </>
    ),
    forecast: (
      <>
        <path d="M3.5 18c3-1 4.5-6 7-6s3.5 3 6 3 3.5-4.5 4-8" />
        <path d="M3.5 21h17" strokeDasharray="2.6 2.6" />
      </>
    ),
    rating: (
      <path d="m12 3 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.2l5.9-.8L12 3z" strokeLinejoin="round" />
    ),
    reports: (
      <>
        <path d="M6 3h8l4 4v14H6V3z" strokeLinejoin="round" />
        <path d="M14 3v4h4M9 12h6M9 16h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" />
      </>
    ),
    logout: (
      <>
        <path d="M14 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8" />
        <path d="M10 12h10M16.5 8.5 20 12l-3.5 3.5" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const NAV_GROUPS = [
  {
    label: "Boshqaruv",
    items: [
      { href: "/dashboard", icon: "dashboard", label: "Dashboard", ready: true },
      { href: "/tashkilotlar", icon: "orgs", label: "Tashkilotlar" },
      { href: "/xizmatlar", icon: "services", label: "Sport xizmatlari" },
    ],
  },
  {
    label: "Muxlislar va bozor",
    items: [
      { href: "/muxlislar", icon: "fans", label: "Muxlislar / CRM" },
      { href: "/marketing", icon: "marketing", label: "Marketing" },
      { href: "/moliya", icon: "finance", label: "Moliya" },
    ],
  },
  {
    label: "Tahlil",
    items: [
      { href: "/raqamli-rivojlanish", icon: "dri", label: "Raqamli rivojlanish" },
      { href: "/kpi", icon: "kpi", label: "KPI" },
      { href: "/analitika", icon: "analytics", label: "Analitika" },
      { href: "/prognoz", icon: "forecast", label: "Prognoz" },
      { href: "/reyting", icon: "rating", label: "Reyting" },
    ],
  },
  {
    label: "Boshqa",
    items: [
      { href: "/hisobotlar", icon: "reports", label: "Hisobotlar" },
      { href: "/sozlamalar", icon: "settings", label: "Sozlamalar" },
    ],
  },
];

function SidebarNav({ pathname, onNavigate }) {
  return (
    <nav className="app-nav" aria-label="Platforma bo'limlari">
      {NAV_GROUPS.map((group) => (
        <div className="app-nav-group" key={group.label}>
          <p className="app-nav-label">{group.label}</p>
          {group.items.map((item) =>
            item.ready ? (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav-item${pathname === item.href ? " is-active" : ""}`}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={onNavigate}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            ) : (
              <span
                key={item.href}
                className="app-nav-item is-soon"
                title="Keyingi bosqichda qo'shiladi"
                aria-disabled="true"
              >
                <NavIcon name={item.icon} />
                {item.label}
              </span>
            ),
          )}
        </div>
      ))}
    </nav>
  );
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("app-drawer-open", drawerOpen);
    return () => document.body.classList.remove("app-drawer-open");
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const sidebarInner = (
    <>
      <Link className="brand app-brand" href="/" aria-label="SportDigital bosh sahifa">
        <BrandMark />
        <span className="brand-copy">
          Sport<em>Digital</em>
        </span>
      </Link>

      <SidebarNav pathname={pathname} onNavigate={() => setDrawerOpen(false)} />

      <div className="app-user">
        <span className="app-user-avatar" aria-hidden="true">
          AK
        </span>
        <span className="app-user-copy">
          <strong>Aziz Karimov</strong>
          <small>Rahbar · Olimp SK</small>
        </span>
        <Link className="app-user-logout" href="/login" aria-label="Tizimdan chiqish">
          <NavIcon name="logout" />
        </Link>
      </div>
    </>
  );

  return (
    <div className="app-shell" data-app-shell>
      <aside className="app-sidebar">{sidebarInner}</aside>

      <header className="app-mobile-bar">
        <button
          type="button"
          className="app-burger"
          aria-expanded={drawerOpen}
          aria-controls="app-drawer"
          aria-label={drawerOpen ? "Menyuni yopish" : "Menyuni ochish"}
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <span></span>
          <span></span>
        </button>
        <Link className="brand app-brand" href="/" aria-label="SportDigital bosh sahifa">
          <BrandMark />
          <span className="brand-copy">
            Sport<em>Digital</em>
          </span>
        </Link>
      </header>

      {drawerOpen ? (
        <div className="app-drawer" id="app-drawer">
          <div className="app-drawer-panel">{sidebarInner}</div>
          <button
            type="button"
            className="app-drawer-backdrop"
            aria-label="Menyuni yopish"
            onClick={() => setDrawerOpen(false)}
          ></button>
        </div>
      ) : null}

      <div className="app-content">{children}</div>
    </div>
  );
}
