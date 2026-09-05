"use client";
import { useMemo } from "react";
import { useDemo } from "./DemoProvider";
import { legacyRecords, legacyValue } from "@/lib/demo/legacy.mjs";
import { canManage } from "@/lib/demo/model.mjs";
export function useLegacyRecords(collection) {
  const demo = useDemo();
  const rows = useMemo(
    () => legacyRecords(demo.state, collection),
    [demo.state, collection],
  );
  const save = (row) => {
    demo.dispatch(
      {
        type: "save",
        collection,
        id: row.id || crypto.randomUUID(),
        value: legacyValue(collection, row),
      },
      "Ma’lumot saqlandi.",
    );
  };
  return {
    ...demo,
    rows,
    save,
    canEdit:
      collection === "organizations"
        ? demo.profile.role === "super"
        : canManage(demo.profile.role),
  };
}
