'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CheckSquare, Info, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { getSortDataStructures } from '~/api/movies'
import { AlgorithmCheckbox } from '~/components/algorithm-checkbox'
import { DataStructureSection } from '~/components/data-structure-section'
import { EmptyState } from '~/components/empty-state'
import { ErrorState } from '~/components/error-state'
import { HeaderLayout } from '~/components/header-layout'
import { LoadingState } from '~/components/loading-state'
import { Button } from '~/components/ui/button'
import { useAppStore } from '~/lib/app-store'

export default function SortAlgorithmsSelect() {
  const router = useRouter()

  const {
    isAllSelected,
    toggleSelectAll,
    toggleAlgorithm,
    getSelectedCount,
    isAlgorithmSelected,
  } = useAppStore((state) => state.sortAlgorithms)

  const {
    error,
    refetch,
    isLoading,
    data: dataStructures,
  } = useQuery({
    queryKey: ['get-sort-data-structures'],
    queryFn: getSortDataStructures,
  })

  const handleContinue = () => {
    router.push('/dashboard/sort-algorithms/results')
  }

  const buttons = dataStructures && (
    <>
      <Button
        variant="outline"
        onClick={() => toggleSelectAll(dataStructures)}
        className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
      >
        {isAllSelected(dataStructures) ? (
          <CheckSquare className="w-4 h-4" />
        ) : (
          <Square className="w-4 h-4" />
        )}
        {isAllSelected(dataStructures) ? (
          <span className="hidden md:inline">Deseleccionar todos</span>
        ) : (
          <span className="hidden md:inline">Seleccionar todos</span>
        )}
      </Button>
      <Button
        onClick={handleContinue}
        disabled={getSelectedCount() === 0}
        title="Continuar con los algoritmos seleccionados"
        className="bg-yellow-400 hover:bg-yellow-500 gap-1 text-black font-semibold"
      >
        <span className="hidden md:inline">Continuar</span>
        <span>({getSelectedCount()})</span>
        <ArrowRight className="w-4 h-4 block md:hidden" />
      </Button>
    </>
  )

  const helpDialog = {
    title: 'Guía de selección',
    content: (
      <div className="space-y-5 text-sm">
        <section className="space-y-2">
          <p className="text-slate-300">
            En este paso defines los participantes del experimento.
          </p>
          <p className="text-slate-300">
            El objetivo es contrastar diferentes enfoques lógicos. Al
            seleccionar múltiples algoritmos, podrás ejecutar una carrera en
            tiempo real para determinar cuál organiza los datos más rápido y con
            menor consumo de recursos.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Diferencia de Complejidades
          </h3>
          <p className="text-slate-300">
            Cada algoritmo tiene una &quot;personalidad&quot; matemática.
            Encontrarás desde métodos sencillos pero costosos (generalmente
            marcados en <span className="text-red-400 font-medium">rojo</span> o{' '}
            <span className="text-yellow-400 font-medium">amarillo</span>) hasta
            estrategias avanzadas de &quot;divide y vencerás&quot; (marcadas en{' '}
            <span className="text-green-400 font-medium">verde</span>).
          </p>
          <p className="text-slate-300">
            Mezclar ambos tipos hará evidente la brecha de eficiencia en las
            gráficas.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            El impacto de la Estructura
          </h3>
          <p className="text-slate-300">
            No es lo mismo ordenar con acceso libre a cualquier posición que
            hacerlo bajo restricciones estrictas (como acceso solo al inicio o
            al final).
          </p>
          <p className="text-slate-300">
            Observa cómo la naturaleza de la estructura de datos obliga a
            ciertos algoritmos a realizar muchas más operaciones para lograr el
            mismo resultado.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            ¿Qué observar en los resultados?
          </h3>
          <ul className="list-disc pl-5 text-slate-300 space-y-2">
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Tiempo vs. Operaciones:
              </span>
              Un algoritmo puede hacer menos operaciones pero tardar más tiempo
              si la estructura de datos es lenta de manipular.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Costo de Memoria:
              </span>
              Revisa la &quot;Complejidad Espacial&quot; en las tarjetas.
              Algunos algoritmos ordenan &quot;en su sitio&quot; (in-place),
              mientras que otros necesitan duplicar la memoria para funcionar.
            </li>
          </ul>
        </section>
        <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/5 p-4 text-yellow-100">
          <p className="font-semibold text-yellow-300 mb-1 flex items-center gap-2">
            <span>💡</span> Tip del Laboratorio
          </p>
          <p className="text-yellow-100/90 leading-relaxed">
            Para un análisis rico, selecciona siempre al menos un algoritmo con
            complejidad alta (ej.{' '}
            <code className="font-mono text-xs bg-yellow-400/20 px-1 rounded">
              O(n²)
            </code>
            ) y uno con complejidad baja (ej.{' '}
            <code className="font-mono text-xs bg-green-400/20 px-1 rounded">
              O(n log n)
            </code>
            ) para validar visualmente la teoría Big-O.
          </p>
        </div>
      </div>
    ),
  }

  if (isLoading) {
    return (
      <HeaderLayout
        backUrl="/dashboard"
        title="Algoritmos de Ordenamiento"
        subtitle="Paso 1: Selección de algoritmos"
      >
        <LoadingState
          title="Cargando algoritmos"
          description="Obteniendo la lista de algoritmos disponibles para comparar..."
        />
      </HeaderLayout>
    )
  }

  if (error) {
    return (
      <HeaderLayout
        backUrl="/dashboard"
        title="Algoritmos de Ordenamiento"
        subtitle="Paso 1: Selección de algoritmos"
      >
        <ErrorState
          onRetry={() => refetch()}
          title="Error al cargar algoritmos"
          description="No se pudieron cargar los algoritmos disponibles. Verifica tu conexión a internet e intenta nuevamente."
        />
      </HeaderLayout>
    )
  }

  if (!dataStructures || dataStructures.length === 0) {
    return (
      <HeaderLayout
        backUrl="/dashboard"
        title="Algoritmos de Ordenamiento"
        subtitle="Paso 1: Selección de algoritmos"
      >
        <EmptyState
          onRetry={() => refetch()}
          title="No se encontraron algoritmos"
          description="No hay algoritmos disponibles para comparar en este momento. Intenta recargar la página."
        />
      </HeaderLayout>
    )
  }

  return (
    <HeaderLayout
      backUrl="/dashboard"
      rightElement={buttons}
      helpDialog={helpDialog}
      title="Algoritmos de Ordenamiento"
      subtitle="Paso 1: Selección de algoritmos"
    >
      <div className="space-y-6">
        {dataStructures.map((dataStructure) => (
          <DataStructureSection
            icon={Info}
            key={dataStructure.key}
            name={dataStructure.name}
            description={dataStructure.description}
          >
            {dataStructure.algorithms.map((algorithm) => (
              <AlgorithmCheckbox
                key={algorithm.key}
                algorithm={algorithm}
                onToggle={() =>
                  toggleAlgorithm({
                    algorithmKey: algorithm.key,
                    dataStructureKey: dataStructure.key,
                  })
                }
                isSelected={isAlgorithmSelected({
                  algorithmKey: algorithm.key,
                  dataStructureKey: dataStructure.key,
                })}
              />
            ))}
          </DataStructureSection>
        ))}
      </div>
    </HeaderLayout>
  )
}
