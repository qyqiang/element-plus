import { h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import TableV2 from '../src/table-v2'
import { SortOrder } from '../src/constants'

import type {
  TableV2HeaderRowCellRendererParams,
  TableV2RowCellRenderParam,
} from '../src/components'

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-'
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

describe('TableV2.vue', () => {
  test('slots cell', async () => {
    const columns = ref(generateColumns(10))
    const data = ref(generateData(columns.value, 20))
    const customText = 'custom cell'
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        v-slots={{
          cell: ({ columnIndex, rowIndex }: TableV2RowCellRenderParam) =>
            columnIndex === 0 && rowIndex === 0 ? (
              <span>{customText}</span>
            ) : null,
        }}
      />
    ))
    expect(wrapper.find('.el-table-v2').exists()).toBe(true)
    const cell = wrapper.findAll('.el-table-v2__row-cell')

    expect(cell[0].find('.el-table-v2__cell-text').exists()).toBe(false)
    expect(cell[0].find('span').exists()).toBe(true)
    expect(cell[0].find('span').text()).toBe(customText)

    expect(cell[1].find('span').exists()).toBe(false)
    expect(cell[1].find('.el-table-v2__cell-text').exists()).toBe(true)
    expect(cell[1].find('.el-table-v2__cell-text').text()).toBe('Row 0 - Col 1')
  })

  test('slots header-cell', async () => {
    const columns = ref(generateColumns(10))
    const data = ref(generateData(columns.value, 20))
    const customText = 'header'
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        v-slots={{
          'header-cell': ({
            columnIndex,
          }: TableV2HeaderRowCellRendererParams) =>
            columnIndex === 0 ? <span>{customText}</span> : null,
        }}
      />
    ))
    expect(wrapper.find('.el-table-v2').exists()).toBe(true)
    const cell = wrapper.findAll('.el-table-v2__header-cell')
    expect(cell[0].find('.el-table-v2__header-cell-text').exists()).toBe(false)
    expect(cell[0].find('span').exists()).toBe(true)
    expect(cell[0].find('span').text()).toBe(customText)

    expect(cell[1].find('span').exists()).toBe(false)
    expect(cell[1].find('.el-table-v2__header-cell-text').exists()).toBe(true)
    expect(cell[1].find('.el-table-v2__header-cell-text').text()).toBe(
      'Column 1'
    )
  })

  test('slots empty', async () => {
    const columns = ref(generateColumns(3))
    const data = ref(generateData(columns.value, 0))
    const isCustomEmpty = ref(true)
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        v-slots={{
          empty: () =>
            isCustomEmpty.value ? (
              <span class="custom-empty">custom-empty</span>
            ) : null,
        }}
      />
    ))
    expect(wrapper.find('.el-table-v2').exists()).toBe(true)
    let customEmpty = wrapper.find('span.custom-empty')
    expect(customEmpty.exists()).toBe(true)
    let defaultEmpty = wrapper.find('.el-empty')
    expect(defaultEmpty.exists()).toBe(false)

    isCustomEmpty.value = false
    await nextTick()

    customEmpty = wrapper.find('span.custom-empty')
    expect(customEmpty.exists()).toBe(false)
    defaultEmpty = wrapper.find('.el-empty')
    expect(defaultEmpty.exists()).toBe(true)
  })

  test('slots cell scope', async () => {
    const columns = ref(generateColumns(10))
    const data = ref(generateData(columns.value, 20))
    const customText = 'custom cell'
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        v-slots={{
          cell: (scope: TableV2RowCellRenderParam) => (
            <span>
              {scope.rowData[scope.column.dataKey!]}
              {customText}
            </span>
          ),
        }}
      />
    ))
    expect(wrapper.find('.el-table-v2').exists()).toBe(true)
    const cell = wrapper.find('.el-table-v2__row-cell')
    expect(cell.exists()).toBe(true)
    expect(cell.find('span').text()).toBe(
      `${data.value[0][columns.value[0].dataKey]}${customText}`
    )
  })

  test('renders raw value when canEditTable is true and editable is false', async () => {
    const columns = ref([
      {
        ...generateColumns(1)[0],
        cellRenderer: ({ cellData }: { cellData: string }) => (
          <span class="custom-editor">{cellData}-editor</span>
        ),
      },
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable={false}
      />
    ))

    const cell = wrapper.find('.el-table-v2__row-cell')

    expect(cell.find('.custom-editor').exists()).toBe(false)
    expect(cell.find('.el-table-v2__cell-text').text()).toBe('Row 0 - Col 0')
  })

  test('renders cellRenderer result when canEditTable is true and editable is true', async () => {
    const columns = ref([
      {
        ...generateColumns(1)[0],
        cellRenderer: ({ cellData }: { cellData: string }) => (
          <span class="custom-editor">{cellData}-editor</span>
        ),
      },
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
      />
    ))

    const cell = wrapper.find('.el-table-v2__row-cell')

    expect(cell.find('.custom-editor').exists()).toBe(true)
    expect(cell.find('.custom-editor').text()).toBe('Row 0 - Col 0-editor')
  })

  test('keeps original cellRenderer behavior when canEditTable is false', async () => {
    const columns = ref([
      {
        ...generateColumns(1)[0],
        cellRenderer: ({ cellData }: { cellData: string }) => (
          <span class="custom-editor">{cellData}-editor</span>
        ),
      },
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        editable={false}
      />
    ))

    const cell = wrapper.find('.el-table-v2__row-cell')

    expect(cell.find('.custom-editor').exists()).toBe(true)
    expect(cell.find('.custom-editor').text()).toBe('Row 0 - Col 0-editor')
  })

  test('renders delete action column and emits row-delete when canEditTable is true and editable is true', async () => {
    const columns = ref(generateColumns(1))
    const data = ref(generateData(columns.value, 1))
    const onRowDelete = vi.fn()
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
        onRowDelete={onRowDelete}
      />
    ))

    const headerCells = wrapper.findAll('.el-table-v2__header-cell')
    const deleteButton = wrapper.find('.el-table-v2__row-delete-button')
    const table = wrapper.findComponent(TableV2)

    expect(headerCells).toHaveLength(2)
    expect(deleteButton.exists()).toBe(true)

    await deleteButton.trigger('click')

    expect(onRowDelete).toHaveBeenCalledTimes(1)
    expect(onRowDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        rowData: data.value[0],
        rowIndex: 0,
        rowKey: data.value[0].id,
      })
    )
    expect(table.emitted('row-delete')).toEqual([
      [
        expect.objectContaining({
          rowData: data.value[0],
          rowIndex: 0,
          rowKey: data.value[0].id,
        }),
      ],
    ])
  })

  test('does not render delete action column when canEditTable is false', async () => {
    const columns = ref(generateColumns(1))
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        editable
      />
    ))

    expect(wrapper.find('.el-table-v2__row-delete-button').exists()).toBe(false)
  })

  test('renders add row above footer when canEditTable is true and editable is true', async () => {
    const columns = ref([
      {
        ...generateColumns(1)[0],
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => (
          <span class={rowIndex < 0 ? 'add-row-editor' : 'data-row-editor'}>
            {rowIndex}
          </span>
        ),
      },
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        footerHeight={44}
        canEditTable
        editable
      />
    ))

    const addRow = wrapper.find('.el-table-v2__add-row-main')
    const addRowHeader = wrapper.find(
      '.el-table-v2__add-row-main .el-table-v2__header'
    )

    expect(addRow.exists()).toBe(true)
    expect(addRowHeader.attributes('style')).toContain('width: 700px;')
    expect(wrapper.find('.add-row-editor').exists()).toBe(true)
    expect(wrapper.find('.el-table-v2__row-add-button').exists()).toBe(true)
    expect(wrapper.findAll('.el-table-v2__row-delete-button')).toHaveLength(1)
  })

  test('emits row-add when add row is clicked', async () => {
    const columns = ref(generateColumns(1))
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
      />
    ))

    const addRow = wrapper.find('.el-table-v2__add-row-main .el-table-v2__row')
    const table = wrapper.findComponent(TableV2)

    await addRow.trigger('click')

    expect(table.emitted('row-add')).toEqual([
      [
        expect.objectContaining({
          rowIndex: -1,
        }),
      ],
    ])
  })

  test('emits row-add when add row button is clicked', async () => {
    const columns = ref(generateColumns(1))
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
      />
    ))

    const addButton = wrapper.find('.el-table-v2__row-add-button')
    const table = wrapper.findComponent(TableV2)

    await addButton.trigger('click')

    expect(table.emitted('row-add')).toEqual([
      [
        expect.objectContaining({
          rowIndex: -1,
        }),
      ],
    ])
  })

  test('does not render add row when editable mode is disabled', async () => {
    const columns = ref(generateColumns(1))
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable={false}
      />
    ))

    expect(wrapper.find('.el-table-v2__add-row-main').exists()).toBe(false)
  })

  test('slots header-cell scope', async () => {
    const columns = ref(generateColumns(10))
    const data = ref(generateData(columns.value, 20))
    const customText = 'header'
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        v-slots={{
          'header-cell': (scope: TableV2HeaderRowCellRendererParams) => (
            <span>
              {scope.column.title}
              {customText}
            </span>
          ),
        }}
      />
    ))
    expect(wrapper.find('.el-table-v2').exists()).toBe(true)
    const cell = wrapper.find('.el-table-v2__header-cell')
    expect(cell.exists()).toBe(true)
    expect(cell.find('span').text()).toBe(
      `${columns.value[0].title}${customText}`
    )
  })

  test('sortable header icon uses default color when sortState is not provided', async () => {
    const columns = ref(generateColumns(3, 'column-', { sortable: true }))
    const data = ref(generateData(columns.value, 5))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
      />
    ))

    const sortIcon = wrapper.find('.el-table-v2__sort-icon')

    expect(sortIcon.exists()).toBe(true)
    expect(sortIcon.attributes('style')).toContain('--color: #9FB1BD')
  })

  test('column-sort emits asc order on first click when sortState is not provided', async () => {
    const columns = ref(generateColumns(3, 'column-', { sortable: true }))
    const data = ref(generateData(columns.value, 5))
    const onColumnSort = vi.fn()
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        onColumnSort={onColumnSort}
      />
    ))

    const headerCell = wrapper.find('.el-table-v2__header-cell.is-sortable')
    await headerCell.trigger('click')

    expect(onColumnSort).toHaveBeenCalledTimes(1)
    expect(onColumnSort).toHaveBeenCalledWith(
      expect.objectContaining({
        key: columns.value[0].key,
        order: SortOrder.ASC,
      })
    )
  })

  test('default footer uses total and updateTime props', async () => {
    const columns = ref(generateColumns(3))
    const data = ref(generateData(columns.value, 5))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        footerHeight={44}
        total={12}
        updateTime="2026-07-07 12:30"
      />
    ))

    const footer = wrapper.find('.footer-default')
    const count = footer.find('.count')
    const time = footer.find('.time')

    expect(footer.classes()).toContain('el-table-v2__footer')
    expect(count.text()).toBe('12')
    expect(time.text()).toBe('2026-07-07 12:30')
  })

  test('default footer is hidden when isFooterDefault is false', async () => {
    const columns = ref(generateColumns(3))
    const data = ref(generateData(columns.value, 5))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        footerHeight={44}
        isFooterDefault={false}
        total={12}
        updateTime="2026-07-07 12:30"
      />
    ))

    expect(wrapper.find('.footer-default').exists()).toBe(false)
  })

  test('expandable mode wrongly enabled, by column not key', async () => {
    const columns = ref([
      {
        width: 50,
        title: 'd',
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
          return h('span', null, rowIndex)
        },
      },
      {
        width: 50,
        title: 'd',
        key: 'expandColumnKey',
        cellRenderer: ({ rowIndex }: { rowIndex: number }) => {
          return h('span', null, rowIndex)
        },
      },
    ])
    const data = ref(generateData(columns.value, 20))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
      />
    ))
    expect(wrapper.find('.el-table-v2').exists()).toBe(true)
    const cell = wrapper.find('.el-table-v2__row-cell')
    expect(cell.exists()).toBe(true)
    expect(cell.find('div [style^=margin-inline-star]').exists()).toBe(false)
  })
})
