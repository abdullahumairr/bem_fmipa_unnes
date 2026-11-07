# Project memory

## Product intent & audience

- Public institutional website for Kabinet Gema Restorasi 87, serving visitors seeking organizational identity, leadership, structure, programs, achievements, news, and contact information.
- Indonesian-language content and institutional messaging are central to the experience.
- The Struktur page presents organizational personnel and their roles through individual profile cards.

## Brand personality & voice

- Formal, institutional, and aspirational, with clear public-facing information.
- Uses concise labels, structured content, and visual emphasis to communicate leadership and organization.
- Brand expression combines navy/blue foundations with warm amber or yellow highlights.

## Visual design & UX direction

- Landing pages favor editorial compositions, generous spacing, rounded cards, soft borders, and clear typographic hierarchy rather than dashboard-like layouts.
- Responsive grids should collapse cleanly on smaller screens, with stacked content remaining readable and usable.
- Structure personnel cards use a consistent reference-matched gradient treatment: blue `#045CB4`, transitioning through a green/gray middle tone, to yellow `#F1C536`.
- The same gradient styling applies consistently across all people cards in Struktur, including the role/title label and fallback-initial presentation.
- Prefer consistent icon and card treatments using existing project conventions; avoid introducing unnecessary visual systems.

## Decisions, constraints & rationale

- Structure-card gradient styling is scoped to the Struktur page and should not alter unrelated pages.
- All personnel cards should share the same gradient rather than using per-person variations, preserving visual cohesion.
- Existing responsive behavior and card usability must be retained while applying the gradient.
- Static Home copy remains centralized in `src/frontend/content/home-content.ts`; database-backed highlights continue to use existing data sources.
- Continue following established Next.js App Router, Tailwind/shadcn, Lucide, and component conventions.
- Use client directives when hooks require client components, and avoid server/client markup mismatches.

## Open questions & assumptions

- The exact Struktur component and stylesheet paths are not documented in memory.
- The precise middle transition color and gradient direction should follow the supplied visual reference if further refinement is needed.
- It is assumed the requested “semua caras sturuktur” means all personnel/profile cards on the Struktur page.
- It is not confirmed whether the gradient is implemented as a border, background, or both; maintain the demonstrated appearance consistently.