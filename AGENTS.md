# AGENTS.md

Static landing pages for ghali.cloud (AI agency). No build step — open `index.html` or `go.html` directly in browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page |
| `go.html` | Project inquiry form |
| `ghali_cloud_©_2026.md` | Content source |
| `assets/` | Logo images (`Gcloud.png`, `Gcloud_black.png`) |
| `assets/js/main.js` | Shared JavaScript (theme, modal, form handling) |
| `assets/lamborghini/DESIGN.md` | Full design system spec |
| `DESIGN.md` | Cohere-inspired reference (not in use) |

## Design System (Lamborghini-inspired)

### Key Rules
- Background: `#000000` (absolute black)
- Primary CTA: Gold `#FFC000` with black text
- Secondary CTA: Transparent with white border 50% opacity
- **Zero border-radius** on all elements
- Typography: Space Grotesk (Google Fonts)
- Icons: Lucide via CDN (`https://unpkg.com/lucide@latest`)

### Button Classes
- `.btn-gold`: Gold background, black text (primary CTA)
- `.btn-ghost`: Transparent, white border 50% opacity (secondary)

### Lucide Icons
```html
<i data-lucide="icon-name"></i>
<script>lucide.createIcons();</script>
```

## Development

1. Open `index.html` directly in browser (no server needed)
2. Lucide icons auto-initialize via `lucide.createIcons()`
3. Theme toggle uses `localStorage` key `'theme'` (values: `'dark'`, `'light'`)
4. Dark mode is default

## SEO Files
- `robots.txt` — Allow crawlers, point to sitemap
- `sitemap.xml` — Site structure for search engines
- Structured data (JSON-LD) embedded in `index.html` for Organization schema
