# Ella Freire — "Clipper" Shopify theme

A bespoke Shopify Online Store 2.0 theme for [ellafreire.com](https://ellafreire.com), built by The Naked Ad.
Hand-pulled Pan Am, TWA and Braniff luggage-tag prints, presented as destinations on a golden-age route map.

## What makes it different

- **Destination globe.** A real geographic globe (d3-geo orthographic projection, Natural Earth coastlines) plotted from Ella's own products. Wheel zoom is deliberately gated behind Cmd/Ctrl so scrolling past the globe never hijacks the page; a brief prompt appears if the modifier isn't held. Drag to spin, pinch (or hold Cmd/Ctrl and scroll) to zoom, tap a city to rotate to it. Selecting a destination rotates the globe but never changes zoom, so the framing stays as the visitor set it. Selecting a destination reveals the print and animated flight routes fan out from it.
- **Departures board.** A live Pan Am-style board beneath the globe. Statuses come from real stock: *Now Boarding*, *Final Call* (5 or fewer left), *Departed* (sold out).
- **Route map on collection pages.** A full-bleed flat world map of every print in the collection, linked to the grid. The projection is trimmed to 63°N–44°S so it fills the full width edge to edge at a shallow height, with every destination Ella sells comfortably inside the frame. Airline filter chips (Pan Am / TWA / Braniff / Bus & Train).
- **Boarding-pass product page.** Airport code, edition, size swatches with prices, sticky add-to-cart on mobile, details parsed from Ella's descriptions.
- **Luggage-tag product cards**, rotating "officially licensed" stamp, scrolling ticker, drawer cart, drawer nav.
- **Liquid-glass surfaces.** Frosted departures board, destination card, boarding-pass buy box, cart and sticky bar, with graceful fallbacks where `backdrop-filter` is unsupported. The header stays solid navy with a subtle gradient.
- **Zero-config geography.** Cities are detected from product titles (e.g. `PAN AM ‘LONDON’ LUGGAGE TAG`). Over 150 cities are built in. Anything unusual can be overridden with product metafields.

## Connect this repo to Shopify (recommended)

1. In Shopify admin go to **Online Store → Themes → Add theme → Connect from GitHub**.
2. Authorise GitHub, choose `thenaked-ad/Ella-Freire`, branch `main`.
3. The theme appears in the theme library. Click **Customize** to configure, **Publish** when ready.
4. Every push to `main` deploys automatically. Theme editor changes are committed back to the repo.

Alternative: zip the folder contents (not the folder itself) and use **Add theme → Upload zip file**.

## Setup checklist (about 20 minutes)

**Navigation** (Online Store → Navigation)
- Main menu: Destinations (`/collections/all`), Pan Am, TWA, Braniff, About, Exhibitions, Commissions
- Footer menus: Shop, Studio, Help, Follow. Assign each in the Footer section.

**Collections**: create Pan Am, TWA, Braniff, Bus & Train (and any series). The airline filter chips match on product title/type/tags containing those words.

**Pages** (Online Store → Pages): create About, Commissions, Licenses, Exhibitions, Contact and set each page's **Theme template** to the matching one (`about`, `commissions`, `licenses`, `exhibitions`, `contact`). Copy is pre-loaded as editable defaults; page body text, if added, overrides it.

**Homepage** (Customize → Home page)
- Hero: upload two lifestyle images (defaults included).
- Destination globe: choose the collection to plot (defaults to all products).
- Featured editions and Airline collections: pick collections.
- Exhibitions strip: update dates each season.

**Hero images**
The hero ships with transparent cut-out WebPs so the artwork floats on the cream background with no visible photo edge. Keep the "Images are cut-outs" checkbox ticked when using cut-outs; untick it if you upload photographs with their own background, which will then fill and crop the panel instead.

**Products**
- Titles should include the city in quotes, e.g. `PAN AM ‘LONDON’ LUGGAGE TAG` (this is how the globe finds it).
- Track inventory on variants to enable *Final Call* and *Departed* statuses.
- Optional metafields (Settings → Custom data → Products), namespace `custom`:
  `latitude` (decimal), `longitude` (decimal), `airport_code` (text), `country` (text), `edition_size` (integer).

**Policies**: Settings → Policies for Shipping, Returns, Terms, then link them in the Help footer menu.

## Structure

```
assets/      theme.css.liquid, theme.js, globe.js, d3-geo.min.js, globe-land.js, fonts, logo set,
             hero cut-outs (hero-lon.webp, hero-nyc.webp — transparent, blend onto cream),
             lifestyle imagery (square, -wide landscape and -white variants)
layout/      theme.liquid
sections/    header, footer, hero, destination-globe, featured-collection, airline-collections,
             artist-strip, process, exhibitions-strip, newsletter, main-product, main-collection,
             main-cart, main-404, main-page, main-search, main-list-collections, page-* (5 editorial pages)
snippets/    product-card, product-json, cart-drawer, meta-tags, globe-deco, plane-icon
templates/   index.liquid + JSON templates for every Shopify view, customers/*
config/      settings_schema.json, settings_data.json
```

## Engineering notes

Built to avoid the Shopify upload failures we hit on earlier iterations:
- Sections use settings only (no block/default combinations that Shopify silently rejects).
- No `image_tag` filter; all images are plain `<img>` with `image_url`.
- No `default` values on `url` settings.
- Rich text settings are wrapped in `<div>`, never `<p>`.
- All required templates present (password, gift_card, list-collections, customers/*).
- Homepage is `index.liquid` with static sections, which renders even if one section has an issue.

Globe scripts (~160 KB) load only on the homepage and collection pages.


## Logo

Ella's handwritten signature, used as the primary mark.

| File | Use |
|---|---|
| `logo-rev.png` | Site header and footer (white, transparent) |
| `logo.png` | Navy version for light backgrounds and print |
| `favicon.png` | Browser icon (signature on navy) |

Both are supplied at 677 × 200 with transparency, which is roughly 2x the largest on-screen size, so they stay crisp on retina displays. To swap in a different logo, upload it in the Header section settings; leaving that empty falls back to the signature.

**Colours.** Navy `#0F2647` (deep `#0A1C38`, near-black `#071427`), cream `#F5F0E7`, antique gold `#E3B23C`, signal red `#E8503A`. Clear space: the height of the signature's ascender on all sides. Never recolour, stretch, or place the navy version on a dark background — use `logo-rev.png`.
