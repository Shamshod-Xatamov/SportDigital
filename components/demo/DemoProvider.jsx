"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  STORAGE_KEY,
  decode,
  organizationOf,
  profileOf,
  seed,
  transition,
} from "@/lib/demo/model.mjs";

const DemoContext = createContext(null);
export default function DemoProvider({ children }) {
  const [state, setState] = useState(null);
  const [storageError, setStorageError] = useState("");
  const [corrupt, setCorrupt] = useState(false);
  const [notice, setNotice] = useState("");
  const current = useRef(null);
  const blocked = useRef(false);
  useEffect(() => {
    let initial = seed();
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      setStorageError(
        "Brauzerda saqlash mavjud emas. O‘zgarishlar faqat shu ochiq oynada qoladi.",
      );
    }
    if (raw !== null) {
      try {
        initial = decode(raw);
      } catch {
        blocked.current = true;
        setCorrupt(true);
        setStorageError(
          "Saqlangan demo ma’lumoti o‘qilmadi. Boshlang‘ich holatni tiklang.",
        );
      }
    }
    current.current = initial;
    setState(initial);
  }, []);
  const commit = useCallback((next) => {
    current.current = next;
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError("");
    } catch {
      setStorageError(
        "O‘zgarish xotirada, lekin brauzerga saqlanmadi. Oynani yopsangiz yo‘qolishi mumkin.",
      );
    }
  }, []);
  const dispatch = useCallback(
    (action, message) => {
      if (!current.current || blocked.current)
        throw new Error("Davom etish uchun demo ma’lumotlarini tiklang.");
      const next = transition(current.current, action);
      commit(next);
      if (message) setNotice(message);
      return next;
    },
    [commit],
  );
  const reset = useCallback(() => {
    blocked.current = false;
    setCorrupt(false);
    commit(seed());
    setNotice("Demo boshlang‘ich holatga qaytarildi. Profilni tanlang.");
  }, [commit]);
  const profile = state ? profileOf(state) : null;
  const organizationId = state ? organizationOf(state) : null;
  return (
    <DemoContext.Provider
      value={{
        state,
        ready: Boolean(state),
        profile,
        organizationId,
        organization: state?.organizations.find((o) => o.id === organizationId),
        dispatch,
        reset,
        storageError,
        corrupt,
        notice,
        setNotice,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("DemoProvider kerak.");
  return value;
}
