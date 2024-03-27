import DotsIcon from "@/assets/icons/dots.svg"
import Colors from "@/constants/Colors"
import { useRouter } from "expo-router"
import { Text, View } from "react-native"
import {
  GeneralItem,
  Goal,
  ItemOptionType,
  ItemType,
  Task,
} from "@/types/itemTypes"
import { toPercent } from "@/utils/utils"
import { AnimatedButton } from "@/components/AnimatedButton"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import useTimerForm from "@/components/Timer/hooks/useTimerForm"

import {
  getStripBgColor,
  getStripBorderColor,
  getStripDotsColor,
  getStripPercentageColor,
  getStripTextColor,
} from "./itemStripColors"

function ItemStrip<T extends GeneralItem>({
  item,
  itemType,
  toggleSublist,
  itemSublist,
  showEditPanel,
  toggleEditClick,
}: {
  item: T
  itemType: ItemType
  toggleSublist?: () => void
  itemSublist?: GeneralItem[]
  showEditPanel: boolean
  toggleEditClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}) {
  const { editItem, setEditItem } = useEditItem()
  const router = useRouter()
  const { setFocusOn, setFocusType } = useTimerForm()

  const containsSublist = !!itemSublist?.length
  const isActive = item.status === "ACTIVE"

  const handleTimerClick = () => {
    const itemOption: ItemOptionType = {
      value: item.itemID,
      label: item.title,
      type: item.type,
      progress: item.progress,
      timeSpent: item.timeSpent,
      duration: (editItem as Task).duration ?? undefined,
      containsTasks: !!(editItem as Goal).tasks?.length,
    }

    setFocusType(
      itemType === "TASK"
        ? "TASKS"
        : itemType === "GOAL"
          ? "GOALS"
          : itemType === "DREAM"
            ? "DREAMS"
            : "ALL"
    )
    setFocusOn(itemOption)
    router.push("/(tabs)/timer")
  }

  const handleStripClick = () => {
    const itemInEdit =
      item.itemID === editItem?.itemID && item.type === editItem?.type
    if (itemInEdit) {
      setEditItem(undefined)
    } else if (!editItem && toggleSublist) {
      toggleSublist()
    }
  }

  const stripBgColor = getStripBgColor(!!editItem, showEditPanel, item.status)
  const stripTextColor = getStripTextColor(isActive)
  const stripBorderColor = getStripBorderColor(isActive)
  const stripDotsColor = getStripDotsColor(
    !!editItem,
    showEditPanel,
    item.status
  )
  const stripPercentageColor = getStripPercentageColor(
    !!editItem,
    showEditPanel,
    item.status
  )

  return (
    <View
      //   className={cn("relative flex w-full min-w-0", containsSublist && "mb-3")}
      //   whileTap={{ scale: itemSublist ? (showEditPanel ? 1 : 0.98) : 1 }}
      style={[
        { zIndex: itemSublist?.length },
        containsSublist && { marginBottom: 12 },
      ]}
    >
      <AnimatedButton
        // layout
        onPress={handleStripClick}
        // className={cn(
        //   "relative flex w-full cursor-pointer items-center overflow-hidden rounded-2xl border pl-6 pr-1 md:rounded-3xl",
        //   stripBgColor,
        //   stripBorderColor
        // )}
        scale={0.97}
        style={[
          {
            flexDirection: "row",
            backgroundColor: stripBgColor,
            borderWidth: 1,
            borderRadius: 16,
            borderColor: stripBorderColor,
            paddingLeft: 18,
            paddingRight: 4,
          },
        ]}
      >
        {/* <ItemProgress
          progress={item.progress || 0}
          showEditPanel={showEditPanel}
          isActive={isActive}
        /> */}
        <Text
          //   className={cn("z-10 select-none truncate py-3", stripTextColor)}
          style={{ paddingVertical: 14, flexGrow: 1, color: stripTextColor }}
        >
          {item.title}
        </Text>
        <View
          // className="z-0 ml-auto flex shrink-0 items-center justify-center pl-2 lg:pr-2"
          style={{ justifyContent: "center", paddingLeft: 4, paddingRight: 4 }}
        >
          <Text
            // layout
            // className={cn(
            //   "relative top-[-2px] shrink-0 text-2xl font-bold",
            //   stripPercentageColor
            // )}
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: stripPercentageColor,
            }}
          >
            {item.status === "COMPLETED" ? "100%" : toPercent(item.progress)}
          </Text>
        </View>
        <AnimatedButton
          //   className={cn(
          //     "group z-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          //     stripDotsColor
          //   )}
          //   onClick={toggleEditClick}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            // layout
            // className={cn(
            //   "group-hover:text-gray-800",
            //   isActive ? "text-gray-600" : "text-gray-400",
            //   stripDotsColor
            // )}
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 30,
              width: 30,
              borderRadius: 100,
            }}
          >
            <DotsIcon
              style={{
                width: 26,
                height: 26,
              }}
              color={isActive ? Colors.gray[500] : Colors.gray[400]}
            />
          </View>
        </AnimatedButton>
      </AnimatedButton>
      {/* <AnimatePresence>
        {showEditPanel && item.status === "ACTIVE" && (
          <motion.div
            className="my-auto ml-3 aspect-square w-12 cursor-pointer rounded-full bg-red-400"
            whileHover={{ scale: 1.1 }}
            onClick={handleTimerClick}
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{ width: 48, opacity: 1, marginLeft: 12 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
          >
            <TimerIcon className="m-auto flex h-full w-6" alt="Timer icon" />
          </motion.div>
        )}
      </AnimatePresence> */}
    </View>
  )
}

// function RecurringItemStrip({
//   item,
//   showEditPanel,
//   toggleEditClick,
// }: {
//   item: Task
//   showEditPanel: boolean
//   toggleEditClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
// }) {
//   const { editItem, setEditItem } = useEditItem()

//   const isDesktop = useMediaQuery({
//     query: "(min-width: 600px)",
//   })

//   const isActive = item.status === "ACTIVE"
//   const itemProgress = item.recurring
//     ? (item.recurring?.progress || 0) / item.recurring?.times
//     : 0

//   const handleStripClick = () => {
//     const itemInEdit =
//       item.itemID === editItem?.itemID && item.type === editItem?.type
//     if (itemInEdit) setEditItem(undefined)
//   }

//   const stripBgColor = getStripBgColor(
//     !!editItem,
//     showEditPanel,
//     item.status,
//     true
//   )
//   const stripTextColor = getStripTextColor(isActive)
//   const stripBorderColor = getStripBorderColor(isActive)
//   const stripDotsColor = getStripDotsColor(
//     !!editItem,
//     showEditPanel,
//     item.status,
//     true
//   )
//   const stripPercentageColor = getStripPercentageColor(
//     !!editItem,
//     showEditPanel,
//     item.status,
//     true
//   )

//   return (
//     <motion.div
//       layout
//       className="flex w-full min-w-0"
//       onClick={handleStripClick}
//     >
//       <motion.div
//         layout
//         className={cn(
//           "relative flex w-full cursor-pointer items-center overflow-hidden rounded-2xl border pl-6 pr-1 md:rounded-3xl",
//           stripBgColor,
//           stripBorderColor
//         )}
//       >
//         {item.status !== "COMPLETED" && (
//           <ItemProgress
//             progress={itemProgress}
//             showEditPanel={showEditPanel}
//             isActive={isActive}
//             isRecurring
//           />
//         )}
//         <motion.div className="z-10 flex min-w-0 flex-col py-1">
//           <div className={cn("select-none truncate", stripTextColor)}>
//             {item.title}
//           </div>
//           <div
//             className={cn(
//               "truncate text-xs text-gray-700",
//               isActive ? "text-gray-700" : "text-gray-400"
//             )}
//           >
//             {isActive ? "Resets tomorrow" : "Repeats every week"}
//           </div>
//         </motion.div>
//         <div className="z-0 ml-auto flex shrink-0 items-center justify-center pl-2">
//           <motion.div
//             layout
//             className={cn(
//               "relative top-[-2px] shrink-0 text-2xl font-bold tracking-wider sm:tracking-widest",
//               stripPercentageColor
//             )}
//           >
//             {item.recurring?.progress || 0}/{item.recurring?.times}
//           </motion.div>
//         </div>
//         <div
//           className={cn(
//             "group z-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
//             stripDotsColor
//           )}
//           onClick={toggleEditClick}
//         >
//           <motion.div
//             layout
//             className="text-gray-600 group-hover:text-gray-800"
//           >
//             <DotsIcon className="h-6 w-6" />
//           </motion.div>
//         </div>
//       </motion.div>
//       {isActive && (
//         <AnimatePresence>
//           {showEditPanel && (
//             <motion.div
//               key="add_recurring"
//               className="my-auto flex aspect-square cursor-pointer items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-gray-700"
//               whileHover={{ scale: 1.1 }}
//               initial={{ width: 0, opacity: 0, marginLeft: 0 }}
//               animate={{
//                 width: isDesktop ? 48 : 64,
//                 opacity: 1,
//                 marginLeft: isDesktop ? 12 : 6,
//               }}
//               exit={{ width: 0, opacity: 0, marginLeft: 0 }}
//             >
//               -1
//             </motion.div>
//           )}
//           {showEditPanel && (
//             <motion.div
//               key="subtract_recurring"
//               className="my-auto flex aspect-square cursor-pointer items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-gray-700"
//               whileHover={{ scale: 1.1 }}
//               initial={{ width: 0, opacity: 0, marginLeft: 0 }}
//               animate={{
//                 width: isDesktop ? 48 : 64,
//                 opacity: 1,
//                 marginLeft: isDesktop ? 12 : 6,
//               }}
//               exit={{ width: 0, opacity: 0, marginLeft: 0 }}
//             >
//               +1
//             </motion.div>
//           )}
//         </AnimatePresence>
//       )}
//     </motion.div>
//   )
// }

export { ItemStrip }
// export { ItemStrip, RecurringItemStrip }
