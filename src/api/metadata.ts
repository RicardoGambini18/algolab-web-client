import { apiClient } from '~/lib/api-client'
import { type Metadata } from '~/types/metadata'

export const getMetadata = async () => {
  const { data } = await apiClient.get<Metadata>('/metadata')
  return data
}
