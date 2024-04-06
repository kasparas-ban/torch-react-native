import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import useItemListConfig from "@/components/ItemList/hooks/useItemListConfig"
import useEditItem from "@/components/itemModal/hooks/useEditItem"
import ToggleButton from "@/components/UI/ToggleButton"

export function ListFilterSection({ showFilters }: { showFilters: boolean }) {
  const { styles } = useThemeStyles(componentStyles)

  const showCompletedItems = useItemListConfig.use.showCompletedItems()
  const setShowCompletedItems = useItemListConfig.use.setShowCompletedItems()
  const showArchivedItems = useItemListConfig.use.showArchivedItems()
  const setShowArchivedItems = useItemListConfig.use.setShowArchivedItems()
  const { setEditItem } = useEditItem()

  const handleCompleteToggle = (pressed: boolean) => {
    setEditItem(undefined)
    setShowCompletedItems(pressed)
  }

  const handleArchiveToggle = (pressed: boolean) => {
    setEditItem(undefined)
    setShowArchivedItems(pressed)
  }

  return (
    <>
      {showFilters && (
        <Animated.View
          style={{
            position: "absolute",
            left: 24,
            bottom: -38,
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
          entering={FadeIn(0.9)}
          exiting={FadeOut(0.9)}
        >
          <Text
            style={{ color: Colors.gray[400], fontSize: 14, fontWeight: "700" }}
          >
            Filters:
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <ToggleButton
              scale={0.98}
              defaultValue={showCompletedItems}
              onChange={handleCompleteToggle}
              style={[
                styles.filterOption,
                showCompletedItems && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionLabel,
                  showCompletedItems && styles.selectedOptionLabel,
                ]}
              >
                Show completed
              </Text>
            </ToggleButton>
            <ToggleButton
              scale={0.98}
              defaultValue={showArchivedItems}
              onChange={handleArchiveToggle}
              style={[
                styles.filterOption,
                showArchivedItems && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.optionLabel,
                  showArchivedItems && styles.selectedOptionLabel,
                ]}
              >
                Show archived
              </Text>
            </ToggleButton>
          </View>
        </Animated.View>
      )}
    </>
  )
}

const componentStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    filterOption: {
      borderRadius: 10,
      paddingVertical: 4,
      paddingHorizontal: 12,
      backgroundColor: Colors.gray[200],
    },
    selectedOption: {
      backgroundColor: Colors.rose[400],
    },
    optionLabel: {
      fontWeight: "700",
      color: Colors.gray[400],
    },
    selectedOptionLabel: {
      color: Colors.gray[100],
    },
  })
