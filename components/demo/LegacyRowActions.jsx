"use client";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDemo } from "./DemoProvider";

export default function LegacyRowActions({ collection, row, onEdit, onView }) {
  const { dispatch, setNotice } = useDemo();
  const [position, setPosition] = useState(null);
  const trigger = useRef(null);
  const menu = useRef(null);
  const id = useId();

  function close() {
    setPosition(null);
    trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!position) return;
    menu.current?.querySelector("button")?.focus({ preventScroll: true });
    function outside(event) {
      if (!menu.current?.contains(event.target) && !trigger.current?.contains(event.target)) {
        setPosition(null);
      }
    }
    const anchor = trigger.current.getBoundingClientRect();
    function dismiss(event) {
      if (menu.current?.contains(event.target)) return;
      const rect = trigger.current.getBoundingClientRect();
      if (event.type === "resize" || Math.abs(rect.top - anchor.top) > 1 || Math.abs(rect.left - anchor.left) > 1) setPosition(null);
    }
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, [position]);

  function remove(type) {
    if (!window.confirm(`${row.name}: ${type === "archive" ? "arxivlash" : "o‘chirish"} tasdiqlansinmi?`)) return;
    try {
      dispatch({ type, collection, id: row.id }, "Amal bajarildi.");
    } catch (e) {
      setNotice(e.message);
    }
  }

  const actions = [
    ...(onView ? [{ label: "Batafsil ko‘rish", run: onView }] : []),
    { label: "Tahrirlash", run: () => onEdit(row) },
    { label: "Arxivlash", run: () => remove("archive") },
    { label: "O‘chirish", run: () => remove("delete"), danger: true },
  ];

  return (
    <>
      <button
        ref={trigger}
        className="legacy-action-trigger"
        type="button"
        aria-label={`${row.name}: amallar`}
        aria-haspopup="menu"
        aria-expanded={Boolean(position)}
        aria-controls={position ? id : undefined}
        onClick={() => {
          if (position) return close();
          const rect = trigger.current.getBoundingClientRect();
          const height = actions.length * 40 + 10;
          setPosition({
            left: Math.max(8, Math.min(rect.right - 184, window.innerWidth - 192)),
            top: Math.max(8, rect.bottom + height + 8 > window.innerHeight ? rect.top - height - 4 : rect.bottom + 4),
          });
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {position && createPortal(
        <div ref={menu} id={id} role="menu" aria-label={`${row.name}: amallar`} className="legacy-action-menu" style={position}
          onKeyDown={event => {
            if (event.key === "Escape") { event.preventDefault(); close(); }
            if (event.key === "Tab") { event.preventDefault(); close(); }
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const items = [...menu.current.querySelectorAll("button")];
              const index = items.indexOf(document.activeElement);
              const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
              items[next].focus();
            }
          }}>
          {actions.map(action => <button key={action.label} type="button" role="menuitem" className={action.danger ? "legacy-action-danger" : undefined} onClick={() => { close(); action.run(); }}>{action.label}</button>)}
        </div>, document.body,
      )}
    </>
  );
}
