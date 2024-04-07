import { useState } from "react"
import BackIcon from "@/assets/icons/arrowRight.svg"
import CloseIcon from "@/assets/icons/close.svg"
import Colors from "@/constants/Colors"
import { router } from "expo-router"
import { StyleSheet, View } from "react-native"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { rgbToRGBA } from "@/utils/utils"
import { AnimatedButton } from "@/components/AnimatedButton"
import DoneCard from "@/components/EditItemModal/DoneCard"
import EditItemInfo from "@/components/EditItemModal/EditItemInfo"
import EditItemOptions from "@/components/EditItemModal/EditItemOptions"
import RemoveCard from "@/components/EditItemModal/RemoveCard"
import useEditItem from "@/components/itemModal/hooks/useEditItem"

const CARD_COMPONENTS = {
  DONE: DoneCard,
  REMOVE: RemoveCard,
}

export default function EditItemModal() {
  const { setEditItem } = useEditItem()
  const { styles } = useThemeStyles(componentStyles)
  const [selectedCard, setSelectedCard] = useState<
    keyof typeof CARD_COMPONENTS | undefined
  >()

  const CardComponent = !!selectedCard && CARD_COMPONENTS[selectedCard]

  return (
    <View style={styles.background}>
      <EditItemInfo />

      {!CardComponent && <EditItemOptions setCard={setSelectedCard} />}
      {CardComponent && <CardComponent />}

      <View style={{ flexDirection: "row", gap: 20 }}>
        {selectedCard && (
          <AnimatedButton
            style={styles.navBtn}
            scale={0.96}
            onPress={() => setSelectedCard(undefined)}
          >
            <BackIcon
              color={Colors.gray[700]}
              style={{ width: 30, height: 30 }}
            />
          </AnimatedButton>
        )}
        <AnimatedButton
          style={styles.navBtn}
          scale={0.96}
          onPress={() => {
            setEditItem(undefined)
            router.back()
          }}
        >
          <CloseIcon
            color={Colors.gray[700]}
            style={{ width: 30, height: 30 }}
          />
        </AnimatedButton>
      </View>
    </View>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    background: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: rgbToRGBA(Colors.gray[800], 0.8),
      gap: 16,
    },
    navBtn: {
      backgroundColor: "white",
      borderRadius: 100,
      padding: 8,
    },
  })
