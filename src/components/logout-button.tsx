'use client'

import { LogOut } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { appStore } from '~/lib/app-store'

const handleLogout = () => {
  appStore.getState().auth.logout()
}

export function LogoutButton() {
  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      size="sm"
      className="text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Cerrar Sesión</span>
    </Button>
  )
}
