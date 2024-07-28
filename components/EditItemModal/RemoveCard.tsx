import { useState } from "react"
import InfoIcon from "@/assets/icons/info.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import useItems from "@/stores/itemStore"
import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import { ItemType } from "@/types/itemTypes"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { capitalize } from "@/utils/utils"

import { AnimatedButton } from "../AnimatedButton"
import useEditItem from "../itemModal/hooks/useEditItem"
import { notify } from "../notifications/Notifications"
import useTimerForm from "../Timer/hooks/useTimerForm"

const selectOptions = {
  TASK: {
    info: {
      archive:
        "This task will be archived and its progress will be locked. Its information will remain and you will be able to bring it back to an active status.",
      delete:
        "This task will be deleted with no way to bring it back. The time spent working towards it will be saved to your account.",
    },
  },
  GOAL: {
    oneSelection: {
      title: "Goal only",
      description: {
        archive: "Archive goal only",
        delete: "Delete goal only",
      },
    },
    allSelection: {
      title: "Goal + tasks",
      description: {
        archive: "Archive goal and all associated tasks",
        delete: "Delete goal and all associated tasks",
      },
    },
    info: {
      one: {
        archive:
          "This goal will be archived and its progress will be locked. Its information will remain and you will be able to bring it back to an active status.",
        delete:
          "This goal will be deleted with no way to bring it back. The time spent working towards it will be saved to your account.",
      },
      all: {
        archive:
          "This goal and all associated tasks will be archived and their progress will be locked. Their information will remain and you will be able to bring them back to an active status.",
        delete:
          "This goal and all associated tasks will be deleted with no way to bring them back. The time spent working towards them will be saved to your account.",
      },
    },
  },
  DREAM: {
    oneSelection: {
      title: "Dream only",
      description: {
        archive: "Archive dream only",
        delete: "Delete dream only",
      },
    },
    allSelection: {
      title: "All associated",
      description: {
        archive: "Archive dream and all associated goals and tasks",
        delete: "Delete dream and all associated goals and tasks",
      },
    },
    info: {
      one: {
        archive:
          "This dream will be archived and its progress will be locked. Its information will remain and you will be able to bring it back to an active status.",
        delete:
          "This dream will be deleted with no way to bring it back. The time spent working towards it will be saved to your account.",
      },
      all: {
        archive:
          "This dream and all associated goals and tasks will be archived and their progress will be locked. Their information will remain and you will be able to bring them back to an active status.",
        delete:
          "This dream and all associated goals and tasks will be deleted with no way to bring them back. The time spent working towards them will be saved to your account.",
      },
    },
  },
} as const

type ActionType = "archive" | "delete"
type SelectionType = "one" | "all"

export default function RemoveCard() {
  const { styles, isDark } = useThemeStyles(componentStyles)
  const { editItem, setEditItem } = useEditItem()

  const [action, setAction] = useState<ActionType>(
    editItem?.status === "ARCHIVED" ? "delete" : "archive"
  )
  const [selItems, setSelItems] = useState<SelectionType>("one")

  const { setFocusOn } = useTimerForm()
  const { updateItemStatus, deleteItem } = useItems()

  const itemType = editItem?.item_type
  const isArchived = editItem?.status === "ARCHIVED"

  const handleSubmit = () => {
    if (!editItem) return

    if (action === "archive") {
      updateItemStatus({
        item_id: editItem.item_id,
        status: "ARCHIVED",
        updateAssociated: selItems === "all",
        itemType: editItem.item_type,
      })
      router.back()
      setEditItem(undefined)
      setFocusOn(null)

      notify({
        title: `${capitalize(editItem.item_type)} archived`,
        description: `It will be removed from the ${editItem.item_type.toLowerCase()} list.`,
      })
    } else {
      deleteItem({
        item_id: editItem.item_id,
        deleteAssociated: selItems === "all",
      })
      router.back()
      setEditItem(undefined)
      setFocusOn(null)

      notify({
        title: `${capitalize(editItem.item_type)} deleted`,
        description: `It will be removed from the ${editItem.item_type.toLowerCase()} list.`,
      })
    }
  }

  return (
    <Animated.View
      entering={FadeIn(0.9)}
      exiting={FadeOut(0.9)}
      style={styles.card}
    >
      <Text style={styles.title}>{`Remove ${
        editItem?.item_type.toLowerCase() ?? ""
      }`}</Text>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: isDark ? Colors.slate[500] : Colors.slate[200],
          borderRadius: 8,
          padding: 4,
          marginBottom: 8,
          gap: 8,
        }}
      >
        {!isArchived && (
          <AnimatedButton
            style={[
              {
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 6,
                gap: 2,
                justifyContent: "center",
                flex: 1,
              },
              action === "archive" && styles.activeSelection,
            ]}
            scale={0.97}
            onPress={() => setAction("archive")}
          >
            <Text
              style={[
                {
                  color: isDark ? Colors.gray[300] : Colors.gray[500],
                  fontSize: 16,
                  fontWeight: "700",
                },
                action === "archive" && styles.activeSelectionText,
              ]}
            >
              Archive
            </Text>
            <Text
              style={[
                {
                  color: isDark ? Colors.gray[100] : Colors.gray[500],
                  fontSize: 12,
                  fontWeight: "500",
                },
                action === "archive" && isDark && { color: Colors.slate[500] },
              ]}
            >
              Locks & hides the {itemType?.toLowerCase()}
            </Text>
          </AnimatedButton>
        )}

        <AnimatedButton
          style={[
            {
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 6,
              gap: 2,
              justifyContent: "center",
              flex: 1,
            },
            action === "delete" && styles.activeSelection,
          ]}
          scale={isArchived ? 1 : 0.97}
          onPress={() => setAction("delete")}
        >
          <Text
            style={[
              {
                color: isDark ? Colors.gray[300] : Colors.gray[500],
                fontSize: 16,
                fontWeight: "700",
              },
              action === "delete" && styles.activeSelectionText,
            ]}
          >
            Delete
          </Text>
          <Text
            style={[
              {
                color: isDark ? Colors.gray[100] : Colors.gray[500],
                fontSize: 12,
                fontWeight: "500",
              },
              action === "delete" && isDark && { color: Colors.slate[500] },
            ]}
          >
            Deletes all info
          </Text>
        </AnimatedButton>
      </View>

      {itemType && itemType !== "TASK" && (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: isDark ? Colors.slate[500] : Colors.slate[200],
            borderRadius: 8,
            alignSelf: "stretch",
            padding: 4,
            gap: 8,
          }}
        >
          <AnimatedButton
            style={[
              {
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 6,
                gap: 2,
                justifyContent: "center",
                flex: 1,
              },
              selItems === "one" && styles.activeSelection,
            ]}
            scale={0.97}
            onPress={() => setSelItems("one")}
          >
            <Text
              style={[
                {
                  color: isDark ? Colors.gray[300] : Colors.gray[500],
                  fontSize: 16,
                  fontWeight: "700",
                },
                selItems === "one" && styles.activeSelectionText,
              ]}
            >
              {selectOptions[itemType].oneSelection.title}
            </Text>
            <Text
              style={[
                {
                  color: isDark ? Colors.gray[100] : Colors.gray[500],
                  fontSize: 12,
                  fontWeight: "500",
                },
                selItems === "one" && isDark && { color: Colors.slate[500] },
              ]}
            >
              {selectOptions[itemType].oneSelection.description[action]}
            </Text>
          </AnimatedButton>
          <AnimatedButton
            style={[
              {
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 6,
                gap: 2,
                justifyContent: "center",
                flex: 1,
              },
              selItems === "all" && styles.activeSelection,
            ]}
            scale={0.97}
            onPress={() => setSelItems("all")}
          >
            <Text
              style={[
                {
                  color: isDark ? Colors.gray[300] : Colors.gray[500],
                  fontSize: 16,
                  fontWeight: "700",
                },
                selItems === "all" && styles.activeSelectionText,
              ]}
            >
              {selectOptions[itemType].allSelection.title}
            </Text>
            <Text
              style={[
                {
                  color: isDark ? Colors.gray[100] : Colors.gray[500],
                  fontSize: 12,
                  fontWeight: "500",
                },
                selItems === "all" && isDark && { color: Colors.slate[500] },
              ]}
            >
              {selectOptions[itemType].allSelection.description[action]}
            </Text>
          </AnimatedButton>
        </View>
      )}

      {itemType && (
        <View style={styles.section}>
          <View style={{ width: 30 }}>
            <InfoIcon
              color={isDark ? Colors.amber[500] : Colors.amber[400]}
              style={{ width: 28, height: 28 }}
            />
          </View>
          <Text style={styles.sectionText}>
            {getInfoText(itemType, action, selItems)}
          </Text>
        </View>
      )}

      <AnimatedButton
        style={styles.confirmBtn}
        scale={0.96}
        onPress={handleSubmit}
      >
        <Text style={styles.confirmLabel}>Confirm</Text>
      </AnimatedButton>
    </Animated.View>
  )
}

function getInfoText(
  itemType: ItemType,
  action: ActionType,
  selItems: SelectionType
) {
  if (itemType === "TASK") {
    return selectOptions.TASK.info[action]
  }
  if (itemType === "GOAL") {
    return selectOptions.GOAL.info[selItems][action]
  }
  return selectOptions.DREAM.info[selItems][action]
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    card: {
      alignItems: "center",
      maxWidth: 340,
      width: "auto",
      backgroundColor: isDark ? Colors.gray[600] : "white",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 14,
      ...(isDark && {
        borderWidth: 1,
        borderColor: Colors.gray[500],
      }),
    },
    title: {
      fontFamily: "GabaritoSemibold",
      color: isDark ? Colors.gray[100] : Colors.gray[700],
      fontSize: 20,
      textAlign: "center",
      marginBottom: 12,
    },
    section: {
      marginTop: 8,
      borderRadius: 8,
      backgroundColor: Colors.slate[200],
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      display: "flex",
      position: "relative",
    },
    sectionText: {
      color: Colors.gray[600],
      textAlign: "justify",
      position: "relative",
      flexShrink: 1,
    },
    activeSelection: {
      backgroundColor: isDark ? Colors.gray[200] : "white",
    },
    activeSelectionText: {
      color: isDark ? Colors.gray[600] : Colors.gray[800],
    },
    confirmBtn: {
      borderRadius: 8,
      width: 100,
      paddingVertical: 8,
      alignItems: "center",
      backgroundColor: isDark ? Colors.rose[500] : Colors.gray[700],
      marginTop: 12,
    },
    confirmLabel: {
      fontWeight: "700",
      color: Colors.gray[100],
    },
  })
