# ghali.cloud Landing Pages

Static HTML site — no build step. Open `index.html` or `go.html` directly in browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page |
| `go.html` | Project inquiry form |
| `assets/css/main.css` | All styles |
| `assets/js/main.js` | Theme toggle, modal, form handling |
| `assets/Gcloud.png` | Logo (white) |
| `assets/Gcloud_black.png` | Logo (dark mode) |

## Design System

- **Background**: `#000000` (absolute black)
- **Primary CTA**: Gold `#FFC000` with black text
- **Secondary CTA**: Transparent with white border 50% opacity
- **Zero border-radius** on all elements
- **Typography**: Space Grotesk (Google Fonts)
- **Icons**: Lucide via CDN — initialize with `lucide.createIcons()`

### Button Classes
- `.btn-gold`: Gold background, black text
- `.btn-ghost`: Transparent, white border at 50% opacity

## Development

1. Open `index.html` directly in browser (no server)
2. Call `lucide.createIcons()` after DOM load
3. Theme toggle uses `localStorage` key `'theme'` (values: `'dark'`, `'light'`)
4. Dark mode is default

## Theme Implementation

CSS variables swap on `[data-theme="light"]` on `<html>`:
```css
[data-theme="light"] {
    --black: #FFFFFF;
    --white: #000000;
    /* etc */
}
```
Logo image also swaps via CSS `content: url()`.

## SEO

- `robots.txt` — allow crawlers, point to sitemap
- `sitemap.xml` — site structure
- JSON-LD Organization schema embedded in `index.html`

## Design Reference Docs

- `assets/lamborghini/DESIGN.md` — full Lamborghini-inspired spec (in use)
- `DESIGN.md` — Cohere-inspired reference (not in use)
