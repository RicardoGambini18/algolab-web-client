import { Image as ImageIcon, Star } from 'lucide-react'
import { useState } from 'react'

import { Checkbox } from '~/components/ui/checkbox'
import { formatDate } from '~/lib/format'
import { type Movie } from '~/types/movie'

interface SortedMovieCheckboxProps {
  movie: Movie
  index: number
  isSelected: boolean
  onToggle: (movieId: number) => void
}

export function SortedMovieCheckbox({
  movie,
  index,
  onToggle,
  isSelected,
}: Readonly<SortedMovieCheckboxProps>) {
  const [showImagePlaceholder, setShowImagePlaceholder] = useState(
    () => !movie.poster_path
  )

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={() => onToggle(movie.id)}
      className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all h-[170px] ${
        isSelected
          ? 'bg-yellow-400/10 border-yellow-400/50'
          : 'glass bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
      }`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle(movie.id)
        }
      }}
    >
      <div className="flex-shrink-0 flex items-center justify-center px-2 min-w-10 h-10 md:min-w-12 md:h-12 bg-slate-900/50 rounded-lg border border-slate-700">
        <span className="text-base md:text-lg font-bold text-yellow-400">
          #{index + 1}
        </span>
      </div>
      <div className="hidden md:block flex-shrink-0 w-[90px] h-[135px] relative rounded overflow-hidden bg-slate-700">
        {showImagePlaceholder ? (
          <div className="flex items-center justify-center w-full h-full">
            <ImageIcon className="text-slate-400 w-8 h-8" />
          </div>
        ) : (
          <img
            loading="lazy"
            alt={movie.title_es ?? movie.title}
            onError={() => setShowImagePlaceholder(true)}
            className="absolute inset-0 h-full w-full object-cover"
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white line-clamp-1">
            {movie.title_es ?? movie.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 bg-slate-900/50 px-2 py-1 rounded">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="hidden md:inline text-xs text-slate-400">
              ({movie.vote_count.toLocaleString()})
            </span>
          </div>
        </div>
        {(movie.tagline_es ?? movie.tagline) && (
          <p className="text-sm text-yellow-400/80 italic line-clamp-1">
            &ldquo;{movie.tagline_es ?? movie.tagline}&rdquo;
          </p>
        )}
        <p className="text-sm text-slate-300 line-clamp-3">
          {movie.overview_es ?? movie.overview}
        </p>
        <div className="flex items-center gap-3 mt-auto">
          <span className="text-xs text-slate-500">ID: {movie.id}</span>
          <span className="text-xs text-slate-400">
            {formatDate(movie.release_date)}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(movie.id)}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="border-slate-600 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400 data-[state=checked]:text-black mt-1"
        />
      </div>
    </div>
  )
}
