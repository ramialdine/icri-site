# Copilot Instructions for ICRI Site

Before generating or modifying app pages, follow this order:

1. Read and apply [docs/design-standard.md](../docs/design-standard.md).
2. Reuse existing primitives from `components/ui` (`Button`, `Card`, etc.).
3. Keep global header and route-derived breadcrumbs in `components/SiteChrome.tsx` as the only standard header implementation for public pages.
4. Do not add page-level duplicate headers on public routes.
5. For images, enforce alt text, sizing, and ratio guidance from the design standard.
6. Preserve accessibility and dark-mode behavior.

When uncertain, prefer consistency with existing files over introducing new patterns.
