# Качество, SEO, доступность, производительность

## Правила пользователя

Высокое качество, точность макета, минимум dependencies, native Tilda первым, простая архитектура, сохранить рабочую логику. Не переписывать страницу без причины. Передавать полный код без пропущенных функций; большие реализации допустимо разделить на3 логические части. Проверять стандартные и реальные screens, Autoscale, Zero compatibility и motion performance. Не выдавать эксперимент как гарантированное решение.

## SEO

**Документация:** [SEO guide](https://help-ru.tilda.cc/search-engine) описывает настройки title/description, заголовки, alt и поисковую конфигурацию. В Zero heading tag задаётся элементом; в MCP tag h1/h2/h3. SEO не появляется автоматически из Layers name.

**Инженерная рекомендация:** один смысловой h1 страницы, последовательные уровни, содержательный текст остаётся DOM, CTA — ссылки/кнопки, alt передаёт смысл картинки; декоративное image alt пустой. Title/description соответствуют странице. Не размножать mobile copies с одинаковыми id/двумя h1 без проверки rendered DOM и visibility. Canvas должен иметь доступный текстовый эквивалент; важный контент не помещать только в WebGL.

## Доступность

[WCAG contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): normal text≥4.5:1, large≥3:1; large18pt≈24CSSpx или14pt≈18.67CSSpx bold. **Не18/14px**, как упрощено в тексте текущей MCP инструкции. Проверить контраст на фактическом cropped background всех экранов.

Инженерная приёмка: tab order совпадает смысловому порядку; focus visible; нет nested links; формы имеют labels, errors связаны с полями; placeholder не заменяет label; tooltip/menu доступны без hover; popup focus не теряется; reduced motion сохраняет текст/действия. Zoom200%, длинный контент и системное масштабирование текста не должны перекрывать CTA. Touch targets и ошибки проверять на реальном устройстве.

`pevent:none` только для декора: оно отключает взаимодействие/ссылку. Не применять к контейнеру формы. Если browser не исполняет JS, критичный CTA/контент остаётся доступен.

## Изображения и шрифты

**Документация:** [Photo optimization](https://help-ru.tilda.cc/photo-for-publishing) описывает подготовку изображений; [Fonts](https://help-ru.tilda.cc/fonts) — подключение проектных шрифтов.

**Инженерная рекомендация:** выбирать source под фактический visual size и DPR, сохранять aspect и зарезервированные размеры; оптимизировать bytes, не лишь width. Не переносить исторические ограничения1680/1920 из старой статьи Autoscale на любой upload/тип без проверки. SVG для простых логотипов, raster для фото. Ограничить font weights, проверять fallback и layout shift.

## Core Web Vitals

Инженерная диагностика, не обещание показателей: LCP — late hero image/font/render blocking; CLS — неизвестные размеры/late media/pin spacer; INP — дорогие input handlers/JS/layout. Измерять field/lab отдельно, на той же странице/устройстве. Не закреплять численные проходные пороги из памяти: если задача включает аудит метрик, проверить актуальную официальную web.dev документацию.

Анимации transform/opacity сначала, costly blur/filter/shadows — по измерению. Одна RAF loop на сцену, offscreen/hidden pause, listeners cleanup, bounded DPR, texture/geometry budget по устройству. Не читать rect после каждого style write на scroll.

## Сдача

Указать project/page/record, минимальный diff, архитектуру, screens, где вставлен код, versions, cleanup, фактическую validation evidence. Не заявлять «проверено на всех устройствах» после syntax check или только1200px. Перечислить оставшиеся runtime checks и конкретную причину их отсутствия.
