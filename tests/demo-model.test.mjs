import test from "node:test";
import assert from "node:assert/strict";
import {
  seed,
  transition,
  metrics,
  today,
  decode,
  reportCsv,
  periodRange,
  driValue,
  driScores,
  DEFAULT_TARGETS,
  canVisit,
  organizationOf,
} from "../lib/demo/model.mjs";
const login = (s, profileId = "admin") =>
  transition(s, { type: "login", profileId });
const add = (s, collection, id, value) =>
  transition(s, { type: "save", collection, id, value });
function scenario() {
  let s = login(seed());
  s = add(s, "services", "swim-test", {
    name: "Suzish abonementi",
    price: 200000,
    category: "Abonement",
    schedule: "Du–Sh",
    description: "Test xizmat",
  });
  s = add(s, "customers", "customer-test", {
    name: "Test Mijoz",
    phone: "+998901234567",
  });
  return s;
}
const sale = {
  serviceId: "swim-test",
  customerId: "customer-test",
  date: today(),
  quantity: 2,
  method: "Karta",
};
test("sale and expense update shared revenue and profit, cancellation is idempotent", () => {
  let s = scenario();
  const before = metrics(s);
  s = add(s, "sales", "sale-test", sale);
  s = add(s, "expenses", "expense-test", {
    category: "Ijara",
    total: 100000,
    date: today(),
  });
  assert.equal(metrics(s).revenue - before.revenue, 400000);
  assert.equal(metrics(s).profit - before.profit, 300000);
  s = transition(s, { type: "cancel-sale", id: "sale-test" });
  s = transition(s, { type: "cancel-sale", id: "sale-test" });
  assert.equal(metrics(s).revenue, before.revenue);
  assert.equal(metrics(s).profit, before.profit - 100000);
});
test("price changes and archiving preserve historical totals; linked deletion rejected", () => {
  let s = add(scenario(), "sales", "sale-test", sale);
  const original = s.services.find((x) => x.id === "swim-test");
  s = add(s, "services", original.id, { ...original, price: 900000 });
  assert.equal(s.sales.find((x) => x.id === "sale-test").total, 400000);
  assert.throws(
    () =>
      transition(s, {
        type: "delete",
        collection: "services",
        id: original.id,
      }),
    /tarix/,
  );
  s = transition(s, {
    type: "archive",
    collection: "services",
    id: original.id,
  });
  assert.equal(s.sales.find((x) => x.id === "sale-test").unitPrice, 200000);
  assert.throws(() => add(s, "sales", "second-sale", sale), /Faol xizmat/);
});
test("double submitted sale does not double count", () => {
  const s = add(scenario(), "sales", "sale-test", sale);
  assert.throws(() => add(s, "sales", "sale-test", sale), /allaqachon/);
});
test("organizations are isolated and non-admin mutations are rejected", () => {
  let s = scenario();
  const other = metrics(s, "humo").revenue;
  s = add(s, "sales", "sale-test", sale);
  assert.equal(metrics(s, "humo").revenue, other);
  assert.throws(
    () => add(s, "sales", "bad-sale", { ...sale, serviceId: "humo-swim" }),
    /Faol xizmat/,
  );
  assert.throws(
    () =>
      add(
        s,
        "services",
        "humo-swim",
        s.services.find((x) => x.id === "humo-swim"),
      ),
    /Boshqa tashkilot/,
  );
  for (const role of ["leader", "analyst", "fan"])
    assert.throws(
      () => add(login(s, role), "sales", "unauthorized", sale),
      /administrator/,
    );
  assert.throws(
    () => transition(s, { type: "workspace", id: "humo" }),
    /super administrator/,
  );
  assert.equal(
    organizationOf(
      transition(login(s, "super"), { type: "workspace", id: "humo" }),
    ),
    "humo",
  );
});
test("fan application travels between roles without creating a sale", () => {
  let s = login(seed(), "fan");
  const sales = s.sales.length;
  s = transition(s, { type: "apply", id: "app-test", serviceId: "olimp-swim" });
  assert.throws(
    () =>
      transition(s, {
        type: "apply",
        id: "app-test-2",
        serviceId: "olimp-swim",
      }),
    /allaqachon/,
  );
  assert.throws(
    () =>
      transition(s, {
        type: "application-status",
        id: "app-test",
        status: "approved",
      }),
    /administrator/,
  );
  s = transition(login(s), {
    type: "application-status",
    id: "app-test",
    status: "approved",
  });
  assert.equal(login(s, "fan").applications[0].status, "approved");
  assert.equal(s.sales.length, sales);
});
test("report captures a snapshot, CSV escapes Uzbek, commas, quotes, linebreaks and formula cells", () => {
  let s = scenario();
  s = transition(s, { type: "report", id: "report-test", kind: "finance" });
  const report = s.reports[0];
  s = add(s, "sales", "sale-test", sale);
  assert.equal(s.reports[0].revenue, report.revenue);
  assert.notEqual(metrics(s).revenue, report.revenue);
  const csv = reportCsv({
    ...report,
    rows: [
      {
        date: today(),
        kind: "Daromad",
        name: 'O‘zbek, "test"\nqator',
        total: 20,
      },
      { date: today(), kind: "Daromad", name: '=HYPERLINK("bad")', total: 30 },
    ],
  });
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"O‘zbek, ""test""\nqator"'));
  assert.ok(csv.includes("\"'=HYPERLINK"));
});
test("JSON reload keeps session, organization, records, targets and DRI", () => {
  let s = add(scenario(), "sales", "sale-test", sale);
  s = transition(s, {
    type: "assessment",
    scores: Object.fromEntries(Object.keys(driScores(s)).map((id) => [id, 80])),
  });
  s = transition(s, {
    type: "targets",
    values: { ...DEFAULT_TARGETS, revenue: 15000000 },
  });
  const loaded = decode(JSON.stringify(s));
  assert.deepEqual(loaded, s);
  assert.equal(driValue(loaded), 80);
  assert.equal(loaded.targets["olimp:month"].revenue, 15000000);
  assert.equal(transition(s, { type: "logout" }).sales.length, s.sales.length);
  assert.equal(
    seed().sales.some((r) => r.id === "sale-test"),
    false,
  );
});
test("corrupt, incompatible and inconsistent saved data rejected", () => {
  assert.throws(() => decode("{broken"));
  assert.throws(() => decode(JSON.stringify({ ...seed(), version: 99 })));
  assert.throws(() =>
    decode(
      JSON.stringify({
        ...seed(),
        sales: [{ id: "bad", organizationId: "unknown" }],
      }),
    ),
  );
  const s = seed();
  s.sales[0].total = -5;
  assert.throws(() => decode(JSON.stringify(s)));
});
test("period boundaries, missing data and zero revenue produce finite results", () => {
  assert.deepEqual(periodRange("week", "2026-09-06"), {
    start: "2026-08-31",
    end: "2026-09-06",
  });
  assert.equal(periodRange("quarter", "2026-01-01").start, "2026-01-01");
  assert.equal(periodRange("year", "2026-12-31").start, "2026-01-01");
  const s = login(seed());
  const m = metrics(s, "olimp", { start: "2000-01-01", end: "2000-01-02" });
  assert.equal(m.digital, 0);
  assert.equal(m.profit, 0);
});
test("invalid amounts, dates and input are rejected without changing state", () => {
  const s = scenario();
  for (const quantity of [-1, 0, 1.5, Infinity, ""])
    assert.throws(() => add(s, "sales", "bad", { ...sale, quantity }));
  for (const date of ["2026-02-30", "2099-01-01", "garbage"])
    assert.throws(() => add(s, "sales", "bad", { ...sale, date }));
  assert.throws(() =>
    transition(s, {
      type: "targets",
      values: { ...DEFAULT_TARGETS, digital: 101 },
    }),
  );
  assert.equal(
    s.sales.some((r) => r.id === "bad"),
    false,
  );
});
test("navigation matrix separates public catalogue and internal data", () => {
  assert.equal(canVisit("fan", "/moliya"), false);
  assert.equal(canVisit("fan", "/katalog"), true);
  assert.equal(canVisit("analyst", "/xizmatlar"), false);
  assert.equal(canVisit("leader", "/kpi"), true);
  assert.equal(canVisit(undefined, "/dashboard"), false);
});

test("invalid saved targets and dangling applications require recovery", () => {
  const s = seed();
  s.targets["olimp:month"] = { ...DEFAULT_TARGETS, revenue: 0 };
  assert.throws(() => decode(JSON.stringify(s)), /KPI/);
  const other = seed();
  other.applications.push({
    id: "bad",
    organizationId: "olimp",
    profileId: "fan",
    serviceId: "missing",
    date: today(),
    name: "Test",
    status: "pending",
  });
  assert.throws(() => decode(JSON.stringify(other)), /Ariza/);
});

test("original forms keep their presentation fields and bind to shared records", async () => {
  const { legacyRecords, legacyValue } = await import("../lib/demo/legacy.mjs");
  let s = login(seed());
  s = add(
    s,
    "services",
    "legacy-service",
    legacyValue("services", {
      name: "Eski UI xizmati",
      category: "membership",
      price: 200000,
      schedule: "Du–Sh",
      description: "Abonement",
      capacity: 40,
      billing: "Oylik abonement",
      format: "Oflayn",
      status: "active",
    }),
  );
  const row = legacyRecords(s, "services").find(
    (r) => r.id === "legacy-service",
  );
  assert.equal(row.category, "membership");
  assert.equal(row.capacity, 40);
  s = add(
    s,
    "services",
    row.id,
    legacyValue("services", { ...row, price: 250000 }),
  );
  assert.equal(s.services.find((r) => r.id === row.id).price, 250000);
  assert.equal(
    s.services.find((r) => r.id === row.id).presentation.presentation,
    undefined,
  );
  assert.doesNotThrow(() => decode(JSON.stringify(s)));
});
test("original settings update the current organization and decimal KPI goals persist", () => {
  let s = login(seed());
  s = transition(s, {
    type: "preferences",
    value: {
      organization: { name: "Olimp Yangilangan", phone: "+998901234567" },
    },
  });
  assert.equal(
    s.organizations.find((o) => o.id === "olimp").name,
    "Olimp Yangilangan",
  );
  assert.equal(s.organizations.find((o) => o.id === "humo").name, "Humo Arena");
  s = transition(s, { type: "kpi-goals", values: { CR: 5.5, DRI: 90 } });
  assert.equal(decode(JSON.stringify(s)).settings["kpi:olimp:month"].CR, 5.5);
});
