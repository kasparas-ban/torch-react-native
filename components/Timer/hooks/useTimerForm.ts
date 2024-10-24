import { create } from "zustand"

export type FocusType = "ALL" | "TASKS" | "GOALS" | "DREAMS"

type TimerFormStoreState = {
  focusItemId: string | null
  focusType: FocusType
  setFocusOn: (focusItemId: string | null) => void
  setFocusType: (focus: FocusType) => void
}

const useTimerFormStoreBase = create<TimerFormStoreState>(set => ({
  focusItemId: null,
  focusType: "GOALS",
  setFocusOn: (focusItemId: string | null) => set(() => ({ focusItemId })),
  setFocusType: (focusType: FocusType) =>
    set(() => ({ focusType, focusOn: null })),
}))

const useTimerForm = () => ({
  focusItemId: useTimerFormStoreBase(state => state.focusItemId),
  focusType: useTimerFormStoreBase(state => state.focusType),
  setFocusOn: useTimerFormStoreBase(state => state.setFocusOn),
  setFocusType: useTimerFormStoreBase(state => state.setFocusType),
})

export default useTimerForm
