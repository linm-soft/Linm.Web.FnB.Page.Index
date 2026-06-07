# Linm F&B — Overview

## 1. What is Linm F&B?

Linm F&B là nền tảng quản lý nhà hàng / quán ăn đa chi nhánh (demo pilot: **quán lẩu gà**), xây dựng theo kiến trúc microfrontend (MFE) và microservice chuẩn Linm.

Đối tượng: chuỗi lẩu gà, nhà hàng lẩu/nướng đa chi nhánh — khách order tại bàn, topping linh hoạt, bếp ra nồi theo bàn.

> **Lẩu Gà Ngon** (demo) trên **Linm F&B** = Guest QR · Kitchen · Payment · Analytics · **Hỗ trợ hộ kinh doanh — bớt lo thuế**

## 2. Core Principles

| # | Principle | Technical meaning |
|---|-----------|-------------------|
| 1 | Guest-first ordering | Session bàn qua QR token; chỉ cần tên + SĐT (optional); không JWT khách |
| 2 | Table-centric session | Một bàn = một hoặc nhiều session; scan mới hoặc join session đang mở |
| 3 | Realtime kitchen | SignalR push ticket bếp; xác nhận theo đơn / theo bàn |
| 4 | Payment with proof | QR CK tự gen (chuẩn NAPAS/EMV) preset amount + nội dung; upload biên lai (**lưu ảnh ≤30 ngày**); xác nhận → trích **mã giao dịch** lưu lâu dài; quản lý **đối soát tay** — xem `08-QR-PAYMENT.md` |
| 5 | Multi-branch tenancy | `companyId` / `branchId` trên mọi entity; menu và QR thanh toán theo chi nhánh |
| 6 | MFE modular UI | Shell `@linm/nav` + MFE: guest-order, **waiter**, kitchen, cashier, admin, reports |
| 7 | Event-driven side effects | Order placed → kitchen ticket; payment confirmed → feedback prompt |
| 8 | Audit & settlement | Bảng kê thanh toán, biểu đồ doanh thu; lịch sử xác nhận staff |
| 9 | Staff service & feedback | NV login · xác nhận order/phục vụ/dọn bàn · điểm ca 60% join / 40% full |

Chi tiết NV: `docs/context/07-STAFF-SERVICE.md`  
Branding app (logo Linm, tên `LINM F&B — {tenant}`): `docs/context/10-APP-BRANDING.md`

## 3. Domain Map

| Domain | App | Type | Access |
|--------|-----|------|--------|
| `order.{tenant}.linm.vn` | Guest Order PWA | Mobile web, QR entry | Public — table token |
| `admin.{tenant}.linm.vn` | Staff MFE Shell | single-spa (React) | JWT staff / manager |
| `kitchen.{tenant}.linm.vn` | Kitchen Display | MFE fullscreen | JWT kitchen role |
| `api.{tenant}.linm.vn` | API Gateway (YARP) | Reverse proxy | Bearer / guest session header |
| `cdn.{tenant}.linm.vn` | Menu images, QR assets | Static / blob | Public read |

## 4. Rollout timeline

| Phase | Thời gian | Phạm vi |
|-------|-----------|---------|
| **1 — Go-live pilot** | **1–2 tuần** | **1 chi nhánh**: Guest QR, NV phục vụ, bếp, thu ngân, menu/bàn/QR in, training |
| **2 — Mở rộng** | 2–3 tuần / đợt | Thêm chi nhánh, Momo, feedback NV, analytics món |
| **3 — Chuỗi** | 4+ tuần | Franchise dashboard, embed báo cáo, OCR, loyalty |

**Tuần 1 (typical):** tenant + menu seed · sơ đồ bàn + QR print · deploy BFF/Order/Kitchen/Payment · UAT nội bộ.  
**Tuần 2:** ca pilot · hotfix · bàn giao vận hành.

Demo pitch: `index.html` § Lộ trình triển khai.  
Mẫu chào hàng gửi khách: `11-SALES-OUTREACH.md`
