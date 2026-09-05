"use client";
import { useCallback, useState } from "react";
import { useDemo } from "./DemoProvider";
import { canManage } from "@/lib/demo/model.mjs";
import { TransactionForm } from "./FinancePage";
export function SaleButtons() {
  const { profile } = useDemo();
  const [form, setForm] = useState(null);
  const close = useCallback(() => setForm(null), []);
  if (!canManage(profile.role)) return null;
  return (
    <>
      <span className="legacy-inline-actions">
        <button
          className="org-secondary-button"
          onClick={() => setForm("expense")}
        >
          + Xarajat
        </button>
        <button className="org-primary-button" onClick={() => setForm("sale")}>
          + Sotuv kiritish
        </button>
      </span>
      {form && <TransactionForm kind={form} onClose={close} />}
    </>
  );
}
export function TransactionActions({ transaction, onClose }) {
  const { state, profile, dispatch, setNotice } = useDemo();
  const [editing, setEditing] = useState(false);
  const close = useCallback(() => setEditing(false), []);
  if (!canManage(profile.role)) return null;
  const expense = state.expenses.find((e) => e.id === transaction.id);
  return (
    <>
      {expense ? (
        <button
          className="org-secondary-button"
          onClick={() => setEditing(true)}
        >
          Xarajatni tahrirlash
        </button>
      ) : transaction.status === "completed" ? (
        <button
          className="org-secondary-button"
          onClick={() => {
            if (window.confirm("Sotuv bekor qilinsinmi?")) {
              try {
                dispatch(
                  { type: "cancel-sale", id: transaction.id },
                  "Sotuv bekor qilindi.",
                );
                onClose();
              } catch (e) {
                setNotice(e.message);
              }
            }
          }}
        >
          Sotuvni bekor qilish
        </button>
      ) : null}
      {editing && (
        <TransactionForm
          kind="expense"
          expense={expense}
          onClose={() => {
            close();
            onClose();
          }}
        />
      )}
    </>
  );
}
