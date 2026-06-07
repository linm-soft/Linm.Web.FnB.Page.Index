# Linm F&B — Mẫu chào hàng & gửi demo

> **Slogan:** Hỗ trợ cá nhân / hộ kinh doanh — giảm gánh nặng và nỗi lo về thuế  
> **Liên hệ:** Zalo **Linm-Soft** · **0775 909 978** · [zalo.me/0775909978](https://zalo.me/0775909978)

## Link demo (thay khi deploy)

| Trang | URL (mẫu) |
|-------|-----------|
| Trang chủ / pitch | `{BASE_URL}/` hoặc `index.html` |
| Demo UI tương tác | `{BASE_URL}/app-demo.html` |
| Báo giá đầy đủ | `{BASE_URL}/pricing.html` |
| Luồng kỹ thuật | `{BASE_URL}/workflow-demo.html` |

**Deploy target:** `linm-soft/Linm.Web.FnB.Page.Index` (GitHub Pages).  
Sau deploy, thay `{BASE_URL}` — ví dụ `https://linm-soft.github.io/Linm.Web.FnB.Page.Index` hoặc domain riêng.

**Local:** mở `index.html` / `app-demo.html` trong repo `Linm.Web.FnB.Demo`.

---

## 1. Zalo / Messenger (ngắn)

```
Anh/chị ơi, Linm giới thiệu LINM F&B — phần mềm quản lý quán lẩu/nhà hàng (pilot Lẩu Gà Ngon):

· Khách quét QR bàn gọi món (combo, topping lẩu)
· Bếp nhận ticket realtime · NV phục vụ xác nhận · Thu ngân QR chuyển khoản + đối soát
· Báo cáo món bán chạy, hỗ trợ khai thuế theo kỳ cho hộ kinh doanh

Go-live 1 chi nhánh: ~1–2 tuần · triển khai ~20 triệu · miễn phí vận hành 3 tháng đầu

Xem demo: {BASE_URL}
(Bấm "Demo UI" để thử màn hình khách / bếp / thu ngân)
Báo giá: {BASE_URL}/pricing.html

Zalo Linm-Soft · 0775 909 978 — em tư vấn quy mô bàn/menu nhé ạ.
```

---

## 2. Email / tin nhắn dài

**Chủ đề:** Demo LINM F&B — quản lý quán lẩu (QR order · bếp · thu ngân)

```
Kính gửi anh/chị,

Linm-Soft xin giới thiệu LINM F&B — giải pháp vận hành quán lẩu / nhà hàng trên nền tảng Linm, phù hợp chuỗi và hộ kinh doanh muốn giảm sai order, đối soát nhanh và bớt gánh nặng thuế.

Khách tại quán: quét QR bàn → gọi món, combo, topping — không cần cài app.
Nội bộ: màn bếp · app NV phục vụ · thu ngân (QR CK preset số tiền, upload biên lai) · báo cáo doanh thu & món bán chạy.
Hành chính (tuỳ chọn): Linm hỗ trợ tổng hợp số liệu & khai thuế theo kỳ.

Tham khảo nhanh: triển khai CN đầu ~20 triệu · 3 tháng miễn phí duy trì · từ tháng 4: 500k–1tr/tháng/CN (tùy quy mô).
CN thêm cùng mô hình: giảm 30–50% phí triển khai.

Xem bản demo:
· Trang giới thiệu: {BASE_URL}
· Demo UI: {BASE_URL}/app-demo.html
· Báo giá & Linm ERP kế toán (DN có nhà đầu tư): {BASE_URL}/pricing.html

Liên hệ: Zalo Linm-Soft · 0775 909 978 · https://zalo.me/0775909978

Trân trọng,
Linm-Soft
```

---

## 3. One-liner (story / caption)

```
LINM F&B — QR gọi món · bếp realtime · thu ngân QR CK · go-live 1–2 tuần.
Demo: {BASE_URL} · Zalo 0775 909 978
```

---

## 4. Điểm nhấn khi trao đổi (bullet nói nhanh)

| Chủ đề | Nội dung |
|--------|----------|
| **Vấn đề** | Order sai/thiếu topping · đối soát CK chậm · sổ sách thuế cho HKD |
| **Giải pháp** | QR bàn · bếp realtime · NV + thu ngân · báo cáo · hỗ trợ khai thuế theo kỳ |
| **Thời gian** | Go-live pilot **1–2 tuần** / 1 chi nhánh |
| **Chi phí** | Triển khai **~20 triệu** · **3 tháng miễn phí** · duy trì **500k–1tr/th/tháng/CN** (min 3 tháng, trả 12 tặng 1) |
| **Triển khai** | **A** Thuê Linm (subdomain) · **B** Trọn gói (domain khách) — `pricing.html#deploy` |
| **Mở rộng** | Chuỗi quán · đồng bộ ERP kế toán khi có nhà đầu tư — xem `pricing.html#erp` |
| **Demo** | `app-demo.html` — thử flow khách → bếp → thu ngân |

Chi tiết kỹ thuật & báo giá: `01-PLATFORM-OVERVIEW.md` · `09-PRICING-PROPOSAL.md` · `08-QR-PAYMENT.md`

---

## 5. CTA sau khi khách xem demo

1. Hỏi quy mô: số bàn, ca, menu lẩu/combo, số chi nhánh.  
2. Gửi `pricing.html` nếu quan tâm chi phí / khai thuế.  
3. Hẹn khảo sát nhanh tại quán hoặc call 15 phút.  
4. Nếu DN / có NĐT → giới thiệu **Linm ERP** (mục báo giá §3).
