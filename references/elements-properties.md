# Элементы и параметры

**MCP:** полный актуальный перечень полей, типов и исключений — [Zero contract](mcp-zero-contract.md), [Forms contract](mcp-forms-contract.md). Ниже инженерные сценарии применения. Ключи JSON и пункты UI не обязательно имеют одинаковые имена.

## Общие поля MCP

Положение/размеры, mode, container/axes, zindex; hidden, opacity/rotate с исключениями для html/form/tooltip; background, border по четырём сторонам, radius по четырём углам, многослойные shadows, effects, hover colours; link/target/nofollow, pointer events; до пяти classname, attributes. Preserve global `typo_styleid`, `button_styleid` и `var(--uc-...)`, неизвестные editor/migration keys. HTML-элемент не растёт по своему содержимому.

| Тип | Поля контракта и назначение | Практика / типичная ошибка |
|---|---|---|
| Text | text, tag, textfit, typography, align/valign, padding, truncation, stroke/shadow | h1–h3 по смыслу; autoheight для описаний. Нельзя считать высоту по числу символов окончательно |
| Button | caption, link, typography, padding, border/shadow, hover, icon и icon animation | Один нативный button для обычного CTA; caption без HTML. Hover не заменяет focus |
| Image | img, natural W/H, imagefit/imageposition, alt, zoomable/lazyoff | Cover для кадра; contain для логотипа. Set natural sizes; не растягивать портрет в fill |
| Shape | figure rectangle/circle/line, bgcolor/bgimg, border/shadow | Декор/подложка; circle требует одинаковых W/H и radius по контракту |
| Vector | vectorsvg с viewBox, vectorjson, natural W/H | Если меняешь SVG, очистить vectorjson, иначе старый рисунок восстановится |
| Video | vidtype и единственный source key, autoplay/mute/loop, controls, poster | Не оставлять старый source другого provider; звук может блокировать autoplay |
| Gallery | imgs JSON-строка, stretch/position/loop/speed/autoplay/arrows/dots/caption | Проверить caption overflow и alt каждого слайда; не заменять Swiper без причины |
| Tooltip | tipcaption/tipimg, open/position/width/appearance, pin | На телефоне click; проверить края и overflow родителей |
| HTML | code, fixed box | Виджет, карта, canvas, script; динамическая высота требует отдельного решения |
| Form | version/inputs/receivers/styles/messages | Рабочая отправка зависит от активного сервиса, не только внешнего вида |

## Типографика MCP

`textfit`: autoheight — фиксированный W/контентный H; autowidth — одна строка по контенту; singleline — усечение фиксированной ширины; fixedsize — явные W/H. `lineheight` по умолчанию ratio, с `lineheightunits:px` — px. `letterspacing` px, weight зависит от загруженного font. HTML text ограничен поддержанными inline/list tags; обычные строки через br, не p. Общая link текста с вложенной a приводит к потере форматирования по контракту.

Проверить fallback/font-loaded перенос, кириллицу, знаки цены, non-breaking space, длинное слово, изменение текста. Шрифты подключать в настройках проекта, если это согласовано и нужно всему сайту; не менять существующую глобальную типографику ради одного исправления. [Официальные настройки шрифтов](https://help-ru.tilda.cc/fonts).

## Изображения и галерея

**Документация:** [RU Zero](https://help-ru.tilda.cc/zero) подтверждает Original size, Edit, ALT, Zoom on click, Lazyload, стили изображений; галерея имеет Cover/Contain, Position, Loop, Slide Speed, Autoplay, Zoomable, Arrows/Dots, индивидуальные caption/alt/link/video.

**Инженерная рекомендация:** LCP изображение не откладывать lazyload вслепую; ниже fold lazyload обычно полезен. Проверять source size после Autoscale и выбранную точку обрезки на мобильном. Background picture не считать семантической заменой img для содержательного изображения. Маску реализовывать radius/overflow Object, если это решает задачу; сложную SVG/CSS mask считать кастомным решением, не обещать отдельную нативную Mask-панель.

## Вектор

**Документация:** [Vector editor](https://help-ru.tilda.cc/zero/vector-editor) подтверждает Draw/Select/Bend/Edit Tool, кривые Безье, узлы, fill/stroke, импорт SVG до20KB, To Image для конвертации в SVG, возврат To Vector. MCP рекомендует SVG >15KB загружать как image: рекомендация ≠ UI-лимит.

Проверять viewBox, пропорции, stroke при scale, отсутствие scripts/external references у пользовательского SVG. Gradient/effects supported by contract не означает поддержку любого SVG filter. Сложную иллюстрацию лучше сохранить самостоятельным SVG/image.

## Видео

**Документация:** [Video](https://help-ru.tilda.cc/video) описывает Video в Zero и источники YouTube, Vimeo, MP4, Rutube, Kinescope, VK. **MCP** дополнительно документирует WebM/iframe, source keys и cover. Проверять privacy embed, мобильный autoplay, poster, controls, 16:9 или другой реальный aspect, CSP/CORS. Не загружать видео исключительно ради декоративного эффекта, решаемого CSS.

## Формы: инженерный алгоритм

1. Читать актуальные forms instructions и исходную form/meta; version2 и `meta.migrations.elements.form=2` согласованы.
2. inputs — валидная JSON-строка; уникальные lid и li_nm для data fields. li_name согласовать с li_nm.
3. Точные типы: имя/email/телефон/строка/textarea/select/choices/image choices/checkbox/date/time/quantity/range/URL/file/hidden/calculator/text/space — в контракте; даты требуют mask, file требует upload key.
4. Conditional fields — отдельная JSON-строка с fieldId существующего поля, до50 условий по контракту. Тестировать скрытые обязательные поля.
5. Receivers только из `get_form_integrations` текущего проекта; сохранить существующие, если не заказано изменение. Для новой формы указать реальные согласованные active receivers. Без active receiver нельзя заявлять доставку.
6. Проверить success/error/redirect, реальное получение тестовой заявки при авторизации, keyboard/labels/consent, поля внутри artboard на каждом экране. Не отправлять тестовые данные без разрешения и не подменять сервисы кастомным fetch без причины.

Источник процесса настройки: [Forms settings](https://help-ru.tilda.cc/forms/settings). Не хранить персональные данные и токены в Skill.
