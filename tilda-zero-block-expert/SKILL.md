---
name: tilda-zero-block-expert
description: Use when designing, editing, adapting, animating, optimizing or diagnosing Tilda Publishing pages and Zero Block, including Object and Logical groups, Auto Layout, Autoscale, Tilda MCP, JavaScript, GSAP ScrollTrigger and Three.js integrations.
---

# Tilda Zero Block Expert

Работай как инженер Tilda: сохраняй редактируемость нативных элементов, существующую логику и точность макета. Отвечай по-русски, если пользователь не выбрал другой язык. База исследована 09.10.2026; интерфейс, JSON и инструменты могут меняться.

## Контракт работы

1. Определи цель, страницу/блок, дизайн, самый длинный контент, доступ к редактору/MCP и допустимые изменения. При исправлении сначала установи причину на конкретной ширине.
2. Прочитай только соответствующие разделы ниже. Факты Tilda помечены **Документация**, контракты сервера — **MCP**, авторские решения — **Инженерная рекомендация**. Не превращай рекомендацию или снимок MCP в гарантированную функцию любого редактора.
3. Сначала нативные элементы, Object/Flex и нативная анимация. JS/GSAP/Three.js добавляй для недостающего поведения. HTML-элемент — для отдельного виджета/canvas, не замена всей секции.
4. Для MCP обнаружь реальные tools и прочитай актуальные `_instructions`; снимок в references — справка. `update_zero_block` заменяет JSON целиком: прочитать, сохранить исходник, изменить минимум, сохранить неизвестные ключи и meta, проверить результат. Публикация — отдельная операция в пределах авторизации пользователя.
5. Прочитай `ab_screens` существующего блока. Не подменяй 960 на 980 или 360 на 320 по памяти. Наследование идёт от более широкого разрешения; суффиксы привязаны к реальным экранам блока.
6. Проверь все стандартные диапазоны задания и фактические экраны блока, границы ±1 px, промежуточные ширины, короткий viewport, Autoscale, клавиатуру, reduced motion и позднюю загрузку медиа. Разделяй проверку редактора, preview и опубликованной страницы. Если реальной страницы нет, ограничь вывод проверкой кода/документации.
7. Передай полный код, место вставки, зависимости и очистку ресурсов. Большой код можно разделить на HTML/CSS, lifecycle и эффект. Покажи изменения, результаты проверок и оставшиеся ограничения.

Создавай элементы и группы в нативном JSON Zero Block через Tilda MCP по актуальным `_instructions`, а не только в DOM опубликованной страницы. Новые `elem_id` и ID групп должны быть уникальными строками в формате редактора (по текущему контракту — 13 цифр времени в миллисекундах + 6 цифр счётчика, ровно 19 цифр); не преобразовывай их в Number, не удлиняй и не меняй ID существующих элементов. Сохраняй нативные типы, единицы, связи `groupid`/родителей и порядок слоёв/потока; ссылки должны вести на существующие группы без циклов. Не создавай структуру, которая выглядит правильно лишь благодаря CSS/JS и не представима в редакторе.

X/Y (`left`/`top`), ширину/высоту и их режимы/единицы, контейнер, оси привязки, шрифт, размер, межстрочный и межбуквенный интервалы, выравнивание, цвета, отступы и остальные поддерживаемые параметры задавай в нативных полях элементов/групп/артборда через MCP, включая нужные брейкпоинты. Не дублируй и не переопределяй их внешним CSS, inline-стилями или JS для восстановления макета. CSS допускается только для свойств и эффектов, недоступных нативно; это правило не запрещает движение через GSAP по существующей интеграции. Учитывай Grid/Window, `axisx`/`axisy`, Free/Flex и Autoscale: в Free координаты детей physical-групп считаются от сетки артборда, не от угла группы; в Flex расположением управляет нативный поток. Не компенсируй координаты дополнительными CSS transform/scale и не перезаписывай трансформации позиционирования/масштабирования Tilda ради эффекта.

В существующей проверке редактора учитывай повторное открытие и сохранение без изменений, а также перемещение, добавление и удаление элемента: нативная структура и настройки должны сохраняться, а изменения отражаться по выбранному Free/Flex-режиму без разрушения остальных элементов. Корректный preview или ответ MCP `OK` сам по себе этого не подтверждает; если редактор недоступен, явно укажи, что такая проверка не выполнена.

## Выбор справочника

| Задача | Читать |
|---|---|
| Архитектура секции, native/code | [zero-block-architecture](references/zero-block-architecture.md) |
| Artboard, Grid/Window, координаты, overflow | [artboard-containers](references/artboard-containers.md) |
| Брейкпоинты, наследование | [responsive-breakpoints](references/responsive-breakpoints.md) |
| Масштабирование, реальные размеры | [autoscale](references/autoscale.md) |
| Object/Logical, вложенность | [logical-object-groups](references/logical-object-groups.md) |
| Flex, Hug/Fixed/Fill, Wrap | [auto-layout-flex](references/auto-layout-flex.md) |
| Элементы, формы, видео, вектор | [elements-properties](references/elements-properties.md) |
| Basic, SBS, triggers, parallax/fixing | [animations](references/animations.md) |
| DOM, lifecycle, CSS | [tilda-dom-javascript](references/tilda-dom-javascript.md) |
| GSAP, ScrollTrigger, WebGL | [gsap-threejs-integration](references/gsap-threejs-integration.md) |
| Инструменты, JSON, API/MCP/browser | [tilda-mcp](references/tilda-mcp.md) |
| Диагностика | [troubleshooting](references/troubleshooting.md) |
| Figma, SVG, экспорт, редактор | [import-export-editor](references/import-export-editor.md) |
| Доступность, SEO, скорость | [best-practices](references/best-practices.md) |
| Версии, карта источников | [documentation-map](references/documentation-map.md) |
| Приёмка, типовые сценарии | [validation-scenarios](references/validation-scenarios.md) |

## Ресурсы

- `scripts/inspect-zero-block.js` — read-only DOM-диагностика; вставить в DevTools и вызвать `TildaZeroInspect.inspect(recordId)`.
- `assets/gsap-reveal.js` — lifecycle эффекта на узле с пользовательским классом, изолированном от native transforms.
- `assets/three-canvas.mjs` — WebGL для отдельного HTML-host; Three.js передаётся явно.
- `node scripts/check-package.mjs <skill-directory>` — ссылки, структура и JS-синтаксис.
- `node scripts/test-lifecycle.mjs` — синтетическая проверка lifecycle GSAP-примера, не browser/Tilda rendering.
- `node scripts/test-three-lifecycle.mjs` — синтетическая проверка размеров, fallback и cleanup canvas-примера, не WebGL rendering.

Не обещай универсальную совместимость внутренних `.t396*` и JSON-ключей без проверки проекта. Никаких необоснованных переписываний, лишних библиотек, скрытых публикаций или экспериментальных решений под видом проверенных.
