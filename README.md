# PS2 Configurable Tweaks

Web app for editing PS2 game patches/cheats. Browse, tweak, and export `.pnach` files or patch ISOs directly in the browser.

**Live site:** https://igorciz777.github.io/PS2-Configurable-Tweaks/

---

### Tech Stack

**Frontend** (React + Vite, `frontend/`):
- react, react-dom, react-chartjs-2, chart.js
- motion, react-markdown, remark-gfm, react-tooltip
- tailwindcss, @tailwindcss/postcss, postcss
- streamsaver, web-streams-polyfill
- TypeScript, oxlint, vite

**WASM patcher** (Rust, `wasm-patcher/`):
- wasm-bindgen, serde, serde_json
- Target: `wasm32-unknown-unknown`

---

### Build & Run

**Prerequisites:** Node.js >= 22, Rust toolchain + `wasm32-unknown-unknown` target, `wasm-bindgen-cli 0.2.126`

```bash
# Build WASM module
cd wasm-patcher
cargo build --release --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/release/wasm_patcher.wasm --out-dir ../frontend/src/wasm --target web

# Install frontend deps and run dev server
cd ../frontend
npm install
npm run dev
```

For production build:
```bash
cd frontend
npx tsc -b && npx vite build
```

Output goes to `frontend/dist/`.

---

### Adding Game Config Files

Configs live in `frontend/src/config/games/<Game Name>/`. Each game folder contains one or more `.json` files (one per region/revision).

Minimal config structure:
```json
{
  "label": "Game Display Name",
  "filename": "game_key",
  "fields": [
    {
      "id": "field_id",
      "type": "percent|boolean|float|integer|color|dropdown|deadzone",
      ...
    }
  ]
}
```

- `filename` becomes the `.pnach` filename and game key.
- Field types and their properties are defined in `frontend/src/fields/`.
- See existing configs in `frontend/src/config/games/` for reference.
