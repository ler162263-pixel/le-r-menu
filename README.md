# Le R — Static Digital Restaurant Menu

A fast, mobile-first, **read-only static digital restaurant menu** built with **React + TypeScript + Vite + Tailwind CSS**, powered entirely by local JSON (`src/data/menu.json`) and designed for **free GitHub Pages hosting** and **QR code table access**.

> **Preserved Design Identity:** Built around the approved **Le R — "The Printed Card, Alive"** aesthetic (warm parchment `#F5E6C5` / `#FBF1DA`, deep maroon `#8E0F14`, house dark-brown feature panels `#5A4126`, Libre Caslon & Alfa Slab typography, responsive botanical palm engravings, and Algerian Dinar `DA` pricing).

---

## Architecture & Read-Only Scope

- **100% Static Frontend**: Zero backend, zero database, zero Firebase/Supabase, zero authentication, zero admin dashboard, zero server APIs.
- **Customer Read-Only Access**: Customers scan the table QR code and browse the restaurant homepage (`/`), full digital menu (`/#/menu`), instant product search, category jump rail, availability status, and dish details modal.
- **Developer-Managed Content**: All restaurant info, categories, dishes, prices (`DA`), availability (`available: true | false`), and images are managed directly in `src/data/menu.json` and `public/images/` (or `src/assets/`).

### Note on Removed Modules
Per the strict read-only static specification (Sections 1, 4, and 10), the previous Owner Dashboard (`/owner/*`), owner authentication (`/owner/login`, `AuthContext`), backend API stubs (`src/services/*`), and customer review submission/OTP moderation flow (`/reviews`) were removed so restaurant owners and customers have strictly read-only menu access with zero server dependencies.

---

## Folder Structure

```text
├── .github/workflows/deploy.yml   # Automated free GitHub Pages deployment
├── public/
│   └── images/                    # Custom client logos & product photos
├── scripts/
│   └── generate-qr.mjs            # Developer CLI to generate print-ready QR PNG
├── src/
│   ├── assets/                    # Le R engravings, icons, parchment & palm art
│   ├── components/
│   │   ├── common/                # Motion primitives, ornaments, SafeMenuImage, switchers
│   │   └── public/                # PublicHeader, HeroSection, ProductDetailModal, PublicFooter
│   ├── config/                    # Theme config defaults
│   ├── contexts/                  # Theme, Language (FR/EN/AR), Toast, RestaurantDataContext
│   ├── data/
│   │   └── menu.json              # Single source of truth for restaurant & menu items
│   ├── hooks/                     # Context wrapper hooks
│   ├── i18n/                      # FR / EN / AR translations
│   ├── layouts/                   # PublicLayout
│   ├── pages/public/              # HomePage, MenuPage, NotFoundPage
│   ├── routes/                    # AppRoutes (HashRouter for zero-404 GitHub Pages)
│   ├── types/                     # TypeScript interfaces
│   └── utils/                     # jsonMenuLoader, restaurantLogic, qrCodeLogic + *.test.ts
└── vite.config.ts                 # Configured with base: './' for subpath compatibility
```

---

## Local Development

```bash
npm install
npm run dev
```

Useful commands:
- `npm run dev` — Start local dev server on `http://localhost:3000`
- `npm run build` — Build static production bundle into `dist/`
- `npm run preview` — Preview production build locally
- `npm run lint` — Run TypeScript type check (`tsc --noEmit`)
- `npm test` — Run unit tests (`src/utils/*.test.ts`)

---

## Deploying for Free on GitHub Pages

1. Create a new GitHub repository (e.g. `le-r-menu`) and push this project to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Deploy static digital menu"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```
2. In your GitHub repository, go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` workflow automatically builds `npm run build` and publishes `dist/` to:
   ```
   https://<USERNAME>.github.io/<REPO_NAME>/
   ```
4. Because `vite.config.ts` uses `base: './'` and `App.tsx` uses `HashRouter`, your digital menu URL works directly with **zero 404 errors** at:
   ```
   https://<USERNAME>.github.io/<REPO_NAME>/#/menu
   ```

---

## Generating the Print-Ready QR Code (After Deployment)

**Important:** Never generate a QR code for `localhost` or before the site is live. Wait until GitHub Pages finishes deploying so you have the final published URL.

Run the included developer QR generator script with your **published URL**:

```bash
npm run generate-qr -- https://<USERNAME>.github.io/<REPO_NAME>/#/menu
```

This validates that the URL is a real published link (blocking `localhost`, `127.0.0.1`, and placeholder domains) and saves a high-contrast `1024×1024` PNG (`#000000` on `#FFFFFF`, Error Correction `H`) inside `qr-output/<restaurant>-menu-qr.png`, ready to send to the restaurant owner for table printing.

---

## Duplicating This Template for Another Restaurant

To launch an independent menu website for a new restaurant client:

1. **Duplicate the folder / create a new GitHub repo** from this template.
2. **Replace images** inside `public/images/`:
   - Add client logo: `public/images/logo.png`
   - Add product photos: `public/images/products/*.jpg`
3. **Edit `src/data/menu.json`**:
   - Update `restaurant.name`, `restaurant.subtitle`, `restaurant.logo` (`"/images/logo.png"`), `restaurant.description`, `restaurant.address`, `restaurant.hours`, `restaurant.phone`, and `restaurant.social`.
   - Optionally customize brand colors under `restaurant.theme` (`brandColor`, `accentRed`, `parchmentBase`, `parchmentLight`, `darkFeature`).
   - Replace `categories` and `products` (supports plain strings like `"name": "Margherita"` or `{ "fr": "...", "en": "...", "ar": "..." }`, `price` in DA, `image`, and `available: true | false`).
4. **Update `<title>` and `<meta>` in `index.html`** to match the client's restaurant name.
5. **Test locally** (`npm run build && npm run preview` and check mobile viewport).
6. **Push to the client's GitHub repo** to deploy on GitHub Pages.
7. **Generate the client's unique QR PNG** using their live GitHub Pages URL:
   ```bash
   npm run generate-qr -- https://<USERNAME>.github.io/<CLIENT_REPO>/#/menu
   ```
