# EDI Central Tracking — Operations (MVP preview)

Simplified **hypothesis prototype** for the vendor-operations EDI central tracking tool. This MVP build keeps triage, filters, order detail, drawer notes, and **bulk reprocess** — but removes line-level corrective flows and several full-version actions.

## Live site (GitHub Pages)

After enabling Pages (**Settings → Pages → Branch `main` / `/ (root)`**), the app is available at:

**https://abinbev-silvarenan.github.io/-abinbev-silvarenan-edi-central-tracking-ops-tool-mvp/**

This repository includes a `.nojekyll` file so the `_shared/` assets folder is served correctly.

## MVP scope (out of scope vs full prototype)

| Removed in MVP |
|----------------|
| Fix UPC (line-level UPC picker) |
| Accept and reprocess with requested price |
| Accept and reprocess with price list |
| Skip rule and reprocess (bypass radio) |
| View summary shortcut on the orders list |
| Corrective-action sections in drawer / item page |
| Accept selected (bulk price accept) |

## Local preview

```powershell
.\.serve-3001.ps1
```

Then open **http://127.0.0.1:3001/index.html**

(Port 3000 may already be used by the full prototype — use 3001 for this MVP build.)

Or open `index.html` directly in a browser.

## Analytics dashboard

Open `_shared/dashboard.html?id=edi-central-tracking-ops-tool-mvp` (same origin as the prototype) to view click tracking for this build.

## Full prototype

The complete HLR-aligned build lives in the sibling folder `edi-central-tracking-ops-tool` and at [github.com/abinbev-silvarenan/edi-central-tracking-ops-tool](https://github.com/abinbev-silvarenan/edi-central-tracking-ops-tool).
