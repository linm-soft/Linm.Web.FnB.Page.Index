# Linm F&B — QR thanh toán (Phase 1)

> Tài liệu kỹ thuật: **QR bàn** (order) · **QR chuyển khoản** (preset số tiền) · **đối soát tay** — không API ngân hàng phase 1.

---

## 1. Hai loại QR trong hệ thống

| Loại | Ai quét | Nội dung | Ai tạo |
|------|---------|----------|--------|
| **QR bàn** | Khách tại bàn | URL Linm + token bàn/session | Linm Admin — in/dán bàn |
| **QR chuyển khoản** | Khách khi thanh toán bill | Payload **chuẩn NAPAS/EMV** (STK, số tiền, nội dung CK) | Linm Payment — **tự gen** mỗi bill |
| **QR nhân viên** (tuỳ chọn) | Khách feedback | Mã NV / token phục vụ | Linm Admin |

**QR bàn** ≠ **QR CK**: bàn mở menu order; CK thanh toán hóa đơn — app ngân hàng đọc payload EMV, không phải link web.

---

## 2. Chuẩn QR chuyển khoản (Việt Nam)

| Thành phần | Mô tả |
|------------|--------|
| Khung | **NAPAS** QR Switching + **EMVCo Merchant-Presented Mode (MPM)** v1.5.2 |
| Dịch vụ F&B | **`QRIBFTTA`** — chuyển liên ngân hàng **vào số tài khoản** |
| AID | `A000000727` |
| Mã hóa | TLV (Tag-Length-Value) + **CRC16-CCITT** (tag `63`) |
| Dynamic bill | Tag `01` = `12` + tag `54` = số tiền (vd. `813000`) |
| Tiền tệ | `704` (VND) · Quốc gia `VN` |

Khách: mở app ngân hàng → Quét QR / chọn ảnh QR → số tiền và nội dung được điền sẵn.

**Phase 1 pilot:** TK ngân hàng truyền thống (Big4 + TMCP). MoMo/ví điện tử = kênh riêng, không dùng cùng luồng QR CK này.

---

## 3. Linm tự gen — không dịch vụ QR bên thứ ba

| | **Linm tự gen (Phase 1)** | **API dịch vụ QR ngoài** |
|---|---------------------------|---------------------------|
| Phụ thuộc | Lib TLV + render PNG trên server | API key, SLA bên thứ ba |
| Dữ liệu TK | Chỉ DB nội bộ | Gửi ra ngoài |
| Preset amount | Tag EMV `54` | Cùng chuẩn EMV |

Danh sách **BIN ngân hàng** (6 chữ số): seed bảng `bank_bins` — có thể import từ nguồn công khai NAPAS/community, **không** bắt buộc khi gen QR.

**Tham khảo implement .NET:** [liopayvn/vietqr-php](https://github.com/liopayvn/vietqr-php) · [thanhtinhpas1/vietqr-parser](https://github.com/thanhtinhpas1/vietqr-parser) · [vanvixi/vietqr.dart](https://github.com/vanvixi/vietqr.dart)

---

## 4. Payload QR CK (dynamic — có số tiền)

### 4.1 Tag gốc

| Tag | Giá trị pilot | Ghi chú |
|-----|---------------|---------|
| `00` | `01` | Payload format |
| `01` | **`12`** | Dynamic — một QR một bill |
| `38` | nested | BIN + STK + `QRIBFTTA` |
| `52` | `5812` / `5814` | MCC nhà hàng |
| `53` | `704` | VND |
| `54` | `813000` | Chỉ số, ≤13 chữ số |
| `58` | `VN` | |
| `59` | `LAU GA NGON` | ≤25 ký tự, không dấu |
| `60` | `HCM` | ≤15 ký tự |
| `62` | nested | Nội dung CK — §4.3 |
| `63` | CRC hex | Luôn cuối chuỗi |

### 4.2 Tag 38 — Thụ hưởng

| Sub | Ví dụ |
|-----|-------|
| `38.00` | `A000000727` |
| `38.01.00` | BIN `970422` (MB) |
| `38.01.01` | Số TK `0123456789` |
| `38.02` | `QRIBFTTA` |

### 4.3 Tag 62 — Nội dung CK (đối soát tay)

| Sub | Mapping |
|-----|---------|
| `62.01` | Mã bill: `LG240607-B12` |
| `62.08` | Nội dung hiển thị app NH (≤25 ký tự, không dấu) |

Gợi ý: `LGN B12 001` — quản lý đối chiếu với sao kê / app NH.

---

## 5. BIN ngân hàng phổ biến (IBFT)

| Ngân hàng | Mã | BIN |
|-----------|-----|-----|
| Vietcombank | VCB | 970436 |
| VietinBank | ICB | 970415 |
| BIDV | BIDV | 970418 |
| Agribank | VBA | 970405 |
| Techcombank | TCB | 970407 |
| MB Bank | MB | 970422 |
| ACB | ACB | 970416 |
| VPBank | VPB | 970432 |
| TPBank | TPB | 970423 |
| Sacombank | STB | 970403 |
| HDBank | HDB | 970437 |
| MSB | MSB | 970426 |

Ẩn NH không hỗ trợ chuyển liên ngân hàng khỏi dropdown cấu hình quán.

---

## 6. Luồng Phase 1 — Đối soát tay (không API NH)

```
Khách xem bill → chọn Chuyển khoản
  → Server gen QR (amount + nội dung) + ảnh PNG
  → Khách quét / tải QR → CK trên app NH
  → Upload ảnh biên lai (khuyến khích)
Quản lý / Thu ngân: danh sách "Chờ xác nhận CK"
  → Đối chiếu tay: số tiền · nội dung · TK · ảnh
  → Xác nhận → đóng bàn · Từ chối → CK lại
```

### 6.1 Trạng thái `payment_requests`

`pending` → `proof_uploaded` → `confirmed` | `rejected` | `expired`

Lưu: `expected_amount`, `transfer_content`, `qr_payload`, ảnh proof (tạm thời), `confirmed_by_staff_id`, **`bank_transaction_ref`** (sau xác nhận).

**Không có phase 1:** webhook sao kê, API ngân hàng, đối soát tự động.

### 6.2 Màn hình quản lý

Cột: bàn · số tiền · nội dung CK · TK (mask) · ảnh biên lai · thời gian · NV phục vụ.

Checklist UI: (1) đúng số tiền (2) nội dung khớp (3) đúng TK chi nhánh (4) ảnh hợp lý.

### 6.3 Ảnh biên lai — retention 30 ngày · mã giao dịch vĩnh viễn

| Dữ liệu | Thời gian lưu | Ghi chú |
|---------|---------------|---------|
| **File ảnh biên lai** (`transfer_proofs`) | **Tối đa 30 ngày** kể từ upload | Phục vụ đối soát / tranh chấp ngắn hạn; job purge xóa file + URL |
| **Mã giao dịch ngân hàng** (`bank_transaction_ref`) | **Vĩnh viễn** (metadata) | Trích khi staff **Xác nhận** — không cần giữ ảnh lâu dài |
| Metadata thanh toán | Vĩnh viễn | Số tiền, nội dung CK, phương thức, `confirmed_at`, staff |

**Luồng khi xác nhận:**

```
Staff bấm Xác nhận
  → App tự động trích mã giao dịch từ ảnh biên lai (OCR / parse màn hình app NH)
  → Ghi bank_transaction_ref vào payment_requests / settlements
  → Audit log lưu ref + staffId (không phụ thuộc ảnh sau purge)
  → Ảnh vẫn giữ tối đa 30 ngày rồi job xóa (kể cả đã confirmed)
```

- Trích mã **best-effort**: nếu OCR không đọc được, staff có thể **nhập tay** trước khi confirm (UI optional).
- Báo cáo / bảng kê CK tra cứu theo **`bank_transaction_ref`** + nội dung bill — không cần mở lại ảnh sau khi đã xác nhận.
- Giảm rủi ro storage khi data tăng: disk chỉ giữ ảnh “chờ duyệt” + cửa sổ 30 ngày, không tích lũy ảnh theo năm.

Bảng gợi ý `transfer_proofs`: `payment_request_id`, `storage_url`, `uploaded_at`, `purge_after` (= uploaded_at + 30d), `ocr_transaction_ref` (nullable, điền lúc confirm).

---

## 7. API gợi ý

```
POST /api/v1/fnb/payment-requests
  → { id, expectedAmount, transferContent, qrImageBase64, expiresAt }

POST /api/v1/fnb/payment-requests/{id}/proof
GET  /api/v1/fnb/payment-requests?status=pending
POST /api/v1/fnb/payment-requests/{id}/confirm
  body optional: { bankTransactionRef }  — nếu OCR thiếu, staff bổ sung tay
POST /api/v1/fnb/payment-requests/{id}/reject

POST /api/v1/fnb/payment-accounts          — cấu hình TK chi nhánh
POST /api/v1/fnb/payment-accounts/{id}/qr-preview  — test trước go-live
```

Số tiền + nội dung **chỉ server gen** — client không sửa (xem `06-SECURITY-RATELIMIT.md`).

---

## 8. Render ảnh

1. Build chuỗi EMV (TLV + CRC)
2. Matrix QR (QRCoder / SkiaSharp)
3. Trả base64 hoặc CDN URL

Logo ngân hàng trên ảnh: tuỳ chọn UI — **không** ảnh hưởng khả năng quét.

---

## 9. UAT go-live

| # | Test |
|---|------|
| 1 | Quét QR bill bằng app VCB, MB, TCB |
| 2 | Số tiền + nội dung prefill đúng |
| 3 | Đổi TK/BIN — QR đổi đúng STK |
| 4 | Validation nội dung >25 ký tự / ký tự cấm |
| 5 | Luồng proof → pending → confirm → đóng session |

---

## 10. Phase 2 (tương lai)

Webhook đối soát (Casso/Sepay) · tinh chỉnh OCR mã FT/ref đa ngân hàng · CK nhiều lần một bill · deeplink app NH.

*(Phase 1 đã có OCR trích `bank_transaction_ref` lúc xác nhận — xem §6.3.)*

---

## Liên kết

- `02-SYSTEM-ARCHITECTURE.md` — Linm.FnB.Payment / Admin
- `06-SECURITY-RATELIMIT.md` — server-gen, upload limit
