'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { EmptyState } from '~/components/empty-state'
import { ErrorState } from '~/components/error-state'
import { HeaderLayout } from '~/components/header-layout'
import { LoadingState } from '~/components/loading-state'
import { Button } from '~/components/ui/button'

import { SortedMovieCheckbox } from './components/sorted-movie-checkbox'
import { SortedMoviesFilter } from './components/sorted-movies-filter'
import { useSelectMovies } from './hooks/use-select-movies'

export default function SearchAlgorithmsSelectMovies() {
  const router = useRouter()

  const {
    error,
    movies,
    refetch,
    isLoading,
    virtualizer,
    ITEM_HEIGHT,
    toggleMovie,
    virtualItems,
    containerRef,
    jumpToPosition,
    isMovieSelected,
    scrollToPosition,
    setJumpToPosition,
    handleJumpToPosition,
    getSelectedMoviesCount,
  } = useSelectMovies()

  const handleContinue = () => {
    router.push(`/dashboard/search-algorithms/select-algorithms`)
  }

  const buttons = (
    <Button
      onClick={handleContinue}
      disabled={getSelectedMoviesCount() === 0}
      title="Continuar con las películas seleccionadas"
      className="bg-yellow-400 hover:bg-yellow-500 gap-1 text-black font-semibold"
    >
      <span className="hidden md:inline">Continuar</span>
      <span>({getSelectedMoviesCount()})</span>
      <ArrowRight className="w-4 h-4 block md:hidden" />
    </Button>
  )

  const helpDialog = {
    title: 'Definiendo los objetivos',
    content: (
      <div className="space-y-5 text-sm">
        <section className="space-y-2">
          <p className="text-slate-300">
            Antes de medir la velocidad de los algoritmos, necesitas definir
            &quot;qué&quot; deben encontrar.
          </p>
          <p className="text-slate-300">
            Cada película que selecciones aquí se convertirá en un caso de
            prueba independiente. El sistema ejecutará cada algoritmo contra
            todos tus objetivos seleccionados para generar métricas robustas.
          </p>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            ¿Por qué seleccionar varias?
          </h3>
          <ul className="list-disc pl-5 text-slate-300 space-y-2">
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Neutralizar el factor &quot;Suerte&quot;:
              </span>
              Buscar una película que está al inicio de la lista es trivial para
              cualquier algoritmo (incluso la Búsqueda Lineal). El verdadero
              reto está en los datos alejados o profundos.
            </li>
            <li className="leading-relaxed">
              <span className="font-medium text-white block">
                Promedios representativos:
              </span>
              Al final, no verás el resultado de una sola búsqueda, sino el{' '}
              <strong className="text-white">promedio de rendimiento</strong> de
              todas tus selecciones. Esto evita conclusiones sesgadas por un
              caso demasiado fácil o difícil.
            </li>
          </ul>
        </section>
        <section className="space-y-2">
          <h3 className="text-base font-semibold text-white">
            Navegación Estratégica
          </h3>
          <p className="text-slate-300">
            Dado que la lista está ordenada, hemos incluido atajos rápidos
            (botones superiores) para que puedas dispersar tus objetivos:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-center mt-2">
            <div className="bg-slate-700/50 p-2 rounded border border-slate-600">
              <span className="text-white font-medium block">Inicio</span>
              <span className="text-slate-400">Mejor caso Lineal</span>
            </div>
            <div className="bg-slate-700/50 p-2 rounded border border-slate-600">
              <span className="text-white font-medium block">Medio</span>
              <span className="text-slate-400">Caso promedio</span>
            </div>
            <div className="bg-slate-700/50 p-2 rounded border border-slate-600">
              <span className="text-white font-medium block">Final</span>
              <span className="text-slate-400">Peor caso Lineal</span>
            </div>
          </div>
        </section>
        <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/5 p-4 text-yellow-100">
          <p className="font-semibold text-yellow-300 mb-1 flex items-center gap-2">
            <span>💡</span> Tip del Laboratorio
          </p>
          <p className="text-yellow-100/90 leading-relaxed">
            Para simular un escenario real y equilibrado, usa los botones de
            navegación para seleccionar al menos 3 películas: una del{' '}
            <strong className="text-yellow-200">Inicio</strong>, una del{' '}
            <strong className="text-yellow-200">Medio</strong> y una del{' '}
            <strong className="text-yellow-200">Final</strong>.
          </p>
        </div>
      </div>
    ),
  }

  if (isLoading) {
    return (
      <HeaderLayout
        backUrl="/dashboard"
        title="Algoritmos de Búsqueda"
        subtitle="Paso 1: Selección de películas"
      >
        <LoadingState
          title="Cargando películas"
          description="Obteniendo la lista ordenada de películas disponibles..."
        />
      </HeaderLayout>
    )
  }

  if (error) {
    return (
      <HeaderLayout
        backUrl="/dashboard"
        title="Algoritmos de Búsqueda"
        subtitle="Paso 1: Selección de películas"
      >
        <ErrorState
          onRetry={() => refetch()}
          title="Error al cargar películas"
          description="No se pudieron cargar las películas disponibles. Verifica tu conexión a internet e intenta nuevamente."
        />
      </HeaderLayout>
    )
  }

  if (movies?.length === 0) {
    return (
      <HeaderLayout
        backUrl="/dashboard"
        title="Algoritmos de Búsqueda"
        subtitle="Paso 1: Selección de películas"
      >
        <EmptyState
          onRetry={() => refetch()}
          title="No se encontraron películas"
          description="No hay películas disponibles para seleccionar. Intenta recargar la página."
        />
      </HeaderLayout>
    )
  }

  return (
    <HeaderLayout
      backUrl="/dashboard"
      rightElement={buttons}
      helpDialog={helpDialog}
      title="Algoritmos de Búsqueda"
      subtitle="Paso 1: Selección de películas"
    >
      <SortedMoviesFilter
        jumpToPosition={jumpToPosition}
        maxPosition={movies?.length ?? 0}
        onJumpToPosition={handleJumpToPosition}
        onJumpToPositionChange={setJumpToPosition}
        onScrollToEnd={() => scrollToPosition('end')}
        onScrollToStart={() => scrollToPosition('start')}
        onScrollToMiddle={() => scrollToPosition('middle')}
      />
      <div
        ref={containerRef}
        style={{ contain: 'strict' }}
        className="h-[calc(100vh-233px)] overflow-y-auto pr-2"
      >
        <div
          style={{
            width: '100%',
            position: 'relative',
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualItems.map((virtualItem) => {
            const movie = movies?.[virtualItem.index]
            if (!movie) return null

            return (
              <div
                key={movie.id}
                style={{
                  top: 0,
                  left: 0,
                  width: '100%',
                  position: 'absolute',
                  height: `${ITEM_HEIGHT}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <SortedMovieCheckbox
                  movie={movie}
                  onToggle={toggleMovie}
                  index={virtualItem.index}
                  isSelected={isMovieSelected(movie.id)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </HeaderLayout>
  )
}
