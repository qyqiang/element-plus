import { defineComponent, h, nextTick, ref } from 'vue'
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
  test('defaults root width to 100% when width is not provided', async () => {
    const columns = ref(generateColumns(2))
    const data = ref(generateData(columns.value, 2))
    const wrapper = mount(() => (
      <TableV2 columns={columns.value} data={data.value} height={400} />
    ))

    expect(wrapper.find('.el-table-v2__root').attributes('style')).toContain(
      'width: 100%;'
    )
  })

  test('uses content height when only maxHeight is provided and data is short', async () => {
    const columns = ref(generateColumns(2))
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        maxHeight={200}
      />
    ))

    const rootStyle = wrapper.find('.el-table-v2__root').attributes('style')
    const grid = wrapper.findComponent({ name: 'ElTableV2Grid' })

    expect(rootStyle).toContain('max-height: 200px;')
    expect(rootStyle).toContain('height: 132px;')
    expect(grid.props('height')).toBe(88)
  })

  test('clamps table height to maxHeight when data exceeds the limit', async () => {
    const columns = ref(generateColumns(2))
    const data = ref(generateData(columns.value, 20))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        maxHeight={200}
      />
    ))

    const rootStyle = wrapper.find('.el-table-v2__root').attributes('style')
    const grid = wrapper.findComponent({ name: 'ElTableV2Grid' })

    expect(rootStyle).toContain('height: 200px;')
    expect(grid.props('height')).toBe(156)
  })

  test('does not reserve horizontal scrollbar height when fixed columns fit', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
      },
      {
        key: 'note',
        dataKey: 'note',
        title: 'Note',
        width: 180,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha', note: 'Beta' }])
    const wrapper = mount(() => (
      <TableV2 fixed columns={columns.value} data={data.value} width={700} />
    ))

    expect(wrapper.find('.el-table-v2__root').attributes('style')).toContain(
      'height: 132px;'
    )
  })

  test('reserves horizontal scrollbar height when fixed columns overflow', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 360,
      },
      {
        key: 'note',
        dataKey: 'note',
        title: 'Note',
        width: 360,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha', note: 'Beta' }])
    const wrapper = mount(() => (
      <TableV2 fixed columns={columns.value} data={data.value} width={700} />
    ))

    expect(wrapper.find('.el-table-v2__root').attributes('style')).toContain(
      'height: 138px;'
    )
  })

  test('auto sizes widthless columns and stretches the last widthless column', async () => {
    const columns = ref([
      {
        key: 'short',
        dataKey: 'short',
        title: 'ID',
      },
      {
        key: 'medium',
        dataKey: 'medium',
        title: 'Status',
      },
      {
        key: 'tail',
        dataKey: 'tail',
        title: 'Description',
      },
    ])
    const data = ref([
      {
        id: 'row-0',
        short: '1',
        medium: 'Open',
        tail: 'First row',
      },
    ])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value as any}
        data={data.value}
        width={700}
        height={400}
      />
    ))
    await nextTick()

    const headerCells = wrapper.findAll('.el-table-v2__header-cell')

    expect(headerCells[0].attributes('style')).toContain('width: 80px;')
    expect(headerCells[1].attributes('style')).toContain('width: 96px;')
    expect(headerCells[2].attributes('style')).toContain('width: 524px;')
  })

  test('keeps explicit widths when mixed with widthless columns', async () => {
    const columns = ref([
      {
        key: 'short',
        dataKey: 'short',
        title: 'ID',
      },
      {
        key: 'fixed-number',
        dataKey: 'fixedNumber',
        title: 'Fixed Number',
        width: 180,
      },
      {
        key: 'medium',
        dataKey: 'medium',
        title: 'Status',
      },
      {
        key: 'fixed-pixel',
        dataKey: 'fixedPixel',
        title: 'Fixed Pixel',
        width: '160px',
      },
      {
        key: 'tail',
        dataKey: 'tail',
        title: 'Notes',
      },
    ])
    const data = ref([
      {
        id: 'row-0',
        short: '1',
        fixedNumber: '180px',
        medium: 'Open',
        fixedPixel: '160px',
        tail: 'Remaining width',
      },
    ])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value as any}
        data={data.value}
        width={700}
        height={400}
      />
    ))
    await nextTick()

    const headerCells = wrapper.findAll('.el-table-v2__header-cell')

    expect(headerCells[0].attributes('style')).toContain('width: 80px;')
    expect(headerCells[1].attributes('style')).toContain('width: 180px;')
    expect(headerCells[2].attributes('style')).toContain('width: 96px;')
    expect(headerCells[3].attributes('style')).toContain('width: 160px;')
    expect(headerCells[4].attributes('style')).toContain('width: 184px;')
  })

  test('resolves percentage column widths against the available table width', async () => {
    const columns = ref([
      {
        key: 'route',
        dataKey: 'route',
        title: 'Route',
        width: '50%',
      },
      {
        key: 'state',
        dataKey: 'state',
        title: 'State',
        width: '30%',
      },
      {
        key: 'rate',
        dataKey: 'rate',
        title: 'Rate',
        width: '20%',
      },
    ])
    const data = ref([
      {
        id: 'row-0',
        route: 'Los Angeles, CA',
        state: 'GA',
        rate: '3.45',
      },
    ])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value as any}
        data={data.value}
        width={700}
        height={320}
        fixed
      />
    ))

    const headerCells = wrapper.findAll('.el-table-v2__header-cell')

    expect(headerCells[0].attributes('style')).toContain('width: 350px;')
    expect(headerCells[1].attributes('style')).toContain('width: 210px;')
    expect(headerCells[2].attributes('style')).toContain('width: 140px;')
  })

  test('does not reserve vertical scrollbar width in display mode', async () => {
    const editTable = ref(true)
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 100,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha' }])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={200}
        fixed
        ghostTable
        editTable={editTable.value}
      />
    ))

    const getMainGrid = () =>
      wrapper.findAllComponents({ name: 'ElTableV2Grid' })[0]

    expect(getMainGrid().props('bodyWidth')).toBe(694)

    editTable.value = false
    await nextTick()

    expect(getMainGrid().props('bodyWidth')).toBe(700)
  })

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

  test('uses one row height for empty data with a ghost row', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <input value={cellData} />
        ),
      },
    ])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={[]}
        width={700}
        maxHeight={240}
        ghostTable
        editTable
        isFooterDefault
      />
    ))

    const rootStyle = wrapper.find('.el-table-v2__root').attributes('style')
    const emptyStyle = wrapper.find('.el-table-v2__empty').attributes('style')
    const grid = wrapper.findComponent({ name: 'ElTableV2Grid' })

    expect(rootStyle).toContain('height: 176px;')
    expect(emptyStyle).toContain('top: 44px;')
    expect(emptyStyle).toContain('height: 44px;')
    expect(grid.props('height')).toBe(88)
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

  test('supports two-way binding through cellRenderer cellData', async () => {
    const Editor = defineComponent({
      props: {
        modelValue: {
          type: String,
          default: '',
        },
      },
      emits: ['update:modelValue'],
      setup(props, { emit }) {
        return () => (
          <input
            class="editable-input"
            value={props.modelValue}
            onInput={(event) =>
              emit(
                'update:modelValue',
                (event.target as HTMLInputElement).value
              )
            }
          />
        )
      },
    })

    const columns = ref([
      {
        ...generateColumns(1)[0],
        cellRenderer: (column: { cellData: string }) => (
          <Editor v-model={column.cellData} />
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

    const input = wrapper.find('.editable-input')

    await input.setValue('Updated Value')

    expect(data.value[0][columns.value[0].dataKey]).toBe('Updated Value')
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
    const mainHeader = wrapper.find(
      '.el-table-v2__main .el-table-v2__header-cell'
    )
    const deleteButton = wrapper.find('.el-table-v2__row-delete-button')
    const table = wrapper.findComponent(TableV2)

    expect(headerCells).toHaveLength(2)
    expect(
      wrapper.find('.el-table-v2__header-row-cell--placeholder').exists()
    ).toBe(false)
    expect(mainHeader.attributes('style')).toContain('width: 186px;')
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

  test('merges the delete placeholder width into the last business column', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
      },
      {
        key: 'status',
        dataKey: 'status',
        title: 'Status',
        width: 120,
        fixed: 'right' as const,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha', status: 'Ready' }])
    const wrapper = mount(() => (
      <TableV2
        fixed
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
      />
    ))

    const main = wrapper.find('.el-table-v2__main')
    const mergedHeader = main.find('[data-key="name"]')
    const placeholders = main.findAll(
      '.el-table-v2__header-row-cell--placeholder'
    )
    const rightHeaderCells = wrapper.findAll(
      '.el-table-v2__right .el-table-v2__header-cell'
    )

    expect(mergedHeader.classes()).toContain('is-row-delete-placeholder-merged')
    expect(mergedHeader.attributes('style')).toContain('width: 216px;')
    expect(placeholders).toHaveLength(1)
    expect(placeholders[0].attributes('style')).toContain('width: 120px;')
    expect(rightHeaderCells).toHaveLength(2)
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
    expect(addRowHeader.attributes('style')).toContain('width: 694px;')
    expect(wrapper.find('.add-row-editor').exists()).toBe(true)
    expect(wrapper.find('.el-table-v2__row-add-button').exists()).toBe(true)
    expect(wrapper.findAll('.el-table-v2__row-delete-button')).toHaveLength(1)
  })

  test('shows default footer in editable mode even when footerHeight is not provided', async () => {
    const columns = ref(generateColumns(2))
    const data = ref(generateData(columns.value, 2))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
        isFooterDefault
        total={12}
        updateTime="2026-07-07 12:30"
      />
    ))

    const footer = wrapper.find('.footer-default')
    const addRow = wrapper.find('.el-table-v2__add-row-main')

    expect(footer.exists()).toBe(true)
    expect(footer.attributes('style')).toContain('height: 44px;')
    expect(addRow.attributes('style')).toContain('bottom: 44px;')
  })

  test('places the editable add row above the horizontal scrollbar', async () => {
    const columns = ref([
      {
        ...generateColumns(1)[0],
        width: 360,
      },
      {
        ...generateColumns(1)[0],
        key: 'column-1',
        dataKey: 'column-1',
        width: 360,
      },
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        fixed
        columns={columns.value}
        data={data.value}
        width={700}
        canEditTable
        editable
        isFooterDefault
      />
    ))

    const root = wrapper.find('.el-table-v2__root')
    const addRow = wrapper.find('.el-table-v2__add-row-main')

    expect(root.classes()).toContain('el-table-v2--with-ghost-row')
    expect(addRow.attributes('style')).toContain('bottom: 50px;')
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

  test('shows add-column trigger on header hover and emits add-column with the hover insert index', async () => {
    const columns = ref(generateColumns(3))
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
        showAddColumnTrigger
      />
    ))

    const headerCell = wrapper.findAll('.el-table-v2__header-cell')[1]
    const rect = {
      left: 120,
      right: 240,
      top: 0,
      bottom: 40,
      width: 120,
      height: 40,
      x: 120,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect
    const rectSpy = vi
      .spyOn(headerCell.element, 'getBoundingClientRect')
      .mockReturnValue(rect)

    await headerCell.trigger('mousemove', {
      clientX: 145,
      clientY: 20,
    })
    await nextTick()

    const trigger = wrapper.find('.el-table-v2__add-column-trigger-button')
    const table = wrapper.findComponent(TableV2)

    expect(trigger.exists()).toBe(true)

    await trigger.trigger('click')

    expect(table.emitted('add-column')).toEqual([
      [
        expect.objectContaining({
          columnIndex: 1,
          insertIndex: 1,
        }),
      ],
    ])

    rectSpy.mockRestore()
  })

  test('shows add-row trigger on row hover and emits add-row', async () => {
    const columns = ref(generateColumns(3))
    const data = ref(generateData(columns.value, 2))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        canEditTable
        editable
        showAddRowTrigger
      />
    ))

    const row = wrapper.findAll('.el-table-v2__row')[0]
    const rect = {
      left: 0,
      right: 480,
      top: 0,
      bottom: 44,
      width: 480,
      height: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect
    const rectSpy = vi
      .spyOn(row.element, 'getBoundingClientRect')
      .mockReturnValue(rect)

    await row.trigger('mousemove', {
      clientX: 120,
      clientY: 40,
    })
    await nextTick()

    const trigger = wrapper.find('.el-table-v2__add-row-trigger-button')
    const table = wrapper.findComponent(TableV2)

    expect(trigger.exists()).toBe(true)

    await trigger.trigger('click')

    expect(table.emitted('add-row')).toEqual([
      [
        expect.objectContaining({
          rowIndex: 0,
          insertIndex: 1,
        }),
      ],
    ])

    rectSpy.mockRestore()
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

  test('renders editCellRenderer and appends a ghost row when ghostTable and editTable are true', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        cellRenderer: ({ cellData }: { cellData: string }) => (
          <span class="view-cell">{cellData}</span>
        ),
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <span class="edit-cell">{cellData || 'ghost'}</span>
        ),
      },
    ])
    const data = ref([
      { id: 'row-0', name: 'Alpha' },
      { id: 'row-1', name: 'Beta' },
    ])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        ghostTable
        editTable
      />
    ))

    expect(wrapper.find('.el-table-v2__add-row-main').exists()).toBe(true)
    expect(wrapper.findAll('.edit-cell')).toHaveLength(3)
    expect(wrapper.findAll('.view-cell')).toHaveLength(0)
    expect(wrapper.findAll('.el-table-v2__row-delete-button')).toHaveLength(2)
    expect(
      wrapper
        .findAll('.el-table-v2__row-cell')
        .every((node) => node.classes().includes('is-full-width'))
    ).toBe(true)
    expect(
      wrapper.findAll('.el-table-v2__add-row-right .icon-button')
    ).toHaveLength(1)
    expect(wrapper.find('.el-table-v2__add-row-main .edit-cell').exists()).toBe(
      true
    )
  })

  test('keeps the ghost row below the table body when only maxHeight is provided', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <input class="edit-cell" value={cellData} />
        ),
      },
      {
        key: 'note',
        dataKey: 'note',
        title: 'Note',
        width: 180,
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <input class="edit-cell" value={cellData} />
        ),
      },
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        maxHeight={260}
        ghostTable
        editTable
        isFooterDefault
        total={1}
        updateTime="2026-07-15 12:00"
      />
    ))

    const rootStyle = wrapper.find('.el-table-v2__root').attributes('style')
    const footer = wrapper.find('.footer-default')
    const ghostRow = wrapper.find('.el-table-v2__add-row-main')
    const grid = wrapper.findComponent({ name: 'ElTableV2Grid' })

    expect(rootStyle).toContain('height: 176px;')
    expect(footer.exists()).toBe(true)
    expect(ghostRow.exists()).toBe(true)
    expect(ghostRow.attributes('style')).toContain('bottom: 44px;')
    expect(grid.props('height')).toBe(88)
  })

  test('places the horizontal scrollbar between the ghost row and footer', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 360,
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <input class="edit-cell" value={cellData} />
        ),
      },
      {
        key: 'note',
        dataKey: 'note',
        title: 'Note',
        width: 360,
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <input class="edit-cell" value={cellData} />
        ),
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha', note: 'Beta' }])
    const wrapper = mount(() => (
      <TableV2
        fixed
        columns={columns.value}
        data={data.value}
        width={700}
        ghostTable
        editTable
        isFooterDefault
      />
    ))

    const root = wrapper.find('.el-table-v2__root')
    const footer = wrapper.find('.footer-default')
    const ghostRow = wrapper.find('.el-table-v2__add-row-main')
    const grid = wrapper.findComponent({ name: 'ElTableV2Grid' })

    expect(root.classes()).toContain('el-table-v2--with-ghost-row')
    expect(root.attributes('style')).toContain(
      '--el-table-v2-ghost-row-height: 44px;'
    )
    expect(ghostRow.attributes('style')).toContain('bottom: 50px;')
    expect(footer.attributes('style')).toContain('height: 44px;')
    expect(grid.props('height')).toBe(94)
  })

  test('keeps ghost table display mode expanded when height is omitted', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
      },
      {
        key: 'note',
        dataKey: 'note',
        title: 'Note',
        width: 180,
      },
    ])
    const data = ref(generateData(columns.value, 2))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        ghostTable
        editTable={false}
        isFooterDefault
        total={2}
        updateTime="2026-07-15 12:00"
      />
    ))

    const rootStyle = wrapper.find('.el-table-v2__root').attributes('style')
    const footer = wrapper.find('.footer-default')
    const ghostRow = wrapper.find('.el-table-v2__add-row-main')
    const grid = wrapper.findComponent({ name: 'ElTableV2Grid' })

    expect(footer.exists()).toBe(true)
    expect(footer.attributes('style')).toContain('height: 44px;')
    expect(rootStyle).toContain('height: 176px;')
    expect(grid.props('height')).toBe(132)
    expect(ghostRow.exists()).toBe(false)
  })

  test('renders delete action column and emits row-delete when ghostTable and editTable are true', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <span class="edit-cell">{cellData}</span>
        ),
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha' }])
    const onRowDelete = vi.fn()
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        ghostTable
        editTable
        onRowDelete={onRowDelete}
      />
    ))

    const deleteButton = wrapper.find('.el-table-v2__row-delete-button')
    const table = wrapper.findComponent(TableV2)

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

  test('uses row-action slot for data rows and keeps the ghost add action', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha' }])
    const onAction = vi.fn()
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        ghostTable
        editTable
      >
        {{
          'row-action': ({ rowData, rowIndex, rowKey }) => (
            <button
              class="custom-row-action"
              onClick={() => onAction({ rowData, rowIndex, rowKey })}
            >
              More
            </button>
          ),
        }}
      </TableV2>
    ))

    const customAction = wrapper.find('.custom-row-action')

    expect(customAction.exists()).toBe(true)
    expect(wrapper.find('.el-table-v2__row-delete-button').exists()).toBe(false)
    expect(
      wrapper.find('.el-table-v2__add-row-right .icon-button').exists()
    ).toBe(true)

    await customAction.trigger('click')

    expect(onAction).toHaveBeenCalledWith({
      rowData: data.value[0],
      rowIndex: 0,
      rowKey: data.value[0].id,
    })
  })

  test('emits add-ghost-row from the ghost row add button and keeps the placeholder from the column title', async () => {
    const InputStub = defineComponent({
      name: 'ElInput',
      props: {
        modelValue: {
          type: String,
          default: '',
        },
        placeholder: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        return () => (
          <input
            class="edit-cell"
            value={props.modelValue}
            placeholder={props.placeholder}
          />
        )
      },
    })

    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        editCellRenderer: ({
          cellData,
          column,
        }: {
          cellData: string
          column: any
        }) => <InputStub modelValue={cellData} placeholder={column.title} />,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha' }])
    const onAddGhostRow = vi.fn()
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        rowKey="id"
        ghostTable
        editTable
        onAddGhostRow={onAddGhostRow}
      />
    ))

    const ghostRow = wrapper.find('.el-table-v2__add-row-main')
    const addButton = wrapper.find('.el-table-v2__add-row-right .icon-button')
    const table = wrapper.findComponent(TableV2)

    expect(ghostRow.findAll('.edit-cell')).toHaveLength(1)
    expect(ghostRow.find('.edit-cell').attributes('placeholder')).toBe('Name')

    await addButton.trigger('click')

    expect(onAddGhostRow).toHaveBeenCalledTimes(1)
    const emittedPayload = table.emitted('add-ghost-row')?.[0]?.[0] as any

    expect(emittedPayload).toEqual(
      expect.objectContaining({
        rowIndex: -1,
        rowKey: 'ghost-row',
        row: {},
      })
    )
    expect(emittedPayload.row).not.toHaveProperty('__ep_table_v2_ghost_row__')
  })

  test('renders a delete action for a row appended from the ghost payload', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha' }])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        rowKey="id"
        ghostTable
        editTable
        onAddGhostRow={({ row }) => {
          data.value = [
            ...data.value,
            {
              ...row,
              id: 'row-1',
              name: 'Beta',
            },
          ]
        }}
      />
    ))

    const addButton = wrapper.find('.el-table-v2__add-row-right .icon-button')

    await addButton.trigger('click')
    await nextTick()

    expect(wrapper.findAll('.el-table-v2__row-delete-button')).toHaveLength(2)
  })

  test('applies ghostRowTemplate to the draft row payload and resets it after add', async () => {
    const InputStub = defineComponent({
      name: 'ElInput',
      props: {
        modelValue: {
          type: String,
          default: '',
        },
        placeholder: {
          type: String,
          default: '',
        },
      },
      emits: ['update:modelValue'],
      setup(props, { emit }) {
        return () => (
          <input
            class="edit-cell"
            value={props.modelValue}
            placeholder={props.placeholder}
            onInput={(event) =>
              emit(
                'update:modelValue',
                (event.target as HTMLInputElement).value
              )
            }
          />
        )
      },
    })

    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        editCellRenderer: ({
          cellData,
          column,
        }: {
          cellData: string
          column: any
        }) => <InputStub modelValue={cellData} placeholder={column.title} />,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha' }])
    const ghostRowTemplate = {
      name: 'Draft name',
      quantity: null,
      unit: '',
      unitValue: null,
      commodity: '',
      commodityValue: null,
    }
    let emittedRowSnapshot: Record<string, any> | null = null
    const onAddGhostRow = vi.fn((params: any) => {
      emittedRowSnapshot = { ...params.row }
      params.row.name = 'Mutated old row'
    })
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        rowKey="id"
        ghostTable
        editTable
        ghostRowTemplate={ghostRowTemplate}
        onAddGhostRow={onAddGhostRow}
      />
    ))

    const ghostInput = wrapper.find('.el-table-v2__add-row-main .edit-cell')
    expect((ghostInput.element as HTMLInputElement).value).toBe('Draft name')

    const addButton = wrapper.find('.el-table-v2__add-row-right .icon-button')
    const table = wrapper.findComponent(TableV2)

    await addButton.trigger('click')
    await nextTick()

    expect(onAddGhostRow).toHaveBeenCalledTimes(1)
    expect(table.emitted('add-ghost-row')).toHaveLength(1)
    expect(emittedRowSnapshot).toMatchObject({
      name: 'Draft name',
      quantity: null,
      unit: '',
      unitValue: null,
      commodity: '',
      commodityValue: null,
    })

    const resetGhostInput = wrapper.find(
      '.el-table-v2__add-row-main .edit-cell'
    )
    expect((resetGhostInput.element as HTMLInputElement).value).toBe(
      'Draft name'
    )
  })

  test('scrolls to the newly added row after ghost row add', async () => {
    const originalScroll = window.HTMLElement.prototype.scroll
    window.HTMLElement.prototype.scroll = function ({
      left,
      top,
    }: {
      left?: number
      top?: number
    }) {
      if (typeof left === 'number') this.scrollLeft = left
      if (typeof top === 'number') this.scrollTop = top
    }
    try {
      const columns = ref([
        {
          key: 'name',
          dataKey: 'name',
          title: 'Name',
          width: 900,
          editCellRenderer: ({ cellData }: { cellData: string }) => (
            <input class="edit-cell" value={cellData} />
          ),
        },
      ])
      const data = ref([{ id: 'row-0', name: 'Alpha' }])
      const wrapper = mount(() => (
        <TableV2
          columns={columns.value}
          data={data.value}
          width={420}
          height={180}
          rowKey="id"
          fixed
          ghostTable
          editTable
          onAddGhostRow={() => {
            data.value = [
              ...data.value,
              {
                id: `row-${data.value.length}`,
                name: 'Beta',
              },
            ]
          }}
        />
      ))

      const grid = wrapper.findComponent({ name: 'ElTableV2Grid' })
      const gridExposed = (grid.vm as any).$?.exposed as {
        scrollToRow: (row: number, strategy?: string) => void
      }
      const scrollToRowSpy = vi.spyOn(gridExposed, 'scrollToRow')
      const table = wrapper.findComponent(TableV2)
      const tableExposed = (table.vm as any).$?.exposed as {
        scrollToLeft: (left: number) => void
      }
      const ghostRowHeader = wrapper.find('.el-table-v2__add-row-main-inner')
      const addButton = wrapper.find('.el-table-v2__add-row-right .icon-button')

      tableExposed.scrollToLeft(120)
      await nextTick()
      await nextTick()

      await addButton.trigger('click')
      await nextTick()
      await nextTick()

      expect(scrollToRowSpy).toHaveBeenCalledWith(1, 'end')
      expect((ghostRowHeader.element as HTMLElement).scrollLeft).toBe(120)
    } finally {
      window.HTMLElement.prototype.scroll = originalScroll
    }
  })

  test('keeps the ghost row horizontally in sync with the table scroll position', async () => {
    const originalScroll = window.HTMLElement.prototype.scroll
    window.HTMLElement.prototype.scroll = function ({
      left,
      top,
    }: {
      left?: number
      top?: number
    }) {
      if (typeof left === 'number') this.scrollLeft = left
      if (typeof top === 'number') this.scrollTop = top
    }
    try {
      const columns = ref(generateColumns(8))
      const data = ref(generateData(columns.value, 2))
      const wrapper = mount(() => (
        <TableV2
          columns={columns.value}
          data={data.value}
          width={420}
          height={400}
          rowKey="id"
          fixed
          ghostTable
          editTable
        />
      ))

      const table = wrapper.findComponent(TableV2)
      const tableExposed = (table.vm as any).$?.exposed as {
        scrollToLeft: (left: number) => void
      }
      const ghostRowHeader = wrapper.find('.el-table-v2__add-row-main-inner')
      const ghostRowContent = wrapper.find(
        '.el-table-v2__add-row-main-inner .el-table-v2__header'
      )

      expect(ghostRowHeader.exists()).toBe(true)
      expect(ghostRowContent.attributes('style')).not.toContain('width: 420px;')

      tableExposed.scrollToLeft(120)
      await nextTick()
      await nextTick()

      expect((ghostRowHeader.element as HTMLElement).scrollLeft).toBe(120)
    } finally {
      window.HTMLElement.prototype.scroll = originalScroll
    }
  })

  test('disables the ghost-row add button when a required column is empty', async () => {
    const InputStub = defineComponent({
      name: 'ElInput',
      props: {
        modelValue: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        return () => <input value={props.modelValue} />
      },
    })

    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        required: true,
        editCellRenderer: ({ cellData }: { cellData: string }) => (
          <InputStub modelValue={cellData} />
        ),
      },
    ])
    const data = ref([{ id: 'row-0', name: '' }])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        ghostTable
        editTable
      />
    ))

    const addButton = wrapper.find('.el-table-v2__add-row-right .icon-button')
    const table = wrapper.findComponent(TableV2)

    await addButton.trigger('click')

    expect(table.emitted('add-ghost-row')).toBeUndefined()
  })

  test('does not apply error input props to required ghost-row inputs until the row has values', async () => {
    const InputStub = defineComponent({
      name: 'ElInput',
      props: {
        modelValue: {
          type: String,
          default: '',
        },
        inputType: {
          type: String,
          default: '',
        },
        infoTip: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        return () => (
          <div
            class="input-stub"
            data-input-type={props.inputType}
            data-info-tip={props.infoTip}
          >
            {props.modelValue}
          </div>
        )
      },
    })

    let ghostRowRef: Record<string, any> | null = null
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        required: true,
        editCellRenderer: ({
          cellData,
          rowData,
        }: {
          cellData: string
          rowData: Record<string, any>
        }) => {
          if (rowData.__ep_table_v2_ghost_row__) {
            ghostRowRef = rowData
          }
          return <InputStub modelValue={cellData} />
        },
      },
      {
        key: 'note',
        dataKey: 'note',
        title: 'Note',
        width: 180,
        editCellRenderer: ({ rowData }: { rowData: Record<string, any> }) => {
          if (rowData.__ep_table_v2_ghost_row__) {
            ghostRowRef = rowData
          }
          return (
            <button
              class="ghost-note-change"
              onClick={() => {
                rowData.note = 'typed'
              }}
            >
              change
            </button>
          )
        },
      },
    ])
    const data = ref([{ id: 'row-0', name: '', note: '' }])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        ghostTable
        editTable
      />
    ))

    let ghostInputs = wrapper.findAllComponents(InputStub)
    expect(ghostInputs[ghostInputs.length - 1].props('inputType')).toBe('')

    await wrapper.findAll('.ghost-note-change').at(-1)!.trigger('click')

    ghostInputs = wrapper.findAllComponents(InputStub)
    expect(ghostInputs[ghostInputs.length - 1].props('inputType')).toBe('error')
    expect(ghostInputs[ghostInputs.length - 1].props('infoTip')).toBe(
      'Required'
    )
  })

  test('does not apply required ghost-row error state until the row is touched', async () => {
    const SelectStub = defineComponent({
      name: 'ElSelect',
      props: {
        modelValue: {
          type: String,
          default: '',
        },
        inputType: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        return () => (
          <div class="select-stub" data-input-type={props.inputType}>
            {props.modelValue}
          </div>
        )
      },
    })

    let ghostRowRef: Record<string, any> | null = null
    const columns = ref([
      {
        key: 'qty',
        dataKey: 'qty',
        title: 'Qty',
        width: 180,
        required: true,
        editCellRenderer: ({
          cellData,
          rowData,
        }: {
          cellData: string
          rowData: Record<string, any>
        }) => {
          if (rowData.__ep_table_v2_ghost_row__) {
            ghostRowRef = rowData
          }
          return <SelectStub modelValue={cellData} />
        },
      },
      {
        key: 'note',
        dataKey: 'note',
        title: 'Note',
        width: 180,
        editCellRenderer: ({ rowData }: { rowData: Record<string, any> }) => {
          if (rowData.__ep_table_v2_ghost_row__) {
            ghostRowRef = rowData
          }
          return (
            <button
              class="ghost-prefilled-change"
              onClick={() => {
                rowData.note = 'changed'
              }}
            >
              change
            </button>
          )
        },
      },
    ])
    const data = ref([{ id: 'row-0', qty: '10', note: '' }])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        ghostTable
        editTable
        ghostRowTemplate={{ note: 'prefilled template value' }}
      />
    ))

    let ghostSelects = wrapper.findAllComponents(SelectStub)
    expect(ghostSelects[ghostSelects.length - 1].props('inputType')).toBe('')

    await wrapper.findAll('.ghost-prefilled-change').at(-1)!.trigger('click')

    ghostSelects = wrapper.findAllComponents(SelectStub)
    expect(ghostSelects[ghostSelects.length - 1].props('inputType')).toBe(
      'error'
    )
  })

  test('applies error inputType to required ghost-row selects once the row has values', async () => {
    const InputStub = defineComponent({
      name: 'ElInput',
      props: {
        modelValue: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        return () => <div class="input-stub">{props.modelValue}</div>
      },
    })

    const SelectStub = defineComponent({
      name: 'ElSelect',
      props: {
        modelValue: {
          type: String,
          default: '',
        },
        inputType: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        return () => (
          <div class="select-stub" data-input-type={props.inputType}>
            {props.modelValue}
          </div>
        )
      },
    })

    let ghostRowRef: Record<string, any> | null = null
    const columns = ref([
      {
        key: 'qty',
        dataKey: 'qty',
        title: 'Qty',
        width: 180,
        editCellRenderer: ({
          cellData,
          rowData,
        }: {
          cellData: string
          rowData: Record<string, any>
        }) => {
          if (rowData.__ep_table_v2_ghost_row__) {
            ghostRowRef = rowData
          }
          return <InputStub modelValue={cellData} />
        },
      },
      {
        key: 'unit',
        dataKey: 'unit',
        title: 'Unit',
        width: 180,
        required: true,
        editCellRenderer: ({
          cellData,
          rowData,
        }: {
          cellData: string
          rowData: Record<string, any>
        }) => {
          if (rowData.__ep_table_v2_ghost_row__) {
            ghostRowRef = rowData
          }
          return <SelectStub modelValue={cellData} />
        },
      },
    ])
    const data = ref([{ id: 'row-0', qty: '', unit: '' }])
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
        ghostTable
        editTable
      />
    ))

    let ghostSelects = wrapper.findAllComponents(SelectStub)
    expect(ghostSelects[ghostSelects.length - 1].props('inputType')).toBe('')

    ghostRowRef!.qty = '1'
    ghostRowRef!.note = 'typed'
    ghostRowRef!.__ep_table_v2_ghost_row_touched__ = true
    await nextTick()

    ghostSelects = wrapper.findAllComponents(SelectStub)
    expect(ghostSelects[ghostSelects.length - 1].props('inputType')).toBe(
      'error'
    )
  })

  test('validateRequiredColumns returns false when required table data is empty', async () => {
    const columns = ref([
      {
        key: 'name',
        dataKey: 'name',
        title: 'Name',
        width: 180,
        required: true,
      },
    ])
    const data = ref([{ id: 'row-0', name: '' }])
    const table = ref<any>()
    const wrapper = mount(() => (
      <TableV2
        ref={table}
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
      />
    ))

    expect(table.value?.validateRequiredColumns()).toBe(false)

    data.value[0].name = 'Filled'
    await nextTick()

    expect(table.value?.validateRequiredColumns()).toBe(true)
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

  test('adds required-column class to header and body cells when column.required is true', async () => {
    const columns = ref([
      {
        ...generateColumns(1)[0],
        required: true,
      },
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
      />
    ))

    const headerCell = wrapper.find('.el-table-v2__header-cell')
    const bodyCell = wrapper.find('.el-table-v2__row-cell')

    expect(headerCell.classes()).toContain('required-column')
    expect(bodyCell.classes()).toContain('required-column')
  })

  test('renders diagonal header content and diagonal classes from the column config', async () => {
    const columns = ref([
      {
        ...generateColumns(1)[0],
        diagonalHeader: {
          from: 'From',
          to: 'To',
        },
      },
      generateColumns(1, 'state-')[0],
    ])
    const data = ref(generateData(columns.value, 1))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
      />
    ))

    const headerCells = wrapper.findAll('.el-table-v2__header-cell')
    const bodyCells = wrapper.findAll('.el-table-v2__row-cell')
    const diagonalTexts = headerCells[0].findAll(
      '.el-table-v2__diagonal-header-text'
    )

    expect(headerCells[0].classes()).toContain('is-diagonal-header')
    expect(headerCells[1].classes()).not.toContain('is-diagonal-header')
    expect(bodyCells[0].classes()).toContain('is-diagonal-header-column')
    expect(bodyCells[1].classes()).not.toContain('is-diagonal-header-column')
    expect(diagonalTexts.map((node) => node.text())).toEqual(['From', 'To'])
  })

  test('updates the column width and emits header-dragend when resizing ends', async () => {
    const columns = ref(generateColumns(2))
    const data = ref(generateData(columns.value, 5))
    const wrapper = mount(() => (
      <TableV2
        columns={columns.value}
        data={data.value}
        width={700}
        height={400}
      />
    ))

    const headerCell = wrapper.findAll('.el-table-v2__header-cell')[0]
    const resizer = headerCell.find('.el-table-v2__column-resizer')

    expect(resizer.exists()).toBe(true)

    await resizer.trigger('mousedown', {
      clientX: 150,
      button: 0,
    })

    document.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: 190,
        bubbles: true,
      })
    )

    document.dispatchEvent(
      new MouseEvent('mouseup', {
        clientX: 190,
        bubbles: true,
      })
    )

    await nextTick()

    const emitted = wrapper.findComponent(TableV2).emitted('header-dragend')

    expect(headerCell.attributes('style')).toContain('width: 190px;')
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toBe(190)
    expect(emitted?.[0]?.[1]).toBe(150)
    expect(emitted?.[0]?.[2]).toMatchObject({
      key: columns.value[0].key,
      width: 190,
    })
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
    expect(count.text()).toBe('12 items')
    expect(time.text()).toBe('Last Updated 2026-07-07 12:30')
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
