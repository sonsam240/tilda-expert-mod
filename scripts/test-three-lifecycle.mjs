// Resource/control-flow tests with synthetic DOM and WebGL boundary.
// These do NOT render graphics or prove compatibility with Tilda/Three.js releases.
import assert from 'node:assert/strict';
import { mountThreeCanvas } from '../assets/three-canvas.mjs';

function fixture(failure = '', reducedMotion = false) {
  const frames = new Map(); let nextFrame = 1, time = 0, rectWidth = 144;
  const stats = { rendererDisposed: 0, geometryDisposed: 0, materialDisposed: 0, renders: 0, sizes: [], dpr: 0 };
  class Element extends EventTarget {
    constructor() { super(); this.style = {}; this.children = []; this.hidden = false; }
    append(...nodes) { for (const n of nodes) { this.children.push(n); n.parent = this; } }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(n => n !== this); }
    setAttribute() {}
    getBoundingClientRect() { return { width: rectWidth, height: 72, left: 0, top: 0 }; }
  }
  const document = new EventTarget();
  document.hidden = false; document.createElement = () => new Element();
  const media = new EventTarget(); media.matches = reducedMotion;
  let intersection;
  class Resize { observe() {} disconnect() {} }
  class Intersection { constructor(fn) { intersection = fn; } observe() {} disconnect() {} }
  const window = new EventTarget();
  Object.assign(globalThis, {
    HTMLElement: Element, document, window, devicePixelRatio: 3,
    matchMedia: () => media, ResizeObserver: Resize, IntersectionObserver: Intersection,
    requestAnimationFrame: fn => { const id = nextFrame++; frames.set(id, fn); return id; },
    cancelAnimationFrame: id => frames.delete(id)
  });
  const THREE = {
    WebGLRenderer: class {
      constructor() { if (failure === 'renderer') throw new Error('fixture renderer error'); }
      setPixelRatio(n) { stats.dpr = n; }
      setSize(w, h, updateStyle) {
        if (failure === 'resize') throw new Error('fixture resize error');
        stats.sizes.push([w, h, updateStyle]);
      }
      render() { if (failure === 'render') throw new Error('fixture render error'); stats.renders++; }
      dispose() { stats.rendererDisposed++; }
    },
    Scene: class { constructor() { if (failure === 'scene') throw new Error('fixture scene error'); } add() {} },
    PerspectiveCamera: class { constructor() { this.position = {}; } updateProjectionMatrix() {} },
    BoxGeometry: class { dispose() { stats.geometryDisposed++; } },
    MeshNormalMaterial: class { dispose() { stats.materialDisposed++; } },
    Mesh: class { constructor() { this.rotation = { x: 0, y: 0, set() {} }; } }
  };
  const host = new Element();
  const step = () => {
    const callbacks = [...frames.values()]; frames.clear(); time += 16;
    for (const fn of callbacks) fn(time);
  };
  return {
    host, THREE, stats, frames, step, document,
    enter: () => intersection([{ isIntersecting: true }]),
    width: n => { rectWidth = n; }
  };
}
let passed = 0;
function test(name, fn) {
  const warn = console.warn; console.warn = () => {};
  try { fn(); passed++; console.log('PASS:', name); }
  finally { console.warn = warn; }
}
test('buffer uses visual geometry once and capped DPR, preserves CSS size', () => {
  const f = fixture(); const stop = mountThreeCanvas(f.host, f.THREE);
  f.enter(); f.step();
  assert.deepEqual(f.stats.sizes, [[144, 72, false]]); assert.equal(f.stats.dpr, 2);
  stop(); stop();
  assert.equal(f.stats.rendererDisposed, 1); assert.equal(f.stats.geometryDisposed, 1);
  assert.equal(f.stats.materialDisposed, 1); assert.equal(f.frames.size, 0); assert.equal(f.host.children.length, 0);
});
test('reduced motion draws one frame and explicit refresh updates transform-only size', () => {
  const f = fixture('', true), stop = mountThreeCanvas(f.host, f.THREE);
  f.enter(); f.step(); assert.equal(f.frames.size, 0);
  f.width(288); stop.refresh(); f.step();
  assert.deepEqual(f.stats.sizes.at(-1), [288, 72, false]); assert.equal(f.frames.size, 0); stop();
});
test('failed renderer returns consistent no-op refresh and removable fallback', () => {
  const f = fixture('renderer'), stop = mountThreeCanvas(f.host, f.THREE);
  assert.doesNotThrow(() => stop.refresh()); stop(); assert.equal(f.host.children.length, 0);
});
test('failed scene initialization disposes renderer already allocated', () => {
  const f = fixture('scene'), stop = mountThreeCanvas(f.host, f.THREE);
  assert.equal(f.stats.rendererDisposed, 1); stop.refresh(); stop();
  assert.equal(f.stats.rendererDisposed, 1);
});
for (const failure of ['resize', 'render']) {
  test(failure + ' error shows fallback, stops RAF and disposes scene exactly once', () => {
    const f = fixture(failure), stop = mountThreeCanvas(f.host, f.THREE);
    f.enter(); f.step();
    assert.equal(f.frames.size, 0); assert.equal(f.stats.rendererDisposed, 1);
    assert.equal(f.host.children[0].style.visibility, 'hidden'); assert.equal(f.host.children[1].hidden, false);
    stop(); assert.equal(f.stats.rendererDisposed, 1);
  });
}
test('hidden document pauses queued rendering and resumes on visibility change', () => {
  const f = fixture(), stop = mountThreeCanvas(f.host, f.THREE);
  f.enter(); f.step(); const before = f.stats.renders;
  f.document.hidden = true; f.document.dispatchEvent(new Event('visibilitychange')); f.step();
  assert.equal(f.stats.renders, before); assert.equal(f.frames.size, 0);
  f.document.hidden = false; f.document.dispatchEvent(new Event('visibilitychange')); f.step();
  assert.equal(f.stats.renders, before + 1); stop();
});
test('remount of the same dedicated host releases the previous renderer', () => {
  const f = fixture(), first = mountThreeCanvas(f.host, f.THREE);
  const second = mountThreeCanvas(f.host, f.THREE);
  assert.equal(f.stats.rendererDisposed, 1); first(); second();
  assert.equal(f.stats.rendererDisposed, 2); assert.equal(f.host.children.length, 0);
});
console.log(JSON.stringify({ passed, scope: 'Synthetic lifecycle only; no browser or real WebGL rendering' }));
