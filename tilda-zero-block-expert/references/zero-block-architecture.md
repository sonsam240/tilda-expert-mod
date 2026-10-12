# Архитектура Zero Block

**MCP:** шаблон Zero Block — `396`; `get_zero_block` читает артборд и элементы, настройки артборда имеют префикс `ab_*`. Элементы: text, button, image, shape, vector, video, gallery, tooltip, form, html. Object в JSON называется `physical`, Logical — `logical` или без type. Поля: [контракт](mcp-zero-contract.md).

Уровни: страница → record → artboard → Object-группа → элементы. Logical организует выделение в свободном артборде, а не заменяет Object-контейнер. Editor layers не гарантируют аналогичные DOM-обёртки.

## Выбор — инженерная рекомендация

| Требование | Основа | Причина |
|---|---|---|
| Плакат, коллаж | Free artboard, координаты | Перекрытия являются дизайном |
| Меняется текст карточки | Object + Flex, text autoheight | Следующий элемент следует за текстом |
| Растёт секция целиком | Artboard autolayout/Hug, если доступен | Рост доходит до record |
| Масштабируется композиция целиком | Grid + Autoscale | Пропорции вместо новых переносов |
| Элемент у края окна | Window + оси | Позиция следует за окном |
| 3D | Отдельный HTML-host/canvas | WebGL локализован |
| Появление/hover/конечные шаги | Native animation | Меньше lifecycle конфликтов |
| Связанная scroll-сцена | GSAP после обоснования | Timeline и cleanup |

1. Раздели контент и декор: контенту flow и читаемость; декору допустим absolute.
2. Проследи зависимость: текст → высота карточки → высота ряда → высота артборда. Разрыв вызывает наложение следующего record.
3. Каждый уровень Object должен иметь смысл: своя ось layout, фон, clipping, ссылка или motion.
4. Назначь владельцев: Tilda — placement/responsive; native или GSAP — движение; Three.js — canvas.
5. Составь таблицу экранов: container, layout, W/H mode, typography, padding/gap, hidden, motion.

```text
Artboard (Auto Layout column, Hug height)
├─ Header Object (row → column на телефоне)
│  ├─ Heading text (autoheight)
│  └─ Button
└─ Cards Object (Wrap, ограниченная ширина)
   └─ Card Object (column, Fixed width, Hug height)
      ├─ Image
      ├─ Heading
      ├─ Description
      └─ Button
```

Это проектное решение, не гарантия, что любой старый блок уже имеет артборд Auto Layout. При недоступности режима оставь группы Flex, высоту Free артборда настрой по нижнему краю на каждом экране.

Сохраняй исходный JSON локально, сравнивай diff по `elem_id`/group id, а не numeric keys. 19-значные id нельзя переводить в JS Number.
