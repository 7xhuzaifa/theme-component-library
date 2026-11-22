# Cart drawer swipe

## Brief
**In one sentence:** Lets shoppers close Horizon's cart drawer by swiping
it sideways on touch screens and trackpads, makes the drawer open over the
page on desktop with a dimmed background, and adds a setting for how fast
it opens and closes.

- **What it does:**
  - Swipe the drawer toward its edge and it follows the finger. Holding
    keeps it in place; letting go settles it open or closed. A quick
    flick closes it, a slow drag closes it past about halfway, and a
    moving drawer can be caught. Scrolling the cart up and down still works.
  - Built on the browser's own sideways scrolling with snap points, so
    the gesture, glide and timing are the device's native ones.
  - Desktop (990px and wider): the cart drawer opens over the page like
    on mobile, instead of Horizon's side-by-side page squeeze.
  - The dimmed background is visible (soft grey at 40%) and fades in and
    out with the drawer. Closing starts moving immediately.
  - The page no longer shifts sideways by a scrollbar's width when any
    drawer opens on desktop.
- **Settings:** Theme settings → Cart, shown only when Cart type is Drawer.
  - Swipe to close (on/off). When off, the swipe script isn't loaded and
    the drawer keeps its normal layout.
  - Drawer slide time (100–600 ms, default 300 ms; Horizon's own is 125 ms).
    Controls opening and button/backdrop closing. Swipe timing comes from
    the device.
- **Scope:** Cart drawer only, except two small shared fixes: Horizon's
  shared drawer files learn an opt-in `overlay-desktop` marker (only the
  cart drawer uses it; filters, pickup and chat drawers still squeeze the
  page), and the desktop scroll lock keeps the scrollbar's space for every
  drawer. Horizon's own close runs, so focus return and scroll position
  are kept. No swipe-to-open.
- **Files:** Replaced `assets/cart-drawer-swipe.js`. Edited
  `snippets/cart-drawer.liquid`, `config/settings_schema.json`,
  `assets/theme-drawer.js`, `snippets/theme-drawer.liquid`,
  `assets/base.css`. Reference diffs against Horizon 4.5.0 in `patches/`.
- **Built for:** Horizon 4.5.0.
- **Evidence:**
  - Owner-confirmed, 22 November 2026, build theme "Build - Cart Drawer
    Swipe v1.0" (Horizon 4.5.0):
    - Desktop: drawer opens over the page; X and dimmed-area click close
      it; no page shift; dim visible and fading.
    - Desktop trackpad swipe compared side by side with AG1 on the same
      laptop: "can't point a difference".
    - Phone swipe (new technique): owner-confirmed working.
    - Desktop Escape, focus return and scroll position after closing.
  - Theme Check: no new issues (2 existing, unrelated warnings).
  - Untested: fresh installation of v2.0 into another theme, Safari and
    Firefox on desktop, mouse-only desktops, tablets, right-to-left
    languages, reduced-motion mode.
  - v1.0 (touch-only, custom gesture code) was owner-confirmed on a phone
    and in a fresh install on 20 November 2026; v2.0 replaces that code.

## Status
Theme-dependent baseline, not a standalone package. Version 2.0.
Installation, upgrade from v1.0 and removal: see [INSTALL.md](INSTALL.md).

## How it works
While open, the cart `<dialog>` becomes a full-screen, invisible,
sideways scroller with two snap points: the cart panel (open) and an
empty space beside it (closed). `flex-direction: row-reverse` makes the
panel the scroll start, so the drawer opens resting on the panel without
script positioning. When the shopper lets go, the browser projects where
the swipe's momentum would land and settles on the nearest snap point.
The browser knows when fingers touch and lift; a website doesn't, which
is why native scrolling holds and glides better than gesture code.

The script (about 100 lines) only fades the dim with the scroll position,
runs Horizon's `close()` once the drawer rests on the empty space, and
closes the drawer when the dimmed area is clicked.

## Limitations
- Setting labels are plain English, not translation keys yet.
- Mouse-only desktops can't drag the drawer (mouse wheels scroll
  vertically); they close it with the X, the dimmed area or Escape.
- Swipe snap speed and tipping point come from the browser and device.
- Dim color and strength are fixed values in the style block (owner's
  choice, matching AG1), not settings.
- Other Horizon drawers and dialogs still have Horizon's invisible dim
  (its `--color-shadow-rgb` is undefined); only the cart is fixed.

## Backlog
- Reuse the technique for other drawers, one at a time after testing
  each (filters has price sliders, chat has an iframe).
- Optional "all drawers open over the page" component (would let the
  squeeze code and the overlay marker go).
- Fix the invisible dim theme-wide.
- Translation keys for the two settings.
