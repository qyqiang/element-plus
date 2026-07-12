import { cloneVNode } from 'vue'
import { isArray } from '@element-plus/utils'
import { ghostRowFieldKey, ghostRowKey, ghostRowSign } from './private'

import type { VNode } from 'vue'
import type { Column } from './types'

export const isEmptyRequiredValue = (value: unknown) =>
  value === '' || value === null || value === undefined

export const isGhostTableRow = (row: Record<string, any> | undefined) =>
  Boolean(row?.[ghostRowSign])

export const hasGhostRowValue = <T extends Record<string, any>>(row: T) => {
  const rowField = row?.[ghostRowFieldKey] as string | number | symbol | undefined

  return Object.entries(row ?? {}).some(([key, value]) => {
    if (
      key === ghostRowSign ||
      key === ghostRowKey ||
      key === ghostRowFieldKey ||
      key === rowField
    ) {
      return false
    }

    return !isEmptyRequiredValue(value)
  })
}

const isElInputVNode = (vnode: VNode) => {
  const type = vnode.type as { name?: string; __name?: string }
  return type?.name === 'ElInput' || type?.__name === 'ElInput'
}

export const applyRequiredInputState = <T extends Record<string, any>>(
  vnodes: VNode | VNode[],
  column: Column<T>,
  row: T
) => {
  if (!column.required || column.dataKey == null) return vnodes
  if (isGhostTableRow(row) && !hasGhostRowValue(row)) return vnodes
  if (!isEmptyRequiredValue(row?.[column.dataKey as keyof T])) return vnodes

  const patchVNode = (vnode: VNode) => {
    if (!isElInputVNode(vnode)) return vnode

    const vnodeProps = (vnode.props ?? {}) as Record<string, any>

    return cloneVNode(vnode, {
      inputType: vnodeProps.inputType ?? vnodeProps['input-type'] ?? 'error',
      infoTip: vnodeProps.infoTip ?? vnodeProps['info-tip'] ?? 'Required',
    })
  }

  return isArray(vnodes) ? vnodes.map((vnode) => patchVNode(vnode)) : patchVNode(vnodes)
}
