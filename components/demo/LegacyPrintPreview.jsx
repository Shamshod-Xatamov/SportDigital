"use client";
import Drawer from "@/components/ui/Drawer";
import { money } from "@/lib/demo/model.mjs";
import { downloadReport } from "./ReportsPage";
export default function LegacyPrintPreview({ report, onClose }) {
  return (
    <Drawer open title={report.title} onClose={onClose} size="large">
      <div className="demo-print-report">
        <p>SPORTDIGITAL / HISOBOT</p>
        <h2>{report.title}</h2>
        <p>
          {report.organization} · {report.range.start} — {report.range.end}
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
        <p>Demo ma’lumotlari asosida. Muallif: {report.author}.</p>
      </div>
      <div className="legacy-inline-actions demo-no-print">
        <button
          className="org-secondary-button"
          onClick={() => downloadReport(report)}
        >
          CSV yuklash
        </button>
        <button className="org-primary-button" onClick={() => window.print()}>
          Chop etish / PDF
        </button>
      </div>
    </Drawer>
  );
}
