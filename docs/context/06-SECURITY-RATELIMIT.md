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

Guest **không** có JWT — chỉ `X-Guest-Session` + signed table token từ QR.

## 3. Rate Limits (per IP / per table token)

| Endpoint group | Limit | Window |
|----------------|-------|--------|
| Guest menu read | 120 req | 1 min |
| Add order line | 30 req | 1 min |
| Payment proof upload | 5 req | 10 min |
| Staff login | 10 req | 5 min |
| QR image download | 20 req | 1 min |

## 4. Payment Security

- QR CK: số tiền + nội dung **server-generated** — client không tự sửa
- Upload proof: max 5MB, JPEG/PNG, optional OCR assist (phase 2)
- Staff confirm requires role `cashier` or `manager`
- Multi-account: mỗi chi nhánh map N tài khoản; guest chọn 1 account → QR tương ứng

## 5. Audit Trail

| Action | Logged fields |
|--------|---------------|
| Payment confirmed | staffId, sessionId, amount, method, proofUrl |
| Menu price change | adminId, itemId, old/new price |
| QR template change | adminId, accountId, preview hash |
| Kitchen override | kitchenId, ticketId, reason |

## 6. PII

- Guest phone optional — masked in reports (`***1234`)
- Retention: session PII purge 90 days post payment
- Export Excel: manager role only
