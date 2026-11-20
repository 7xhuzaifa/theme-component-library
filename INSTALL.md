# Install cart drawer swipe

## Compatibility
Built for Horizon 4.5.0 using its `theme-drawer` cart drawer. Other themes and versions have not been validated.

Install and test in an unpublished theme. Compare destination files first and preserve unrelated changes. Do not replace whole theme files with copies from another theme.

This installation adds one asset and edits two existing files.

## 1. Add the script
Copy this package's `files/assets/cart-drawer-swipe.js` into the theme as `assets/cart-drawer-swipe.js`.

## 2. Add the settings
Open `config/settings_schema.json`.

Inside the Cart group's settings array, find:

```json
      {
        "type": "header",
        "content": "t:content.cart_features"
      },
```

Immediately above it, add:

```json
      {
        "type": "checkbox",
        "id": "cart_drawer_swipe",
        "label": "Swipe to close",
        "info": "On touch screens, drag the cart drawer sideways to close it.",
        "default": false,
        "visible_if": "{{ settings.cart_type == 'drawer' }}"
      },
      {
        "type": "range",
        "id": "cart_drawer_speed",
        "label": "Drawer slide time",
        "info": "How long the cart drawer takes to open and close. Lower is faster. Horizon's default is 125 ms.",
        "min": 100,
        "max": 600,
        "step": 25,
        "unit": "ms",
        "default": 300,
        "visible_if": "{{ settings.cart_type == 'drawer' }}"
      },
```

Add each setting only once. Labels are currently plain English.

## 3. Connect the script
Open `snippets/cart-drawer.liquid`.

Find the existing script:

```liquid
  <script
    type="module"
    src="{{ 'cart-drawer.js' | asset_url }}"
    fetchpriority="low"
  ></script>
```

Keep it unchanged. Immediately below it, add:

```liquid
  {% if settings.cart_drawer_swipe %}
    <script
      type="module"
      src="{{ 'cart-drawer-swipe.js' | asset_url }}"
      fetchpriority="low"
    ></script>
  {% endif %}
```

## 4. Add the cart-only styles
In the same file, find:

```liquid
{% stylesheet %}
```

Immediately above it, add this separate block. Do not put it inside the existing stylesheet block.

```liquid
{%- comment -%}
  Cart drawer motion (component library: cart drawer swipe). Cart drawer only.
  Slide time setting: cart_drawer_speed. Swipe switch: cart_drawer_swipe.
{%- endcomment -%}
<style>
  #cart-drawer > dialog {
    --cart-drawer-speed: {{ settings.cart_drawer_speed | default: 300 }}ms;
  }

  #cart-drawer > dialog.theme-drawer__dialog--opening,
  #cart-drawer > dialog.theme-drawer__dialog--closing {
    animation-duration: var(--cart-drawer-speed);
  }
  {%- if settings.cart_drawer_swipe %}

    #cart-drawer > dialog,
    #cart-drawer > dialog * {
      touch-action: pan-y pinch-zoom;
    }

    #cart-drawer > dialog::backdrop {
      opacity: var(--cart-swipe-backdrop, 1);
    }

    #cart-drawer > dialog[data-swipe-closed].theme-drawer__dialog--closing {
      animation: none;
    }
  {%- endif %}
</style>
```

No changes to shared theme-drawer files are needed.

## 5. Configure
In Theme settings → Cart:
- Set Cart type to Drawer.
- Enable Swipe to close.
- Start with Drawer slide time at 300 ms.

Save and fully reload the storefront preview. Reload after changing the swipe switch: an already-loaded script remains active until the page reloads.

Drawer slide time remains available when swipe is off. Lower values are faster. During a drag, the panel follows the finger directly; the time setting controls automatic motion, not finger tracking. A swipe's remaining distance and release velocity can shorten its automatic slide time.

## 6. Test the installation
These are checks to perform, not a record of completed tests.

On a real touch-screen phone:
- Test both an empty cart and a cart containing products.
- Drag slowly toward the drawer's closing edge. The panel should follow the finger after a short direction lock.
- Release after a short drag. It should return open.
- Drag past about a third of its width and release. It should close.
- Try a quick flick toward the closing edge.
- Touch the panel while it slides after a swipe to catch it.
- Check vertical scrolling with enough distinct cart items to overflow. Increasing one item's quantity does not create more rows.
- Check product links, quantity controls and remove buttons.
- Check the close button and backdrop tap.
- Reopen the drawer and check the page's scroll position.

Also check:
- Escape closes and focus returns to the opening control.
- The speed setting changes opening and closing time.
- With swipe off and the page reloaded, normal drawer controls work.
- Cart page behavior is unchanged.
- Other drawers are unchanged.
- Run Theme Check and distinguish new issues from existing ones.

Mouse and pen dragging are not supported. A mobile-sized editor preview is not a real touch-device test.

Record the device, browser, theme version, date and specific checks performed. Do not mark the whole checklist passed from a general report that the feature works.

Wider touch screens (990px and up), right-to-left layouts and reduced-motion mode still need dedicated validation. Catching an ordinary opening or button-triggered closing animation is not established by the swipe implementation; check and record those behaviors separately if required.

## Removal
Remove only this component's additions:
1. Its conditional script tag from `snippets/cart-drawer.liquid`.
2. Its comment and standalone style block from that snippet.
3. The `cart_drawer_swipe` and `cart_drawer_speed` setting objects from `config/settings_schema.json`, keeping the JSON valid.
4. Any saved values for those two settings in `config/settings_data.json`, preserving unrelated values.
5. `assets/cart-drawer-swipe.js`.

Do not remove Horizon's original `cart-drawer.js` script, its existing stylesheet block or shared drawer files.

Save, reload and check normal cart drawer operation.
