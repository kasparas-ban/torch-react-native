import { useEffect, useState } from "react"
import notifee, { EventType } from "@notifee/react-native"
import { TimerState } from "@/types/itemTypes"
import useTimerStore, {
  useTimerStoreBase,
} from "@/components/Timer/hooks/useTimer"

import { displayNotification } from "./displayNotification"

let prevState: TimerState = "idle"
let pervTime = 0

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
      pervTime === 0 &&
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
        console.log("STOPPING THE TIMER")
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
          prevState = state.timerState
          pervTime = state.time

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
    name: "Default Channel",
    vibration: false,
  })
  const vibrateChan = await notifee.createChannel({
    id: "vibrate",
    name: "Task finished channel",
    vibration: true,
  })
  return { timerChan, vibrateChan }
}
