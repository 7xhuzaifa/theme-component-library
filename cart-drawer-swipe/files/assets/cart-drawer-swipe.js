/**
 * Cart drawer: swipe to close (touch screens only).
 * - Drag the open cart drawer toward its edge and it follows your finger.
 * - Let go after a long drag or a quick flick and it finishes closing; otherwise it springs back.
 * - While it slides by itself, a new touch catches it.
 * - Vertical scrolling of the cart keeps working: a mostly-vertical move is left to the browser.
 * Horizon's own close() runs once the panel is off screen, so focus return, scroll
 * position and the "theme-drawer:close" event stay Horizon's.
 * Cart only: the shared theme-drawer files are not changed.
 * Slide time comes from the "Drawer slide time" theme setting (--cart-drawer-speed).
 */

const DRAWER_ID = 'cart-drawer';
const LOCK_DISTANCE = 10; // px the finger moves before deciding: sideways drag or scroll
const CLOSE_SHARE = 0.3; // let go past this share of the panel width and it closes
const FLICK_SPEED = 0.35; // px per ms toward the edge that counts as a flick
const MIN_SLIDE = 80; // ms, shortest automatic slide
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let drawer = null;
let panel = null;
let offset = 0; // px the panel is pushed toward its edge (0 = fully open)
let width = 0;
let direction = 1; // 1 = closes to the right, -1 = closes to the left (right-to-left languages)
let touch = null;
let frame = 0; // set while the panel slides by itself
let finishing = false; // Horizon's close is running

/** Finds the cart drawer and keeps a blocking touchmove listener on its panel. */
function bind() {
  const nextDrawer = document.getElementById(DRAWER_ID);
  const nextPanel = nextDrawer ? nextDrawer.querySelector(':scope > dialog') : null;

  if (nextPanel !== panel) {
    if (panel) panel.removeEventListener('touchmove', onTouchMove);
    if (nextPanel) nextPanel.addEventListener('touchmove', onTouchMove, { passive: false });
  }

  drawer = nextDrawer;
  panel = nextPanel;
  return Boolean(drawer && panel);
}

function slideTime() {
  const value = parseFloat(getComputedStyle(panel).getPropertyValue('--cart-drawer-speed'));
  return Number.isFinite(value) && value > 0 ? value : 300;
}

function apply(value) {
  offset = Math.min(Math.max(value, 0), width);
  panel.style.transform = offset ? `translate3d(${offset * direction}px, 0, 0)` : '';
  panel.style.setProperty('--cart-swipe-backdrop', String(1 - offset / width));
}

function reset() {
  cancelAnimationFrame(frame);
  frame = 0;
  offset = 0;
  if (panel) {
    panel.style.removeProperty('transform');
    panel.style.removeProperty('--cart-swipe-backdrop');
  }
}

async function settle() {
  if (offset === 0) {
    reset();
    return;
  }
  if (offset < width) return;

  finishing = true;
  panel.dataset.swipeClosed = '';
  try {
    await drawer.close();
  } finally {
    delete panel.dataset.swipeClosed;
    reset();
    finishing = false;
  }
}

function slideTo(target, velocity) {
  cancelAnimationFrame(frame);
  frame = 0;
  const from = offset;
  const distance = Math.abs(target - from);

  if (!distance || reducedMotion.matches) {
    apply(target);
    settle();
    return;
  }

  let duration = Math.max(MIN_SLIDE, slideTime() * (distance / width));
  const towardTarget = (target > from && velocity > 0) || (target < from && velocity < 0);
  if (towardTarget) duration = Math.max(MIN_SLIDE, Math.min(duration, distance / Math.abs(velocity)));

  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    apply(from + (target - from) * eased);

    if (progress < 1) {
      frame = requestAnimationFrame(step);
    } else {
      frame = 0;
      settle();
    }
  };
  frame = requestAnimationFrame(step);
}

/** Stops the tap that ends a drag from reaching Horizon's backdrop click. */
function swallowNextClick() {
  const swallow = (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
  };
  window.addEventListener('click', swallow, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 400);
}

function findTouch(list) {
  if (!touch) return null;
  for (const item of list) {
    if (item.identifier === touch.id) return item;
  }
  return null;
}

function onTouchStart(event) {
  if (finishing) return;
  if (event.touches.length !== 1) {
    if (touch && touch.locked) release(true);
    touch = null;
    return;
  }
  if (!bind() || !drawer.hasAttribute('open')) return;

  const sliding = frame !== 0;
  if (!sliding && !panel.contains(event.target)) return;

  width = panel.getBoundingClientRect().width;
  if (!width) return;
  direction = getComputedStyle(panel).direction === 'rtl' ? -1 : 1;

  if (sliding) {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  const point = event.touches[0];
  touch = {
    id: point.identifier,
    startX: point.clientX,
    startY: point.clientY,
    base: offset,
    locked: sliding, // catching a sliding panel takes control straight away
    lastX: point.clientX,
    lastT: event.timeStamp,
    velocity: 0,
  };
}

function onTouchMove(event) {
  if (!touch) return;
  // Touches on the panel are handled by its own (blocking) listener.
  if (event.currentTarget === document && panel && panel.contains(event.target)) return;

  const point = findTouch(event.changedTouches);
  if (!point) return;

  if (!touch.locked) {
    const dx = point.clientX - touch.startX;
    const dy = point.clientY - touch.startY;
    if (Math.abs(dx) < LOCK_DISTANCE && Math.abs(dy) < LOCK_DISTANCE) return;
    if (Math.abs(dy) >= Math.abs(dx) || (dx * direction < 0 && touch.base === 0)) {
      touch = null; // a scroll, or a push toward the open side: leave it to the browser
      return;
    }
    touch.locked = true;
    touch.startX = point.clientX; // follow from here so the panel doesn't jump
  }

  if (event.cancelable) event.preventDefault();

  const elapsed = event.timeStamp - touch.lastT;
  if (elapsed > 0) {
    const speed = ((point.clientX - touch.lastX) * direction) / elapsed;
    touch.velocity = touch.velocity * 0.2 + speed * 0.8;
  }
  touch.lastX = point.clientX;
  touch.lastT = event.timeStamp;

  apply(touch.base + (point.clientX - touch.startX) * direction);
}

function release(springBack, velocity = 0) {
  swallowNextClick();
  if (springBack) {
    slideTo(0, 0);
    return;
  }
  const shouldClose = velocity > FLICK_SPEED || (velocity > -FLICK_SPEED && offset > width * CLOSE_SHARE);
  slideTo(shouldClose ? width : 0, velocity);
}

function onTouchEnd(event) {
  const point = findTouch(event.changedTouches);
  if (!point) return;

  const { locked, lastT } = touch;
  const velocity = event.timeStamp - lastT > 80 ? 0 : touch.velocity; // finger paused: no flick
  touch = null;
  if (!locked) return;

  release(event.type === 'touchcancel', velocity);
}

document.addEventListener('touchstart', onTouchStart, { passive: true });
document.addEventListener('touchmove', onTouchMove, { passive: true });
document.addEventListener('touchend', onTouchEnd, { passive: true });
document.addEventListener('touchcancel', onTouchEnd, { passive: true });

document.addEventListener('theme-drawer:open', (event) => {
  if (event.target.id !== DRAWER_ID) return;
  bind();
  touch = null;
  reset();
});

document.addEventListener('theme-drawer:close', (event) => {
  if (finishing || event.target.id !== DRAWER_ID) return;
  touch = null;
  reset();
});

bind();
