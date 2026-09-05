"use client";
import { useCallback, useState } from "react";
import Drawer from "@/components/ui/Drawer";
import { metrics, money, number, reportCsv } from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";
import {
  Button,
  DataTable,
  MoneyStats,
  PageHead,
  PeriodControl,
} from "./Common";
export function downloadReport(report) {
  const url = URL.createObjectURL(
    new Blob([reportCsv(report)], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `SportDigital-${report.id}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function ReportsPage() {
  const { state, dispatch, organizationId } = useDemo();
  const [kind, setKind] = useState("finance"),
    [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);
  const report = state.reports.find((r) => r.id === selected);
  function create() {
    const id = crypto.randomUUID();
    dispatch(
      { type: "report", kind, id },
      "Hisobot tayyor. Natijalar nusxasi tarixga saqlandi.",
    );
    setSelected(id);
  }
  return (
    <div className="demo-page">
      <PageHead
        title="Hisobotlar"
        description="Tanlangan davr natijalarini saqlang va jamoangiz bilan ulashing."
      >
        <select
          aria-label="Hisobot turi"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="finance">Moliyaviy hisobot</option>
          <option value="executive">Rahbar uchun umumiy hisobot</option>
        </select>
        <Button onClick={create}>+ Hisobot yaratish</Button>
      </PageHead>
      <PeriodControl />
      <MoneyStats metrics={metrics(state)} />
      <p className="demo-caption">
        CSV Excel’da ochiladi. PDF uchun hisobotni ochib “Chop etish / PDF”
        tugmasini bosing. Avtomatik email jo‘natish demo doirasiga kirmaydi.
      </p>
      <DataTable
        rows={state.reports.filter((r) => r.organizationId === organizationId)}
        sortKey="createdAt"
        searchLabel="Hisobot qidirish"
        columns={[
          {
            key: "title",
            label: "Hisobot",
            render: (r) => (
              <button
                className="demo-text-button"
                onClick={() => setSelected(r.id)}
              >
                {r.title}
              </button>
            ),
          },
          { key: "organization", label: "Tashkilot" },
          {
            key: "range",
            label: "Davr",
            render: (r) => `${r.range.start} — ${r.range.end}`,
          },
          {
            key: "createdAt",
            label: "Yaratildi",
            render: (r) => new Date(r.createdAt).toLocaleString("uz-UZ"),
          },
        ]}
        rowAction={(r) => (
          <>
            <button onClick={() => downloadReport(r)}>CSV yuklash ↓</button>
            <button onClick={() => setSelected(r.id)}>Ko‘rish / PDF</button>
          </>
        )}
      />
      {report && (
        <Drawer
          open
          title={report.title}
          subtitle="Yaratilgan paytdagi natijalar nusxasi"
          size="large"
          onClose={close}
        >
          <div className="demo-print-report">
            <p className="org-eyebrow">SPORTDIGITAL / HISOBOT</p>
            <h2>{report.title}</h2>
            <p>
              {report.organization} · {report.range.start} — {report.range.end}
            </p>
            <p>
              Muallif: {report.author} ·{" "}
              {new Date(report.createdAt).toLocaleString("uz-UZ")}
            </p>
            <dl className="demo-details">
              <div>
                <dt>Tushum</dt>
                <dd>{money(report.revenue)}</dd>
              </div>
              <div>
                <dt>Xarajat</dt>
                <dd>{money(report.expense)}</dd>
              </div>
              <div>
                <dt>Sof foyda</dt>
                <dd>{money(report.profit)}</dd>
              </div>
              <div>
                <dt>Sotuvlar / xaridorlar</dt>
                <dd>
                  {report.sales} / {report.customers}
                </dd>
              </div>
              <div>
                <dt>DRI</dt>
                <dd>{number(report.dri)} / 100</dd>
              </div>
            </dl>
            <table className="demo-table">
              <thead>
                <tr>
                  <th>Sana</th>
                  <th>Tur</th>
                  <th>Tavsif</th>
                  <th>Summa</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.kind}</td>
                    <td>{r.name}</td>
                    <td>{money(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Interaktiv demo ma’lumotlari asosida tayyorlangan.</p>
          </div>
          <div className="demo-actions demo-no-print">
            <Button secondary onClick={() => downloadReport(report)}>
              CSV yuklash ↓
            </Button>
            <Button onClick={() => window.print()}>Chop etish / PDF</Button>
          </div>
        </Drawer>
      )}
    </div>
  );
}
