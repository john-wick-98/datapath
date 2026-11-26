# 🛤️ DataPath

A free, self-contained learning + placement-prep platform for transitioning into **Data Analyst / Business Analyst / BI Analyst** roles in the Indian job market.

No backend. No login. No database. Everything runs in your browser.

## ✨ Features

- **9 Modules** with 27 topics: SQL, Excel, Power BI/DAX, Python (pandas), Statistics & A/B Testing, Case Studies, Resume & ATS, HR/Behavioral (STAR), Mock Technical Rounds
- **In-browser execution engines** (all free, open-source):
  - **sql.js** (SQLite compiled to WASM) — run real SQL against embedded datasets
  - **Pyodide** (Python + pandas/NumPy compiled to WASM) — run real Python against embedded DataFrames
  - **hot-formula-parser** — evaluate Excel-style formulas against a data grid
- **27 Practice Projects** with Cisco-lab style checkpoints: scenario → sandbox → instant ✓/✗ per checkpoint
- **5 checker types**: `sql`, `python`, `formula`, `numeric`, `ai-review`
- **AI Mentor chat** (floating widget on every page) powered by Google Gemini or Groq free tier
- **Progress tracking**: per-module mastery bars, mock test score trend line (Recharts), GitHub-style streak heatmap
- **Cadence-based mock tests** unlocked every 10 active days, weighted toward weak modules
- **Placement Prep hub**: Resume/ATS Checker, Mock Interview Simulator, STAR Practice, Company Question Bank, CTC & Negotiation primer
- **Diagnostic placement quiz** (18 questions) on first visit
- **Export/Import progress** as JSON

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Charts | Recharts |
| SQL Engine | sql.js (CDN, lazy-loaded) |
| Python Engine | Pyodide (CDN, lazy-loaded) |
| Formula Engine | hot-formula-parser (npm) |
| AI | Google Gemini / Groq (client-side fetch) |
| Persistence | localStorage |

## 📦 Installation

```bash
git clone https://github.com/john-wick-98/datapath.git
cd datapath
npm install
npm run dev
```

Open http://localhost:5173

## 🔨 Build

```bash
npm run build
```

Output goes to `dist/` — a fully static site. No server required.

## 🚀 Deploy to Vercel (One Command)

```bash
npm i -g vercel
vercel
```

Follow the prompts — Vercel auto-detects Vite. The included `vercel.json` handles client-side routing rewrites.

**Or deploy via GitHub integration:**
1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import the repository → Deploy

You can also deploy to **Netlify** or **GitHub Pages** — the build is fully static.

## 🔑 Getting a Free Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Sign in with Google
3. Click **Create API Key**
4. Copy the key
5. In DataPath: **Settings → paste key → Save**

**Free tier limits:**
- 15 requests/minute
- 1,500 requests/day
- 1 million tokens/minute

Your API key is stored **only** in your browser's localStorage. It is never sent anywhere except Google's Gemini API endpoint.

## 🔄 Alternative: Groq (Free Tier)

DataPath also supports Groq as an AI provider:

1. Go to https://console.groq.com/keys
2. Create an account
3. Generate an API key
4. In DataPath **Settings**, switch provider to "Groq" and paste the key

Groq uses LLaMA models and offers very fast inference with a generous free tier. It's a good alternative if Gemini is rate-limited or unavailable.

## ⚡ Lazy-Loaded Engines

**sql.js** and **Pyodide** are loaded dynamically from CDN on first use:

- **Initial page load is fast** — no heavy WASM downloads upfront
- **First SQL project**: sql.js (~1MB) downloads — expect a brief delay
- **First Python project**: Pyodide (~10MB) + pandas/NumPy download — expect a longer delay (10-30 seconds)
- **Subsequent uses are instant** — cached by the browser

This is by design: the engines only load when you actually need them.

## 📊 Adding More Datasets

Datasets are embedded as CSV strings in `src/data/projects.ts`. To add a new one:

1. Create a small CSV (10-20 rows) with **original synthetic data**
2. Add a constant at the top of `src/data/projects.ts`:
   ```typescript
   const NEW_DATA = `col1,col2\nval1,val2\n...`;
   ```
3. Reference it in a project:
   ```typescript
   dataset: { name: 'new_data', type: 'csv', content: NEW_DATA }
   ```

For **multi-table SQL projects** (JOINs), use JSON format:
```typescript
dataset: {
  name: 'multi',
  type: 'json',
  content: JSON.stringify({
    orders: 'order_id,customer_id,total\n1,101,500\n...',
    customers: 'customer_id,name,city\n101,Aarav,Mumbai\n...'
  })
}
```

Static CSV files are also available in `public/data/` for reference.

## 📁 Project Structure

```
src/
├── components/    # Layout, MentorWidget, ProgressRing, QuizComponent,
│                  # PracticeProject, Heatmap, DataTable, Markdown
├── data/          # modules.ts (9 modules × 3 topics), projects.ts (27 projects),
│                  # quiz.ts (diagnostic), placementPrep.ts
├── engines/       # sqlEngine.ts, pythonEngine.ts, formulaEngine.ts, aiEngine.ts
├── pages/         # Dashboard, Modules, ModuleDetail, TopicDetail,
│                  # PracticeProjects, MockTests, Progress, PlacementPrep,
│                  # Mentor, Settings, DiagnosticQuiz
├── store/         # AppStore.tsx (Context + useReducer + localStorage)
└── types/         # TypeScript interfaces
```

## 🧠 State Management

All state is managed via React Context + `useReducer` and persisted to `localStorage`. No backend, no database, no login required.

**Export/Import:** Go to Settings → Export JSON to download your progress. Import JSON to restore on another device.

## 📝 License

MIT — Free to use, modify, and distribute.

## 🤝 Contributing

This is a self-contained learning tool. Feel free to fork and customize for your own learning journey. The external resource links in topics are left as TODOs for you to paste verified URLs.
