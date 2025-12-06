'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import {
  Check,
  Eye,
  EyeOff,
  HelpCircle,
  Lock,
  User as UserIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Controller, type SubmitHandler, useForm } from 'react-hook-form'

import { getUsers, login } from '~/api/auth'
import { Combobox } from '~/components/combobox'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { env } from '~/env'
import { handleApiError } from '~/lib/api-client'
import { appStore } from '~/lib/app-store'
import { cn } from '~/lib/utils'
import { type LoginInput, loginSchema } from '~/validations/auth'

const onSubmit: SubmitHandler<LoginInput> = async (data) => {
  try {
    const { token } = await login(data)
    appStore.getState().auth.login(token)
  } catch (error) {
    handleApiError(error)
  }
}

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: 0,
      password: '',
    },
  })

  const {
    data: users = [],
    error: usersError,
    isLoading: isUsersLoading,
  } = useQuery({
    queryKey: ['get-users'],
    queryFn: getUsers,
  })

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
      <form
        noValidate
        autoComplete="off"
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <Label htmlFor="user" className="text-slate-200 font-medium">
            Seleccionar Usuario
          </Label>
          <Controller
            name="userId"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <Combobox
                id="user"
                allowClear
                value={value}
                icon={UserIcon}
                onBlur={onBlur}
                options={users}
                className="w-full"
                onChange={onChange}
                estimatedOptionSize={52}
                getValue={(user) => user.id}
                getLabel={(user) => user.name}
                searchPlaceholder="Buscar usuario..."
                emptyText="No se encontró el usuario."
                disabled={isUsersLoading || !!usersError}
                placeholder={
                  isUsersLoading
                    ? 'Cargando usuarios...'
                    : 'Selecciona un usuario...'
                }
                renderSelectedOption={({ option: user }) => (
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback className="bg-slate-600 text-white text-xs">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col items-start min-w-0">
                      <span className="text-sm font-medium truncate w-full text-left">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-400 truncate w-full text-left">
                        {user.email}
                      </span>
                    </div>
                  </div>
                )}
                renderOption={({ option: user, checked }) => (
                  <div className="w-full flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      {user.image && (
                        <AvatarImage src={user.image} alt={user.name} />
                      )}
                      <AvatarFallback className="bg-slate-600 text-white text-sm">
                        <UserIcon className="h-4 w-4 text-slate-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-slate-400 text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        checked ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                )}
              />
            )}
          />
          {errors.userId && (
            <p className="text-red-400 text-sm mt-1">{errors.userId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-200 font-medium">
            Contraseña
          </Label>
          {!!env.NEXT_PUBLIC_PASSWORD_HINT && (
            <div className="flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-xs text-slate-400">
                {env.NEXT_PUBLIC_PASSWORD_HINT}
              </p>
            </div>
          )}
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value, onBlur, name } }) => (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  name={name}
                  id="password"
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  placeholder="Ingresa tu contraseña"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-11 pr-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400 focus:border-yellow-400/50 focus:ring-yellow-400/20 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2"></div>
              Iniciando Sesión...
            </div>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </form>
      {!!env.NEXT_PUBLIC_COURSE && (
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Proyecto final del curso {env.NEXT_PUBLIC_COURSE}
          </p>
        </div>
      )}
    </div>
  )
}
