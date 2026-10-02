/**
 * Screen definitions for labeled UI recreations.
 *
 * A recreation is a hand-built React rendering of a screen that exists in a
 * real app's source code, shown where no real screenshot could be captured. It
 * is always labelled as a recreation, never presented as a capture.
 *
 * Rules for this file:
 *  - Every name, item, amount, count and metric below is invented dummy data.
 *    No real customers, staff, businesses, or contacts.
 *  - Metrics are deliberately mixed and modest. A recreation that reads like a
 *    trophy cabinet is advertising, not a design reference.
 *  - Labels and feature names are taken from the app's own source so the layout
 *    matches. Brand wordmarks and logo assets are not reproduced.
 *  - `id` must match the `id` on a real screenshot in `data/projects.ts`. When
 *    both exist for the same screen, the real capture wins and the recreation
 *    is dropped. See `resolveShowcaseScreens`.
 */

/**
 * The one caption every recreation must carry. Kept here so the component and
 * the data cannot drift, and asserted by `scripts/visual-check.mjs` against a
 * literal copy that the harness keeps to itself.
 */
export const RECREATION_CAPTION =
  "Concept UI inspired by the app, not a live screenshot.";

export type MockScreenId =
  | "login"
  | "dashboard"
  | "cashier"
  | "reports"
  | "home"
  | "checkin"
  | "invoice-detail";

export interface MockScreenDef {
  /**
   * Short benefit headline, at most six words. Written only from a feature the
   * project actually documents in `data/projects.ts` or in the app's own code.
   * When nothing is verifiable, this is the neutral screen name instead.
   */
  headline: string;
  /** One line under the headline, same sourcing rule. */
  subline: string;
  /** Accessible description of the recreated screen. */
  alt: string;
  /** Which frame the screen belongs in. */
  frame: "phone" | "browser";
  /** Logical authoring size. */
  logical: "phone" | "web";
  /** One-line note rendered outside the device, under the strip. */
  note?: string;
}

/* ------------------------------------------------------------------ *
 * THINKPOS — Flutter POS for barbershops.
 * Frame is a phone: the app is distributed as an Android APK.
 * ------------------------------------------------------------------ */

export const THINKPOS_SCREENS: Record<string, MockScreenDef> = {
  login: {
    headline: "Sign in to the counter",
    subline: "Username and password, then you are in.",
    alt: "Recreated THINKPOS sign-in screen: a single card with a brand block, a username field, a password field, and a Login button",
    frame: "phone",
    logical: "phone",
  },
  dashboard: {
    headline: "Today’s sales at a glance",
    subline: "Revenue, profit and the latest bills.",
    alt: "Recreated THINKPOS dashboard: a grid of shift, cash drawer, revenue, expense, profit, tip and order tiles, a payment split chart, staff and low-stock panels, and today's transactions table",
    frame: "phone",
    logical: "phone",
  },
  cashier: {
    headline: "Ring up a sale fast",
    subline: "Products, cart and payment in one screen.",
    alt: "Recreated THINKPOS checkout screen: a searchable product grid with category chips on the left, and a cart panel on the right with line items, subtotal, discount, total, and a pay button",
    frame: "phone",
    logical: "phone",
    note: "Receipt printing and photo capture are shown as static, labelled views only.",
  },
  reports: {
    headline: "Sales you can export",
    subline: "Period totals, trends and product rankings.",
    alt: "Recreated THINKPOS reports screen: five revenue tiles, a revenue trend line, product and expense tables, category and payment share charts, a weekday bar chart, and a cash audit log",
    frame: "phone",
    logical: "phone",
  },
};

/* ------------------------------------------------------------------ *
 * CLOCKORA — Flutter attendance app.
 * Frame is a phone: the app is distributed as an Android APK.
 * ------------------------------------------------------------------ */

export const CLOCKORA_SCREENS: Record<string, MockScreenDef> = {
  login: {
    headline: "Sign in to record attendance",
    subline: "Username and password.",
    alt: "Recreated CLOCKORA sign-in screen: a fingerprint badge, the product wordmark and tagline, username and password fields, a log in button, and a forgot password link",
    frame: "phone",
    logical: "phone",
  },
  home: {
    headline: "Today’s attendance at a glance",
    subline: "Shift time, team status and hours.",
    alt: "Recreated CLOCKORA dashboard: a greeting with the date, a daily attendance card with check in, working time and check out, a team pulse panel, present late leave and balance tiles, quick actions, and a weekly productivity bar chart",
    frame: "phone",
    logical: "phone",
  },
  checkin: {
    headline: "Check in from your phone",
    subline: "Record when you arrive and leave.",
    alt: "Recreated CLOCKORA attendance screen: a camera panel marked as a static view, a location line, a field attendance checkbox, and large check in and check out buttons",
    frame: "phone",
    logical: "phone",
    note: "Camera, geolocation and device-security checks are shown as a static, labelled view.",
  },
  reports: {
    headline: "Attendance you can report on",
    subline: "Lateness by team and top performers.",
    alt: "Recreated CLOCKORA analytics screen: a grouped department lateness bar chart, a fourteen day attendance trend line, and a top performers list",
    frame: "phone",
    logical: "phone",
  },
};

/* ------------------------------------------------------------------ *
 * TERAHOME — ISP billing platform, web app.
 * Only the screens that could not be captured get a recreation. The rest are
 * real screenshots and take precedence automatically.
 * ------------------------------------------------------------------ */

export const TERAHOME_SCREENS: Record<string, MockScreenDef> = {
  "invoice-detail": {
    headline: "Every invoice in one place",
    subline: "Amounts, dates and service items.",
    alt: "Recreated TERAHOME invoice detail screen: a back link and print receipt button, an invoice number with status badge and dates, the billed-to customer and payment method, the service line items, and the subtotal and total bill",
    frame: "browser",
    logical: "web",
    note: "This screen is blocked in the running app: the page calls a state hook after an early return, so React error #310 crashes every visit. The layout below is read from the source, not captured from a browser.",
  },
  whatsapp: {
    headline: "Invoices reach customers",
    subline: "Templates, variables and delivery status.",
    alt: "Recreated TERAHOME notification centre: sender credentials, template variables, and a message log table with status, recipient, content and sent time",
    frame: "browser",
    logical: "web",
    note: "No capture was possible because the environment blocks all outbound traffic, so a live capture would have shown a misleading provider error. The connection state below reads disconnected because no provider was contacted.",
  },
};

/* ------------------------------------------------------------------ *
 * Dummy content. Fictional people, fictional shop, round amounts.
 * ------------------------------------------------------------------ */

export const DUMMY = {
  thinkpos: {
    store: "Barbershop Contoh",
    staff: [
      { name: "Rina", cuts: 7 },
      { name: "Bayu", cuts: 5 },
      { name: "Sari", cuts: 4 },
    ],
    categories: ["Semua", "Potong", "Rawat", "Minum"],
    products: [
      { name: "Potong", price: 65000, stock: 40 },
      { name: "Cuci", price: 45000, stock: 40 },
      { name: "Perawatan", price: 85000, stock: 12 },
      { name: "Cukur", price: 35000, stock: 40 },
      { name: "Ramah", price: 150000, stock: 6 },
      { name: "Pomade", price: 120000, stock: 4 },
      { name: "Air", price: 5000, stock: 60 },
      { name: "Kopi", price: 18000, stock: 30 },
    ],
    cart: [
      { name: "Potong", qty: 1, price: 65000 },
      { name: "Cuci", qty: 1, price: 45000 },
      { name: "Air", qty: 2, price: 5000 },
    ],
    discountPct: 0,
    /** Modest, mixed movements. Nothing here reads as a record. */
    reportKpis: [
      { label: "Kas Masuk", value: "Rp 4,1 jt" },
      { label: "Pendapatan", value: "Rp 4,3 jt" },
      { label: "Pengeluaran", value: "Rp 640 rb" },
      { label: "Laba Bersih", value: "Rp 3,6 jt" },
      { label: "Pesanan", value: "38" },
    ],
    /** 14 points, indexed by day of the recreated month. */
    revenueTrend: [2.1, 2.6, 2.3, 3.1, 2.9, 3.4, 3.2, 3.6, 3.1, 3.8, 3.5, 3.9, 3.7, 4.1],
    topProducts: [
      { name: "Potong", qty: 21, revenue: "Rp 1,3 jt" },
      { name: "Cuci", qty: 17, revenue: "Rp 765 rb" },
      { name: "Perawatan", qty: 9, revenue: "Rp 765 rb" },
      { name: "Cukur", qty: 14, revenue: "Rp 490 rb" },
    ],
    expenses: [
      { desc: "Listrik", category: "Operasional", total: "Rp 320 rb" },
      { desc: "Restok", category: "Stok", total: "Rp 240 rb" },
      { desc: "Sabun", category: "Perlengkapan", total: "Rp 80 rb" },
    ],
    categoryShare: [
      { name: "Potong", pct: 52 },
      { name: "Perawatan", pct: 23 },
      { name: "Retail", pct: 15 },
      { name: "Minuman", pct: 10 },
    ],
    paymentShare: [
      { name: "Cash", pct: 46 },
      { name: "QRIS", pct: 33 },
      { name: "Transfer", pct: 21 },
    ],
    weekdayBars: [
      { label: "Mon", value: 3.4 },
      { label: "Tue", value: 3.9 },
      { label: "Wed", value: 3.2 },
      { label: "Thu", value: 4.1 },
      { label: "Fri", value: 4.4 },
      { label: "Sat", value: 5.1 },
      { label: "Sun", value: 2.2 },
    ],
    auditLog: [
      { time: "02/10 09:14", type: "IN", desc: "Setoran kas awal", amount: "+Rp 500.000", balance: "Rp 500.000" },
      { time: "02/10 12:40", type: "OUT", desc: "Beli perlengkapan", amount: "-Rp 120.000", balance: "Rp 380.000" },
      { time: "02/10 18:02", type: "IN", desc: "Setoran kasabu", amount: "+Rp 1.240.000", balance: "Rp 1.620.000" },
    ],
    transactions: [
      { bill: "INV-0001", customer: "Umum", time: "09:12", method: "Cash", total: "Rp 65.000", tip: "-" },
      { bill: "INV-0002", customer: "Dewi", time: "10:03", method: "QRIS", total: "Rp 150.000", tip: "Rp 15.000" },
      { bill: "INV-0003", customer: "Rizky", time: "11:26", method: "Cash", total: "Rp 90.000", tip: "-" },
      { bill: "INV-0004", customer: "Umum", time: "13:47", method: "Transfer", total: "Rp 220.000", tip: "-" },
    ],
  },

  clockora: {
    staff: [
      { name: "Andi", state: "present" },
      { name: "Bunga", state: "late" },
      { name: "Citra", state: "present" },
    ],
    summary: [
      { label: "Present", value: "18" },
      { label: "Late", value: "3" },
      { label: "Leave", value: "1" },
      { label: "Balance", value: "2" },
    ],
    quickActions: ["Request Leave", "Overtime Form", "Field Attendance", "My KPI Tasks"],
    weeklyBars: [
      { label: "Mon", value: 8 },
      { label: "Tue", value: 7.5 },
      { label: "Wed", value: 8.5 },
      { label: "Thu", value: 6.5 },
      { label: "Fri", value: 7 },
      { label: "Sat", value: 4 },
      { label: "Sun", value: 0 },
    ],
    nav: ["Home", "Absen", "Performance", "KPI", "History"],
    departments: [
      { name: "Operasional", total: 42, late: 6 },
      { name: "Pemasaran", total: 28, late: 4 },
      { name: "Gudang", total: 19, late: 2 },
    ],
    /** 14 points, indexed by day. */
    attendanceTrend: [34, 31, 36, 33, 29, 18, 6, 33, 35, 32, 30, 37, 34, 33],
    lateTrend: [4, 3, 5, 4, 3, 2, 0, 4, 5, 4, 3, 5, 4, 4],
    topPerformers: [
      { name: "Andi", days: 20 },
      { name: "Citra", days: 19 },
      { name: "Bunga", days: 18 },
    ],
  },

  terahome: {
    invoice: {
      number: "INV-2026-01-0001",
      status: "UNPAID",
      date: "01 Januari 2026",
      dueDate: "25 Januari 2026",
      customerName: "Kedai Contoh",
      customerCode: "CUST-00001",
      customerPhone: "0812-0000-0001",
      lineItems: [
        { description: "Paket 10 Mbps", unitPrice: "Rp 150.000", amount: "Rp 150.000" },
        { description: "Biaya Instalasi", unitPrice: "Rp 100.000", amount: "Rp 100.000" },
      ],
      subtotal: "Rp 250.000",
      total: "Rp 250.000",
    },
  },
};