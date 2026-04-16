# ghali.cloud Landing Pages

Static HTML site — no build step. Open any `.html` file directly in browser.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page (French) |
| `go.html` | Project inquiry form |
| `policy.html` | Legal policies (privacy, terms, cookies, legal notice) |
| `comingsoon.html` | Coming soon page (Blog) |
| `assets/css/main.css` | All styles |
| `assets/js/main.js` | Theme toggle, modal, form handling |
| `assets/Gcloud.png` | Logo (dark mode) |
| `assets/Gcloud_black.png` | Logo (light mode) |
| `assets/ghali_cloud_CGU.pdf` | Terms of Service PDF |
| `assets/RGPD.pdf` | GDPR document PDF |

## Design System

- **Background**: `#000000` (absolute black)
- **Primary CTA**: Gold `#FFC000` with black text
- **Secondary CTA**: Transparent with white border 50% opacity
- **Zero border-radius** on all elements (non-negotiable)
- **Typography**: Space Grotesk (Google Fonts) — NOT Inter
- **Icons**: Lucide via CDN — **must call `lucide.createIcons()` after DOM load**
- **Animations**: animate.css CDN for UI animations

### Button Classes
- `.btn-gold`: Gold background, black text
- `.btn-ghost`: Transparent, white border at 50% opacity

## Development

1. Open any `.html` directly in browser (no server)
2. **Always call `lucide.createIcons()`** after DOM load (also call at end of main.js)
3. Theme toggle uses `localStorage` key `'theme'` (values: `'dark'`, `'light'`)
4. Dark mode is default
5. Logo image swaps via CSS `content: url()` on `[data-theme="light"]`
6. Nav has blur effect via pseudo-element `::before` with `backdrop-filter`

## Footer Links

- **Mentions légales** → `policy.html`
- **CGU** → `assets/ghali_cloud_CGU.pdf` (opens in new tab)
- **RGPD** → `assets/RGPD.pdf` (opens in new tab)
- **Blog** → `comingsoon.html`

## Design Reference

- `assets/lamborghini/DESIGN.md` — Full Lamborghini-inspired spec (in use)
- `DESIGN.md` — Cohere-inspired reference (not in use, ignore)

## SEO

- `robots.txt` and `sitemap.xml` included
- JSON-LD Organization schema embedded in `index.html`
