/* Read-only DevTools utility. No network, DOM writes, or private field values. */
(function (global) {
  'use strict';
  function metrics(node) {
    const r = node.getBoundingClientRect();
    const c = getComputedStyle(node);
    return {
      tag: node.tagName, id: node.id || '', className: node.getAttribute('class') || '',
      elemId: node.getAttribute('data-elem-id'),
      rect: { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom },
      layout: { width: node.offsetWidth ?? null, height: node.offsetHeight ?? null },
      // Ratios are diagnostics only: rotation/skew/zoom can invalidate scale inference.
      visualToLayoutX: node.offsetWidth > 0 ? r.width / node.offsetWidth : null,
      visualToLayoutY: node.offsetHeight > 0 ? r.height / node.offsetHeight : null,
      style: {
        display: c.display, position: c.position, transform: c.transform,
        transformOrigin: c.transformOrigin, zoom: c.zoom, opacity: c.opacity,
        overflowX: c.overflowX, overflowY: c.overflowY, zIndex: c.zIndex,
        width: c.width, height: c.height, isolation: c.isolation
      }
    };
  }
  function inspect(recordId) {
    const id = String(recordId).replace(/^#/, '');
    const record = document.getElementById(id.startsWith('rec') ? id : 'rec' + id);
    if (!record) throw new Error('Record not found: ' + id);
    const artboards = Array.from(record.querySelectorAll('.t396__artboard'));
    if (!artboards.length) throw new Error('No .t396__artboard in ' + record.id);
    const result = {
      recordId: record.id,
      viewport: {
        innerWidth: global.innerWidth, clientWidth: document.documentElement.clientWidth,
        innerHeight: global.innerHeight, dpr: global.devicePixelRatio || 1
      },
      record: metrics(record),
      artboards: artboards.map(a => ({
        ...metrics(a),
        data: Object.fromEntries(Array.from(a.attributes)
          .filter(x => /^data-artboard-/.test(x.name)).map(x => [x.name, x.value]))
      })),
      elements: Array.from(record.querySelectorAll('.tn-elem')).map(e => {
        const atom = e.querySelector('.tn-atom');
        const ancestors = [];
        for (let p = e.parentElement; p && p !== record; p = p.parentElement) {
          const c = getComputedStyle(p);
          if (c.transform !== 'none' || (c.zoom && c.zoom !== '1' && c.zoom !== 'normal') ||
              c.overflowX !== 'visible' || c.overflowY !== 'visible') ancestors.push(metrics(p));
        }
        return { element: metrics(e), atom: atom ? metrics(atom) : null, ancestors };
      }),
      limitations: 'No guaranteed Autoscale inference. Group DOM and runtime vary; inspect actual nodes.'
    };
    console.table(result.elements.map(x => ({
      elemId: x.element.elemId, visualW: x.element.rect.width,
      layoutW: x.element.layout.width, ratioX: x.element.visualToLayoutX,
      x: x.element.rect.x, y: x.element.rect.y, position: x.element.style.position
    })));
    console.log(result);
    return result;
  }
  global.TildaZeroInspect = Object.freeze({ inspect });
})(globalThis);
