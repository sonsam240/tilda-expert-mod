# Tilda DOM и JavaScript

## Что подтверждено и что требуется наблюдать

**MCP:** `get_record_html` возвращает rendered html/css/js/jslibs/csslibs и учитывает unpublished changes. Это источник реальной структуры конкретного record. [Инструменты](tilda-mcp.md).

**Инженерная модель типичного DOM, не стабильный публичный API:**

```html
<div id="rec123456" class="r ...">
  <div class="t396">
    <div class="t396__artboard" data-artboard-recid="123456">
      <div class="tn-elem" data-elem-id="...">
        <div class="tn-atom">...</div>
      </div>
    </div>
  </div>
</div>
```

Могут быть carrier/filter, scale/motion wrappers, group nodes, формы и изображения глубже atom. Снимок выше не предполагает прямые children, одинаковый tag у atom или отсутствие вложенных Object. Всегда проверять get_record_html или public DOM. `rec123456` — DOM id; API `recordid` — число123456; elem_id — длинная строка, не порядковый индекс.

Селектор с областью:

```js
const record = document.getElementById('rec123456');
const elem = record?.querySelector('[data-elem-id="1791182208000000001"]');
const atom = elem?.querySelector('.tn-atom');
```

При дублировании блока record id/elem mapping перепроверить; глобальный `.tn-atom` может затронуть всю страницу. Пользовательские classes задавать в editor/MCP, но проверить, на каком узле class реально появился.

## Место вставки

**Документация:** [HTML](https://help-ru.tilda.cc/html) подтверждает T123, HTML-элемент Zero, head сайта/страницы. Кастомные решения могут ломаться при изменении платформы. Это не основание заменять native markup; local widget допустим.

Инженерный выбор: site head — общие dependencies/config, page head — библиотека страницы, T123 после целевого блока — локальный mount. Одна загрузка библиотеки, явно выбранная version; не полагаться на global GSAP из чужого блока. Не включать secret keys в HTML.

## Lifecycle

1. DOMContentLoaded только означает parsed DOM, не завершение Tilda layout/fonts/images.
2. Бounded wait/MutationObserver для отсутствующего target; timeout возвращает явную ошибку и очищает observer. Не вечный setInterval.
3. Подождать fonts ready при геометрических расчётах, image decode/load и ненулевого rect. Не ждать всю страницу бесконечно.
4. Mount идемпотентен: registry на record/target; повторный вызов очищает только собственный эффект.
5. ResizeObserver на стабильном layout-host, media load/resize events; объединять refresh. Измерения не смешивать с transform writes в tight loop.
6. Destroy: observer.disconnect, remove listeners, cancel RAF/timers, context.revert, dispose собственных Three ресурсов. Нельзя `ScrollTrigger.killAll()` для cleanup одного record.
7. Bfcache: pagehide/page restore не считать full navigation; уместная повторная инициализация или pause/resume.

Некоторые Tilda runtime globals встречаются на страницах (`t_onReady`, `t_onFuncLoad`, `t396_init`), но этот Skill не обещает их контракт и не использует массовый повторный init. Если нужен внутренний helper — проверить наличие и код версии, не заменять им обычный browser lifecycle.

## CSS ownership

- Не переписывать top/left/transform всех tn-elem для эффекта.
- Локальный CSS ограничить `#rec...` или собственным уникальным классом.
- Геометрию, типографику и прочие поддерживаемые настройки исправлять в нативном JSON через MCP, включая брейкпоинты; не дублировать их внешним CSS или inline-стилями. CSS — только для недоступных нативно свойств/эффектов. Если конфликтует такой эффект, сначала проверить computed style, затем ограничить правку собственным эффектом, сохранив нативное позиционирование и Autoscale.
- Для motion нужен узел, не несущий native placement/scale. Вариант tn-atom допустим только после проверки native animation/effects на нём.
- Обёртка, добавленная JS внутрь atom, может повредить ссылки/форму/галерею; использовать отдельный собственный widget или проверенный node, не произвольный innerHTML rewrite.

## Геометрия и Pointer

[MDN rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) описывает visual box и viewport coordinates; [offsetWidth](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth) — layout width. Screen-to-local для простого прямоугольного canvas: `nx=(clientX-rect.left)/rect.width*2-1`, `ny=1-(clientY-rect.top)/rect.height*2`. Не вычитать page offset из clientX/Y. При rotation/skew rect недостаточен — inverse matrix или убрать это преобразование host.

Скрипт диагностики не отправляет данные, не меняет CSS и не вычисляет гарантированный Autoscale по одному ratio: [inspect](../scripts/inspect-zero-block.js).
