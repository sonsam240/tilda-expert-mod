# Снимок контракта Tilda MCP — 09.10.2026

Источник: успешный read-only вызов `zero_block_forms_instructions` в этой сессии. Это контракт доступного сервера, не доказательство всех UI-настроек. Перед записью повторно вызвать актуальный инструмент. Не переносить правила публикации/шрифтов/получателей за пределы авторизации пользователя. Для доступности использовать WCAG: CSS px и pt не взаимозаменяемы.

# Zero Block: form

Extends `zero_block_instructions`: the JSON format, breakpoints and ids are described there. Here — the element `"elem_type": "form"`.

The form draws its fields itself from `inputs`; its height follows the fields (`"heightmode": "hug"`, set `width` only). Submissions go to the data receivers chosen in `receivers`.

## 1. Version

- Set `"version": "2"` on the form.
- The published page takes the form version from the block: `meta.migrations.elements.form` must be `2`. A block created by the editor today has it — keep `meta` as is. If the block has no `meta`, add `"meta": {"migrations": {"elements": {"form": 2}}}`; without it checkbox labels and the upload button take the title and submit button styles.

## 2. Fields (`inputs`)

`inputs` is a STRING with a JSON array of fields. Fields are shown in the array order. The string must be valid JSON — a broken `inputs` breaks the scripts of the whole page.

Keys of every field:

| Key | Value |
|-----|-------|
| `lid` | unique string of digits within the form (13 digits, like the current time in ms) |
| `ls` | order: `"10"`, `"20"`, `"30"`… |
| `loff` | `""`; `"y"` — the field is off and not shown |
| `li_type` | field type, table below |
| `li_nm` | name of the field in the submission — **required for every field that sends data, unique within the form** (`"Name"`, `"Phone"`, `"company"`); without it the value is sent with an empty name |
| `li_name` | variable name typed by the user in the editor; write the same value as `li_nm` |
| `li_title` | title above the field |
| `li_subtitle` | small description under the title |
| `li_ph` | placeholder |
| `li_req` | `"y"` — required |
| `li_inputinrow` | `"y"` — put this field in one row with the next one (vertical form only) |
| `li_inputwidth` | width in the row: `"1"`, `"1_2"`, `"1_3"`, `"1_4"` |
| `li_conditionals` | show or hide the field by other fields, section 3 |

Write a key only when it has a value; flags are `"y"` or absent. Titles, placeholders and names are plain text, without HTML and double quotes.

### Field types

| Type | `li_type` | Own keys |
|------|-----------|----------|
| Name | `nm` | — |
| Email | `em` | — |
| Phone | `ph` | `li_masktype`: `"a"` — mask by the visitor's country with a country selector, `li_maskcountry` — starting country (`"RU"`); `""` — own mask in `li_mask` (`"+7 (999) 999-99-99"`: `9` digit, `a` letter, `*` any) |
| One line | `in` | `li_rule`: `""`, `email`, `phone`, `name`, `url`, `number`; `li_mask` |
| Text area | `ta` | `li_rows`: `"1"`–`"10"` |
| Drop-down | `sb` | `li_variants`: options, one per line (`"S\nM\nL"`); `li_selfirstvar`: text of an empty first option; `li_defselitem`: number of the default option, from 1 |
| Choices | `rd` | `li_variants`, `li_defselitem`; `li_radcb`: `"rb"` — one choice, `"cb"` — several; `li_isownvariant` `"y"` + `li_ownvariant` (its title) — "own answer"; `li_radioposition`: `""` (column), `"hor"`, `"1_2"`, `"1_3"`, `"1_4"` (in columns) |
| Image choices | `ri` | `li_gallery`: a real array (not a string) `[{"img": "<CDN URL>", "alt": "Loft"}]` — `alt` is the caption and the sent value; `li_radcb`, `li_defselitem`; `li_imgratio`: `1_1`, `4_3`, `3_2`, `2_3`, `3_4`; `li_img_fill_mode`: `cover`, `contain`; `li_imgs_in_row`: `2`–`5`; `li_imgs_in_row_mob`: `1`–`3` |
| Checkbox | `cb` | `li_label`: text next to the box, HTML with links allowed (consent); `li_checked` `"y"` — checked; `li_belowsubmit` `"y"` — under the button |
| Date | `da` | `li_dateformat`: `DD-MM-YYYY`, `MM-DD-YYYY`, `YYYY-MM-DD`; `li_datediv`: `dot`, `dash`, `slash`; `li_datemask` — REQUIRED, the format with the separator and 9 for every letter: `"99.99.9999"`; days off: `li_dateUnavailPast`, `li_dateUnavailFuture`, `li_dateUnavailToday`, `li_dateUnavailMo` … `li_dateUnavailSu` — `"y"` |
| Time | `tm` | — |
| Quantity (+/−) | `qn` | `li_value`: start value |
| Range | `rg` | `li_vmin`, `li_vmax`, `li_step`, `li_value` (defaults 0, 10, 1) |
| URL | `ur` | — |
| File | `uw` | `li_uwkey` — the key of the project upload widget (site settings); without it the field does not work, ask the user; `li_multiupl` `"y"` — several files |
| Hidden | `hd` | `li_value`: the sent value |
| Calculator | `fr` | `li_expr`: arithmetic over the `li_nm` of other fields (`"price*quantity"`); `li_prefix`, `li_postfix`; options with prices: write variants of `sb`/`rd` as `"Small=100"` |
| Text | `tx` | `li_text`: HTML text between fields; no `li_nm` |
| Space | `ws` | `li_rows`: height in rows of 34 px; no `li_nm` |

```json
"inputs": "[{\"lid\":\"1790000000001\",\"ls\":\"10\",\"li_type\":\"nm\",\"li_nm\":\"Name\",\"li_title\":\"Your name\",\"li_req\":\"y\"},{\"lid\":\"1790000000002\",\"ls\":\"20\",\"li_type\":\"ph\",\"li_nm\":\"Phone\",\"li_title\":\"Phone\",\"li_masktype\":\"a\",\"li_maskcountry\":\"RU\",\"li_req\":\"y\"},{\"lid\":\"1790000000003\",\"ls\":\"30\",\"li_type\":\"sb\",\"li_nm\":\"Guests\",\"li_title\":\"Guests\",\"li_variants\":\"2\\n3\\n4\\n5-8\"},{\"lid\":\"1790000000004\",\"ls\":\"40\",\"li_type\":\"cb\",\"li_nm\":\"Agreement\",\"li_label\":\"I agree with the <a href='/privacy'>privacy policy</a>\",\"li_req\":\"y\"}]"
```

## 3. Conditional fields

`li_conditionals` is a STRING with JSON:

```json
{"action":"show","conditionsCombination":"all","conditions":[{"fieldId":"1790000000003","fieldType":"sb","condition":{"value":"5-8","comparisonType":""},"disabled":false}]}
```

- `action`: `show` / `hide` the field when the conditions are met; `conditionsCombination`: `all` / `any`.
- `fieldId` — `lid` of the other field, `fieldType` — its `li_type`.
- `comparisonType`: drop-down, choices, image choices — `""` with `value` = the option text; text fields — `txt-equals`, `txt-not_equals`, `txt-includes`, `txt-excludes`, `txt_st-filled_in`, `txt_st-not_filled_in`; numbers (`qn`, `rg`, `fr`) — `num-equals`, `num-not_equals`, `num-greater`, `num-less`, `num-greater_equal`, `num-less_equal`; checkbox — `cbox_st-filled_in`, `cbox_st-not_filled_in`; date and time — `date-equals`, `date-less`, `date-greater` (`time-…` the same); file — `file_st-uploaded`, `file_st-not_uploaded`.
- Up to 50 conditions.

## 4. Look of the form

| Key | Value |
|-----|-------|
| `inputpos` | `v` — fields in a column, `h` — fields and the button in one row (`inputmargright` is the gap) |
| `inputsstyle` | `"y"` — only the bottom border of the fields |
| `inputsstyle2` | `"y"` — the placeholder becomes a label above the text after a click |
| `inputheight`, `inputmargbottom`, `inputmargright` | field height, gap under a field, gap between fields in a row, px |
| `inputbgcolor`, `inputbordercolor`, `inputbordersize`, `inputradius` | fields |
| `inputcolor` | text in the fields; the placeholder is the same colour at half opacity |
| `fieldfontfamily` | font of the text in the fields (`""` — inherit) |
| `inputfontfamily`, `inputfontsize`, `inputfontweight` | text of the fields; `inputfontfamily` is also the font of the titles |
| `inputtitlecolor`, `inputtitlefontsize`, `inputtitlefontweight`, `inputtitlemargbottom` | titles |
| `togglefontfamily`, `togglelabelcolor` | labels of checkboxes and choices |
| `inputelscolor`, `inputelsfontsize`, `inputelsfontweight` | checkbox and choice marks, select arrow, range handle, +/− buttons |
| `togglesize`, `togglebordersize`, `checkboxborderradius` | size, border and corner radius of checkboxes and choices, px |
| `uploadbuttonbgcolor`, `uploadbuttontextcolor`, `uploadbuttonbordercolor`, `uploadbuttonbordersize` | file upload button |

Font weights are `100`–`900`. Fonts — as for text (`zero_block`, section Fonts).

Button:

| Key | Value |
|-----|-------|
| `buttontitle` | caption |
| `buttonwidth`, `buttonheight`, `buttonradius`, `buttonmargtop`, `buttonbordersize`, `buttonfontsize`, `buttonfontweight`, `buttonfontfamily` | px / font; `buttonwidth` wide enough for the caption |
| `buttonwidthstretch` | `"y"` — full width of the form (vertical form only) |
| `buttonalign` | `""` (left), `center` |
| `buttoncolor`, `buttonbgcolor`, `buttonbordercolor` | colours; background may be `linear-gradient(...)` |
| `buttonhovercolor`, `buttonhoverbgcolor`, `buttonhoverbordercolor` | on hover |
| `form_btn_icon`, `form_btn_iconhover` | icon URL |
| `form_btn_iconposition` | `left` / `right`; `form_btn_iconsize`, `form_btn_iconmargin` — px |
| `form_btn_iconanimation` | `rotate15`, `rotate360`, `scale`, `scaleX`, `scaleY`, `moveX`, `moveY`, `opacity50`, `opacity100` |
| `form_btn_shadow_x`, `form_btn_shadow_y`, `form_btn_shadow_blur`, `form_btn_shadow_spread` | px |
| `form_btn_shadow_color` | `"0, 0, 0"` — R, G, B, not hex |
| `form_btn_shadow_opacity` | 0–100 |
| `form_btn_hover_shadow_…` | the same on hover, plus `form_btn_hover_shadow_duration` in seconds |

Messages:

| Key | Value |
|-----|-------|
| `formname` | name of the form in the submissions |
| `formmsgsuccess` | text after a successful submit (otherwise the platform text) |
| `formmsgurl` | redirect after a successful submit |
| `formerrreq`, `formerremail`, `formerrphone`, `formerrname` | own error texts |
| `formbottomtext` | text under the button |

Sizes, `inputpos`, font sizes and button keys can have `-res-` versions.

## 5. Data receivers

| Key | Value |
|-----|-------|
| `receivers` | `hash` of the receivers from `get_form_integrations`, comma-separated without spaces: only receivers with `statusid` `1` (active). In an existing form keep the value from `get_zero_block` unless the user asks to change the receivers |
| `receivers_names` | their `name`, comma-separated, in the same order as `receivers` |

New form: call `get_form_integrations` for the project and put all its active receivers into the form, unless the user named specific ones. Hashes come only from `get_form_integrations` of this project: never invent one and never copy one from another site or block — it belongs to another project. If the project has no active receivers, leave `receivers` empty and tell the user in the report: submissions are not delivered until a data receiver is connected in the site settings (section Forms) and selected in the form settings in the Zero editor.

## 6. Before saving

- `version` `"2"`, `meta.migrations.elements.form` is `2`.
- `inputs` is a valid JSON string; every data field has a unique `li_nm`; `lid` are unique.
- Date fields have `li_datemask`, file fields have `li_uwkey`.
- `receivers` — only hashes from `get_form_integrations` of this project.

