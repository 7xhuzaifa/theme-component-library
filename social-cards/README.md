# Social cards

## Purpose
Display social-account links with selectable profile cards.

## Status
Working in our Horizon-based blog theme.
Extraction into this library is in progress.
Not yet installation-tested as a separate package.

## Approach
Preserve the working version first.
Document dependencies before testing reuse.
Improve it incrementally, without redesigning during extraction.

## Behavior
Card selection works with radio inputs and CSS.
A small script adds mobile closing and scrolling behavior.

## Future design direction
Planned, not implemented in the preserved version.

The component should own its customization settings while
offering optional inheritance from the running theme.

### Defaults
- Inherit theme styling where practical.
- Provide sensible standalone fallbacks.
- Require minimal setup for a useful result.

### Customization
- Offer “Use theme” and “Custom” choices where appropriate.
- Allow independent control of typography, colours,
  spacing, buttons and card appearance.
- Keep content settings easy to find.
- Group advanced controls separately.

### Maintainability
- Keep theme-specific mappings in a small integration layer.
- Avoid copying an entire theme's styling system.
- Add controls when they solve a real need, not merely
  because they are possible.

Goal: more control without more routine setup work.

## Manual installation test — 17 November 2026

Tested in the unpublished Horizon-based “Home button test” theme.

Merchant-confirmed:
- Desktop and mobile card switching works.
- Tapping an open card again on mobile closes it.
- Tab reaches account controls and Follow links.
- Arrow keys switch accounts and reveal cards on mobile.
- Space opens and closes cards.
- Enter activates the Follow link.
- Keyboard focus outlines are clearly visible.

Unresolved:
- Escape did not close the card in the tested editor preview.

Scope:
This confirms the interactions above in one compatible theme.
It is not full accessibility or cross-theme validation.
The library-only Button label guidance has not been
visually tested in this installation.
