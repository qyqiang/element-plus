import { getCurrentInstance, watch } from 'vue'
import { hasOwn } from '@element-plus/utils'
import { getAutoColumnWidth } from '../column-width'
import { parseMinWidth, parseWidth } from '../util'

import type { ComputedRef } from 'vue'
import type { DefaultRow } from '../table/defaults'
import type { TableColumn, TableColumnCtx, ValueOf } from './defaults'

function getAllAliases(props: string[], aliases: Record<string, string>) {
  return props.reduce((prev, cur) => {
    prev[cur as keyof typeof prev] = cur
    return prev
  }, aliases)
}
function useWatcher<T extends DefaultRow>(
  owner: ComputedRef<any>,
  props_: Partial<TableColumnCtx<T>>
) {
  const instance = getCurrentInstance() as TableColumn<T>
  const registerComplexWatchers = () => {
    const props = ['fixed']
    const aliases: Record<string, string> = {
      realWidth: 'width',
      realMinWidth: 'minWidth',
    }
    const allAliases = getAllAliases(props, aliases)
    Object.keys(allAliases).forEach((key) => {
      const columnKey = aliases[key]
      if (hasOwn(props_, columnKey)) {
        watch(
          () => props_[columnKey],
          (newVal) => {
            let value: ValueOf<TableColumnCtx<T>> = newVal
            if (columnKey === 'width' && key === 'realWidth') {
              value = parseWidth(newVal)
            }
            if (columnKey === 'minWidth' && key === 'realMinWidth') {
              value = parseMinWidth(newVal)
            }
            const autoWidth =
              !parseWidth(props_.width) && !parseMinWidth(props_.minWidth ?? '')
            instance.columnConfig.value[columnKey as never] = value as never
            instance.columnConfig.value[key as never] = value as never
            instance.columnConfig.value.autoWidth = autoWidth
            if (autoWidth) {
              const width = getAutoColumnWidth(
                instance.columnConfig.value.label
              )
              instance.columnConfig.value.minWidth = width
            }
            const updateColumns = columnKey === 'fixed'
            owner.value.store.scheduleLayout(updateColumns)
          }
        )
      }
    })
  }
  const registerNormalWatchers = () => {
    const props = [
      'label',
      'filters',
      'filterMultiple',
      'filteredValue',
      'sortable',
      'index',
      'formatter',
      'className',
      'labelClassName',
      'diagonalHeader',
      'required',
      'allowInsertBeforeFirstColumn',
      'filterClassName',
      'showOverflowTooltip',
      'tooltipFormatter',
      'resizable',
    ]
    const parentProps = ['showOverflowTooltip']
    const aliases: Record<string, string> = {
      property: 'prop',
      align: 'realAlign',
      headerAlign: 'realHeaderAlign',
    }
    const allAliases = getAllAliases(props, aliases)
    Object.keys(allAliases).forEach((key) => {
      const columnKey = aliases[key]
      if (hasOwn(props_, columnKey)) {
        watch(
          () => props_[columnKey],
          (newVal) => {
            instance.columnConfig.value[key as never] = newVal
            if (key === 'label' && instance.columnConfig.value.autoWidth) {
              const width = getAutoColumnWidth(newVal)
              instance.columnConfig.value.minWidth = width
              owner.value.store.scheduleLayout()
            }
          }
        )
      }
    })
    parentProps.forEach((key) => {
      if (hasOwn(owner.value.props, key)) {
        watch(
          () => owner.value.props[key],
          (newVal) => {
            instance.columnConfig.value[key] = newVal as never
          }
        )
      }
    })
  }

  return {
    registerComplexWatchers,
    registerNormalWatchers,
  }
}

export default useWatcher
