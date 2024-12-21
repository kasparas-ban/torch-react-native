import Colors from "@/constants/Colors"
import notifee, { AndroidForegroundServiceType } from "@notifee/react-native"
import { TimerState } from "@/types/itemTypes"
import { formatFullTime } from "@/utils/utils"

type DisplayNotificationProps = {
  channelId: string
  timerState: TimerState
  time: number
  isBreak: boolean
}

export const displayNotification = async (props: DisplayNotificationProps) => {
  const { channelId, timerState, time, isBreak } = props
  const isTimerStopped = timerState === "paused" || timerState === "idle"
  await notifee.displayNotification({
    id: channelId,
    title: getNotificationTitle(timerState, time, isBreak),
    android: {
      channelId,
      color: getBackgroundColor(isBreak, isTimerStopped),
      ongoing: true,
      asForegroundService: true,
      colorized: true,
      foregroundServiceTypes: [
        AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_SPECIAL_USE,
      ],
      pressAction: {
        id: "default",
        launchActivity: "default",
      },
      actions: [
        timerState === "running"
          ? {
              title: `<p style="color: ${getTextColor(isBreak, isTimerStopped)};">Pause</p>`,
              pressAction: { id: "pause" },
            }
          : {
              title: `<p style="color: ${getTextColor(isBreak, isTimerStopped)};">Resume</p>`,
              pressAction: { id: "resume" },
            },
        {
          title: `<p style="color: ${getTextColor(isBreak, isTimerStopped)};">Stop</p>`,
          pressAction: { id: "stop" },
        },
      ],
    },
  })
}

const getBackgroundColor = (isBreak: boolean, isStopped: boolean) => {
  if (isBreak) {
    if (isStopped) {
      return Colors.notifications.sky[300]
    } else {
      return Colors.notifications.sky[500]
    }
  } else {
    if (isStopped) {
      return Colors.notifications.rose[300]
    } else {
      return Colors.notifications.rose[500]
    }
  }
}

const getTextColor = (isBreak: boolean, isStopped: boolean) => {
  if (isBreak) {
    return Colors.notifications.gray[950]
  } else {
    if (isStopped) {
      return Colors.notifications.gray[950]
    } else {
      return Colors.notifications.gray[50]
    }
  }
}

const getNotificationTitle = (
  timerState: TimerState,
  time: number,
  isBreak: boolean
) => {
  let state = ""
  if (isBreak) {
    switch (timerState) {
      case "idle":
        state = "Rest timer ready"
        break
      case "paused":
        state = "Rest timer paused"
        break
      case "running":
        state = "Rest timer active"
        break
    }
  } else {
    switch (timerState) {
      case "idle":
        state = "Focus session ready"
        break
      case "paused":
        state = "Focus session paused"
        break
      case "running":
        state = "Focus session active"
        break
    }
  }

  const isTimerStopped = timerState === "paused" || timerState === "idle"

  return `<p style="color: ${getTextColor(isBreak, isTimerStopped)};"><b>${state}: ${formatFullTime(time)}</b></p>`
}
