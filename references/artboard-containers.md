# Artboard, контейнеры, координаты

**Документация:** [Advanced](https://help-ru.tilda.cc/zero/advanced) подтверждает Grid, центрированный по X, Window, выбор Container и начала координат Axis X/Y, px/% в доступных координатах и размерах. Полноэкранная обложка использует Window Container Height 100% и вертикальное выравнивание Grid. Это не делает каждый элемент fixed.

## MCP: различай уровни

| Поле | Смысл |
|---|---|
| `ab_height` | Базовая высота в px, fallback Hug |
| `ab_height_vh` | % высоты окна; базовая высота — минимум |
| `ab_valign` | top/center/bottom/stretch Grid |
| `ab_heightmode: hug` | По содержимому, с исключениями |
| `ab_ovrflw` | Выход контента: visible/auto/custom |
| `ab_position` | Позиция record: обычная/fixed/absolute |
| `ab_poszindex` | Стек между блоками |
| `ab_flex`, `ab_flexcontainer` | Layout артборда и Grid/Window основа |
| `container`, `axisx`, `axisy` | Контейнер/привязка элемента |
| `top/left/width/height`, `*units` | Числовая строка отдельно от px/% |

Точные значения: [контракт](mcp-zero-contract.md). Проценты внутри physical groups не поддержаны контрактом. В Free `top`/`left` детей physical считаются от артбордной сетки, **не от угла группы**. В Flex действует flow; `absolute:y` выводит ребёнка из потока.

Hug Free артборда не считает `excludefromautoheight:y`, axisy center/bottom и процентные top/height. Не используй фон высотой 100% родителя как основание высоты этого родителя.

## Расчёт — инженерная модель без Autoscale

```text
GridLeft = (viewportWidth - GridWidth) / 2
Xscreen = GridLeft + a*GridWidth + dx - a*elementWidth
Yscreen = GridTop + b*GridHeight + dy - b*elementHeight
a = 0 / 0.5 / 1 для left / center / right
b = 0 / 0.5 / 1 для top / center / bottom
```

Проценты переведи в долю выбранного контейнера. Правая привязка обычно требует отрицательного внутреннего смещения. V=1440, G=1200, W=200, left dx=40 → X=160; Window/right dx=-24 → X=1216. Формула помогает планировать; DOM после runtime, transforms и округления даёт реальные координаты.

## Overflow/слои — инженерная проверка

- Visible позволяет выйти из блока, но само по себе не увеличивает потоковую высоту.
- Проверяй clipping всей цепочки: record/artboard/Object. z-index не преодолевает overflow hidden.
- Transform, opacity, isolation создают stacking context. Внутренний z-index 9999 не гарантирует перекрытие соседнего record.
- Fixed/absolute блока и absolute ребёнка Flex — разные настройки.
- Fixed background, native Fixing и CSS fixed — разные механизмы. Тестировать под transformed ancestor и на телефоне.

Не исправляй один tooltip глобальным `.t396 {overflow:visible}`. Поля background/filter/fixed appearance есть в контракте.
