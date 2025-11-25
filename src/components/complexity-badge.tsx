import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

import { Badge } from '~/components/ui/badge'
import { ComplexityLevel } from '~/types/algorithm-result'

interface ComplexityBadgeProps {
  expression: string
  complexity: ComplexityLevel
}

const getComplexityBadgeClass = (complexity: ComplexityLevel) => {
  switch (complexity) {
    case ComplexityLevel.HIGH: {
      return 'border-red-500/50 text-red-400 bg-red-500/10'
    }
    case ComplexityLevel.MEDIUM: {
      return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
    }
    case ComplexityLevel.LOW: {
      return 'border-green-500/50 text-green-400 bg-green-500/10'
    }
  }
}

export const ComplexityBadge = ({
  expression,
  complexity,
}: ComplexityBadgeProps) => {
  return (
    <Badge variant="outline" className={getComplexityBadgeClass(complexity)}>
      <InlineMath math={expression} />
    </Badge>
  )
}
