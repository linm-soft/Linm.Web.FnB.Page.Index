# Linm F&B — Thanh toán MoMo (đối soát tay)

> **Parity tab Chuyển khoản** — QR VietQR có **số tiền + ND** sẵn; nhân viên đối soát tay (không cần IPN merchant).

---

## 1. MoMo pilot = VietQR nhận tiền (không merchant API)

| | **Chuyển khoản (Phase 1)** | **MoMo (P2P pilot)** |
|--|---------------------------|----------------------|
| Chuẩn QR | NAPAS VietQR IBFT | VietQR đa năng MoMo (BVBank BIN `970454`) |
| Số tiền trong QR | Có (dynamic) | Có (dynamic) — **cùng cơ chế TLV tag 54** |
| Quét | App ngân hàng / MoMo | App MoMo hoặc app ngân hàng |
| Xác nhận | Đối soát tay + proof | **Đối soát tay + proof** (giống CK) |
| Cần PartnerCode? | Không | **Không** |

**Cấm** encode `momo://payWithAppToken` hoặc QR pipe tự sinh — MoMo báo lỗi đối tác.

---

## 2. Cấu hình bắt buộc để có QR

Trong app **MoMo → Nhận tiền → chi tiết QR** lấy STK dạng **`99MM…`** (khác mã PSP trong hồ sơ ví).

`appsettings` → `MomoPayment`:

| Key | Mô tả |
|-----|--------|
| `PaymentMode` | `P2P` |
| `ReceiverPhone` | SĐT ví (tag 80 VietQR = 3 số cuối) |
| `ReceiverName` | Tên hiển thị |
| `ReceiverAccountId` | Mã PSP — **chỉ hiển thị/copy**, không dùng gen QR |
| `ReceiverWalletAccount` | **STK `99MM…`** — bắt buộc để sinh QR có số tiền |

Ví dụ pilot SĐT `0983987874` — cần bổ sung `ReceiverWalletAccount` sau khi copy STK từ app MoMo.

---

## 3. Luồng Guest

```
Khách chọn tab Momo
  → GET momo-payment-info?amount=
  → Server: MomoReceiveQrEncoder (nếu có 99MM) → qrImageBase64 (màu MoMo)
  → UI: QR + Mã / Tên / ND (parity tab CK)
  → Khách quét → chuyển đúng số tiền + ND
  → Upload proof — staff đối soát
```

Nếu **chưa cấu hình `99MM`**: UI fallback — **icon MoMo + SĐT ví** (copy) + Tên / ND; không hiển thị QR giả.

---

## 4. API

`GET web-bff/api/v1/fnb/guest/tables/{tableCode}/momo-payment-info?amount=`

Response thêm: `receiverWalletAccount`, `qrKind` (`vietqr` | `none`), `transferNote`.

---

## 5. So sánh CK vs MoMo pilot

| Hạng mục | CK VietQR | MoMo P2P |
|----------|-----------|----------|
| Staff confirm | Bắt buộc | Bắt buộc |
| Proof ảnh | Khuyến khích | Khuyến khích |
| QR dynamic amount | Có | Có (khi có `99MM`) |
| Merchant IPN | Không | Không (pilot) |

**Go-live merchant (tùy chọn sau):** `PartnerCode` + `captureMoMoWallet` — tự động hóa, không thay thế luồng đối soát tay hiện tại.

---

## Liên kết

- QR CK: `08-QR-PAYMENT.md`
- BE: `MomoPaymentService` · `MomoReceiveQrEncoder` · `FnbGuestController`
- FE: `GuestMomoPayPanel` · `utils/momoReceiveQr.ts`
