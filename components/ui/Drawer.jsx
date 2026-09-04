"use client";

import { useEffect, useRef, useState } from "react";

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = "medium",
}) {
  const [shown, setShown] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const frame = window.requestAnimationFrame(() => {
      setShown(true);
      panelRef.current
        ?.querySelector(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
        )
        ?.focus();
    });

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      setShown(false);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`ui-drawer${shown ? " is-shown" : ""}`}>
      <button type="button" className="ui-drawer-backdrop" aria-label="Oynani yopish" onClick={onClose} />
      <section
        ref={panelRef}
        className={`ui-drawer-panel ui-drawer-panel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <header className="ui-drawer-head">
          <div className="ui-drawer-heading">
            {icon ? <span className="ui-drawer-icon">{icon}</span> : null}
            <div>
              <h2 id="drawer-title">{title}</h2>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </div>
          <button type="button" className="ui-drawer-close" aria-label="Oynani yopish" onClick={onClose}>
            <span></span>
            <span></span>
          </button>
        </header>

        <div className="ui-drawer-body">{children}</div>
        {footer ? <footer className="ui-drawer-footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
