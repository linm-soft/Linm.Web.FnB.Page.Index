# Linm F&B — App branding

> **Phiên bản demo:** Web pitch, Demo UI và tài liệu trong repo này là **bản minh hoạ** (mẫu **Lẩu Gà Ngon**). Khi triển khai thực tế, Linm sẽ **thiết kế và bổ sung giao diện** theo **design + logo nhận diện** của quý khách (màu chủ đạo, typography, icon tenant, splash PWA, v.v.).

## Tên ứng dụng

```
LINM F&B — {tên hệ thống / tenant}
```

| Ví dụ pilot | Giá trị |
|-------------|---------|
| Platform | **LINM F&B** |
| Tenant (quán) | **Lẩu Gà Ngon** |
| Hiển thị đầy đủ | `LINM F&B — Lẩu Gà Ngon` |

Tenant khác (vd. chuỗi mới): chỉ đổi `{tên hệ thống}` — platform giữ **LINM F&B**.

## Logo & icon (SSOT)

Copy từ **`@linm-soft/common-components`** / **`Linm.Web.Root`**:

| File demo | Nguồn |
|-----------|--------|
| `assets/linm/logo-128.png` | `MFE-COMMON/.../src/assets/icons/logo-128.png` |
| `assets/linm/icon-192.png` | `MFE-CORE/Linm.Web.Root/public/icons/icon-192.png` |
| `assets/linm/logo.svg` | `Linm.Web.Root/public/icons/logo.svg` |
| `assets/linm/logo-64.png` | `Linm.Web.Root/public/icons/logo-64.png` |

Khi common cập nhật logo → sync lại thư mục `assets/linm/`.

## UI pattern

- **Favicon / PWA:** `icon-192.png`
- **Nav web:** `.app-brand` — icon 32px + 2 dòng (LINM F&B · tenant)
- **Màn login / welcome PWA:** icon 56px + cùng cấu trúc
- **CSS:** `assets/linm/app-brand.css`

```html
<a href="index.html" class="app-brand app-brand--nav">
  <img src="assets/linm/logo-128.png" alt="Linm" class="app-brand__icon" width="32" height="32">
  <span class="app-brand__text">
    <span class="app-brand__platform">LINM F&B</span>
    <span class="app-brand__tenant">Lẩu Gà Ngon</span>
  </span>
</a>
```

Nền tối (workflow): thêm class `app-brand--dark`.

## Triển khai thật (MFE)

- Shell / guest PWA: `document.title` = `LINM F&B — {branchName}`
- Import logo: `import { linmLogo128 } from '@linm-soft/common-components'` (hoặc path assets tenant)
- Không dùng emoji 🍲 làm app icon — dùng logo Linm + tên tenant
- **Branding khách hàng:** thay logo/màu tenant, theme CSS theo brand book; giữ layout nghiệp vụ chuẩn Linm F&B
