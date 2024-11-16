import { memo, ReactNode, useCallback } from "react"
import Colors from "@/constants/Colors"
import { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { AnimatedStyle } from "react-native-reanimated"
import { SelectOptionExtended } from "@/types/generalTypes"
import useThemeStyles, {
  NamedStyles,
  ThemeStylesProps,
} from "@/utils/themeStyles"

import { AnimatedButton } from "../AnimatedButton"

type ListItemProps<T> = {
  item: SelectOptionExtended<T>
  styles: StyleProp<any>
  onPress: (item: SelectOptionExtended<T>) => void
  isSelected: boolean
  iconParam?: ReactNode
}

export default function ToggleGroup<T>({
  title,
  options,
  selected,
  onChange,
  containerStyle,
  iconParam,
  isVirtualized = false,
}: {
  title?: string
  options: SelectOptionExtended<T>[]
  selected?: T
  onChange: (val: T) => void
  containerStyle?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
  iconParam?: string | ReactNode
  isVirtualized: boolean
}) {
  const { styles } = useThemeStyles(groupStyles)

  const handlePress = useCallback((item: SelectOptionExtended<T>) => {
    onChange(item.value)
  }, [])

  const isOptionsEmpty = !options.length

  return (
    <View style={styles.wrapper}>
      {title && <Text style={styles.title}>{title}</Text>}

      {isVirtualized ? (
        isOptionsEmpty ? (
          <Text style={styles.noOptionsLabel}>No options</Text>
        ) : (
          <BottomSheetVirtualizedList
            data={options}
            keyExtractor={(item: SelectOptionExtended<T>) => item.value as any}
            getItemCount={data => data.length}
            getItem={(data, index) => data[index]}
            renderItem={({ item }) => (
              <ListItemMemo
                item={item}
                styles={styles}
                onPress={handlePress}
                isSelected={selected === item.value}
                iconParam={iconParam}
              />
            )}
            contentContainerStyle={containerStyle}
          />
        )
      ) : (
        <>
          {isOptionsEmpty ? (
            <Text style={styles.noOptionsLabel}>No options</Text>
          ) : (
            options.map((option, idx) => (
              <AnimatedButton
                key={idx}
                style={[
                  styles.optionWrapper,
                  selected === option.value && styles.activeOption,
                ]}
                onPress={() => onChange(option.value)}
                scale={0.99}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    selected === option.value && styles.activeLabel,
                  ]}
                >
                  {option.label}
                </Text>
              </AnimatedButton>
            ))
          )}
        </>
      )}
    </View>
  )
}

function ListItem<T>({ item, styles, onPress, isSelected }: ListItemProps<T>) {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 4 }}>
      <AnimatedButton
        style={[
          styles.optionWrapper,
          isSelected && styles.activeOption,
          {
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-start",
          },
        ]}
        onPress={() => onPress(item)}
        scale={0.99}
      >
        {item.icon && <ItemIcon icon={item.icon} />}
        <Text style={[styles.optionLabel, isSelected && styles.activeLabel]}>
          {item.label}
        </Text>
      </AnimatedButton>
    </View>
  )
}

const genericMemo: <T>(component: T) => T = memo
const ListItemMemo = genericMemo(ListItem)

function ItemIcon({ icon }: { icon: string | ReactNode }) {
  if (typeof icon === "string") {
    return <Text style={{ marginLeft: 16 }}>{icon}</Text>
  }
  return <View style={{ marginLeft: 16 }}>{icon}</View>
}

const groupStyles = ({ isDark }: ThemeStylesProps) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      gap: 6,
    },
    title: {
      color: isDark ? Colors.gray[300] : Colors.gray[600],
      height: 32,
      fontSize: 20,
      fontWeight: "700",
    },
    optionWrapper: {
      height: 44,
      width: "100%",
      backgroundColor: isDark ? Colors.gray[700] : Colors.gray[100],
      borderRadius: 8,
      display: "flex",
      justifyContent: "center",
    },
    optionLabel: {
      marginLeft: 20,
      color: isDark ? Colors.gray[400] : Colors.gray[700],
      fontWeight: "500",
    },
    activeOption: {
      backgroundColor: isDark ? Colors.rose[500] : Colors.rose[400],
      borderWidth: 1,
      borderColor: isDark ? Colors.rose[500] : Colors.rose[300],
    },
    activeLabel: {
      color: Colors.gray[50],
    },
    noOptionsLabel: {
      textAlign: "center",
      textAlignVertical: "center",
      height: 62,
      fontSize: 16,
      fontStyle: "italic",
      color: Colors.gray[500],
    },
  })
