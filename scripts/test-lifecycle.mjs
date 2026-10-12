// Synthetic DOM + library boundary fixtures: validates our lifecycle, NOT Tilda/GSAP rendering.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const code = fs.readFileSync(path.join(root, 'assets/gsap-reveal.js'), 'utf8');
let passed = 0;
const pause = ms => new Promise(r => setTimeout(r, ms));
function fixture({ ready = true, libraries = true } = {}) {
  let width = ready ? 120 : 0, activeObservers = 0, reverted = 0, effects = 0;
  const listeners = new Map();
  const events = {
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); }
  };
  const motion = {};
  const trigger = { getBoundingClientRect: () => ({ width, height: width ? 80 : 0 }) };
  const record = { ...events, querySelector: s => s === '.motion' ? motion : trigger };
  class Observer {
    observe() { if (!this.active) { this.active = true; activeObservers++; } }
    disconnect() { if (this.active) { this.active = false; activeObservers--; } }
  }
  const context = {
    ...events, console, setTimeout, clearTimeout, DOMException, AbortController,
    requestAnimationFrame: fn => setTimeout(() => fn(performance.now()), 2),
    cancelAnimationFrame: clearTimeout,
    MutationObserver: Observer, ResizeObserver: Observer,
    document: { documentElement: {}, getElementById: () => record, fonts: { ready: Promise.resolve() } },
    gsap: libraries ? {
      registerPlugin() {}, from() { effects++; },
      matchMedia() { return { add(query, fn) { fn(); }, revert() { reverted++; } }; }
    } : null,
    ScrollTrigger: libraries ? { refresh() {} } : null
  };
  vm.createContext(context); vm.runInContext(code, context);
  const options = { recordId: 'rec1', motionSelector: '.motion', triggerSelector: '.trigger', timeoutMs: 100 };
  return {
    api: context.TildaGsapReveal, options,
    setWidth: w => { width = w; },
    state: () => ({ activeObservers, reverted, effects, listeners: [...listeners.values()].reduce((n, s) => n + s.size, 0) })
  };
}
async function test(name, fn) { await fn(); passed++; console.log('PASS:', name); }

await test('late geometry becomes ready without DOM mutation', async () => {
  const f = fixture({ ready: false });
  const pending = f.api.mount(f.options);
  setTimeout(() => f.setWidth(120), 12);
  const stop = await pending;
  assert.equal(f.state().effects, 1); stop();
  assert.equal(f.state().activeObservers, 0); assert.equal(f.state().listeners, 0);
});
await test('abort before readiness cleans bounded wait and creates no effect', async () => {
  const f = fixture({ ready: false }), controller = new AbortController();
  const pending = f.api.mount({ ...f.options, signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, e => e.name === 'AbortError');
  f.setWidth(120); await pause(8);
  assert.equal(f.state().effects, 0); assert.equal(f.state().activeObservers, 0);
});
await test('repeated mount replaces only its effect and teardown is idempotent', async () => {
  const f = fixture();
  const first = await f.api.mount(f.options);
  const second = await f.api.mount(f.options);
  assert.equal(f.state().reverted, 1);
  first(); second(); second();
  assert.equal(f.state().reverted, 2);
  assert.equal(f.state().activeObservers, 0); assert.equal(f.state().listeners, 0);
});
await test('caller signal also destroys an already mounted effect', async () => {
  const f = fixture(), controller = new AbortController();
  const stop = await f.api.mount({ ...f.options, signal: controller.signal });
  controller.abort(); stop();
  assert.equal(f.state().reverted, 1); assert.equal(f.state().activeObservers, 0);
});
await test('missing dependencies leaves DOM effects untouched and rejects', async () => {
  const f = fixture({ libraries: false });
  await assert.rejects(f.api.mount(f.options), /Load GSAP/);
  assert.equal(f.state().effects, 0); assert.equal(f.state().activeObservers, 0);
});
await test('zero-sized target times out and clears observation', async () => {
  const f = fixture({ ready: false });
  await assert.rejects(f.api.mount({ ...f.options, timeoutMs: 15 }), /zero size/);
  assert.equal(f.state().activeObservers, 0);
});
console.log(JSON.stringify({ passed, scope: 'Synthetic lifecycle only; no real browser, GSAP or Tilda rendering' }));
