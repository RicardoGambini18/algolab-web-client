import { type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

interface ModuleCardProps {
  href: string
  title: string
  icon: LucideIcon
  iconColor?: string
  description: string
  structures: string[]
}

export function ModuleCard({
  href,
  title,
  icon: Icon,
  description,
  structures = [],
  iconColor = 'text-yellow-400',
}: Readonly<ModuleCardProps>) {
  return (
    <Card className="glass bg-slate-800/40 border-slate-700/50 transition-all duration-300 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 bg-yellow-400/20 rounded-full">
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        <CardTitle className="text-white mb-2">{title}</CardTitle>
        {structures.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {structures.map((structure) => (
              <Badge
                key={structure}
                variant="outline"
                className="text-xs text-slate-300 border-slate-600"
              >
                {structure}
              </Badge>
            ))}
          </div>
        )}
        <CardDescription className="text-slate-400 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-4">
        <Button
          variant="default"
          asChild
          className="w-full bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-300 hover:text-slate-900 shadow-lg shadow-yellow-400/20 border-0 transition-all"
        >
          <Link href={href}>Iniciar Pruebas</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
