'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getSortResults } from '~/api/movies'
import { ErrorState } from '~/components/error-state'
import { HeaderLayout } from '~/components/header-layout'
import { LoadingState } from '~/components/loading-state'
import { MetricSelect } from '~/components/metric-select'
import { ResultCard } from '~/components/result-card'
import { useAppStore } from '~/lib/app-store'
import { Metric } from '~/types/algorithm-result'

export default function SortAlgorithmsResults() {
  const router = useRouter()
  const [selectedMetric, setSelectedMetric] = useState<Metric>(Metric.TIME)

  const selectedAlgorithms = useAppStore(
    (state) => state.sortAlgorithms.selectedAlgorithms
  )

  const {
    error,
    refetch,
    isLoading,
    data: results,
  } = useQuery({
    queryKey: ['get-sort-results'],
    enabled: selectedAlgorithms.length > 0,
    queryFn: async () => {
      try {
        return await getSortResults({ algorithms: selectedAlgorithms })
      } catch (error) {
        console.error('Error al obtener resultados:', error)
        toast.error('Error al obtener resultados')
        throw error
      }
    },
  })

  const sortedResults = useMemo(() => {
    if (!results) return []

    return [...results].sort((a, b) => {
      return a.metrics[selectedMetric] - b.metrics[selectedMetric]
    })
  }, [results, selectedMetric])

  useEffect(() => {
    if (selectedAlgorithms.length === 0) {
      router.push('/dashboard/sort-algorithms/select')
    }
  }, [selectedAlgorithms, router])

  if (isLoading) {
    return (
      <HeaderLayout
        title="Algoritmos de Ordenamiento"
        backUrl="/dashboard/sort-algorithms/select"
        subtitle="Paso 2: Comparación de resultados"
      >
        <LoadingState
          title="Procesando algoritmos"
          description="Los algoritmos están siendo ejecutados y comparados. Esto puede tomar unos minutos dependiendo de la complejidad."
        />
      </HeaderLayout>
    )
  }

  if (error) {
    return (
      <HeaderLayout
        title="Algoritmos de Ordenamiento"
        backUrl="/dashboard/sort-algorithms/select"
        subtitle="Paso 2: Comparación de resultados"
      >
        <ErrorState
          onRetry={() => refetch()}
          title="Error al procesar algoritmos"
          description="Hubo un problema al ejecutar los algoritmos. Por favor, intenta nuevamente."
        />
      </HeaderLayout>
    )
  }

  return (
    <HeaderLayout
      title="Algoritmos de Ordenamiento"
      backUrl="/dashboard/sort-algorithms/select"
      subtitle="Paso 2: Comparación de resultados"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 truncate">
            Resultados de la comparación
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Comparando {results?.length} algoritmos
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <MetricSelect
            value={selectedMetric}
            onValueChange={setSelectedMetric}
            className="w-full md:w-auto"
          />
        </div>
      </div>
      <div className="space-y-4">
        {sortedResults.map((result, index) => (
          <ResultCard
            index={index}
            result={result}
            selectedMetric={selectedMetric}
            key={`${result.algorithm}-${result.data_structure}`}
          />
        ))}
      </div>
    </HeaderLayout>
  )
}
