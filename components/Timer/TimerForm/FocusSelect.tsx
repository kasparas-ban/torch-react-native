import React, { useRef } from "react"
import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { getItemsByType } from "@/api-endpoints/utils/helpers"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet"
import { ItemOptionType, ItemType } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { toPercent } from "@/utils/utils"

import { AnimatedButton } from "../../AnimatedButton"
import ToggleSelect from "../../UI/ToggleSelect"
import useTimerStore from "../hooks/useTimer"
import useTimerForm, { FocusType } from "../hooks/useTimerForm"

const MOCK_DATA = [
  {
    label: "Learn Spanish",
    value: "1ax1usfu2uku",
    options: [
      {
        label: "Learn Spanish vocabulary",
        value: "6bax1usfu2uk",
        type: "GOAL" as ItemType,
        progress: 0.361,
        timeSpent: 0,
        totalTimeSpent: 39000,
        containsTasks: true,
        duration: 108000,
        parent: "1ax1usfu2uku",
      },
      {
        label: "Learn Spanish grammar",
        value: "7bax1usfu2uk",
        type: "GOAL" as ItemType,
        progress: 0,
        timeSpent: 0,
        totalTimeSpent: 0,
        containsTasks: false,
        duration: 0,
        parent: "1ax1usfu2uku",
      },
      {
        label: "Spanish language comprehension",
        value: "8bax1usfu2uk",
        type: "GOAL" as ItemType,
        progress: 0,
        timeSpent: 0,
        totalTimeSpent: 0,
        containsTasks: false,
        duration: 0,
        parent: "1ax1usfu2uku",
      },
      {
        label: "Spanish writing",
        value: "9bax1usfu2uk",
        type: "GOAL" as ItemType,
        progress: 0,
        timeSpent: 0,
        totalTimeSpent: 0,
        containsTasks: false,
        duration: 0,
        parent: "1ax1usfu2uku",
      },
    ],
  },
  {
    label: "Get fit",
    value: "2ax1usfu2uku",
    options: [
      {
        label: "Build muscle",
        value: "10ax1usfu2uk",
        type: "GOAL" as ItemType,
        progress: 0,
        timeSpent: 0,
        totalTimeSpent: 0,
        containsTasks: true,
        duration: 0,
        parent: "2ax1usfu2uku",
      },
    ],
  },
  {
    label: "Get good at math",
    value: "3ax1usfu2uku",
    options: [
      {
        label: "Learn Linear Algebra",
        value: "11ax1usfu2uk",
        type: "GOAL" as ItemType,
        progress: 0,
        timeSpent: 0,
        totalTimeSpent: 0,
        containsTasks: false,
        duration: 0,
        parent: "3ax1usfu2uku",
      },
      {
        label: "Learn Calculus",
        value: "12ax1usfu2uk",
        type: "GOAL" as ItemType,
        progress: 0,
        timeSpent: 0,
        totalTimeSpent: 0,
        containsTasks: false,
        duration: 0,
        parent: "3ax1usfu2uku",
      },
    ],
  },
]

type GroupedItem = {
  label: string
  value: string
  options: ItemOptionType[]
}

const focusTypeOptions = [
  { label: "Tasks", value: "TASKS" as FocusType },
  { label: "Goals", value: "GOALS" as FocusType },
  { label: "Dreams", value: "DREAMS" as FocusType },
  { label: "All", value: "ALL" as FocusType },
]

export default function FocusSelect() {
  const actionSheetRef = useRef<ActionSheetRef>(null)

  const { styles } = useThemeStyles(componentStyles)

  const timerState = useTimerStore.use.timerState()
  const { focusOn, setFocusOn, focusType, setFocusType } = useTimerForm()
  const { data } = useItemsList()

  const isGrouped = focusType === "TASKS" || focusType === "GOALS"
  const items = getItemsByType({
    itemData: data,
    focusType,
    grouped: isGrouped,
  })

  const isEmpty = !items.length

  return (
    <View style={{ height: 50, right: 0, left: 0 }}>
      <AnimatedButton
        scale={0.98}
        style={styles.input}
        onPress={() => actionSheetRef.current?.show()}
      >
        <Text
          style={[
            styles.inputText,
            focusOn && {
              color: Colors.gray[700],
              fontWeight: "600",
            },
          ]}
        >
          {focusOn?.label ?? "Select..."}
        </Text>
        {focusOn && (
          <AnimatedButton
            style={{
              width: 28,
              height: 28,
              right: 12,
              top: 12,
              position: "absolute",
            }}
            onPress={() => setFocusOn(null)}
          >
            <CloseIcon
              color={Colors.gray[500]}
              style={{ width: 28, height: 28 }}
            />
          </AnimatedButton>
        )}
      </AnimatedButton>

      <ActionSheet ref={actionSheetRef}>
        <View style={{ paddingBottom: 24, paddingHorizontal: 24 }}>
          <ModalHandle />

          <View style={{ width: "100%", marginBottom: 12 }}>
            <ToggleSelect<FocusType>
              options={focusTypeOptions}
              selected={focusType}
              onChange={type => setFocusType(type.value)}
            />
          </View>

          {isGrouped ? (
            <GroupedItems
              items={MOCK_DATA}
              selectedItem={focusOn}
              onSelectItem={setFocusOn}
            />
          ) : (
            <></>
          )}
        </View>
      </ActionSheet>
    </View>
  )
}

function GroupedItems({
  items,
  selectedItem,
  onSelectItem,
}: {
  items: GroupedItem[]
  selectedItem: ItemOptionType | null
  onSelectItem: (focus: ItemOptionType | null) => void
}) {
  return (
    <View style={{ gap: 4 }}>
      {items.map(item => (
        <View key={item.value}>
          <Text
            style={{
              fontWeight: "600",
              color: Colors.gray[500],
              marginBottom: 6,
            }}
          >
            {item.label}
          </Text>
          <View style={{ gap: 4 }}>
            {item.options.map(option => (
              <AnimatedButton
                key={option.value}
                style={[
                  {
                    height: 48,
                    backgroundColor: Colors.gray[200],
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  },
                  option.value === selectedItem?.value && {
                    backgroundColor: Colors.rose[400],
                  },
                ]}
                scale={0.97}
                onPress={() => onSelectItem(option as ItemOptionType)}
              >
                <Text
                  style={[
                    {
                      marginLeft: 12,
                      width: 40,
                      color: Colors.rose[500],
                      textAlign: "right",
                      fontWeight: "700",
                      fontSize: 18,
                    },
                    option.value === selectedItem?.value && {
                      color: Colors.gray[50],
                    },
                  ]}
                >
                  {toPercent(option.progress)}
                </Text>
                <Text
                  style={[
                    {
                      marginLeft: 12,
                      color: Colors.gray[700],
                    },
                    option.value === selectedItem?.value && {
                      color: Colors.gray[50],
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </AnimatedButton>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

function ModalHandle() {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.gray[500],
          borderRadius: 100,
          height: 4,
          width: 60,
        }}
      />
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    input: {
      backgroundColor: Colors.gray[300],
      height: "100%",
      width: "100%",
      borderRadius: 18,
    },
    inputText: {
      top: 14,
      left: 18,
      fontSize: 16,
      color: Colors.gray[500],
    },
  })
