import { Award, Medal, Trophy } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { formatNumber } from '~/lib/format'
import { type AlgorithmResult, Metric } from '~/types/algorithm-result'

import { getMetricLabel, getMetricValue } from './metric-select'

interface ResultCardProps {
  index: number
  className?: string
  selectedMetric: Metric
  result: AlgorithmResult
}

const getRankIcon = (index: number) => {
  if (index === 0) return <Trophy className="w-5 h-5 text-yellow-400" />
  if (index === 1) return <Medal className="w-5 h-5 text-slate-200" />
  if (index === 2) return <Award className="w-5 h-5 text-orange-300" />
  return null
}

const getRankColor = (index: number) => {
  if (index === 0) return 'border-yellow-400/50 bg-yellow-400/10'
  if (index === 1) return 'border-slate-300/50 bg-slate-300/10'
  if (index === 2) return 'border-orange-300/50 bg-orange-300/10'
  return 'border-slate-700/50 bg-slate-900/20'
}

const getMetricHighlightColor = (index: number) => {
  if (index === 0) return 'bg-yellow-400/5 border-yellow-400/20 text-yellow-400'
  if (index === 1) return 'bg-slate-300/5 border-slate-300/20 text-slate-200'
  if (index === 2) return 'bg-orange-300/5 border-orange-300/20 text-orange-300'
  return 'bg-slate-700/5 border-slate-700/20 text-slate-300'
}

export const ResultCard = ({
  index,
  result,
  className = '',
  selectedMetric,
}: ResultCardProps) => {
  const hasSubMetrics = !!result.sub_metrics

  return (
    <Card
      className={`glass border-2 transition-all ${getRankColor(index)} ${className}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div>{getRankIcon(index)}</div>
            <div className="flex-1">
              <CardTitle className="text-white mb-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>{result.algorithm}</span>
                  <span className="text-slate-300 font-normal">•</span>
                  <span className="text-slate-300 font-medium">
                    {result.data_structure}
                  </span>
                </div>
              </CardTitle>
            </div>
          </div>
          <Badge variant="outline" className="border-slate-600 text-slate-300">
            Posición #{index + 1}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-light bg-slate-900/30 p-4 rounded-lg flex flex-col justify-between">
            <p className="text-xs text-slate-400 mb-1">Elementos procesados</p>
            <p className="text-xl font-bold text-white">
              {formatNumber(result.item_count)}
            </p>
          </div>
          <div className="glass-light bg-slate-900/30 p-4 rounded-lg flex flex-col justify-between">
            <p className="text-xs text-slate-400 mb-1">
              {getMetricLabel(Metric.COMPARISONS, hasSubMetrics)}
            </p>
            <p className="text-xl font-bold text-white">
              {getMetricValue(
                Metric.COMPARISONS,
                Math.round(result.metrics.comparisons)
              )}
            </p>
          </div>
          <div className="glass-light bg-slate-900/30 p-4 rounded-lg flex flex-col justify-between">
            <p className="text-xs text-slate-400 mb-1">
              {getMetricLabel(Metric.MEMORY, hasSubMetrics)}
            </p>
            <p className="text-xl font-bold text-white">
              {getMetricValue(Metric.MEMORY, result.metrics.memory)}
            </p>
          </div>
          <div className="glass-light bg-slate-900/30 p-4 rounded-lg flex flex-col justify-between">
            <p className="text-xs text-slate-400 mb-1">
              {getMetricLabel(Metric.TIME, hasSubMetrics)}
            </p>
            <p className="text-xl font-bold text-white">
              {getMetricValue(Metric.TIME, result.metrics.time)}
            </p>
          </div>
        </div>
        <div
          className={`mt-4 p-4 glass-light border rounded-lg ${getMetricHighlightColor(index)}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              {getMetricLabel(selectedMetric, hasSubMetrics)}
            </span>
            <span className="text-2xl font-bold">
              {getMetricValue(selectedMetric, result.metrics[selectedMetric])}
            </span>
          </div>
        </div>
        {hasSubMetrics && (
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem
              value="individual-results"
              className="border-slate-700/50"
            >
              <AccordionTrigger className="text-slate-300 hover:text-white hover:bg-slate-800/30 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer hover:no-underline">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Resultados Individuales
                  </span>
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-slate-400 text-xs"
                  >
                    {result.sub_metrics?.length ?? 0}
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {result.sub_metrics?.map((individualResult, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3"
                    >
                      <div className="text-sm font-medium text-slate-300 mb-2">
                        Búsqueda #{idx + 1}{' '}
                        {typeof individualResult.item_found_position ===
                        'number'
                          ? `(Elemento #${individualResult.item_found_position})`
                          : '(Elemento no encontrado)'}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">
                            {getMetricLabel(Metric.COMPARISONS)}:
                          </span>
                          <span className="text-slate-300 ml-1">
                            {getMetricValue(
                              Metric.COMPARISONS,
                              Math.round(individualResult.comparisons)
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">
                            {getMetricLabel(Metric.MEMORY)}:
                          </span>
                          <span className="text-slate-300 ml-1">
                            {getMetricValue(
                              Metric.MEMORY,
                              individualResult.memory
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">
                            {getMetricLabel(Metric.TIME)}:
                          </span>
                          <span className="text-slate-300 ml-1">
                            {getMetricValue(Metric.TIME, individualResult.time)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  )
}
