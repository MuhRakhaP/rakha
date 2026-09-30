# Screenshot shot list

Every project on the site currently renders without images. Capture the shots
below with **dummy data only** and drop them into the matching folder — the site
picks them up automatically, no code change needed.

## Rules

- **Dummy data only.** Fake names, fake phone numbers, reserved/example IPs,
  round amounts. No production customer records, ever.
- **Blur or replace** anything you cannot replace: real names, phone numbers,
  email addresses, IP addresses, MAC addresses, device serials, invoice
  numbers, real balances or revenue totals, live API endpoints.
- **No infrastructure details.** Hide hostnames, IP addresses, dashboard
  addresses, server names, and internal URLs in browser chrome.
- **Hide the OS status bar clock/date** if it shows a real device identity.
- Keep the same viewport and light/dark mode across a project's shots.

## Recommended specs

| Target | Use |
| --- | --- |
| Desktop / web | 1440×900 (landscape), exported PNG |
| Mobile / web | 390×844 (portrait), exported PNG |
| Mobile app | device resolution, portrait, no system chrome if possible |
| Format | PNG for UI, WebP or AVIF if size matters |
| File size | under 400 KB each — the site serves them through `next/image` |

Next.js needs intrinsic dimensions to lay these out. Set them on the
`Image` in `components/projects/project-gallery.tsx` (currently web
1600×1000, mobile 1080×1920). **If your captures have different proportions,
update those numbers**, otherwise images will be scaled wrong.

## Where the files go

```
public/projects/terahome/<name>.png
public/projects/thinkpos/<name>.png
public/projects/clockora/<name>.png
public/projects/kopiflow/<name>.png
public/projects/ai-helpdesk-assistant/<name>.png
public/projects/outstanding-delivery-automation/<name>.png
```

Then set `thumbnail` to the first filename in `data/projects.ts` and add each
one to `screenshots` with real alt text.

---

## TERAHOME — `public/projects/terahome/`

| Filename | Screen to capture | Watch out for |
| --- | --- | --- |
| `dashboard.png` | Operational dashboard — customers, revenue, PPPoE status | Use round figures, not real revenue |
| `customers.png` | Customer list | Fake names only |
| `customer-detail.png` | Single customer with subscription and invoices | Fake phone numbers, fake IPs |
| `billing-invoice.png` | Generated invoice | Fake invoice number, fake amounts |
| `payment.png` | Payment status / Xendit flow | Hide real merchant IDs and API endpoints |
| `pppoe-status.png` | MikroTik PPPoE account status | Use documentation-range IPs (`192.0.2.x`) |
| `notifications.png` | WhatsApp notification log | Fake recipient numbers only |

## THINKPOS — `public/projects/thinkpos/` (mobile, framed)

| Filename | Screen to capture | Watch out for |
| --- | --- | --- |
| `login.png` | Login screen | Dummy credentials, no saved account |
| `dashboard.png` | Sales dashboard with chart | Dummy sales figures |
| `checkout.png` | Cashier checkout | Dummy products and totals |
| `receipt.png` | Receipt preview / printed output | Dummy customer and amounts |
| `reports.png` | Reports with Excel export | Dummy data |
| `products.png` | Product and category management | Dummy product images |

## CLOCKORA — `public/projects/clockora/` (mobile, framed)

| Filename | Screen to capture | Watch out for |
| --- | --- | --- |
| `login.png` | Login screen | Dummy credentials |
| `attendance-scan.png` | QR scanning screen | No live QR codes |
| `attendance-checkin.png` | Check-in confirmation | **Photo and location must be obviously fake** |
| `attendance-list.png` | Attendance records | Fake employee names |
| `map-location.png` | Location verification | Use a location you are actually at, or a dev seed |
| `report.png` | Workforce report | Dummy figures |

## KOPIFLOW — `public/projects/kopiflow/`

| Filename | Screen to capture | Watch out for |
| --- | --- | --- |
| `login.png` | Login screen | Dummy credentials |
| `dashboard.png` | Dashboard — purchases, expenses, stock | Round figures |
| `pembelian.png` | Purchases list | Fake suppliers and amounts |
| `stok.png` | Warehouse stock by coffee type | Fake stock levels |
| `suppliers.png` | Suppliers | Fake company names |
| `produksi.png` | Production | Dummy batches |
| `biaya.png` | Costs — labour and operational | Fake payroll figures |

## AI Helpdesk Assistant — `public/projects/ai-helpdesk-assistant/`

No repo was found for this project, so these are the screens to capture **if
you still have access to the running application**.

| Filename | Screen to capture | Watch out for |
| --- | --- | --- |
| `tickets.png` | Ticket list | Fake customer names and messages |
| `ticket-detail.png` | Single ticket with history | Fake conversation content |
| `routing.png` | Routing rules / categories | Safe |
| `assistant.png` | RAG assistant answering a question | No real internal docs in the answer |

## Outstanding Delivery Automation — `public/projects/outstanding-delivery-automation/`

No repo was found for this project. Capture **if you still have access**.

| Filename | Screen to capture | Watch out for |
| --- | --- | --- |
| `outstanding-list.png` | Outstanding delivery list | Fake supplier and PO data |
| `po-detail.png` | Purchase order detail | Fake amounts and dates |
| `followup.png` | Supplier follow-up log | Fake recipient numbers |
| `auto-in-portal.png` | Auto In Portal entry screen | Safe, but use dummy suppliers |
