# ghali.cloud Landing Pages

Static HTML site — no build step. Open any `.html` file directly in browser.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page (French) |
| `go.html` | Project inquiry form |
| `policy.html` | Legal policies |
| `comingsoon.html` | Coming soon page (Blog) |
| `contact.php` | Form backend (SMTP email via PHPMailer) |
| `assets/css/main.css` | All styles |
| `assets/js/main.js` | Theme toggle, modal, form handling |
| `assets/lamborghini/DESIGN.md` | Full design spec |

## Design System

- **Background**: `#000000` (absolute black)
- **Primary CTA**: Gold `#FFC000` with black text
- **Secondary CTA**: Transparent with white border 50% opacity
- **Zero border-radius** on all elements (non-negotiable)
- **Typography**: Space Grotesk (Google Fonts) — NOT Inter
- **Icons**: Lucide via CDN
- **Animations**: animate.css CDN

### Button Classes
- `.btn-gold`: Gold background, black text
- `.btn-ghost`: Transparent, white border 50% opacity

## Development

1. Open any `.html` directly in browser (no server needed)
2. **Always call `lucide.createIcons()`** after any DOM manipulation (also at end of main.js)
3. Theme toggle: `localStorage` key `'theme'` (`'dark'` or `'light'`)
4. Dark mode is default
5. Logo swaps via CSS `content: url()` on `[data-theme="light"]`
6. Nav blur effect via `::before` pseudo-element with `backdrop-filter`

## PHP Backend (contact.php)

- **Requires**: `composer install` to generate `vendor/autoload.php`
- **Config**: Copy `.env.example` to `.env` and set SMTP credentials
- **Endpoints**: POST to `contact.php` → sends email via SMTP
- **Env vars**: `SMTP_HOST`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM_EMAIL`, `MAIL_TO`

## Footer Links

- **Mentions légales** → `policy.html`
- **CGU** → `assets/ghali_cloud_CGU.pdf` (new tab)
- **RGPD** → `assets/RGPD.pdf` (new tab)
- **Blog** → `comingsoon.html`

## SEO

- `robots.txt` and `sitemap.xml` included
- JSON-LD Organization schema in `index.html`
