import { create } from "zustand"

type GlobalLoadingState = {
  loadingText?: string
  isGlobalLoading: boolean
  showGlobalLoading: (loadingText?: string) => void
  hideGlobalLoading: () => void
}

const useGlobalLoadingStore = create<GlobalLoadingState>(set => ({
  loadingText: undefined,
  isGlobalLoading: false,
  showGlobalLoading: (loadingText?: string) =>
    set(() => ({ isGlobalLoading: true, loadingText })),
  hideGlobalLoading: () =>
    set(() => ({ isGlobalLoading: false, loadingText: undefined })),
}))

const useGlobalLoading = () => ({
  isGlobalLoading: useGlobalLoadingStore(state => state.isGlobalLoading),
  showGlobalLoading: useGlobalLoadingStore(state => state.showGlobalLoading),
  hideGlobalLoading: useGlobalLoadingStore(state => state.hideGlobalLoading),
})

export default useGlobalLoading
