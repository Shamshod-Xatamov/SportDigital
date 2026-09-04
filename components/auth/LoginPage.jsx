"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <rect x="5" y="8" width="34" height="28" rx="5" />
        <path d="M22 8v28" />
        <circle cx="22" cy="22" r="6" />
      </svg>
    </span>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="7.5" width="11" height="8" rx="2" />
      <path d="M6 7.5V5.8a3 3 0 0 1 6 0v1.7" />
    </svg>
  );
}

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setStatus("idle");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Elektron pochtani kiriting.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Elektron pochta formati noto'g'ri.";
    }

    if (mode === "login" && !password) {
      nextErrors.password = "Parolni kiriting.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    window.setTimeout(() => {
      if (mode === "login") {
        router.push("/dashboard");
      } else {
        setStatus("done");
      }
    }, 700);
  };

  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Link className="brand" href="/" aria-label="SportDigital bosh sahifa">
          <BrandMark />
          <span className="brand-copy">
            Sport<em>Digital</em>
          </span>
        </Link>
        <Link className="auth-home-link" href="/">
          Bosh sahifa
        </Link>
      </header>

      <main className="auth-main">
        <section className="auth-card" aria-labelledby="auth-title">
          {status === "done" ? (
            <div className="auth-success" role="status">
              <span className="auth-success-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h1>{mode === "login" ? "Kirish tasdiqlandi" : "Havola yuborildi"}</h1>
              <p>
                {mode === "login"
                  ? "Demo rejim: boshqaruv paneli keyingi bosqichda ulanadi."
                  : `Ko'rsatmalar ${email} manziliga yuborildi.`}
              </p>
              <button type="button" className="auth-secondary-button" onClick={() => switchMode("login")}>
                Ortga qaytish
              </button>
            </div>
          ) : (
            <>
              <div className="auth-card-head">
                <p className="auth-eyebrow">
                  <LockIcon />
                  {mode === "login" ? "Hisobingiz" : "Parolni tiklash"}
                </p>
                <h1 id="auth-title">{mode === "login" ? "Tizimga kirish" : "Yangi parol olish"}</h1>
                <p className="auth-lead">
                  {mode === "login"
                    ? "SportDigital boshqaruv paneliga kirish."
                    : "Tiklash havolasini olish uchun emailingizni kiriting."}
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="email">Elektron pochta</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    autoFocus
                    placeholder="ism@tashkilot.uz"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email ? (
                    <span className="field-error" id="email-error">
                      {errors.email}
                    </span>
                  ) : null}
                </div>

                {mode === "login" ? (
                  <div className="field">
                    <label htmlFor="password">Parol</label>
                    <div className="field-control">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Parolingiz"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        aria-invalid={errors.password ? "true" : undefined}
                        aria-describedby={errors.password ? "password-error" : undefined}
                      />
                      <button
                        type="button"
                        className="field-toggle"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8" />
                            <path d="M6.5 6.8C4.6 8.1 3.9 9.9 2.8 12c1.9 3.6 5.2 6 9.2 6 1.5 0 2.9-.3 4.1-.9M9.9 5.2A9.9 9.9 0 0 1 12 5c4 0 7.3 2.4 9.2 6-.6 1.2-1.4 2.2-2.3 3.1" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                            <path d="M2.8 12C4.7 8.4 8 6 12 6s7.3 2.4 9.2 6c-1.9 3.6-5.2 6-9.2 6s-7.3-2.4-9.2-6z" />
                            <circle cx="12" cy="12" r="2.6" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password ? (
                      <span className="field-error" id="password-error">
                        {errors.password}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                {mode === "login" ? (
                  <button type="button" className="link-button" onClick={() => switchMode("reset")}>
                    Parolni unutdingizmi?
                  </button>
                ) : null}

                <button className="auth-submit" type="submit" disabled={status === "loading"}>
                  {status === "loading" ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Tekshirilmoqda
                    </>
                  ) : (
                    <>
                      {mode === "login" ? "Kirish" : "Havola yuborish"}
                      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M3.75 9h10.5M10 4.75 14.25 9 10 13.25" />
                      </svg>
                    </>
                  )}
                </button>

                {mode === "reset" ? (
                  <button type="button" className="auth-secondary-button" onClick={() => switchMode("login")}>
                    Kirish sahifasiga qaytish
                  </button>
                ) : null}
              </form>

              <p className="auth-secure">
                <LockIcon />
                Xavfsiz ulanish
              </p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
