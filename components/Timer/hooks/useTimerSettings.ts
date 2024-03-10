import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import useTimerStore from "./useTimer"

export type TimerSettingsState = {
  timerDuration: number
  breakDuration: number
  longBreakDuration: number
}

type TimerSettingsStoreState = TimerSettingsState & {
  setTimerDuration: (duration: number) => void
  setBreakDuration: (duration: number) => void
  setLongBreakDuration: (duration: number) => void

  setDurations: (
    timerDuration: number,
    breakDuration: number,
    longBreakDuration: number
  ) => void
}

const useTimerSettings = create<TimerSettingsStoreState>()(
  persist(
    set => ({
      timerDuration: 1, // 25 min
      breakDuration: 5, // 5 min
      longBreakDuration: 15, // 15 min

      setTimerDuration: (duration: number) => set({ timerDuration: duration }),
      setBreakDuration: (duration: number) => set({ breakDuration: duration }),
      setLongBreakDuration: (duration: number) =>
        set({ longBreakDuration: duration }),

      setDurations: (
        timerDuration: number,
        breakDuration: number,
        longBreakDuration: number
      ) =>
        set({
          timerDuration,
          breakDuration,
          longBreakDuration,
        }),
    }),
    {
      name: "timer-settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

export const useStorageHydration = () => {
  const [hydrated, setHydrated] = useState(false)
  const setTimerDurations = useTimerStore.use.setDurations()
  const resetTimer = useTimerStore.use.resetTimer()
  const { timerDuration, breakDuration, longBreakDuration } = useTimerSettings()

  useEffect(() => {
    const unsubFinishHydration = useTimerSettings.persist.onFinishHydration(
      ({ timerDuration, breakDuration, longBreakDuration }) => {
        setHydrated(true)
        setTimerDurations(
          timerDuration * 60,
          breakDuration * 60,
          longBreakDuration * 60
        )
        resetTimer()
      }
    )

    if (useTimerSettings.persist.hasHydrated()) {
      setHydrated(true)
      setTimerDurations(
        timerDuration * 60,
        breakDuration * 60,
        longBreakDuration * 60
      )
      resetTimer()
    }

    return () => {
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}

export default useTimerSettings
