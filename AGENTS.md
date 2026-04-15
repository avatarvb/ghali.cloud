# AGENTS.md

## Project Overview

Static landing pages for ghali.cloud (AI agency). No build step — open `index.html` or `go.html` directly in browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page |
| `go.html` | Project inquiry form |
| `ghali_cloud_©_2026.md` | Content source |
| `assets/` | Logo images (`Gcloud.png`, `Gcloud_black.png`) |

## Design System

The HTML files use the **Lamborghini-inspired** design (defined in `assets/lamborghini/DESIGN.md`).

### Key Rules
- Background: `#000000` (absolute black)
- Primary CTA: Gold `#FFC000` with black text
- Secondary CTA: Transparent with white border 50% opacity
- **Zero border-radius** on all elements
- Typography: Space Grotesk (Google Fonts)
- Icons: Lucide via CDN (`https://unpkg.com/lucide@latest`)
- All text: uppercase for headings/labels

### Lucide Icons
```html
<i data-lucide="icon-name"></i>
<script>lucide.createIcons();</script>
```

### CSS Variables
```css
--gold: #FFC000
--black: #000000
--charcoal: #202020
--dark-iron: #181818
--ash: #7D7D7D (body text)
```

### Button Classes
- `.btn-gold`: Gold background, black text (primary CTA)
- `.btn-ghost`: Transparent, white border 50% opacity (secondary)

## Development

1. Open `index.html` directly in browser (no server needed)
2. Lucide icons auto-initialize via `lucide.createIcons()`
3. Theme toggle uses `localStorage` key `'theme'` (values: `'dark'`, `'light'`)
4. Dark mode is default

## Content Updates

When updating `index.html`, reference `ghali_cloud_©_2026.md` for text content.
