"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import {
  canManage,
  metrics,
  money,
  periodRange,
  today,
} from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";
import {
  Badge,
  Button,
  Confirmation,
  DataTable,
  FormDrawer,
  MoneyStats,
  PageHead,
  PeriodControl,
  RevenueChart,
} from "./Common";
export function TransactionForm({ kind, expense, onClose }) {
  const { state, dispatch, organizationId } = useDemo();
  const [id] = useState(() => expense?.id ?? crypto.randomUUID());
  const services = state.services.filter(
      (s) => s.organizationId === organizationId && s.status === "active",
    ),
    customers = state.customers.filter(
      (c) => c.organizationId === organizationId && c.status === "active",
    );
  const fields =
    kind === "sale"
      ? [
          {
            key: "serviceId",
            label: "Xizmat",
            options: services.map((s) => ({
              value: s.id,
              label: `${s.name} · ${money(s.price)}`,
            })),
          },
          {
            key: "customerId",
            label: "Mijoz",
            options: customers.map((c) => ({ value: c.id, label: c.name })),
          },
          { key: "quantity", label: "Miqdor", type: "number", min: 1 },
          {
            key: "method",
            label: "To‘lov usuli",
            options: ["Karta", "Naqd", "Onlayn"],
          },
        ]
      : [
          {
            key: "category",
            label: "Xarajat toifasi",
            options: [
              "Ijara",
              "Ish haqi",
              "Reklama",
              "Jihozlar",
              "Kommunal",
              "Boshqa",
            ],
          },
          { key: "total", label: "Summa (so'm)", type: "number", min: 1 },
          { key: "note", label: "Izoh", type: "textarea", required: false },
        ];
  return (
    <FormDrawer
      title={
        kind === "sale"
          ? "Yangi sotuv"
          : expense
            ? "Xarajatni tahrirlash"
            : "Yangi xarajat"
      }
      fields={[
        ...fields,
        { key: "date", label: "Sana", type: "date", max: today() },
      ]}
      initial={expense ?? { date: today(), quantity: 1, method: "Karta" }}
      onClose={onClose}
      onSave={(value) =>
        dispatch(
          {
            type: "save",
            collection: kind === "sale" ? "sales" : "expenses",
            id,
            value,
          },
          kind === "sale"
            ? "Sotuv saqlandi. Moliya va Dashboard yangilandi."
            : "Xarajat saqlandi. Foyda qayta hisoblandi.",
        )
      }
    >
      {(value) =>
        kind === "sale" && (
          <div className="demo-form-total">
            <span>Jami summa</span>
            <strong>
              {money(
                (services.find((s) => s.id === value.serviceId)?.price ?? 0) *
                  (Number(value.quantity) || 0),
              )}
            </strong>
            {(!services.length || !customers.length) && (
              <p>
                Avval faol xizmat va mijoz yarating.{" "}
                <Link href="/xizmatlar">Xizmatlar →</Link> ·{" "}
                <Link href="/muxlislar">Mijozlar →</Link>
              </p>
            )}
            <small>Demo qaydi: haqiqiy to‘lov olinmaydi.</small>
          </div>
        )
      }
    </FormDrawer>
  );
}
export default function FinancePage() {
  const { state, profile, dispatch, organizationId } = useDemo();
  const m = metrics(state),
    manage = canManage(profile.role);
  const [form, setForm] = useState(null),
    [cancel, setCancel] = useState(null),
    [kind, setKind] = useState("all"),
    [method, setMethod] = useState("all"),
    [status, setStatus] = useState("all");
  const closeForm = useCallback(() => setForm(null), []),
    closeCancel = useCallback(() => setCancel(null), []);
  const range = periodRange(state.period);
  const rows = [
    ...state.sales.map((s) => ({
      ...s,
      kind: "sale",
      name: state.services.find((x) => x.id === s.serviceId)?.name,
      customer: state.customers.find((c) => c.id === s.customerId)?.name,
    })),
    ...state.expenses.map((e) => ({
      ...e,
      kind: "expense",
      name: e.category,
      customer: e.note,
      method: "—",
    })),
  ].filter(
    (r) =>
      r.organizationId === organizationId &&
      r.date >= range.start &&
      r.date <= range.end &&
      (kind === "all" || r.kind === kind) &&
      (method === "all" || r.method === method) &&
      (status === "all" || r.status === status),
  );
  return (
    <div className="demo-page">
      <PageHead
        title="Moliya"
        description="Har bir sotuv va xarajatdan hisoblangan aniq natijalar."
      >
        {manage && (
          <>
            <Button secondary onClick={() => setForm({ kind: "expense" })}>
              + Xarajat
            </Button>
            <Button onClick={() => setForm({ kind: "sale" })}>
              + Sotuv kiritish
            </Button>
          </>
        )}
      </PageHead>
      <PeriodControl />
      <MoneyStats metrics={m} />
      <RevenueChart metrics={m} />
      <DataTable
        rows={rows}
        sortKey="date"
        searchLabel="Operatsiya qidirish"
        filters={
          <>
            <select
              aria-label="Operatsiya turi"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="all">Barcha operatsiyalar</option>
              <option value="sale">Daromad</option>
              <option value="expense">Xarajat</option>
            </select>
            <select
              aria-label="To‘lov usuli"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="all">Barcha to‘lovlar</option>
              {["Karta", "Naqd", "Onlayn"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Operatsiya holati"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Barcha holatlar</option>
              <option value="completed">Yakunlangan</option>
              <option value="cancelled">Bekor qilingan</option>
            </select>
          </>
        }
        columns={[
          { key: "date", label: "Sana" },
          {
            key: "name",
            label: "Operatsiya",
            render: (r) => (
              <>
                <strong>{r.name}</strong>
                <small>{r.customer}</small>
              </>
            ),
          },
          {
            key: "kind",
            label: "Tur",
            render: (r) => (r.kind === "sale" ? "Daromad" : "Xarajat"),
          },
          { key: "method", label: "Usul" },
          { key: "total", label: "Summa", render: (r) => money(r.total) },
          {
            key: "status",
            label: "Holat",
            render: (r) => <Badge value={r.status} />,
          },
        ]}
        rowAction={
          manage
            ? (r) =>
                r.kind === "expense" ? (
                  <button
                    onClick={() => setForm({ kind: "expense", expense: r })}
                  >
                    Tahrirlash
                  </button>
                ) : r.status === "completed" ? (
                  <button onClick={() => setCancel(r)}>
                    Sotuvni bekor qilish
                  </button>
                ) : (
                  <span>Tarix saqlangan</span>
                )
            : undefined
        }
      />
      {form && <TransactionForm {...form} onClose={closeForm} />}
      {cancel && (
        <Confirmation
          title="Sotuvni bekor qilish"
          text={`${money(cancel.total)} tushumdan chiqariladi. Yozuv tarixda qoladi.`}
          onClose={closeCancel}
          onConfirm={() =>
            dispatch(
              { type: "cancel-sale", id: cancel.id },
              "Sotuv bekor qilindi, natijalar yangilandi.",
            )
          }
        />
      )}
    </div>
  );
}
