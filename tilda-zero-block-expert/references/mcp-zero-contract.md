# Снимок контракта Tilda MCP — 09.10.2026

Источник: успешный read-only вызов `zero_block_instructions` в этой сессии. Это контракт доступного сервера, не доказательство всех UI-настроек. Перед записью повторно вызвать актуальный инструмент. Не переносить правила публикации/шрифтов/получателей за пределы авторизации пользователя. Для доступности использовать WCAG: CSS px и pt не взаимозаменяемы.

# Zero Block

A Zero Block (tplid 396) is an artboard with elements — texts, buttons, images, shapes, vectors, video, galleries, tooltips, forms, HTML — laid out separately for every breakpoint. The user edits it in the Zero editor. Through MCP the whole block is one JSON: read it with `get_zero_block`, write it back WHOLE with `update_zero_block`. These instructions describe that JSON.

Two tools extend these instructions — call them when the task needs them:
- `zero_block_animation_instructions` — appear effects, parallax, fixing, step-by-step animation, hover effects;
- `zero_block_forms_instructions` — the form element: field types, conditional fields, button, data receivers.

## Build from Zero elements

The block must be editable in the Zero editor element by element. Build every section from Zero elements — `text`, `button`, `image`, `shape`, `vector`, `video`, `gallery`, `form`, groups — never as page markup inside one `html` element: such a block cannot be edited in the editor, ignores breakpoints and project fonts, and is stripped on the free plan.

- Do not write an HTML page first. Plan the block right away as elements: for each part — which element, its place and size at every breakpoint (or its place in the autolayout flow).
- When the source is HTML (a file, a site, a design you thought of in HTML), translate it into elements:

| In HTML | In the Zero Block |
|---------|-------------------|
| heading, paragraph, label, list | `text`: `tag` `h1`–`h3` for headings; `<b>`, `<a>`, `<span style>` inside the text |
| link or button | `button`, or `text` with `link` |
| `<img>`, icon file | `image`, the file through `upload_image` |
| inline `<svg>` icon or logo | `vector` |
| coloured box, divider, circle, background picture | `shape`: `figure` `rectangle`, `line`, `circle`; `bgimg` |
| card, row or column of items, flex/grid container | physical group with `flex` `auto`: padding, gaps, background, radius |
| section laid out with flex | autolayout artboard (`ab_flex` `auto`) |
| `<video>`, YouTube or Vimeo embed | `video` |
| slider, carousel | `gallery` |
| `<form>` | `form` (`zero_block_forms_instructions`) |
| CSS animation, hover effect | `zero_block_animation_instructions` |
| `@media` rules | breakpoint keys `-res-<width>` |

- An `html` element only for what no element can do: a third-party widget or embed code, a script, a map. Only that piece, the rest of the block stays elements; say in the report which part is HTML and why.

## 1. Tools

- **New block.** `add_record` with `tplid=396` → `recordid`. The new block contains demo content of the editor ("Zero Block", a sample image, a yellow square): replace the elements with yours, keep its `ab_screens` and `meta`.
- **Change a block.** `get_zero_block` → change only what was asked, nothing next to it → `update_zero_block` with the WHOLE JSON. Keep every key you do not understand as is.
- `update_zero_block` answers `OK` or an error (`Error(ZRO-SZC-003): Too much data` — the JSON is over 250 KB). An empty JSON is refused: to remove a block use `delete_record`.
- Anchor for in-page links: `update_record` with `only_field="rec_anchor"`, `fields={}`, `rec_anchor="<slug>"`.
- Images, icons, fonts: only CDN URLs from `upload_image`.

## 2. Structure

```
{
  "ab_*": "…",            artboard keys (section 4)
  "0": {…}, "1": {…},     elements under numeric keys, any order (sections 6–7)
  "groups": [{…}, …],     groups of elements (section 8), optional
  "timestamp": "…",       time of the change in ms — set the current time
  "meta": {…}             service data — keep as it is
}
```

Elements are objects and `groups` is an array; every value inside them and every `ab_*` value is a string, numbers too (`"top": "120"`). A key with an empty value is the same as no key — except the breakpoint versions of `ab_height_vh`, `ab_bgcolor` and `ab_bgimg`, where `""` turns the setting off on that breakpoint.

Colours: `#rrggbb`, `rgba(r, g, b, a)` or a gradient `linear-gradient(90deg,rgba(255,0,0,1) 0%,rgba(0,0,255,1) 100%)` / `radial-gradient(circle at center,…)`. Gradients work in every background colour (`bgcolor`, `ab_bgcolor`, `bgcolorhover`) and in the text colour of texts and buttons.

## 3. Breakpoints

`ab_screens` lists the breakpoint widths of the block, ascending, comma-separated, without spaces: `"360,480,640,960,1200"`.

- The widest one is the design width: its values are the keys without a suffix (`width`), used from that width up, the grid is centred.
- Every other width `w` has keys `<key>-res-<w>` (`width-res-960`, `fontsize-res-360`), used from `w` up to the next width. The narrowest one also covers smaller windows.
- A key without its breakpoint version takes the value of the next wider breakpoint.
- **Use only the suffixes of this block's `ab_screens`.** A block created by the editor today has `"360,480,640,960,1200"`: its phone suffix is `-res-360`, a `-res-320` key is ignored. A block without `ab_screens` uses `320,480,640,960,1200` (`-res-320`). Keep `ab_screens` as it is; in a block without it write `"ab_screens": "320,480,640,960,1200"`.
- Own breakpoints are allowed: 2–10 widths between 320 and 2560, ascending; then the suffixes follow these widths.
- Never write `-res-` for the widest breakpoint.
- Breakpoint versions of artboard keys (height, padding, flex, background) are rendered only when the artboard has `ab_bgattachment` (`"scroll"`) or the breakpoint has its own `ab_height`: always set `ab_bgattachment: "scroll"` and `ab_height` for every breakpoint.
- Hide on a breakpoint: `"hidden-res-640": "y"` — hidden there and on every narrower breakpoint. Shown only on narrow screens: `"hidden": "y"` and `"hidden-res-640": "n"`; an empty value does not show it back — such an element is not rendered at all.
- One element for one thing: move and resize the same element with breakpoint keys instead of making a copy for phones. A copy only when the layout really differs, and then hide every copy where it is not used (`y` / `n` as above).

## 4. Artboard

### Two layout modes

| | Free | Autolayout |
|-|------|------------|
| Artboard | no `ab_flex` | `"ab_flex": "auto"` |
| Positions | every element has `top`/`left`/`width`/`height` per breakpoint, counted from the grid (section 5) | the artboard and groups are flex containers: children flow by `zindex` (section 9); `top`/`left` of the children are ignored, their size comes from `widthmode`/`heightmode` |
| Height | `ab_height` per breakpoint, or `"ab_heightmode": "hug"` | `"ab_heightmode": "hug"` — by content (`ab_height` stays as the fallback) |
| Between breakpoints | the layout of the lower breakpoint, centered — does not stretch | with `"ab_flexcontainer": "window"` the content spans the window minus `ab_padding` and stretches; without it — a grid of the breakpoint width, centered |
| Use for | posters, collages, overlapping elements | content that flows like a web page: text, cards, lists, rows of buttons |

In the free mode give `top`, `left`, `width` (and `height` where needed) for EVERY breakpoint, each fitted into that breakpoint's grid (as wide as the breakpoint). A breakpoint without its own values takes the layout of the wider one and spills over the edge. Overlaps and elements past the edge only as a planned part of the design — a word behind a photo, a sticker on a heading, a picture cut by the block edge — with a chosen `zindex` on every breakpoint. Never by accident: a text that is read (heading, paragraph, button caption) does not run into another text or a button because its lines wrap, nothing goes past the grid unplanned. A form outside the artboard at the current width is not rendered at all.

**Text in the free mode.** The height of a text depends on how its lines wrap, and the wrapping can not be measured from the JSON: a heading that takes one line more than expected covers the element under it. So:
- texts that go one under another (label, heading, paragraph, buttons) go into a physical group with `flex` `auto` and `flexdirection` `column` (or into an autolayout artboard): the flow moves the next element down by itself. Leave the free placement for decoration, pictures and intended overlaps;
- if a text stays free, count its height with a reserve on every breakpoint: one character is about `0.6 × fontsize` wide (`0.7` for bold, serif or uppercase); lines = characters × that ÷ `width`, rounded up, plus one; height = lines × `fontsize` × `lineheight`; the next element at least 24 px lower;
- the longest word must fit into `width` at its font size (characters × `0.7 × fontsize` ≤ `width`), otherwise it sticks out of the box: lower `fontsize-res-…` on narrow breakpoints.

### Keys

| Key | Value |
|-----|-------|
| `ab_height` | height in px, for every breakpoint |
| `ab_heightmode` | `hug` — height by content; free mode: the lowest element bottom plus the bottom value of `ab_padding` (`"0px 0px 40px 0px"`); elements with `excludefromautoheight` `y`, `axisy` center/bottom or `%` top/height are not counted |
| `ab_height_vh` | height in % of the window height (`100` — full screen); `ab_height` becomes the minimum; `""` on a breakpoint turns it off |
| `ab_valign` | `top`, `center`, `bottom`, `stretch` — where the grid (`ab_height` tall) sits inside a taller artboard; `stretch` — the grid takes the whole height |
| `ab_bgcolor` | background colour or gradient; `""` on a breakpoint — transparent |
| `ab_bgimg` | background image (CDN URL), always covers the block; `""` on a breakpoint — no image |
| `ab_bgposition` | `center center` and the other 8 combinations of `left`/`center`/`right` + `top`/`center`/`bottom`; `custom` + `ab_bgposition_imgpos` `"30%,50%"` |
| `ab_bgattachment` | `scroll` (always set it, section 3) or `fixed` — the image stays while the page scrolls (wide screens only) |
| `ab_filtercolor`, `ab_filteropacity` | overlay over the background image: `#rrggbb` (hex only) and 0–1 |
| `ab_filtercolor2`, `ab_filteropacity2` | second colour: with both colours the overlay is a gradient from top to bottom |
| `ab_ovrflw` | content outside the block: `""` — cut, `visible`, `auto` (scroll), `custom` + `ab_ovrflwx` / `ab_ovrflwy` |
| `ab_position` | `""`, `fixed` — the block stays on the screen (header), `absolute` — the block lies over the next one |
| `ab_posview` | for `fixed`: `""` — top of the window, `bottom` |
| `ab_postrgroffset` | for `fixed`: show the block after this many px of scroll |
| `ab_posfixappear` | appearing of the `fixed` block: `""`, `posfadein`, `fixslide` |
| `ab_posfixshift` | `y` — move the page content down so the `fixed` block does not cover it |
| `ab_poszindex` | z-index of the block (default 990 for `fixed`/`absolute`) |
| `ab_upscale` | `grid` (default) or `window` — scale the grid content with the window width between breakpoints |
| `ab_isolation` | `isolate` — own stacking context (for blend effects) |
| `ab_title` | name of the block in the editor |
| **Autolayout** | |
| `ab_flex` | `auto` (top breakpoint only) |
| `ab_flexdirection` | `column`, `row`, `wrap` (row with wrapping) |
| `ab_flexreverse` | `reverse` — reverse order |
| `ab_flexalignitems` | `flex-start`, `center`, `flex-end` |
| `ab_flexjustifycontent`, `ab_flexaligncontent` | `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly` |
| `ab_flexgapx`, `ab_flexgapy` | gaps, px number |
| `ab_padding` | `"140px 20px 140px 20px"` (top right bottom left) — with `px` in every value; set it for every breakpoint, the grid width changes with the breakpoint |
| `ab_flexcontainer` | `window` (stretches with the window) or absent (grid) |

**Every text must be readable on every breakpoint.** Contrast of a text to what is under it: body text at least 4.5:1, large text (18 px and more, or bold from 14 px) at least 3:1. Grey text on a coloured background looks washed out — take a darker shade of the background's own hue. Over a picture light text needs a darker layer under it: `ab_filtercolor` `#000000` with `ab_filteropacity` `0.3`–`0.6`, or a gradient to the side of the text (`ab_filtercolor2` with its own opacity), or a semi-transparent background of the group with the text. A text shadow (`shadow_text_*`) only adds to it, it does not replace it. On narrow breakpoints the picture is cropped differently and the text lands on another part of it — check there too.

## 5. Position and size

| Key | Value |
|-----|-------|
| `top`, `left`, `width`, `height` | numbers; their units — `topunits`, `leftunits`, `widthunits`, `heightunits`: `px` or `%` (`"width": "100", "widthunits": "%"`), never `"100%"` in the value |
| `container` | `grid` (default) — coordinates from the grid of the breakpoint; `window` — from the window edges and the full artboard height |
| `axisx` | `left` (default), `center`, `right` — the point `left` is counted from: `center` — the element centre from the container centre, `right` — the right edge from the right edge (`left` usually ≤ 0) |
| `axisy` | `top` (default), `center`, `bottom` — the same for `top` |
| `widthmode`, `heightmode` | `fixed` (`width`/`height`), `hug` (by content), `fill` (fills the parent, autolayout only) |
| `excludefromautoheight` | `y` — not counted in the hug height of the artboard |
| `zindex` | unique integer: layer order and order in the flow (section 9) |

`%` sizes and positions: of the grid (or the window with `container` `window`). `%` is not allowed inside physical groups and for `left`/`top` inside autolayout; `%` height works for shapes, video, HTML, galleries and texts or buttons with `textfit` `fixedsize`.

## 6. Elements: common keys

| Key | Value |
|-----|-------|
| `elem_id` | unique id within the block, made as the Zero editor makes it: the current time in milliseconds (13 digits) + a 6-digit counter from `000001` — `1791182208000000001`, `1791182208000000002`… Exactly 19 digits: a longer number overflows a 64-bit integer and the layout collapses. Groups take ids from the same sequence |
| `elem_type` | `text`, `button`, `image`, `shape`, `vector`, `video`, `gallery`, `tooltip`, `html`, `form` (section 7) |
| `groupid` | id of the group the element belongs to (section 8) |
| `layer` | name in the editor's layer list |
| `hidden` | `y` / `n` (section 3) |
| `bgcolor` | background colour or gradient |
| `borderwidth` | `"1px 1px 1px 1px"` (top right bottom left) |
| `bordercolor`, `borderstyle` | colour (gradient — buttons only); `solid`, `dashed`, `dotted`, `none` |
| `borderradius` | `"12px 12px 12px 12px"` (top-left top-right bottom-right bottom-left) — always four values with `px` |
| `shadows` | CSS box-shadow, layers comma-separated: `"0px 8px 24px 0px rgba(0,0,0,0.1)"` |
| `shadowshover`, `shadowshoverspeed` | shadow on hover; transition in seconds `"0.3"` |
| `opacity` | 0–1 (not for HTML and forms) |
| `rotate` | degrees (not for HTML, forms and tooltips) |
| `fliphorizontal`, `flipvertical` | `y` — mirror |
| `effects` | one CSS filter WITH the trailing `;`: `"filter: blur(5px);"`, `"filter: grayscale(100%);"`, `"backdrop-filter: blur(16px);"` (frosted glass, needs a semi-transparent `bgcolor`; not for texts); functions: `blur` px, `brightness`/`contrast`/`saturate`/`grayscale`/`invert`/`sepia` %, `hue-rotate` deg |
| `link` | URL, `/page`, `#anchor`, `#popup:name`, `tel:…`, `mailto:…` or `#order:Name=Price` (puts a product into the cart, `Price` digits only); never `javascript:` |
| `linktarget`, `relnofollow` | `_blank`; `nofollow` |
| `buttonstat` | `buttonstatsend` — send clicks to analytics (button, image, shape) |
| `pevent` | `none` — the element ignores the cursor (and its link) |
| `classname` | CSS classes, space-separated, up to 5 |
| `attributes` | own data attributes: `"name=value&amp;other=value"` → `data-name="value"`; names `[a-z0-9-]` without `data-` |
| `colorhover`, `bgcolorhover`, `bordercolorhover`, `speedhover` | colours on hover (text, button); transition in seconds `"0.2"` |

`typo_styleid` and `button_styleid` bind an element to a global style of the project, and its fields then hold `var(--uc-…, <value>)`. Do not add them; in an existing element keep them and the `var(...)` values as they are.

Keys of the editor itself — `lock`, `amazonsrc`, `uploaderror`, `ab_grid`, `ab_gridcolor`, `ab_gridopacity`, `ab_gridlineopacity`, `ab_gridglobal`, `*variationweight` — do not write them, keep them in an existing block. Keys `fe-*`, `organism-role` and `hidden-conditions` belong to Feeds templates: keep them as they are, do not add them.

Animation keys (`anim…`, `sbs…`) — see `zero_block_animation_instructions`.

## 7. Element types

### Text (`text`)

| Key | Value |
|-----|-------|
| `text` | HTML: `<br>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<s>`, `<sub>`, `<sup>`, `<a href="…">`, `<span style="color:…; font-weight:…; font-size:…px">`, lists `<ul><li>`; no `<p>` — lines with `<br>`; non-breaking space `#nbsp;`; escape `&`, `<`, `>` in plain text |
| `tag` | `h1`, `h2`, `h3` or absent (div) |
| `textfit` | `autoheight` (default; width fixed, height by the text), `autowidth` (one line, width by the text), `singleline` (one line in a fixed width, the rest cut with "…"), `fixedsize` (`width` and `height` fixed) |
| `valign` | `top`, `middle`, `bottom` — only with `fixedsize` |
| `padding` | `"10px 20px 10px 20px"` — inside the text box (with `bgcolor`, borders) |
| `align` | `left`, `center`, `right` |
| `fontfamily`, `fontsize`, `fontweight` | section 10; size px; weight `100`–`900` (a variable font takes any number 100–1000) |
| `color` | colour or gradient |
| `lineheight` | ratio `"1.4"`; with `lineheightunits` `px` — pixels |
| `letterspacing` | px, may be negative |
| `lettercase` | `uppercase`, `lowercase`, `capitalize` |
| `shadow_text_x`, `shadow_text_y`, `shadow_text_blur` | text shadow, px |
| `shadow_text_color`, `shadow_text_opacity` | `"0,0,0"` — R,G,B without `#`; opacity 0–100 |
| `stroke_text_color`, `stroke_text_width` | outline of letters: colour; px |
| `truncate_type`, `truncate_value` | cut long text: `lines` + number of lines, or `chars` + number of characters |

A text with its own `link` must not contain `<a>`: the editor then removes all formatting of the text.

### Button (`button`)

| Key | Value |
|-----|-------|
| `caption` | plain text, no HTML |
| `textfit` | `fixedsize` (default) — `width` × `height`; `autowidth` — width by the caption; `singleline` — one line in a fixed width |
| `align` | `center` — otherwise the caption sticks to the left |
| `padding` | inside the button |
| typography | `fontfamily`, `fontsize`, `fontweight`, `color` (gradient allowed), `lineheight`, `letterspacing`, `lettercase` |
| `bgcolor`, borders, `shadows`, hover colours | section 6 |
| `btn_icon`, `btn_iconhover` | icon URL; built-in: `https://static.tildacdn.com/lib/icons/button/<name>_<weight>.svg`, names `arw_right`, `arw_left`, `arw_upright`, `arw_downright`, `chevron_right`, `widearw_right`, `shortarw_up`, `circlearw_upleft`, `check`, `cross`, `plus`, `burger`, `download`, `play`, `star`, `heart`, weights `light`, `regular`, `semibold`, `bold`; it takes the text colour |
| `btn_iconposition`, `btn_iconsize`, `btn_iconmargin` | `left` / `right`; px; gap px |
| `btn_iconanimation` | on hover: `rotate15`, `rotate360`, `scale`, `scaleX`, `scaleY`, `moveX`, `moveY`, `opacity50`, `opacity100` |
| `btn_effect` | attention effect: `st1` (flash), `st2` (ripple), `st3` (light) |

### Image (`image`)

| Key | Value |
|-----|-------|
| `img` | only a URL returned by `upload_image` (a link from the user goes there as `image_url` first). An icon is an image too: an SVG uploaded with `upload_image` |
| `filewidth`, `fileheight` | natural size of the file in px — always set both |
| `imagefit` | `auto` (proportional, height from the file), `cover` (crop to `width`×`height`), `contain`, `fill`, `scale-down`, `none`; not `auto` — set `"heightmode": "fixed"` and `height` |
| `imageposition` | `center center` and the other 8 combinations; `custom` (with `cover`) — own crop: `imageposition_imgpos` `"30%,20%"` (point of the image in the box) and `imageposition_imgsize` `"160%,213%"` (image size in % of the box, only the first number is used) |
| `alt` | alternative text |
| `zoomable` | `y` — opens full size on click |
| `lazyoff` | `y` — load at once, without lazy loading; `n` — lazy loading without the blurred preview |
| `bgcolor`, `borderradius`, borders, `shadows`, `effects`, `link` | section 6 |

### Shape (`shape`)

| Key | Value |
|-----|-------|
| `figure` | `rectangle`, `circle`, `line`; a circle also needs `borderradius: "3000px 3000px 3000px 3000px"` and equal `width` and `height`, otherwise it is drawn as a square |
| `bgcolor`, `bgimg` | fill colour or gradient; image (CDN URL), covers the shape |
| `bgposition`, `bgattachment` | as for the artboard; `custom` + `bgposition_imgpos` `"30%,50%"` and `bgposition_imgsize` `"150%,150%"` (background size, the first number is used) |
| `alt` | description of the image in `bgimg` |
| borders, `shadows`, `effects`, `link`, `zoomable` | section 6 |

### Vector (`vector`)

| Key | Value |
|-----|-------|
| `vectorsvg` | SVG markup with `viewBox` and without `width`/`height`: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" role="img" aria-label="Star">…</svg>` — this is what the page shows |
| `vectorjson` | `""` — the editor's own path format; leave empty for an SVG you give. When you change `vectorsvg` of an existing vector, set `vectorjson` to `""`, otherwise the editor brings the old drawing back |
| `filewidth`, `fileheight` | size of the `viewBox` |
| `width` | size on the artboard; height follows the `viewBox` (`"heightmode": "hug"`) |

An SVG over 15 KB (an illustration) is better uploaded with `upload_image` and placed as an `image`.

### Video (`video`)

Set `vidtype` and ONLY its source key:

| `vidtype` | Source key | Value |
|-----------|-----------|-------|
| `y` | `youtubeid` | the video id (`dQw4w9WgXcQ`), not the link |
| `v` | `vimeoid` (+ `vimeohash` for private) | digits |
| `vk` | `vkvideoid` | `oid_id`: `-22822305_456242116` |
| `rt` | `rutubeid` | id |
| `k` | `kinescopeid` | id |
| `html` | `mp4video` | URL of an `.mp4` file |
| `w` | `webmvideo` | URL of a `.webm` file |
| `i` | `iframevideo` | `src` of an embed iframe |

Options: `autoplay`, `mute`, `loop` — `y` (with `autoplay` set `mute` too, browsers block sound); `showinfo` `y` — Vimeo title and author; `startsec`, `endsec` — seconds; for files `mp4controls` `hidden` — no controls, `objectfitvideo` `cover` — fill the box. Cover: `bgimg` (CDN URL), play icon `playiconsize` px, `playiconcolor`.

### Gallery (`gallery`)

`imgs` is a STRING with a JSON array of slides:

```json
"imgs": "[{\"lid\":\"1791182208000000101\",\"li_img\":\"https://static.tildacdn.com/…/1.jpg\",\"li_imgalt\":\"\",\"li_imgtitle\":\"Caption\",\"li_imgurl\":\"\"},{\"lid\":\"1791182208000000102\",\"li_img\":\"https://static.tildacdn.com/…/2.jpg\",\"li_youtube\":\"dQw4w9WgXcQ\"}]"
```

Slide keys: `lid` (unique), `li_img` (CDN URL; for a video slide — its poster), `li_imgalt`, `li_imgtitle` (caption), `li_imgurl` (link), `li_imgtarget` / `li_imgnofollow` (`true`), one video key — `li_youtube`, `li_vimeo` (+ `li_hash`), `li_rutube`, `li_vkvideo`, `li_kinescope`, `li_mp4`, `li_webm`, `li_iframe`.

| Key | Value |
|-----|-------|
| `slds_stretch` | `cover`, `contain` |
| `slds_imgposition` | `center center` and others; `custom` + `slds_imgposition_imgpos`, `slds_imgposition_imgsize` (as for the shape) |
| `slds_loop` | `loop`, `none` |
| `slds_speed` | `none`, `slow`, `fast` |
| `slds_autoplay` | seconds between slides, `0` — off |
| `slds_arrowcontrols` | `none`, `near`, `in`, `above`, `under` |
| `slds_arrowtype`, `slds_arrowsize`, `slds_arrowlinesize`, `slds_arrowborder` | `1` triangle / `2` arrow; `s`, `m`, `l`, `xl`; 1–6; `none` / `border` |
| `slds_arrowcolor`, `slds_arrowbgcolor`, `slds_arrowbgopacity`, `slds_arrowcolorhover`, `slds_arrowbgcolorhover`, `slds_arrowbgopacityhover` | arrows; opacity 0–1 |
| `slds_arrowalign`, `slds_arrowhmargin`, `slds_arrowvmargin`, `slds_arrowbetweenmargin` | arrow position, px |
| `slds_dotscontrols`, `slds_dotssize`, `slds_dotsbgcolor`, `slds_dotsbgcoloractive`, `slds_dotsvmargin`, `slds_dotshmargin` | dots: `none`, `near`, `in`; px; colours |
| `slds_captionwidth`, `slds_captiontopmargin` | caption width 50–100 %; gap px |
| `slds_playiconsize`, `slds_playiconcolor` | play icon of video slides |
| caption text | `align`, `fontfamily`, `fontsize`, `fontweight`, `color`, `lineheight`, `letterspacing`, `lettercase` |
| `zoomable`, `lazyoff`, borders, `borderradius`, `shadows` | section 6, image |

### Tooltip (`tooltip`)

A round pin (`width` = `height`, about `25`) that opens a popup.

| Key | Value |
|-----|-------|
| `tipcaption` | popup content, HTML as in `text` |
| `tipimg` | image at the top of the popup (CDN URL) |
| `tipopen` | `""` — on hover, `click` (phones always open on click) |
| `tipposition` | `top` (default), `bottom`, `left`, `right`; turns by itself at the window edges |
| `tipwidth`, `tipbgcolor`, `tipradius`, `tipshadowblur` | popup: 200–320 px; colour; px; px |
| `fontfamily`, `fontsize`, `fontweight`, `lineheight`, `color`, `align`, `letterspacing`, `lettercase` | popup text |
| `pinicon` | `""` (plain circle), `info`, `qst`, `plus`, `star`, `camera`; `img` — the pin is the `bgimg` image |
| `pincolor`, `bgcolor` | icon colour, pin colour |
| `borderwidth`, `bordercolor`, `shadows` | pin border and shadow |

### HTML (`html`)

`code` — any HTML, CSS and JS, inserted as is; the box keeps its `width` and `height`, the content does not grow it. Stripped on the free plan. Use it only for what the elements above cannot do (section "Build from Zero elements").

### Form (`form`)

See `zero_block_forms_instructions`.

## 8. Groups

`groups` is a list. An element belongs to a group by its `groupid`; a group belongs to another group by its own `groupid` (up to 6 levels).

| Key | Value |
|-----|-------|
| `id` | unique id, the same 19-digit format and sequence as `elem_id` (section 6) |
| `name` | name in the editor |
| `type` | `physical` — a real container (its own box, background, flex); without `type` or `logical` — only a selection in the editor, its elements are drawn on the artboard |
| `groupid` | parent group |
| `top`, `left`, `width`, `height`, `widthmode`, `heightmode`, `zindex`, `margin`, `hidden`, `container` | as for elements, units px |
| `tag` | `section`, `header`, `footer`, `article`, `aside`, `main`, `nav` — HTML tag of the container |
| `flex` | `auto` — the group is a flex container for its children |
| `flexdirection`, `flexreverse`, `flexalignitems`, `flexjustifycontent`, `flexaligncontent`, `flexgapx`, `flexgapy` | as `ab_flex*` of the artboard |
| `padding` | `"32px 32px 32px 32px"` |
| `overflow` | x and y: `visible`, `hidden`, `scroll`, `auto` — `"hidden hidden"`, `"hidden auto"`; `visible` only on both axes |
| `bgcolor`, `bgimg`, `borderradius`, `borderwidth`, `bordercolor`, `shadows`, `opacity`, `effects`, `link` | look of the container (cards); a group with `link` is clickable as a whole — then no links inside it |

- `top`/`left` of the children of a physical group are counted from the artboard grid, as the group's own `top`/`left`, not from the group corner.
- Hiding a logical group does not hide its elements on the page: hide the elements themselves or use a physical group.
- Logical groups only in the free artboard; inside a physical group or an autolayout artboard groups are physical.

### Children of an autolayout container

An autolayout container is the artboard with `ab_flex` `auto` or a physical group with `flex` `auto`. Its children:

| Key | Value |
|-----|-------|
| `widthmode`, `heightmode` | `fixed`, `hug`, `fill` |
| `margin` | `"0px 0px 15px 0px"` — outer margin in the flow |
| `flexalignself` | `flex-start`, `center`, `flex-end` — own alignment |
| `flexorder` | `-1` — first, `1` — last, any integer |
| `flexgrow`, `flexshrink` | numbers |
| `flexbasis` | `content`, `%` or `px` + the number in `flexbasisvalue` |
| `absolute` | `y` — out of the flow, placed by `top`/`left` like in the free mode |

## 9. Order

- Layers: larger `zindex` is on top.
- Flow (autolayout artboard and groups with `flex: auto`): children go in DESCENDING `zindex` — the first child in the flow has the largest `zindex` among its siblings. A group takes its place among its siblings by its own `zindex`.

## 10. Fonts

`fontfamily` is a font name; the font must be loaded on the page. Fonts of the project (site settings) are loaded on every page: connect the font there with `save_project_fonts` and use it in `fontfamily` — `"var(--t-headline-font,Arial)"` for the headline font, `"var(--t-text-font,Arial)"` for the text font, or its name. Project fonts apply to the whole site — on a project that already has other pages ask the user before changing them. Only a font that can not be a project font goes into the block: one `html` element with the `<link>` of the font (1×1 px at 0,0; in autolayout give it the smallest `zindex` so it goes last in the flow) in every Zero Block that uses it.

## 11. Example: autolayout section

A heading and a row of two buttons; on phones the buttons go into a column. The content stretches with the window.

```json
{
  "ab_flex": "auto", "ab_flexcontainer": "window", "ab_heightmode": "hug",
  "ab_flexdirection": "column", "ab_flexalignitems": "flex-start", "ab_flexjustifycontent": "flex-start", "ab_flexgapy": "24",
  "ab_padding": "100px 20px 100px 20px", "ab_padding-res-960": "100px 20px 100px 20px", "ab_padding-res-640": "80px 20px 80px 20px",
  "ab_padding-res-480": "60px 20px 60px 20px", "ab_padding-res-360": "60px 20px 60px 20px",
  "ab_height": "400", "ab_height-res-960": "400", "ab_height-res-640": "400", "ab_height-res-480": "400", "ab_height-res-360": "400",
  "ab_bgcolor": "#111827", "ab_bgattachment": "scroll", "ab_screens": "360,480,640,960,1200",
  "timestamp": "1791182208000",
  "0": {"elem_id": "1791182208000000001", "elem_type": "text", "zindex": "3", "tag": "h2",
        "widthmode": "fill", "heightmode": "hug", "textfit": "autoheight", "top": "100", "left": "20", "width": "1160", "height": "55",
        "text": "Start your free trial", "fontfamily": "Arial", "fontsize": "48", "fontsize-res-480": "32", "fontweight": "700",
        "lineheight": "1.15", "color": "#ffffff", "align": "left",
        "leftunits": "px", "topunits": "px", "widthunits": "px", "heightunits": "px"},
  "1": {"elem_id": "1791182208000000002", "elem_type": "button", "zindex": "2", "groupid": "1791182208000000004",
        "widthmode": "fixed", "heightmode": "fixed", "top": "180", "left": "20", "width": "200", "height": "56",
        "caption": "See pricing", "link": "#pricing", "fontfamily": "Arial", "fontsize": "16", "fontweight": "600",
        "color": "#111827", "bgcolor": "#3b82f6", "align": "center", "borderradius": "30px 30px 30px 30px",
        "leftunits": "px", "topunits": "px", "widthunits": "px", "heightunits": "px"},
  "2": {"elem_id": "1791182208000000003", "elem_type": "button", "zindex": "1", "groupid": "1791182208000000004",
        "widthmode": "fixed", "heightmode": "fixed", "top": "180", "left": "236", "width": "240", "height": "56",
        "caption": "Contact us", "link": "#contact", "fontfamily": "Arial", "fontsize": "16", "fontweight": "600",
        "color": "#ffffff", "bgcolor": "transparent", "bordercolor": "#ffffff", "borderwidth": "1px 1px 1px 1px",
        "align": "center", "borderradius": "30px 30px 30px 30px",
        "leftunits": "px", "topunits": "px", "widthunits": "px", "heightunits": "px"},
  "groups": [{"id": "1791182208000000004", "name": "Buttons", "type": "physical", "flex": "auto", "zindex": "2",
              "flexdirection": "row", "flexdirection-res-480": "column", "flexgapx": "16", "flexgapy": "12",
              "flexalignitems": "center", "flexjustifycontent": "flex-start", "padding": "0px 0px 0px 0px",
              "widthmode": "hug", "heightmode": "hug", "top": "180", "left": "20", "width": "456", "height": "56",
              "leftunits": "px", "topunits": "px"}]
}
```

Flow order: the heading (`zindex` 3), then the group (2); inside the group the first button (2), then the second (1).

## 12. Check yourself

Always check your JSON and the result: `get_record_html` returns the block with the unpublished changes together with its `css` and `js` — look at it at the width of every breakpoint. No accidental overlaps that the design did not plan: a text does not cover another text or a button, no word sticks out of its text box. Every text is readable against what is under it, a picture too, on every breakpoint.

## 13. Do not

- write a part of the JSON: `update_zero_block` replaces the whole block;
- put a section's markup into an `html` element instead of building it from elements;
- invent keys or element types that are not in these instructions and their extensions;
- use breakpoint suffixes that are not in `ab_screens`;
- use images from other sites or `localhost` — only CDN URLs from `upload_image`;
- invent content the user did not give — addresses, phones, prices, names: ask, or put an obvious placeholder and say so in the report.

