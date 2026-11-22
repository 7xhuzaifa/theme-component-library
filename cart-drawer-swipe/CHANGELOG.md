# Changelog: Cart drawer swipe

## v2.0 (22 November 2026)
Major: upgrading from v1.0 needs new edits (see INSTALL.md).
- Swipe rebuilt on the browser's own sideways scrolling with snap points.
  Works on touch screens and trackpads; holding, glide and flicks feel native.
  The v1.0 touch-gesture code is removed; the script is about 100 lines.
- Desktop (990px and wider): the cart drawer opens over the page instead of
  squeezing it (opt-in `overlay-desktop` marker in Horizon's drawer files).
- Dimmed background now visible (soft grey at 40%) and fades with the drawer.
  Horizon's dim color was undefined, so it painted nothing.
- Closing starts moving immediately.
- The page no longer shifts by a scrollbar's width when a drawer opens on desktop.
- Cart scroll areas scroll vertically only, so swipes move the whole drawer.
- "Swipe to close" help text mentions trackpads.

## v1.0 (20 November 2026)
- Swipe to close on touch screens: follows the finger, flick or drag past a
  third closes, springs back otherwise, catch while sliding.
- "Swipe to close" and "Drawer slide time" settings.
