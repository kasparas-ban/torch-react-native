import DotsIcon from "@/assets/icons/dots.svg"
import Colors from "@/constants/Colors"
import { useRouter } from "expo-router"
import { GestureResponderEvent, Text, View } from "react-native"
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
  getStripPercentageColor,
  getStripTextColor,
} from "./itemStripColors"
import ItemProgress from "./ProgressBar"

function ItemStrip<T extends GeneralItem>({
  item,
  itemType,
  toggleSublist,
  itemSublist,
  showEditPanel,
  toggleEditClick,
  disableClick,
}: {
  item: T
  itemType: ItemType
  toggleSublist?: () => void
  itemSublist?: GeneralItem[]
  showEditPanel: boolean
  toggleEditClick: (e: GestureResponderEvent) => void
  disableClick?: boolean
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

  const stripPercentageColor = getStripPercentageColor(
    !!editItem,
    showEditPanel,
    item.status
  )

  return (
    <View
      //   className={cn("relative flex w-full min-w-0", containsSublist && "mb-3")}
      //   whileTap={{ scale: itemSublist ? (showEditPanel ? 1 : 0.98) : 1 }}
      style={[{ zIndex: itemSublist?.length, maxHeight: 48 }]}
    >
      <AnimatedButton
        onPress={() => !disableClick && handleStripClick()}
        scale={disableClick ? 1 : 0.97}
        opacity={1}
        style={{
          flexDirection: "row",
          backgroundColor: stripBgColor,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: stripBorderColor,
          paddingLeft: 18,
          paddingRight: 4,
          overflow: "hidden",
        }}
      >
        <ItemProgress
          progress={item.progress || 0}
          showEditPanel={showEditPanel}
          isActive={isActive}
        />
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedButton
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
          </AnimatedButton>
        </View>
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

function RecurringItemStrip({
  item,
  showEditPanel,
  toggleEditClick,
  disableClick,
}: {
  item: Task
  showEditPanel: boolean
  toggleEditClick: (e: GestureResponderEvent) => void
  disableClick?: boolean
}) {
  const { editItem, setEditItem } = useEditItem()

  const isActive = item.status === "ACTIVE"
  const itemProgress = item.recurring
    ? (item.recurring?.progress || 0) / item.recurring?.times
    : 0

  const handleStripClick = () => {
    const itemInEdit =
      item.itemID === editItem?.itemID && item.type === editItem?.type
    if (itemInEdit) setEditItem(undefined)
  }

  const stripBgColor = getStripBgColor(
    !!editItem,
    showEditPanel,
    item.status,
    true
  )
  const stripTextColor = getStripTextColor(isActive)
  const stripBorderColor = getStripBorderColor(isActive)

  const stripPercentageColor = getStripPercentageColor(
    !!editItem,
    showEditPanel,
    item.status,
    true
  )

  return (
    <View style={{ maxHeight: 48 }}>
      <AnimatedButton
        style={{
          flexDirection: "row",
          backgroundColor: stripBgColor,
          borderWidth: 1,
          borderRadius: 16,
          borderColor: stripBorderColor,
          paddingLeft: 18,
          paddingRight: 4,
          overflow: "hidden",
        }}
        onPress={handleStripClick}
        scale={disableClick ? 1 : 0.97}
        opacity={1}
      >
        {item.status !== "COMPLETED" && (
          <ItemProgress
            progress={itemProgress}
            showEditPanel={showEditPanel}
            isActive={isActive}
            isRecurring
          />
        )}
        <View style={{ flex: 1, paddingVertical: 6 }}>
          <Text style={{ color: stripTextColor }}>{item.title}</Text>
          <Text
            // className={cn(
            //   "truncate text-xs text-gray-700",
            //   isActive ? "text-gray-700" : "text-gray-400"
            // )}
            style={{ color: Colors.gray[700], fontSize: 12 }}
          >
            {isActive ? "Resets tomorrow" : "Repeats every week"}
          </Text>
        </View>
        <View
          style={{ justifyContent: "center", paddingLeft: 4, paddingRight: 4 }}
        >
          <Text
            style={{
              letterSpacing: 3,
              fontSize: 24,
              fontWeight: "900",
              color: stripPercentageColor,
            }}
          >
            {item.recurring?.progress || 0}/{item.recurring?.times}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AnimatedButton
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
          </AnimatedButton>
        </View>
      </AnimatedButton>
      {/* {isActive && (
        <AnimatePresence>
          {showEditPanel && (
            <motion.div
              key="add_recurring"
              className="my-auto flex aspect-square cursor-pointer items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-gray-700"
              whileHover={{ scale: 1.1 }}
              initial={{ width: 0, opacity: 0, marginLeft: 0 }}
              animate={{
                width: isDesktop ? 48 : 64,
                opacity: 1,
                marginLeft: isDesktop ? 12 : 6,
              }}
              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            >
              -1
            </motion.div>
          )}
          {showEditPanel && (
            <motion.div
              key="subtract_recurring"
              className="my-auto flex aspect-square cursor-pointer items-center justify-center rounded-full bg-amber-400 text-xl font-bold text-gray-700"
              whileHover={{ scale: 1.1 }}
              initial={{ width: 0, opacity: 0, marginLeft: 0 }}
              animate={{
                width: isDesktop ? 48 : 64,
                opacity: 1,
                marginLeft: isDesktop ? 12 : 6,
              }}
              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            >
              +1
            </motion.div>
          )}
        </AnimatePresence>
      )} */}
    </View>
  )
}

export { ItemStrip, RecurringItemStrip }
