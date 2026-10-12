# Редактор, импорт и экспорт

## Figma → Zero

**Документация:** [Figma import](https://help-ru.tilda.cc/zero/figma-import) сейчас описывает plugin workflow: установить/Run, выбрать layers, Prepare to copy, Copy to clipboard, вставить Ctrl+V в Zero. Root Frame можно вставить группой либо применить его настройки к артборду и заменить элементы; поддержанные background/Auto Layout переносятся. Рекомендуемая ширина Frame1200, большой макет разбивать, button group назван соответствующе; максимум6 уровней. На той же странице старый API import явно назван устаревшим; не смешивать его ограничения вложенности с новым способом.

**Инженерная процедура:** backup; проверить actual frame width/screens; импорт на копию/новый draft; проверить assets/fonts/group types/flow/links; адаптировать все экраны; проверить pixel correspondence по overlay/screenshots. Не обещать автоматическую точность всех эффектов, constraints, интерактивности и mobile layouts из одного desktop Frame.

## SVG

**Документация:** [Vector editor](https://help-ru.tilda.cc/zero/vector-editor) — отдельный editable vector, инструменты Draw/Select/Bend/Edit; To Image/To Vector меняют форму представления. Это не редактор Three.js mesh. Import SVG≤20KB; MCP рекомендация15KB для сложного vector — другой тип ограничения. Обводка и viewBox проверяются при scale; native field availability не выводится из SVG vocabulary.

## Экспорт сайта и API

**Документация:** [Export](https://help-ru.tilda.cc/export) описывает выгрузку сайта на внешний сервер для соответствующих Business тарифов и ограничения HTTPS, шрифтов, форм. [API](https://help-ru.tilda.cc/api) — синхронизация экспортируемого контента.

**Инженерная граница:** экспорт HTML не гарантирует обратный импорт в редактируемое дерево Zero. Не обещать round-trip JSON/Figma/HTML как штатный формат. Проверить plan, актуальные условия, пути CSS/JS/images, CORS, fonts/формы и домен при переносе; до этого не выдавать «сайт работает автономно».

## Сетка и организация

**Документация:** [Modular Grid](https://help-ru.tilda.cc/zero/grid) — Settings → Zero Block Settings → Open; Vertical Columns/Column width/Gutter/Margins, Horizontal Row baseline/Module height, настройки отдельно для экранов и locks зависимых значений. Сетка — вспомогательная организация размещения, не автоматически CSS Grid layout.

**Инженерная рекомендация:** называть Layers по функции, декор/контент/interactive различать именами; фиксировать screen table и hierarchy перед большой правкой; сохранять элементы с id; не переносить group на другой экран вслепую через дублирование. Locks editor не считать permission/access control.

## Горячие клавиши

**Документация:** [Shortcuts](https://help-ru.tilda.cc/zero/shortcuts): Ctrl/Cmd+G группа; Ctrl/Cmd+S save; Ctrl/Cmd+Z undo; Tab настройки; Shift выделение; Alt-drag копия; Ctrl/Cmd+L слои; Shift+R линейки; стрелки placement. Полный текущий список искать в editor Shortcuts/контекстном меню — сочетания могут пересекаться с browser. Save и Publish различаются; Ctrl/Cmd+P не нажимать по памяти как print, если это публикация в текущем editor.

## Zero как popup

**Документация:** [EN Zero](https://help.tilda.cc/zero) подтверждает модификатор T1093 из Other: выбрать Zero record, link по умолчанию #zeropopup, настройки фона/закрытия/скорости/z-index. Это отдельный блок, не `position:fixed` любого артборда.

**Инженерная проверка:** popup закрывается keyboard/Escape, focus возвращается opener, содержимое доступно на коротком экране; geometry/GSAP/canvas после открытия обновляются. При нескольких popup проверить уникальные hooks и отсутствие scroll lock leakage.
