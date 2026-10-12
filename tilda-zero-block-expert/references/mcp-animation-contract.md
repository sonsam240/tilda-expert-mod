# Снимок контракта Tilda MCP — 09.10.2026

Источник: успешный read-only вызов `zero_block_animation_instructions` в этой сессии. Это контракт доступного сервера, не доказательство всех UI-настроек. Перед записью повторно вызвать актуальный инструмент. Не переносить правила публикации/шрифтов/получателей за пределы авторизации пользователя. Для доступности использовать WCAG: CSS px и pt не взаимозаменяемы.

# Zero Block: animation

Extends `zero_block_instructions`: the JSON format, breakpoints and ids are described there. Here — the animation keys of elements and physical groups.

## 1. Rules

- All values are strings, except the numbers inside `sbsopts` (section 4).
- A breakpoint version is `<key>-res-<width>` as for any other key (`animdistance-res-640`).
- **Below 1200 px every animation is off** — basic, parallax, fixing and step-by-step — unless the element has `"animmobile": "y"`. Set it only at the top breakpoint; it turns animation on for every narrower width.
- **Basic and step-by-step animation exclude each other** on one element: the editor removes the basic keys when a step-by-step event is set. Use one of them.
- **Parallax and fixing exclude each other**; each of them can be combined with an appear effect (`animstyle`).
- **Groups:** a physical group (`"type": "physical"`) takes all the keys of these instructions itself. A logical group has no animation: put the keys on each element (they play separately for each element).
- Animation is played only on the published page and in the page preview.

## 2. Appear on scroll (basic)

| Key | Value | Meaning |
|-----|-------|---------|
| `animstyle` | `fadein`, `fadeinup`, `fadeindown`, `fadeinleft`, `fadeinright`, `zoomin` | the effect when the element comes into view. `fadeinup` comes from below, `fadeinleft` comes from the right, `fadeinright` from the left |
| `animduration` | seconds, `"1"` | length |
| `animdelay` | seconds, `"0"` | delay before the start |
| `animdistance` | px, `"100"` | path of the four `fadein…` directions; not used by `fadein` and `zoomin` |
| `animscale` | fraction, `"0.9"` (= 90%) | starting scale of `zoomin` |
| `animtriggeroffset` | px, `"0"` | start later by this many pixels of scroll (the element starts when its top is above the window bottom minus the offset) |
| `animmobile` | `"y"` or absent | play below 1200 px (section 1) |

On narrower breakpoints the effect cannot be removed or changed to another kind: only one `fadein…` direction can be swapped for another, numbers (`animduration`, `animdelay`, `animdistance`, `animtriggeroffset`) can be overridden with `-res-`. To have no animation on phones, leave `animmobile` empty.

## 3. Parallax and fixing

| Key | Value | Meaning |
|-----|-------|---------|
| `animprx` | `scroll`, `mouse` | parallax type |
| `animprxs` | %, `"100"`; 50–200 | `scroll`: speed against the page; `100` — no effect, more — faster, less — slower |
| `animprxdx`, `animprxdy` | px, `"0"` | `mouse`: largest shift when the cursor is at the window edge; the element moves opposite to the cursor; off on touch screens |
| `animfix` | `"0"`, `"0.5"`, `"1"` | fix the element when it reaches the window top / center / bottom |
| `animfixdist` | px | how many pixels of scroll the element stays fixed; **`"0"` means no fixing at all** — always set it |
| `animfixtrgofst` | px, `"0"` | extra offset of the fixed position, positive — lower |

## 4. Step-by-step animation

Keys:

| Key | Value | Meaning |
|-----|-------|---------|
| `sbsevent` | `intoview`, `blockintoview`, `scroll`, `hover`, `click` | start: the element or the whole block comes into view, the page scrolls, hover, click. Top breakpoint only |
| `sbstrg` | `"0"`, `"0.5"`, `"1"` (default) | trigger line — window top / center / bottom; for `intoview`, `blockintoview`, `scroll`. Top breakpoint only |
| `sbstrgofst` | px, `"0"` | shift of the trigger line; positive moves it down, so the animation starts earlier |
| `sbsloop` | `""`, `loop`, `loopwithreverse`, `noreverse`, `once` | see below; not used with `scroll`. Top breakpoint only |
| `sbstrgels` | `elem_id` list, `"1791182208000000001,1791182208000000002"` | for `hover` and `click`: other elements (or physical groups) that start the animation; empty — the element itself |
| `sbsopts` | steps, see below | can have `-res-` versions |

`sbsloop`: `""` — hover plays back when the cursor leaves, click toggles forward and back; `loop` — repeats forever; `loopwithreverse` — repeats forward and back; `noreverse` — hover does not play back, every click plays from the start; `once` — one time, `hover` and `click` only.

### Steps (`sbsopts`)

`sbsopts` is a STRING with a JSON array in SINGLE quotes: `"[{'mx':0,'my':0,...},{...}]"`. Every step has all its keys:

| Key | Unit | Meaning |
|-----|------|---------|
| `mx`, `my` | px | offset from the element's own position (absolute, not from the previous step) |
| `sx`, `sy` | fraction, `1` = 100% | scale |
| `op` | 0–1 | opacity |
| `ro` | degrees | rotation |
| `ti` | ms | `intoview`, `blockintoview`, `hover`, `click`: duration of the move into this step |
| `dt` | ms | same events: pause before this step |
| `ea` | string | same events: easing into this step — `''` (linear), `'easeIn'`, `'easeOut'`, `'easeInOut'`, `'bounceFin'` or `'cubic-bezier(0.25, 1, 0.5, 1)'`; always a string, other names do not work |
| `di` | px of scroll | `scroll` only, instead of `ti`: how far the page scrolls during this step |
| `dd` | px of scroll | `scroll` only, instead of `dt`: scroll before this step |
| `fi` | `'fixed'` or `''` | `scroll` only, instead of `ea`: the element stays fixed in the window during this step |

- The first step is the start state and is always present: `{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'ti':0,'ea':'','dt':0}` (for `scroll`: `'di':0,'dd':0,'fi':''` instead of `ti`, `ea`, `dt`). Keep it like this.
- A different starting look (hidden, shifted): the second step with `ti` `0` (or `di` `0`) and the starting values. If that step has `op` `0`, the element is hidden until the animation starts.
- `scroll` steps follow each other: the first starts when the element's top crosses the trigger line, each next one starts where the previous one ended.

Appear from below on view (`"sbsevent": "intoview"`, `"sbstrg": "1"`):

```
[{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'ti':0,'ea':'','dt':0},{'mx':0,'my':100,'sx':1,'sy':1,'op':0,'ro':0,'ti':0,'ea':'','dt':0},{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'ti':800,'ea':'easeOut','dt':0}]
```

Grow on hover and back when the cursor leaves (`"sbsevent": "hover"`, `"sbsloop": ""`):

```
[{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'ti':0,'ea':'','dt':0},{'mx':0,'my':0,'sx':1.05,'sy':1.05,'op':1,'ro':0,'ti':300,'ea':'easeInOut','dt':0}]
```

Move right and rotate while the page scrolls 600 px (`"sbsevent": "scroll"`, `"sbstrg": "1"`):

```
[{'mx':0,'my':0,'sx':1,'sy':1,'op':1,'ro':0,'di':0,'dd':0,'fi':''},{'mx':300,'my':0,'sx':1,'sy':1,'op':1,'ro':45,'di':600,'dd':0,'fi':''}]
```

## 5. Before saving

- `animmobile` is set if the animation must play on tablets and phones.
- An element has either `animstyle` or `sbsevent`, not both; not `animprx` together with `animfix`.
- `animfixdist` is not `"0"` when `animfix` is set.
- `sbsopts` uses single quotes, starts with the start state and `ea` is a string in every step.

