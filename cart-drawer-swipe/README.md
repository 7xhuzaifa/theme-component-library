# Cart drawer swipe

## Brief
**In one sentence:** Lets shoppers on touch screens close Horizon's cart
drawer by dragging it sideways with their finger, and adds a setting for
how fast the drawer opens and closes.

- **What it does:** The drawer follows the finger as it's dragged toward
  its edge. A quick flick, or a drag past about a third of its width,
  closes it; otherwise it springs back. A touch while it's sliding catches
  it. Scrolling the cart up and down still works.
- **Settings:** Theme settings → Cart, shown only when Cart type is Drawer.
  - Swipe to close (on/off). When off, the swipe script isn't loaded.
  - Drawer slide time (100–600 ms, default 300 ms; Horizon's own is 125 ms).
    Works with or without swipe.
- **Scope:** Cart drawer only. Horizon's shared drawer files are not
  changed, so the filters, pickup and chat drawers behave as before.
  Horizon's own close runs at the end, so focus return and scroll
  position are kept. No swipe-to-open (it clashes with the iOS back gesture).
- **Files:** New `assets/cart-drawer-swipe.js`. Edited
  `snippets/cart-drawer.liquid` (script tag and a style block) and
  `config/settings_schema.json` (two settings).
- **Built for:** Horizon 4.5.0.
- **Evidence:**
  - Owner-confirmed: swipe to close works on a phone, 20 November 2026,
    in the Horizon 4.5.0 cart build theme.
  - Untested: tablets and desktops 990px and wider (the drawer sits
    beside the page there), right-to-left languages, reduced-motion mode,
    other locales.

## Status
Theme-dependent baseline, not a standalone package.
Installation files and steps: see INSTALL.md (coming next).

## Limitations
- Setting labels are plain English, not translation keys yet.
- Touch only; mouse and pen drags are ignored on purpose.

## Backlog
- Reuse the swipe for other drawers, one at a time after testing each
  (the filters drawer has price sliders, the chat drawer has an iframe).
- Translation keys for the two settings.
