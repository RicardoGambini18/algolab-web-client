'use client'

import { useQuery } from '@tanstack/react-query'
import { GitBranch, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getSearchResults } from '~/api/movies'
import { ErrorState } from '~/components/error-state'
import { HeaderLayout } from '~/components/header-layout'
import { LoadingState } from '~/components/loading-state'
import { MetricSelect } from '~/components/metric-select'
import { ResultCard } from '~/components/result-card'
import { Badge } from '~/components/ui/badge'
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
    triggerLabel: 'Guía de métricas',
    title: 'Interpretación del Informe',
    content: (
      <div className="space-y-5 text-sm">
        <section className="space-y-2">
          <p className="text-slate-300">
            Este informe presenta el rendimiento promedio de cada algoritmo al
            buscar todas las películas que seleccionaste.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Guía de Métricas
          </h3>
          <ul className="list-disc pl-5 text-slate-300 space-y-2">
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Tiempo promedio:
              </span>
              Cuánto tardó el algoritmo, en promedio, en encontrar uno de tus
              objetivos. Los algoritmos inteligentes (verdes) suelen ser casi
              instantáneos (µs).
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Número de operaciones:
              </span>
              Cuántas comparaciones o movimientos hizo para llegar al dato. Aquí
              verás la diferencia masiva entre revisar todo (Lineal) y usar
              atajos (Binaria).
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Número de iteraciones:
              </span>
              Cuántos ciclos necesitó. En búsqueda binaria, este número es
              pequeñísimo (logarítmico) comparado con la búsqueda lineal.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Uso de memoria:
              </span>
              Clave para diferenciar estructuras. Mientras la búsqueda en Vector
              casi no usa memoria extra, buscar en{' '}
              <strong className="text-white">Pila</strong> o{' '}
              <strong className="text-white">Cola</strong> dispara este valor
              porque necesitan estructuras auxiliares para no perder los datos
              al recorrerlos.
            </li>
          </ul>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Analizando al Ganador (#1)
          </h3>
          <p className="text-slate-300">
            El algoritmo #1 fue el más eficaz encontrando tus objetivos. Si ves
            que el ganador es una Búsqueda Binaria o de Interpolación, estás
            confirmando que el acceso aleatorio (Vectores) es muy superior al
            acceso restringido (Pilas/Colas) para tareas de recuperación.
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
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3 truncate">
            Informe de Rendimiento
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="glass border-slate-500/40 bg-slate-800/40 backdrop-blur-sm text-slate-200 px-3 py-1.5 text-sm shadow-lg shadow-black/20 hover:bg-slate-800/60 hover:border-slate-400/50 transition-all [&>svg]:size-3.5"
            >
              <GitBranch className="mr-1.5" />
              <span className="font-medium">
                {results?.length ?? 0} Algoritmos
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="glass border-slate-500/40 bg-slate-800/40 backdrop-blur-sm text-slate-200 px-3 py-1.5 text-sm shadow-lg shadow-black/20 hover:bg-slate-800/60 hover:border-slate-400/50 transition-all [&>svg]:size-3.5"
            >
              <Package className="mr-1.5" />
              <span className="font-medium">
                {formatNumber(results?.at(0)?.item_count ?? 0)} Elementos
              </span>
            </Badge>
          </div>
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
