export enum SortOrder {
  DEFAULT = '',
  ASC = 'asc',
  DESC = 'desc',
}

export enum Alignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum FixedDir {
  LEFT = 'left',
  RIGHT = 'right',
}

export const nextSortOrderMap = {
  [SortOrder.DEFAULT]: SortOrder.ASC,
  [SortOrder.ASC]: SortOrder.DESC,
  [SortOrder.DESC]: SortOrder.DEFAULT,
}

export const sortOrders = [
  SortOrder.DEFAULT,
  SortOrder.ASC,
  SortOrder.DESC,
] as const
