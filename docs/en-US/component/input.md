---
title: Input
lang: en-US
---

# Input

## Demo

Status inputs support `input-type="error" | "warning" | "info"`. When `input-type` is `info`, you can use `info-tip` to render a built-in tooltip icon in the suffix area. Tooltip priority is `error` first, then the overflowing input text, and finally the built-in `info-tip` icon tooltip. When `input-type` is `error` and the value is empty, clicking the input shows an error tooltip. The tooltip content comes from `info-tip`, and defaults to `Required`.

:::demo

input/beyond

:::

## Formatter

Display value within it's situation with `formatter`, and we usually use `parser` at the same time.

:::demo

input/formatter

:::

## Autocomplete Status And Validation

Autocomplete inherits the built-in input status styles and tooltip validation behavior. Use `input-type="error" | "warning" | "info"` for status states. When `input-type` is `info`, `info-tip` renders the built-in tooltip icon. Tooltip priority is `error` first, then overflowing input text, and finally the built-in `info-tip` icon tooltip. When `input-type` is `error` and the value is empty, clicking the input shows an error tooltip. The tooltip content comes from `info-tip`, and defaults to `Required`.

:::demo

input/status-autocomplete

:::

## API

### Attributes

| Name                          | Description                                                                                                                                             | Type                                                                                                                               | Default     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| type                          | type of input                                                                                                                                           | ^[string]`'text' \| 'textarea' \| 'password' \| 'button' \| 'checkbox' \| 'file' \| 'number' \| 'radio' \| ...` native input types | text        |
| input-type                    | visual status style of input                                                                                                                            | ^[enum]`'error' \| 'info' \| 'warning'`                                                                                            | —           |
| info-tip                      | tooltip content shown by the built-in info icon when `input-type` is `info`; also used by the empty `error` click tooltip, which defaults to `Required` | ^[string]                                                                                                                          | —           |
| model-value / v-model         | binding value                                                                                                                                           | ^[string] / ^[number]                                                                                                              | —           |
| model-modifiers ^(2.11.5)     | v-model modifiers, reference Vue modifiers                                                                                                              | ^[object]`{ lazy?: boolean, number?: boolean, trim?: boolean }`                                                                    | —           |
| maxlength                     | same as `maxlength` in native input                                                                                                                     | ^[string] / ^[number]                                                                                                              | —           |
| minlength                     | same as `minlength` in native input                                                                                                                     | ^[string] / ^[number]                                                                                                              | —           |
| show-word-limit               | whether show word count, only works when `type` is 'text' or 'textarea'                                                                                 | ^[boolean]                                                                                                                         | false       |
| word-limit-position ^(2.11.5) | word count position, valid when `show-word-limit` is true                                                                                               | ^[enum]`'inside' \| 'outside' `                                                                                                    | "inside"    |
| placeholder                   | placeholder of Input                                                                                                                                    | ^[string]                                                                                                                          | —           |
| float-label                   | whether to show the floating label                                                                                                                      | ^[boolean]                                                                                                                         | true        |
| is-hover-suffix               | whether the suffix area is displayed only on hover                                                                                                      | ^[boolean]                                                                                                                         | false       |
| always-show-suffix            | whether to always display the suffix area                                                                                                               | ^[boolean]                                                                                                                         | true        |
| clearable                     | whether to show clear button, only works when `type` is not 'textarea'                                                                                  | ^[boolean]                                                                                                                         | true        |
| clear-icon ^(2.11.0)          | custom clear icon component                                                                                                                             | ^[string] / ^[object]`Component`                                                                                                   | CircleClose |
| formatter                     | specifies the format of the value presented input.(only works when `type` is 'text')                                                                    | ^[Function]`(value: string \| number) => string`                                                                                   | —           |
| parser                        | specifies the value extracted from formatter input.(only works when `type` is 'text')                                                                   | ^[Function]`(value: string) => string`                                                                                             | —           |
| show-password                 | whether to show toggleable password input                                                                                                               | ^[boolean]                                                                                                                         | false       |
| disabled                      | whether Input is disabled                                                                                                                               | ^[boolean]                                                                                                                         | false       |
| size                          | size of Input, works when `type` is not 'textarea'                                                                                                      | ^[enum]`'large' \| 'default' \| 'small'`                                                                                           | —           |
| prefix-icon                   | prefix icon component                                                                                                                                   | ^[string] / ^[Component]                                                                                                           | —           |
| suffix-icon                   | suffix icon component                                                                                                                                   | ^[string] / ^[Component]                                                                                                           | —           |
| rows                          | number of rows of textarea, only works when `type` is 'textarea'                                                                                        | ^[number]                                                                                                                          | 2           |
| autosize                      | whether textarea has an adaptive height, only works when `type` is 'textarea'. Can accept an object, e.g. `{ minRows: 2, maxRows: 6 }`                  | ^[boolean] / ^[object]`{ minRows?: number, maxRows?: number }`                                                                     | false       |
| autocomplete                  | same as `autocomplete` in native input                                                                                                                  | ^[string]                                                                                                                          | off         |
| name                          | same as `name` in native input                                                                                                                          | ^[string]                                                                                                                          | —           |
| readonly                      | same as `readonly` in native input                                                                                                                      | ^[boolean]                                                                                                                         | false       |
| max                           | same as `max` in native input                                                                                                                           | —                                                                                                                                  | —           |
| min                           | same as `min` in native input                                                                                                                           | —                                                                                                                                  | —           |
| step                          | same as `step` in native input                                                                                                                          | —                                                                                                                                  | —           |
| resize                        | control the resizability                                                                                                                                | ^[enum]`'none' \| 'both' \| 'horizontal' \| 'vertical'`                                                                            | —           |
| autofocus                     | same as `autofocus` in native input                                                                                                                     | ^[boolean]                                                                                                                         | false       |
| form                          | same as `form` in native input                                                                                                                          | `string`                                                                                                                           | —           |
| aria-label ^(a11y) ^(2.7.2)   | same as `aria-label` in native input                                                                                                                    | ^[string]                                                                                                                          | —           |
| tabindex                      | input tabindex                                                                                                                                          | ^[string] / ^[number]                                                                                                              | —           |
| validate-event                | whether to trigger form validation                                                                                                                      | ^[boolean]                                                                                                                         | true        |
| input-style                   | the style of the input element or textarea element                                                                                                      | ^[string] / ^[object]`CSSProperties \| CSSProperties[] \| string[]`                                                                | {}          |
| label ^(a11y) ^(deprecated)   | same as `aria-label` in native input                                                                                                                    | ^[string]                                                                                                                          | —           |
| inputmode ^(2.10.3)           | same as `inputmode` in native input                                                                                                                     | ^[string]                                                                                                                          | —           |

### Events

| Name              | Description                                                                                           | Type                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| blur              | triggers when Input blurs                                                                             | ^[Function]`(event: FocusEvent) => void`             |
| focus             | triggers when Input focuses                                                                           | ^[Function]`(event: FocusEvent) => void`             |
| change            | triggers when the input box loses focus or the user presses Enter, only if the modelValue has changed | ^[Function]`(value: string \| number) => void`       |
| input             | triggers when the Input value change                                                                  | ^[Function]`(value: string \| number) => void`       |
| clear             | triggers when the Input is cleared by clicking the clear button                                       | ^[Function]`() => void`                              |
| keydown           | triggers when a key is pressed down                                                                   | ^[Function]`(event: KeyboardEvent \| Event) => void` |
| mouseleave        | triggers when the mouse leaves the Input element                                                      | ^[Function]`(event: MouseEvent) => void`             |
| mouseenter        | triggers when the mouse enters the Input element                                                      | ^[Function]`(event: MouseEvent) => void`             |
| compositionstart  | triggers when the composition starts                                                                  | ^[Function]`(event: CompositionEvent) => void`       |
| compositionupdate | triggers when the composition is updated                                                              | ^[Function]`(event: CompositionEvent) => void`       |
| compositionend    | triggers when the composition ends                                                                    | ^[Function]`(event: CompositionEvent) => void`       |

### Slots

| Name           | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| prefix         | content as Input prefix, only works when `type` is not 'textarea'         |
| suffix         | content as Input suffix, only works when `type` is not 'textarea'         |
| prepend        | content to prepend before Input, only works when `type` is not 'textarea' |
| append         | content to append after Input, only works when `type` is not 'textarea'   |
| textareaPrefix | content as Input textarea prefix, only works when `type` is 'textarea'    |
| textareaSuffix | content as Input textarea suffix, only works when `type` is 'textarea'    |

### Exposes

| Name                 | Description                      | Type                                                    |
| -------------------- | -------------------------------- | ------------------------------------------------------- |
| blur                 | blur the input element           | ^[Function]`() => void`                                 |
| clear                | clear input value                | ^[Function]`() => void`                                 |
| focus                | focus the input element          | ^[Function]`() => void`                                 |
| input                | HTML input element               | ^[object]`Ref<HTMLInputElement>`                        |
| ref                  | HTML element, input or textarea  | ^[object]`Ref<HTMLInputElement \| HTMLTextAreaElement>` |
| resizeTextarea       | resize textarea                  | ^[Function]`() => void`                                 |
| select               | select the text in input element | ^[Function]`() => void`                                 |
| textarea             | HTML textarea element            | ^[object]`Ref<HTMLTextAreaElement>`                     |
| textareaStyle        | style of textarea                | ^[object]`Ref<StyleValue>`                              |
| isComposing ^(2.8.0) | is input composing               | ^[object]`Ref<boolean>`                                 |
