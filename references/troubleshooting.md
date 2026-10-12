# Диагностика Zero Block

Метод — **инженерная рекомендация**. Начать с точного record, viewport, screens и reproduction; наблюдение → одна гипотеза → минимальная обратимая проверка на draft → исправление → повтор исходного кейса и соседних screens.

| Симптом | Сначала проверить | Типовая причина / минимальный путь |
|---|---|---|
| Mobile пропадает | ab_screens, hidden overrides | Неправильный suffix320 вместо360; missing explicit n |
| При640 текст наезжает | fonts, real text rect, parent mode | Fixed H/absolute цепочка → flow/Hug |
| Следующий block перекрыт | record/artboard H и content bottom | Overflow visible не расширил поток; неправильный Hug |
| Scale удвоен | ancestor transform/zoom, custom scale | Умножен visual rect или второй scale |
| Window logo «плавает» | axes, viewport и active Grid | Перепутанный container или mixed Autoscale |
| Flex нет | group type и актуальный editor | Logical вместо Object |
| Wrap не переносит | parent W и child basis/width | Hug W либо широкие дети |
| Gap игнорируется | direction, Flex Auto, absolute | Ребёнок выведен из потока |
| Не тот flow order | zindex, flexorder | По контракту zindex descending |
| Вложенная Logical изменилась | Layers и type после drop | Штатная конвертация в Object |
| Animate mobile нет | animmobile и ширина | Контракт: <1200 без y отключено |
| Basic исчез | sbsevent | SBS отменяет Basic |
| Fixing не действует | animfixdist | Нулевое расстояние выключает fixing |
| GSAP прыгает | кто пишет transform, fonts/images | Motion конфликт; layout ещё меняется |
| ScrollTrigger wrong end | Hug/popup/late media | Refresh после стабилизации, не update |
| Tooltip обрезан | overflow всех ancestors | zindex не решает clipping |
| zindex9999 не помогает | stacking context у record/parent | Менять нужный уровень стека |
| Canvas размытый | rect, buffer W/H, DPR | Buffer от design/layout вместо visual |
| Canvas invisible popup | host rect0 до открытия | Resize после открытия, ненулевая высота |
| Form не отправляет | receivers активность, version/meta | Нет receiver/невалидный inputs/config |
| SVG вернулся старый | vectorjson | При смене vectorsvg очистить vectorjson |
| JS работает дважды | scripts/mount registry | Дублирование include/init |
| Всё сломалось после MCP | payload diff и backup | Full replace с неполным JSON |
| Preview/Public различаются | draft/save/publish | Публикация не выполнена или старый cache |

## Проверка контейнера и scale

Запустить [inspect script](../scripts/inspect-zero-block.js) на public/preview. Сравнить .tn-elem/.tn-atom/artboard rect, offsetWidth/Height, computed style и ancestor chain; не считать ratio доказательством Autoscale. Потом точечно отключить свою animation на копии; не сбрасывать native transform всех элементов.

## Проверка flow и текста

Сначала подставить самый длинный разрешённый текст, дождаться font; проверить child bounds, Hug/Fixed всех parents, исключения autoheight. Не лечить font-wrap произвольным отступом, пока неизвестна причина. Если absolute намеренно нужен, измерить content height и оставить рассчитанный резерв по каждому экрану.

## Проверка записи MCP

1. Новый JSON отличается только нужными keys/screens/ids; неизвестные keys сохранены.
2. IDs строки и уникальны, group parents существуют, нет циклов/глубины>6.
3. JSON-строки fields/slide arrays корректны; SBS особый формат не преобразован как обычный JSON.
4. Whole payload≤250KB; before save перечитать актуальный блок при риске stale state.
5. Readback + rendered HTML; успех save не заменяет визуальную приёмку.

## Когда остановить исправления

Если гипотеза не подтверждается, сохранить наблюдение и сменить её, не наслаивать CSS overrides. Если connector/UI доступа нет, выдать concrete patch/instructions и требуемую проверку; не выдавать browser DOM изменение за permanent save. Если auto-review блокирует действие, не обходить его повторными аналогичными mutations.
