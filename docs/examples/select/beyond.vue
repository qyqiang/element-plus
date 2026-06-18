<template>
  <h5>Base</h5>
  <div class="flex flex-wrap gap-4 items-center">
    <el-select
      v-model="value"
      clearable
      pre-star
      placeholder="float -value"
      label="label1"
      filterable
      :float-label="false"
      :filter-max-length="24"
      style="width: 240px"
    >
      <template #itemIcon="{ item: selectedItem, value: selectedValue }">
        <div>{{ selectedItem?.icon }} - {{ selectedValue }}</div>
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :raw-option="item"
      >
        <template #optionIcon="{ item: optionItem, value: selectedValue }">
          <div>{{ optionItem?.icon }} - {{ selectedValue }}</div>
        </template>
      </el-option>
    </el-select>
    <el-select
      v-model="value"
      clearable
      pre-star
      placeholder="Please Selectgg"
      label="label1"
      filterable
      :filter-max-length="24"
      add-item
      add-show-tip="test"
      style="width: 240px"
      @add-item="handleAdd"
    >
      <el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <template #optionIcon>
          <el-icon><info-filled></info-filled></el-icon>
        </template>
      </el-option>
    </el-select>
    <el-select
      v-model="value"
      clearable
      pre-star
      filterable
      placeholder="Please Select2"
      label="label1"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="value"
      clearable
      pre-star
      placeholder="Please Select"
      label="label1"
      label-suffix="Unit"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-select
      v-model="value2"
      :float-label="false"
      label-suffix="Unit"
      placeholder="Disabled"
      style="width: 240px"
      disabled
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #prefix>
        <span>$</span>
      </template>
    </el-select>
    <el-select
      v-model="value1"
      :float-label="false"
      multiple
      placeholder="Width Footer"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #footer>
        <div class="flex justify-between">
          <el-button type="primary">Cancel</el-button>
          <el-button>Reset</el-button>
        </div>
      </template>
    </el-select>
    <el-select
      v-model="value1"
      multiple
      placeholder="Width Have All"
      style="width: 240px"
      have-all="(All)"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #footer>
        <div class="flex justify-between">
          <el-button type="primary">Cancel</el-button>
          <el-button>Reset</el-button>
        </div>
      </template>
    </el-select>
  </div>

  <el-divider />
  <h5>Width Header</h5>
  <div class="flex flex-wrap gap-4 items-center">
    <el-select
      v-model="value2"
      :float-label="true"
      placeholder="Search Demo"
      style="width: 240px"
      clearable
    >
      <template #header>
        <el-input placeholder="Search" />
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="value2"
      :float-label="true"
      placeholder="Select"
      label-suffix="Unit"
      style="width: 240px"
      clearable
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #prefix>
        <span>$</span>
      </template>
    </el-select>
    <el-select
      v-model="value3"
      placeholder="Select"
      label-suffix="Unit"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="value4"
      placeholder="Select"
      label-suffix="Unit"
      :suffix-icon="Search"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #info>
        <el-tooltip content="info xx" placement="top" effect="light">
          <el-icon>
            <InfoFilled />
          </el-icon>
        </el-tooltip>
      </template>
    </el-select>
  </div>

  <el-divider />
  <h5>Select Menu</h5>

  <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option-group
      v-for="group in options2"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-option-group>
    <template #footer>
      <div class="flex justify-between">
        <el-button type="text">Reset</el-button>
        <div>
          <el-button type="primary">Cancel</el-button>
          <el-button>Reset</el-button>
        </div>
      </div>
    </template>
  </el-select>
  <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option-group
      v-for="group in options2"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <el-checkbox :label="item.label" @change="toggleOption" />
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { InfoFilled, Search } from '@element-plus/icons-vue'

const value = ref('Option1')
const value1 = ref([])
const value2 = ref('')
const value3 = ref('')
const value4 = ref('')
const selectedOptions = ref<string[]>([])
const toggleOption = (value) => {
  if (selectedOptions.value.includes(value)) {
    selectedOptions.value = selectedOptions.value.filter(
      (item) => item !== value
    )
  } else {
    selectedOptions.value.push(value)
  }
}
const options1 = ref([])
const options = ref([
  {
    value: 'Option1',
    label:
      'yyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhhyyyygggghhhh',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
])
const options2 = [
  {
    label: 'Popular cities',
    options: [
      {
        value: 'Shanghai',
        label: 'Shanghai',
      },
      {
        value: 'Beijing',
        label: 'Beijing',
      },
    ],
  },
  {
    label: 'City name',
    options: [
      {
        value: 'Chengdu',
        label: 'Chengdu',
      },
      {
        value: 'Shenzhen',
        label: 'Shenzhen',
      },
      {
        value: 'Guangzhou',
        label: 'Guangzhou',
      },
      {
        value: 'Dalian',
        label: 'Dalian',
      },
    ],
  },
]
const handleAdd = (val: string) => {
  options.value.push({
    value: val,
    label: val,
  })
}
</script>

<style scoped>
h5 {
  margin-bottom: 10px;
}
</style>
