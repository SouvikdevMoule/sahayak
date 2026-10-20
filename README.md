# Helpify Home — Phase 1 (Next.js 14 + Tailwind)
    npm install && cp .env.example .env.local && npm run dev
- Free AI: add an OpenRouter key (free `:free` model). Without it, the planner falls back to a built-in template layout.
- Admin-editable data: data/rates.json (norms + city rates), data/dealers.json.
- Production TODOs: auth + DB for AI quota, leads and request status; an admin UI over the JSON data; full translation of page bodies; approved Vaastu/knowledge content.
