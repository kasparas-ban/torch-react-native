import { useMemo } from "react"
import TimerIcon from "@/assets/icons/navigationIcons/timer.svg"
import TimerBoldIcon from "@/assets/icons/timerBold.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import dayjs from "dayjs"
import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import {
  FormattedItem,
  GeneralItem,
  Goal,
  ItemOptionType,
  Task,
} from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { capitalize, formatSpentTime, toPercent } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"
import useEditItem from "../itemModal/hooks/useEditItem"
import useTimerForm from "../Timer/hooks/useTimerForm"

export default function EditItemInfo() {
  const { styles, isDark } = useThemeStyles(componentStyles)
  const { editItem } = useEditItem()

  const isRecurring = !!editItem?.rec_period

  const { setFocusOn } = useTimerForm()

  const handleTimerClick = () => {
    if (!editItem) return

    setFocusOn(editItem.item_id)
    router.push("/(tabs)/timer")
  }

  const timeLeft = useMemo(
    () =>
      editItem?.item_type === "TASK"
        ? Math.max((editItem.duration || 0) - editItem.time_spent, 0)
        : editItem?.item_type === "GOAL"
          ? getTasksTimeLeft((editItem as any).tasks)
          : editItem?.item_type === "DREAM"
            ? getGoalsTimeLeft((editItem as any).goals)
            : undefined,
    [editItem]
  )

  return (
    <Animated.View
      style={styles.background}
      entering={FadeIn(0.9)}
      exiting={FadeOut(0.9)}
    >
      <Text style={styles.itemTitle}>{editItem?.title}</Text>
      <View
        style={{ flexDirection: "row", paddingHorizontal: 6, paddingTop: 4 }}
      >
        <View style={{ flexDirection: "row", gap: 2, marginRight: 12 }}>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 42,
              textAlignVertical: "bottom",
              color: isRecurring ? Colors.amber[400] : Colors.rose[500],
            }}
          >
            {isRecurring
              ? `${editItem.rec_progress || 0}/${editItem.rec_times}`
              : toPercent(editItem?.progress).slice(0, -1)}
          </Text>
          {!isRecurring && (
            <Text
              style={{
                fontWeight: "900",
                fontSize: 34,
                textAlignVertical: "bottom",
                marginBottom: 2,
                color: Colors.rose[500],
              }}
            >
              %
            </Text>
          )}
        </View>

        <View
          style={{
            justifyContent: "center",
            gap: 3,
            flexGrow: 1,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: isDark ? Colors.gray[300] : Colors.gray[500],
                marginRight: 4,
                marginLeft: "auto",
              }}
            >
              {isRecurring ? "Total times repeated:" : "Total time spent:"}
            </Text>
          </View>
          {timeLeft !== undefined && (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: isDark ? Colors.gray[300] : Colors.gray[500],
                  marginRight: 4,
                  marginLeft: "auto",
                }}
              >
                Time left:
              </Text>
            </View>
          )}
        </View>

        {editItem && (
          <View
            style={{
              justifyContent: "center",
              gap: 3,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              {!isRecurring && (
                <TimerBoldIcon
                  color={isDark ? Colors.gray[300] : Colors.gray[500]}
                  style={{ width: 16, height: 16 }}
                />
              )}
              <Text
                style={{ color: isDark ? Colors.gray[300] : Colors.gray[500] }}
              >
                {isRecurring
                  ? editItem.rec_progress
                  : formatSpentTime(
                      (editItem as Goal).totalTimeSpent || editItem.time_spent
                    )}
              </Text>
            </View>
            {timeLeft !== undefined && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <TimerIcon
                  color={isDark ? Colors.gray[300] : Colors.gray[500]}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
                <Text
                  style={{
                    color: isDark ? Colors.gray[300] : Colors.gray[500],
                  }}
                >
                  {formatSpentTime(timeLeft)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 6,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? Colors.gray[300] : Colors.gray[500],
            width: "100%",
            height: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      {!!editItem && <ItemInfoTags item={editItem} />}

      {editItem?.status === "ACTIVE" && (
        <>
          {isRecurring ? (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              <AnimatedButton
                key="add_recurring"
                style={{
                  backgroundColor: Colors.amber[400],
                  borderRadius: 100,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: Colors.gray[700],
                  }}
                >
                  -1
                </Text>
              </AnimatedButton>
              <AnimatedButton
                key="subtract_recurring"
                style={{
                  backgroundColor: Colors.amber[400],
                  borderRadius: 100,
                  height: 36,
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: Colors.gray[700],
                  }}
                >
                  +1
                </Text>
              </AnimatedButton>
            </View>
          ) : (
            <View>
              <AnimatedButton
                style={styles.timerBtn}
                scale={0.98}
                onPress={handleTimerClick}
              >
                <Text style={styles.timerBtnLabel}>Start timer</Text>
              </AnimatedButton>
            </View>
          )}
        </>
      )}
    </Animated.View>
  )
}

function ItemInfoTags({ item }: { item: FormattedItem }) {
  const { styles, isDark } = useThemeStyles(tagStyles)

  const deadlineIn = item.target_date
    ? dayjs(item.target_date).diff(new Date(), "days")
    : undefined

  return (
    <View style={styles.wrapper}>
      {item.status === "ARCHIVED" && (
        <View style={{ ...styles.tag, backgroundColor: Colors.amber[200] }}>
          <Text style={{ ...styles.tagText, color: Colors.amber[700] }}>
            {capitalize(item.status)}
          </Text>
        </View>
      )}
      {item.status === "COMPLETED" && (
        <View style={{ ...styles.tag, backgroundColor: Colors.green[200] }}>
          <Text style={{ ...styles.tagText, color: Colors.green[700] }}>
            {capitalize(item.status)}
          </Text>
        </View>
      )}
      {item.priority && (
        <View style={styles.tag}>
          <Text
            style={styles.tagText}
          >{`${capitalize(item.priority)} priority`}</Text>
        </View>
      )}
      {deadlineIn !== undefined && !isNaN(deadlineIn) && (
        <View style={styles.tag}>
          <Text
            style={styles.tagText}
          >{`Deadline in ${deadlineIn} ${deadlineIn === 1 ? "day" : "days"}`}</Text>
        </View>
      )}
      {item.duration && (
        <View style={styles.tag}>
          <Text
            style={styles.tagText}
          >{`Takes ${formatSpentTime(item.duration)}`}</Text>
        </View>
      )}
    </View>
  )
}

function getTasksTimeLeft(tasks: GeneralItem[]) {
  return tasks.reduce((prev, curr) => {
    const timeToAdd = curr.duration
      ? Math.max(curr.duration - curr.time_spent, 0)
      : 0
    return prev + timeToAdd
  }, 0)
}

function getGoalsTimeLeft(goals: Goal[]) {
  return goals.reduce((prev, curr) => {
    const timeToAdd = curr.tasks ? getTasksTimeLeft(curr.tasks) : 0
    return prev + timeToAdd
  }, 0)
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    background: {
      backgroundColor: isDark ? Colors.gray[600] : "white",
      width: "auto",
      borderRadius: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      minWidth: 280,
      ...(isDark && {
        borderWidth: 1,
        borderColor: Colors.gray[500],
      }),
    },
    itemTitle: {
      fontWeight: "700",
      color: isDark ? Colors.gray[100] : Colors.gray[600],
      fontSize: 18,
      textAlign: "center",
    },
    timerBtn: {
      marginTop: 6,
      backgroundColor: Colors.rose[500],
      paddingVertical: 8,
      width: "100%",
      borderRadius: 18,
      alignItems: "center",
    },
    timerBtnLabel: {
      fontWeight: "800",
      letterSpacing: 0.8,
      color: "white",
    },
  })

const tagStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      display: "flex",
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
      paddingVertical: 10,
      maxWidth: 240,
      justifyContent: "center",
      alignSelf: "center",
    },
    tag: {
      backgroundColor: isDark ? Colors.gray[300] : Colors.gray[200],
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      flexShrink: 1,
      alignSelf: "flex-start",
    },
    tagText: {
      color: Colors.gray[600],
      fontWeight: "700",
    },
  })
