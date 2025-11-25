import { ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode } from 'react'

import { Logo } from '~/components/logo'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

interface HeaderLayoutProps {
  title?: string
  backUrl?: string
  subtitle?: string
  children: ReactNode
  rightElement?: ReactNode
  helpDialog?: {
    title: string
    content: ReactNode
    triggerLabel?: string
    confirmLabel?: string
  }
}

export function HeaderLayout({
  backUrl,
  children,
  subtitle,
  rightElement,
  helpDialog,
  title = 'Algolab',
}: Readonly<HeaderLayoutProps>) {
  const HelpButton = helpDialog ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent gap-2"
        >
          <Info className="w-4 h-4" />
          <span className="hidden md:inline">
            {helpDialog.triggerLabel ?? 'Sobre este paso'}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 text-slate-100 border-slate-700 w-full max-w-[calc(100%-3rem)] sm:max-w-2xl max-h-[calc(100vh-3rem)] sm:max-h-[85vh] rounded-2xl shadow-2xl flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 sm:px-6 pt-6 sm:pt-6 pb-4 flex-shrink-0 border-b border-slate-700/50">
          <DialogTitle className="text-xl text-white">
            {helpDialog.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 sm:px-6 py-4">
          <div className="space-y-4 text-slate-200 leading-relaxed">
            {helpDialog.content}
          </div>
        </div>
        <div className="px-6 sm:px-6 pt-4 pb-6 sm:pb-6 flex justify-end flex-shrink-0 border-t border-slate-700/50">
          <DialogClose asChild>
            <Button className="w-full sm:w-auto bg-yellow-400 text-slate-900 font-semibold hover:bg-yellow-300">
              {helpDialog.confirmLabel ?? 'Entendido'}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ) : null

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      <header className="border-b border-slate-700/50 glass-light bg-slate-900/30 flex-shrink-0 relative z-20">
        <div className="container mx-auto px-4 gap-3 h-[76px] flex items-center justify-between max-w-[960px]">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {backUrl && (
              <Link href={backUrl}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-slate-800 flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <div className="hidden md:flex items-center justify-center w-10 h-10 flex-shrink-0">
              <Logo className="w-10 h-10" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-lg leading-tight font-bold text-white truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-slate-300 leading-tight truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {(HelpButton || rightElement) && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {HelpButton}
              {rightElement}
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-[960px]">
          {children}
        </div>
      </main>
    </div>
  )
}
