# Autoscale to Window Width

**Документация:** [RU Advanced](https://help-ru.tilda.cc/zero/advanced) подтверждает Scale Grid Container → Autoscale to Window Width, пропорциональное масштабирование Grid-контента и высоты блока, включение на отдельных экранах. Источник одновременно предупреждает о Window-элементах и описывает Window как способ сохранить размер/отступы без scale. Смешанная композиция требует runtime-проверки; ни общий запрет, ни универсальная гарантия не обоснованы.

**MCP:** `ab_upscale:window` включает масштабирование, `grid` — обычный Grid. [Контракт](mcp-zero-contract.md).

## Расчёт — инженерная модель

```text
k = доступная ширина окна / design width активного экрана
visualWidth ≈ nominalWidth*k
visualGap ≈ nominalGap*k
visualHeight ≈ baseHeight*k (простая Free/Grid композиция)
```

1440/1200=1.2: W240→288; gap24→28.8; H600→720. Телефон 390/360=1.0833; для design320 было бы1.21875. На переходе экрана заново выбери G. Custom1920 меняет базу своего диапазона.

Не выдавай H*k за универсальную формулу для Hug, Flex, Window Height, nested transforms или content resize: измерять artboard/record. Не обещай единственную DOM-реализацию одним CSS transform: runtime может использовать wrappers, zoom или пересчёт размеров.

| Задача | Выбор |
|---|---|
| Пропорциональный коллаж | Autoscale — кандидат |
| Длинный текст | Flow/адаптив и отдельная mobile композиция |
| 4K | Проверить чрезмерное увеличение; max-width/large breakpoint |
| Форма | Проверить focus, placeholder, мобильную клавиатуру |
| Dynamic cards | Сначала Hug/Wrap; затем scale и record height |
| Canvas | CSS host, backing buffer и DPR по visual rect |

## Реальные размеры и GSAP

`getBoundingClientRect()` — визуальный axis-aligned box с transforms; `offsetWidth` — layout box, обычно до transform, округлённый. Их отношение оценивает k только без rotation/skew, дополнительного scale и прочих искажений. Transform одного узла не показывает cumulative scale предков.

Не умножай уже измеренный rect на k. Не добавляй `scale(k)` поверх Autoscale. Локальный GSAP x24 в scaled subtree при k1.2 даёт ≈28.8 экранных px. Для точного screen displacement при простом uniform scale localX=screenX/k; при сложной матрице использовать inverse transform, не деление вслепую.

У Tilda и GSAP должен быть один владелец transform каждого узла. Анимируй отдельный проверенный motion target; не стирай placement/runtime scale у `.tn-elem`. Для pin scaled Grid нужны отдельные тесты; сложную scroll-сцену лучше размещать в стабильном внешнем flow-host.

## Диагностика

1. Зафиксировать viewport, screens, G, container элемента.
2. Снять rect/layout и ancestor transform/zoom: [inspect script](../scripts/inspect-zero-block.js).
3. На копии выключить custom motion, затем отдельно Autoscale; сравнить смещение.
4. Window/Grid сравнить при 1200/1440/1920 и телефоне: реальный размер, отступы и высота record.
5. После fonts/images/resize объединённый ScrollTrigger.refresh; не каждый кадр.
6. Сравнить низ контента и record: visible overflow не доказывает корректную высоту потока.

Размытая картинка → source/DPR; canvas → backing buffer; прыжок pin → transforms/layout/late refresh; двойной scale → повторное умножение. Не применять глобальный `transform:none!important`.
