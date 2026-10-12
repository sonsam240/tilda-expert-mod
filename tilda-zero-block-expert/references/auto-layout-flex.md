# Auto Layout и Flex

**Документация:** [RU Auto Layout](https://help-ru.tilda.cc/zero/auto-layout): Object → Flex Auto; Direction Horizontal/Vertical/Wrap. W/H Hug и Fixed; ручной resize переводит ось в Fixed. Gap по X/Y зависит от направления, Padding внутренний. Hug пересчитывает размер по детям. Justify Content требует свободного места и имеет Space Between/Around/Evenly; Align Content работает для строк Wrap при не-Hug высоте. Align Elements/Justify Content/Align Content не взаимозаменяемы.

**MCP:** также есть Artboard Auto Layout `ab_flex:auto`; дети fixed/hug/fill, order/grow/shrink/basis, margin, alignself, absolute. Это JSON-контракт, не доказательство наличия всех этих ручек в любой версии UI. [Контракт](mcp-zero-contract.md).

## Отличия от CSS Flexbox

- По контракту flow идёт по **убыванию zindex**: больший первым, не порядок numeric keys.
- `flexdirection:wrap` — Tilda value, не CSS flex-direction.
- `%` внутри physical не универсальный способ; fill/basis применять по контракту.
- `absolute:y` ребёнка выводит из потока; top/left не заменяют gap.
- Hug группы не означает Hug артборда: проверить всю цепь высот.
- Не приписывать UI CSS Grid/minmax, baseline/stretch и прочие ручки без проверки.

## Расчёт — инженерная модель

Column H≈paddingTop+ΣchildHeight+(n−1)*gapY+paddingBottom. Row W≈paddingLeft+ΣchildWidth+(n−1)*gapX+paddingRight. Не включает margins, absolute и сложное shrink/basis. Wrap нужен конечный Wavailable. Текст измеряется после шрифтов.

40/72/48 px дети, gap16, padding24: H=40+72+48+32+48=240. Описание72→120 требует H288. При Fixed240 overflow/clipping — ожидаемая ошибка размеров.

| Сценарий | Конфигурация проекта | Проверить |
|---|---|---|
| Кнопка+иконка | Object row, Hug W, gap/padding | Caption, focus, общую ссылку |
| Меню | Row → column/Wrap телефона | Keyboard order, длинные слова |
| Карточка | Column, Fixed W, Hug H, text autoheight | +50% текста |
| Теги | Wrap, ограниченный W, Hug H | Последнюю строку, gapX/Y |
| Карточки в сетке | Wrap + Object columns | Разную высоту и CTA |
| Растущая секция | Artboard Hug + flow groups | Положение следующего record |
| Коллаж | Free + content Flex group | Контент и декор |

Одинаковые высоты карточек — проверенная fixed/fill/stretch схема, если поддерживается. Не обещать stretch по аналогии с CSS. При Autoscale сначала flow, затем visual scale и record height; не добавлять resize-скрипт, который одновременно с native Hug управляет height.

Gap не работает → тип/Flex/direction/absolute. Wrap отсутствует → Hug W/безграничный parent/широкий child. Не растёт → Fixed. Не тот порядок → zindex/flexorder. Следующий record перекрыт → артборд Fixed/исключения Hug.
