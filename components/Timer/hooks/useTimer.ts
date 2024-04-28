import { useCallback, useEffect } from "react"
import { useUpdateUserTime } from "@/api-endpoints/hooks/user/useUser"
import useItems from "@/stores/itemStore"
import dayjs from "dayjs"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { TimerState } from "@/types/itemTypes"
import { createSelectors } from "@/utils/zustandUtils"

import useTimerForm from "./useTimerForm"

type TimerStoreState = {
  time: number
  initialTime: number
  timerState: TimerState

  sessionStartTime?: Date
  sessionEndTime?: Date

  break: boolean
  breakTime: number
  longBreakTime: number
  timerCount: number

  interval?: NodeJS.Timeout

  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  endTimer: () => void
  tickTimer: () => void

  setDurations: (
    timerDuration: number,
    breakDuration: number,
    longBreakDuration: number
  ) => void
}

const DEFAULT_TIME = 1 // 25
const DEFAULT_BREAK_TIME = 5
const DEFAULT_LONG_BREAK_TIME = 15

const defaultTime = DEFAULT_TIME * 60
const breakTime = DEFAULT_BREAK_TIME * 60
const longBreakTime = DEFAULT_LONG_BREAK_TIME * 60

const useTimerStoreBase = create<TimerStoreState>()(
  subscribeWithSelector(set => ({
    time: defaultTime,
    initialTime: defaultTime,
    breakTime: breakTime,
    longBreakTime: longBreakTime,
    timerState: "idle",

    sessionStartTime: undefined,
    sessionEndTime: undefined,

    break: false,
    timerCount: 0,

    interval: undefined,

    startTimer: () =>
      set(state => {
        let time = state.time
        const interval = setInterval(() => {
          if (time <= 0) {
            state.endTimer()
          } else {
            state.tickTimer()
            time--
          }
        }, 1000)

        return {
          timerState: "running",
          interval,
          sessionStartTime: new Date(),
        }
      }),
    pauseTimer: () =>
      set(state => {
        clearInterval(state.interval)
        return {
          timerState: "paused",
          sessionEndTime: new Date(),
        }
      }),
    endBreak: () =>
      set(state => {
        clearInterval(state.interval)
        return {
          timerState: "idle",
          time: state.initialTime,
          break: false,
          interval: undefined,
          sessionEndTime: new Date(),
        }
      }),
    endTimer: () =>
      set(state => {
        let time = !state.break
          ? state.timerCount >= 3
            ? state.longBreakTime
            : state.breakTime
          : state.initialTime
        clearInterval(state.interval)
        return {
          timerState: "idle",
          time,
          break: !state.break,
          interval: undefined,
          timerCount: state.timerCount >= 5 ? 0 : state.timerCount + 1,
          sessionEndTime: new Date(),
        }
      }),
    resetTimer: () =>
      set(state => {
        clearInterval(state.interval)
        return {
          timerState: "idle",
          time: state.initialTime,
          break: false,
          interval: undefined,
          sessionEndTime: new Date(),
        }
      }),
    tickTimer: () =>
      set(state => ({
        time: state.time - 1,
      })),

    setDurations: (
      timerDuration: number,
      breakDuration: number,
      longBreakDuration: number
    ) =>
      set(state => ({
        time: timerDuration < state.time ? timerDuration : state.time,
        initialTime: timerDuration,
        breakTime: breakDuration,
        longBreakTime: longBreakDuration,
      })),
  }))
)

const useTimerStore = createSelectors(useTimerStoreBase)

const UPDATE_PERIOD = 60 // seconds

export const useTimerListener = () => {
  const { focusOn } = useTimerForm()
  const { updateItemProgress } = useItems()

  const { mutateAsync: updateUserTime } = useUpdateUserTime()

  const updateTime = useCallback(
    (timeSpent: number, itemID?: string) =>
      itemID
        ? updateItemProgress({ timeSpent, itemID })
        : updateUserTime(timeSpent),
    [updateItemProgress, updateUserTime]
  )

  useEffect(() => {
    const timerStateListener = useTimerStore.subscribe(
      state => state,
      state => {
        // Update progress every minute
        if (
          state.time % UPDATE_PERIOD === 0 &&
          state.time !== state.initialTime
        ) {
          let diff = UPDATE_PERIOD
          if (state.sessionStartTime && state.sessionEndTime) {
            const newDiff = dayjs().diff(
              dayjs(state.sessionStartTime),
              "second"
            )
            if (newDiff < diff) diff = newDiff
          }
          updateTime(diff, focusOn?.value)
        }

        // Update progress when the timer is stopped
        if (
          state.timerState === "paused" &&
          state.sessionStartTime &&
          state.sessionEndTime
        ) {
          const elapsedTime = (state.initialTime - state.time) % UPDATE_PERIOD
          updateTime(elapsedTime, focusOn?.value)
        }
      }
    )

    return () => timerStateListener()
  }, [focusOn?.value, updateTime])
}

export default useTimerStore
