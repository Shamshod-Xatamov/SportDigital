"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { canVisit, homeFor } from "@/lib/demo/model.mjs";
import { useDemo } from "./DemoProvider";

export default function DemoGate({ children }) {
  const { ready, profile, corrupt, reset } = useDemo();
  const router = useRouter(),
    path = usePathname();
  useEffect(() => {
    if (ready && !profile && !corrupt) router.replace("/login");
  }, [ready, profile, corrupt, router]);
  if (corrupt)
    return (
      <main className="demo-recovery">
        <h1>Demoni tiklash kerak</h1>
        <p>Saqlangan ma’lumot formati buzilgan yoki mos kelmaydi.</p>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Shu brauzerdagi SportDigital demo ma’lumotlari tiklansinmi?",
              )
            )
              reset();
          }}
        >
          Boshlang‘ich holatga qaytarish
        </button>
      </main>
    );
  if (!ready || !profile)
    return (
      <main className="demo-recovery" role="status">
        SportDigital ochilmoqda…
      </main>
    );
  if (!canVisit(profile.role, path))
    return (
      <main className="demo-recovery">
        <h1>Bu bo‘lim sizning rolingizga tegishli emas</h1>
        <Link className="org-primary-button" href={homeFor(profile.role)}>
          O‘z kabinetimga o‘tish
        </Link>
      </main>
    );
  return children;
}
