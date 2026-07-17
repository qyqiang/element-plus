<template>
  <h5>Base</h5>
  <div class="flex flex-wrap gap-4 items-center relative">
    <el-select
      v-model="value7"
      placeholder="Test Only 1"
      label="label1"
      :fit-input-width="false"
      :filter-max-length="24"
      :option-width="400"
      style="width: 240px"
    >
      <el-option :label="test" :value="1"> </el-option>
    </el-select>
    <el-select
      v-model="value"
      clearable
      pre-star
      placeholder="float -value"
      label="label1"
      :float-label="false"
      :fit-input-width="false"
      :filter-max-length="24"
      :option-width="400"
      style="width: 240px"
    >
      <template #itemIcon>
        <div>ddd</div>
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :raw-option="item"
      >
        <template #optionIcon>
          <el-icon>
            <info-filled></info-filled>
          </el-icon>
        </template>
      </el-option>
    </el-select>
    <el-select
      v-model="value"
      clearable
      pre-star
      placeholder="Please Selectgg"
      label="label1"
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
          <el-icon>
            <info-filled></info-filled>
          </el-icon>
        </template>
      </el-option>
    </el-select>
    <el-select
      v-model="value"
      clearable
      pre-star
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
    <div style="position: relative; height: 32px; width: 100%">
      <el-select
        v-model="value1"
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
    </div>
    <div style="position: relative; height: 32px; width: 100%">
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
          :disabled="true"
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
  <div class="demo-select-status">
    <el-select
      v-model="warningValue"
      input-type="warning"
      placeholder="Warning state"
    >
      <el-option
        v-for="item in optionsStyle"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="errorValue"
      input-type="error"
      placeholder="Error state"
    >
      <el-option
        v-for="item in optionsStyle"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="filledWarningValue"
      input-type="warning"
      placeholder="Filled warning"
    >
      <el-option
        v-for="item in optionsStyle"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="infoValue" input-type="info" placeholder="Info state">
      <el-option
        v-for="item in optionsStyle"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { InfoFilled, Search } from '@element-plus/icons-vue'

const warningValue = ref('')
const errorValue = ref('')
const filledWarningValue = ref('gravel')
const infoValue = ref('cement')

const optionsStyle = [
  { value: 'sand', label: 'Sand' },
  { value: 'gravel', label: 'Gravel' },
  { value: 'cement', label: 'Cement' },
]
const value = ref('Option1')
const value7 = ref()
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
    label: '45545',
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
  {
    value: 'Option6',
    label: '45545',
  },
  {
    value: 'Option7',
    label: 'Option2',
  },
  {
    value: 'Option8',
    label: 'Option3',
  },
  {
    value: 'Option9',
    label: 'Option4',
  },
  {
    value: 'Option10',
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
.demo-select-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
</style>
