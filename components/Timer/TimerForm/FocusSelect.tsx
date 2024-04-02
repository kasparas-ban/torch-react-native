import React, { useRef } from "react"
import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { getItemsByType } from "@/api-endpoints/utils/helpers"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import TextTicker from "react-native-text-ticker"
import { ItemOptionType, ItemType } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { toPercent } from "@/utils/utils"
import { BottomModal } from "@/components/SelectModal/BottomModal"

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
        value: "9bax1usfu113",
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
        value: "9bax1usfu123",
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
        value: "9bax1usfu111",
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

const MOCK_ALL = [
  {
    label: "Make a Figma design sketch",
    value: "15ax1usfu2uk",
    type: "TASK" as ItemType,
    progress: 0.893,
    timeSpent: 90000,
    containsTasks: false,
    duration: 100800,
    parent: "4bax1usfu2uk",
  },
  {
    label: "Code MVP frontend",
    value: "16ax1usfu2uk",
    type: "TASK" as ItemType,
    progress: 0.59,
    timeSpent: 85001,
    containsTasks: false,
    duration: 144000,
    parent: "4bax1usfu2uk",
  },
  {
    label: "Make MVP backend",
    value: "17ax1usfu2uk",
    type: "TASK" as ItemType,
    progress: 0.37,
    timeSpent: 40000,
    containsTasks: false,
    duration: 108000,
    parent: "4bax1usfu2uk",
  },
  {
    label: "Learn common Spanish greeting phrases",
    value: "18ax1usfu2uk",
    type: "TASK" as ItemType,
    progress: 0.222,
    timeSpent: 8000,
    containsTasks: false,
    duration: 36000,
    parent: "6bax1usfu2uk",
  },
  {
    label: "Memorize a list of essential words",
    value: "19ax1usfu2uk",
    type: "TASK" as ItemType,
    progress: 0.028,
    timeSpent: 1000,
    containsTasks: false,
    duration: 36000,
    parent: "6bax1usfu2uk",
  },
  {
    label: "Learn Spanish pronunciation",
    value: "20ax1usfu2uk",
    type: "TASK" as ItemType,
    progress: 0.833,
    timeSpent: 30000,
    containsTasks: false,
    duration: 36000,
    parent: "6bax1usfu2uk",
  },
  {
    label: "Do weight lifting",
    value: "21ax1usfu2uk",
    type: "TASK" as ItemType,
    progress: 0,
    timeSpent: 0,
    containsTasks: false,
    parent: "10ax1usfu2uk",
  },
  {
    label: "Make a todo/timer app",
    value: "4bax1usfu2uk",
    type: "GOAL" as ItemType,
    progress: 0.609,
    timeSpent: 0,
    totalTimeSpent: 215001,
    containsTasks: true,
    duration: 352800,
  },
  {
    label: "Learn chess",
    value: "5bax1usfu2uk",
    type: "GOAL" as ItemType,
    progress: 0,
    timeSpent: 0,
    totalTimeSpent: 0,
    containsTasks: false,
    duration: 0,
  },
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
  {
    label: 'Read "Demons" by Dostoevsky',
    value: "13ax1usfu2uk",
    type: "GOAL" as ItemType,
    progress: 0,
    timeSpent: 0,
    totalTimeSpent: 0,
    containsTasks: false,
    duration: 0,
  },
  {
    label: 'Read "The Shape of Space"',
    value: "14ax1usfu2uk",
    type: "GOAL" as ItemType,
    progress: 0,
    timeSpent: 0,
    totalTimeSpent: 0,
    containsTasks: false,
    duration: 0,
  },
  {
    label: "Learn Spanish",
    value: "1ax1usfu2uku",
    type: "DREAM" as ItemType,
    progress: 0.361,
    timeSpent: 0,
    totalTimeSpent: 39000,
    containsTasks: false,
  },
  {
    label: "Get fit",
    value: "2ax1usfu2uku",
    type: "DREAM" as ItemType,
    progress: 0,
    timeSpent: 0,
    totalTimeSpent: 0,
    containsTasks: false,
  },
  {
    label: "Get good at math",
    value: "3ax1usfu2uku",
    type: "DREAM" as ItemType,
    progress: 0,
    timeSpent: 0,
    totalTimeSpent: 0,
    containsTasks: false,
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const openSelectModal = () => bottomSheetModalRef.current?.present()

  const { styles, isDark } = useThemeStyles(componentStyles)

  const timerState = useTimerStore.use.timerState()
  const { focusOn, setFocusOn, focusType, setFocusType } = useTimerForm()
  const { data } = useItemsList()

  const isGrouped = focusType === "TASKS" || focusType === "GOALS"
  const items = getItemsByType({
    itemData: data,
    focusType,
    grouped: isGrouped,
  })

  return (
    <View>
      <Text
        style={{
          marginLeft: 12,
          marginBottom: 4,
          color: isDark ? Colors.gray[400] : Colors.gray[500],
        }}
      >
        Focus on
      </Text>
      <View style={{ height: 50, right: 0, left: 0 }}>
        <AnimatedButton
          scale={0.98}
          style={styles.input}
          onPress={openSelectModal}
        >
          <View
            style={{
              justifyContent: "center",
              height: "100%",
              marginLeft: 18,
              marginRight: 48,
            }}
          >
            <TextTicker
              style={[
                styles.inputText,
                focusOn && {
                  color: isDark ? Colors.gray[200] : Colors.gray[700],
                  fontWeight: "600",
                },
              ]}
              duration={6000}
              repeatSpacer={50}
              marqueeDelay={1500}
              loop
              bounce={false}
            >
              {focusOn?.label ?? "Select..."}
            </TextTicker>
          </View>
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
                color={isDark ? Colors.gray[400] : Colors.gray[500]}
                style={{ width: 28, height: 28 }}
              />
            </AnimatedButton>
          )}
        </AnimatedButton>

        <BottomModal
          modalRef={bottomSheetModalRef}
          snapPoints={["90%"]}
          onChange={idx => idx === -1}
        >
          <ScrollView
            style={{
              paddingHorizontal: 24,
              paddingVertical: 24,
              height: "100%",
            }}
          >
            <View style={{ paddingBottom: 68 }}>
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
                  isDark={isDark}
                />
              ) : (
                <SingleItems
                  items={MOCK_ALL}
                  selectedItem={focusOn}
                  onSelectItem={setFocusOn}
                  isDark={isDark}
                />
              )}
            </View>
          </ScrollView>
        </BottomModal>
      </View>
    </View>
  )
}

function GroupedItems({
  items,
  selectedItem,
  onSelectItem,
  isDark,
}: {
  items: GroupedItem[]
  selectedItem: ItemOptionType | null
  onSelectItem: (focus: ItemOptionType | null) => void
  isDark: boolean
}) {
  return (
    <View style={{ gap: 4 }}>
      {items.map(item => (
        <View key={item.value}>
          <Text
            style={{
              fontWeight: "600",
              color: isDark ? Colors.gray[400] : Colors.gray[500],
              marginBottom: 6,
              marginLeft: 12,
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
                    backgroundColor: isDark
                      ? Colors.gray[600]
                      : Colors.gray[200],
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingRight: 12,
                  },
                  option.value === selectedItem?.value && {
                    backgroundColor: Colors.rose[400],
                  },
                ]}
                scale={0.99}
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
                      marginRight: 12,
                    },
                    option.value === selectedItem?.value && {
                      color: Colors.gray[50],
                    },
                  ]}
                >
                  {toPercent(option.progress)}
                </Text>
                <TextTicker
                  style={[
                    { color: isDark ? Colors.gray[300] : Colors.gray[700] },
                    option.value === selectedItem?.value && {
                      color: Colors.gray[50],
                      fontWeight: "600",
                    },
                  ]}
                  duration={6000}
                  repeatSpacer={50}
                  marqueeDelay={1500}
                  loop
                  bounce={false}
                >
                  {option.label}
                </TextTicker>
              </AnimatedButton>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

function SingleItems({
  items,
  selectedItem,
  onSelectItem,
  isDark,
}: {
  items: ItemOptionType[]
  selectedItem: ItemOptionType | null
  onSelectItem: (focus: ItemOptionType | null) => void
  isDark: boolean
}) {
  return (
    <View style={{ gap: 4 }}>
      {items.map(option => (
        <AnimatedButton
          key={option.value}
          style={[
            {
              height: 48,
              backgroundColor: isDark ? Colors.gray[600] : Colors.gray[200],
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
            },
            option.value === selectedItem?.value && {
              backgroundColor: Colors.rose[400],
            },
          ]}
          scale={0.99}
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
                color: isDark ? Colors.gray[300] : Colors.gray[700],
              },
              option.value === selectedItem?.value && {
                color: Colors.gray[50],
                fontWeight: "600",
              },
            ]}
          >
            {option.label}
          </Text>
        </AnimatedButton>
      ))}
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    input: {
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[300],
      height: "100%",
      width: "100%",
      borderRadius: 18,
    },
    inputText: {
      fontSize: 16,
      color: isDark ? Colors.gray[400] : Colors.gray[500],
    },
  })
