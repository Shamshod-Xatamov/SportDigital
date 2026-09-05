"use client";
import { useCallback, useState } from "react";
import { DRI_INDICATORS, getDriLevel } from "@/lib/mock/dri";
import {
  canAssess,
  DEFAULT_TARGETS,
  driScores,
  driValue,
  metrics,
  money,
  number,
  today,
} from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";
import {
  Button,
  DataTable,
  FormDrawer,
  PageHead,
  Panel,
  PeriodControl,
  Stat,
  Stats,
} from "./Common";
const KPI_META = [
  {
    key: "revenue",
    label: "Xizmatlar tushumi",
    unit: "so'm",
    formula: "Yakunlangan sotuvlar summasi",
    format: money,
  },
  {
    key: "sales",
    label: "Yakunlangan sotuvlar",
    unit: "ta",
    formula: "Bekor qilinmagan sotuvlar soni",
    format: number,
  },
  {
    key: "customers",
    label: "Xarid qilgan mijozlar",
    unit: "ta",
    formula: "Davrda xarid qilgan noyob mijozlar soni",
    format: number,
  },
  {
    key: "digital",
    label: "Raqamli to‘lov ulushi",
    unit: "%",
    formula: "Karta va onlayn tushum / jami tushum × 100",
    format: (n) => `${number(n)}%`,
  },
  {
    key: "dri",
    label: "Raqamli rivojlanish",
    unit: "ball",
    formula: "12 indikatorning vaznli o‘rtacha bahosi",
    format: (n) => `${number(n)} ball`,
  },
];
export function KpiPage() {
  const { state, profile, organizationId, dispatch } = useDemo();
  const [editing, setEditing] = useState(false),
    close = useCallback(() => setEditing(false), []);
  const targets =
      state.targets[`${organizationId}:${state.period}`] ?? DEFAULT_TARGETS,
    m = metrics(state);
  return (
    <div className="demo-page">
      <PageHead
        title="KPI monitoring"
        description="Maqsadlar, joriy natijalar va bajarilish darajasi."
      >
        {canAssess(profile.role) && (
          <Button onClick={() => setEditing(true)}>
            Maqsadlarni o‘zgartirish
          </Button>
        )}
      </PageHead>
      <PeriodControl />
      <div className="demo-kpi-grid">
        {KPI_META.map((k) => {
          const ratio = (m[k.key] / targets[k.key]) * 100;
          return (
            <Panel key={k.key} title={k.label} note={k.formula}>
              <strong className="demo-big-number">{k.format(m[k.key])}</strong>
              <div className="demo-list-row">
                <span>Maqsad</span>
                <strong>{k.format(targets[k.key])}</strong>
              </div>
              <progress max="100" value={Math.min(100, ratio)} />
              <p className={ratio >= 100 ? "demo-positive" : ""}>
                {number(ratio)}% bajarildi ·{" "}
                {ratio >= 100 ? "Maqsadga erishildi" : "Davom etamiz"}
              </p>
            </Panel>
          );
        })}
      </div>
      <p className="demo-caption">
        Tushum, sotuv, xaridor va to‘lov ulushi demo yozuvlaridan hisoblanadi.
        DRI — joriy oy uchun kiritilgan baho; davr filtridan mustaqil.
        Marketingning tarixiy ko‘rsatkichlari Marketing bo‘limida namuna
        sifatida berilgan.
      </p>
      {editing && (
        <FormDrawer
          title="KPI maqsadlari"
          fields={KPI_META.map((k) => ({
            key: k.key,
            label: `${k.label} (${k.unit})`,
            type: "number",
            min: 1,
            max: ["digital", "dri"].includes(k.key) ? 100 : undefined,
          }))}
          initial={targets}
          onClose={close}
          onSave={(values) =>
            dispatch(
              { type: "targets", values },
              "Maqsadlar saqlandi. Bajarilish qayta hisoblandi.",
            )
          }
        />
      )}
    </div>
  );
}
export function DriPage() {
  const { state, profile, dispatch, organization } = useDemo();
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(() => driScores(state)),
    [error, setError] = useState("");
  const scores = editing ? draft : driScores(state);
  const value =
    DRI_INDICATORS.reduce((s, i) => s + i.weight * scores[i.id], 0) / 100;
  const level = getDriLevel(value);
  const weakest = DRI_INDICATORS.slice()
    .sort((a, b) => scores[a.id] - scores[b.id])
    .slice(0, 3);
  function save() {
    try {
      dispatch(
        { type: "assessment", scores: draft },
        "DRI baholari saqlandi. Dashboard, KPI va reyting yangilandi.",
      );
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div className="demo-page">
      <PageHead
        title="Raqamli rivojlanish"
        description={`${organization.name} · ${today().slice(0, 7)} · 12 indikator asosida baholash.`}
      >
        {canAssess(profile.role) &&
          (editing ? (
            <>
              <Button
                secondary
                onClick={() => {
                  setEditing(false);
                  setError("");
                }}
              >
                Bekor qilish
              </Button>
              <Button onClick={save}>Bahoni saqlash</Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setDraft(driScores(state));
                setEditing(true);
              }}
            >
              Baholashni boshlash
            </Button>
          ))}
      </PageHead>
      <Stats>
        <Stat
          label="DRI bahosi"
          value={`${number(value)} / 100`}
          note={level.label}
          accent
        />
        <Stat label="Indikatorlar" value="12" note="Har biri 0–100 ball" />
        <Stat
          label="Hisoblash usuli"
          value="Σ Wi × Xi"
          note="Vaznlar yig‘indisi 100%"
        />
      </Stats>
      {error && (
        <p role="alert" className="demo-warning">
          {error}
        </p>
      )}
      <div className="demo-grid-main">
        <Panel
          title={
            editing ? "Baholarni kiriting" : "Yo‘nalishlar bo‘yicha baholar"
          }
          note="Baholash tashkilotning texnologiyalardan foydalanish holatini bildiradi."
        >
          <div className="demo-indicators">
            {DRI_INDICATORS.map((i) => (
              <div className="demo-indicator" key={i.id}>
                <div>
                  <strong>{i.label}</strong>
                  <small>
                    {i.description} · vazni {i.weight}%
                  </small>
                </div>
                {editing ? (
                  <label>
                    <span className="sr-only">{i.label}</span>
                    <input
                      aria-label={i.label}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={draft[i.id]}
                      onChange={(e) =>
                        setDraft({ ...draft, [i.id]: e.target.value })
                      }
                    />
                  </label>
                ) : (
                  <strong>{number(scores[i.id])}</strong>
                )}
                <progress max="100" value={Number(scores[i.id]) || 0} />
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title="Ustuvor yo‘nalishlar"
          note="Eng past baholardan tuzilgan tavsiyalar"
        >
          {weakest.map((i, index) => (
            <div className="demo-recommendation" key={i.id}>
              <span>0{index + 1}</span>
              <div>
                <h3>{i.label}</h3>
                <p>
                  {scores[i.id]} ball. Mas’ul belgilang, kichik sinov loyihasini
                  boshlang va bir oyda qayta baholang.
                </p>
              </div>
            </div>
          ))}
          <p className="demo-caption">
            Baholar demo maqsadida qo‘lda kiritiladi. Sun’iy intellekt yoki
            tashqi audit ulanmagan.
          </p>
        </Panel>
      </div>
    </div>
  );
}
export function RatingPage() {
  const { state } = useDemo();
  const rows = state.organizations
    .filter((o) => o.status === "active")
    .map((o) => ({ ...o, score: driValue(state, o.id) }))
    .sort((a, b) => b.score - a.score)
    .map((o, i) => ({ ...o, rank: i + 1 }));
  return (
    <div className="demo-page">
      <PageHead
        title="Tashkilotlar reytingi"
        description="Demo tashkilotlarining joriy oy DRI bahosi bo‘yicha ochiq taqqoslash."
      />
      <div className="demo-ranking-podium">
        {rows.slice(0, 3).map((o) => (
          <Panel
            key={o.id}
            title={o.name}
            note={`${o.rank}-o‘rin · ${o.category}`}
          >
            <strong className="demo-big-number">
              {number(o.score)} <small>/ 100</small>
            </strong>
            <progress max="100" value={o.score} />
            <p>{getDriLevel(o.score).label}</p>
          </Panel>
        ))}
      </div>
      <DataTable
        rows={rows}
        sortKey="rank"
        columns={[
          { key: "rank", label: "O‘rin" },
          { key: "name", label: "Tashkilot" },
          { key: "region", label: "Hudud" },
          { key: "score", label: "DRI", render: (o) => number(o.score) },
        ]}
      />
      <p className="demo-caption">
        Bu reyting 12 ta indikator asosidagi DRI bo‘yicha hisoblanadi.
        Tashkilotlarning mijozlari va moliyaviy yozuvlari bu yerda
        ko‘rsatilmaydi.
      </p>
    </div>
  );
}
