import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeHorizontalRailDelta,
  computeStickyBarTop,
  computeStickyScrollClearance,
} from './stickyOffset';

test('computeStickyBarTop aligns flush beneath a pinned sticky or fixed header', () => {
  assert.equal(
    computeStickyBarTop({ position: 'sticky', top: 0, bottom: 69, height: 69 }),
    69
  );
  assert.equal(
    computeStickyBarTop({ position: 'fixed', top: 0, bottom: 75, height: 75 }),
    75
  );
  assert.equal(
    computeStickyBarTop({ position: 'sticky', top: 0, bottom: 68.54, height: 68.54 }),
    68.5
  );
});

test('computeStickyBarTop returns 0 when header is relative/static or missing', () => {
  assert.equal(computeStickyBarTop(null), 0);
  assert.equal(
    computeStickyBarTop({ position: 'relative', top: -1200, bottom: -1135, height: 65 }),
    0
  );
  assert.equal(
    computeStickyBarTop({ position: 'static', top: 0, bottom: 65, height: 65 }),
    0
  );
});

test('computeStickyScrollClearance combines header offset, sticky bar height, and breathing room', () => {
  assert.equal(computeStickyScrollClearance(69, 107), 188);
  assert.equal(computeStickyScrollClearance(0, 107), 119);
  assert.equal(computeStickyScrollClearance(75, 131, 16), 222);
});

test('computeHorizontalRailDelta centers active category button cleanly in LTR and RTL', () => {
  // Nav width 360 at left=15 -> center 195; button at left=300 width=90 -> center 345 => +150px
  assert.equal(computeHorizontalRailDelta(15, 360, 300, 90), 150);
  // Button already centered -> 0px
  assert.equal(computeHorizontalRailDelta(0, 400, 150, 100), 0);
  // Button off to left (RTL/scrolling left) -> negative delta
  assert.equal(computeHorizontalRailDelta(0, 400, -80, 100), -230);
  // Zero-width guard
  assert.equal(computeHorizontalRailDelta(0, 0, 50, 80), 0);
});
