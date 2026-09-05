"use client";
import { useCallback, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { canManage, customerActivity, money } from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";
import {
  Badge,
  Button,
  Confirmation,
  DataTable,
  FormDrawer,
  PageHead,
  Stat,
  Stats,
} from "./Common";

const CONFIG = {
  organizations: {
    title: "Tashkilotlar",
    description: "Sport tashkilotlari va ularning faoliyat ma’lumotlari.",
    singular: "Tashkilot",
    fields: [
      { key: "name", label: "Tashkilot nomi" },
      {
        key: "category",
        label: "Turi",
        options: [
          "Sport klubi",
          "Sport maktabi",
          "Fitness markazi",
          "Sport majmuasi",
          "Federatsiya",
        ],
      },
      { key: "region", label: "Hudud" },
      { key: "phone", label: "Telefon", type: "tel" },
    ],
  },
  services: {
    title: "Sport xizmatlari",
    description: "Xizmatlarni yarating, narx va jadvalni boshqaring.",
    singular: "Xizmat",
    fields: [
      { key: "name", label: "Xizmat nomi" },
      {
        key: "category",
        label: "Turi",
        options: [
          "Mashg'ulot",
          "Abonement",
          "Inshoot ijarasi",
          "Individual xizmat",
          "Boshqa",
        ],
      },
      { key: "price", label: "Narx (so'm)", type: "number", min: 1 },
      { key: "schedule", label: "Mashg‘ulot jadvali" },
      { key: "description", label: "Tavsif", type: "textarea" },
    ],
  },
  customers: {
    title: "Muxlislar / CRM",
    description: "Mijozlaringiz, ularning xaridlari va faolligi bir joyda.",
    singular: "Mijoz",
    fields: [
      { key: "name", label: "Ism va familiya" },
      { key: "phone", label: "Telefon", type: "tel" },
      { key: "email", label: "Email", type: "email", required: false },
    ],
  },
};
export default function RecordsPage({ collection }) {
  const { state, profile, dispatch, organizationId } = useDemo();
  const [edit, setEdit] = useState(null),
    [detail, setDetail] = useState(null),
    [confirm, setConfirm] = useState(null),
    [status, setStatus] = useState("active");
  const closeEdit = useCallback(() => setEdit(null), []),
    closeDetail = useCallback(() => setDetail(null), []),
    closeConfirm = useCallback(() => setConfirm(null), []);
  const config = CONFIG[collection],
    manage =
      collection === "organizations"
        ? profile.role === "super"
        : canManage(profile.role);
  const all =
    collection === "organizations"
      ? state.organizations.filter(
          (o) => profile.role === "super" || o.id === organizationId,
        )
      : state[collection].filter((r) => r.organizationId === organizationId);
  const rows = all
    .filter((r) => status === "all" || r.status === status)
    .map((r) => {
      const sales = state.sales.filter(
        (s) =>
          s.status === "completed" &&
          (collection === "customers"
            ? s.customerId === r.id
            : collection === "services"
              ? s.serviceId === r.id
              : s.organizationId === r.id),
      );
      return {
        ...r,
        revenue: sales.reduce((sum, s) => sum + s.total, 0),
        purchases: sales.length,
        activity: customerActivity(state, r.id).label,
      };
    });
  const selected = rows.find((r) => r.id === detail);
  const columns = [
    {
      key: "name",
      label: "Nomi",
      render: (r) => (
        <button className="demo-text-button" onClick={() => setDetail(r.id)}>
          {r.name}
        </button>
      ),
    },
    ...(collection === "customers"
      ? [
          { key: "phone", label: "Telefon" },
          { key: "purchases", label: "Xaridlar" },
          { key: "activity", label: "Faollik" },
        ]
      : [
          { key: "category", label: "Turi" },
          collection === "services"
            ? { key: "price", label: "Narx", render: (r) => money(r.price) }
            : { key: "region", label: "Hudud" },
        ]),
    { key: "revenue", label: "Jami tushum", render: (r) => money(r.revenue) },
    {
      key: "status",
      label: "Holat",
      render: (r) => <Badge value={r.status} />,
    },
  ];
  return (
    <div className="demo-page">
      <PageHead title={config.title} description={config.description}>
        {manage && (
          <Button
            onClick={() =>
              setEdit({ id: crypto.randomUUID(), name: "", fresh: true })
            }
          >
            + {config.singular} qo‘shish
          </Button>
        )}
      </PageHead>
      <Stats>
        <Stat
          label="Jami yozuvlar"
          value={all.length}
          note="Tanlangan tashkilot doirasida"
          accent
        />
        <Stat
          label="Faol"
          value={all.filter((r) => r.status === "active").length}
          note="Foydalanish uchun ochiq"
        />
        <Stat
          label="Arxivlangan"
          value={all.filter((r) => r.status === "archived").length}
          note="Tarixi saqlangan"
        />
      </Stats>
      <DataTable
        rows={rows}
        columns={columns}
        searchLabel={`${config.singular} qidirish`}
        filters={
          <select
            aria-label="Yozuv holati"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Faol</option>
            <option value="archived">Arxivda</option>
            <option value="all">Barchasi</option>
          </select>
        }
        rowAction={
          manage
            ? (r) => (
                <>
                  <button onClick={() => setEdit(r)}>Tahrirlash</button>
                  {r.status === "active" && (
                    <button
                      onClick={() => setConfirm({ row: r, type: "archive" })}
                    >
                      Arxivlash
                    </button>
                  )}
                  <button
                    onClick={() => setConfirm({ row: r, type: "delete" })}
                  >
                    O‘chirish
                  </button>
                </>
              )
            : undefined
        }
      />
      {edit && (
        <FormDrawer
          title={`${config.singular} ${edit.fresh ? "qo‘shish" : "tahrirlash"}`}
          initial={edit}
          fields={config.fields}
          onClose={closeEdit}
          onSave={(value) =>
            dispatch(
              { type: "save", collection, id: edit.id, value },
              `${config.singular} saqlandi.`,
            )
          }
        />
      )}
      {confirm && (
        <Confirmation
          title={confirm.type === "archive" ? "Arxivlash" : "Yozuvni o‘chirish"}
          text={`${confirm.row.name}: ${confirm.type === "archive" ? "yangi amallarda tanlab bo‘lmaydi, mavjud tarix saqlanadi." : "faqat bog‘liq tarixi bo‘lmagan yozuv o‘chiriladi."}`}
          onClose={closeConfirm}
          onConfirm={() =>
            dispatch(
              { type: confirm.type, collection, id: confirm.row.id },
              "Amal bajarildi.",
            )
          }
        />
      )}
      {selected && (
        <Drawer open title={selected.name} onClose={closeDetail}>
          <dl className="demo-details">
            {config.fields.map((f) => (
              <div key={f.key}>
                <dt>{f.label}</dt>
                <dd>
                  {f.key === "price"
                    ? money(selected[f.key])
                    : selected[f.key] || "—"}
                </dd>
              </div>
            ))}
            <div>
              <dt>Holat</dt>
              <dd>
                <Badge value={selected.status} />
              </dd>
            </div>
            <div>
              <dt>Jami tushum</dt>
              <dd>{money(selected.revenue)}</dd>
            </div>
          </dl>
          <h3>Sotuvlar tarixi</h3>
          {state.sales
            .filter((s) =>
              collection === "customers"
                ? s.customerId === selected.id
                : collection === "services"
                  ? s.serviceId === selected.id
                  : s.organizationId === selected.id,
            )
            .slice(0, 12)
            .map((s) => (
              <div className="demo-list-row" key={s.id}>
                <span>
                  {s.date}
                  <small>
                    {state.services.find((x) => x.id === s.serviceId)?.name}
                  </small>
                </span>
                <span>
                  {money(s.total)}
                  <small>
                    <Badge value={s.status} />
                  </small>
                </span>
              </div>
            ))}
        </Drawer>
      )}
    </div>
  );
}
