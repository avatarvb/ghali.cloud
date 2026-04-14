# AGENTS.md

## Repository Purpose

This repo contains:
- Design system specifications (`DESIGN.md`, `lamborghini/DESIGN.md`)
- A landing page (`index.html`) for ghali.cloud (AI agency)
- Content source (`ghali_cloud_©_2026.md`)

## Design Systems

### Cohere-Inspired (`DESIGN.md`)
- 22px border-radius signature
- CohereText serif for headlines, Unica77 sans for body
- Black/white palette with cool grays
- Purple-violet hero sections
- Interaction Blue (#1863dc) for hover states

### Lamborghini-Inspired (`lamborghini/DESIGN.md`)
- Absolute black (#000000) canvas
- Zero border-radius everywhere
- Space Grotesk as serif fallback
- Gold accent (#FFC000) for CTAs
- All uppercase typography

## Landing Page Stack

- **HTML/CSS/JS**: Single `index.html` file
- **Fonts**: Space Grotesk (display), Inter (body) via Google Fonts
- **Icons**: Lucide via `https://unpkg.com/lucide@latest`
- **Animations**: Animate.css via CDN
- **No build step**: Plain HTML, works by opening in browser

## Content Workflow

When updating `index.html`:
1. Reference `ghali_cloud_©_2026.md` for text content
2. Follow Lamborghini design system for styling
3. Use Lucide icon names with `data-lucide="icon-name"` attribute
4. Call `lucide.createIcons()` after DOM loads to render icons

## Common Patterns

### Lucide Icon
```html
<i data-lucide="icon-name"></i>
```

### Button Variants
- `.btn-gold`: Gold background, black text (primary CTA)
- `.btn-ghost`: Transparent with white border 50% opacity (secondary)

### Card Grid
```css
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 2px;
background: var(--charcoal);
```

## Key Colors (Lamborghini)
- `--gold`: #FFC000
- `--black`: #000000
- `--charcoal`: #202020
- `--ash`: #7D7D7D (body text)
