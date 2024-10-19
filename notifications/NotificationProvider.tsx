import { ReactNode, useEffect, useState } from "react"
import notifee, { EventType } from "@notifee/react-native"
import useTimerStore, {
  useTimerStoreBase,
} from "@/components/Timer/hooks/useTimer"

import { displayNotification } from "./displayNotification"

export default function NotificationProvider() {
  const [channelId, setChannelId] = useState<string | null>(null)
  const {
    time,
    timerState,
    break: isBreak,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimerStore()

  useEffect(() => {
    if (timerState === "running" && channelId) {
      displayNotification({
        channelId,
        timerState,
        time,
        isBreak: isBreak,
      })
    }
  }, [timerState])

  useEffect(() => {
    initNotificationChannel().then(id => setChannelId(id))

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
      unsubForeground()
    }
  }, [])

  useEffect(() => {
    notifee.registerForegroundService(async notification => {
      return new Promise(() => {
        useTimerStoreBase.subscribe(state => {
          if (!channelId) return

          const { timerState, time } = state
          displayNotification({
            channelId,
            timerState,
            time,
            isBreak: state.break,
          })
        })
      })
    })
  }, [channelId])

  return null
}

const initNotificationChannel = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  })

  return channelId
}
