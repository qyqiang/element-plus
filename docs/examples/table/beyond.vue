<template>
  <el-table
    :data="tableData"
    border
    tooltip-effect="light"
    style="width: 100%"
    max-height="250"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <el-table-column fixed :resizable="false" width="35">
      <template #default="scope">
        <el-tooltip :content="scope.row.name" effect="light">
          <el-icon class="warning"><WarningFilled /></el-icon>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column fixed type="selection" :resizable="false" width="35" />

    <el-table-column
      v-for="item in tableColumns"
      :key="item?.prop"
      :column-key="item?.id"
      :resizable="item?.resizable"
      :align="item?.align"
      :class-name="item?.className"
      :fixed="item?.fixed"
      :formatter="item?.formatter"
      :label="item?.label"
      :prop="item?.prop"
      :show-overflow-tooltip="item?.tooltip ?? true"
      :sortable="item?.sortable"
      :width="item?.width"
    >
      <template #default="{ row }">
        <ElTableEditableCell
          v-if="item?.editable"
          :row="row"
          :property="item?.prop"
          @on-submit="(val: string) => handleSubmit(val, item?.prop)"
        />
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="Operations" min-width="130">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow(scope.$index)"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElTableEditableCell } from '@element-plus/components/table'

interface User {
  id: number
  date: string
  name: string
  address: string
}

const multipleSelection = ref<User[]>([])

const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}
const handleSubmit = (value: string, prop: string) => {
  console.log('submit', value, prop)
}
const handleSortChange = ({ prop, order }) => {
  console.log(prop, order)
}
const tableData = ref([
  {
    id: 1,
    date: '2016-06-01',
    name: 'Tom1',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    age: 25,
  },
  {
    id: 2,
    date: '2016-05-02',
    name: 'Tom2',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    age: 24,
  },
  {
    id: 3,
    date: '2016-05-03',
    name: 'Tom3',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    age: 26,
  },
  {
    id: 4,
    date: '2016-05-04',
    name: 'Tom4',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    age: 27,
  },
  {
    id: 5,
    date: '2016-05-05',
    name: 'Tom5',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    age: 28,
  },
])

const tableColumns = ref<any[]>([
  {
    prop: 'name',
    label: 'Name',
    width: '120',
    fixed: true,
  },
  {
    prop: 'age',
    label: 'Age',
    width: '120',
    sortable: true,
  },
  {
    prop: 'date',
    label: 'Date',
    width: '120',
    sortable: true,
  },
  {
    prop: 'state',
    label: 'State',
    width: '120',
  },
  {
    prop: 'city',
    label: 'City',
    width: '120',
  },
  {
    prop: 'address',
    label: 'Address',
    width: '220',
    editable: true,
  },
  {
    prop: 'zip',
    label: 'Zip',
    width: '120',
    editable: true,
  },
])
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
}
</script>
