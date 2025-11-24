export enum Metric {
  TIME = 'time',
  MEMORY = 'memory',
  OPERATIONS = 'operations',
}

type AlgorithmMetric = {
  time: number
  memory: number
  operations: number
}

type SubAlgorithmMetric = AlgorithmMetric & {
  item_found_position?: number | null
}

export interface AlgorithmResult<T = object> {
  algorithm: string
  sorted_data?: T[]
  item_count: number
  needs_sort?: boolean
  item_found?: T | null
  data_structure: string
  metrics: AlgorithmMetric
  sub_metrics?: SubAlgorithmMetric[]
  item_found_position?: number | null
}
