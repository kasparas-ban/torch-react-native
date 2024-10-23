import { useEffect } from "react"
import notifee, { EventType } from "@notifee/react-native"
import { TimerState } from "@/types/itemTypes"
import { formatFullTime } from "@/utils/utils"
import useTimerStore, {
  useTimerStoreBase,
} from "@/components/Timer/hooks/useTimer"

let channelId: string

let resumeTimerFn: (() => void) | null = null
let pauseTimerFn: (() => void) | null = null
let resetTimerFn: (() => void) | null = null

const initNotificationChannel = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission()

  // Create a channel (required for Android)
  channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  })
}

initNotificationChannel()

notifee.registerForegroundService(async notification => {
  console.log("Registering Foreground service", notification.id, channelId)

  return new Promise(() => {
    console.log("Calling from foreground service")

    const unsubscribe = useTimerStoreBase.subscribe(state => {
      const { timerState, time } = state
      if (!pauseTimerFn) resumeTimerFn = state.startTimer
      if (!pauseTimerFn) pauseTimerFn = state.pauseTimer
      if (!resetTimerFn) resetTimerFn = state.resetTimer

      displayNotification(timerState, time)
    })

    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (
        type === EventType.ACTION_PRESS &&
        detail.pressAction?.id === "resume"
      ) {
        resumeTimerFn?.()
        return
      }

      if (
        type === EventType.ACTION_PRESS &&
        detail.pressAction?.id === "pause"
      ) {
        pauseTimerFn?.()
        return
      }

      if (
        type === EventType.ACTION_PRESS &&
        detail.pressAction?.id === "stop"
      ) {
        resetTimerFn?.()
        unsubscribe()
        await notifee.stopForegroundService()
      }
    })

    // Later, when you want to stop listening for changes
    // unsubscribe()
  })
})

const getNotificationTitle = (timerState: TimerState, time: number) => {
  let state =
    timerState === "idle"
      ? "Focus session ready"
      : timerState === "paused"
        ? "Focus session paused"
        : "Focus session active"

  return `<p style="color: #FFFFFF;"><b>${state}: ${formatFullTime(time)}</b></p>`
}

export const displayNotification = async (
  timerState: TimerState,
  time: number
) => {
  console.log("DISPLAY NOTIFICATION")
  await notifee.displayNotification({
    id: channelId,
    title: getNotificationTitle(timerState, time),
    android: {
      channelId,
      color: "#F43F5E",
      ongoing: true,
      asForegroundService: true,
      colorized: true,
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
      actions: [
        timerState === "running"
          ? {
              title: `<p style="color: #FFFFFF;">Pause</p>`,
              pressAction: { id: "pause" },
            }
          : {
              title: `<p style="color: #FFFFFF;">Resume</p>`,
              pressAction: { id: "resume" },
            },
        {
          title: `<p style="color: #FFFFFF;">Stop</p>`,
          pressAction: { id: "stop" },
        },
      ],
    },
  })
}

export function useNotificationListener() {
  const { timerState, time } = useTimerStore()

  useEffect(() => {
    if (timerState === "running") displayNotification(timerState, time)
  }, [timerState])
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail

  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === "resume") {
    resumeTimerFn?.()
    return
  }

  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === "pause") {
    pauseTimerFn?.()
    return
  }

  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === "stop") {
    resetTimerFn?.()
    await notifee.stopForegroundService()
  }
})

// notifee.onForegroundEvent(({ type, detail }) => {
//   if (type === EventType.ACTION_PRESS && detail.pressAction?.id) {
//     if (detail.pressAction.id === "pause") {
//       console.log("handle stop")
//     }

//     if (detail.pressAction.id === "stop") {
//       console.log("handle stop")
//     }
//   }
// })
