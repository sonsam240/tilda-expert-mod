/* Supply GSAP >=3.11 + matching ScrollTrigger once before loading this file.
 * The selected motion node MUST NOT own Tilda placement/scale/native motion.
 * This is a reusable integration example, not a Tilda runtime API. */
(function (global) {
  'use strict';
  if (global.TildaGsapReveal) return;
  const registry = new WeakMap();
  const pending = new Map();

  function waitFor(find, timeoutMs, signal) {
    return new Promise((resolve, reject) => {
      let observer, timer, frame = 0, settled = false;
      const finish = (error, value) => {
        if (settled) return;
        settled = true;
        observer?.disconnect(); clearTimeout(timer); cancelAnimationFrame(frame);
        signal?.removeEventListener('abort', abort);
        error ? reject(error) : resolve(value);
      };
      const abort = () => finish(new DOMException('Reveal mount aborted', 'AbortError'));
      const check = () => {
        if (settled) return;
        try { const value = find(); if (value) finish(null, value); }
        catch (error) { finish(error); }
      };
      const poll = () => { check(); if (!settled) frame = requestAnimationFrame(poll); };
      if (signal?.aborted) { abort(); return; }
      signal?.addEventListener('abort', abort, { once: true });
      observer = new MutationObserver(check);
      observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
      timer = setTimeout(() => finish(new Error('Reveal target missing or has zero size')), timeoutMs);
      poll();
    });
  }

  async function create({ recordId, motionSelector, triggerSelector, timeoutMs = 8000, signal }) {
    const gsap = global.gsap, ScrollTrigger = global.ScrollTrigger;
    if (!gsap?.matchMedia || !ScrollTrigger) throw new Error('Load GSAP >=3.11 and ScrollTrigger first');
    gsap.registerPlugin(ScrollTrigger);
    const { record, motion, trigger } = await waitFor(() => {
      const record = document.getElementById(recordId);
      const motion = record?.querySelector(motionSelector);
      const trigger = record?.querySelector(triggerSelector);
      if (!motion || !trigger || trigger.getBoundingClientRect().width <= 0 ||
          trigger.getBoundingClientRect().height <= 0) return null;
      return { record, motion, trigger };
    }, timeoutMs, signal);
    if (signal?.aborted) throw new DOMException('Reveal mount aborted', 'AbortError');
    registry.get(motion)?.();
    let destroyed = false, refreshTimer = 0;
    const scheduleRefresh = () => {
      if (destroyed) return;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => { if (!destroyed) ScrollTrigger.refresh(); }, 120);
    };
    const mm = gsap.matchMedia();
    const resize = new ResizeObserver(scheduleRefresh);
    resize.observe(record);
    // Capture media events without reading form values or attaching one listener per image.
    record.addEventListener('load', scheduleRefresh, true);
    global.addEventListener('resize', scheduleRefresh);
    global.addEventListener('pageshow', scheduleRefresh);
    const destroy = () => {
      if (destroyed) return;
      destroyed = true; clearTimeout(refreshTimer);
      resize.disconnect();
      record.removeEventListener('load', scheduleRefresh, true);
      global.removeEventListener('resize', scheduleRefresh);
      global.removeEventListener('pageshow', scheduleRefresh);
      signal?.removeEventListener('abort', destroy);
      mm.revert();
      registry.delete(motion);
    };
    registry.set(motion, destroy);
    signal?.addEventListener('abort', destroy, { once: true });
    try {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(motion, {
          y: 24, opacity: 0, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger, start: 'top 85%', once: true, invalidateOnRefresh: true }
        });
      }, record);
      document.fonts?.ready.then(scheduleRefresh).catch(() => {});
      scheduleRefresh();
      return destroy;
    } catch (error) { destroy(); throw error; }
  }

  function mount(options) {
    if (!options?.recordId || !options.motionSelector || !options.triggerSelector) {
      return Promise.reject(new Error('recordId, motionSelector and triggerSelector required'));
    }
    // A caller-owned signal must keep its independent cancellation lifecycle.
    if (options.signal) return create(options);
    const key = JSON.stringify([options.recordId, options.motionSelector, options.triggerSelector]);
    if (pending.has(key)) return pending.get(key);
    const promise = create(options).finally(() => pending.delete(key));
    pending.set(key, promise);
    return promise;
  }
  global.TildaGsapReveal = Object.freeze({ mount });
})(globalThis);
