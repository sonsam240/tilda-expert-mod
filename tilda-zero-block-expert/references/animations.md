# Анимации

## Документация

[Basic animation](https://help-ru.tilda.cc/zero/animation): Animation (Fade In, направления, Zoom In), Duration/Delay в секундах, Trigger Offset в px, Distance для движения, Scale для Zoom; Parallax scroll/mouse; Fixing. [SBS](https://help-ru.tilda.cc/zero/advanced-animation): Step By Step Animation → Add; пять Event: Element on Screen, Block on Screen, On Scroll, On Hover, On Click. Start Trigger Window Top/Center/Bottom, Offset, Loop, Add Step, Duration/Move/Scale/Opacity/Rotate/Easing/Delay; для другого initial state шаг Duration0. Создание SBS отменяет Basic того же элемента.

[Trigger animation](https://help-ru.tilda.cc/zero/trigger-animation): SBS On Hover/On Click → Add trigger → выбрать другой элемент → добавить шаги. Play Element/Play All помогают проверке, окончательно проверять preview/public.

## MCP: важные инварианты

Полный набор: [animation contract](mcp-animation-contract.md).

- На ширине <1200 анимации отключены без `animmobile:y` по текущему контракту. Флаг ставится в base и действует на узкие экраны; не привязывай его по памяти к custom design width.
- Basic/SBS взаимоисключают друг друга; Parallax/Fixing взаимоисключают друг друга, но могут сочетаться с appear.
- Physical group получает animation fields на себя; Logical — каждый child отдельно.
- `animscale` fraction, не100 для100%; `animduration` секунды, SBS `ti/dt` миллисекунды; Scroll `di/dd` — дистанции прокрутки.
- `animfixdist:0` выключает fixing. Положительную дистанцию задавать явно.
- `sbsopts` — строка с массивом в одинарных кавычках согласно этому серверу. Не JSON.parse её напрямую и не «исправлять» кавычки перед отправкой.
- SBS initial step обязателен и нейтрален; другой initial state — следующий шаг0. Move offsets от исходного placement, не предыдущего шага.
- Вид Event/trigger/loop на base; numbers/steps могут иметь breakpoint overrides по контракту. Не обещать отключение конкретного эффекта пустой строкой на mobile.

## Выбор — инженерная рекомендация

| Задача | Решение |
|---|---|
| Элемент появляется | Basic |
| Finite hover/click sequence | SBS |
| Кнопка управляет другой фигурой | Trigger SBS |
| Двигается группа целиком | Physical Object animation |
| Появляются независимые части | Logical children |
| Общая scroll-сцена, вычисляемые связи | GSAP после проверки native возможностей |
| WebGL shading/геометрия | Three.js внутри host |

Не применять native transform + GSAP transform к одному узлу. Появление группы и детей может удвоить путь/opacity: проверять намеренное сочетание.

## Практический нативный сценарий

Object карточка → SBS On Hover, нормальный initial state, следующий шаг Scale105%, Duration0.3s, easeInOut. Проверить обратный ход при уходе мыши, tap телефона, отсутствие ложного общего scale в Layout, reduced motion. Для информации, доступной лишь при hover, добавить доступное действие click/focus вместо недоступной touch логики.

Пример scroll: нейтральный start, Move X300/Rotate45 за600px scroll; это не600ms. После изменения высоты артборда перепроверить trigger line.

## Производительность

Transform/opacity предпочтительны; blur/filter, giant shadows и несколько fullscreen layers измерять. Infinite animation нужна пауза вне viewport/при hidden document; reduced motion должен сохранять контент и смысл действий. Не оставлять исходный opacity0, если custom script/library может не загрузиться. CSS-only hover дополнить focus-visible, не ломая native styles.
