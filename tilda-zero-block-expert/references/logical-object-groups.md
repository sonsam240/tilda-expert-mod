# Logical и Object

**Документация:** [Группы](https://help-ru.tilda.cc/zero/groups): Logical сохраняет независимые элементы, анимация назначается каждому отдельно; Object имеет общий Background, Padding, анимацию целого объекта и Flex. Вложенная Logical становится Object; максимум шесть уровней Object. Group/Ctrl+G создаёт группу, Layers/drag-and-drop/настройки/контекстное меню меняют дерево.

| Возможность | Logical | Object |
|---|---|---|
| Основа | Выделение свободных элементов | Самостоятельный контейнер |
| Фон | Отдельный Shape | Background |
| Padding/Flex | Нет Object/Flex механизма | Есть |
| Анимация | Каждого элемента | Всего объекта |
| Редактирование детей | Отдельно | Также отдельно |
| Вложение | Конвертация в Object | ≤6 уровней |

**MCP:** Object=`physical`, Logical=`logical` или нет type; parent=`groupid`. Общая link группы исключает ссылки внутри. Object имеет размеры/background/border/radius/shadow/opacity/effects/overflow/link. Hidden Logical не скрывает детей на странице: скрыть детей или применять physical. Внутри physical/autolayout группы physical. [Контракт](mcp-zero-contract.md).

## Иерархия — инженерная рекомендация

```text
Free artboard
└─ Logical: композиция
   ├─ Object: текст и CTA (Flex column)
   │  ├─ Heading
   │  └─ Button
   └─ Shape: свободный декор

Auto Layout artboard
└─ Object: каталог (Wrap)
   └─ Object: карточка (column)
      ├─ Image
      └─ Object: описание (column)
         ├─ Heading
         └─ Text
```

Нужны общий box/фон/ссылка/clipping/motion → Object. Только совместное выделение свободной композиции → Logical. Изменяемый текст → Object Flex. При nesting проверить конвертацию, глубину и координаты после смены типа.

Кликабельная карточка: одна общая ссылка без interactive детей либо контейнер без ссылки с дочерними кнопками. Проверять keyboard/focus/click и размер зоны ссылки.

Ошибка: Logical + SBS ожидать единое вращение вокруг центра. Решение: Object для общего transform, либо намеренные анимации каждого child. Название Layers не считать стабильным DOM selector; использовать проверенные id/пользовательский класс.
