import { useEffect } from "react"
import AddItemIcon from "@/assets/icons/add_item.svg"
import DeleteIcon from "@/assets/icons/delete.svg"
import EditIcon from "@/assets/icons/edit.svg"
import StatsIcon from "@/assets/icons/stats.svg"
import TickIcon from "@/assets/icons/tick.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { GeneralItem } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { AnimatedButton } from "@/components/AnimatedButton"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import UnarchiveIcon from "@/public/icons/unarchive.svg"

export function ItemEditPanel<T extends GeneralItem>({
  item,
  sublistVisible,
  showBulletLine,
  showAddTask,
}: {
  item: T
  sublistVisible?: boolean
  showBulletLine?: boolean
  showAddTask?: boolean
}) {
  const { styles } = useThemeStyles(componentStyles)

  const { editItem } = useEditItem()
  //   const { openTaskModal, openGoalModal, openDreamModal } = useItemModal()

  const isArchived = editItem?.status === "ARCHIVED"

  const openEditItemModal = () => {
    // if (item.type === "TASK") {
    //   openTaskModal()
    //   return
    // }
    // if (item.type === "GOAL") {
    //   openGoalModal()
    //   return
    // }
    // openDreamModal()
  }

  const animVal = useSharedValue(0)

  const animStyles = useAnimatedStyle(() => {
    return {
      // marginTop: animVal.value * 12,
      marginBottom: sublistVisible ? animVal.value * 12 : 0,
      height: animVal.value * 30,
    }
  }, [sublistVisible])

  useEffect(() => {
    animVal.value = withTiming(1)

    return () => {
      animVal.value = 0
    }
  }, [])

  return (
    <Animated.View
      //   layout
      //   className="relative flex"
      //   initial={{ marginTop: 0, marginBottom: 0 }}
      //   animate={{
      //     marginTop: 12,
      //     marginBottom: sublistVisible ? 12 : 0,
      //   }}
      //   exit={{ marginTop: 0, marginBottom: 0 }}
      entering={FadeIn(0.8)}
      exiting={FadeOut(0.8)}
      style={[
        {
          marginTop: 12,
          maxWidth: 350,
          width: "100%",
          alignSelf: "center",
        },
        animStyles,
      ]}
    >
      {showBulletLine && (
        <View
        // className="absolute left-[6px] h-[140%] w-1 bg-gray-300"
        />
      )}
      <View
        // layout
        // className={`mx-auto flex ${
        //   showAddTask
        //     ? "w-[360px] max-[500px]:w-full"
        //     : "w-[300px] max-[400px]:px-6 max-[300px]:w-full"
        // } justify-between`}
        // initial={{ height: 0, opacity: 0 }}
        // animate={{
        //   height: "auto",
        //   opacity: 1,
        // }}
        // exit={{ height: 0, opacity: 0 }}
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <AnimatedButton
          // className="flex shrink-0 cursor-pointer select-none flex-col text-sm"
          // whileHover={{ scale: 1.1 }}
          style={{ alignItems: "center" }}
        >
          <TickIcon
            color={Colors.gray[800]}
            style={styles.editIcon}
            // className="mx-auto h-5"
          />
          <Text style={styles.editlabel}>Done</Text>
        </AnimatedButton>

        {showAddTask && (
          <AnimatedButton
            // className="flex shrink-0 cursor-pointer select-none flex-col text-sm"
            // whileHover={{ scale: 1.1 }}
            // onClick={() => openTaskModal(undefined, editItem)}
            style={{ alignItems: "center" }}
          >
            <AddItemIcon
              color={Colors.gray[800]}
              style={styles.editIcon}
              // className="mx-auto h-5"
            />
            <Text style={styles.editlabel}>Add task</Text>
          </AnimatedButton>
        )}

        <AnimatedButton
          // className="flex shrink-0 select-none flex-col text-sm opacity-40"
          // whileHover={{ scale: 1.1 }}
          style={{ alignItems: "center" }}
        >
          <StatsIcon
            color={Colors.gray[800]}
            style={styles.editIcon}
            // className="mx-auto h-5"
          />
          <Text style={styles.editlabel}>Stats</Text>
        </AnimatedButton>

        <AnimatedButton
          // className={cn(
          //   "flex shrink-0 select-none flex-col text-sm",
          //   isArchived ? "opacity-40" : "cursor-pointer"
          // )}
          // whileHover={{ scale: isArchived ? 1 : 1.1 }}
          // onClick={isArchived ? () => null : openEditItemModal}
          style={{ alignItems: "center" }}
        >
          <EditIcon
            // className="mx-auto h-5"
            color={Colors.gray[800]}
            style={styles.editIcon}
          />
          <Text style={styles.editlabel}>Edit</Text>
        </AnimatedButton>

        <AnimatedButton
          // className="flex shrink-0 cursor-pointer select-none flex-col text-sm"
          // whileHover={{ scale: 1.1 }}
          style={{ alignItems: "center" }}
        >
          <DeleteIcon
            // className="mx-auto h-5"
            color={Colors.gray[800]}
            style={styles.editIcon}
          />
          <Text style={styles.editlabel}>Remove</Text>
        </AnimatedButton>
      </View>
    </Animated.View>
  )
}

// export function ArchivedItemEditPanel<T extends GeneralItem>({
//   sublistVisible,
//   showBulletLine,
// }: {
//   sublistVisible?: boolean
//   showBulletLine?: boolean
// }) {
//   return (
//     <motion.div
//       layout
//       className="relative flex"
//       initial={{ marginTop: 0, marginBottom: 0 }}
//       animate={{
//         marginTop: 12,
//         marginBottom: sublistVisible ? 12 : 0,
//       }}
//       exit={{ marginTop: 0, marginBottom: 0 }}
//     >
//       {showBulletLine && (
//         <div className="absolute left-[6px] h-[140%] w-1 bg-gray-300" />
//       )}
//       <motion.div
//         layout
//         className={`mx-auto flex w-[250px] justify-between max-[400px]:px-6 max-[300px]:w-full`}
//         initial={{ height: 0, opacity: 0 }}
//         animate={{
//           height: "auto",
//           opacity: 1,
//         }}
//         exit={{ height: 0, opacity: 0 }}
//       >
//         <UnarchiveItemModal>
//           <motion.div
//             className="flex shrink-0 cursor-pointer select-none flex-col text-sm"
//             whileHover={{ scale: 1.1 }}
//           >
//             <UnarchiveIcon className="mx-auto h-5" />
//             Unarchive
//           </motion.div>
//         </UnarchiveItemModal>
//         <motion.div
//           className="flex shrink-0 select-none flex-col text-sm opacity-40"
//           // whileHover={{ scale: 1.1 }}
//         >
//           <StatsIcon className="mx-auto h-5" />
//           Stats
//         </motion.div>
//         <RemoveItemModal>
//           <motion.div
//             className="flex shrink-0 cursor-pointer select-none flex-col text-sm"
//             whileHover={{ scale: 1.1 }}
//           >
//             <DeleteIcon className="mx-auto h-5" />
//             Remove
//           </motion.div>
//         </RemoveItemModal>
//       </motion.div>
//     </motion.div>
//   )
// }

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    editlabel: {
      color: Colors.gray[800],
      fontSize: 13,
    },
    editIcon: {
      width: 20,
      height: 20,
    },
  })
