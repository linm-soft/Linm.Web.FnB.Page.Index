# MFE Setup Review — @fnb-demo (Linm.Web.FnB.Demo)

**Date:** 2026-06-09  
**Mode:** Static demo (not React/webpack MFE)  
**Deploy target:** `linm-soft/Linm.Web.FnB.Page.Index` · `PROJECT_NAME=fnb-demo`  
**Standalone:** `yarn start` → port **9300** · profile FnB `staticSites` trong `Root/src/mfe/fragments/demo.json`

## Summary

| Area | Pass | Fail | N/A |
|------|------|------|-----|
| 1 Package | 1 | 0 | 4 |
| 2 Webpack | 0 | 0 | 22 |
| 2b Mount guide | 0 | 0 | 2 |
| 3 Entry/Router | 0 | 0 | 10 |
| 4 Run modes | 0 | 0 | 8 |
| 5 Layout shell | 0 | 0 | 5 |
| 6 Dev /dev | 0 | 0 | 5 |
| 7 Shared libs / API | 0 | 0 | 12 |
| 8 Structure | 4 | 0 | 4 |
| 9 Styles | 2 | 0 | 0 |
| 10 Build | 2 | 0 | 2 |
| 11 Manifest routes | 0 | 0 | 5 |

> **Note:** `/review-mfe-setup` checklist §1–§11 targets React single-spa MFEs. This repo is a **static pitch site** (`gen-app-demo` pattern) — webpack, MemoryRouter, `mfe.routes.json`, and API layer items are **N/A**.

## Open gaps (by risk)

| ID | Risk | Gap | File / location | Fix hint | Status |
|----|------|-----|-----------------|----------|--------|
| SETUP-DEMO-P1-01 | P1 | `package.json` name `linm-web-fnb-demo` — lệch deploy id `fnb-demo` | `package.json` | Đổi `name` → `@fnb-demo` | ✅ Fixed |
| SETUP-DEMO-P1-02 | P1 | Thiếu `logo-128.png` · `icon-192.png` — CI fail + broken favicon | `assets/linm/` | Copy từ common-components + Root — `10-APP-BRANDING.md` | ✅ Fixed |
| SETUP-DEMO-P2-01 | P2 | Không có `docs/mfe-setup-review.md` | `docs/` | Ghi review static scope | ✅ Fixed |
| SETUP-DEMO-P2-02 | P2 | Không script `yarn validate` local | `package.json` | Optional — mirror CI validate step |

## Passed highlights

- **Deploy pipeline:** `deploy-to-fnb-pages.yml` → `scripts/deploy-fnb-static-pages.mjs` → `Linm.Web.FnB.Page.Index` **`/demo/`** với commit `fnb-demo@{version}` (không wipe MFE root)
- **CI validate:** 4 HTML + assets + deploy script syntax (`node --check`)
- **SSOT context:** `docs/context/01–13` — toàn bộ FnB MFE tham chiếu repo này
- **Site files:** `index.html` (pitch) · `app-demo.html` (UI personas) · `workflow-demo.html` (technical) · `pricing.html`
- **Branding:** `assets/linm/app-brand.css` parity các MFE `@linm/fnb-*`

## Static demo vs React MFE

| Concern | @fnb-demo | `@linm/fnb-guest` etc. |
|---------|-----------|------------------------|
| Build | None (open HTML) | webpack + SystemJS |
| Deploy | Pages Index static push | CDN bundle + `mfe.routes.json` |
| Port | N/A | 90xx / 91xx |
| npm scope | `@fnb-demo` (identity only) | `@linm/fnb-*` (runtime import map) |

## Recommended next steps

1. Push `main` → verify **Deploy to FnB Pages Index** + commit `fnb-demo@…` on Pages repo
2. Implement guest/staff pages từ `app-demo.html` personas → respective `@linm/fnb-*` MFEs
3. Payment spec parity: `08-QR-PAYMENT.md` · `08b-MOMO-PAYMENT.md` → Guest MFE (`/fnb-rule`)

## Local preview

```powershell
cd D:\MFE-FNB\Linm.Web.FnB.Demo
yarn start
# → http://localhost:9300/index.html
# → http://localhost:9300/app-demo.html

# Hoặc full FnB stack (shell + demo):
cd ..\Linm.Web.FnB.Admin\run-dev
yarn dev
```
