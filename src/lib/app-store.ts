import { mergeDeepLeft } from 'ramda'
import { create, useStore } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'

import { type DataStructure } from '~/types/data-structure'

interface AlgorithmOption {
  algorithmKey: string
  dataStructureKey: string
}

interface AppStore {
  isHydrated: boolean
  setIsHydrated: (isHydrated: boolean) => void
  auth: {
    logout: () => void
    token: string | null
    login: (token: string) => void
    isAuthenticated: () => boolean
  }
  sortAlgorithms: {
    selectedAlgorithms: AlgorithmOption[]
    getSelectedCount: () => number
    createCompositeKey: (selectedAlgorithm: AlgorithmOption) => string
    getSelectedAlgorithmKeys: () => string[]
    isAlgorithmSelected: (algorithmOption: AlgorithmOption) => boolean
    getAllAlgorithms: (dataStructures: DataStructure[]) => AlgorithmOption[]
    getAllAlgorithmKeys: (dataStructures: DataStructure[]) => string[]
    isAllSelected: (dataStructures: DataStructure[]) => boolean
    toggleSelectAll: (dataStructures: DataStructure[]) => void
    toggleAlgorithm: (algorithmOption: AlgorithmOption) => void
  }
  searchAlgorithms: {
    selectedMovieIds: number[]
    clearSelectedMovieIds: () => void
    getSelectedMoviesCount: () => number
    toggleMovie: (movieId: number) => void
    isMovieSelected: (movieId: number) => boolean
    selectedAlgorithms: AlgorithmOption[]
    getSelectedAlgorithmsCount: () => number
    createCompositeAlgorithmKey: (selectedAlgorithm: AlgorithmOption) => string
    getSelectedAlgorithmKeys: () => string[]
    isAlgorithmSelected: (algorithmOption: AlgorithmOption) => boolean
    getAllAlgorithms: (dataStructures: DataStructure[]) => AlgorithmOption[]
    getAllAlgorithmKeys: (dataStructures: DataStructure[]) => string[]
    isAllAlgorithmsSelected: (dataStructures: DataStructure[]) => boolean
    toggleSelectAllAlgorithms: (dataStructures: DataStructure[]) => void
    toggleAlgorithm: (algorithmOption: AlgorithmOption) => void
  }
}

export const appStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isHydrated: false,
      setIsHydrated: (isHydrated: boolean) => set({ isHydrated }),
      auth: {
        token: null,
        login: (token: string) => set({ auth: { ...get().auth, token } }),
        isAuthenticated: () => {
          return !!get().auth.token
        },
        logout: () => {
          if (get().auth.isAuthenticated()) {
            set({ auth: { ...get().auth, token: null } })
          }
        },
      },
      sortAlgorithms: {
        selectedAlgorithms: [],
        getSelectedCount: () => {
          return get().sortAlgorithms.selectedAlgorithms.length
        },
        createCompositeKey: (selectedAlgorithm: AlgorithmOption) => {
          const { algorithmKey, dataStructureKey } = selectedAlgorithm
          return `${dataStructureKey}:${algorithmKey}`
        },
        getSelectedAlgorithmKeys: () => {
          return get().sortAlgorithms.selectedAlgorithms.map((alg) =>
            get().sortAlgorithms.createCompositeKey(alg)
          )
        },
        isAlgorithmSelected: (algorithmOption: AlgorithmOption) => {
          const { createCompositeKey, getSelectedAlgorithmKeys } =
            get().sortAlgorithms

          const selectedAlgorithmKeys = getSelectedAlgorithmKeys()
          return selectedAlgorithmKeys.includes(
            createCompositeKey(algorithmOption)
          )
        },
        getAllAlgorithms: (dataStructures: DataStructure[]) => {
          return dataStructures.flatMap((ds) =>
            ds.algorithms.map((alg) => ({
              algorithmKey: alg.key,
              dataStructureKey: ds.key,
            }))
          )
        },
        getAllAlgorithmKeys: (dataStructures: DataStructure[]) => {
          const { getAllAlgorithms } = get().sortAlgorithms
          const allAlgorithms = getAllAlgorithms(dataStructures)

          return allAlgorithms.map((alg) =>
            get().sortAlgorithms.createCompositeKey(alg)
          )
        },
        isAllSelected: (dataStructures: DataStructure[]) => {
          const { getAllAlgorithmKeys, getSelectedAlgorithmKeys } =
            get().sortAlgorithms

          const selectedAlgorithmKeys = getSelectedAlgorithmKeys()
          const allAlgorithmKeys = getAllAlgorithmKeys(dataStructures)

          return (
            allAlgorithmKeys.length > 0 &&
            allAlgorithmKeys.every((algorithmKey) =>
              selectedAlgorithmKeys.includes(algorithmKey)
            )
          )
        },
        toggleSelectAll: (dataStructures: DataStructure[]) => {
          const { isAllSelected, getAllAlgorithms } = get().sortAlgorithms

          if (isAllSelected(dataStructures)) {
            set({
              sortAlgorithms: {
                ...get().sortAlgorithms,
                selectedAlgorithms: [],
              },
            })
          } else {
            const allAlgorithms = getAllAlgorithms(dataStructures)

            set({
              sortAlgorithms: {
                ...get().sortAlgorithms,
                selectedAlgorithms: allAlgorithms,
              },
            })
          }
        },
        toggleAlgorithm: (algorithmOption: AlgorithmOption) => {
          const {
            selectedAlgorithms,
            createCompositeKey,
            isAlgorithmSelected,
          } = get().sortAlgorithms

          if (isAlgorithmSelected(algorithmOption)) {
            set({
              sortAlgorithms: {
                ...get().sortAlgorithms,
                selectedAlgorithms: selectedAlgorithms.filter(
                  (alg) =>
                    createCompositeKey(alg) !==
                    createCompositeKey(algorithmOption)
                ),
              },
            })
          } else {
            set({
              sortAlgorithms: {
                ...get().sortAlgorithms,
                selectedAlgorithms: [...selectedAlgorithms, algorithmOption],
              },
            })
          }
        },
      },
      searchAlgorithms: {
        selectedMovieIds: [],
        getSelectedMoviesCount: () => {
          return get().searchAlgorithms.selectedMovieIds.length
        },
        isMovieSelected: (movieId: number) => {
          return get().searchAlgorithms.selectedMovieIds.includes(movieId)
        },
        clearSelectedMovieIds: () => {
          set({
            searchAlgorithms: {
              ...get().searchAlgorithms,
              selectedMovieIds: [],
            },
          })
        },
        toggleMovie: (movieId: number) => {
          const { selectedMovieIds, isMovieSelected } = get().searchAlgorithms

          if (isMovieSelected(movieId)) {
            set({
              searchAlgorithms: {
                ...get().searchAlgorithms,
                selectedMovieIds: selectedMovieIds.filter(
                  (id) => id !== movieId
                ),
              },
            })
          } else {
            set({
              searchAlgorithms: {
                ...get().searchAlgorithms,
                selectedMovieIds: [...selectedMovieIds, movieId],
              },
            })
          }
        },
        selectedAlgorithms: [],
        getSelectedAlgorithmsCount: () => {
          return get().searchAlgorithms.selectedAlgorithms.length
        },
        createCompositeAlgorithmKey: (selectedAlgorithm: AlgorithmOption) => {
          const { algorithmKey, dataStructureKey } = selectedAlgorithm
          return `${dataStructureKey}:${algorithmKey}`
        },
        getSelectedAlgorithmKeys: () => {
          return get().searchAlgorithms.selectedAlgorithms.map((alg) =>
            get().searchAlgorithms.createCompositeAlgorithmKey(alg)
          )
        },
        isAlgorithmSelected: (algorithmOption: AlgorithmOption) => {
          const { createCompositeAlgorithmKey, getSelectedAlgorithmKeys } =
            get().searchAlgorithms

          const selectedAlgorithmKeys = getSelectedAlgorithmKeys()
          return selectedAlgorithmKeys.includes(
            createCompositeAlgorithmKey(algorithmOption)
          )
        },
        getAllAlgorithms: (dataStructures: DataStructure[]) => {
          return dataStructures.flatMap((ds) =>
            ds.algorithms.map((alg) => ({
              algorithmKey: alg.key,
              dataStructureKey: ds.key,
            }))
          )
        },
        getAllAlgorithmKeys: (dataStructures: DataStructure[]) => {
          const { getAllAlgorithms } = get().searchAlgorithms
          const allAlgorithms = getAllAlgorithms(dataStructures)

          return allAlgorithms.map((alg) =>
            get().searchAlgorithms.createCompositeAlgorithmKey(alg)
          )
        },
        isAllAlgorithmsSelected: (dataStructures: DataStructure[]) => {
          const { getAllAlgorithmKeys, getSelectedAlgorithmKeys } =
            get().searchAlgorithms

          const selectedAlgorithmKeys = getSelectedAlgorithmKeys()
          const allAlgorithmKeys = getAllAlgorithmKeys(dataStructures)

          return (
            allAlgorithmKeys.length > 0 &&
            allAlgorithmKeys.every((algorithmKey) =>
              selectedAlgorithmKeys.includes(algorithmKey)
            )
          )
        },
        toggleSelectAllAlgorithms: (dataStructures: DataStructure[]) => {
          const { isAllAlgorithmsSelected, getAllAlgorithms } =
            get().searchAlgorithms

          if (isAllAlgorithmsSelected(dataStructures)) {
            set({
              searchAlgorithms: {
                ...get().searchAlgorithms,
                selectedAlgorithms: [],
              },
            })
          } else {
            const allAlgorithms = getAllAlgorithms(dataStructures)

            set({
              searchAlgorithms: {
                ...get().searchAlgorithms,
                selectedAlgorithms: allAlgorithms,
              },
            })
          }
        },
        toggleAlgorithm: (algorithmOption: AlgorithmOption) => {
          const {
            selectedAlgorithms,
            createCompositeAlgorithmKey,
            isAlgorithmSelected,
          } = get().searchAlgorithms

          if (isAlgorithmSelected(algorithmOption)) {
            set({
              searchAlgorithms: {
                ...get().searchAlgorithms,
                selectedAlgorithms: selectedAlgorithms.filter(
                  (alg) =>
                    createCompositeAlgorithmKey(alg) !==
                    createCompositeAlgorithmKey(algorithmOption)
                ),
              },
            })
          } else {
            set({
              searchAlgorithms: {
                ...get().searchAlgorithms,
                selectedAlgorithms: [...selectedAlgorithms, algorithmOption],
              },
            })
          }
        },
      },
    }),
    {
      name: 'algolab-app-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => () =>
        state.isHydrated ? undefined : state.setIsHydrated(true),
      merge: (persistedState, currentState) =>
        mergeDeepLeft(persistedState as AppStore, currentState),
    }
  )
)

export const useAppStore = <T>(selector: (currentStore: AppStore) => T): T =>
  useStore(appStore, useShallow(selector))
