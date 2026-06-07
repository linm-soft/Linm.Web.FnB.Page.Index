# Linm F&B — Phân tích mô hình thuê (A · Linm hosting)

> **Phạm vi:** Rủi ro & lợi nhuận mô hình **triển khai + thuê theo tháng** (§4b `09-PRICING-PROPOSAL.md`).  
> **Không công khai khách hàng** — nội bộ sales / vận hành / quyết định giá.  
> Cập nhật: 2026-06-07 (§11 định giá CN vs chứng từ · hybrid trên 1 platform).

---

## 1. Tóm tắt điều hành

| Câu hỏi | Kết luận |
|---------|----------|
| Mô hình thuê có khả thi? | **Có** — nhờ phí triển khai + MRR; tốt nhất từ **5+ CN** trên cùng nền |
| Gói nên ưu tiên? | **Tiêu chuẩn 800k/CN/tháng** — gói 500k biên recurring mỏng |
| Rủi ro lớn nhất? | **Churn sau 3 tháng miễn phí** · giá flat khi quán quá lớn |
| Rủi ro storage ảnh CK? | **Đã giảm** — cap 30 ngày + lưu `bank_transaction_ref` vĩnh viễn |
| Break-even nền tảng (chỉ MRR)? | ~**8–10 CN** @ 800k (ước lượng chi nền ~4–5 triệu/tháng) |
| **Thuê theo CN hay theo chứng từ?** | **Hybrid:** phí nền **/CN/tháng** + **quota bill** + phụ thu vượt mức (§11) |

---

## 2. Mô hình kinh doanh

```mermaid
flowchart LR
  subgraph once [Một lần]
    S[Triển khai ~20M CN đầu]
    S2[CN thêm 10–14M]
  end
  subgraph recurring [Định kỳ]
    F[3 tháng miễn phí]
    M[500k–1tr/CN/tháng]
    T[Thuế admin 500k–1tr/kỳ]
  end
  S --> F --> M
  S2 --> F
  M --> T
```

| Dòng thu | Mức giá | Ghi chú |
|----------|---------|---------|
| Triển khai CN đầu | ~20 triệu | 50% ký — 50% go-live |
| CN thêm (cùng NG/quy mô) | ~10–14 triệu | Giảm 30–50% |
| Duy trì (từ tháng 4) | 500k / 800k / 1tr / CN / tháng | Min 3 tháng; trả 12 → dùng 13 |
| Pilot | 3 tháng hosting + support miễn phí | Chi phí Linm trước recurring |
| Upsell | Khai thuế 500k–1tr/kỳ | Tách phí F&B |
| Upsell dài hạn | Linm ERP | Báo giá riêng — `09-PRICING-PROPOSAL.md` §9 |

**Đặc điểm:** doanh thu **lumpy** (setup) + **MRR mỏng**; giai đoạn đầu **subsidize** 3 tháng hosting.

SSOT báo giá khách: `09-PRICING-PROPOSAL.md` · `pricing.html#deploy`

---

## 3. Cấu trúc chi phí (ước lượng nội bộ)

### 3.1 Chi phí cố định nền tảng (shared cluster)

| Hạng mục | Ước lượng/tháng | Ghi chú |
|----------|-----------------|---------|
| Cloud/VPS + PostgreSQL | 2–4 triệu | Multi-tenant pilot ~10–20 CN |
| Backup, monitoring, object storage | 0,5–1 triệu | Ảnh CK cap 30 ngày → ~1,5–2 GB/CN rolling |
| Auth, Notification, domain | 0,5–1 triệu | Dùng chung tenant |
| **Tổng nền** | **~3–6 triệu/tháng** | Trước phân bổ/CN |

### 3.2 Chi phí biến đổi / CN / tháng

| Hạng mục | Ước lượng |
|----------|-----------|
| DB + bandwidth + SignalR | 150–250k |
| Backup phân bổ | 30–50k |
| Hỗ trợ Zalo (giờ hành chính) | 150–400k |
| **Tổng biến đổi/CN** | **~200–450k** |

### 3.3 COGS triển khai (~20M CN đầu)

| Hạng mục | Ước lượng |
|----------|-----------|
| Khảo sát, menu, QR, training onsite | 6–10 triệu |
| Deploy tenant | 1–2 triệu |
| Dự phòng sau pilot | 1–2 triệu |
| **COGS triển khai** | **~8–12 triệu (~40–60% doanh thu)** |
| **Biên gộp setup CN đầu** | **~8–12 triệu** |

CN thêm (10–14M): COGS ~4–7M → biên gộp setup **~50–65%**.

---

## 4. Unit economics — duy trì theo gói

Sau 3 tháng miễn phí; giả định khách ở lại ≥12 tháng.

| Gói | Thu/CN/tháng | Chi biến đổi (TB) | Biên gộp recurring/CN | Biên % |
|-----|--------------|-------------------|------------------------|--------|
| Cơ bản | 500k | ~350k | **~150k** | ~30% |
| Tiêu chuẩn ★ | 800k | ~300k | **~500k** | ~62% |
| Mở rộng | 1tr | ~350k | **~650k** | ~65% |

Phân bổ chi nền (~4M/tháng ÷ số CN):

| Gói | Sau nền @ 10 CN | Sau nền @ 20 CN |
|-----|-----------------|-----------------|
| 500k | **−250k** (lỗ recurring) | **−150k** |
| 800k | **+100k** | **+200k** |
| 1tr | **+250k** | **+350k** |

**Gói 500k** chỉ bền vững khi scale CN (chia nền) hoặc setup fee bù. **800k** = điểm cân bằng pilot Lẩu Gà Ngon.

---

## 5. P&L kịch bản 12 tháng

### 5.1 Một CN — gói 800k, retention tốt

| Khoản | Số tiền |
|-------|--------|
| Doanh thu setup | 20,0 triệu |
| Recurring (9 tháng trả phí) | 7,2 triệu |
| **Tổng thu năm 1** | **27,2 triệu** |
| COGS setup + vận hành 12 th + support | −18,4 triệu |
| **Lợi nhuận gộp năm 1** | **~8,8 triệu (~32%)** |

### 5.2 Churn sau 3 tháng miễn phí

| Khoản | Số tiền |
|-------|--------|
| Thu setup | 20,0 triệu |
| Recurring | 0 |
| Chi setup + 3 tháng hosting/support | −13,5 triệu |
| **Lợi nhuận** | **~6,5 triệu (one-shot)** — mất LTV ~5–7 triệu/năm |

### 5.3 Chuỗi 5 CN (1×20M + 4×12M), TB 750k/CN

| Khoản | Năm 1 |
|-------|-------|
| Setup | 68 triệu |
| Recurring (9 th × 5 CN × 750k) | 33,75 triệu |
| **Tổng thu** | **~102 triệu** |
| Chi (setup + vận hành + nền) | −69 triệu |
| **Lợi nhuận gộp ước tính** | **~33 triệu (~32%)** |

---

## 6. Ma trận rủi ro

### 6.1 Thương mại

| Rủi ro | Mức | Giảm thiểu |
|--------|-----|------------|
| Churn sau pilot 3 tháng | **Cao** | Min 3 tháng trả phí; KPI go/no-go tháng 4; default gói 800k |
| Gói 500k kéo margin | TB | Giới hạn tính năng; upsell |
| Custom ngoài HĐ | TB | §4b phí phát sinh — báo giá trước |
| Trả 12 tặng 1 | Thấp | Cash flow; giảm churn |
| Cạnh tranh POS rẻ | TB | Đối soát CK + thống kê món + HKD/thuế |

### 6.2 Vận hành & kỹ thuật

| Rủi ro | Mức | Ghi chú |
|--------|-----|---------|
| Storage ảnh CK | **Thấp** | Cap 30 ngày · `08-QR-PAYMENT.md` §6.3 |
| Multi-tenant noisy neighbor | TB | Báo cáo nặng · ca Tết |
| DB `order_lines` tăng | TB | ~580k dòng/năm/CN (40 bàn, ca đông) — index + aggregate |
| SignalR peak | TB | Nhiều bàn × nhiều CN |
| Backup/restore | TB | Cần SLA trong HĐ |
| OCR mã GD fail | Thấp–TB | Nhập tay fallback |

**Ước lượng data (1 CN lẩu ~40 bàn, ~200 session/ngày):**

- ~1.600 `order_lines`/ngày → ~580k/năm/CN  
- Ảnh CK (30 ngày rolling): ~60 MB/ngày peak → **~1,8 GB/CN** ổn định (không ~22 GB/năm như lưu vĩnh viễn)

### 6.3 Tài chính Linm

| Rủi ro | Mô tả |
|--------|--------|
| Subsidize pilot | ~1–1,5M chi/CN trước recurring |
| Flat pricing vs volume | 50 bàn cao điểm vs 15 bàn — cùng giá |
| Bottleneck triển khai | Onsite/training — không phải server |
| R&D chưa amortize | Setup phải gánh đầu tư sản phẩm giai đoạn đầu |

---

## 7. Điểm mạnh mô hình thuê

| Yếu tố | Lợi ích |
|--------|---------|
| MRR tái lặp | 5 CN × 800k ≈ 4M/tháng (~48M/năm) sau ramp |
| Setup cao | Cash + biên ngay; CN thêm margin setup tốt |
| Multi-tenant | Chi/CN giảm khi scale |
| Upsell thuế | ~2–3M/năm/CN (4 kỳ) — margin dịch vụ cao |
| Cross-sell ERP | Chuỗi có NĐT |
| Prepay 12+1 | Tiền trước · churn thấp hơn |
| Chính sách data ảnh | Chi hosting không phình theo thời gian |

---

## 8. Ngưỡng quy mô

| Quy mô | Đánh giá |
|--------|----------|
| 1–3 CN | Khả thi nhờ setup; recurring chủ yếu bù hosting — **800k+** |
| 5–10 CN | Khỏe — nền amortize |
| 10–20 CN | Tốt — cân nhắc fair-use / CN lớn tách resource |
| 1 CN quá lớn (50+ bàn) | Rủi ro margin — gói Mở rộng hoặc phụ thu |

---

## 9. Khuyến nghị vận hành & hợp đồng

### 9.1 Bảo vệ lợi nhuận

1. Pilot **mặc định gói Tiêu chuẩn 800k** — 500k cho quán &lt;20 bàn, support tối thiểu.  
2. **Checklist go/no-go** trước tháng 4 (sau 3 tháng free).  
3. **Fair use HĐ** (đề xuất chưa có trong báo giá công khai): ≤40 bàn/CN hoặc ≤X đơn/ngày; vượt → nâng gói/phụ thu.  
4. Giữ **ảnh 30 ngày + mã GD vĩnh viễn**.  
5. Pitch **thuế admin** song song F&B.  
6. Ưu tiên bán **3+ CN/đợt** (setup CN thêm 10–14M).

### 9.2 Chỉ số theo dõi (KPI nội bộ)

- Churn sau tháng 3 / 12  
- Biên gộp/CN/tháng (thu − hosting − support)  
- Giờ support/CN/tháng  
- p95 API báo cáo · GB DB/CN  
- % khách prepay 12 tháng  

### 9.3 Kỹ thuật trước scale

1. Ảnh CK → object storage (không blob DB).  
2. Bảng aggregate ngày/CN cho reports.  
3. Partition/archive `order_lines` theo tháng (sau 12–24 tháng).  
4. Tenant lớn → DB/schema riêng hoặc quota.  
5. Job `ProofImagePurgeJob` — `06-SECURITY-RATELIMIT.md`.

---

## 10. Cam kết công khai (khách hàng — không lộ biên nội bộ)

Đã ghi trong `09-PRICING-PROPOSAL.md` § Dữ liệu & lưu trữ · `pricing.html#deploy`:

- Ảnh biên lai CK: **tối đa 30 ngày**  
- Mã giao dịch: lưu khi xác nhận (app tự trích + nhập tay nếu cần)  
- Đơn / báo cáo doanh thu: metadata lưu theo nhu cầu kế toán quán  

---

## 11. Định giá: theo CN/tháng vs theo chứng từ (1 platform chung)

### 11.1 Bối cảnh platform chung

Mọi đơn vị trên **cùng cluster** Linm → chi phí gồm:

| Loại | Driver | Ai “ăn” nhiều hơn |
|------|--------|-------------------|
| **Cố định** | Nền tảng, Auth, Notification, gateway | Chia đều — cần **tối thiểu MRR/CN** |
| **Biến đổi** | `order_lines`, session đóng, event, SignalR, metadata CK | **Quán cao điểm** — cần **đồng bộ với volume** |

**Đơn vị đo billing đề xuất (F&B):** **1 bill đã đóng** = 1 session `PaymentConfirmed` (tiền mặt / CK / Momo) — *không* tính từng dòng món (khách sợ “phí theo từng món”).

Tách riêng: **dịch vụ khai thuế** đã theo chứng từ/kỳ (`09-PRICING-PROPOSAL.md` §8) — không trộn vào phí hosting F&B.

### 11.2 So sánh 3 mô hình

| Tiêu chí | **A · Flat /CN/tháng** (hiện tại) | **B · Thuần theo chứng từ** | **C · Hybrid ★** |
|----------|-----------------------------------|-----------------------------|------------------|
| Dễ bán HKD/quán | ★★★ | ★ | ★★★ |
| Bảo vệ margin khi quán đông | ★ | ★★★ | ★★★ |
| Doanh thu tháng thấp mùa vắng | Cao (có thể dư) | Thấp (đúng cost) | Vừa (base cover nền) |
| Công bằng trên 1 platform | Kém (CN đông subsidize CN vắng) | Cao | Cao |
| Dự báo cho khách | ★★★ | ★ | ★★ |
| **Lợi nhuận Linm dài hạn** | TB nếu không fair-use | Cao nếu volume lớn | **Cao nhất ổn định** |

**Kết luận:** **Không** chuyển hẳn sang thuần theo chứng từ (khó chốt sales F&B). **Không** giữ flat vô hạn (CN 50 bàn Tết lỗ margin). → **C · Hybrid** = giữ cách nói “**X triệu/tháng/chi nhánh**” + **quota bill** trong HĐ + phụ thu mềm khi vượt.

### 11.3 Cấu trúc hybrid đề xuất (thay thế dần bảng §4 công khai)

**Công thức:**

```
Phí tháng/CN = Phí nền gói + max(0, (Bill_tháng − Quota_gói) × Đơn_giá_vượt)
```

| Gói (tên khách) | Phí nền/CN/tháng | Quota bill/CN/tháng | Phụ thu vượt | Quy mô tham chiếu |
|-----------------|------------------|---------------------|--------------|-------------------|
| **Cơ bản** | **500.000đ** | **2.500 bill** (~80/ngày) | **60đ/bill** | &lt;30 bàn |
| **Tiêu chuẩn** ★ | **800.000đ** | **5.000 bill** (~165/ngày) | **50đ/bill** | ~30–40 bàn |
| **Mở rộng** | **1.000.000đ** | **10.000 bill** (~330/ngày) | **40đ/bill** | 40+ bàn · đa TK · chuỗi |

★ Pilot Lẩu Gà Ngon: ~200 session/ngày cao điểm × 30 ≈ **6.000 bill/tháng** → nằm trong Tiêu chuẩn + ~1.000 vượt × 50đ ≈ **+50k** (hoặc khuyến khích lên Mở rộng).

**Ước lượng bill/tháng theo quy mô:**

| Quy mô | Bill/ngày (TB) | Bill/tháng | Gói fit |
|--------|----------------|------------|---------|
| Quán nhỏ 15 bàn | 40–60 | 1.200–1.800 | Cơ bản |
| Lẩu ~30 bàn | 80–120 | 2.400–3.600 | Cơ bản / Tiêu chuẩn |
| Lẩu ~40 bàn cao điểm | 150–200 | 4.500–6.000 | Tiêu chuẩn / Mở rộng |
| 50+ bàn / 2 ca | 250+ | 7.500+ | Mở rộng + phụ thu hoặc báo giá CN |

### 11.4 Tăng phí “phù hợp” — thang leo (không đột ngột)

1. **Theo gói tính năng** (đã có): 500 → 800 → 1tr — map thêm quota bill như bảng trên.  
2. **Theo số bàn lúc ký HĐ** (band, không đo realtime):

   | Bàn/CN | Điều chỉnh nền |
   |--------|----------------|
   | ≤25 | Giá gói chuẩn |
   | 26–40 | +0 (Tiêu chuẩn default) |
   | 41–55 | +150k hoặc bắt buộc Mở rộng |
   | 56+ | Báo giá riêng / CN |

3. **Phụ thu vượt quota** — tự động trên dashboard admin Linm (bill counter theo `branchId`); thông báo trước khi chạm 80% quota.  
4. **CN thêm chuỗi** — giữ giảm 30–50% **setup**; recurring **cùng bảng hybrid** (không giảm % phí tháng — chỉ giảm triển khai).  
5. **Mùa cao điểm (Tết)** — không phí riêng nếu vẫn trong quota; vượt → phụ thu (đúng cost spike).  
6. **Prepay 12+1** — giữ; quota tính trên 13 tháng rolling average, không reset từng tháng (tránh bill shock 1 tháng).

### 11.5 Cách nói với khách (sales)

- **Nói:** “**800k/tháng/chi nhánh**, gói Tiêu chuẩn — **bao gồm ~5.000 bill/tháng** (~160 bill/ngày), đủ quán 30–40 bàn.”  
- **Không nói:** “tính từng chứng từ” làm headline — chỉ ghi **điều khoản fair use** phụ lục HĐ.  
- **Tách:** phí **khai thuế** vẫn **/kỳ theo chứng từ HĐĐT** (§8) — khách HKD quen mô hình đó ở dịch vụ thuế.

### 11.6 Lợi nhuận: hybrid vs flat thuần

Giả sử CN 40 bàn, **6.000 bill/tháng**, chi biến đổi ~350k:

| Mô hình | Thu/CN | Biên ước tính |
|---------|--------|---------------|
| Flat 800k | 800k | ~450k (55%) — **mỏng nếu support nặng** |
| Thuần 6.000 × 150đ | 900k | ~550k — khó bán |
| **Hybrid 800k + 1.000×50đ** | **850k** | **~500k** — cân bằng |

Giả sử CN nhỏ **1.500 bill**, flat 500k vs hybrid 500k (dưới quota):

| Mô hình | Thu | Ghi chú |
|---------|-----|---------|
| Flat 500k | 500k | OK |
| Hybrid 500k | 500k | **Giống flat** — khách nhỏ không phạt |

→ Hybrid **không tệ hơn flat** với quán nhỏ; **tốt hơn** với quán đông trên cùng platform.

### 11.7 Triển khai kỹ thuật (meter trên 1 platform)

| Meter | Nguồn | Chu kỳ |
|-------|-------|--------|
| `bills_closed_count` | Event `FnB.PaymentConfirmed` · filter `branchId` | Calendar month |
| Quota | Config theo gói + `branchId` | HĐ |
| Dashboard | Admin Linm + email 80%/100% quota | — |
| Hóa đơn phụ thu | Cuối tháng · line item “Vượt quota bill” | — |

Phase 1 pilot: có thể **chỉ ghi HĐ + đếm tay** 3 tháng đầu; bật auto billing khi ≥5 CN.

### 11.8 Quyết định đề xuất

| Câu hỏi | Trả lời |
|---------|---------|
| Thuê theo CN hay chứng từ lợi hơn? | **CN làm khung giá**; **bill làm fair-use + phụ thu** — **hybrid lợi hơn** trên 1 platform |
| Có bỏ giá /CN/tháng? | **Không** — vẫn là đơn vị sales chính |
| Tăng phí thế nào? | Gói + band số bàn + quota + phụ thu vượt; CN siêu lớn → báo giá riêng |

**Bước tiếp:** cập nhật `09-PRICING-PROPOSAL.md` §4 (công khai quota) khi sales chốt wording — hiện chỉ ghi nội bộ §11.

---

## Liên kết

| Tài liệu | Nội dung |
|----------|----------|
| `09-PRICING-PROPOSAL.md` | Báo giá SSOT · §4b mô hình A |
| `08-QR-PAYMENT.md` | §6.3 retention ảnh · mã GD |
| `06-SECURITY-RATELIMIT.md` | Audit · purge job |
| `02-SYSTEM-ARCHITECTURE.md` | 4 DB · multi-tenant |
| `11-SALES-OUTREACH.md` | Mẫu chào hàng |
