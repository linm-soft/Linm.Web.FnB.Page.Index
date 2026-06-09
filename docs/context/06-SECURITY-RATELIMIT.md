# Linm F&B — Security & Rate Limit

## 1. Three-Layer Security

```
┌─────────────────────────────────────────────────────────┐
│ L1 — Edge (Gateway)                                     │
│ TLS · WAF · rate limit · CORS allowlist · IP throttle   │
├─────────────────────────────────────────────────────────┤
│ L2 — Application                                        │
│ Staff JWT (company_id, roles) · Guest table token       │
│ Branch scope on every mutation · payment proof virus scan│
├─────────────────────────────────────────────────────────┤
│ L3 — Data                                               │
│ Tenant isolation · encrypted payment account refs       │
│ Audit log on payment confirm · PII retention policy     │
└─────────────────────────────────────────────────────────┘
```

## 2. Token Types

| Token | Issuer | Claims / scope | TTL |
|-------|--------|----------------|-----|
| **Staff JWT** | Linm.Authentication | `sub`, `company_id`, `roles[]`, `branch_ids[]` | 8h refresh |
| **Guest session** | FnB Order | `tableToken`, `sessionId`, `guestName` | Until payment or 4h idle |
| **Table QR token** | FnB Admin | Signed URL param `t=` — binds `tableId` + `branchId` | Rotatable per table |
| **Embed report token** | Admin (phase 2) | `branchId`, `reportScope` | 24h |

Guest **không** có JWT staff login — `[AllowAnonymous]` trên API/BFF guest; bảo vệ bằng **rate limit theo IP** (và session bàn qua header `X-FnB-Guest-*`, không phải đăng nhập ERP).

| Header | Mục đích |
|--------|----------|
| **`X-Company-Id`** | **Mã đơn vị cơ sở** (company code `LINM`, `FM06`) — QR mỗi chi nhánh embed `?company=`; BE resolve tenant cho payment/DB |
| **`X-Order-Id`** | **Mã share bàn (JoinCode)** — SSOT tracking + xác thực session |
| `X-FnB-Guest-Participant-Token` | Token người tham gia (payment, feedback theo tên khách) |
| `X-Branch-Id` | Chi nhánh (optional) — từ `?branch=` hoặc `?h_X-Branch-Id=` |
| `X-FnB-Guest-Session-Id` | Legacy pilot — optional fallback dev |

**QR multi-branch (Guest MFE):** `/g/{tableCode}?company=LINM&branch=Q1&code={joinCode}` · env `VITE_GUEST_DEFAULT_COMPANY_ID` · `VITE_GUEST_EXTRA_HEADERS` JSON · arbitrary `?h_{Header-Name}=value`.

## 3. Rate Limits (per IP — pilot implement)

Cấu hình `GuestRateLimit` trong `appsettings.json` · policy trên `FnbGuestController` + `FnbGuestBffController` · BFF forward `X-Forwarded-For` khi loopback API.

| Policy | Endpoint group | Limit | Window |
|--------|----------------|-------|--------|
| `GuestDefault` | GET menu, session, bill, config | 120 req | 1 min |
| `GuestOrderMutate` | POST order / service / feedback | 30 req | 1 min |
| `GuestProofUpload` | POST payment proof | 5 req | 10 min |
| `GuestQrDownload` | GET payment QR (VietQR / MoMo / Zalo) | 20 req | 1 min |

## 4. Payment Security

- QR CK: số tiền + nội dung **server-generated** — client không tự sửa
- Upload proof: max 5MB, JPEG/PNG; **ảnh lưu tối đa 30 ngày** (§6.3 `08-QR-PAYMENT.md`)
- Lúc **Xác nhận**: app trích **mã giao dịch ngân hàng** (`bank_transaction_ref`) từ ảnh — lưu metadata vĩnh viễn, ảnh purge sau 30 ngày
- Staff confirm requires role `cashier` or `manager`
- Multi-account: mỗi chi nhánh map N tài khoản; guest chọn 1 account → QR tương ứng

## 5. Audit Trail

| Action | Logged fields |
|--------|---------------|
| Payment confirmed | staffId, sessionId, amount, method, proofUrl |
| Menu price change | adminId, itemId, old/new price |
| QR template change | adminId, accountId, preview hash |
| Kitchen override | kitchenId, ticketId, reason |

## 6. PII & retention

| Loại | Chính sách |
|------|------------|
| Guest phone (optional) | Mask trong báo cáo (`***1234`); purge PII session **90 ngày** sau thanh toán |
| **Ảnh biên lai CK** | **Tối đa 30 ngày** — job purge file; mục đích đối soát ngắn hạn |
| **Mã giao dịch CK** | Lưu vĩnh viễn khi xác nhận (OCR + nhập tay fallback) — xem `08-QR-PAYMENT.md` §6.3 |
| Export Excel | Chỉ role manager |

Job nền: `ProofImagePurgeJob` — xóa object storage + null `proofUrl` khi `purge_after < now`.
