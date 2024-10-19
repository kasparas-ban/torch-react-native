import notifee from "@notifee/react-native"
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

  await notifee.displayNotification({
    id: channelId,
    title: getNotificationTitle(timerState, time, isBreak),
    android: {
      channelId,
      color: getBackgroundColor(isBreak),
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
              title: `<p style="color: ${getTextColor(isBreak)};">Pause</p>`,
              pressAction: { id: "pause" },
            }
          : {
              title: `<p style="color: ${getTextColor(isBreak)};">Resume</p>`,
              pressAction: { id: "resume" },
            },
        {
          title: `<p style="color: ${getTextColor(isBreak)};">Stop</p>`,
          pressAction: { id: "stop" },
        },
      ],
    },
  })
}

const getBackgroundColor = (isBreak: boolean) =>
  isBreak ? "#38bdf8" : "#F43F5E"
const getTextColor = (isBreak: boolean) => (isBreak ? "#030712" : "#FFFFFF")

const getNotificationTitle = (
  timerState: TimerState,
  time: number,
  isBreak: boolean
) => {
  let state = ""
  if (isBreak) {
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
  } else {
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
  }

  return `<p style="color: ${getTextColor(isBreak)};"><b>${state}: ${formatFullTime(time)}</b></p>`
}
