import { apiClient } from '~/lib/api-client'
import {
  type GetSearchResultsInput,
  type GetSortResultsInput,
} from '~/types/algorithm-input'
import { type AlgorithmResult } from '~/types/algorithm-result'
import { type DataStructure } from '~/types/data-structure'
import { type Movie } from '~/types/movie'

export const getSortDataStructures = async () => {
  const { data } = await apiClient.get<DataStructure[]>(
    '/movies/sort/data-structures'
  )
  return data
}

export const getSortResults = async (input: GetSortResultsInput) => {
  const { algorithms, includeResult } = input

  if (algorithms.length === 0) {
    return []
  }

  const results: AlgorithmResult<Movie>[] = []

  for (const { algorithmKey, dataStructureKey } of algorithms) {
    const { data } = await apiClient.get<AlgorithmResult<Movie>>(
      '/movies/sort',
      {
        params: {
          algorithm_key: algorithmKey,
          include_result: includeResult,
          data_structure_key: dataStructureKey,
        },
      }
    )

    results.push(data)
  }

  return results
}

export const getMovies = async () => {
  const { data } = await apiClient.get<Movie[]>('/movies')
  return data
}

export const getSearchDataStructures = async () => {
  const { data } = await apiClient.get<DataStructure[]>(
    '/movies/search/data-structures'
  )
  return data
}

export const getSearchResults = async (input: GetSearchResultsInput) => {
  const { movieIds, algorithms, includeResult } = input

  if (movieIds.length === 0 || algorithms.length === 0) {
    return []
  }

  const results: AlgorithmResult<Movie>[] = []

  for (const { algorithmKey, dataStructureKey } of algorithms) {
    const subResults: AlgorithmResult<Movie>[] = []

    for (const movieId of movieIds) {
      const { data } = await apiClient.get<AlgorithmResult<Movie>>(
        '/movies/search',
        {
          params: {
            movie_id: movieId,
            algorithm_key: algorithmKey,
            include_result: includeResult,
            data_structure_key: dataStructureKey,
          },
        }
      )

      subResults.push(data)
    }

    if (subResults.length === 0) continue

    const firstResult = subResults[0]
    if (!firstResult) continue

    const averageTime =
      subResults.reduce((acc, curr) => acc + curr.metrics.time, 0) /
      subResults.length

    const averageMemory =
      subResults.reduce((acc, curr) => acc + curr.metrics.memory, 0) /
      subResults.length

    const averageComparisons =
      subResults.reduce((acc, curr) => acc + curr.metrics.comparisons, 0) /
      subResults.length

    results.push({
      ...firstResult,
      sub_metrics: subResults.map((result) => ({
        ...result.metrics,
        item_found_position: result.item_found_position,
      })),
      metrics: {
        time: averageTime,
        memory: averageMemory,
        comparisons: averageComparisons,
      },
    })
  }

  return results
}
