"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "./DemoProvider";
import { FormDrawer } from "./Common";
export default function LegacyProfileSettings() {
  const { profile, state, dispatch, reset } = useDemo();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const close = useCallback(() => setEditing(false), []);
  return (
    <section className="settings-card">
      <header className="settings-card-head">
        <div>
          <h2>Hisob va demo boshqaruvi</h2>
          <p>{profile.name} · o‘zgarishlar shu brauzerda saqlanadi.</p>
        </div>
      </header>
      <div className="legacy-inline-actions" style={{ padding: "20px" }}>
        <button
          className="org-secondary-button"
          onClick={() => setEditing(true)}
        >
          Profilni tahrirlash
        </button>
        <button
          className="org-secondary-button"
          onClick={() => {
            if (
              window.confirm(
                "Shu brauzerdagi SportDigital demo yozuvlari boshlang‘ich holatga qaytarilsinmi?",
              )
            ) {
              reset();
              router.push("/login");
            }
          }}
        >
          Demoni tiklash
        </button>
      </div>
      {editing && (
        <FormDrawer
          title="Hisob va profil"
          fields={[{ key: "name", label: "Ism va familiya" }]}
          initial={{ name: profile.name }}
          onClose={close}
          onSave={(value) =>
            dispatch(
              {
                type: "profile",
                name: value.name,
                notifications:
                  state.settings[profile.id]?.notifications ?? true,
              },
              "Profil saqlandi.",
            )
          }
        />
      )}
    </section>
  );
}
