import axios, { AxiosError } from 'axios'

import { env } from '~/env'
import { appStore } from '~/lib/app-store'

export const apiClient = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}/api`,
})

apiClient.interceptors.request.use((config) => {
  const token = appStore.getState().auth.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error instanceof AxiosError && error.response?.status === 401) {
      appStore.getState().auth.logout()
    }

    return Promise.reject(
      error instanceof AxiosError
        ? error
        : new Error('An unknown error occurred')
    )
  }
)
