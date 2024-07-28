import InfoIcon from "@/assets/icons/info.svg"
import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import useItems from "@/stores/itemStore"
import { router } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"
import useEditItem from "../itemModal/hooks/useEditItem"
import { notify } from "../notifications/Notifications"
import useTimerForm from "../Timer/hooks/useTimerForm"

export default function ActiveCard() {
  const { styles, isDark } = useThemeStyles(componentStyles)
  const { editItem, setEditItem } = useEditItem()

  const itemType = editItem?.item_type
  const { updateItemStatus } = useItems()
  const { setFocusOn } = useTimerForm()

  const handleSubmit = () => {
    if (!editItem) return

    updateItemStatus({
      item_id: editItem.item_id,
      status: "ACTIVE",
      updateAssociated: false,
      itemType: editItem.item_type,
    })
    router.back()
    setEditItem(undefined)
    setFocusOn(null)

    notify({
      title: `Made ${editItem.item_type.toLowerCase()} active`,
      description: `You can start working on the ${editItem.item_type.toLowerCase()} again.`,
    })
  }

  return (
    <Animated.View
      entering={FadeIn(0.9)}
      exiting={FadeOut(0.9)}
      style={styles.card}
    >
      <Text style={styles.title}>{`Make ${
        editItem?.item_type.toLowerCase() ?? ""
      } active again?`}</Text>

      {itemType && (
        <View style={styles.section}>
          <InfoIcon
            color={isDark ? Colors.amber[500] : Colors.amber[400]}
            style={{ width: 28, height: 28 }}
          />
          <Text
            style={styles.sectionText}
          >{`This ${editItem.item_type.toLowerCase()} will be made active and you will be able to contribute to its progress again.`}</Text>
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

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    card: {
      alignItems: "center",
      maxWidth: 340,
      width: "100%",
      backgroundColor: isDark ? Colors.gray[600] : "white",
      paddingVertical: 12,
      paddingHorizontal: 30,
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
      backgroundColor: isDark ? Colors.rose[500] : Colors.gray[700],
      marginTop: 12,
    },
    confirmLabel: {
      fontWeight: "700",
      color: Colors.gray[100],
    },
  })
