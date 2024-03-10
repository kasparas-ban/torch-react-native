import { create } from "zustand"
import { ItemOptionType } from "@/types/itemTypes"

export type FocusType = "ALL" | "TASKS" | "GOALS" | "DREAMS"

type TimerFormStoreState = {
  focusOn: ItemOptionType | null
  focusType: FocusType
  setFocusOn: (focus: ItemOptionType | null) => void
  setFocusType: (focus: FocusType) => void
}

const useTimerFormStoreBase = create<TimerFormStoreState>(set => ({
  focusOn: null,
  focusType: "GOALS",
  setFocusOn: (focusOn: ItemOptionType | null) => set(() => ({ focusOn })),
  setFocusType: (focusType: FocusType) =>
    set(() => ({ focusType, focusOn: null })),
}))

const useTimerForm = () => ({
  focusOn: useTimerFormStoreBase(state => state.focusOn),
  focusType: useTimerFormStoreBase(state => state.focusType),
  setFocusOn: useTimerFormStoreBase(state => state.setFocusOn),
  setFocusType: useTimerFormStoreBase(state => state.setFocusType),
})

export default useTimerForm
