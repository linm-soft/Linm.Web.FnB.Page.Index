# Linm F&B — Dashboard & Reports

## 1. Micro-app Routes

| Route | MFE | Role |
|-------|-----|------|
| `/reports/revenue` | `@linm/fnb-reports` | Owner, manager |
| `/reports/payments` | `@linm/fnb-reports` | Thu ngân, manager |
| `/reports/menu-analytics` | `@linm/fnb-reports` | Manager, owner |
| `/admin/branches` | `@linm/fnb-admin` | Owner |
| `/admin/payment-setup` | `@linm/fnb-admin` | Manager |

## 2. Report Types

| Report | Metrics | Chart |
|--------|---------|-------|
| **Bảng kê thanh toán** | Theo ngày/ca; tiền mặt / Momo / CK; trạng thái xác nhận | Table + export Excel |
| **Doanh thu chi nhánh** | Gross, net, avg ticket | Line + bar by branch |
| **Món bán chạy** | Top items, combos, addon attach rate | Horizontal bar + table |
| **Món ưa thích** | Topping/addon %, combo patterns per table | Pill grid + co-occurrence |
| **Thống kê số món** | Tổng SL món, SKU active, món/đơn TB | Stat cards on report tab |
| **Thời gian bếp** | Avg prep time, SLA breach | Gauge + trend |
| **Feedback** | Rating avg, NPS proxy | Star distribution |

## 3. Filters

- Chi nhánh (multi-select owner; single manager)
- Khoảng ngày (business timezone `X-Timezone`)
- Ca làm việc (optional shift config)
- Phương thức thanh toán

## 4. Partner / Embed Access

Phase 2: read-only embed token cho franchise partner — scoped `branchId`, reports only, 24h TTL.

## 5. Realtime Widgets (admin home)

- Bàn đang phục vụ / trống
- Đơn bếp chờ xác nhận
- Thanh toán chờ duyệt ảnh CK
- SignalR-driven — không poll

## 6. Menu analytics API (Phase 2)

```
GET /web-bff/api/v1/fnb/reports/menu/top-items?branchId=&from=&to=
GET /web-bff/api/v1/fnb/reports/menu/addon-preferences?branchId=&from=&to=
GET /web-bff/api/v1/fnb/reports/menu/summary?branchId=&from=&to=
```

Response `top-items`: `{ menuItemId, name, qty, revenue, orderSharePct }[]`  
Response `addon-preferences`: `{ addonId, name, attachRatePct }[]`  
Response `summary`: `{ itemsSold, activeSkus, avgItemsPerOrder, ordersWithAddonsPct }`

Demo UI: `app-demo.html` → Quản lý → Báo cáo → tab **Món ưa thích**.
