import { useEffect } from "react"
import useDev from "@/devTools/useDev"
import useItems from "@/stores/itemStore"
import useUserInfo from "@/stores/userStore"
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

export const useTimerStoreBase = create<TimerStoreState>()(
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

const UPDATE_PERIOD = 5 // seconds

let timerStateListener: (() => void) | null = null

let incrementInfo: { startTime: Date; endTime: Date } | null = null

let lastStopElapsedTime = 0

export const useTimerListener = () => {
  const { isOnline } = useDev()
  const { focusItemId } = useTimerForm()
  const { updateItemProgress } = useItems()

  const { updateUserTime } = useUserInfo()

  const updateTime = (time_spent: number, item_id?: string | null) =>
    item_id
      ? updateItemProgress({ time_spent, item_id }, !isOnline)
      : updateUserTime(time_spent, !isOnline)

  useEffect(() => {
    if (timerStateListener) timerStateListener()

    incrementInfo = null

    timerStateListener = useTimerStore.subscribe(
      state => state,
      state => {
        const startTimeDiff =
          incrementInfo &&
          dayjs(incrementInfo.startTime).diff(
            dayjs(state.sessionStartTime),
            "second"
          )
        const endTimeDiff =
          incrementInfo &&
          dayjs(incrementInfo.endTime).diff(
            dayjs(state.sessionEndTime),
            "second"
          )

        // Skip update if the there's no time difference
        if (startTimeDiff === 0 && endTimeDiff === 0) {
          return
        }

        // Update progress every increment period
        if (
          state.time % UPDATE_PERIOD === 0 &&
          state.time !== state.initialTime
        ) {
          lastStopElapsedTime = 0
          let diff = UPDATE_PERIOD
          if (state.sessionStartTime && state.sessionEndTime) {
            const newDiff = dayjs().diff(
              dayjs(state.sessionStartTime),
              "second"
            )
            if (newDiff < diff) diff = newDiff

            incrementInfo = {
              startTime: state.sessionStartTime,
              endTime: new Date(),
            }
          }

          updateTime(diff, focusItemId)
          return
        }

        // Update progress when the timer is stopped
        if (
          state.timerState === "paused" &&
          state.sessionStartTime &&
          state.sessionEndTime
        ) {
          const elapsedTime =
            ((state.initialTime - state.time) % UPDATE_PERIOD) -
            lastStopElapsedTime

          lastStopElapsedTime = (state.initialTime - state.time) % UPDATE_PERIOD
          updateTime(elapsedTime, focusItemId)
        }
      }
    )

    return () => {
      timerStateListener && timerStateListener()
    }
  }, [focusItemId, isOnline])
}

export default useTimerStore
