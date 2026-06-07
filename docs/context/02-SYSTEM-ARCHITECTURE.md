# Linm F&B — System Architecture

## 1. Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════╗
║                        CLIENT LAYER                              ║
╠════════════════════════════╦═══════════════════════════════════╣
║  order.*.linm.vn           ║  admin.*.linm.vn / kitchen.*       ║
║  Guest PWA (React MFE)     ║  single-spa shell + FnB MFEs       ║
║  QR scan → table session   ║  JWT staff · kitchen display       ║
╚════════════════════════════╩═══════════════════════════════════╝
              │                              │
              ▼                              ▼
╔══════════════════════════════════════════════════════════════════╗
║              API GATEWAY — YARP / nginx  (api.*.linm.vn)         ║
║         /web-bff/api/v1/fnb/*  ·  rate limit · CORS · audit        ║
╚══════════════════════════════════════════════════════════════════╝
    │              │              │              │              │
    ▼              ▼              ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐
│ FnB BFF │  │  Order   │  │ Kitchen  │  │ Payment  │  │ Admin/Menu  │
│  :9080  │  │  :5081   │  │  :5082   │  │  :5083   │  │   :5084     │
└────┬────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘
     │            │             │             │               │
     │       ┌────▼────┐   ┌────▼────┐   ┌────▼────┐    ┌─────▼─────┐
     │       │fnb_order│   │fnb_kitch│   │fnb_pay  │    │fnb_admin  │
     │       │PostgreSQL│  │PostgreSQL│  │PostgreSQL│   │PostgreSQL │
     │       └─────────┘   └─────────┘   └─────────┘    └───────────┘
     │
     ├──────────► Linm.Authentication (:5001) — staff JWT
     └──────────► Linm.Notification (:5002) — SignalR hubs
```

## 2. Service Catalog

| Service | Port | Responsibility |
|---------|------|----------------|
| **Linm.FnB.Bff** | 9080 | BFF proxy guest + staff; guest session header; file upload payment proof |
| **Linm.FnB.Order** | 5081 | Table QR, sessions, cart, combos, addons, call waiter, request bill |
| **Linm.FnB.Kitchen** | 5082 | Kitchen tickets, confirm prep, status by table/order |
| **Linm.FnB.Payment** | 5083 | QR CK **tự gen** chuẩn NAPAS/EMV (preset amount), proof upload, **đối soát tay** — **không API NH phase 1** · xem `08-QR-PAYMENT.md` |
| **Linm.FnB.Admin** | 5084 | Branches, tables, menu CRUD, payment account config, QR preview |
| **Linm.Authentication** | 5001 | Staff login, roles (waiter, kitchen, manager, owner) |
| **Linm.Notification** | 5002 | SignalR: `TableSessionHub`, `KitchenHub`, payment status |

## 3. Database Isolation

| Database | Owns |
|----------|------|
| `fnb_order` | `tables`, `table_qr_tokens`, `sessions`, `order_lines`, `addons` |
| `fnb_kitchen` | `kitchen_tickets`, `ticket_lines`, prep timestamps |
| `fnb_payment` | `payment_requests`, `payment_accounts`, `transfer_proofs`, `settlements` |
| `fnb_admin` | `branches`, `menu_items`, `combos`, `categories`, `payment_qr_templates` |

Cross-service reads via BFF aggregation or domain events — không join cross-DB.

## 4. Frontend Surfaces (MFE)

| MFE Package | Route prefix | Users |
|-------------|--------------|-------|
| `@linm/fnb-guest` | `/t/{tableToken}` | Khách QR |
| `@linm/fnb-kitchen` | `/kitchen` | Bếp |
| `@linm/fnb-admin` | `/admin/*` | Quản lý, thu ngân |
| `@linm/fnb-reports` | `/reports` | Biểu đồ, bảng kê |

Shell: `@linm/nav` — import map, auth, company/branch switcher.

## 5. Key Flows (summary)

1. **Scan QR** → resolve `tableId` + optional `sessionId` → create/join session → menu browse
2. **Add to cart** → item + addons/combo → POST order line → event → kitchen ticket
3. **Request payment** → review bill → choose cash / Momo / bank → server gen QR CK (EMV preset amount) → guest transfer → upload proof
4. **Manager/cashier đối soát tay** (amount + nội dung CK + ảnh) → confirm/reject → close session → feedback guest
5. **Manager** → configure payment accounts, preview QR, multi-branch dashboard
