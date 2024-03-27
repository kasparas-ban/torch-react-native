import { useEffect } from "react"
import PlusIcon from "@/assets/icons/plus.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { Link } from "expo-router"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { Dream, Goal, GroupedItems, ItemType, Task } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import useEditItem from "../itemModal/hooks/useEditItem"
import Item from "./Item/Item"

export default function ItemsList<T extends Task | Goal | Dream>({
  groupedItems,
  itemType,
}: {
  groupedItems?: GroupedItems<T>
  itemType: ItemType
}) {
  const { styles, isDark } = useThemeStyles(componentStyles)
  const { setEditItem } = useEditItem()

  const addItemHref =
    itemType === "TASK"
      ? "/(modals)/(items)/add-task"
      : itemType === "GOAL"
        ? "/(modals)/(items)/add-goal"
        : "/(modals)/(items)/add-dream"

  let totalIndex = 0

  const isListEmpty = Object.values(groupedItems || {}).reduce(
    (prev, group) => prev && !group.items.length,
    true
  )

  const sortedItems = groupedItems
    ? Object.keys(groupedItems).sort((a, b) => {
        if (a === "other") return 1
        if (b === "other") return -1
        return 0
      })
    : undefined

  useEffect(() => () => setEditItem(undefined), [setEditItem])

  return groupedItems && sortedItems && !isListEmpty ? (
    <ScrollView
      style={{
        width: "100%",
        height: "100%",
        paddingHorizontal: 14,
      }}
    >
      <View style={{ paddingTop: 140, paddingBottom: 160 }}>
        {sortedItems.map((groupKey, groupIdx) => {
          if (!groupedItems) return null

          const parentLabel = groupedItems[groupKey].parentLabel
          const items = groupedItems[groupKey].items

          if (groupIdx - 1 >= 0) {
            const prevKey = Object.keys(groupedItems)[groupIdx - 1]
            totalIndex += groupedItems[prevKey].items.length
          }

          return (
            <View key={`group_${groupKey}`}>
              {parentLabel && (
                <Text style={styles.itemParentLabel}>{parentLabel}</Text>
              )}
              {items?.length && (
                <View style={{ gap: 12, marginBottom: 12 }}>
                  {items.map((item, itemIdx) => (
                    <Item<T>
                      idx={totalIndex + itemIdx}
                      key={`${groupKey}_${itemType}_${item.itemID}`}
                      item={item}
                      itemType={itemType}
                    />
                  ))}
                </View>
              )}
            </View>
          )
        })}
      </View>
    </ScrollView>
  ) : (
    <Animated.View
      entering={FadeIn(0.9)}
      exiting={FadeOut(0.9)}
      style={{
        gap: 20,
        alignItems: "center",
      }}
    >
      <Text style={styles.emptyLabel}>
        No {itemType.toLowerCase()}s have been added.
      </Text>

      <Link href={addItemHref} asChild>
        <AnimatedButton
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
          scale={0.95}
        >
          <PlusIcon
            color={isDark ? Colors.gray[200] : Colors.gray[600]}
            style={styles.addNewIcon}
            strokeWidth={3}
          />
          <Text style={styles.addNewLabel}>
            Add new{" "}
            {itemType === "TASK"
              ? "task"
              : itemType === "GOAL"
                ? "goal"
                : "dream"}
          </Text>
        </AnimatedButton>
      </Link>
    </Animated.View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    emptyLabel: {
      textAlign: "center",
      fontSize: 16,
      color: Colors.gray[500],
    },
    addNewLabel: {
      color: isDark ? Colors.gray[200] : Colors.gray[600],
      fontSize: 16,
      fontWeight: "600",
    },
    addNewIcon: {
      width: 15,
      height: 15,
      marginTop: 2,
    },
    itemParentLabel: {
      marginBottom: 8,
      marginLeft: 12,
      fontWeight: "600",
      color: isDark ? Colors.gray[500] : Colors.gray[500],
    },
  })
