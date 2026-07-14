import {
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'
import { useNamespace } from '@element-plus/hooks'
import ElIcon from '@element-plus/components/icon'
import ElCheckbox from '@element-plus/components/checkbox'
import FilterPanel from '../filter-panel.vue'
import useLayoutObserver from '../layout-observer'
import { TABLE_INJECTION_KEY } from '../tokens'
import useEvent from './event-helper'
import FilterIcon from './filter-icon.vue'
import useStyle from './style.helper'
import useUtils from './utils-helper'

import type { ComponentInternalInstance, PropType, Ref } from 'vue'
import type TableLayout from '../table-layout'
import type { DefaultRow, Sort } from '../table/defaults'
import type { Store } from '../store'

export interface TableHeader extends ComponentInternalInstance {
  state: {
    onColumnsChange: (layout: TableLayout<any>) => void
    onScrollableChange: (layout: TableLayout<any>) => void
  }
  filterPanels: Ref<DefaultRow>
}
export interface TableHeaderProps<T extends DefaultRow> {
  fixed: string
  store: Store<T>
  border: boolean
  defaultSort: Sort
  allowDragLastColumn: boolean
  showAddColumnTrigger: boolean
  addColumnButton: boolean
  editTable: boolean
}

export default defineComponent({
  name: 'ElTableHeader',
  components: {
    ElCheckbox,
  },
  props: {
    fixed: {
      type: String,
      default: '',
    },
    store: {
      required: true,
      type: Object as PropType<TableHeaderProps<any>['store']>,
    },
    border: Boolean,
    defaultSort: {
      type: Object as PropType<TableHeaderProps<any>['defaultSort']>,
      default: () => {
        return {
          prop: '',
          order: '',
        }
      },
    },
    appendFilterPanelTo: {
      type: String,
    },
    allowDragLastColumn: {
      type: Boolean,
    },
    showAddColumnTrigger: {
      type: Boolean,
    },
    addColumnButton: {
      type: Boolean,
      default: true,
    },
    editTable: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const instance = getCurrentInstance() as TableHeader
    const parent = inject(TABLE_INJECTION_KEY)
    const ns = useNamespace('table')
    const filterPanels = ref({})
    const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent!)

    const isTableLayoutAuto = parent?.props.tableLayout === 'auto'
    const saveIndexSelection = reactive(new Map())
    const theadRef = ref()

    let delayId: ReturnType<typeof setTimeout> | undefined
    const updateFixedColumnStyle = () => {
      delayId = setTimeout(() => {
        if (saveIndexSelection.size > 0) {
          saveIndexSelection.forEach((column, key) => {
            const el = theadRef.value.querySelector(
              `.${key.replace(/\s/g, '.')}`
            )
            if (el) {
              const width = el.getBoundingClientRect().width
              column.width = width || column.width
            }
          })
          saveIndexSelection.clear()
        }
      })
    }

    watch(saveIndexSelection, updateFixedColumnStyle)
    onBeforeUnmount(() => {
      if (delayId) {
        clearTimeout(delayId)
        delayId = undefined
      }
    })

    onMounted(async () => {
      // Need double await, because updateColumns is executed after nextTick for now
      await nextTick()
      await nextTick()
      const { prop, order } = props.defaultSort
      parent?.store.commit('sort', { prop, order, init: true })

      updateFixedColumnStyle()
    })

    const {
      handleCellMouseEnter,
      handleHeaderClick,
      handleHeaderContextMenu,
      handleMouseDown,
      handleMouseMove,
      handleMouseOut,
      handleSortClick,
      handleFilterClick,
    } = useEvent(props as TableHeaderProps<any>, emit)
    const {
      getHeaderRowStyle,
      getHeaderRowClass,
      getHeaderCellStyle,
      getHeaderCellClass,
    } = useStyle(props as TableHeaderProps<any>)
    const { isGroup, toggleAllSelection, columnRows } = useUtils(
      props as TableHeaderProps<any>
    )
    const handleAddColumn = (event: MouseEvent) => {
      event.stopPropagation()
      const columns = props.store.states.columns.value
      const columnIndex = columns.length - 1
      const column = columns[columnIndex]

      if (!column) return

      emit('tail-add-column', {
        column,
        columnIndex,
        insertIndex: columnIndex + 1,
        event,
      })
    }

    instance.state = {
      onColumnsChange,
      onScrollableChange,
    }
    instance.filterPanels = filterPanels

    return {
      ns,
      filterPanels,
      onColumnsChange,
      onScrollableChange,
      columnRows,
      getHeaderRowClass,
      getHeaderRowStyle,
      getHeaderCellClass,
      getHeaderCellStyle,
      handleHeaderClick,
      handleCellMouseEnter,
      handleHeaderContextMenu,
      handleMouseDown,
      handleMouseMove,
      handleMouseOut,
      handleSortClick,
      handleFilterClick,
      isGroup,
      toggleAllSelection,
      saveIndexSelection,
      isTableLayoutAuto,
      handleAddColumn,
      theadRef,
      updateFixedColumnStyle,
    }
  },
  render() {
    const {
      ns,
      isGroup,
      columnRows,
      getHeaderCellStyle,
      getHeaderCellClass,
      getHeaderRowClass,
      getHeaderRowStyle,
      handleHeaderClick,
      handleCellMouseEnter,
      handleHeaderContextMenu,
      handleMouseDown,
      handleMouseMove,
      handleSortClick,
      handleMouseOut,
      store,
      $parent,
      saveIndexSelection,
      isTableLayoutAuto,
    } = this
    let rowSpan = 1
    return h(
      'thead',
      {
        ref: 'theadRef',
        class: ns.is('group', isGroup),
      },
      columnRows.map((subColumns, rowIndex) =>
        h(
          'tr',
          {
            class: getHeaderRowClass(rowIndex),
            key: rowIndex,
            style: getHeaderRowStyle(rowIndex),
          },
          subColumns.map((column, cellIndex) => {
            if (column.rowSpan > rowSpan) {
              rowSpan = column.rowSpan
            }
            const _class = getHeaderCellClass(
              rowIndex,
              cellIndex,
              subColumns,
              column
            )
            if (isTableLayoutAuto && column.fixed) {
              saveIndexSelection.set(_class, column)
            }
            const diagonalHeader = column.diagonalHeader
            const isDiagonalHeaderCell = !!diagonalHeader
            const headerContent = isDiagonalHeaderCell
              ? [
                  h(
                    'span',
                    {
                      class: ns.e('diagonal-header-text'),
                    },
                    diagonalHeader.from
                  ),
                  h(
                    'span',
                    {
                      class: ns.e('diagonal-header-text'),
                    },
                    diagonalHeader.to
                  ),
                ]
              : column.renderHeader
                ? column.renderHeader({
                    column,
                    $index: cellIndex,
                    store,
                    _self: $parent,
                  })
                : column.label

            return h(
              'th',
              {
                class: [
                  _class,
                  {
                    [ns.is('diagonal-header')]: isDiagonalHeaderCell,
                  },
                ],
                colspan: column.colSpan,
                key: `${column.id}-thead`,
                rowspan: column.rowSpan,
                style: getHeaderCellStyle(
                  rowIndex,
                  cellIndex,
                  subColumns,
                  column
                ),
                onMouseenter: ($event: MouseEvent) =>
                  handleCellMouseEnter($event, column),
                onClick: ($event: Event) => {
                  if (
                    ($event.currentTarget as Element)?.classList.contains(
                      'noclick'
                    )
                  ) {
                    return
                  }
                  handleHeaderClick($event, column)
                },
                onContextmenu: ($event: MouseEvent) =>
                  handleHeaderContextMenu($event, column),
                onMousedown: ($event: MouseEvent) =>
                  handleMouseDown($event, column),
                onMousemove: ($event: MouseEvent) =>
                  handleMouseMove($event, column),
                onMouseout: ($event: MouseEvent) => handleMouseOut($event),
              },
              [
                h(
                  'div',
                  {
                    class: [
                      'cell',
                      {
                        [ns.e('diagonal-header')]: isDiagonalHeaderCell,
                      },
                      column.filteredValue && column.filteredValue.length > 0
                        ? 'highlight'
                        : '',
                    ],
                  },
                  [
                    headerContent,
                    column.sortable &&
                      h(
                        'span',
                        {
                          class: 'icon-wrap',
                          onClick: ($event: any) =>
                            handleSortClick($event, column),
                        },
                        [
                          // beyond v3
                          h(
                            ElIcon,
                            { class: 'icon-arrow' },
                            {
                              default: () => h(FilterIcon),
                            }
                          ),
                        ]
                      ),
                    column.filterable &&
                      h(
                        FilterPanel as any,
                        {
                          store,
                          placement: column.filterPlacement || 'bottom-start',
                          appendTo: ($parent as any)?.appendFilterPanelTo,
                          column,
                          upDataColumn: (key: never, value: never) => {
                            column[key] = value
                          },
                        },
                        {
                          'filter-icon': () =>
                            column.renderFilterIcon
                              ? column.renderFilterIcon({
                                  filterOpened: column.filterOpened,
                                })
                              : null,
                        }
                      ),
                  ]
                ),
              ]
            )
          })
        )
      )
    )
  },
})
