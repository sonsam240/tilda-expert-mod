# GSAP / ScrollTrigger / Three.js

Все Tilda-specific связки здесь — **инженерные рекомендации**, не нативные функции платформы. Уровень проверки конкретных assets указан в [отчёте](validation-report.md).

## GSAP

[ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) подтверждает start/end, scrub, pin, invalidateOnRefresh, refresh, kill; refresh пересчитывает позиции, update обновляет progress. Resize страницы, загрузка шрифта/изображения, раскрытие секции или pop-up могут требовать нового расчёта.

1. Загрузить одну закреплённую версию GSAP3 и совместимый ScrollTrigger; registerPlugin после загрузки. Не смешивать с bundled чужой версией.
2. Выбрать scoped record и проверенный motion target, не placement/Autoscale node.
3. Отказаться от custom GSAP, если native Basic/SBS полностью решает задачу.
4. Создать собственный gsap.context/matchMedia; при смене reduced motion вернуть статическое содержимое; cleanup только свои triggers/tweens.
5. Для вычисляемой дистанции function-based value и invalidateOnRefresh; refresh после стабилизации геометрии, объединённо, не на каждом scroll/RAF.
6. Pin — меняет flow и spacer. Не пинить абсолютный child с ожиданием автоматического роста record; проверить fixed ancestors/Autoscale. Не создавать custom scroller или smooth scroll без необходимости.

Не переводить весь сайт на normalizeScroll/scrollerProxy ради единичного reveal. Не считать timeout500ms доказательством готового layout.

### Полный reusable asset

[gsap-reveal.js](../assets/gsap-reveal.js) устанавливает `TildaGsapReveal.mount({recordId,motionSelector,triggerSelector})`. Он не загружает библиотеки. В motionSelector передавать узел, на котором **нет** native transform/animation, например специально заданный класс. Reveal не должен прятать fallback при отсутствии JS.

Пример после загрузки GSAP и ScrollTrigger:

```html
<script>
document.addEventListener('DOMContentLoaded', () => {
  TildaGsapReveal.mount({
    recordId: 'rec123456',
    motionSelector: '.project-reveal-motion',
    triggerSelector: '.project-reveal-trigger'
  }).catch(console.error);
});
</script>
```

Если код вставлен после DOMContentLoaded — вызвать mount непосредственно; mount ждёт record/target ограниченное время через DOM observation и RAF-проверку ненулевой геометрии. Для отмены pending mount/teardown передать `signal` от AbortController и вызвать controller.abort(). Selector/record в примере заменить реальными, этот вызов не является production config без них.

## Three.js

[WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) документирует setPixelRatio/setSize(width,height,false), render/dispose. Передавать явный namespace одной версии Three.js; addons брать того же release.

**Инженерная интеграция:** выделить HTML-элемент достаточного W/H, внутри отдельный host; его высоту явно настроить для каждого экрана. Нативный текст/CTA оставить снаружи. [three-canvas.mjs](../assets/three-canvas.mjs) показывает полный автономный cube effect с resize, DPR cap, pause вне viewport/hidden, reduced motion, cleanup, fallback при WebGL error.

```html
<div id="project-three-host" style="width:100%;height:100%;min-height:240px">
  <span>Интерактивная 3D-сцена</span>
</div>
```

В HTML-элементе задать реальную высоту, иначе100% может не иметь основания. Поставить host id один раз. Mount из type=module, передав загруженный THREE:

```js
import { mountThreeCanvas } from '/assets/three-canvas.mjs';
const host = document.getElementById('project-three-host');
const stop = mountThreeCanvas(host, THREE);
// При реальном удалении виджета:
// stop();
```

`/assets/...` — пример пути вашего hosting, не встроенный URL Tilda; в T123 можно поместить модуль целиком и импортировать одну согласованную версию THREE с подходящего CDN. Не выдумывать, что MCP upload_image загружает JS-модули. При transform-only изменении host вызвать `stop.refresh()`, при удалении — `stop()`. Подключение к внешнему popup/layout lifecycle выполняет вызывающий код.

Размер backing buffer задаётся по visual rect host, DPR ограничен2 как проектный компромисс. CSS canvas остаётся100% от layout host, поэтому parent Autoscale не применять повторно к CSS W/H. ResizeObserver не замечает transform-only change: asset измеряет rect при активном render/window resize. При reduced motion RAF останавливается; после внешнего transform-only change вызывать `stop.refresh()`. Rotation/skew требуют отдельного решения pointer projection.

Отправляем pointer coordinates в NDC через clientX/Y и visual rect. Не связывать camera.aspect с design width Grid. WebGL contextlost: остановить render, показывать fallback; восстановление сцены реализовывать явно, не обещать бесшовное восстановление.

## Swiper, jQuery и другие

Сначала native Gallery. Если нужны непредставленные interactions: отдельный Swiper host, scoped CSS, одна версия, destroy при teardown, update после popup/resize; не переинициализировать нативную галерею как Swiper. jQuery применять только если уже нужен проекту: presence/version проверить, не добавлять для querySelector.

## Приёмка

Без libraries/slow network эффект оставляет контент; repeated mount не добавляет listeners; resize10 раз не создаёт новые contexts; mobile/reduced motion статичен; fonts/image loaded меняют geometry корректно; Autoscale on/off не удваивает размер; WebGL hidden/offscreen не крутит RAF; teardown освобождает собственные GPU resources. Измерить long tasks/FPS/INP/LCP/CLS на целевом устройстве, не обещать60FPS по коду.
