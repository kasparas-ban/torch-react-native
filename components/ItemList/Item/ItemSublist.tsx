import React, { Fragment, useCallback, useEffect } from "react"
import { useItemsList } from "@/api-endpoints/hooks/items/useItemsList"
import { findItemByID } from "@/api-endpoints/utils/helpers"
import { View } from "react-native"
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { GeneralItem } from "@/types/itemTypes"
import useEditItem from "@/components/itemModal/hooks/useEditItem"

import { ItemStrip } from "./ItemStrip"

export default function ItemSublist({
  parentID,
  subitems,
  subitemType,
  showSublist,
  isParentEditActive,
  isParentArchived,
}: {
  parentID: string
  subitems: GeneralItem[]
  subitemType: "TASK" | "GOAL"
  showSublist: boolean
  isParentEditActive: boolean
  isParentArchived: boolean
}) {
  const { data } = useItemsList()
  const { editItem, setEditItem } = useEditItem()

  const showEditPanel = (subitem: GeneralItem) =>
    subitem.type === editItem?.type && subitem.itemID === editItem?.itemID

  const toggleEditClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    subitem: GeneralItem
  ) => {
    e.stopPropagation()
    const formattedItem = findItemByID(subitem.itemID, data)
    setEditItem(showEditPanel(subitem) ? undefined : formattedItem)
  }

  const isRecurring = (item: GeneralItem) => !!item.recurring

  const animVal = useSharedValue(0)

  const getAnimatedStyles = useCallback(
    (idx: number) =>
      useAnimatedStyle(() => {
        return {
          opacity: idx > 1 ? 1 - animVal.value : 1,
          transform: [
            { scale: 1 - 0.04 * animVal.value - 0.03 * idx * animVal.value },
            {
              translateY:
                12 * (1 - animVal.value) + animVal.value * (-43 + -61 * idx),
            },
          ],
        }
      }),
    []
  )

  useEffect(() => {
    animVal.value = withSpring(showSublist ? 0 : 1, {
      duration: 300,
    })
  }, [showSublist])

  return (
    <Animated.View
      style={{
        gap: 12,
        height: showSublist ? "auto" : 0,
        marginBottom: 12,
      }}
      // layout={LinearTransition}s
    >
      {subitems.map((subitem, idx) => (
        <Fragment key={`${parentID}_${subitem.itemID}`}>
          <Animated.View
            layout={LinearTransition}
            // entering={FadeIn(0.8)}
            // exiting={FadeOut(0.8)}
            // layout
            // className="relative flex"
            // animate={{
            //   scale: showSublist ? 1 : 0.98 - 0.03 * idx,
            //   width:
            //     !showSublist && isParentEditActive && !isParentArchived
            //       ? scaledWidth
            //       : "100%",
            //   y: showSublist ? 0 : -(56 + 50 * idx + 8 * idx),
            //   zIndex: showSublist ? 0 : subitems.length - 1 - idx,
            //   opacity: showSublist ? 1 : idx > 1 ? 0 : 1,
            // }}
            style={[
              {
                position: "relative",
                minHeight: 48,

                width:
                  !showSublist && isParentEditActive && !isParentArchived
                    ? "80%"
                    : "100%",
                zIndex: subitems.length - 1 - idx,
              },
              getAnimatedStyles(idx),
            ]}
          >
            {/* <BulletPoint
              idx={idx}
              showSublist={showSublist}
              showEditPanel={showEditPanel}
              subitems={subitems}
            /> */}
            {isRecurring(subitem) ? (
              //   <RecurringItemStrip
              //     item={subitem as Task}
              //     showEditPanel={showEditPanel(subitem)}
              //     toggleEditClick={e => toggleEditClick(e, subitem)}
              //   />
              <View />
            ) : (
              <ItemStrip
                item={subitem}
                itemType={subitemType}
                showEditPanel={showEditPanel(subitem)}
                toggleEditClick={(
                  e: React.MouseEvent<HTMLDivElement, MouseEvent>
                ) => toggleEditClick(e, subitem)}
              />
            )}
          </Animated.View>
          {/* <AnimatePresence initial={false}>
            {showEditPanel(subitem) && (
              <EditPanel idx={idx} subitem={subitem} subitems={subitems} />
            )}
          </AnimatePresence> */}
        </Fragment>
      ))}
    </Animated.View>
  )
}

// function EditPanel({
//   idx,
//   subitem,
//   subitems,
// }: {
//   idx: number
//   subitem: GeneralItem
//   subitems: GeneralItem[]
// }) {
//   const Panel =
//     subitem.status === "ARCHIVED" ? ArchivedItemEditPanel : ItemEditPanel

//   return (
//     <Panel
//       key={`task_${subitem.itemID}_edit_panel`}
//       item={subitem}
//       showBulletLine={idx !== subitems.length - 1}
//     />
//   )
// }

// function BulletPoint({
//   idx,
//   showSublist,
//   subitems,
// }: {
//   idx: number
//   showSublist: boolean
//   showEditPanel: (subitem: GeneralItem) => boolean
//   subitems: GeneralItem[]
// }) {
//   const { editItem } = useEditItem()
//   const currentItem = subitems[idx]
//   const isRecurring = (currentItem as Task).recurring

//   const editItemActive =
//     editItem?.type === currentItem.type &&
//     editItem?.itemID === currentItem.itemID

//   const bulletColor = editItem
//     ? editItemActive && isRecurring
//       ? "bg-amber-200"
//       : "bg-gray-300"
//     : isRecurring
//       ? "bg-amber-200"
//       : "bg-gray-300"

//   return (
//     <motion.div
//       className="relative mr-3 flex"
//       animate={{
//         width: showSublist ? "auto" : 0,
//         opacity: showSublist ? 1 : 0,
//       }}
//       transition={{ duration: 0.1 }}
//     >
//       <div
//         className={cn(
//           "relative z-10 my-auto aspect-square w-4 rounded-full",
//           bulletColor
//         )}
//       ></div>
//       {isRecurring && (
//         <div className="absolute left-[-4px] top-[13px] z-[15] text-gray-500">
//           <RotateCw />
//         </div>
//       )}
//       {/* Upper line */}
//       {idx !== 0 && (
//         <motion.div className="h0 absolute left-[6px] h-1/2 w-1 bg-gray-300" />
//       )}
//       {/* Lower line */}
//       {idx !== subitems.length - 1 && (
//         <motion.div className="h0 absolute left-[6px] h-3/4 w-1 translate-y-3/4 bg-gray-300" />
//       )}
//     </motion.div>
//   )
// }
