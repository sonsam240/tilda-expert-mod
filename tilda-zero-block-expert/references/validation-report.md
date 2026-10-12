# Отчёт проверки — 09.10.2026

## Область

Исследованы официальные RU/EN материалы и актуальные доступные Tilda MCP contracts. Проведён независимый baseline без Skill; подготовлен forward-test18 сценариев. Аккаунт Tilda не изменялся, страницы не создавались/публиковались. Список источников и расхождений: [documentation map](documentation-map.md).

## Проверки

| Проверка | Фактический результат |
|---|---|
| `quick_validate.py` | Skill is valid, exit0; Python с PyYAML, UTF-8 mode |
| Frontmatter и UI YAML | name/description valid; UI YAML parsed, display name/default prompt согласованы; русские строки UTF-8 |
| Local links и syntax | Проверены check-package; финальные количества фиксируются в delivery report |
| GSAP lifecycle fixtures | 6/6 PASS: readiness без mutation, abort pending/mounted, repeatmount, no dependencies, timeout cleanup |
| Three lifecycle fixtures | 8/8 PASS: visual size/DPR, reduced motion refresh, constructor/scene/resize/render failures, hidden pause, repeatmount |
| Baseline без Skill | Независимый агент выявил пробелы nesting/Autoscale/MCP/native flow, честно не выдумывал |
| Forward-test Skill | 18/18 PASS как решения по справочникам, с конкретными ответами и источниками; не browser rendering |
| Независимый review assets | Найдены и исправлены readiness/cancel/timer issues, fallback API и error cleanup; boundary fixes покрыты fixtures |

Bundled Python первоначально не имел PyYAML, поэтому quick_validate завершился ModuleNotFoundError. Затем validator реально выполнен доступным Python с PyYAML и прошёл; пакеты не устанавливались. Инициализатор записал UI YAML в CP1251: исправлено на UTF-8, check-package теперь отклоняет invalid UTF-8.

Synthetic fixtures исполняют наши функции, подменяя DOM/GSAP/WebGL boundary; не измеряют визуальное соответствие, реальный GPU, Tilda runtime или библиотечную совместимость. Это точная граница результатов.

Исправления review: GSAP bounded RAF+MutationObserver, AbortSignal, refresh guard после destroy; Three очистка partial initialization/size/render, fallback.refresh no-op, explicit refresh для reduced motion scale-only, visibility canvas при context loss.

## Ограничения

- Нет выбранной реальной Tilda страницы/editor snapshot: визуальная работа Autoscale/Window, Flex и native animations на всех screens в этой сессии не проверена.
- Tools metadata/instructions подтверждены; get/update/publish на аккаунте не выполнялись, permissions конкретного проекта не проверялись.
- GSAP/Three examples предназначены для адаптации, требуют реальных selectors, согласованной dependency version и integration test. Syntax check не доказывает WebGL/Tilda runtime.
- RU MCP web-reading вернул error; использованы EN и live tool contracts.
- Нет утверждения о чтении всех вложенных видео, всех страниц Help Center и исчерпывающем перечне будущих настроек.
- Текущая сессия стартовала до установки: появление в автоматически загруженном каталоге проверяется в новой сессии Codex; текущий агент может читать установленный путь напрямую.
