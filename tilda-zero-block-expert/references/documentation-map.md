# Карта документации и статус доказательств

Дата исследования: **09.10.2026**. Область: Zero Block core, ссылки раздела Zero в RU/EN Help, смежные материалы по code/media/forms/SEO, текущие MCP contracts. Это карта исследованного корпуса, а не заявление о чтении всего Help Center, всех видео и всех будущих функций.

## Уровни уверенности

- **Документация:** функция описана на указанной официальной странице; UI этой сессией не протестирован.
- **MCP:** метаданные инструмента обнаружены или `_instructions` реально успешно прочитаны. Это конкретный контракт, не гарантия успешной mutation в аккаунте.
- **Инженерная рекомендация:** авторская архитектура/диагностика на базе фактов. Применить с runtime проверкой.
- **Не подтверждено:** отсутствует достаточная документация/доступ; не выдавать за функцию.

## Прочитанные официальные источники

| Источник | Что исследовано / куда обращаться |
|---|---|
| [RU Zero](https://help-ru.tilda.cc/zero) | Интерфейс, элементы, изображения, галерея, layers |
| [EN Zero](https://help.tilda.cc/zero) | Screens, inheritance UI, artboard, T1093 popup |
| [RU Advanced](https://help-ru.tilda.cc/zero/advanced) | Контейнеры, оси, проценты, Autoscale |
| [EN Advanced](https://help.tilda.cc/zero/advanced) | Контроль терминов Grid/Window и responsive |
| [Groups](https://help-ru.tilda.cc/zero/groups) | Object/Logical, Background/Padding, depth6, conversion |
| [RU Auto Layout](https://help-ru.tilda.cc/zero/auto-layout) | Flex, direction, Hug/Fixed, gap, alignment |
| [EN Auto Layout](https://help.tilda.cc/zero-auto-layout) | Английские термины и общий flow |
| [Basic Animation](https://help-ru.tilda.cc/zero/animation) | Appear, parallax, fixing |
| [SBS Animation](https://help-ru.tilda.cc/zero/advanced-animation) | Events, steps, timing, start triggers |
| [Trigger Animation](https://help-ru.tilda.cc/zero/trigger-animation) | Зависимый click/hover trigger |
| [Modular Grid](https://help-ru.tilda.cc/zero/grid) | Columns, gutters, margins, baseline |
| [Shortcuts](https://help-ru.tilda.cc/zero/shortcuts) | Editor controls и hotkeys |
| [Figma Import](https://help-ru.tilda.cc/zero/figma-import) | Новый plugin/clipboard versus устаревший API |
| [Vector Editor](https://help-ru.tilda.cc/zero/vector-editor) | Безье, editing, SVG import/conversion |
| [Custom Breakpoints](https://blog.tilda.cc/custom-breakpoints) | Исторический анонс2023, max10 и320–1920 |
| [Zero Template](https://help-ru.tilda.cc/zero-template) | Шаблон поста CMS, поля, плитка, динамическая высота |
| [Video](https://help-ru.tilda.cc/video) | Провайдеры и Video Zero |
| [HTML](https://help-ru.tilda.cc/html) | T123, HTML element, head code |
| [Forms Settings](https://help-ru.tilda.cc/forms/settings) | Настройки полей и заявки; до100 полей по статье |
| [Fonts](https://help-ru.tilda.cc/fonts) | Проектные шрифты, external/custom |
| [Photo Optimization](https://help-ru.tilda.cc/photo-for-publishing) | Размер/вес и исторический1680px |
| [SEO](https://help-ru.tilda.cc/search-engine) | Метаданные, headings, alt, indexing |
| [Export](https://help-ru.tilda.cc/export) | Business, внешний hosting, ограничения |
| [API](https://help-ru.tilda.cc/api) | Export sync, credentials,150/hour |
| [EN MCP](https://help.tilda.cc/mcp) | Desktop/key/connect; страницы/Catalog/Feeds |
| [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Refresh versus update, cleanup, pin |
| [GSAP context](https://gsap.com/docs/v3/GSAP/gsap.context%28%29/) | Scope и собственный cleanup |
| [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29/) | Media query lifecycle, revert |
| [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) | Sizing, DPR, render/dispose |
| [MDN Rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) | Visual geometry |
| [MDN offsetWidth](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth) | Layout geometry |
| [WCAG Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Correct pt/CSSpx thresholds |

Страницы пересказываются выборочно; нет копии всего Help Center. Поля элементов/форм и алгоритмы сохранения уточняются по реально доступным tool contracts.

## Доступные MCP источники

Read-only responses сохранены в [Zero contract](mcp-zero-contract.md), [animation contract](mcp-animation-contract.md), [forms contract](mcp-forms-contract.md). Snapshot metadata есть в [tool catalogue](mcp-tools.json). Перед mutation перечитать live version.

## Расхождения и решение

| Расхождение | Решение |
|---|---|
| Overview320/980 vs MCP360/960 | actual ab_screens + rendered media queries |
| Custom max1920 в2023 vs2560 MCP | Контракт2560, UI проверить отдельно |
| Autoscale предупреждает Window и одновременно предлагает mixed | Протестировать mixed record; не обещать универсальную совместимость |
| Object(Beta) на screenshot | Не утверждать текущий статус релиза по старой картинке |
| Figma API вложенность плоская vs plugin6 уровней | Использовать новый workflow; старый явно legacy |
| SVG editor20KB vs MCP advice15KB | Limit отдельно от рекомендации |
| Photo1680 vs Autoscale upload1920 | Проверять real upload settings/file; нет общего лимита всех images |
| MCP large-text18/14px | WCAG18/14pt, пересчётCSSpx |

## Недоступное чтение

[RU MCP](https://help-ru.tilda.cc/mcp) и вариант trailing slash возвращали Internal Error web reader; использован EN и live tools. Попытки Three manual responsive/responsive-design и GSAP URL с неверным регистром также не дали читаемой страницы; не использованы как доказательства. SEO найден через актуальную ссылку search-engine, а не предположенный /seo.

## Дополнительно выявлено: CMS и глобальные стили

**Документация:** [Zero-template](https://help-ru.tilda.cc/zero-template) описывает добавление полей шаблона поста/всех полей, выбор preview content и плитку Потоков. **MCP:** служебные `fe-*`, `organism-role`, `hidden-conditions` сохраняются; global `typo_styleid`/`button_styleid` с var сохраняются. Обычный Zero JSON не даёт оснований пересоздавать CMS bindings. Для CMS задачи читать связанную официальную инструкцию и matching MCP tools отдельно; не снимать привязки ради визуальной правки.

## Как обновлять базу

Сначала проверить текущие official pages и live tools; фиксировать дату/источник/отличие. Если новая функция не покрыта контрактом, проверить UI/документ, явно указать surface. Добавлять только полезные сведения, не все анонсы платформы. Неподтверждённые поля не применять «для пробы» на production.
