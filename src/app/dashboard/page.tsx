'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, Search } from 'lucide-react'
import { toast } from 'sonner'

import { getDashboardDataStructures } from '~/api/movies'
import { EmptyState } from '~/components/empty-state'
import { ErrorState } from '~/components/error-state'
import { HeaderLayout } from '~/components/header-layout'
import { LoadingState } from '~/components/loading-state'
import { LogoutButton } from '~/components/logout-button'

import { ModuleCard } from './components/module-card'

export default function Dashboard() {
  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['dashboard-data-structures'],
    queryFn: async () => {
      try {
        return await getDashboardDataStructures()
      } catch (error) {
        console.error('Error al obtener estructuras del dashboard', error)
        toast.error('Error al obtener estructuras del dashboard')
        throw error
      }
    },
  })

  if (isLoading) {
    return (
      <HeaderLayout rightElement={<LogoutButton />}>
        <LoadingState
          title="Preparando tu laboratorio"
          description="Obteniendo las estructuras de datos disponibles para cada módulo..."
        />
      </HeaderLayout>
    )
  }

  if (error) {
    return (
      <HeaderLayout rightElement={<LogoutButton />}>
        <ErrorState
          onRetry={() => refetch()}
          title="No pudimos cargar los módulos"
          description="Revisa tu conexión o intenta nuevamente en unos segundos."
        />
      </HeaderLayout>
    )
  }

  if (!data) {
    return (
      <HeaderLayout rightElement={<LogoutButton />}>
        <EmptyState
          onRetry={() => refetch()}
          title="No hay datos disponibles"
          description="Aún no contamos con estructuras registradas para los módulos."
        />
      </HeaderLayout>
    )
  }

  const { sort, search } = data

  return (
    <HeaderLayout rightElement={<LogoutButton />} containerClassName="px-0">
      <div
        className="sticky top-0 z-10 mb-4 pb-4 md:mb-7 md:pb-7 bg-gradient-to-b from-slate-900/50 to-transparent backdrop-blur-md -mt-12 pt-12"
        style={{
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          width: '100vw',
        }}
      >
        <div className="container mx-auto px-4 max-w-[960px]">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Bienvenido a AlgoLab
          </h2>
          <p className="text-slate-400">
            Tu entorno experimental para analizar la eficiencia computacional.
            Ejecuta pruebas de rendimiento en tiempo real y visualiza el impacto
            de la complejidad Big-O.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-[960px]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard
            icon={BarChart3}
            title="Algoritmos de Ordenamiento"
            href="/dashboard/sort-algorithms/select"
            description="Pon a prueba distintas estrategias algorítmicas para organizar datos. Ejecuta comparativas de rendimiento masivas y analiza cómo la complejidad temporal y espacial impacta al procesar grandes volúmenes de información."
            structures={sort}
          />
          <ModuleCard
            icon={Search}
            title="Algoritmos de Búsqueda"
            href="/dashboard/search-algorithms/select-movies"
            description="Analiza distintas estrategias de recuperación de información sobre un dataset optimizado. Observa cómo la lógica interna de cada algoritmo (lineal, logarítmica o heurística) determina el rendimiento y el costo computacional al localizar datos específicos."
            structures={search}
          />
        </div>
      </div>
    </HeaderLayout>
  )
}
