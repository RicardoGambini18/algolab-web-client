import { ComplexityLevel } from '~/types/algorithm-result'

export interface Algorithm {
  key: string
  name: string
  description: string
  needs_sort?: boolean
  time_complexity: string
  space_complexity: string
  time_complexity_level: ComplexityLevel
  space_complexity_level: ComplexityLevel
}

export interface DataStructure {
  key: string
  name: string
  description: string
  algorithms: Algorithm[]
}
