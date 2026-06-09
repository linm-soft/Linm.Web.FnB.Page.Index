# GitHub Actions — Linm.Web.FnB.Demo

Workflows: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) · [`.github/workflows/deploy-to-fnb-pages.yml`](../.github/workflows/deploy-to-fnb-pages.yml)

## Secrets

| Secret | Required | Mô tả |
|--------|----------|--------|
| `LINM_SOFT_AUTH_TOKEN` | **Yes** (deploy) | PAT Linm chuẩn — **checkout**, push version bump, clone + push `linm-soft/Linm.Web.FnB.Page.Index` |

Cùng secret dùng trên MFE/ERP workspace (GitHub Packages + deploy). PAT cần quyền **Contents: Read and write** trên:

- `linm-soft/Linm.Web.FnB.Demo` (source — bump `package.json`)
- `linm-soft/Linm.Web.FnB.Page.Index` (Pages target)

### Thêm secret

Repo **`linm-soft/Linm.Web.FnB.Demo`** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Name | Value |
|------|--------|
| `LINM_SOFT_AUTH_TOKEN` | PAT org Linm (fine-grained hoặc classic `repo`) |

Hoặc dùng **organization secret** `LINM_SOFT_AUTH_TOKEN` nếu đã cấu hình sẵn trên `linm-soft`.

Sau khi có secret, chạy lại: **Actions** → **Deploy to FnB Pages Index** → **Run workflow**.

> **Lỗi thường gặp:** `Input required and not supplied: token` — chưa có `LINM_SOFT_AUTH_TOKEN`. Workflow fallback `github.token` cho checkout; bước **Validate LINM_SOFT_AUTH_TOKEN** báo lỗi rõ trước deploy.

## Deploy target

| Env | Giá trị |
|-----|---------|
| `PUBLIC_REPO` | `linm-soft/Linm.Web.FnB.Page.Index` |
| `PROJECT_NAME` | `fnb-demo` |

Script: `scripts/deploy-fnb-static-pages.mjs` — copy HTML + `assets/` + `docs/` → **`/demo/`** subpath trên Pages repo (giữ MFE bundles + `_manifest.json` ở root).

| Env | Giá trị |
|-----|---------|
| `DEPLOY_SUBPATH` | `demo` (mặc định) |

## Triggers

| Workflow | Khi nào |
|----------|---------|
| `CI / validate` | PR + push `main`/`dev` (paths filter) |
| `Deploy to FnB Pages Index` | Push `main` (paths filter) hoặc `workflow_dispatch` |

Repo static HTML — không `yarn install` / không cần token cho npm trong CI.

## Verify

1. Push `main` → Actions → **Deploy to FnB Pages Index** → tab **Summary** (version, build #, Pages repo).
2. Kiểm tra commit trên [Linm.Web.FnB.Page.Index](https://github.com/linm-soft/Linm.Web.FnB.Page.Index): `fnb-demo@{version} [build #N]`.
