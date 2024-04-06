import { useUpdateItemStatus } from "@/api-endpoints/hooks/items/useUpdateItemStatus"
import InfoIcon from "@/assets/icons/info.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import useEditItem from "../itemModal/hooks/useEditItem"

const selectOptions = {
  TASK: {
    info: "This task will be marked as completed and its progress will be locked. Its information will remain and you will be able to bring it back to an active status.",
    description: "The task will be hidden and its progress locked.",
  },
  GOAL: {
    info: "This goal and all associated tasks will be marked as completed and their progress will be locked. Their information will remain and you will be able to bring them back to an active status.",
    description:
      "All associated tasks with the goal are marked as completed as well.",
  },
  DREAM: {
    info: "This dream and all associated goals and tasks will be marked as completed and their progress will be locked. Their information will remain and you will be able to bring them back to an active status.",
    description:
      "All associated goals and tasks with the dream are marked as completed as well.",
  },
}

export default function DoneCard() {
  const { styles } = useThemeStyles(componentStyles)

  // const { toast } = useToast()
  const { editItem, setEditItem } = useEditItem()

  const itemType = editItem?.type
  const { mutateAsync: updateStatus, isPending } = useUpdateItemStatus()

  const handleSubmit = () => {
    if (!editItem) return

    updateStatus({
      itemID: editItem.itemID,
      status: "COMPLETED",
      updateAssociated: true,
      itemType: editItem.type,
    })
      .then(() => {
        // closeModal()
        setEditItem(undefined)
        // toast({
        //   title: `Marked ${editItem.type.toLowerCase()} as completed`,
        //   description: selectOptions[editItem.type].description,
        // })
      })
      .catch(() => {
        // toast({
        //   title: `Failed to mark ${editItem.type.toLowerCase()} as completed`,
        //   description: "Try to repeat the action later.",
        // })
      })
  }

  return (
    <Animated.View
      entering={FadeIn(0.9)}
      exiting={FadeOut(0.9)}
      style={{
        alignItems: "center",
        maxWidth: 340,
        width: "100%",
        backgroundColor: "white",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 14,
      }}
    >
      <Text style={styles.title}>{`Mark ${
        editItem?.type.toLowerCase() ?? ""
      } as complete?`}</Text>

      {itemType && (
        <View style={styles.section}>
          <InfoIcon
            color={Colors.amber[400]}
            style={{ width: 28, height: 28 }}
          />
          <Text style={styles.sectionText}>{selectOptions[itemType].info}</Text>
        </View>
      )}

      <AnimatedButton style={styles.confirmBtn} scale={0.96}>
        <Text style={styles.confirmLabel}>Complete</Text>
      </AnimatedButton>
    </Animated.View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    title: {
      fontFamily: "GabaritoSemibold",
      color: Colors.gray[700],
      fontSize: 20,
      textAlign: "center",
      marginBottom: 12,
    },
    section: {
      borderRadius: 8,
      backgroundColor: Colors.gray[200],
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    sectionText: {
      color: Colors.gray[600],
      textAlign: "justify",
    },
    confirmBtn: {
      borderRadius: 8,
      width: 100,
      paddingVertical: 8,
      alignItems: "center",
      backgroundColor: Colors.gray[700],
      marginTop: 12,
    },
    confirmLabel: {
      fontWeight: "700",
      color: Colors.gray[100],
    },
  })
