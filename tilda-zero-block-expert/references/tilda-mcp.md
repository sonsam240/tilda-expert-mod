# Tilda MCP, API и браузер

## Подключение и источник

[EN MCP](https://help.tilda.cc/mcp) подтверждает настройку ключа и подключение desktop AI-agent, управление страницами, Catalog и CMS Feeds. Указанный пользователем [RU MCP](https://help-ru.tilda.cc/mcp) 09.10.2026 возвращал ошибку чтения web-инструментом; это не доказательство отсутствия функции. EN прочитан, а доступные MCP tools найдены непосредственно в сессии. Токены в Skill не включены; сервер не настраивался заново.

Успешно вызваны только read-only `zero_block_instructions`, `zero_block_animation_instructions`, `zero_block_forms_instructions`. Проекты/страницы не изменялись и не публиковались.

## Четыре поверхности

| Поверхность | Подтверждённая роль | Граница |
|---|---|---|
| Tilda editor | Native artboard/elements/groups/layout | UI операции не равны доступным MCP tools |
| Tilda MCP | Контракты ниже, включая полный Zero JSON | Зависят от доступного сервера, key permissions и схемы |
| Public Tilda API | Экспорт/синхронизация опубликованного контента | Не считать универсальным CRUD элементов Zero |
| Browser automation | Реальное UI и published DOM | Только открытая доступная поверхность; read DOM не сохраняет editor JSON |

**Документация API:** [API](https://help-ru.tilda.cc/api) описывает GET/JSON, publickey/secretkey, Business, 150requests/hour, синхронизацию с локальным сервером, не запрос на каждое посещение. Экспорт и MCP не имеют автоматически одинаковых лимитов/прав. Credentials использовать только в согласованном серверном окружении.

## Найденные реальные инструменты

Названия ниже из tool metadata 09.10.2026; наличие проверено, account operations не выполнялись.

| Tool | Контракт / использование |
|---|---|
| `get_projects`, `get_pages` | Найти реальные project/page IDs; читать текущую схему перед вызовом |
| `get_page_records` | Record map в порядке страницы; include_html дорогой, обычно false |
| `get_zero_block` | Полный layout JSON tplid396, все screens и элементы |
| `update_zero_block` | Полный JSON заменяет содержимое; limit250KB, partial patch недопустим |
| `add_record` | tplid396 создаёт demo elements; new section заменить demo, сохранить screens/meta |
| `get_record_html` | HTML/CSS/JS/libraries одного record, включая draft |
| `edit_record`, `update_record` | Content/settings обычных blocks; schema из describe_tool, не угаданные field names |
| `duplicate_record` | Копия после исходного; новые id проверить |
| `reorder_page_blocks` | Полный список record IDs, включая скрытые |
| `update_page_head_code`, `update_project_head_code`, `update_project_css_code` | Только после чтения полной схемы и сохранения существующего code |
| `upload_image` | Реальный CDN URL; JS/module upload не обещать |
| `get_form_integrations` | Active receivers проекта; не выдумывать hashes |
| `publish_page` | Draft → public URL, отдельная внешняя mutation |
| `unpublish_page`, `delete_record` | Отдельные destructive operations, не способ диагностики |

Перед многошаговой работой читать matching `_instructions`. Снимки:

- [Zero JSON](mcp-zero-contract.md)
- [Animation](mcp-animation-contract.md)
- [Forms](mcp-forms-contract.md)

Object/Flex/padding доступны **через JSON-контракт**, а не выдуманный `set_group_padding`: `groups[].type:physical`, `flex:auto`, `padding:"24px 24px 24px 24px"`. Но безопасная запись возможна только после чтения реального блока и сопоставления id.

## Безопасная инженерная последовательность изменения

1. Найти нужный проект/страницу/record по текущему списку, подтвердить tplid396 и screens.
2. Читать исходный JSON и сохранить backup без секретов/персональных данных в delivery.
3. Повторно прочитать live instructions: snapshots могут устареть.
4. Построить минимальный diff по стабильным строковым ids; сохранить неизвестные keys, meta, styles, receivers, скрытые элементы и другие screens.
5. Предотвратить stale overwrite: перед записью перечитать блок и сравнить с исходником, если между чтением и записью была значимая задержка/внешняя правка; переприменить свой diff.
6. Передать полный `code`, не частичный fragment. Не считать id Number. Обновить timestamp по контракту.
7. Проверить answer/error; повторно читать JSON и `get_record_html`. `OK` — сохранение, не визуальная приёмка.
8. Просмотреть draft с нужными CSS/JS/libraries, проверить screens/fonts/flow/motion. Public version проверять после авторизованной публикации.

Не публиковать ради теста навыка. Если пользователь попросил опубликованный результат, ранее данная авторизация действует; Skill не вводит повторного approval. Если mutation не заказана, передать проверенный draft/patch и ограничения.

## Fallback

Tool отсутствует → проверить список и connector state, не имитировать tool. Можно подготовить JSON diff по предоставленному исходнику, пошаговую editor инструкцию или browser action по доступному UI. Не обещать запись в аккаунт без connector/доступа. Browser DOM modification исчезнет после reload и не заменяет сохранение в редакторе.

## Особые контрактные риски

- Screens360/960 versus historical320/980.
- Flow descending zindex и children coordinates от grid.
- Form inputs/conditional/gallery imgs — JSON **строки**; groups — массив.
- SBS opts использует формат с одинарными кавычками.
- HTML stripped Free по MCP; не строить секцию одним HTML.
- MCP instructions содержат неточный перевод порогов крупного текста18/14 в px: ориентироваться на WCAG18pt/14pt, см. [доступность](best-practices.md).
