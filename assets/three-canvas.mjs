/* Pass a pinned, single-version THREE namespace; no implicit CDN/dependency.
 * The host must be a dedicated, sized HTML widget. Native text/CTA stays outside.
 * Cube demo: it is not a production scene, loader, or guaranteed Tilda integration. */
const registry = new WeakMap();

export function mountThreeCanvas(host, THREE) {
  if (!(host instanceof HTMLElement)) throw new Error('A dedicated HTMLElement host is required');
  registry.get(host)?.();
  const fallback = document.createElement('span');
  fallback.textContent = '3D-сцена недоступна. Основное содержимое страницы доступно ниже.';
  fallback.hidden = true;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer, scene, camera, geometry, material, cube;
  let disposed = false;
  function disposeScene() {
    if (disposed) return;
    disposed = true;
    geometry?.dispose(); material?.dispose(); renderer?.dispose();
  }
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 4;
    geometry = new THREE.BoxGeometry(1.3, 1.3, 1.3);
    material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  }
  catch (error) {
    disposeScene();
    fallback.hidden = false; host.append(fallback); console.warn('WebGL unavailable', error);
    const stopFallback = () => { fallback.remove(); registry.delete(host); };
    stopFallback.refresh = () => {};
    registry.set(host, stopFallback);
    return stopFallback;
  }
  host.append(canvas, fallback);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let destroyed = false, inView = false, lost = false, raf = 0, last = 0;
  let width = 0, height = 0, dpr = 0;
  const pointer = { x: 0, y: 0 };

  function size() {
    const rect = host.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    const ratio = Math.min(devicePixelRatio || 1, 2);
    if (w !== width || h !== height || ratio !== dpr) {
      width = w; height = h; dpr = ratio;
      renderer.setPixelRatio(dpr);
      // CSS remains 100% of layout host. Only backing buffer follows visual size.
      renderer.setSize(width, height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }
    return true;
  }
  function stopFrame() { cancelAnimationFrame(raf); raf = 0; last = 0; }
  function frame(time) {
    raf = 0;
    if (destroyed || lost || !inView || document.hidden) { last = 0; return; }
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
    last = time;
    try {
      if (size()) {
        if (!reduced.matches) {
          cube.rotation.y += dt * 0.35;
          cube.rotation.x += (pointer.y * 0.2 - cube.rotation.x) * Math.min(1, dt * 6);
        }
        renderer.render(scene, camera);
      }
    } catch (error) {
      lost = true; canvas.style.visibility = 'hidden'; fallback.hidden = false;
      disposeScene(); console.warn('WebGL size/render failed', error); return;
    }
    if (!reduced.matches) raf = requestAnimationFrame(frame);
  }
  function wake() {
    if (destroyed || lost || !inView || document.hidden) { stopFrame(); return; }
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function onPointer(event) {
    if (reduced.matches) return;
    const r = host.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return;
    pointer.x = (event.clientX - r.left) / r.width * 2 - 1;
    pointer.y = 1 - (event.clientY - r.top) / r.height * 2;
    wake();
  }
  function onMotionChange() {
    stopFrame(); last = 0;
    if (reduced.matches) { cube.rotation.set(0, 0, 0); pointer.x = pointer.y = 0; }
    wake();
  }
  function onContextLost(event) {
    event.preventDefault(); lost = true; stopFrame();
    canvas.style.visibility = 'hidden'; fallback.hidden = false;
    // No automatic restore promise. Caller may destroy and remount a scene explicitly.
  }
  const resize = new ResizeObserver(wake);
  resize.observe(host);
  const intersection = new IntersectionObserver(entries => {
    inView = entries.some(e => e.isIntersecting); wake();
  });
  intersection.observe(host);
  host.addEventListener('pointermove', onPointer, { passive: true });
  canvas.addEventListener('webglcontextlost', onContextLost);
  reduced.addEventListener('change', onMotionChange);
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('resize', wake);
  window.addEventListener('pageshow', wake);

  function destroy() {
    if (destroyed) return;
    destroyed = true; stopFrame(); resize.disconnect(); intersection.disconnect();
    host.removeEventListener('pointermove', onPointer);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    reduced.removeEventListener('change', onMotionChange);
    document.removeEventListener('visibilitychange', wake);
    window.removeEventListener('resize', wake);
    window.removeEventListener('pageshow', wake);
    disposeScene();
    canvas.remove(); fallback.remove(); registry.delete(host);
  }
  // Explicit invalidation for transform-only host changes, including reduced motion.
  destroy.refresh = wake;
  registry.set(host, destroy);
  wake();
  return destroy;
}
