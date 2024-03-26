import { useEffect } from "react"
import PlusIcon from "@/assets/icons/plus.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { Link } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { Dream, Goal, GroupedItems, ItemType, Task } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import useEditItem from "../itemModal/hooks/useEditItem"

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

  return (
    <>
      {groupedItems && sortedItems && !isListEmpty ? (
        <View>SOMETHING</View>
      ) : (
        // <motion.ul key={`list_${itemType}`} className="space-y-3 sm:pb-32">
        //   {sortedItems.map((groupKey, groupIdx) => {
        //     const parentLabel = groupedItems[groupKey].parentLabel
        //     const items = groupedItems[groupKey].items

        //     if (groupIdx - 1 >= 0) {
        //       const prevKey = Object.keys(groupedItems)[groupIdx - 1]
        //       totalIndex += groupedItems[prevKey].items.length
        //     }

        //     return (
        //       <motion.li key={`group_${groupKey}`}>
        //         {parentLabel && (
        //           <motion.div
        //             layout
        //             className="mb-2 ml-3 font-medium text-gray-500"
        //             initial={{ opacity: 0 }}
        //             animate={{ opacity: 1 }}
        //             transition={{ duration: 1 }}
        //           >
        //             {parentLabel}
        //           </motion.div>
        //         )}
        //         {items?.length && (
        //           <motion.ul className="space-y-3">
        //             {items.map((item, itemIdx) => (
        //               <Item<T>
        //                 idx={totalIndex + itemIdx}
        //                 key={`${groupKey}_${itemType}_${item.itemID}`}
        //                 item={item}
        //                 itemType={itemType}
        //               />
        //             ))}
        //           </motion.ul>
        //         )}
        //       </motion.li>
        //     )
        //   })}
        // </motion.ul>
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
                color={isDark ? Colors.gray[200] : Colors.gray[400]}
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
      )}
    </>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    emptyLabel: {
      textAlign: "center",
      fontSize: 16,
      color: Colors.gray[400],
    },
    addNewLabel: {
      color: isDark ? Colors.gray[200] : Colors.gray[400],
      fontSize: 16,
      fontWeight: "600",
    },
    addNewIcon: {
      width: 15,
      height: 15,
      marginTop: 2,
    },
  })
