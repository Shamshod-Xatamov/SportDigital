import { test, expect } from "@playwright/test";
import { SUPER_ADMIN_CREDENTIALS } from "../../lib/demo/auth.mjs";
import { STORAGE_KEY } from "../../lib/demo/model.mjs";
async function enter(page, role = "admin") {
  await page.goto("/login");
  await page
    .getByLabel("Elektron pochta", { exact: true })
    .fill(SUPER_ADMIN_CREDENTIALS.email);
  await page
    .getByLabel("Parol", { exact: true })
    .fill(SUPER_ADMIN_CREDENTIALS.password);
  await page.getByRole("button", { name: "Kirish", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  if (role !== "super") await switchRole(page, role);
}
async function switchRole(page, role) {
  const account =
    page.viewportSize().width <= 1080
      ? ".app-mobile-bar .app-user-summary"
      : ".app-topbar .app-user-summary";
  await page.locator(account).click();
  await page
    .getByLabel("Demo rolni almashtirish", { exact: true })
    .selectOption(role);
  await expect(page).toHaveURL(role === "fan" ? /\/katalog$/ : /\/dashboard$/);
}
async function data(page) {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    STORAGE_KEY,
  );
}
async function closeDrawer(page) {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Oynani yopish", exact: true })
    .click();
}
const revenue = (s) =>
  s.sales
    .filter((r) => r.organizationId === "olimp" && r.status === "completed")
    .reduce((n, r) => n + r.total, 0);

test("original login and page structures are preserved with working sale and export", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Tizimga kirish" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Elektron pochta", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Parol", { exact: true })).toBeVisible();
  await expect(page.getByText("Qaysi rolda kiramiz?")).toHaveCount(0);
  await expect(page.getByText("Demo hisobdan foydalanish")).toHaveCount(0);
  await page
    .getByLabel("Elektron pochta", { exact: true })
    .fill(SUPER_ADMIN_CREDENTIALS.email);
  await page.getByLabel("Parol", { exact: true }).fill("noto‘g‘ri-parol");
  await page.getByRole("button", { name: "Kirish", exact: true }).click();
  await expect(page.locator(".field-error[role=alert]")).toHaveText(
    "Email yoki parol noto‘g‘ri.",
  );
  await enter(page);
  const before = await data(page);
  await expect(page.locator(".stat-grid .stat-card")).toHaveCount(4);
  await expect(page.locator(".panel-card--chart svg")).toBeVisible();
  await page
    .getByRole("link", { name: "Sport xizmatlari", exact: true })
    .click();
  await expect(page.locator(".service-card").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Xizmat qo'shish", exact: true })
    .click();
  let dialog = page.getByRole("dialog");
  await dialog.getByLabel("Xizmat nomi").fill("Suzish QA");
  await dialog.getByLabel("Xizmat guruhi").selectOption("membership");
  await dialog.getByLabel("Narxi, so'm").fill("200000");
  await dialog.getByLabel("Ish jadvali").fill("Du–Sh 10:00");
  await dialog.getByLabel("Qisqa tavsif").fill("Suzish uchun demo abonement");
  await dialog.getByRole("button", { name: "Xizmatni yaratish" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Suzish QA", exact: true }),
  ).toBeVisible();
  await closeDrawer(page);
  await page.reload();
  await expect(
    page.locator(".service-card").filter({ hasText: "Suzish QA" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Muxlislar / CRM", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Muxlis qo'shish", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("F.I.Sh.").fill("QA Mijoz");
  await dialog.getByLabel("Telefon", { exact: true }).fill("+998901234567");
  await dialog.getByRole("button", { name: "Profil yaratish" }).click();
  await closeDrawer(page);
  await page.getByRole("link", { name: "Moliya", exact: true }).click();
  await expect(page.locator(".fin-metric-strip")).toBeVisible();
  await page.getByRole("button", { name: "+ Sotuv kiritish" }).click();
  dialog = page.getByRole("dialog");
  const current = await data(page);
  await dialog
    .getByLabel("Xizmat", { exact: false })
    .selectOption(current.services.find((s) => s.name === "Suzish QA").id);
  await dialog
    .getByLabel("Mijoz", { exact: false })
    .selectOption(current.customers.find((s) => s.name === "QA Mijoz").id);
  await dialog.getByLabel("Miqdor").fill("2");
  await dialog.getByRole("button", { name: "Saqlash", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(revenue(await data(page)) - revenue(before)).toBe(400000);
  await page.getByRole("button", { name: "+ Xarajat", exact: true }).click();
  dialog = page.getByRole("dialog");
  await dialog.getByLabel("Xarajat toifasi").selectOption("Ijara");
  await dialog.getByLabel("Summa").fill("100000");
  await dialog.getByRole("button", { name: "Saqlash", exact: true }).click();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(
    page.locator(".stat-card").first().locator(".stat-value"),
  ).toContainText("2 mln");
  await switchRole(page, "leader");
  await page.getByRole("link", { name: "KPI", exact: true }).click();
  await page.getByRole("button", { name: "Maqsadlarni o‘zgartirish" }).click();
  await page.getByRole("dialog").getByLabel("Raqamli rivojlanish").fill("90");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Saqlash", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Raqamli rivojlanish", exact: true })
    .click();
  await page.getByRole("button", { name: "Baholashni tahrirlash" }).click();
  await page.locator("input[type=range]").first().fill("95");
  await page.getByRole("button", { name: "Bahoni saqlash" }).click();
  await page.reload();
  expect(Object.values((await data(page)).assessments)[0].infrastructure).toBe(
    95,
  );
  await page.getByRole("link", { name: "Hisobotlar", exact: true }).click();
  await expect(page.locator(".report-template-grid")).toBeVisible();
  await page
    .getByRole("button", { name: "Yangi hisobot", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  await dialog.locator("input[name=report-format][value=CSV]").check();
  await dialog
    .getByRole("button", { name: "Hisobot yaratish", exact: true })
    .click();
  const row = page
    .locator("tbody tr")
    .filter({ hasText: "Boshqaruv hisoboti — yangi hisobot" });
  await expect(row).toBeVisible();
  const downloading = page.waitForEvent("download");
  await row.getByRole("button", { name: /hisobotini yuklash/ }).click();
  expect((await downloading).suggestedFilename()).toMatch(/\.csv$/);
  await page
    .getByRole("button", { name: "Yangi hisobot", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Hisobot yaratish", exact: true })
    .click();
  const pdfRow = page
    .locator("tbody tr")
    .filter({ hasText: "Boshqaruv hisoboti — yangi hisobot" })
    .filter({ hasText: "PDF" });
  await pdfRow.getByRole("button", { name: /hisobotini yuklash/ }).click();
  await expect(page.locator(".demo-print-report")).toBeVisible();
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".demo-print-report")).toBeVisible();
  await page.pdf({ path: "test-results/original-ui-report.pdf", format: "A4" });
  await page.emulateMedia({ media: "screen" });
  await closeDrawer(page);
  expect(errors).toEqual([]);
});

test("fan workflow and original account menu retain role permissions", async ({
  page,
}) => {
  await enter(page, "fan");
  await page.getByRole("button", { name: "Batafsil ko‘rish" }).first().click();
  await page
    .getByRole("button", { name: "Ariza qoldirish", exact: true })
    .click();
  await closeDrawer(page);
  await switchRole(page, "admin");
  await page.getByRole("link", { name: "Arizalar", exact: true }).click();
  await expect(page.locator(".demo-page-head h1")).toHaveCSS("font-size", "32px");
  expect((await page.locator(".demo-stat").first().boundingBox()).height).toBeLessThanOrEqual(80);
  await page.getByRole("button", { name: "Tasdiqlash", exact: true }).click();
  const toast = page.locator(".app-toast");
  await expect(toast).toBeVisible();
  await toast.evaluate((element) =>
    element.getAnimations().forEach((animation) => animation.finish()),
  );
  const toastBox = await toast.boundingBox();
  const viewport = page.viewportSize();
  expect(viewport.width - toastBox.x - toastBox.width).toBeLessThanOrEqual(25);
  expect(viewport.height - toastBox.y - toastBox.height).toBeLessThanOrEqual(25);
  await toast.getByRole("button", { name: "Xabarni yopish" }).click();
  await expect(toast).toHaveCount(0);
  await switchRole(page, "fan");
  await page
    .getByRole("link", { name: "Mening arizalarim", exact: true })
    .click();
  await expect(
    page.locator("td").getByText("Tasdiqlangan", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.locator("td").getByText("Tasdiqlangan", { exact: true }),
  ).toBeVisible();
  await page.goto("/moliya");
  await expect(
    page.getByRole("heading", {
      name: "Bu bo‘lim sizning rolingizga tegishli emas",
    }),
  ).toBeVisible();
});

test("original mobile UI, profile persistence and reset", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enter(page);
  await expect(page.locator(".stat-grid")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Menyuni ochish", exact: true })
    .click();
  await page
    .locator(".app-drawer-panel")
    .getByRole("link", { name: "Sozlamalar", exact: true })
    .click();
  await expect(page.locator(".settings-section-nav")).toBeVisible();
  await page.getByRole("button", { name: "Profilni tahrirlash" }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Ism va familiya")
    .fill("Demo Administrator");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Saqlash", exact: true })
    .click();
  await page.reload();
  expect((await data(page)).profiles.find((p) => p.id === "admin").name).toBe(
    "Demo Administrator",
  );
  await page.evaluate(() => localStorage.setItem("unrelated-data", "keep"));
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Demoni tiklash", exact: true })
    .click();
  await expect(page).toHaveURL(/\/login$/);
  expect(
    await page.evaluate(() => localStorage.getItem("unrelated-data")),
  ).toBe("keep");
});

test("corrupt storage recovery and unavailable storage remain usable", async ({
  page,
  context,
}) => {
  await page.goto("/login");
  await page.evaluate(
    (key) => localStorage.setItem(key, "{broken"),
    STORAGE_KEY,
  );
  await page.reload();
  await expect(page.locator(".demo-warning[role=alert]")).toContainText(
    "o‘qilmadi",
  );
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Demoni tiklash", exact: true })
    .click();
  await enter(page);
  const other = await context.newPage();
  await other.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Full", "QuotaExceededError");
    };
  });
  await enter(other);
  await expect(other.locator(".demo-warning[role=alert]")).toContainText(
    "saqlanmadi",
  );
});

test("all original internal pages render; analyst edits and logout are guarded", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await enter(page, "analyst");
  for (const route of [
    "/moliya",
    "/kpi",
    "/raqamli-rivojlanish",
    "/analitika",
    "/prognoz",
    "/reyting",
  ]) {
    await page.goto(route);
    await expect(page.locator(".app-content h1")).toBeVisible();
  }
  await page.goto("/raqamli-rivojlanish");
  await expect(
    page.getByRole("button", { name: "Baholashni tahrirlash" }),
  ).toBeDisabled();
  await switchRole(page, "super");
  await page.locator(".app-sidebar-context").click();
  await page.getByRole("menuitemradio", { name: /Humo Arena/ }).click();
  await page
    .getByRole("link", { name: "Sport xizmatlari", exact: true })
    .click();
  await expect(
    page.locator(".service-card").filter({ hasText: "Olimp" }),
  ).toHaveCount(0);
  await page.locator(".app-topbar .app-user-summary").click();
  await page.getByRole("menuitem", { name: "Tizimdan chiqish" }).click();
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  expect(errors).toEqual([]);
});


test("table actions stay compact and menus remain usable across screen sizes", async ({ page }) => {
  await enter(page, "super");
  for (const width of [1920, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, selector] of [["/muxlislar", ".crm-table"], ["/tashkilotlar", ".org-table"]]) {
      await page.goto(route);
      const table = page.locator(selector);
      const row = table.locator("tbody tr").first();
      await expect(row).toBeVisible();
      if (width >= 1440) {
        expect((await row.boundingBox()).height).toBeLessThan(100);
        const sizes = await table.evaluate(e => ({ actual: e.parentElement.scrollWidth, available: e.parentElement.clientWidth }));
        expect(sizes.actual).toBeLessThanOrEqual(sizes.available + 1);
      }
      const trigger = row.getByRole("button", { name: /: amallar$/ });
      await trigger.click();
      const menu = page.getByRole("menu", { name: /: amallar$/ });
      await expect(menu).toBeVisible();
      const bounds = await menu.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(900);
      expect(await menu.evaluate(e => getComputedStyle(e).backgroundColor)).toBe("rgb(255, 255, 255)");
      await page.keyboard.press("Escape");
      await expect(menu).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.getByRole("menuitem", { name: "Tahrirlash", exact: true }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await closeDrawer(page);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
});
