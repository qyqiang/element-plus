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

  test('shows add-column button in editable mode and emits add-column after the last data column', async () => {
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

    const trigger = wrapper.find('.el-table-v2__header-add-column-button')
    const table = wrapper.findComponent(TableV2)

    expect(trigger.exists()).toBe(true)

    await trigger.trigger('click')

    expect(table.emitted('add-column')).toEqual([
      [
        expect.objectContaining({
          columnIndex: 2,
          insertIndex: 3,
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
    expect(wrapper.findAll('.edit-cell')).toHaveLength(2)
    expect(wrapper.findAll('.view-cell')).toHaveLength(0)
    expect(wrapper.findAll('.el-table-v2__row-delete-button')).toHaveLength(0)
    expect(
      wrapper
        .findAll('.el-table-v2__row-cell')
        .every((node) => node.classes().includes('is-full-width'))
    ).toBe(true)
    expect(
      wrapper.findAll('.el-table-v2__add-row-main .icon-button')
    ).toHaveLength(1)
    expect(
      wrapper.find('.el-table-v2__add-row-main .edit-cell').exists()
    ).toBe(false)
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
        editCellRenderer: ({ cellData, column }: { cellData: string; column: any }) => (
          <InputStub modelValue={cellData} placeholder={column.title} />
        ),
      },
      {
        key: 'action',
        dataKey: 'action',
        title: 'Action',
        width: 36,
      },
    ])
    const data = ref([{ id: 'row-0', name: 'Alpha', action: '' }])
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
    const addButton = ghostRow.find('.icon-button')
    const table = wrapper.findComponent(TableV2)

    expect(ghostRow.findAll('.edit-cell')).toHaveLength(1)
    expect(ghostRow.find('.edit-cell').attributes('placeholder')).toBe('Name')

    await addButton.trigger('click')

    expect(onAddGhostRow).toHaveBeenCalledTimes(1)
    expect(table.emitted('add-ghost-row')).toEqual([
      [
        expect.objectContaining({
          rowIndex: -1,
          rowKey: 'ghost-row',
          row: expect.objectContaining({
            __ep_table_v2_ghost_row__: true,
          }),
        }),
      ],
    ])
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

    const addButton = wrapper.find('.el-table-v2__add-row-main .icon-button')
    const table = wrapper.findComponent(TableV2)

    expect(addButton.attributes('disabled')).toBeDefined()

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
    expect(ghostInputs[ghostInputs.length - 2].props('inputType')).toBe('')

    ghostRowRef!.note = 'typed'
    await nextTick()

    ghostInputs = wrapper.findAllComponents(InputStub)
    expect(ghostInputs[ghostInputs.length - 1].props('inputType')).toBe(
      'error'
    )
    expect(ghostInputs[ghostInputs.length - 1].props('infoTip')).toBe(
      'Required'
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
