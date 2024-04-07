import AddItemIcon from "@/assets/icons/add_item.svg"
import ArrowIcon from "@/assets/icons/chevronRight.svg"
import DeleteIcon from "@/assets/icons/delete.svg"
import EditIcon from "@/assets/icons/edit.svg"
import StatsIcon from "@/assets/icons/stats.svg"
import TickIcon from "@/assets/icons/tick.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { AnimatedButton } from "@/components/AnimatedButton"

import useEditItem from "../itemModal/hooks/useEditItem"

type CardProps = {
  setCard: React.Dispatch<React.SetStateAction<"DONE" | "REMOVE" | undefined>>
}

export default function EditCard({ setCard }: CardProps) {
  const { styles } = useThemeStyles(componentStyles)
  const { editItem, setEditItem } = useEditItem()

  const handleEdit = () => {
    if (editItem?.type === "TASK") {
      router.replace("/(modals)/(items)/add-task")
    }
    if (editItem?.type === "GOAL") {
      router.replace("/(modals)/(items)/add-goal")
    }
    if (editItem?.type === "DREAM") {
      router.replace("/(modals)/(items)/add-dream")
    }
  }

  const handleAddSubitem = () => {
    const parentID = editItem?.itemID
    if (!parentID) return

    setEditItem(undefined)

    if (editItem?.type === "GOAL") {
      router.replace({
        pathname: "/(modals)/(items)/add-task",
        params: { parentID },
      })
    }
    if (editItem?.type === "DREAM") {
      router.replace({
        pathname: "/(modals)/(items)/add-goal",
        params: { parentID },
      })
    }
  }

  return (
    <Animated.View
      entering={FadeIn(0.9)}
      exiting={FadeOut(0.9)}
      style={{
        alignItems: "center",
        maxWidth: 240,
        width: "100%",
        backgroundColor: "white",
        paddingVertical: 4,
        paddingHorizontal: 20,
        borderRadius: 14,
      }}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 12,
            gap: 8,
          }}
          scale={0.98}
          onPress={() => setCard("DONE")}
        >
          <TickIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Done</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>

        <View style={styles.separator} />

        {(editItem?.type === "GOAL" || editItem?.type === "DREAM") && (
          <AnimatedButton
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: 8,
              paddingVertical: 12,
            }}
            scale={0.98}
            onPress={handleAddSubitem}
          >
            <AddItemIcon color={Colors.gray[800]} style={styles.editIcon} />
            <Text style={styles.editlabel}>
              {editItem?.type === "GOAL" ? "Add task" : "Add goal"}
            </Text>
            <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
          </AnimatedButton>
        )}

        {/* <View style={styles.separator} />

        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            paddingVertical: 12,
          }}
          scale={1}
        >
          <StatsIcon color={Colors.gray[300]} style={styles.editIcon} />
          <Text style={[styles.editlabel, { color: Colors.gray[300] }]}>
            Stats
          </Text>
          <ArrowIcon color={Colors.gray[300]} style={styles.arrowIcon} />
        </AnimatedButton> */}

        <View style={styles.separator} />

        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            paddingVertical: 12,
          }}
          scale={0.98}
          onPress={handleEdit}
        >
          <EditIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Edit</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>

        <View style={styles.separator} />

        <AnimatedButton
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 8,
            paddingVertical: 12,
          }}
          scale={0.98}
          onPress={() => setCard("REMOVE")}
        >
          <DeleteIcon color={Colors.gray[800]} style={styles.editIcon} />
          <Text style={styles.editlabel}>Remove</Text>
          <ArrowIcon color={Colors.gray[800]} style={styles.arrowIcon} />
        </AnimatedButton>
      </View>
    </Animated.View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.gray[700],
      textAlign: "center",
    },
    progress: {
      fontSize: 42,
      color: Colors.rose[500],
      fontWeight: "900",
    },
    editlabel: {
      color: Colors.gray[800],
      fontSize: 13,
      flexGrow: 1,
    },
    arrowIcon: {
      marginTop: 2,
      width: 20,
      height: 20,
    },
    editIcon: {
      width: 20,
      height: 20,
    },
    separator: {
      backgroundColor: Colors.gray[500],
      height: StyleSheet.hairlineWidth,
      width: "100%",
    },
  })
