import React, { useRef } from "react"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { findFormattedItem } from "@/stores/helpers"
import useItems from "@/stores/itemStore"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import TextTicker from "react-native-text-ticker"
import { FormattedItem, ItemOptionType } from "@/types/itemTypes"
import { getItemsByType } from "@/api/utils/helpers"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { toPercent } from "@/utils/utils"
import { BottomModal } from "@/components/SelectModal/BottomModal"

import { AnimatedButton } from "../../../AnimatedButton"
import ToggleSelect from "../../../UI/ToggleSelect"
import useTimerForm, { FocusType } from "../../hooks/useTimerForm"

type GroupedItem = {
  label: string
  value: string
  options?: ItemOptionType[]
}

const focusTypeOptions = [
  { label: "Tasks", value: "TASKS" },
  { label: "Goals", value: "GOALS" },
  { label: "Dreams", value: "DREAMS" },
  { label: "All", value: "ALL" },
] satisfies { label: string; value: FocusType }[]

const emptyListLabelOptions = {
  TASKS: "No tasks found",
  GOALS: "No goals found",
  DREAMS: "No dreams found",
  ALL: "No work items found",
}

export default function FocusItemSelect() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const openSelectModal = () => bottomSheetModalRef.current?.present()

  const { styles, isDark } = useThemeStyles(componentStyles)

  const { focusItemId, setFocusOn, focusType, setFocusType } = useTimerForm()
  const { allItems } = useItems()

  const focusItem = findFormattedItem(allItems, focusItemId)

  const isGrouped = focusType === "TASKS" || focusType === "GOALS"
  const items = getItemsByType({
    itemData: allItems,
    focusType,
    grouped: isGrouped,
  })

  const emptyListLabel = emptyListLabelOptions[focusType]

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
                focusItemId && {
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
              {focusItem?.title ?? "Select..."}
            </TextTicker>
          </View>
          {focusItem && (
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
          snapPoints={["30%", "90%"]}
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
                  items={items}
                  selectedItem={focusItem}
                  onSelectItem={setFocusOn}
                  isDark={isDark}
                />
              ) : (
                <SingleItems
                  items={items as any}
                  selectedItem={focusItem}
                  onSelectItem={setFocusOn}
                  isDark={isDark}
                />
              )}

              {!items.length && (
                <View style={{ paddingVertical: 28 }}>
                  <Text
                    style={{
                      alignSelf: "center",
                      color: isDark ? Colors.gray[400] : Colors.gray[500],
                    }}
                  >
                    {emptyListLabel}
                  </Text>
                </View>
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
  selectedItem?: FormattedItem
  onSelectItem: (focusItemId: string | null) => void
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
            {item.options?.map(option => (
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
                  option.value === selectedItem?.item_id && {
                    backgroundColor: Colors.rose[400],
                  },
                ]}
                scale={0.99}
                onPress={() => onSelectItem(option.value)}
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
                    option.value === selectedItem?.item_id && {
                      color: Colors.gray[50],
                    },
                  ]}
                >
                  {toPercent(option.progress)}
                </Text>
                <TextTicker
                  style={[
                    { color: isDark ? Colors.gray[300] : Colors.gray[700] },
                    option.value === selectedItem?.item_id && {
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
  selectedItem?: FormattedItem
  onSelectItem: (focusItemId: string | null) => void
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
            option.value === selectedItem?.item_id && {
              backgroundColor: Colors.rose[400],
            },
          ]}
          scale={0.99}
          onPress={() => onSelectItem(option.value)}
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
              option.value === selectedItem?.item_id && {
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
              option.value === selectedItem?.item_id && {
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
