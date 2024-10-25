import AddItemIcon from "@/assets/icons/add_item.svg"
import ArrowIcon from "@/assets/icons/chevronRight.svg"
import DeleteIcon from "@/assets/icons/delete.svg"
import EditIcon from "@/assets/icons/edit.svg"
import MakeActiveIcon from "@/assets/icons/makeActive.svg"
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
  setCard: React.Dispatch<
    React.SetStateAction<"DONE" | "REMOVE" | "ACTIVE" | undefined>
  >
}

export default function EditItemOptionsCard({ setCard }: CardProps) {
  const { styles, isDark } = useThemeStyles(componentStyles)
  const { editItem, setEditItem } = useEditItem()

  const handleEdit = () => {
    if (editItem?.item_type === "TASK") {
      router.replace("/(modals)/(items)/add-task")
    }
    if (editItem?.item_type === "GOAL") {
      router.replace("/(modals)/(items)/add-goal")
    }
    if (editItem?.item_type === "DREAM") {
      router.replace("/(modals)/(items)/add-dream")
    }
  }

  const handleAddSubitem = () => {
    const parent_id = editItem?.item_id
    if (!parent_id) return

    setEditItem(undefined)

    if (editItem?.item_type === "GOAL") {
      router.replace({
        pathname: "/(modals)/(items)/add-task",
        params: { parent_id },
      })
    }
    if (editItem?.item_type === "DREAM") {
      router.replace({
        pathname: "/(modals)/(items)/add-goal",
        params: { parent_id },
      })
    }
  }

  return (
    <Animated.View
      entering={FadeIn(0.9)}
      exiting={FadeOut(0.9)}
      style={styles.card}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        {editItem?.status === "ACTIVE" && (
          <>
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
              <TickIcon
                color={isDark ? Colors.gray[100] : Colors.gray[800]}
                style={styles.editIcon}
              />
              <Text style={styles.editlabel}>Done</Text>
              <ArrowIcon
                color={isDark ? Colors.gray[100] : Colors.gray[800]}
                style={styles.arrowIcon}
              />
            </AnimatedButton>
            <View style={styles.separator} />
          </>
        )}

        {editItem?.status !== "ACTIVE" && (
          <>
            <AnimatedButton
              style={{
                alignItems: "center",
                flexDirection: "row",
                paddingVertical: 12,
                gap: 8,
              }}
              scale={0.98}
              onPress={() => setCard("ACTIVE")}
            >
              <MakeActiveIcon
                color={isDark ? Colors.gray[100] : Colors.gray[800]}
                style={styles.editIcon}
              />
              <Text style={styles.editlabel}>Make active</Text>
              <ArrowIcon
                color={isDark ? Colors.gray[100] : Colors.gray[800]}
                style={styles.arrowIcon}
              />
            </AnimatedButton>
            <View style={styles.separator} />
          </>
        )}

        {(editItem?.item_type === "GOAL" ||
          editItem?.item_type === "DREAM") && (
          <>
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
              <AddItemIcon
                color={isDark ? Colors.gray[100] : Colors.gray[800]}
                style={styles.editIcon}
              />
              <Text style={styles.editlabel}>
                {editItem?.item_type === "GOAL" ? "Add task" : "Add goal"}
              </Text>
              <ArrowIcon
                color={isDark ? Colors.gray[100] : Colors.gray[800]}
                style={styles.arrowIcon}
              />
            </AnimatedButton>
            <View style={styles.separator} />
          </>
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
          <EditIcon
            color={isDark ? Colors.gray[100] : Colors.gray[800]}
            style={styles.editIcon}
          />
          <Text style={styles.editlabel}>Edit</Text>
          <ArrowIcon
            color={isDark ? Colors.gray[100] : Colors.gray[800]}
            style={styles.arrowIcon}
          />
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
          <DeleteIcon
            color={isDark ? Colors.gray[100] : Colors.gray[800]}
            style={styles.editIcon}
          />
          <Text style={styles.editlabel}>Remove</Text>
          <ArrowIcon
            color={isDark ? Colors.gray[100] : Colors.gray[800]}
            style={styles.arrowIcon}
          />
        </AnimatedButton>
      </View>
    </Animated.View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    card: {
      alignItems: "center",
      maxWidth: 240,
      width: "100%",
      backgroundColor: isDark ? Colors.gray[600] : "white",
      paddingVertical: 4,
      paddingHorizontal: 20,
      borderRadius: 14,
      ...(isDark && {
        borderWidth: 1,
        borderColor: Colors.gray[500],
      }),
    },
    editlabel: {
      color: isDark ? Colors.gray[100] : Colors.gray[800],
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
      backgroundColor: isDark ? Colors.gray[400] : Colors.gray[300],
      // height: StyleSheet.hairlineWidth,
      height: 1,
      width: "100%",
    },
  })
