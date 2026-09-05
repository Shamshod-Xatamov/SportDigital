"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import Drawer from "@/components/ui/Drawer";
import { canManage, money } from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";
import {
  Badge,
  Button,
  DataTable,
  Empty,
  PageHead,
  Stat,
  Stats,
} from "./Common";
export function CatalogPage() {
  const { state, profile, dispatch, setNotice } = useDemo();
  const [query, setQuery] = useState(""),
    [org, setOrg] = useState("all"),
    [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);
  const available = state.services.filter(
    (s) =>
      s.status === "active" &&
      state.organizations.some(
        (o) => o.id === s.organizationId && o.status === "active",
      ),
  );
  const rows = available.filter(
    (s) =>
      (org === "all" || s.organizationId === org) &&
      `${s.name} ${s.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const service = available.find((s) => s.id === selected);
  const hasApplication = (s) =>
    state.applications.some(
      (a) =>
        a.profileId === profile.id &&
        a.serviceId === s.id &&
        a.status !== "cancelled",
    );
  function apply(s) {
    try {
      dispatch(
        { type: "apply", serviceId: s.id, id: crypto.randomUUID() },
        "Arizangiz qabul qilindi. Holatini “Mening arizalarim”da kuzating.",
      );
    } catch (e) {
      setNotice(e.message);
    }
  }
  return (
    <div className="demo-page">
      <section className="demo-fan-hero">
        <div>
          <span className="org-eyebrow">O‘ZINGIZ UCHUN VAQT AJRATING</span>
          <h1>
            Keyingi mashg‘ulotingiz
            <br />
            shu yerdan boshlanadi.
          </h1>
          <p>
            Klubni tanlang, xizmat bilan tanishing va birinchi qadamni qo‘ying.
          </p>
          <Link href="/arizalarim" className="org-primary-button">
            Mening arizalarim ↗
          </Link>
        </div>
        <div className="demo-sport-mark" aria-hidden="true">
          GO<span>SPORT / LIFE</span>
        </div>
      </section>
      <div className="demo-toolbar">
        <input
          aria-label="Xizmat qidirish"
          type="search"
          placeholder="Suzish, fitness, muz maydoni…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Katalog tashkiloti"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
        >
          <option value="all">Barcha tashkilotlar</option>
          {state.organizations
            .filter((o) => o.status === "active")
            .map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} · {o.region}
              </option>
            ))}
        </select>
      </div>
      <div className="demo-catalog-grid">
        {rows.map((s, i) => (
          <article className="demo-service-card" key={s.id}>
            <div className={`demo-service-cover cover-${i % 3}`}>
              <span>{s.category}</span>
              <strong aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </strong>
              <small>SPORTDIGITAL / CLUBS</small>
            </div>
            <div className="demo-service-body">
              <small>
                {
                  state.organizations.find((o) => o.id === s.organizationId)
                    ?.name
                }
              </small>
              <h2>{s.name}</h2>
              <p>{s.schedule}</p>
              <strong>{money(s.price)}</strong>
              <Button secondary onClick={() => setSelected(s.id)}>
                Batafsil ko‘rish →
              </Button>
              {hasApplication(s) && (
                <span className="demo-badge">Ariza yuborilgan</span>
              )}
            </div>
          </article>
        ))}
      </div>
      {!rows.length && <Empty text="Mos xizmat topilmadi." />}
      {service && (
        <Drawer
          open
          title={service.name}
          onClose={close}
          subtitle={
            state.organizations.find((o) => o.id === service.organizationId)
              ?.name
          }
        >
          <p>{service.description}</p>
          <dl className="demo-details">
            <div>
              <dt>Narx</dt>
              <dd>{money(service.price)}</dd>
            </div>
            <div>
              <dt>Jadval</dt>
              <dd>{service.schedule}</dd>
            </div>
            <div>
              <dt>Tashkilot telefoni</dt>
              <dd>
                {
                  state.organizations.find(
                    (o) => o.id === service.organizationId,
                  )?.phone
                }
              </dd>
            </div>
          </dl>
          {hasApplication(service) ? (
            <Link className="org-primary-button" href="/arizalarim">
              Arizam holatini ko‘rish →
            </Link>
          ) : (
            <Button onClick={() => apply(service)}>Ariza qoldirish</Button>
          )}
          <p className="demo-caption">
            Demo ariza bepul. Bu amal to‘lov olmaydi; administrator arizani
            ko‘rib chiqadi.
          </p>
        </Drawer>
      )}
    </div>
  );
}
export function ApplicationsPage({ personal = false }) {
  const { state, profile, organizationId, dispatch, setNotice } = useDemo();
  const rows = state.applications
    .filter((a) =>
      personal
        ? a.profileId === profile.id
        : a.organizationId === organizationId,
    )
    .map((a) => ({
      ...a,
      service: state.services.find((s) => s.id === a.serviceId)?.name,
      organization: state.organizations.find((o) => o.id === a.organizationId)
        ?.name,
    }));
  const change = (id, status) => {
    try {
      dispatch(
        { type: "application-status", id, status },
        "Ariza holati yangilandi.",
      );
    } catch (e) {
      setNotice(e.message);
    }
  };
  return (
    <div className="demo-page">
      <PageHead
        title={personal ? "Mening arizalarim" : "Xizmatlar uchun arizalar"}
        description={
          personal
            ? "Sportga bir qadam yaqinroqsiz. Arizalaringiz holatini shu yerda kuzating."
            : "Muxlislarning qiziqishlarini ko‘rib chiqing va ularga javob bering."
        }
      >
        {personal && (
          <Link className="org-primary-button" href="/katalog">
            Xizmatlarni ko‘rish ↗
          </Link>
        )}
      </PageHead>
      <Stats>
        <Stat label="Jami arizalar" value={rows.length} accent />
        <Stat
          label="Javob kutilmoqda"
          value={rows.filter((a) => a.status === "pending").length}
        />
        <Stat
          label="Tasdiqlangan"
          value={rows.filter((a) => a.status === "approved").length}
        />
      </Stats>
      <DataTable
        rows={rows}
        sortKey="date"
        searchLabel="Ariza qidirish"
        columns={[
          { key: "date", label: "Sana" },
          { key: "service", label: "Xizmat" },
          {
            key: personal ? "organization" : "name",
            label: personal ? "Tashkilot" : "Muxlis",
          },
          {
            key: "status",
            label: "Holat",
            render: (a) => <Badge value={a.status} />,
          },
        ]}
        rowAction={
          !personal && canManage(profile.role)
            ? (a) =>
                a.status === "pending" ? (
                  <>
                    <button onClick={() => change(a.id, "approved")}>
                      Tasdiqlash
                    </button>
                    <button onClick={() => change(a.id, "cancelled")}>
                      Rad etish
                    </button>
                  </>
                ) : (
                  <span>Ko‘rib chiqilgan</span>
                )
            : undefined
        }
      />
      <p className="demo-caption">
        Ariza tasdiqlanishi to‘lovni anglatmaydi. Sotuv administrator tomonidan
        Moliyada alohida qayd etiladi.
      </p>
    </div>
  );
}
