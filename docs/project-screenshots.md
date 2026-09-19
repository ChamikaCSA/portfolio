# Project screenshots

Captured on 2026-09-18–19 from the actual application interfaces. The 70 lossless WebP
assets live in `public/projects/`; `content/projects.ts` supplies their captions,
original pixel dimensions, and sample-data labels.

The project-card cover is selected separately with `coverShotId`. Covers prioritize
the core product workflow or a populated overview; galleries follow the app’s
natural flow from entry and setup through actions, results, and administration. Desktop galleries contain an even number of
screens; mobile galleries contain multiples of four for complete desktop rows.

| Project | Capture source | Count | Preview cover and available screens |
| --- | --- | --- | --- |
| AegisHealth | Local Next.js frontend and native Electron runtime | 8 | Training metrics cover; overview, clients, configuration, privacy, hospital agent logs, audit trail, released-model controls |
| CPR Assist | Local Expo web preview | 8 | Session feedback cover; history, instructor analytics, coaching home, readiness, live interface, administration, account |
| Logbook | Local Flutter web build | 8 | Cash flow cover; ledger, insights, reports, transaction entry, categories, team, settings |
| Phishing Simulator | Local Next.js frontend | 6 | Performance analytics cover; simulations, authoring, quizzes, questions, learner progress |
| AI-Powered CRM | Local Next.js frontend | 6 | Sales overview cover; pipeline, leads, lead profile, forecasting, reports |
| Receipt Tracker | Local Next.js frontend | 4 | Extracted details cover; library, upload workspace, plans |
| FinFlow-AI | Native Android emulator | 4 | Financial dashboard cover; expense entry, learning, coaching |
| Spritz Perfumes | Live storefront and isolated local admin | 10 | Catalog cover; storefront, product, brands, brand catalog, shopping bag, admin overview, products, inventory, orders |
| NKR Motors | https://nkr.lk/ and isolated local admin | 8 | Services cover; homepage, workshop, service process, appointment request, tracking, admin bookings and booking detail |
| Cinnamon ERP | Local React frontend | 8 | Operations overview cover; inventory, lands, employees, tasks, manufacturing, sales, accounting |

## Resolution and viewing

- Desktop: 1600 × 1000 viewport at 2× density, saved at **3200 × 2000**.
- Expo and Flutter: 430 × 932 viewport at 3× density, saved at **1290 × 2796**.
- Electron: native Electron 41 renderer captured at **3200 × 2000**, with the
  original preload bridge and local fixture responses for agent IPC.
- Native Android: **1080 × 2400** emulator capture.
- Captures are encoded as lossless WebP without resizing. The gallery bypasses
  further image recompression and preserves the complete frame.
- Each case-study image opens at full source quality in a minimal OS-style preview
  window, fitted to the screen. Its red close control or Escape closes the viewer.

## Sample-data previews

Local app and admin previews use fictional users, transactions, receipts, leads,
training sessions, and metrics, as authorized for portfolio presentation. Their
captions explicitly identify sample data. These are screenshots
of the existing app components, not generated or redesigned mockups. Metrics and
AI text are illustrative fixtures, not claimed production measurements or live
model output. Public Spritz and NKR captures show the deployed sites; their admin
screens use disconnected local previews with sample data.

Local previews ran from temporary project copies with isolated fixture providers
in place of authentication and backend calls. The original application sources
and production databases were not changed. Runtime-only adjustments included CRM
import casing, disabling Node's experimental web storage, and correcting chart
color references in the Phishing Simulator preview so its existing graphs render.

The CPR camera preview is disabled in the sample setup and live-interface captures;
no camera footage is recorded and the coaching values are illustrative. The Spritz
shopping-bag capture used a temporary cart item, removed afterward; no order was placed.

For future updates, run the relevant app with disconnected demo fixtures, wait
for fonts, data, and images to finish loading, and capture at the dimensions above.
Encode the capture losslessly, update its `shots` entry, and check both the gallery
and full-size viewer. Never substitute an upscaled small capture for a new one.
