---
title: Radio
lang: en-US
---

## Basic usage

Radio should not have too many options. Otherwise, use the Select component instead.

:::demo Creating a radio component is easy, you just need to bind a variable to Radio's `v-model`. It equals to the value of `value` of the chosen radio. The type of `value` is `String`, `Number` or `Boolean`.

radio/basic-usage

:::

## Radio API

### Radio Attributes

| Name                  | Description                                                            | Type                                     | Default |
| --------------------- | ---------------------------------------------------------------------- | ---------------------------------------- | ------- |
| model-value / v-model | binding value                                                          | ^[string] / ^[number] / ^[boolean]       | —       |
| value ^(2.6.0)        | the value of Radio                                                     | ^[string] / ^[number] / ^[boolean]       | —       |
| label                 | the label of Radio. If there's no `value`, `label` will act as `value` | ^[string] / ^[number] / ^[boolean]       | —       |
| disabled              | whether Radio is disabled                                              | ^[boolean]                               | false   |
| border                | whether to add a border around Radio                                   | ^[boolean]                               | false   |
| size                  | size of the Radio                                                      | ^[enum]`'large' \| 'default' \| 'small'` | —       |
| name                  | native `name` attribute                                                | ^[string]                                | —       |

### Radio Events

| Name   | Description                           | Type                                                      |
| ------ | ------------------------------------- | --------------------------------------------------------- |
| change | triggers when the bound value changes | ^[Function]`(value: string \| number \| boolean) => void` |

### Radio Slots

| Name    | Description               |
| ------- | ------------------------- |
| default | customize default content |

## RadioGroup API

### RadioGroup Attributes

| Name                        | Description                                                                                    | Type                                                             | Default                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| model-value / v-model       | binding value                                                                                  | ^[string] / ^[number] / ^[boolean]                               | —                                                        |
| size                        | the size of radio buttons or bordered radios                                                   | ^[string]                                                        | default                                                  |
| disabled                    | whether the nesting radios are disabled                                                        | ^[boolean]                                                       | false                                                    |
| validate-event              | whether to trigger form validation                                                             | ^[boolean]                                                       | true                                                     |
| text-color                  | font color when button is active                                                               | ^[string]                                                        | #ffffff                                                  |
| fill                        | border and background color when button is active                                              | ^[string]                                                        | #409eff                                                  |
| aria-label ^(a11y) ^(2.7.2) | same as `aria-label` in RadioGroup                                                             | ^[string]                                                        | —                                                        |
| name                        | native `name` attribute                                                                        | ^[string]                                                        | —                                                        |
| id                          | native `id` attribute                                                                          | ^[string]                                                        | —                                                        |
| label ^(a11y) ^(deprecated) | same as `aria-label` in RadioGroup                                                             | ^[string]                                                        | —                                                        |
| options ^(2.11.2)           | data of the options, the key of `value` and `label` and `disabled` can be customize by `props` | ^[array]`Array<{[key: string]: any}>`                            | —                                                        |
| props ^(2.11.2)             | configuration options                                                                          | ^[object]`{ value?: string, label?: string, disabled?: boolean}` | `{value: 'value', label: 'label', disabled: 'disabled'}` |
| type ^(2.11.5)              | component type to render options (e.g. `'button'`)                                             | ^[enum]`'radio' \| 'button'`                                     | 'radio'                                                  |

### RadioGroup Events

| Name   | Description                           | Type                                                      |
| ------ | ------------------------------------- | --------------------------------------------------------- |
| change | triggers when the bound value changes | ^[Function]`(value: string \| number \| boolean) => void` |

### RadioGroup Slots

| Name    | Description               | Subtags             |
| ------- | ------------------------- | ------------------- |
| default | customize default content | Radio / RadioButton |

## RadioButton API

### RadioButton Attributes

| Name           | Description                                                            | Type                               | Default |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------- | ------- |
| value ^(2.6.0) | the value of Radio                                                     | ^[string] / ^[number] / ^[boolean] | —       |
| label          | the label of Radio. If there's no `value`, `label` will act as `value` | ^[string] / ^[number] / ^[boolean] | —       |
| disabled       | whether Radio is disabled                                              | ^[boolean]                         | false   |
| name           | native 'name' attribute                                                | ^[string]                          | —       |

### RadioButton Slots

| Name    | Description               |
| ------- | ------------------------- |
| default | customize default content |
