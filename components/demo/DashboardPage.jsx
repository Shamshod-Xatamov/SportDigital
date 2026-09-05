"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  canManage,
  customerActivity,
  DEFAULT_TARGETS,
  driScores,
  metrics,
  money,
  number,
} from "@/lib/demo/model.mjs";
import { DRI_INDICATORS } from "@/lib/mock/dri";
import { useDemo } from "./DemoProvider";
import {
  Button,
  MoneyStats,
  PageHead,
  Panel,
  PeriodControl,
  RevenueChart,
} from "./Common";
import { TransactionForm } from "./FinancePage";
export default function DashboardPage() {
  const { state, profile, organization, organizationId } = useDemo();
  const [form, setForm] = useState(false);
  const close = useCallback(() => setForm(false), []);
  const m = metrics(state),
    targets =
      state.targets[`${organizationId}:${state.period}`] ?? DEFAULT_TARGETS;
  const scores = driScores(state);
  const weakest = DRI_INDICATORS.slice().sort(
    (a, b) => scores[a.id] - scores[b.id],
  )[0];
  const inactive = state.customers.filter(
    (c) =>
      c.organizationId === organizationId &&
      c.status === "active" &&
      customerActivity(state, c.id).inactive,
  ).length;
  const pending = state.applications.filter(
    (a) => a.organizationId === organizationId && a.status === "pending",
  ).length;
  return (
    <div className="demo-page">
      <PageHead
        eyebrow={`${organization.name} / RAHBAR PANELI`}
        title={`Xush kelibsiz, ${profile.name.split(" ")[0]}`}
        description="Tashkilotingizning bugungi holati va keyingi qadamlari."
      >
        {canManage(profile.role) && (
          <Button onClick={() => setForm(true)}>+ Sotuv kiritish</Button>
        )}
        <Link className="org-secondary-button" href="/hisobotlar">
          Hisobot olish ↗
        </Link>
      </PageHead>
      <PeriodControl />
      <MoneyStats metrics={m} />
      <div className="demo-grid-main">
        <RevenueChart metrics={m} />
        <Panel
          title="Raqamli rivojlanish"
          note="12 indikator · vaznli baholash"
        >
          <div className="demo-gauge" style={{ "--score": `${m.dri}%` }}>
            <div>
              <strong>{number(m.dri)}</strong>
              <span>100 balldan</span>
            </div>
          </div>
          <p className="demo-center">Maqsad: {targets.dri} ball</p>
          <Link className="demo-text-button" href="/raqamli-rivojlanish">
            Baholashni ko‘rish →
          </Link>
        </Panel>
      </div>
      <div className="demo-two-columns">
        {state.settings[profile.id]?.notifications !== false ? (
          <Panel
            title="E’tibor talab qiladigan ishlar"
            note="Demo ma’lumotlaridan tuzilgan qoidaviy tavsiyalar"
          >
            <div className="demo-recommendation">
              <span>01</span>
              <div>
                <h3>
                  {m.revenue >= targets.revenue
                    ? "Daromad maqsadi bajarildi"
                    : "Daromad maqsadiga hali yo‘l bor"}
                </h3>
                <p>
                  {m.revenue >= targets.revenue
                    ? "Natijani saqlash uchun talab yuqori xizmatlarni kuzating."
                    : `Maqsadga yetish uchun yana ${money(targets.revenue - m.revenue)} tushum kerak.`}
                </p>
                <Link href="/kpi">KPI monitoring →</Link>
              </div>
            </div>
            <div className="demo-recommendation">
              <span>02</span>
              <div>
                <h3>
                  {weakest.label}: {scores[weakest.id]} ball
                </h3>
                <p>
                  Shu yo‘nalish uchun mas’ul va o‘lchanadigan 30 kunlik vazifa
                  belgilang.
                </p>
                <Link href="/raqamli-rivojlanish">Rivojlanish baholari →</Link>
              </div>
            </div>
            {inactive > 0 && (
              <div className="demo-recommendation">
                <span>!</span>
                <div>
                  <h3>{inactive} ta mijoz 30 kundan beri xarid qilmagan</h3>
                  <p>Ular uchun mos qaytish taklifini tayyorlang.</p>
                  {canManage(profile.role) && (
                    <Link href="/muxlislar">CRMni ko‘rish →</Link>
                  )}
                </div>
              </div>
            )}
            {canManage(profile.role) && (
              <div className="demo-recommendation">
                <span>03</span>
                <div>
                  <h3>{pending} ta ariza javob kutmoqda</h3>
                  <p>
                    Yangi qiziqishlarni mijozga aylantirish uchun arizalarni
                    ko‘rib chiqing.
                  </p>
                  <Link href="/arizalar">Arizalarni ochish →</Link>
                </div>
              </div>
            )}
          </Panel>
        ) : (
          <Panel title="Tavsiyalar yashirilgan">
            <p>Profil sozlamalaridan tavsiyalarni qayta yoqishingiz mumkin.</p>
            <Link href="/sozlamalar">Sozlamalarni ochish →</Link>
          </Panel>
        )}
        <Panel
          title="Xizmatlar bo‘yicha tushum"
          note="Faqat tanlangan davrdagi yakunlangan sotuvlar"
        >
          {state.services
            .filter((s) => s.organizationId === organizationId)
            .map((s) => {
              const sum = m.transactions
                .filter((t) => t.serviceId === s.id)
                .reduce((a, t) => a + t.total, 0);
              return (
                <div className="demo-source" key={s.id}>
                  <div>
                    <span>{s.name}</span>
                    <strong>{money(sum)}</strong>
                  </div>
                  <progress max={Math.max(m.revenue, 1)} value={sum} />
                </div>
              );
            })}
          <div className="demo-list-row">
            <span>Xarid qilgan mijozlar</span>
            <strong>{m.customers}</strong>
          </div>
          <div className="demo-list-row">
            <span>Raqamli to‘lov ulushi</span>
            <strong>{number(m.digital)}%</strong>
          </div>
        </Panel>
      </div>
      {form && <TransactionForm kind="sale" onClose={close} />}
    </div>
  );
}
