import DatePickPanel from './date-picker-com/panel-date-pick.vue'
import DateRangePickPanel from './date-picker-com/panel-date-range.vue'
import MonthRangePickPanel from './date-picker-com/panel-month-range.vue'
import YearRangePickPanel from './date-picker-com/panel-year-range.vue'
import DateStartRangePickPanel from './date-picker-com/panel-start-range.vue'
import DateEndRangePickPanel from './date-picker-com/panel-end-range.vue'

import type { IDatePickerType } from './date-picker.type'

export const getPanel = function (type: IDatePickerType) {
  switch (type) {
    case 'daterange':
    case 'datetimerange': {
      return DateRangePickPanel
    }
    case 'datestartrange': {
      return DateStartRangePickPanel
    }
    case 'dateendrange': {
      return DateEndRangePickPanel
    }
    case 'monthrange': {
      return MonthRangePickPanel
    }
    case 'yearrange': {
      return YearRangePickPanel
    }
    default: {
      return DatePickPanel
    }
  }
}
