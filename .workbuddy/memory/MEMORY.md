# pdfcraft-pdf-tpsh-3 — Project Notes

## Build / CI constraints
- Build = `next build` with `output: 'export'` (static export). Next.js copies entire `public/` → `out/` at the end of build.
- 2026-09-25: CI build failed with `ENOSPC: no space left on device` while copying `public/pymupdf-wasm/opencv_python…whl` → `out/`. Build SUCCEEDED through compile/lint/2227-page generation; died only at the final public→out copy.
- Root cause = build workspace is on `/dev/shm` (tmpfs, RAM-backed, small). Whole tree (node_modules ~1.1GB + .next + public→out duplicate) exceeds tmpfs capacity. Not a code error.
- Log shows EdgeOne Pages `@edgeone/opennextjs-pages` plugin + `routes.json` generation → managed build, repo staged under `/dev/shm/repo/...`.
- `public/libreoffice-wasm/soffice.wasm.bin` / `.data.bin` (236MB, uncompressed) are correctly gitignored (.gitignore:78-82) and regenerated locally via `predev`/`decompress-wasm.mjs public`. CI `npm run build` is just `next build` (no decompress) → those 236MB never enter CI. Keep it that way.
- CI `public/` ≈ 150MB (libreoffice .gz 74M + pymupdf-wasm 62M + others).
- Fix levers: (1) build on real disk / raise tmpfs (mandatory — node_modules alone won't fit small tmpfs); (2) move wasm assets out of `public/` and inject into `out/` postbuild, or host on object storage + load via URL to shrink export; (3) use `npm ci` (already in Dockerfile).
- Local build works fine (real disk); failure is CI-only.
- **Resolution (2026-09-25):** Don't use EdgeOne Git auto-build (can't fit node_modules 1.1GB on their tmpfs). Instead build locally and deploy the PREBUILT `out/`: (1) EdgeOne Pages console "Upload" of `out/`; (2) `edgeone` CLI `edgeone makers deploy ./out -n <name>` after `npm i -g edgeone` + `edgeone login`; (3) Git auto-deploy-without-build = set console BuildCommand=`echo skip`, Output=`out`, and `git add -f out` (out is gitignored). Added `scripts/deploy-edgeone.mjs` (+ `npm run deploy:edgeone`) and `edgeone.json` (noop build, output `out`). `edgeone.json` is Makers-oriented; for the Next.js Pages project the console build-command setting is what matters.
