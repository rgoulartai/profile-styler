# Profile Styler

> AI-powered Instagram profile styler — import your photos, pick a niche, get a magazine-quality grid in minutes.

**Status:** MVP / portfolio prototype (January 2026). Built on the Emergent.sh platform.

---

## What it does

Imports a creator's Instagram photos, analyzes them, and proposes professional grid layouts using proven design patterns. Built for content creators who want a cohesive feed without design skills.

## Features

### 6 niche profiles
Business, Beauty, Travel, Fashion, Fitness, Food — each with niche-specific filter palettes, layout patterns, and AI-generated copy suggestions.

### 9 grid layout patterns
- **Alternating** — text/photo rotation
- **Checkerboard** — 2D alternation
- **Row-based timeline** — morning / midday / evening rows for travel storytelling
- **Product → Results** — beauty product followed by application result
- **Rainbow flow** — color tonality per row, gradient across rows
- **Color gradient** — subtle transitions across the grid
- **Dominant background** — consistent backdrop, mix of photos and text (food)
- **Moody motivation** — dark filters + Nike-style overlays (fitness)
- **Custom** — drag-and-drop free arrangement

### 12 filters
Modern Bright, Vintage Warmth, Moody Dark, Bright & Airy, Polaroid Retro, High Fashion, Clean Minimal, Warm Glow, Cool Tone, Film Grain, Sunset Gold, Ocean Blue. Apply globally, per row, or per photo. Side-by-side comparison view for picking the final look.

### AI text overlays
Niche-aware copy suggestions (*"Curate your aesthetic"* for beauty, *"Wanderlust captured in every frame"* for travel) with font, size, color, and background controls.

### Smart suggestions
Auto-detects niche from photo content. Warns if filter combinations create visual discord. Suggests optimal filters per niche.

---

## Tech stack

- **Frontend:** React (CRA + craco), Tailwind CSS, shadcn/ui
- **Backend:** FastAPI, MongoDB (Motor async), Pillow for image processing
- **AI:** Emergent multi-LLM proxy (`emergentintegrations`)
- **Auth:** bcrypt
- **Build platform:** Emergent.sh

---

## Setup

```bash
# Backend
cd backend
cp .env.example .env   # fill in EMERGENT_LLM_KEY and MONGO_URL
pip install -r requirements.txt
uvicorn server:app --reload

# Frontend
cd frontend
yarn install
yarn start
```

---

## Repository contents

- **PRD.md** — Full product requirements: executive summary, personas, layout patterns, filter system, AI text suggestions, niche detection logic
- **design_guidelines.json** — Visual design tokens
- **backend/server.py** — FastAPI server
- **backend_test.py** — Backend test suite
- **frontend/** — React app
- **test_result.md** — Test coverage notes
- **image_testing.md** — Image processing test notes
