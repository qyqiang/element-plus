<template>
  <div class="editable-row-demo">
    <el-table
      ref="table"
      :data="tableData"
      border
      editable
      row-key="id"
      max-height="800px"
      class="quick-table"
      style="width: 100%"
    >
      <el-table-column label="Product">
        <template #default="{ row, $index, cellIndex }">
          <ElTableEditableCell
            :cell-data="{ row, rowIndex: $index, cellIndex }"
            property="product"
          />
        </template>
      </el-table-column>

      <el-table-column label="Qty" width="160">
        <template #default="{ row, $index, cellIndex }">
          <ElTableEditableCell
            :cell-data="{ row, rowIndex: $index, cellIndex }"
            property="qty"
            :is-number="{ place: 2 }"
          />
        </template>
      </el-table-column>

      <el-table-column label="Unit" :show-overflow-tooltip="true">
        <template #default="{ row, $index, cellIndex }">
          <ElTableEditableCell
            :cell-data="{ row, rowIndex: $index, cellIndex }"
            property="unitValue"
            display-key="unit"
            editor="select"
            :options="unitOptions"
          />
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="{ row, $index }">
          <ElTableEditableRowActions :row="row" :before-save="beforeSave">
            <el-dropdown
              class="mr-2 ml-14"
              placement="bottom-end"
              trigger="click"
              @command="handleCommand($event, row, $index)"
            >
              <el-button class="icon-button" type="text" @click.stop
                >sdsdsd</el-button
              >
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">
                    <span class="flex-center text-gray-990">
                      Delete
                    </span></el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </ElTableEditableRowActions>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTableEditableCell, ElTableEditableRowActions } from 'element-plus'

interface CurrentContainedRow {
  id: number
  product: string
  qty: string
  unit: string
  unitValue: string
}

const tableData = ref<CurrentContainedRow[]>([
  {
    id: 1,
    product: 'Sand',
    qty: '1000',
    unit: 'lbs',
    unitValue: '232',
  },
  {
    id: 2,
    product: 'Sand',
    qty: '1000',
    unitValue: '1000',
    unit: 'lbslbslbslbslbslbslbslbslbslbslbslbslbslbslbslbslbslbslbslbslbslbs',
  },
])

const unitOptions = [
  {
    label: 'lbs',
    value: 'lbs',
  },
  {
    label: 'kg',
    value: 'kg',
  },
  {
    label: 'ton',
    value: 'ton',
  },
]

const beforeSave = async (row) => {
  console.log(row)
  await new Promise((resolve) => setTimeout(resolve, 1200))
}
const handleCommand = () => {
  //
}
</script>

<style scoped>
.editable-row-demo {
  padding: 8px 0;
}

.editable-row-demo__title {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1a1f36;
}

.editable-row-demo__subtitle {
  margin-bottom: 12px;
  font-size: 12px;
  color: #748aa1;
}
</style>
