# Linm F&B — Staff Service & Feedback

> Pilot: **Lẩu Gà Ngon** · MFE package: `@linm/fnb-waiter` · Auth: JWT staff/manager

## 1. Roles & login

| Role | Login | MFE / route |
|------|-------|-------------|
| Guest (QR) | Không — table session token | `order.{tenant}.linm.vn` |
| Waiter | JWT `role: waiter` | `@linm/fnb-waiter` mobile |
| Cashier | JWT `role: cashier` | `@linm/fnb-cashier` tablet |
| Kitchen | JWT `role: kitchen` | `@linm/fnb-kitchen` |
| Manager | JWT `role: manager` | `@linm/fnb-admin` |

Nhân viên phục vụ và quản lý **bắt buộc đăng nhập**. Khách chỉ dùng QR bàn.

## 2. Waiter responsibilities

### 2.1 Table lifecycle

1. **Đón bàn** — NV full ca (hoặc được assign) mở phục vụ bàn khi khách vào.
2. **Join phục vụ** — Nhiều NV có thể join cùng bàn (hỗ trợ ca cao điểm).
3. **Dọn bàn** — Sau khi khách rời: xác nhận lau bàn + kê lại đồ (`TableResetConfirmed`).

### 2.2 Order confirmation

- Order từ Guest QR vào hàng đợi **chờ NV xác nhận** trước khi gửi bếp.
- NV bấm **Xác nhận → Bếp** → event `FnB.OrderConfirmedByWaiter` → Kitchen ticket.
- **Quota thuê Linm (mô hình A):** mỗi lần xác nhận đơn = **1 lượt quota** — xem `09-PRICING-PROPOSAL.md` §4 · `pricing.html#quota`.

### 2.3 Service requests (realtime)

Khách gọi qua PWA; NV nhận push / danh sách chờ:

| Request type | Guest action | Waiter confirm |
|--------------|--------------|----------------|
| Order mới | Thêm món giỏ | Xác nhận order |
| Gọi thêm | Nước lẩu, cồn, khăn… | ✓ Đã phục vụ |
| Hoàn trả | Trả món | ✓ Hoàn thành |
| Lau bàn | Vệ sinh giữa bữa | ✓ Hoàn thành |
| Thanh toán | Yêu cầu bill / CK | Chuyển Thu ngân hoặc xác nhận TT |

NV có thể **scan QR request/bàn** hoặc **bấm xác nhận** trên danh sách.

## 3. Payment & feedback attribution

- NV (hoặc Thu ngân) **xác nhận thanh toán** → đóng session → Guest thấy màn feedback.
- Feedback mặc định gắn **NV xác nhận TT** (payment confirmer) — dùng để coaching cá nhân.
- Khách chọn NV đánh giá:
  - **Quét QR badge** nhân viên (staffId encoded)
  - **Lookup tên** — search theo ca + bàn (`GET /staff/on-shift?branchId=&q=`)

## 4. Shift score model (60 / 40)

Điểm ca được tính **chung pool feedback** trong ca, chia theo vai trò:

| Vai trò | Tỷ lệ | Mô tả |
|---------|-------|-------|
| **Join phục vụ** | **60%** | NV join bàn, xác nhận request, phục vụ món |
| **Full ca** | **40%** | NV trực ca, trách nhiệm bàn assign, xác nhận TT |

Công thức gợi ý:

```
shiftScore(staff) =
  0.6 × avg(feedback where staff joined table OR confirmed service)
+ 0.4 × avg(feedback where staff is full-shift owner OR payment confirmer)
```

Manager xem tab **Đánh giá NV**: điểm trung bình, số feedback, vai trò `join` / `full ca`, feedback gần đây.

## 5. API sketch

```
POST   /web-bff/api/v1/fnb/staff/shifts/{id}/join-table     { tableId }
POST   /web-bff/api/v1/fnb/service-requests/{id}/confirm    { staffId }
POST   /web-bff/api/v1/fnb/orders/{id}/confirm-by-waiter
POST   /web-bff/api/v1/fnb/tables/{id}/reset-confirmed
GET    /web-bff/api/v1/fnb/staff/on-shift?branchId=&q=
POST   /web-bff/api/v1/fnb/feedback                         { staffId, stars, note, sessionId }
GET    /web-bff/api/v1/fnb/manager/staff-ratings?shiftId=
```

## 6. Events

| Event | Producer | Consumer |
|-------|----------|----------|
| `FnB.ServiceRequestCreated` | Order/Guest | SignalR → Waiter MFE |
| `FnB.ServiceRequestConfirmed` | Waiter | SignalR → Guest |
| `FnB.OrderConfirmedByWaiter` | Waiter | Kitchen |
| `FnB.TableResetConfirmed` | Waiter | Admin table map |
| `FnB.PaymentConfirmed` | Payment/Cashier/Waiter | Guest feedback UI |
| `FnB.StaffFeedbackSubmitted` | Guest | Manager ratings, shift score job |

## 7. UI demo reference

Interactive prototype: `app-demo.html` — persona **Phục vụ** (5 screens) + **Quản lý → NV** (tab đánh giá, tỷ lệ 60/40).
