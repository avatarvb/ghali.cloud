# ghali.cloud Landing Pages

Static HTML/PHP site — no build step. Open any `.html` file directly in browser.

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page (French) |
| `go.html` | Project inquiry form |
| `discuss.html` | Discussion/page (French) |
| `policy.html` | Legal policies |
| `comingsoon.html` | Coming soon page (Blog) |
| `contact.php` | Form backend — SMTP email via PHPMailer + rate limiting (5 req/hr/IP) |
| `assets/css/main.css` | All styles (CSS vars, dark/light theme via `[data-theme]`) |
| `assets/js/main.js` | Theme toggle, modal, form handling, counter animations |
| `DESIGN.md` | Cohere-inspired design spec (reference) |
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

### Theme System
- CSS custom properties swap on `[data-theme="light"]` — black/white invert
- Logo swaps via CSS `content: url()` (dark: `Gcloud.png`, light: `Gcloud_black.png`)
- `localStorage` key `'theme'` (`'dark'` or `'light'`), dark is default
- Nav blur effect via `::before` pseudo-element with `backdrop-filter`

## Development

1. Open any `.html` directly in browser (no server needed for static pages)
2. **Always call `lucide.createIcons()`** after any DOM manipulation (called at top of main.js and at end of DOMContentLoaded)
3. PHP endpoints (`contact.php`) require a PHP server: `php -S localhost:8000`

## PHP Endpoints

### contact.php
- POST only — returns JSON `{success, message}`
- Rate limited: 5 requests per hour per IP (file-based in temp dir)
- Validates: name (2-100), email, message (10-5000), phone (optional), company (optional)
- Sends via SMTP (Hostinger defaults)

### Env Vars (`.env` — never commit)
| Var | Purpose |
|-----|---------|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | SMTP connection |
| `SMTP_USERNAME`, `SMTP_PASSWORD` | SMTP auth |
| `SMTP_FROM_EMAIL`, `SMTP_FROM_NAME` | Sender identity |
| `MAIL_TO` | Recipient |

Run `composer install` to generate `vendor/autoload.php`.

## Dependency Management

- **PHP**: Composer — `composer.json` (PHPMailer). `vendor/` IS committed to git (not gitignored).
- **Node**: No root `package.json`. `.opencode/` has its own `package.json` for OpenCode plugin.
- **No build step, no bundler, no linter, no formatter.**

## Footer Links

- **Mentions légales** → `policy.html`
- **CGU** → `assets/ghali_cloud_CGU.pdf` (new tab)
- **RGPD** → `assets/RGPD.pdf` (new tab)
- **Blog** → `comingsoon.html`

## SEO

- `robots.txt` and `sitemap.xml` at root
- JSON-LD Organization schema in `index.html`
