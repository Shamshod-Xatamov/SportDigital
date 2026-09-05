"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";
import { Button, Confirmation, PageHead, Panel } from "./Common";
export default function SettingsPage() {
  const { state, profile, dispatch, reset } = useDemo();
  const router = useRouter();
  const [name, setName] = useState(profile.name),
    [notifications, setNotifications] = useState(
      state.settings[profile.id]?.notifications ?? true,
    ),
    [confirm, setConfirm] = useState(false),
    [error, setError] = useState("");
  const close = useCallback(() => setConfirm(false), []);
  function save(e) {
    e.preventDefault();
    try {
      dispatch(
        { type: "profile", name, notifications },
        "Profil va sozlamalar saqlandi.",
      );
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div className="demo-page">
      <PageHead
        title="Profil va sozlamalar"
        description="Shaxsiy ma’lumotlar va demo boshqaruvi."
      />
      <div className="demo-two-columns">
        <Panel title="Mening profilim" note={ROLES[profile.role]}>
          <form className="demo-form" onSubmit={save}>
            <label>
              Ism va familiya
              <input
                required
                maxLength="250"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="demo-checkbox">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              Dashboard tavsiyalarini ko‘rsatish
            </label>
            <small>Tashqi email, SMS va push yuborilmaydi.</small>
            {error && <p role="alert">{error}</p>}
            <div className="demo-actions">
              <Button
                secondary
                onClick={() => {
                  setName(profile.name);
                  setNotifications(
                    state.settings[profile.id]?.notifications ?? true,
                  );
                }}
              >
                O‘zgarishlarni bekor qilish
              </Button>
              <Button type="submit">Profilni saqlash</Button>
            </div>
          </form>
        </Panel>
        <Panel
          title="Demo boshqaruvi"
          note="Taqdimotni boshidan boshlash uchun"
        >
          <p>
            Bu brauzerdagi barcha demo yozuvlar boshlang‘ich namunalar bilan
            almashtiriladi. Yaratilgan xizmatlar, sotuvlar, arizalar va
            hisobotlar o‘chadi.
          </p>
          <Button danger onClick={() => setConfirm(true)}>
            Demoni boshlang‘ich holatga qaytarish
          </Button>
          <p className="demo-caption">
            Saqlangan ma’lumotlar boshqa qurilmaga uzatilmaydi. Demo rollar
            haqiqiy akkaunt himoyasini ta’minlamaydi.
          </p>
        </Panel>
      </div>
      {profile.role === "super" && (
        <Panel
          title="Demo profillar"
          note="Rollarni yuqoridagi tanlov orqali sinab ko‘ring."
        >
          {state.profiles.map((p) => (
            <div className="demo-list-row" key={p.id}>
              <strong>{p.name}</strong>
              <span>
                {ROLES[p.role]} ·{" "}
                {
                  state.organizations.find((o) => o.id === p.organizationId)
                    ?.name
                }
              </span>
            </div>
          ))}
        </Panel>
      )}
      <Panel
        title="Tashqi integratsiyalar"
        note="Taqdimot uchun namunaviy holat"
      >
        <p>
          Instagram, Telegram, elektron to‘lov, email va AI integratsiyalari
          ulanmagan. Marketing va prognoz sahifalari tayyor namunaviy
          ma’lumotlarni ko‘rsatadi.
        </p>
      </Panel>
      {confirm && (
        <Confirmation
          title="Demo ma’lumotlari tiklansinmi?"
          text="Shu brauzerdagi SportDigital o‘zgarishlari o‘chadi. Bu amalni ortga qaytarib bo‘lmaydi."
          onClose={close}
          onConfirm={() => {
            reset();
            router.push("/login");
          }}
        />
      )}
    </div>
  );
}
