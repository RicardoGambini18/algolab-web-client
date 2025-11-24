'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getSearchResults } from '~/api/movies'
import { ErrorState } from '~/components/error-state'
import { HeaderLayout } from '~/components/header-layout'
import { LoadingState } from '~/components/loading-state'
import { MetricSelect } from '~/components/metric-select'
import { ResultCard } from '~/components/result-card'
import { useAppStore } from '~/lib/app-store'
import { formatNumber } from '~/lib/format'
import { Metric } from '~/types/algorithm-result'

export default function SortAlgorithmsResults() {
  const router = useRouter()
  const [selectedMetric, setSelectedMetric] = useState<Metric>(Metric.TIME)

  const { selectedAlgorithms, selectedMovieIds } = useAppStore((state) => ({
    selectedMovieIds: state.searchAlgorithms.selectedMovieIds,
    selectedAlgorithms: state.searchAlgorithms.selectedAlgorithms,
  }))

  const {
    error,
    refetch,
    isLoading,
    data: results,
  } = useQuery({
    queryKey: ['get-search-results'],
    enabled: selectedAlgorithms.length > 0 && selectedMovieIds.length > 0,
    queryFn: async () => {
      try {
        return await getSearchResults({
          algorithms: selectedAlgorithms,
          movieIds: selectedMovieIds,
        })
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
    if (selectedAlgorithms.length === 0 || selectedMovieIds.length === 0) {
      router.push('/dashboard/search-algorithms/select-algorithms')
    }
  }, [selectedAlgorithms, selectedMovieIds, router])

  const helpDialog = {
    title: 'Interpretación del Informe',
    content: (
      <div className="space-y-5 text-sm">
        <section className="space-y-2">
          <p className="text-slate-300">
            Has completado el experimento. Este informe clasifica a los
            algoritmos analizando su desempeño desde cuatro dimensiones
            distintas.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Guía de Métricas
          </h3>
          <ul className="list-disc pl-5 text-slate-300 space-y-2">
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Tiempo de ejecución:
              </span>
              La velocidad real en tu procesador. Es lo que percibe el usuario
              final, aunque puede variar según la carga de tu PC.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Número de operaciones:
              </span>
              El &quot;esfuerzo&quot; teórico. Cuenta cuántas comparaciones,
              lecturas o movimientos realizó el algoritmo. Es la métrica más
              pura para validar la complejidad Big-O.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Número de iteraciones:
              </span>
              La cantidad de ciclos o vueltas que dio el algoritmo. Un número
              bajo aquí suele indicar estrategias inteligentes (como saltos
              logarítmicos) frente a la fuerza bruta.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Uso de memoria:
              </span>
              Indica cuánta RAM adicional necesitó el algoritmo para funcionar.
              Es vital para distinguir algoritmos que ordenan &quot;en su
              lugar&quot; (in-place) de aquellos que requieren copias auxiliares
              costosas[cite: 25, 48].
            </li>
          </ul>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Analizando al Ganador (#1)
          </h3>
          <p className="text-slate-300">
            El algoritmo en la primera posición logró el mejor balance según el
            criterio de ordenamiento que elijas. Recuerda: el más rápido no
            siempre es el mejor si consume demasiada memoria. Busca el
            equilibrio entre velocidad y recursos.
          </p>
        </section>
      </div>
    ),
  }

  if (isLoading) {
    return (
      <HeaderLayout
        title="Algoritmos de Búsqueda"
        subtitle="Paso 3: Comparación de resultados"
        backUrl="/dashboard/search-algorithms/select-algorithms"
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
        title="Algoritmos de Búsqueda"
        subtitle="Paso 3: Comparación de resultados"
        backUrl="/dashboard/search-algorithms/select-algorithms"
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
      helpDialog={helpDialog}
      title="Algoritmos de Búsqueda"
      subtitle="Paso 3: Comparación de resultados"
      backUrl="/dashboard/search-algorithms/select-algorithms"
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2 truncate">
            Informe de Rendimiento
          </h2>
          <p className="text-sm md:text-base text-slate-400">
            Análisis comparativo de{' '}
            <span className="font-medium text-white">
              {results?.length} algoritmos
            </span>{' '}
            sobre{' '}
            <span className="font-medium text-white">
              {formatNumber(results?.at(0)?.item_count ?? 0)} elementos
            </span>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <MetricSelect
            value={selectedMetric}
            className="w-full md:w-auto"
            onValueChange={setSelectedMetric}
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
