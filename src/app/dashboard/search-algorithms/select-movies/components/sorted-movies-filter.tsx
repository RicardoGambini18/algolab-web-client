import { ChevronsDown, ChevronsUp, Minus, X } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

interface SortedMoviesFilterProps {
  maxPosition: number
  jumpToPosition: string
  onScrollToEnd: () => void
  onScrollToStart: () => void
  onJumpToPosition: () => void
  onClearSelection: () => void
  onScrollToMiddle: () => void
  disabledClearSelection: boolean
  onJumpToPositionChange: (position: string) => void
}

export function SortedMoviesFilter({
  maxPosition,
  onScrollToEnd,
  jumpToPosition,
  onScrollToStart,
  onJumpToPosition,
  onClearSelection,
  onScrollToMiddle,
  onJumpToPositionChange,
  disabledClearSelection,
}: Readonly<SortedMoviesFilterProps>) {
  return (
    <div className="sticky top-0 z-10 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onScrollToStart}
          className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          title="Ir al inicio"
        >
          <ChevronsUp className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline">Inicio</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onScrollToMiddle}
          className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          title="Ir al medio"
        >
          <Minus className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline">Medio</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onScrollToEnd}
          className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          title="Ir al final"
        >
          <ChevronsDown className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline">Final</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          disabled={disabledClearSelection}
          className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          title="Ir al final"
        >
          <X className="w-4 h-4 md:mr-1" />
          <span className="hidden md:inline">Limpiar selección</span>
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <Input
            type="number"
            placeholder="Posición"
            value={jumpToPosition}
            onChange={(e) => onJumpToPositionChange(e.target.value)}
            className="w-24 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            min="1"
            max={maxPosition}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onJumpToPosition}
            className="bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Ir
          </Button>
        </div>
      </div>
    </div>
  )
}
