import { cloneVNode } from 'vue'
import { isArray } from '@element-plus/utils'
import {
  ghostRowFieldKey,
  ghostRowKey,
  ghostRowSign,
  ghostRowTouchedSign,
} from './private'

import type { VNode } from 'vue'
import type { Column } from './types'

export const isEmptyRequiredValue = (value: unknown) =>
  value === '' || value === null || value === undefined

export const isGhostTableRow = (row: Record<string, any> | undefined) =>
  Boolean(row?.[ghostRowSign])

export const isGhostRowTouched = (row: Record<string, any> | undefined) =>
  Boolean(row?.[ghostRowTouchedSign])

export const getGhostRowPayload = <T extends Record<PropertyKey, any>>(
  row: T
) => {
  const rowField = row?.[ghostRowFieldKey]
  const internalKeys = new Set<PropertyKey>([
    ghostRowSign,
    ghostRowKey,
    ghostRowFieldKey,
    ghostRowTouchedSign,
    rowField,
  ])

  return Reflect.ownKeys(row).reduce<Partial<T>>((payload, key) => {
    if (
      !internalKeys.has(key) &&
      Object.prototype.propertyIsEnumerable.call(row, key)
    ) {
      payload[key as keyof T] = row[key as keyof T]
    }
    return payload
  }, {})
}

export const hasGhostRowValue = <T extends Record<string, any>>(row: T) => {
  const rowField = row?.[ghostRowFieldKey] as
    | string
    | number
    | symbol
    | undefined

  return Object.entries(row ?? {}).some(([key, value]) => {
    if (
      key === ghostRowSign ||
      key === ghostRowKey ||
      key === ghostRowFieldKey ||
      key === ghostRowTouchedSign ||
      key === rowField
    ) {
      return false
    }

    return !isEmptyRequiredValue(value)
  })
}

const getVNodeComponentName = (vnode: VNode) => {
  const type = vnode.type as { name?: string; __name?: string }
  return type?.name ?? type?.__name
}

const isElInputVNode = (vnode: VNode) => {
  return getVNodeComponentName(vnode) === 'ElInput'
}

const isElSelectVNode = (vnode: VNode) => {
  const name = getVNodeComponentName(vnode)
  return name === 'ElSelect' || name === 'ElSelectV2'
}

export const applyRequiredInputState = <T extends Record<string, any>>(
  vnodes: VNode | VNode[],
  column: Column<T>,
  row: T
) => {
  if (!column.required || column.dataKey == null) return vnodes
  if (isGhostTableRow(row) && !isGhostRowTouched(row)) return vnodes
  if (!isEmptyRequiredValue(row?.[column.dataKey as keyof T])) return vnodes

  const patchVNode = (vnode: VNode) => {
    const vnodeProps = (vnode.props ?? {}) as Record<string, any>

    if (isElInputVNode(vnode)) {
      return cloneVNode(vnode, {
        inputType: vnodeProps.inputType ?? vnodeProps['input-type'] ?? 'error',
        infoTip: vnodeProps.infoTip ?? vnodeProps['info-tip'] ?? 'Required',
      })
    }

    if (isElSelectVNode(vnode)) {
      return cloneVNode(vnode, {
        inputType: vnodeProps.inputType ?? vnodeProps['input-type'] ?? 'error',
      })
    }

    return vnode
  }

  return isArray(vnodes)
    ? vnodes.map((vnode) => patchVNode(vnode))
    : patchVNode(vnodes)
}
