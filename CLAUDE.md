# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SvelteKit portfolio website featuring scroll-driven GSAP animations, 3D elements with Three.js, and Lottie animations. Content is in French. Uses pnpm as package manager.

## Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build (adapter-node, output in `build/`)
- `pnpm preview` — Preview production build
- `pnpm check` — Type-check with svelte-check
- `pnpm lint` — Check formatting (Prettier) and linting (ESLint)
- `pnpm format` — Auto-format with Prettier

No test runner is configured.

## Tech Stack

- **Framework**: SvelteKit 2 with Svelte 4, TypeScript (strict mode)
- **Styling**: Tailwind CSS 3 with dark mode via `class` strategy
- **Animations**: GSAP 3 (ScrollTrigger, SplitText, DrawSVG, MotionPath, MorphSVG, Flip, Draggable)
- **3D**: Three.js (RollingCube component)
- **Icons**: lucide-svelte
- **Lottie**: @lottiefiles/dotlottie-svelte
- **Fonts**: Gabarito (body), Readex Pro (UI) via Google Fonts

## Architecture

### GSAP Animation System

The core of this project is a scroll-driven animation pipeline:

1. **`src/lib/gsap.ts`** — Lazy-loads all GSAP plugins with caching and SSR stubs. All GSAP imports go through `loadGsapAll()`.

2. **`src/lib/anim/master.ts`** — Creates a master GSAP timeline bound to `#portfolioScroller` via ScrollTrigger. Exposes `FeatureCtx` (gsap instance, timeline, scroll element, utilities) that all animation features receive.

3. **`src/lib/anim/ranges.ts`** — Defines scroll position ranges (pixel-based `{start, end}`) for each animation section. Features use `ctx.utils.at(range, progress)` to place animations at the right scroll position.

4. **`src/lib/anim/features/*.ts`** — Each feature is a function `build<Feature>(ctx: FeatureCtx, range: Range, opts?)` that adds animations to the shared timeline. Features: intro, introGrid, plane, sky, city, forest, forestTexts, welcomeText, petalsFactory, sea.

The main page (`src/routes/+page.svelte`) orchestrates everything: it loads GSAP, creates the master timeline, and calls each feature builder.

### Scroll Container

The site uses a custom scroll container (`#portfolioScroller` wrapping `#scrollContent`) instead of window scroll. All ScrollTrigger instances must reference this scroller.

### Stores

- **`theme.ts`** — Dark/light theme with localStorage persistence and system preference detection. Toggles `dark` class on `<html>`.
- **`stores.ts`** — `activeCard` writable for Card expand/collapse state.
- **`experiences.store.ts`** — Experience data as readable stores with associated Svelte components.
- **`listScroller.store.ts`** — Active index for the ListScroller component.

### Experience Pages

Each experience (Elephantastic, Simco) has:
- A content component in `src/lib/components/experiences/` (e.g., `Elephantastic.svelte`)
- A route under `src/routes/experiences/<name>/`
- Data defined in `src/lib/stores/experiences.store.ts`
- `ExperienceCard.svelte` wraps content with layout, metadata display, and action buttons

### SSR Strategy

SSR is disabled in dev mode and enabled in production (`src/routes/+page.server.ts`). CSR is always on. GSAP loading returns SSR-safe stubs when `browser` is false.

## Key Conventions

- GSAP animation features follow the `build<Feature>(ctx, range, opts?)` pattern — maintain this when adding new animations
- Tailwind custom colors are defined in `tailwind.config.js` (pastel, text-light/dark, surface-light/dark, border-light/dark, accent-yellow/green, bg-light/dark)
- Dark mode: use Tailwind's `dark:` variant classes — theme toggling is handled by the store
- Static assets (images, audio, lottie) go in `static/` with subdirectories per experience
