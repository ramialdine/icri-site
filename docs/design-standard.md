# ICRI Design Standard (AI Reference)

This document is the source of truth for generating new pages and UI content in this repo.

## 1) Page Structure

Use this default page skeleton unless a page has a specific reason not to:

1. Root wrapper: `min-h-screen` + appropriate background classes.
2. Content container: `mx-auto max-w-6xl` or `max-w-7xl`.
3. Horizontal spacing: `px-4 sm:px-6 lg:px-8`.
4. Vertical rhythm: section spacing with `py-8`, `py-10`, `py-12`, or `lg:py-14`.
5. Use shared `Card` and `Button` components before custom primitives.

## 2) Header + Breadcrumbs

- The standard header is mounted globally in `SiteChrome`.
- Breadcrumbs are derived from route path segments (`usePathname()`).
- Do not add page-local headers for regular public pages.
- Breadcrumb row is hidden on home (`/`) and shown for inner routes.
- On mobile, non-donate links collapse into a hamburger menu in `SiteChrome`.
- Exclusions: `/preview/*`, `/studio/*`.

## 3) Typography + Voice

- Eyebrows: `text-sm font-semibold uppercase tracking-[0.2em]` (or `0.24em/0.25em`).
- Main headings: `text-4xl sm:text-5xl` with `font-bold`.
- Body copy: `text-base leading-7` and token-based foreground classes.
- Tone: welcoming, clear, concise, community-centered.

## 4) Buttons

Always use `components/ui/button.tsx`.

### Primary CTA
- `className="rounded-2xl bg-emerald-700 hover:bg-emerald-800"`
- Use for primary actions (Donate, Submit, View details).

### Secondary CTA
- `variant="outline"` + `className="rounded-2xl"`
- Use for secondary navigation or management links.

### Rules
- Keep CTA labels action-oriented.
- Prefer 1 primary + 1 secondary CTA per card/hero region.

## 5) Cards and Surfaces

Always use `components/ui/card.tsx`.

- Common radius: `rounded-[24px]`, `rounded-[30px]`, or `rounded-[32px]`.
- Use subtle depth (`shadow-sm`) unless hero-level emphasis is needed.
- Borders should remain soft and token-friendly (`border-stone-200`, dark variants).

## 6) Images

Use `next/image` for local and CMS assets unless preview-only rendering requires `<img>`.

### Ratios and containers
- Hero/banner: `aspect-video` or wide fixed-height region.
- Card images: `aspect-[16/10]` or small flyer thumbs.
- Use `object-cover` for content imagery; `object-contain` for logos.

### Accessibility
- Every image must have meaningful `alt` text.
- Decorative images may use empty alt only when truly non-informational.

### Performance
- Use `sizes` consistently.
- Use `priority` only for above-the-fold hero/logo assets.

## 7) Color + Theme

- Respect token classes (`bg-background`, `text-foreground`) where possible.
- Existing emerald brand accents are acceptable for key highlights and CTAs.
- Dark mode must remain readable and maintain contrast.

## 8) Accessibility Baseline

- Keyboard accessible dropdowns/buttons.
- Visible focus states (`focus-visible:*`).
- Ensure semantic heading order (`h1` then `h2`/`h3`).
- Avoid low-contrast text/background pairings.

## 9) Content + Data Integration

- If content is CMS-driven, use existing `sanity/lib/content` helpers.
- Keep fallback content concise and user-friendly.
- Do not hardcode stale dates unless explicitly intended as fallback examples.

## 10) Build Rules for AI-generated Pages

When creating or editing pages:

1. Start from this design standard.
2. Reuse existing UI primitives first.
3. Keep class names consistent with current style language.
4. Keep route-derived header behavior intact.
5. Avoid introducing alternate navigation/header implementations.
