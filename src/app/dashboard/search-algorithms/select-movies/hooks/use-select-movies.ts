import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { getMovies } from '~/api/movies'
import { useAppStore } from '~/lib/app-store'

const ITEM_GAP = 8
const ITEM_HEIGHT = 170
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ITEM_GAP

export const useSelectMovies = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [jumpToPosition, setJumpToPosition] = useState('')

  const {
    toggleMovie,
    isMovieSelected,
    clearSelectedMovieIds,
    getSelectedMoviesCount,
  } = useAppStore((state) => state.searchAlgorithms)

  const {
    error,
    refetch,
    isLoading,
    data: movies,
  } = useQuery({
    queryKey: ['get-movies'],
    queryFn: async () => {
      try {
        return await getMovies()
      } catch (error) {
        console.error('Error al obtener películas:', error)
        toast.error('Error al obtener películas')
        throw error
      }
    },
  })

  const virtualizer = useVirtualizer({
    count: movies?.length ?? 0,
    estimateSize: () => TOTAL_ITEM_HEIGHT,
    getScrollElement: () => containerRef.current,
  })

  const virtualItems = virtualizer.getVirtualItems()

  const scrollToPosition = (position: 'start' | 'middle' | 'end' | number) => {
    if (!containerRef.current) return

    switch (position) {
      case 'start': {
        virtualizer.scrollToIndex(0, { align: 'start' })
        break
      }
      case 'middle': {
        const middleIndex = Math.floor((movies?.length ?? 0) / 2)
        virtualizer.scrollToIndex(middleIndex, { align: 'center' })
        break
      }
      case 'end': {
        virtualizer.scrollToIndex((movies?.length ?? 0) - 1, { align: 'end' })
        break
      }
      default: {
        if (typeof position === 'number') {
          const targetIndex = Math.max(
            0,
            Math.min(position - 1, (movies?.length ?? 0) - 1)
          )
          virtualizer.scrollToIndex(targetIndex, { align: 'center' })
        }
      }
    }
  }

  const handleJumpToPosition = () => {
    const position = Number.parseInt(jumpToPosition)
    if (
      !Number.isNaN(position) &&
      position >= 1 &&
      position <= (movies?.length ?? 0)
    ) {
      scrollToPosition(position)
    }
  }

  return {
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
    clearSelectedMovieIds,
    getSelectedMoviesCount,
  }
}
