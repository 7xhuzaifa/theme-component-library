# Home button installation notes

## Status
Extracted from a working Horizon-based blog theme.
The separate snippet-and-CSS package has not yet been installation-tested.
Compatibility with other themes is not verified.

## Files
Copy these library files into the corresponding theme folders:

- files/snippets/home-button.liquid → snippets/home-button.liquid
- files/assets/icon-home.svg → assets/icon-home.svg
- files/assets/home-button.css → assets/home-button.css

Do not copy the library's home-button/files folders into the theme.

## Dependencies
This version borrows Horizon styling:

- header-actions__action
- header-actions__text-style
- svg-wrapper
- hidden, mobile:hidden and desktop:hidden
- --icon-stroke-width
- --gap-xs

The destination theme must provide these or equivalent styles.

It also needs these translation entries:
- accessibility.home
- content.home_title

Check for existing entries before adding any.
Do not replace an entire locale file.

## Installation policy
- Work on an unpublished theme.
- Preserve the existing cart, account and search controls.
- Do not paste in a second Home button where one already exists.
- Choose the insertion point after inspecting the target header.
- Load home-button.css once.
- Pass display_style explicitly as 'icon' or 'text'.

## Required testing
- Icon and text modes
- Desktop and mobile
- Keyboard focus and activation
- Homepage link
- Current-page indication on the homepage
- Existing header controls
- Theme error check

## Other themes
Adapt to the destination theme's own header styles.
Do not copy Horizon's whole header stylesheet.
