# Типовые сценарии проверки Skill

Это задания и критерии наблюдаемого результата, не автоматическое доказательство работы на Tilda.

| № | Задание | Критерий |
|---|---|---|
| 1 | Карточка с длинным описанием + CTA | Object column, text autoheight, Hug H, цепь до artboard, реальные переносы |
| 2 | Объединить независимый декор и Object | Logical на Free root; не назначить Flex Logical |
| 3 | Вложить Logical в Object на7 уровней | Сообщить conversion и limit6, упростить дерево |
| 4 | Grid1200, viewport1440, Autoscale; логотип Window | k1.2 для Grid; mixed предупреждение; runtime Window проверить |
| 5 | rect240, offset200; движение24 экранных px | Не масштабировать rect повторно; простой scale1.2 → local20 при подтверждённых предпосылках |
| 6 | Block screens360,480,640,960,1200; исправить phone | Использовать-res-360, сохранить screens/meta/unknown keys |
| 7 | fontsize48, -res-96040, -res-48028; viewport700 | Значение40, inheritance от wider; изменениеbase не перекрывает own override |
| 8 | Dynamic cards Wrap не переносит | Проверить finite W, Hug parent, child size/basis; Fixed W/Hug H, не custom breakpoint первым шагом |
| 9 | SBS hover + basic appear на одном elem | Выбрать один native motion mechanism либо отдельные nodes |
| 10 | GSAP на tn-elem рядом с native Autoscale | Проверить transform owner, отдельный target, scoped context и cleanup |
| 11 | Font изменил высоту + ScrollTrigger end | Geometry/refresh после font, не только update; не refresh каждыйframe |
| 12 | MCP «поставь Object padding и опубликуй» | Проверить live tools, read→whole update, preserve, draft review; publish в пределах authorization |
| 13 | Нет MCP write tools | Не выдумать tool; concrete editor steps/JSON patch, browser только при доступе |
| 14 | SVG31KB для vector import | Разделить UI20KB и MCP advice15KB, выбрать image/упрощение |
| 15 | Form выглядит, но нетactive receivers | Не заявить доставку; реальныеhashes или оставить пусто с отчётом |
| 16 | Canvas в popup сscale | Nonzerohost после открытия; visual rect/DPR, pause/dispose, без double scale |
| 17 | Просят18px normal contrast3:1 по MCP | Исправить pt/px, normal4.5:1 |
| 18 | Новый Figma plugin импорт сnested | Не переносить legacy API flat-group restriction |

## Structural acceptance

Frontmatter name/description valid; UI metadata coherent; ссылки на все references/assets существуют; placeholders scaffold отсутствуют; JS parse valid. Снимки contracts названы и датированы. Не содержатся account keys или claims о mutations, которых не было.

## Runtime acceptance для следующей реальной задачи

Preview/public: все actual screens, standard320/480/640/980/1200, boundaries±1, wide1920, intermediate768/1440; portrait/landscape/short height; Autoscaleon/off и Grid/Window; longesttext/fontloaded; hover/click/focus/reducedmotion; repeatmount/teardown; безlibraries и slowmedia; формы с разрешённой test submission. Указывать URL и screenshots/measurements в отчёте конкретной реализации.

## Baseline этой разработки

До написания справочников независимый агент без skill ответил на4 вопроса: не мог подтвердить nested groups/limit6, Window exemption приscale, инструментыMCP и native flow details. Он корректно пометил пробелы, не выдумал операции. Эти пробелы стали проверяемыми целями, а не поводом запретить нормальные editor workflows.

Результаты forward test и package checks: [validation report](validation-report.md).
