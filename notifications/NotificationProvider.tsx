import { useEffect, useState } from "react"
import notifee, { AndroidImportance, EventType } from "@notifee/react-native"
import { TimerState } from "@/types/itemTypes"
import useTimerStore, {
  useTimerStoreBase,
} from "@/components/Timer/hooks/useTimer"

import { displayNotification } from "./displayNotification"

let prevState: TimerState = "idle"
let prevTime = 0

export default function NotificationProvider() {
  const [timerChanId, setTimerChanId] = useState<string | null>(null)
  const [vibrateChanId, setVibrateChanId] = useState<string | null>(null)
  const {
    time,
    timerState,
    break: isBreak,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimerStore()

  useEffect(() => {
    if (timerState === "running" && timerChanId) {
      displayNotification({
        channelId: timerChanId,
        timerState,
        time,
        isBreak: isBreak,
      })
    }

    if (
      timerState === "idle" &&
      prevState === "running" &&
      prevTime === 0 &&
      !!vibrateChanId
    ) {
      displayNotification({
        channelId: vibrateChanId,
        timerState,
        time,
        isBreak: isBreak,
      })
    }
  }, [timerState])

  useEffect(() => {
    initChannels().then(({ timerChan, vibrateChan }) => {
      setTimerChanId(timerChan)
      setVibrateChanId(vibrateChan)
    })

    const unsubForeground = notifee.onForegroundEvent(
      async ({ type, detail }) => {
        if (type !== EventType.ACTION_PRESS) return

        switch (detail.pressAction?.id) {
          case "resume":
            startTimer()
            return
          case "pause":
            pauseTimer()
            return
          case "stop":
            resetTimer()
            await notifee.stopForegroundService()
            return
        }
      }
    )

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.DISMISSED) {
        resetTimer()
        setTimeout(async () => {
          await notifee.stopForegroundService()
        }, 300)
        return
      }

      if (type !== EventType.ACTION_PRESS) return

      switch (detail.pressAction?.id) {
        case "resume":
          startTimer()
          return
        case "pause":
          pauseTimer()
          return
        case "stop":
          resetTimer()
          await notifee.stopForegroundService()
          return
      }
    })

    return () => {
      // Application is killed
      notifee.stopForegroundService()
      unsubForeground()
    }
  }, [])

  useEffect(() => {
    notifee.registerForegroundService(async notification => {
      return new Promise(() => {
        useTimerStoreBase.subscribe(state => {
          const isTimerStateChanged = prevState !== state.timerState
          prevState = state.timerState
          prevTime = state.time

          if (isTimerStateChanged) return
          if (!timerChanId) return

          const { timerState, time } = state
          displayNotification({
            channelId: timerChanId,
            timerState,
            time,
            isBreak: state.break,
          })
        })
      })
    })
  }, [timerChanId])

  return null
}

const initChannels = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission()
  // Create a channel (required for Android)
  const timerChan = await notifee.createChannel({
    id: "default",
    name: "Timer countdown",
    vibration: false,
  })
  const vibrateChan = await notifee.createChannel({
    id: "vibrate",
    name: "Vibrate on timer finish",
    vibration: true,
    importance: AndroidImportance.HIGH,
    vibrationPattern: [200, 200, 200, 200],
  })
  return { timerChan, vibrateChan }
}
