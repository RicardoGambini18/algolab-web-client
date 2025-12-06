'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRight, CheckSquare, Info, Square } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { getSearchDataStructures } from '~/api/movies'
import { AlgorithmCheckbox } from '~/components/algorithm-checkbox'
import { DataStructureSection } from '~/components/data-structure-section'
import { EmptyState } from '~/components/empty-state'
import { ErrorState } from '~/components/error-state'
import { HeaderLayout } from '~/components/header-layout'
import { LoadingState } from '~/components/loading-state'
import { Button } from '~/components/ui/button'
import { useAppStore } from '~/lib/app-store'

export default function SearchAlgorithmsSelectAlgorithms() {
  const router = useRouter()

  const {
    toggleAlgorithm,
    selectedMovieIds,
    isAlgorithmSelected,
    isAllAlgorithmsSelected,
    toggleSelectAllAlgorithms,
    getSelectedAlgorithmsCount,
  } = useAppStore((state) => state.searchAlgorithms)

  const {
    error,
    refetch,
    isLoading,
    data: dataStructures,
  } = useQuery({
    queryKey: ['get-search-data-structures'],
    queryFn: getSearchDataStructures,
  })

  const handleContinue = () => {
    router.push(`/dashboard/search-algorithms/results`)
  }

  const buttons = dataStructures && (
    <>
      <Button
        variant="outline"
        onClick={() => toggleSelectAllAlgorithms(dataStructures)}
        className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
      >
        {isAllAlgorithmsSelected(dataStructures) ? (
          <CheckSquare className="w-4 h-4" />
        ) : (
          <Square className="w-4 h-4" />
        )}
        {isAllAlgorithmsSelected(dataStructures) ? (
          <span className="hidden md:inline">Deseleccionar todos</span>
        ) : (
          <span className="hidden md:inline">Seleccionar todos</span>
        )}
      </Button>
      <Button
        onClick={handleContinue}
        disabled={getSelectedAlgorithmsCount() === 0}
        title="Continuar con los algoritmos seleccionados"
        className="bg-yellow-400 hover:bg-yellow-500 gap-1 text-black font-semibold"
      >
        <span className="hidden md:inline">Continuar</span>
        <span>({getSelectedAlgorithmsCount()})</span>
        <ArrowRight className="w-4 h-4 block md:hidden" />
      </Button>
    </>
  )

  const helpDialog = {
    title: 'Estrategias de búsqueda',
    content: (
      <div className="space-y-5 text-sm">
        <section className="space-y-2">
          <p className="text-slate-300">
            Ya definiste &quot;qué&quot; buscar, ahora decide &quot;cómo&quot;
            hacerlo.
          </p>
          <p className="text-slate-300">
            En este paso seleccionas los competidores. Tu elección determinará
            si el sistema revisa dato por dato (fuerza bruta) o si utiliza
            atajos matemáticos para encontrar el objetivo instantáneamente.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Dime el color y te diré la velocidad
          </h3>
          <p className="text-slate-300">
            Observa las etiquetas de complejidad. Los algoritmos marcados en{' '}
            <span className="text-red-400 font-medium">rojo</span> o{' '}
            <span className="text-yellow-400 font-medium">amarillo</span> suelen
            revisar elemento por elemento. Los marcados en{' '}
            <span className="text-green-400 font-medium">verde</span> utilizan
            estrategias avanzadas para descartar grandes porciones de datos en
            cada paso.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            El límite lo pone la estructura
          </h3>
          <p className="text-slate-300">
            ¿Por qué algunos algoritmos parecen lentos obligatoriamente?
          </p>
          <p className="text-slate-300">
            Ciertas estructuras de datos restringen el movimiento (solo permiten
            entrar/salir por un extremo), lo que <strong>anula</strong> la
            posibilidad de usar atajos. En esos casos, la única opción es
            recorrer todo el camino{' '}
            <code className="font-mono text-xs bg-slate-700 px-1 rounded">
              O(n)
            </code>
            , sin importar cuán ordenados estén los datos.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Impacto en los resultados
          </h3>
          <p className="text-slate-300">
            En listas grandes, la diferencia es matemática pura. Un algoritmo de
            revisión completa puede necesitar miles de operaciones, mientras que
            uno de acceso directo o predictivo podría encontrar el mismo dato en
            menos de 15 intentos.
          </p>
        </section>
        <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/5 p-4 text-yellow-100">
          <p className="font-semibold text-yellow-300 mb-1 flex items-center gap-2">
            <span>💡</span> Tip del Laboratorio
          </p>
          <p className="text-yellow-100/90 leading-relaxed">
            Para una comparativa rica, intenta seleccionar al menos una opción
            con complejidad alta (<span className="text-red-300">roja</span>/
            <span className="text-yellow-300">amarilla</span>) y una con
            complejidad baja (<span className="text-green-300">verde</span>).
            Así podrás validar visualmente la teoría Big-O.
          </p>
        </div>
      </div>
    ),
  }

  useEffect(() => {
    if (selectedMovieIds.length === 0) {
      router.push('/dashboard/search-algorithms/select-movies')
    }
  }, [selectedMovieIds, router])

  if (isLoading) {
    return (
      <HeaderLayout
        title="Algoritmos de Búsqueda"
        subtitle="Paso 2: Selección de algoritmos"
        backUrl="/dashboard/search-algorithms/select-movies"
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
        title="Algoritmos de Búsqueda"
        subtitle="Paso 2: Selección de algoritmos"
        backUrl="/dashboard/search-algorithms/select-movies"
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
        title="Algoritmos de Búsqueda"
        subtitle="Paso 2: Selección de algoritmos"
        backUrl="/dashboard/search-algorithms/select-movies"
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
      rightElement={buttons}
      helpDialog={helpDialog}
      title="Algoritmos de Búsqueda"
      subtitle="Paso 2: Selección de algoritmos"
      backUrl="/dashboard/search-algorithms/select-movies"
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
