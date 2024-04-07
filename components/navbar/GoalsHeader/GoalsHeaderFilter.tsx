import { FadeIn, FadeOut } from "@/constants/Animations"
import Colors from "@/constants/Colors"
import { StyleSheet, Text, View } from "react-native"
import Animated from "react-native-reanimated"
import useThemeStyles, { ThemeStylesProps } from "@/utils/themeStyles"
import { rgbToRGBA } from "@/utils/utils"
import useItemListConfig from "@/components/ItemList/hooks/useItemListConfig"
import ToggleButton from "@/components/UI/ToggleButton"

export function ListFilterSection({ showFilters }: { showFilters: boolean }) {
  const { styles } = useThemeStyles(componentStyles)

  const showCompletedItems = useItemListConfig.use.showCompletedItems()
  const setShowCompletedItems = useItemListConfig.use.setShowCompletedItems()
  const showArchivedItems = useItemListConfig.use.showArchivedItems()
  const setShowArchivedItems = useItemListConfig.use.setShowArchivedItems()

  const handleCompleteToggle = (pressed: boolean) =>
    setShowCompletedItems(pressed)

  const handleArchiveToggle = (pressed: boolean) =>
    setShowArchivedItems(pressed)

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
          <Text style={styles.sectionTitle}>Filters:</Text>
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
    sectionTitle: {
      color: isDark ? rgbToRGBA(Colors.slate[200], 0.8) : Colors.gray[400],
      fontSize: 14,
      fontWeight: "700",
    },
    filterOption: {
      borderRadius: 10,
      paddingVertical: 4,
      paddingHorizontal: 12,
      backgroundColor: isDark ? Colors.gray[600] : Colors.gray[200],
    },
    selectedOption: {
      backgroundColor: Colors.rose[400],
    },
    optionLabel: {
      fontWeight: "500",
      color: isDark ? Colors.gray[200] : Colors.gray[500],
    },
    selectedOptionLabel: {
      color: "white",
    },
  })
