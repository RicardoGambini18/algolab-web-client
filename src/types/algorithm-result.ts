export enum Metric {
  TIME = 'time',
  MEMORY = 'memory',
  OPERATIONS = 'operations',
  ITERATIONS = 'iterations',
}

export enum ComplexityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

type AlgorithmMetric = {
  time: number
  memory: number
  operations: number
  iterations: number
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
  time_complexity: string
  metrics: AlgorithmMetric
  space_complexity: string
  sub_metrics?: SubAlgorithmMetric[]
  item_found_position?: number | null
  time_complexity_level: ComplexityLevel
  space_complexity_level: ComplexityLevel
}
