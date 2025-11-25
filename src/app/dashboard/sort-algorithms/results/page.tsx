'use client'

import { useQuery } from '@tanstack/react-query'
import { GitBranch, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getSortResults } from '~/api/movies'
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

  const helpDialog = {
    triggerLabel: 'Guía de métricas',
    title: 'Interpretación del Informe',
    content: (
      <div className="space-y-5 text-sm">
        <section className="space-y-2">
          <p className="text-slate-300">
            Este informe clasifica a los algoritmos analizando qué tan
            eficientemente lograron organizar el volumen total de datos.
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
              La velocidad real percibida. En ordenamiento, verás brechas
              enormes: un algoritmo lento podría tardar segundos, mientras uno
              rápido termina en milisegundos.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Número de operaciones:
              </span>
              El &quot;esfuerzo&quot; teórico. Suma cada vez que el algoritmo
              comparó dos valores o movió un dato de lugar. Es la prueba
              definitiva para confirmar si un algoritmo es Cuadrático (lento) o
              Logarítmico (rápido).
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Número de iteraciones:
              </span>
              Cantidad de ciclos realizados. Menos iteraciones suelen indicar
              estrategias de &quot;divide y vencerás&quot;, mientras que números
              altos sugieren bucles anidados.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Uso de memoria:
              </span>
              <span className="text-yellow-200 font-medium text-xs ml-1 uppercase tracking-wider">
                Clave en Ordenamiento
              </span>
              <br />
              Distingue a los algoritmos que ordenan &quot;in-place&quot;
              (reusan el mismo espacio, bajo consumo) de aquellos que crean
              copias completas de la estructura para poder organizarla (alto
              consumo).
            </li>
          </ul>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Analizando al Ganador (#1)
          </h3>
          <p className="text-slate-300">
            El algoritmo en la primera posición logró completar la tarea con el
            mejor balance. Sin embargo, revisa la columna de{' '}
            <strong>Memoria</strong>: a veces el algoritmo más rápido
            &quot;paga&quot; su velocidad consumiendo mucha más RAM que los
            demás.
          </p>
        </section>
      </div>
    ),
  }

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
      helpDialog={helpDialog}
      title="Algoritmos de Ordenamiento"
      backUrl="/dashboard/sort-algorithms/select"
      subtitle="Paso 2: Comparación de resultados"
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
